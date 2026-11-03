import { describe, expect, it, vi } from "vitest";
import { CADASTRO_WEBHOOK_URL, sendCadastroWebhook } from "@/lib/booking/webhook";

describe("webhook de cadastro", () => {
  it("aponta para a URL pública do n8n", () => {
    expect(CADASTRO_WEBHOOK_URL).toBe("https://walrus-obedient-siding.ngrok-free.dev/webhook/cadastro-pessoa");
  });

  it("envia POST com os dados do cliente em JSON", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    const ok = await sendCadastroWebhook(
      { nome: "Maria da Silva", email: "maria@email.com", telefone: "(11) 91234-5678", cpf: "123.456.789-00" },
      fetchImpl,
    );
    expect(ok).toBe(true);
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe(CADASTRO_WEBHOOK_URL);
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({ nome: "Maria da Silva", email: "maria@email.com", telefone: "(11) 91234-5678", cpf: "123.456.789-00" });
    expect(body.enviadoEm).toBeTruthy();
  });

  it("usa contingência no-cors quando a chamada principal falha", async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce({ ok: false, status: 0 } as unknown as Response);
    const ok = await sendCadastroWebhook({ nome: "Maria", email: "m@e.com", telefone: "1", cpf: "2" }, fetchImpl);
    expect(ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls[1]![1].mode).toBe("no-cors");
  });
});
