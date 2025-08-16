import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Bot, 
  Play, 
  Pause, 
  AlertTriangle,
  Target,
  PieChart,
  Zap
} from "lucide-react";
import { useState } from "react";

export function Dashboard() {
  const [botActive, setBotActive] = useState(false);

  const portfolioMetrics = [
    {
      title: "Valor Total do Portfólio",
      value: "$12,485.32",
      change: "+5.2% (24h)",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Saldo total em USDT"
    },
    {
      title: "Retorno Mensal",
      value: "+18.7%",
      change: "vs mês anterior",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Performance do último mês"
    },
    {
      title: "Transações Hoje",
      value: "24",
      change: "16 compras, 8 vendas",
      changeType: "neutral" as const,
      icon: Activity,
      description: "Operações realizadas"
    },
    {
      title: "Status do Bot",
      value: botActive ? "Ativo" : "Parado",
      change: botActive ? "Funcionando normalmente" : "Aguardando ativação",
      changeType: botActive ? "positive" as const : "neutral" as const,
      icon: Bot,
      description: "Estado atual do sistema"
    }
  ];

  const currentAllocation = [
    { asset: "BTC", current: 35, target: 40, value: "$4,369.86" },
    { asset: "ETH", current: 30, target: 25, value: "$3,745.60" },
    { asset: "ADA", current: 15, target: 20, value: "$1,872.80" },
    { asset: "SOL", current: 10, target: 10, value: "$1,248.53" },
    { asset: "USDT", current: 10, target: 5, value: "$1,248.53" }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {portfolioMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Controle do Bot */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Controle do Trading Bot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Status: <Badge variant={botActive ? "default" : "secondary"}>
                    {botActive ? "Ativo" : "Inativo"}
                  </Badge>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {botActive ? "Bot executando rebalanceamento automático" : "Bot aguardando ativação"}
                </p>
              </div>
              <Button
                onClick={() => setBotActive(!botActive)}
                variant={botActive ? "destructive" : "default"}
                size="sm"
              >
                {botActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Parar
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>
            </div>

            {botActive && (
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">Próximo rebalanceamento em 2h 15min</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Última execução</p>
                <p className="font-medium">Há 4 horas</p>
              </div>
              <div>
                <p className="text-muted-foreground">Intervalo</p>
                <p className="font-medium">6 horas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alocação Atual vs Alvo */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Alocação do Portfólio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentAllocation.map((allocation) => (
                <div key={allocation.asset} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{allocation.asset}</span>
                    <span className="text-muted-foreground">{allocation.value}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Atual: {allocation.current}%</span>
                        <span>Alvo: {allocation.target}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full relative">
                        <div 
                          className="h-2 bg-chart-blue rounded-full"
                          style={{ width: `${allocation.current}%` }}
                        />
                        <div 
                          className="absolute top-0 w-0.5 h-2 bg-primary"
                          style={{ left: `${allocation.target}%` }}
                        />
                      </div>
                    </div>
                    {allocation.current !== allocation.target && (
                      <Badge variant="outline" className="text-xs">
                        {allocation.current > allocation.target ? "Vender" : "Comprar"}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-warning" />
                <span className="text-warning font-medium">Rebalanceamento sugerido detectado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Atividades */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: "buy", asset: "BTC", amount: "0.024", price: "$42,850", time: "há 2 horas" },
              { type: "sell", asset: "ETH", amount: "1.5", price: "$2,493", time: "há 3 horas" },
              { type: "buy", asset: "ADA", amount: "500", price: "$0.48", time: "há 4 horas" },
              { type: "rebalance", asset: "", amount: "", price: "", time: "há 6 horas" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={
                      activity.type === "buy" ? "default" : 
                      activity.type === "sell" ? "destructive" : 
                      "secondary"
                    }
                    className="w-16 justify-center"
                  >
                    {activity.type === "buy" ? "Compra" : 
                     activity.type === "sell" ? "Venda" : 
                     "Rebalance"}
                  </Badge>
                  <div>
                    {activity.type !== "rebalance" ? (
                      <>
                        <p className="font-medium">{activity.amount} {activity.asset}</p>
                        <p className="text-sm text-muted-foreground">@ {activity.price}</p>
                      </>
                    ) : (
                      <p className="font-medium">Rebalanceamento automático executado</p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}