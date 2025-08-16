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

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getPortfolioBalance(): Promise<PortfolioBalance> {
    return this.request<PortfolioBalance>('/api/portfolio/balance');
  }

  async getAIAllocation(): Promise<AIAllocation> {
    return this.request<AIAllocation>('/api/portfolio/allocation');
  }

  async getPortfolioStatus(): Promise<PortfolioStatus> {
    return this.request<PortfolioStatus>('/api/portfolio/status');
  }

  async rebalancePortfolio(): Promise<RebalanceResponse> {
    return this.request<RebalanceResponse>('/api/portfolio/rebalance', {
      method: 'POST',
    });
  }

  async healthCheck(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/api/health');
  }
}

export const apiService = new ApiService();

