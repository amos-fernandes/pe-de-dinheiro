import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bot, Play, Pause, Settings, Activity, Zap, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function BotPage() {
  const [botActive, setBotActive] = useState(false);
  const [riskLevel, setRiskLevel] = useState([3]);
  const [rebalanceFreq, setRebalanceFreq] = useState([6]);
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [stopLoss, setStopLoss] = useState(true);
  const { toast } = useToast();

  const handleBotToggle = () => {
    setBotActive(!botActive);
    toast({
      title: botActive ? "Bot Pausado" : "Bot Iniciado",
      description: botActive 
        ? "O trading bot foi pausado com sucesso." 
        : "O trading bot está agora ativo e monitorando o mercado.",
    });
  };

  const botMetrics = [
    { label: "Trades Executados", value: "47", period: "últimos 7 dias" },
    { label: "Taxa de Sucesso", value: "78%", period: "histórico" },
    { label: "Retorno Médio", value: "+2.4%", period: "por trade" },
    { label: "Tempo Ativo", value: "72h", period: "esta semana" }
  ];

  const nextActions = [
    { time: "Em 2h 15min", action: "Rebalanceamento automático", status: "scheduled" },
    { time: "Em 4h 30min", action: "Análise de mercado", status: "scheduled" },
    { time: "Em 6h 00min", action: "Revisão de portfólio", status: "scheduled" },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Trading Bot</h1>
            <p className="text-muted-foreground mt-2">
              Configure e monitore seu bot de trading autônomo
            </p>
          </div>
          
          <Button
            onClick={handleBotToggle}
            size="lg"
            variant={botActive ? "destructive" : "default"}
            className="px-8"
          >
            {botActive ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pausar Bot
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Iniciar Bot
              </>
            )}
          </Button>
        </div>

        {/* Status do Bot */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${botActive ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                  <span className="text-lg font-medium">
                    {botActive ? "Bot Ativo" : "Bot Inativo"}
                  </span>
                  <Badge variant={botActive ? "default" : "secondary"}>
                    {botActive ? "Online" : "Offline"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {botActive 
                    ? "Monitorando mercado e executando estratégias" 
                    : "Aguardando ativação para iniciar operações"
                  }
                </p>
              </div>

              {botActive && (
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Próxima ação</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Rebalanceamento em 2h 15min</p>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {botMetrics.map((metric, index) => (
                <div key={index} className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-xl font-bold">{metric.value}</div>
                  <div className="text-sm font-medium">{metric.label}</div>
                  <div className="text-xs text-muted-foreground">{metric.period}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Configurações do Bot */}
          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações do Bot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Nível de Risco: {riskLevel[0]}/5</Label>
                <Slider
                  value={riskLevel}
                  onValueChange={setRiskLevel}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservador</span>
                  <span>Agressivo</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Frequência de Rebalanceamento: {rebalanceFreq[0]}h</Label>
                <Slider
                  value={rebalanceFreq}
                  onValueChange={setRebalanceFreq}
                  max={24}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 hora</span>
                  <span>24 horas</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rebalanceamento Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Executar trades automaticamente
                    </p>
                  </div>
                  <Switch checked={autoRebalance} onCheckedChange={setAutoRebalance} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Stop Loss Inteligente</Label>
                    <p className="text-sm text-muted-foreground">
                      Proteção contra perdas excessivas
                    </p>
                  </div>
                  <Switch checked={stopLoss} onCheckedChange={setStopLoss} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximas Ações */}
          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Próximas Ações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nextActions.map((action, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{action.action}</p>
                      <p className="text-xs text-muted-foreground">{action.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Agendado
                    </Badge>
                  </div>
                ))}
              </div>

              {!botActive && (
                <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span className="text-sm text-warning font-medium">
                      Bot inativo - Nenhuma ação será executada
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estratégia Atual */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Estratégia Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">Rebalanceamento por IA</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Utiliza inteligência artificial da ATCoin para otimizar alocação de ativos
                </p>
              </div>

              <div className="p-4 bg-chart-blue/5 rounded-lg border border-chart-blue/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-chart-blue" />
                  <span className="font-medium text-chart-blue">Análise Técnica</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Considera indicadores técnicos e padrões de mercado
                </p>
              </div>

              <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="font-medium text-success">Gestão de Risco</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Controle automático de risco com stop loss inteligente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}