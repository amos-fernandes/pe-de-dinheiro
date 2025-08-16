import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Target, BarChart3 } from "lucide-react";

type Asset = {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  percentage: number;
  change24h: number;
  allocation?: {
    current: number;
    target: number;
  };
};

export default function Portfolio() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    fetch("/api/portfolio/balance")
      .then(res => res.json())
      .then(data => {
        if (data.error) return setAssets([]);
        setTotalValue(data.total_value_usd);

        // Transformar allocations em array para o frontend
        const allocs = data.allocations || {};
        type AllocationInfo = {
          quantity: number;
          value_usd: number;
          // Add other fields if needed
        };

        const arr: Asset[] = Object.entries(allocs).map(([symbol, info]: [string, AllocationInfo]) => ({
          symbol,
          name: symbol, // Se quiser, mapeie para nome real
          balance: info.quantity,
          value: info.value_usd,
          percentage: totalValue > 0 ? +(info.value_usd * 100 / data.total_value_usd).toFixed(2) : 0,
          change24h: 0, // Implemente se o backend retornar
          allocation: {
            current: totalValue > 0 ? +(info.value_usd * 100 / data.total_value_usd).toFixed(2) : 0,
            target: 0 // Implemente se o backend retornar
          }
        }));
        setAssets(arr);
      })
      .catch(() => setAssets([]))
      .finally(() => setLoading(false));
  }, [totalValue]);

  if (loading) return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 text-center text-muted-foreground">Carregando dados reais da Binance...</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Portfólio</h1>
          <p className="text-muted-foreground mt-2">
            Visão geral dos seus investimentos em criptomoedas
          </p>
        </div>

        {/* Resumo do Portfólio */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-success mt-1">Últimas 24h</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Performance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">+0%</div>
              <p className="text-xs text-muted-foreground mt-1">Retorno mensal</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Diversificação
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assets.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Ativos diferentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Ativos */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Seus Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assets.map((asset) => (
                <div key={asset.symbol} className="p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{asset.symbol}</span>
                      </div>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.balance} {asset.symbol}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">${asset.value.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        {asset.change24h > 0 ? (
                          <TrendingUp className="w-3 h-3 text-success" />
                        ) : asset.change24h < 0 ? (
                          <TrendingDown className="w-3 h-3 text-destructive" />
                        ) : null}
                        <span className={`text-xs ${
                          asset.change24h > 0 ? 'text-success' :
                          asset.change24h < 0 ? 'text-destructive' :
                          'text-muted-foreground'
                        }`}>
                          {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Porcentagem do Portfólio</span>
                      <span>{asset.percentage}%</span>
                    </div>
                    <Progress value={asset.percentage} className="h-2" />
                  </div>

                  <div className="mt-3 p-3 bg-background/50 rounded border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Alocação</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Atual: {asset.allocation?.current ?? 0}%
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Alvo: {asset.allocation?.target ?? 0}%
                        </Badge>
                      </div>
                    </div>

                    <div className="relative">
                      <Progress value={asset.allocation?.current ?? 0} className="h-2" />
                      <div
                        className="absolute top-0 w-0.5 h-2 bg-primary"
                        style={{ left: `${asset.allocation?.target ?? 0}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>

                    {asset.allocation?.current !== asset.allocation?.target && (
                      <div className="mt-2 flex items-center gap-2">
                        <Target className="w-3 h-3 text-warning" />
                        <span className="text-xs text-warning">
                          {asset.allocation?.current > asset.allocation?.target
                            ? `Reduzir em ${asset.allocation.current - asset.allocation.target}%`
                            : `Aumentar em ${asset.allocation.target - asset.allocation.current}%`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
