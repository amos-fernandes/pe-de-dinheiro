from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__, static_folder='frontend/dist', static_url_path='')
CORS(app)  # Permitir CORS para todas as rotas

# Dados de teste simulados
MOCK_PORTFOLIO_DATA = {
    "total_value_usd": 34585.32,
    "allocations": {
        "BTC": {
            "quantity": 0.285,
            "price": 42631.50,
            "value_usd": 12150.00
        },
        "ETH": {
            "quantity": 4.82,
            "price": 2000.00,
            "value_usd": 9640.00
        },
        "ADA": {
            "quantity": 12450.0,
            "price": 0.48,
            "value_usd": 5976.00
        },
        "SOL": {
            "quantity": 48.5,
            "price": 90.00,
            "value_usd": 4365.00
        },
        "USDT": {
            "quantity": 2454.32,
            "price": 1.0,
            "value_usd": 2454.32
        }
    },
    "timestamp": datetime.now().isoformat()
}

MOCK_AI_ALLOCATION = {
    "recommended_allocation": {
        "btc": 0.40,
        "eth": 0.25,
        "ada": 0.20,
        "sol": 0.10,
        "usdt": 0.05
    },
    "timestamp": datetime.now().isoformat()
}

@app.route('/')
def serve_frontend():
    """Serve o frontend React."""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/portfolio/balance', methods=['GET'])
def get_portfolio_balance():
    """Retorna o saldo atual do portfólio (dados simulados)."""
    try:
        return jsonify(MOCK_PORTFOLIO_DATA)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolio/allocation', methods=['GET'])
def get_ai_allocation():
    """Obtém a alocação recomendada pela IA (dados simulados)."""
    try:
        return jsonify(MOCK_AI_ALLOCATION)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolio/rebalance', methods=['POST'])
def rebalance_portfolio():
    """Executa o rebalanceamento do portfólio (simulado)."""
    try:
        return jsonify({
            "message": "Rebalanceamento iniciado (modo teste)",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolio/status', methods=['GET'])
def get_portfolio_status():
    """Retorna o status geral do portfólio (dados simulados)."""
    try:
        return jsonify({
            "balances": {
                "BTC": 0.285,
                "ETH": 4.82,
                "ADA": 12450.0,
                "SOL": 48.5,
                "USDT": 2454.32
            },
            "target_allocation": MOCK_AI_ALLOCATION["recommended_allocation"],
            "current_prices": {
                "BTCUSDT": 42631.50,
                "ETHUSDT": 2000.00,
                "ADAUSDT": 0.48,
                "SOLUSDT": 90.00
            },
            "portfolio_assets": {
                "btc": "BTC-USD",
                "eth": "ETH-USD",
                "ada": "ADA-USD",
                "sol": "SOL-USD"
            },
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
        "version": "1.0.0-test"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

