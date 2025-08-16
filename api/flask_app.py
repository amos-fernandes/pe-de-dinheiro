from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from portfolio_manager import PortfolioManager  # json
import time
from datetime import datetime
from typing import Dict

from config import PORTFOLIO_ASSETS, QUOTE_ASSET, YFINANCE_TO_BINANCE_MAP, MIN_ORDER_VALUE_USD
from binance_service import BinanceService
from atcoin_service import ATCoinService

class PortfolioManager:
    def __init__(self):
        self.binance = BinanceService()
        self.atcoin = ATCoinService(self.binance)

    def rebalance_portfolio(self):
        """
        Executa um ciclo completo de rebalanceamento do portfólio.
        """
        print("\n" + "="*50)
        print(f"INICIANDO CICLO DE REBALANCEAMENTO - {datetime.now().isoformat()}")
        print("="*50)

        if not self.binance.is_connected:
            print("Serviço Binance não conectado. Rebalanceamento não pode ser executado.")
            return

        # 1. Obter estado atual da conta Binance
        balances = self.binance.get_account_balance()
        if not balances:
            print("Não foi possível obter o saldo da conta. Abortando ciclo.")
            return

        asset_symbols = [YFINANCE_TO_BINANCE_MAP[yf_ticker] for yf_ticker in PORTFOLIO_ASSETS.values()]
        prices = self.binance.get_current_prices(asset_symbols + [f"{a}/{QUOTE_ASSET}" for a in balances.keys() if a != QUOTE_ASSET])

        # Calcular o valor total do portfólio em USDT
        total_portfolio_value_usd = balances.get(QUOTE_ASSET, 0.0)
        current_allocations = {QUOTE_ASSET: balances.get(QUOTE_ASSET, 0.0)}

        for asset, binance_symbol in YFINANCE_TO_BINANCE_MAP.items():
            coin = binance_symbol.replace(QUOTE_ASSET, "")
            if coin in balances:
                qty = balances[coin]
                price = prices.get(binance_symbol, 0)
                value_usd = qty * price
                total_portfolio_value_usd += value_usd
                current_allocations[coin] = value_usd

        print(f"Valor Total do Portfólio: ${total_portfolio_value_usd:,.2f}")
        print(f"Alocação Atual (Valor em USD): {current_allocations}")

        # 2. Obter alocação alvo da API ATCoin
        print("\n--- Consultando a IA ATCoin para nova alocação... ---")
        target_allocation_weights = self.atcoin.get_portfolio_allocation(PORTFOLIO_ASSETS)
        if not target_allocation_weights:
            print("Não foi possível obter a alocação da IA. Abortando ciclo.")
            return

        print(f"Alocação Alvo da IA: {target_allocation_weights}")

        # 3. Calcular ordens necessárias para rebalancear
        print("\n--- Calculando ordens de rebalanceamento... ---")
        orders_to_execute = {"buy": [], "sell": []}

        for asset_key, weight in target_allocation_weights.items():
            yf_ticker = PORTFOLIO_ASSETS[asset_key]
            binance_symbol = YFINANCE_TO_BINANCE_MAP[yf_ticker]
            coin = binance_symbol.replace(QUOTE_ASSET, "")

            target_value = total_portfolio_value_usd * weight
            current_value = current_allocations.get(coin, 0.0)
            difference = target_value - current_value

            price = prices.get(binance_symbol)
            if not price: continue

            if difference > MIN_ORDER_VALUE_USD: # COMPRAR
                quantity_to_buy = difference / price
                orders_to_execute["buy"].append({"symbol": binance_symbol, "qty": quantity_to_buy, "value": difference})
            elif difference < -MIN_ORDER_VALUE_USD: # VENDER
                quantity_to_sell = abs(difference) / price
                orders_to_execute["sell"].append({"symbol": binance_symbol, "qty": quantity_to_sell, "value": abs(difference)})

        print(f"Ordens a Executar: {orders_to_execute}")

        # 4. Executar Ordens (PRIMEIRO VENDER, DEPOIS COMPRAR)
        print("\n--- Executando ordens na Binance... ---")
        # Vender
        for order in orders_to_execute["sell"]:
            # Obter precisão do ativo para a ordem
            market_info = self.binance.client.market(order["symbol"])
            qty_to_sell_precise = self.binance.client.amount_to_precision(order["symbol"], order["qty"])
            print(f"  VENDENDO {qty_to_sell_precise} de {order['symbol']}...")
            self.binance.create_market_order(order["symbol"], "sell", qty_to_sell_precise)
            time.sleep(1) # Pequena pausa entre ordens

        # Aguardar um pouco para o saldo USDT ser atualizado
        if orders_to_execute["sell"]: time.sleep(5)

        # Comprar
        for order in orders_to_execute["buy"]:
            market_info = self.binance.client.market(order["symbol"])
            qty_to_buy_precise = self.binance.client.amount_to_precision(order["symbol"], order["qty"])
            print(f"  COMPRANDO {qty_to_buy_precise} de {order['symbol']}...")
            self.binance.create_market_order(order["symbol"], "buy", qty_to_buy_precise)
            time.sleep(1)

        print("\nCiclo de Rebalanceamento Concluído.")
        print("="*50 + "\n")
from datetime import datetime
from portfolio_manager import PortfolioManager
from binance_service import BinanceService
from atcoin_service import ATCoinService
from config import PORTFOLIO_ASSETS, QUOTE_ASSET, YFINANCE_TO_BINANCE_MAP

app = Flask(__name__, static_folder='frontend/dist', static_url_path='')
CORS(app)  # Permitir CORS para todas as rotas

# Instanciar os serviços
portfolio_manager = PortfolioManager()

@app.route('/')
def serve_frontend():
    """Serve o frontend React."""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/portfolio/balance', methods=['GET'])
def get_portfolio_balance():
    """Retorna o saldo atual do portfólio."""
    try:
        balances = portfolio_manager.binance.get_account_balance()
        if not balances:
            return jsonify({"error": "Não foi possível obter o saldo da conta"}), 500

        # Obter preços atuais
        asset_symbols = [YFINANCE_TO_BINANCE_MAP[yf_ticker] for yf_ticker in PORTFOLIO_ASSETS.values()]
        prices = portfolio_manager.binance.get_current_prices(asset_symbols)

        # Calcular valor total e alocações
        total_portfolio_value_usd = balances.get(QUOTE_ASSET, 0.0)
        current_allocations = {}

        for asset, binance_symbol in YFINANCE_TO_BINANCE_MAP.items():
            coin = binance_symbol.replace(QUOTE_ASSET, '')
            if coin in balances:
                qty = balances[coin]
                price = prices.get(binance_symbol, 0)
                value_usd = qty * price
                total_portfolio_value_usd += value_usd
                current_allocations[coin] = {
                    'quantity': qty,
                    'price': price,
                    'value_usd': value_usd
                }

        # Adicionar USDT
        current_allocations[QUOTE_ASSET] = {
            'quantity': balances.get(QUOTE_ASSET, 0.0),
            'price': 1.0,
            'value_usd': balances.get(QUOTE_ASSET, 0.0)
        }

        return jsonify({
            "total_value_usd": total_portfolio_value_usd,
            "allocations": current_allocations,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolio/allocation', methods=['GET'])
def get_ai_allocation():
    """Obtém a alocação recomendada pela IA."""
    try:
        target_allocation_weights = portfolio_manager.atcoin.get_portfolio_allocation(PORTFOLIO_ASSETS)
        if not target_allocation_weights:
            return jsonify({"error": "Não foi possível obter a alocação da IA"}), 500

        return jsonify({
            "recommended_allocation": target_allocation_weights,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolio/rebalance', methods=['POST'])
def rebalance_portfolio():
    """Executa o rebalanceamento do portfólio."""
    try:
        # Executar rebalanceamento em uma thread separada para não bloquear a resposta
        import threading

        def run_rebalance():
            portfolio_manager.rebalance_portfolio()

        thread = threading.Thread(target=run_rebalance)
        thread.start()

        return jsonify({
            "message": "Rebalanceamento iniciado",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolio/status', methods=['GET'])
def get_portfolio_status():
    """Retorna o status geral do portfólio."""
    try:
        # Obter saldo atual
        balances = portfolio_manager.binance.get_account_balance()

        # Obter alocação recomendada
        target_allocation = portfolio_manager.atcoin.get_portfolio_allocation(PORTFOLIO_ASSETS)

        # Obter preços atuais
        asset_symbols = [YFINANCE_TO_BINANCE_MAP[yf_ticker] for yf_ticker in PORTFOLIO_ASSETS.values()]
        prices = portfolio_manager.binance.get_current_prices(asset_symbols)

        return jsonify({
            "balances": balances,
            "target_allocation": target_allocation,
            "current_prices": prices,
            "portfolio_assets": PORTFOLIO_ASSETS,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint de verificação de saúde da API."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })




@app.route('/api/callbacks/ia_result', methods=['POST'])
def ia_callback_handler():
    """
    Este endpoint é chamado pela IA quando a alocação está pronta.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400

        print(f"Callback recebido da IA! Dados: {data}")

        target_allocation = data.get("recommended_allocation")
        if not target_allocation:
            print("Callback da IA não continha 'recommended_allocation'. Abortando.")
            return jsonify({"error": "Missing 'recommended_allocation' in callback"}), 400

        # Agora que temos a alocação, precisamos EXECUTAR as ordens.
        # Precisamos de uma nova função no PortfolioManager para isso.

        # O rebalanceamento precisa ser feito em background para não travar o callback
        import threading
        thread = threading.Thread(target=portfolio_manager.execute_orders_from_allocation, args=(target_allocation,))
        thread.start()

        return jsonify({"status": "callback_received", "message": "Rebalancing execution started"}), 200

    except Exception as e:
        print(f"Erro ao processar callback da IA: {e}")
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

