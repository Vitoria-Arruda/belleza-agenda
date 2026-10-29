import { Button } from "@/components/ui/button";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageShell, Steps } from "@/components/site-header";
import { MonthCalendar } from "@/components/month-calendar";
import { useBooking } from "@/lib/booking/store";
import { SERVICES, brl, fmtDate, fmtDuration, getService } from "@/lib/booking/data";
import { fmtTime, getSlots, hasFreeSlot } from "@/lib/booking/availability";

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Novo agendamento — Ateliê Lume" },
      { name: "description", content: "Escolha serviço, data e horário disponíveis." },
      { property: "og:title", content: "Novo agendamento — Ateliê Lume" },
      { property: "og:description", content: "Escolha serviço, data e horário disponíveis." },
    ],
  }),
  component: Agendar,
});

const STATE_LABEL = { ocupado: "Ocupado", bloqueado: "Bloqueado", passado: "Encerrado", livre: "" };

function Agendar() {
  const { client, draft, setDraft, weekly, blocks, bookings } = useBooking();
  const nav = useNavigate();
  const service = draft.serviceId ? getService(draft.serviceId) : undefined;
  const duration = service?.duration ?? 30;
  const slots = draft.date ? getSlots(draft.date, duration, weekly, blocks, bookings) : [];

  // Se a disponibilidade mudou (admin) e a seleção ficou inválida, limpa-a.
  useEffect(() => {
    if (draft.time && !slots.some((s) => s.time === draft.time && s.state === "livre")) setDraft({ ...draft, time: undefined });
  }, [draft.time, slots.map((s) => s.time + s.state).join()]);

  if (!client) {
    return (
      <PageShell>
        <div className="card mx-auto max-w-md p-8 text-center">
          <h1 className="text-3xl">Antes de agendar</h1>
          <p className="mt-2 text-sm text-muted-foreground">Faça seu cadastro rápido para continuar.</p>
          <Link to="/cadastro" className="btn btn-primary mt-6">Ir para o cadastro</Link>
        </div>
      </PageShell>
    );
  }

  const canNext = !!(service && draft.date && draft.time && slots.some((s) => s.time === draft.time && s.state === "livre"));

  return (
    <PageShell>
      <Steps current={2} />
      <h1 className="text-4xl">Olá, {client.name.split(" ")[0]}. Vamos agendar?</h1>

      <section className="mt-8" aria-labelledby="s1">
        <h2 id="s1" className="text-2xl">1. Serviço</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup">
          {SERVICES.map((s) => {
            const sel = s.id === draft.serviceId;
            return (
              <Button variant="plain" size="auto"
                key={s.id} type="button" role="radio" aria-checked={sel}
                onClick={() => setDraft({ ...draft, serviceId: s.id, time: undefined })}
                className={`card p-4 text-left transition ${sel ? "border-primary bg-secondary ring-1 ring-primary" : "hover:border-primary/40"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-display text-xl">{s.name}</span>
                  {sel && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">✓ Selecionado</span>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                <p className="mt-3 text-sm">{brl(s.price)} <span className="text-muted-foreground">· {fmtDuration(s.duration)}</span></p>
              </Button>
            );
          })}
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="card p-5" aria-labelledby="s2">
          <h2 id="s2" className="mb-4 text-2xl">2. Data</h2>
          <MonthCalendar
            selected={draft.date}
            onSelect={(d) => setDraft({ ...draft, date: d, time: undefined })}
            isAvailable={(k) => hasFreeSlot(k, duration, weekly, blocks, bookings)}
          />
        </section>

        <section className="card p-5" aria-labelledby="s3">
          <h2 id="s3" className="text-2xl">3. Horário</h2>
          {!service && <p className="mt-3 text-sm text-muted-foreground">Selecione um serviço para ver horários compatíveis com a duração.</p>}
          {!draft.date ? (
            <p className="mt-3 text-sm text-muted-foreground">Escolha uma data no calendário.</p>
          ) : (
            <>
              <p className="mt-1 text-sm capitalize text-muted-foreground">{fmtDate(draft.date)}</p>
              {slots.filter((s) => s.state === "livre").length === 0 ? (
                <p className="mt-4 rounded-lg bg-muted p-4 text-sm">Não há horários disponíveis nesta data. Tente outro dia.</p>
              ) : null}
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((s) => {
                  const sel = s.time === draft.time;
                  const free = s.state === "livre";
                  return (
                    <Button variant="plain" size="auto"
                      key={s.time} type="button" disabled={!free} aria-pressed={sel}
                      onClick={() => setDraft({ ...draft, time: s.time })}
                      className={`flex min-h-12 flex-col items-center justify-center rounded-lg border text-sm transition ${
                        sel ? "border-primary bg-primary font-semibold text-primary-foreground"
                        : free ? "bg-card hover:border-primary/50"
                        : "cursor-not-allowed bg-muted text-muted-foreground/70 line-through"
                      }`}
                    >
                      {fmtTime(s.time)}
                      {!free && <span className="text-[0.65rem] no-underline">{STATE_LABEL[s.state]}</span>}
                    </Button>
                  );
                })}
              </div>
            </>
          )}
          <label htmlFor="notes" className="mt-6 mb-1.5 block text-sm font-medium">Observações <span className="font-normal text-muted-foreground">(opcional)</span></label>
          <textarea id="notes" rows={3} className="field py-2" placeholder="Alergias, preferências..." value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
        </section>
      </div>

      <div className="sticky bottom-0 mt-8 -mx-4 flex flex-col items-center gap-2 border-t bg-background/95 px-4 py-4 sm:flex-row sm:justify-end">
        {!canNext && <p className="text-sm text-muted-foreground">Selecione {[!service && "serviço", !draft.date && "data", !draft.time && "horário"].filter(Boolean).join(", ")} para continuar.</p>}
        <Button variant="plain" size="auto" className="btn btn-primary w-full sm:w-auto" disabled={!canNext} onClick={() => nav({ to: "/confirmacao" })}>Revisar agendamento</Button>
      </div>
    </PageShell>
  );
}
