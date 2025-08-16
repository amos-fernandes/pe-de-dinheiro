# bia/config.py
import os
from dotenv import load_dotenv

load_dotenv() # Carrega variáveis de um arquivo .env

# --- Configuração da API ATCoin ---
#ATCOIN_API_URL = os.environ.get("ATCOIN_API_URL", "https://huggingface.co/spaces/amos-fernandes/crypto-model-prod/api/invest") # Mude para a URL do seu HF Space
#ATCOIN_API_URL = os.environ.get("ATCOIN_API_URL", "https://amos-fernandes-nina-cry.hf.space/api/invest")
ATCOIN_API_URL = os.environ.get("ATCOIN_API_URL", "http://localhost:7860/api/invest")
ATCOIN_API_KEY = os.environ.get("ATCOIN_API_KEY", "At0R6ebAME5rvFAFv2vfdniyamxdjIN3ouw9NcVU0jBuejrMRlpt2070wKwNGOil")
AIBANK_API_KEY=ATCOIN_API_KEY
# --- Configuração da API Binance ---
# CUIDADO: NUNCA coloque chaves diretamente no código. Use variáveis de ambiente.
BINANCE_API_KEY = os.environ.get("BINANCE_API_KEY","At0R6ebAME5rvFAFv2vfdniyamxdjIN3ouw9NcVU0jBuejrMRlpt2070wKwNGOil")
BINANCE_API_SECRET = os.environ.get("BINANCE_API_SECRET", "KwXApzKS3L0pbmrjT93CuDPgQ63pOrKi49TfSnU9eCBrrFkfi07362PF8Ryx7rF3" )


# --- Configuração do Portfólio ---
# Os tickers aqui devem corresponder aos usados na API ATCoin
PORTFOLIO_ASSETS = {
    'eth': 'ETH-USD', # Chave amigável : ticker yfinance (para buscar dados para a API ATCoin)
    'btc': 'BTC-USD',
    'ada': 'ADA-USD',
    'sol': 'SOL-USD'
}

#Mapeamento do ticker yfinance para o par de trading da Binance (ex: 'ETHUSDT')
# Em config.py ou onde você define seus mapas
YFINANCE_TO_BINANCE_MAP = {
    'BTC-USD': 'BTC/USDT', # Formato com barra!
    'ETH-USD': 'ETH/USDT',
    'SOL-USD': 'SOL/USDT',
    'ADA-USD': 'ADA/USDT',
}
QUOTE_ASSET = "USDT" # O ativo base para medir o valor e para negociação
REBALANCE_INTERVAL_SECONDS = 3600 # Rebalancear a cada 1 hora
MIN_ORDER_VALUE_USD = 11.0 # Valor mínimo para uma ordem na Binance (geralmente ~$10)
