/** Endpoint do webhook n8n que recebe os dados do cadastro/agendamento. */
export const CADASTRO_WEBHOOK_URL =
  "https://walrus-obedient-siding.ngrok-free.dev/webhook/cadastro-pessoa";

export type CadastroWebhookPayload = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  servico?: string | undefined;
  data?: string | undefined;
  horario?: string | undefined;
  duracaoMinutos?: number | undefined;
  valor?: number | undefined;
  observacoes?: string | undefined;
};

/**
 * Envia os dados do cadastro ao webhook. Dispara o POST e não bloqueia o
 * fluxo do agendamento; em ambiente de teste usa o fetch injetado.
 */
export async function sendCadastroWebhook(
  payload: CadastroWebhookPayload,
  fetchImpl: typeof fetch = fetch,
  url: string = CADASTRO_WEBHOOK_URL,
): Promise<boolean> {
  const body = JSON.stringify({ ...payload, enviadoEm: new Date().toISOString() });
  try {
    const res = await fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "1" },
      body,
    });
    if (!res.ok) throw new Error(`webhook respondeu ${res.status}`);
    return true;
  } catch {
    // Tentativa de contingência: request simples (sem preflight) quando o
    // CORS do webhook bloqueia a chamada com Content-Type application/json.
    try {
      await fetchImpl(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body,
      });
      return true;
    } catch {
      return false;
    }
  }
}
