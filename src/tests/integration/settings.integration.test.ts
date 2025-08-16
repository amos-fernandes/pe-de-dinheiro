import { getConnectionStatus, saveSettings, testConnections } from "../../services/apiService";

describe("Integração Settings API", () => {
  it("deve retornar status de conexão", async () => {
    const status = await getConnectionStatus();
    expect(status).toHaveProperty("connected");
  });

  it("deve salvar configurações", async () => {
    const resp = await saveSettings({ atcoinApiUrl: "http://localhost:5000",
    atcoinApiKey: "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_mais_minha_super_chave_secreta" });
    expect(resp).toHaveProperty("success");
  });

  it("deve testar conexões", async () => {
    const resp = await testConnections();
    expect(resp).toHaveProperty("connected");
  });
});
