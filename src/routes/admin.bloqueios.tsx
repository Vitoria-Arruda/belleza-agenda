import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useBooking } from "@/lib/booking/store";
import { dateKey, fmtTime, validateBlock, type Block } from "@/lib/booking/availability";
import { fmtDate } from "@/lib/booking/data";
import { ConfirmDialog } from "@/components/confirm-dialog";

export const Route = createFileRoute("/admin/bloqueios")({ component: Bloqueios });

const KINDS = [
  { k: "day", label: "Dia inteiro" },
  { k: "time", label: "Horário / intervalo" },
  { k: "range", label: "Período entre datas" },
] as const;

function Bloqueios() {
  const { blocks, addBlock, removeBlock } = useBooking();
  const today = dateKey(new Date());
  const [kind, setKind] = useState<Block["kind"]>("day");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [start, setStart] = useState("14:00");
  const [end, setEnd] = useState("16:00");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [toRemove, setToRemove] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOk(false);
    const r = reason.trim() || undefined;
    const block: Block = kind === "day" ? { id: "", kind, date, reason: r } : kind === "time" ? { id: "", kind, date, start, end, reason: r } : { id: "", kind, date, endDate, reason: r };
    const validation = validateBlock(block);
    if (validation) return setError(validation);
    addBlock(block);
    setError(""); setReason(""); setOk(true);
  };

  const describe = (b: Block) => {
    const short = (k: string) => fmtDate(k, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    if (b.kind === "day") return ["Dia inteiro", short(b.date)];
    if (b.kind === "time") return ["Horário", `${short(b.date)} · ${fmtTime(b.start)} às ${fmtTime(b.end)}`];
    return ["Período", `${short(b.date)} até ${short(b.endDate)}`];
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <section>
        <h1 className="text-3xl">Novo bloqueio</h1>
        <p className="mt-1 text-sm text-muted-foreground">Folgas, férias e compromissos. Bloqueios prevalecem sobre o expediente.</p>
        <form onSubmit={submit} className="card mt-6 space-y-4 p-5" noValidate>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Tipo de bloqueio</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {KINDS.map((o) => (
                <button key={o.k} type="button" aria-pressed={kind === o.k} onClick={() => { setKind(o.k); setError(""); }}
                  className={`min-h-11 rounded-lg border px-3 text-sm ${kind === o.k ? "border-primary bg-secondary font-medium text-secondary-foreground" : "bg-card"}`}>{o.label}</button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="bd" className="mb-1.5 block text-sm font-medium">{kind === "range" ? "Data inicial" : "Data"} <span className="text-primary">*</span></label>
              <input id="bd" type="date" min={today} className="field" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            {kind === "range" && (
              <div>
                <label htmlFor="be" className="mb-1.5 block text-sm font-medium">Data final <span className="text-primary">*</span></label>
                <input id="be" type="date" min={date || today} className="field" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            )}
          </div>
          {kind === "time" && (
            <div className="grid grid-cols-2 gap-3">
              <div><label htmlFor="bs" className="mb-1.5 block text-sm font-medium">Das</label><input id="bs" type="time" step={1800} className="field" value={start} onChange={(e) => setStart(e.target.value)} /></div>
              <div><label htmlFor="bf" className="mb-1.5 block text-sm font-medium">Até</label><input id="bf" type="time" step={1800} className="field" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
            </div>
          )}
          <div>
            <label htmlFor="br" className="mb-1.5 block text-sm font-medium">Motivo <span className="font-normal text-muted-foreground">(opcional)</span></label>
            <input id="br" className="field" placeholder="Ex.: férias, consulta médica" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          {ok && <p className="text-sm text-sage-foreground" role="status">✓ Bloqueio adicionado e aplicado ao calendário.</p>}
          <button className="btn btn-primary w-full">Adicionar bloqueio</button>
        </form>
      </section>
      <section>
        <h2 className="text-3xl">Bloqueios cadastrados</h2>
        {blocks.length ? (
          <ul className="mt-6 space-y-3">
            {[...blocks].sort((a, b) => a.date.localeCompare(b.date)).map((b) => {
              const [t, d] = describe(b);
              return (
                <li key={b.id} className="card flex items-start justify-between gap-3 p-4">
                  <div>
                    <span className="rounded-full bg-lavender px-2.5 py-0.5 text-xs font-medium text-accent-foreground">{t}</span>
                    <p className="mt-2 text-sm capitalize">{d}</p>
                    {b.reason && <p className="text-sm text-muted-foreground">{b.reason}</p>}
                  </div>
                  <button className="btn btn-ghost min-h-10 px-3 text-sm text-destructive" onClick={() => setToRemove(b.id)}>Remover</button>
                </li>
              );
            })}
          </ul>
        ) : <p className="card mt-6 p-6 text-sm text-muted-foreground">Nenhum bloqueio cadastrado.</p>}
      </section>
      <ConfirmDialog open={!!toRemove} title="Remover bloqueio?" text="O expediente habitual volta a valer neste período." confirmLabel="Remover" onConfirm={() => toRemove && removeBlock(toRemove)} onClose={() => setToRemove(null)} />
    </div>
  );
}
