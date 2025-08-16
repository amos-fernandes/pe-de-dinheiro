import json
import requests
from typing import Dict, List
from config import ATCOIN_API_URL, ATCOIN_API_KEY, BINANCE_API_KEY, BINANCE_API_SECRET


from binance.client import Client


# api_key=BINANCE_API_KEY
# api_secret=BINANCE_API_SECRET

# client = Client(api_key, api_secret)

# # Get user account information
# info = client.get_account()


# # Get user ID
# user_id = info['uid']
# balances = client.get_asset_balance(asset='USDT')
# amount = balances



class ATCoinService:
    def __init__(self, binance_service):
        self.api_url = ATCOIN_API_URL
        self.api_key = ATCOIN_API_KEY
        self.binance_service = binance_service

        try:
            #info = self.binance_service.client.get_account()
            self.user_id = "164761607"
        except Exception as e:
            print(f"Erro ao obter user_id da Binance: {e}")
            self.user_id = "ID_NAO_ENCONTRADO"

    def get_portfolio_allocation(self, portfolio_assets: Dict[str, str], total_portfolio_value: float) -> Dict[str, float]:
        """Obtém a alocação de portfólio da API ATCoin."""
        try:
            # Coletar dados históricos para cada ativo do portfólio
            historical_data = {}
            for asset_key, yf_ticker in portfolio_assets.items():
                klines = self.binance_service.get_historical_klines_for_atcoin(yf_ticker)
                if not klines:
                    print(f"Aviso: Não foi possível obter dados históricos para {yf_ticker}. Ignorando este ativo.")
                    continue
                historical_data[asset_key] = klines

            if not historical_data:
                print("Erro: Nenhum dado histórico disponível para enviar à API ATCoin.")
                return {}


            payload = {
                "client_id": str(self.user_id),
                # USE O PARÂMETRO RECEBIDO, NÃO A VARIÁVEL GLOBAL ANTIGA
                "amount": total_portfolio_value,
                "aibank_transaction_token": "At0R6ebAME5rvFAFv2vfdniyamxdjIN3ouw9NcVU0jBuejrMRlpt2070wKwNGOil"
            }
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            print(f"Enviando requisição para a API ATCoin em: {self.api_url}")
            print(json.dumps(payload, indent=2))

            response = requests.post(self.api_url, json=payload, headers=headers)
            response.raise_for_status()

            result = response.json()
            return result.get("recommended_allocation", {})

        except requests.exceptions.RequestException as e:
            print(f"Erro na requisição à API ATCoin: {e}")
            return {}
        except Exception as e:
            print(f"Erro inesperado ao obter alocação da API ATCoin: {e}")
            return {}

