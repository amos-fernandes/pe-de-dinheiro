# teste_binance.py
import ccxt
import os
from dotenv import load_dotenv

load_dotenv()
BINANCE_API_KEY = os.getenv("BINANCE_API_KEY")
BINANCE_API_SECRET = os.getenv("BINANCE_API_SECRET")

client = ccxt.binance({
    'apiKey': BINANCE_API_KEY,
    'secret': BINANCE_API_SECRET,
})

try:
    # Tente buscar apenas um ticker
    ticker = client.fetch_ticker('BTC/USDT')
    print("Sucesso! Ticker do BTC/USDT:")
    print(ticker)
except Exception as e:
    print(f"Falha ao buscar ticker. Erro: {e}")
