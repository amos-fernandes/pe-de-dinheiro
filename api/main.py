# bia/main.pyimport
import uvicorn
import os
import time
from config import REBALANCE_INTERVAL_SECONDS
from portfolio_manager import PortfolioManager
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def run_robot():
    """
    Roda o robô de rebalanceamento em um loop infinito.
    """
    manager = PortfolioManager()
    while True:
        try:
            manager.rebalance_portfolio()
        except Exception as e:
            print(f"ERRO CRÍTICO no loop principal: {e}")
            print("Aguardando próximo ciclo para tentar novamente...")

        print(f"Aguardando {REBALANCE_INTERVAL_SECONDS} segundos para o próximo ciclo...")
        time.sleep(REBALANCE_INTERVAL_SECONDS)

if __name__ == "__main__":

    run_robot()
