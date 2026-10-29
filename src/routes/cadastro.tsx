import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, Steps } from "@/components/site-header";
import { useBooking, type Client } from "@/lib/booking/store";
import { formatCPF, formatPhone, validateClient } from "@/lib/booking/validation";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Cadastro — Ateliê Lume" },
      { name: "description", content: "Informe seus dados para iniciar o agendamento." },
      { property: "og:title", content: "Cadastro — Ateliê Lume" },
      { property: "og:description", content: "Informe seus dados para iniciar o agendamento." },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const { client, setClient } = useBooking();
  const nav = useNavigate();
  const [form, setForm] = useState<Client>(client ?? { name: "", email: "", phone: "", cpf: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const errors = validateClient(form);
  const valid = Object.keys(errors).length === 0;

  const fields: { k: keyof Client; label: string; type: string; ph: string; fmt?: (v: string) => string; mode?: "tel" | "numeric" | "email" }[] = [
    { k: "name", label: "Nome completo", type: "text", ph: "Maria da Silva" },
    { k: "email", label: "E-mail", type: "email", ph: "maria@email.com", mode: "email" },
    { k: "phone", label: "Telefone", type: "tel", ph: "(11) 91234-5678", fmt: formatPhone, mode: "tel" },
    { k: "cpf", label: "CPF", type: "text", ph: "000.000.000-00", fmt: formatCPF, mode: "numeric" },
  ];

  return (
    <PageShell>
      <div className="mx-auto max-w-lg">
        <Steps current={1} />
        <h1 className="text-4xl">Seu cadastro</h1>
        <p className="mt-2 text-sm text-muted-foreground">Cadastro demonstrativo — nada é enviado ou salvo. Campos com <span className="text-primary">*</span> são obrigatórios.</p>
        <form
          noValidate
          className="card mt-6 space-y-5 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
            if (valid) { setClient(form); nav({ to: "/agendar" }); }
          }}
        >
          {fields.map((f) => {
            const err = (touched[f.k] || submitted) && errors[f.k];
            return (
              <div key={f.k}>
                <label htmlFor={f.k} className="mb-1.5 block text-sm font-medium">{f.label} <span className="text-primary">*</span></label>
                <input
                  id={f.k} type={f.type} inputMode={f.mode} placeholder={f.ph} className="field"
                  value={form[f.k]} aria-invalid={!!err} aria-describedby={err ? `${f.k}-err` : undefined}
                  onChange={(e) => setForm({ ...form, [f.k]: f.fmt ? f.fmt(e.target.value) : e.target.value })}
                  onBlur={() => setTouched({ ...touched, [f.k]: true })}
                />
                {err && <p id={`${f.k}-err`} className="mt-1.5 text-sm text-destructive">{err}</p>}
              </div>
            );
          })}
          <Button variant="plain" size="auto" type="submit" className="btn btn-primary w-full">Continuar para o agendamento</Button>
        </form>
      </div>
    </PageShell>
  );
}
