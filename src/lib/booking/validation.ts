export const digits = (v: string) => v.replace(/\D/g, "");

export function formatPhone(v: string) {
  const d = digits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function formatCPF(v: string) {
  const d = digits(v).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

export function validateClient(c: { name: string; email: string; phone: string; cpf: string }) {
  const e: Partial<Record<"name" | "email" | "phone" | "cpf", string>> = {};
  if (!c.name.trim()) e.name = "Informe seu nome completo.";
  else if (c.name.trim().split(/\s+/).length < 2) e.name = "Informe nome e sobrenome.";
  if (!c.email.trim()) e.email = "Informe seu e-mail.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim())) e.email = "E-mail inválido. Ex.: nome@email.com";
  const p = digits(c.phone);
  if (!p) e.phone = "Informe seu telefone.";
  else if (p.length < 10) e.phone = "Telefone incompleto. Inclua o DDD.";
  const cpf = digits(c.cpf);
  if (!cpf) e.cpf = "Informe seu CPF.";
  else if (cpf.length !== 11) e.cpf = "O CPF deve ter 11 dígitos.";
  return e;
}
