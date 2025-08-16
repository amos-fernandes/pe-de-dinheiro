
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

        # ==================== SEÇÃO CORRIGIDA ====================

        # 1. Obter estado atual da conta Binance
        balances = self.binance.get_account_balance()
        if not balances:
            print("Não foi possível obter o saldo da conta. Abortando ciclo.")
            return

        # 2. Construir a lista de TODOS os símbolos necessários (alvo + atuais)
        target_asset_symbols = [YFINANCE_TO_BINANCE_MAP[yf_ticker] for yf_ticker in PORTFOLIO_ASSETS.values()]
        current_asset_symbols = [f"{asset}/{QUOTE_ASSET}" for asset in balances.keys() if asset != QUOTE_ASSET]

        # Junta as duas listas e remove duplicatas para uma chamada de API limpa
        all_symbols_list = target_asset_symbols + current_asset_symbols
        unique_symbols = list(set(all_symbols_list))

        print(f"Buscando preços para os símbolos: {unique_symbols}")

        # 3. Busca os preços UMA ÚNICA VEZ
        prices = self.binance.get_current_prices(unique_symbols)
        if not prices:
            print("Não foi possível obter os preços dos ativos. Verifique a conexão ou os símbolos. Abortando ciclo.")
            return

        # 4. Calcular o valor total do portfólio em USDT (agora com os preços corretos)
        total_portfolio_value_usd = balances.get(QUOTE_ASSET, 0.0)
        current_allocations = {QUOTE_ASSET: balances.get(QUOTE_ASSET, 0.0)}

        # Itera sobre os ativos que temos para somar seus valores
        for coin, qty in balances.items():
            if coin == QUOTE_ASSET:
                continue

            binance_symbol = f"{coin}/{QUOTE_ASSET}"
            price = prices.get(binance_symbol, 0)
            value_usd = qty * price
            total_portfolio_value_usd += value_usd
            current_allocations[coin] = value_usd

        print(f"Valor Total do Portfólio: ${total_portfolio_value_usd:,.2f}")
        print(f"Alocação Atual (Valor em USD): {current_allocations}")

        # ==================== FIM DA SEÇÃO CORRIGIDA ====================

        # 5. Obter alocação alvo da API ATCoin
        print("\n--- Consultando a IA ATCoin para nova alocação... ---")
        target_allocation_weights = self.atcoin.get_portfolio_allocation(
            PORTFOLIO_ASSETS,
            total_portfolio_value_usd
        )
        if not target_allocation_weights:
            print("Não foi possível obter a alocação da IA. Abortando ciclo.")
            return



        # # 2. Obter alocação alvo da API ATCoin
        # print("\n--- Consultando a IA ATCoin para nova alocação... ---")

        # # PASSE O VALOR CALCULADO AQUI
        # target_allocation_weights = self.atcoin.get_portfolio_allocation(
        #     PORTFOLIO_ASSETS,
        #     total_portfolio_value_usd
        # )

        # if not target_allocation_weights:
        #     print("Não foi possível obter a alocação da IA. Abortando ciclo.")
        #     return


        print(f"Alocação Alvo da IA: {target_allocation_weights}")

        # 3. Calcular ordens necessárias para rebalancear
        print("\n--- Calculando ordens de rebalanceamento... ---")
        orders_to_execute = {'buy': [], 'sell': []}

        for asset_key, weight in target_allocation_weights.items():
            yf_ticker = PORTFOLIO_ASSETS[asset_key]
            binance_symbol = YFINANCE_TO_BINANCE_MAP[yf_ticker]
            coin = binance_symbol.replace(QUOTE_ASSET, '')

            target_value = total_portfolio_value_usd * weight
            current_value = current_allocations.get(coin, 0.0)
            difference = target_value - current_value

            price = prices.get(binance_symbol)
            if not price: continue

            if difference > MIN_ORDER_VALUE_USD: # COMPRAR
                quantity_to_buy = difference / price
                orders_to_execute['buy'].append({'symbol': binance_symbol, 'qty': quantity_to_buy, 'value': difference})
            elif difference < -MIN_ORDER_VALUE_USD: # VENDER
                quantity_to_sell = abs(difference) / price
                orders_to_execute['sell'].append({'symbol': binance_symbol, 'qty': quantity_to_sell, 'value': abs(difference)})

        print(f"Ordens a Executar: {orders_to_execute}")

        # 4. Executar Ordens (PRIMEIRO VENDER, DEPOIS COMPRAR)
        print("\n--- Executando ordens na Binance... ---")
        # Vender
        for order in orders_to_execute['sell']:
            # Obter precisão do ativo para a ordem
            market_info = self.binance.client.market(order['symbol'])
            qty_to_sell_precise = self.binance.client.amount_to_precision(order['symbol'], order['qty'])
            print(f"  VENDENDO {qty_to_sell_precise} de {order['symbol']}...")
            self.binance.create_market_order(order['symbol'], 'sell', qty_to_sell_precise)
            time.sleep(1) # Pequena pausa entre ordens

        # Aguardar um pouco para o saldo USDT ser atualizado
        if orders_to_execute['sell']: time.sleep(5)

        # Comprar
        for order in orders_to_execute['buy']:
            market_info = self.binance.client.market(order['symbol'])
            qty_to_buy_precise = self.binance.client.amount_to_precision(order['symbol'], order['qty'])
            print(f"  COMPRANDO {qty_to_buy_precise} de {order['symbol']}...")
            self.binance.create_market_order(order['symbol'], 'buy', qty_to_buy_precise)
            time.sleep(1)

        print("\nCiclo de Rebalanceamento Concluído.")
        print("="*50 + "\n")



#
