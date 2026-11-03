import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, Steps } from "@/components/site-header";
import { useBooking } from "@/lib/booking/store";
import { brl, fmtDate, fmtDuration, getService } from "@/lib/booking/data";
import { fmtTime, getSlots } from "@/lib/booking/availability";
import { sendCadastroWebhook } from "@/lib/booking/webhook";

export const Route = createFileRoute("/confirmacao")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Confirmação — Ateliê Lume" },
      { name: "description", content: "Revise e confirme seu agendamento." },
      { property: "og:title", content: "Confirmação — Ateliê Lume" },
      { property: "og:description", content: "Revise e confirme seu agendamento." },
    ],
  }),
  component: Confirmacao,
});

function Confirmacao() {
  const { client, draft, setDraft, addBooking, weekly, blocks, bookings } = useBooking();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const service = draft.serviceId ? getService(draft.serviceId) : undefined;

  if (done) {
    return (
      <PageShell>
        <div className="card mx-auto max-w-md p-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-sage text-2xl text-sage-foreground">✓</div>
          <h1 className="mt-4 text-4xl">Agendamento confirmado!</h1>
          <p className="mt-2 text-sm text-muted-foreground">Confirmação demonstrativa — nenhuma mensagem foi enviada.</p>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/meus-agendamentos" className="btn btn-primary">Ver meus agendamentos</Link>
            <Link to="/" className="btn btn-ghost">Voltar ao início</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!client || !service || !draft.date || !draft.time) {
    return (
      <PageShell>
        <div className="card mx-auto max-w-md p-8 text-center">
          <h1 className="text-3xl">Nada para confirmar</h1>
          <p className="mt-2 text-sm text-muted-foreground">Escolha serviço, data e horário primeiro.</p>
          <Link to={client ? "/agendar" : "/cadastro"} className="btn btn-primary mt-6">Começar agendamento</Link>
        </div>
      </PageShell>
    );
  }

  const stillFree = getSlots(draft.date, service.duration, weekly, blocks, bookings).some((s) => s.time === draft.time && s.state === "livre");
  const rows: [string, string][] = [
    ["Cliente", client.name],
    ["Serviço", service.name],
    ["Data", fmtDate(draft.date)],
    ["Horário", fmtTime(draft.time)],
    ["Duração", fmtDuration(service.duration)],
    ["Valor", brl(service.price)],
    ...(draft.notes.trim() ? [["Observações", draft.notes.trim()] as [string, string]] : []),
  ];

  return (
    <PageShell>
      <div className="mx-auto max-w-lg">
        <Steps current={3} />
        <h1 className="text-4xl">Confira os detalhes</h1>
        <dl className="card mt-6 divide-y">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-5 py-3.5 text-sm">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-medium first-letter:uppercase">{v}</dd>
            </div>
          ))}
        </dl>
        {(!stillFree || error) && <p role="alert" className="mt-4 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">Este horário deixou de estar disponível. Volte e escolha outro.</p>}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link to="/agendar" className="btn btn-outline">Voltar para editar</Link>
          <Button variant="plain" size="auto"
            className="btn btn-primary" disabled={!stillFree}
            onClick={() => {
              if (!draft.date || !draft.time) return;
              const booking = addBooking({ serviceId: service.id, date: draft.date, time: draft.time, duration: service.duration, notes: draft.notes.trim() || undefined, clientName: client.name });
              if (!booking) { setError("unavailable"); return; }
              void sendCadastroWebhook({
                nome: client.name,
                email: client.email,
                telefone: client.phone,
                cpf: client.cpf,
                servico: service.name,
                data: draft.date,
                horario: draft.time,
                duracaoMinutos: service.duration,
                valor: service.price,
                observacoes: draft.notes.trim() || undefined,
              });
              setDraft({ notes: "" });
              setDone(true);
            }}
          >Confirmar agendamento</Button>
        </div>
      </div>
    </PageShell>
  );
}
