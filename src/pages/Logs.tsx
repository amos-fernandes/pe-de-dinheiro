import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, RefreshCw, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function Logs() {
  const [autoRefresh, setAutoRefresh] = useState(true);

  const logs = [
    {
      timestamp: "2024-01-15 14:30:25",
      level: "INFO",
      message: "Bot de rebalanceamento iniciado com sucesso",
      details: "Sistema iniciado com configurações padrão. Intervalo: 6 horas"
    },
    {
      timestamp: "2024-01-15 14:30:30",
      level: "INFO",
      message: "Conectado à API ATCoin com sucesso",
      details: "Conexão estabelecida com endpoint: https://api.atcoin.com"
    },
    {
      timestamp: "2024-01-15 14:30:35",
      level: "INFO",
      message: "Conectado à API Binance com sucesso",
      details: "Permissões verificadas: SPOT_TRADING habilitado"
    },
    {
      timestamp: "2024-01-15 14:31:00",
      level: "INFO",
      message: "Coletando dados de mercado",
      details: "Obtendo preços e dados históricos para BTC, ETH, ADA, SOL"
    },
    {
      timestamp: "2024-01-15 14:31:15",
      level: "SUCCESS",
      message: "Dados de mercado coletados com sucesso",
      details: "5 ativos processados, dados dos últimos 24h obtidos"
    },
    {
      timestamp: "2024-01-15 14:31:30",
      level: "INFO",
      message: "Consultando API ATCoin para recomendações",
      details: "Enviando dados de mercado para análise de IA"
    },
    {
      timestamp: "2024-01-15 14:31:45",
      level: "SUCCESS",
      message: "Recomendações de alocação recebidas",
      details: "BTC: 40%, ETH: 25%, ADA: 20%, SOL: 10%, USDT: 5%"
    },
    {
      timestamp: "2024-01-15 14:32:00",
      level: "INFO",
      message: "Calculando ordens necessárias",
      details: "Comparando alocação atual com a recomendada"
    },
    {
      timestamp: "2024-01-15 14:32:15",
      level: "WARNING",
      message: "Rebalanceamento necessário detectado",
      details: "Diferença significativa detectada em 3 ativos"
    },
    {
      timestamp: "2024-01-15 14:32:30",
      level: "INFO",
      message: "Executando ordem de venda: 0.5 ETH",
      details: "Ordem MARKET executada a $2,493.50 por ETH"
    },
    {
      timestamp: "2024-01-15 14:32:45",
      level: "SUCCESS",
      message: "Venda executada com sucesso",
      details: "Recebido: $1,246.75 USDT (taxa: $1.25)"
    },
    {
      timestamp: "2024-01-15 14:33:00",
      level: "INFO",
      message: "Executando ordem de compra: 0.029 BTC",
      details: "Ordem MARKET executada a $42,850.00 por BTC"
    },
    {
      timestamp: "2024-01-15 14:33:15",
      level: "SUCCESS",
      message: "Compra executada com sucesso",
      details: "Adquirido: 0.029 BTC por $1,242.65 USDT (taxa: $1.24)"
    },
    {
      timestamp: "2024-01-15 14:33:30",
      level: "SUCCESS",
      message: "Rebalanceamento concluído com sucesso",
      details: "Portfolio rebalanceado conforme recomendações da IA"
    },
    {
      timestamp: "2024-01-15 14:33:45",
      level: "INFO",
      message: "Próximo rebalanceamento agendado para 20:33",
      details: "Sistema em modo de espera até próxima execução"
    }
  ];

  const getLogIcon = (level: string) => {
    switch (level) {
      case "SUCCESS":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case "ERROR":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Info className="w-4 h-4 text-chart-blue" />;
    }
  };

  const getLogBadgeVariant = (level: string) => {
    switch (level) {
      case "SUCCESS":
        return "default";
      case "WARNING":
        return "secondary";
      case "ERROR":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logs do Sistema</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe todas as atividades e operações do bot em tempo real
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar Logs
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Log de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full">
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {getLogIcon(log.level)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={getLogBadgeVariant(log.level)} className="text-xs">
                        {log.level}
                      </Badge>
                      <span className="text-sm text-muted-foreground font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                    
                    <p className="font-medium text-foreground mb-1">
                      {log.message}
                    </p>
                    
                    <p className="text-sm text-muted-foreground">
                      {log.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm text-muted-foreground">Operações com Sucesso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Avisos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Erros</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}