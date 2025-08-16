const API_BASE_URL = 'http://localhost:5001';

export interface PortfolioBalance {
  total_value_usd: number;
  allocations: {
    [key: string]: {
      quantity: number;
      price: number;
      value_usd: number;
    };
  };
  timestamp: string;
}

export interface AIAllocation {
  recommended_allocation: {
    [key: string]: number;
  };
  timestamp: string;
}

export interface PortfolioStatus {
  balances: { [key: string]: number };
  target_allocation: { [key: string]: number };
  current_prices: { [key: string]: number };
  portfolio_assets: { [key: string]: string };
  timestamp: string;
}

export interface RebalanceResponse {
  message: string;
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

export interface ConnectionStatusResponse {
  status: string;
  details?: string;
  timestamp?: string;
}

export interface Settings {
  [key: string]: unknown;
}

export async function getPortfolioBalance(): Promise<PortfolioBalance> {
  const res = await fetch(`${API_BASE_URL}/api/portfolio/balance`);
  if (!res.ok) throw new Error("Erro ao buscar portfólio");
  return res.json();
}

export async function getAIAllocation(): Promise<AIAllocation> {
  const res = await fetch(`${API_BASE_URL}/api/portfolio/allocation`);
  if (!res.ok) throw new Error("Erro ao buscar alocação da IA");
  return res.json();
}

export async function getPortfolioStatus(): Promise<PortfolioStatus> {
  const res = await fetch(`${API_BASE_URL}/api/portfolio/status`);
  if (!res.ok) throw new Error("Erro ao buscar status do portfólio");
  return res.json();
}

export async function rebalancePortfolio(): Promise<RebalanceResponse> {
  const res = await fetch(`${API_BASE_URL}/api/portfolio/rebalance`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error("Erro ao rebalancear portfólio");
  return res.json();
}

export async function getConnectionStatus(): Promise<ConnectionStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/api/status`);
  if (!res.ok) throw new Error("Erro ao buscar status de conexão");
  return res.json();
}

export async function getHealthStatus(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  if (!res.ok) throw new Error("Erro ao buscar status de saúde");
  return res.json();
}

export async function saveSettings(settings: Settings): Promise<Settings> {
  const res = await fetch(`${API_BASE_URL}/api/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Erro ao salvar configurações");
  return res.json();
}

export async function testConnections(): Promise<ConnectionStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/api/test-connections`);
  if (!res.ok) throw new Error("Erro ao testar conexões");
  return res.json();
}
