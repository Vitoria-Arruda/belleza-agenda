import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useBooking } from "@/lib/booking/store";
import { validateDay, type Weekly } from "@/lib/booking/availability";
import { WEEKDAYS, WEEK_ORDER } from "@/lib/booking/data";

export const Route = createFileRoute("/admin/disponibilidade")({
  head: () => ({ meta: [
    { title: "Disponibilidade semanal — Ateliê Lume" },
    { name: "description", content: "Configure os dias e períodos de atendimento do Ateliê Lume." },
    { property: "og:title", content: "Disponibilidade semanal — Ateliê Lume" },
    { property: "og:description", content: "Configure os dias e períodos de atendimento do Ateliê Lume." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Disponibilidade });

function Disponibilidade() {
  const { weekly, setWeekly } = useBooking();
  const [form, setForm] = useState<Weekly>(() => structuredClone(weekly));
  const [saved, setSaved] = useState<"ok" | "err" | null>(null);
  const errors = Object.fromEntries(WEEK_ORDER.map((d) => [d, validateDay(form[d] ?? { enabled: false, periods: [] })]));
  const hasErr = Object.values(errors).some(Boolean);

  const update = (d: number, fn: (c: Weekly[number]) => Weekly[number]) => { setSaved(null); setForm({ ...form, [d]: fn(form[d] ?? { enabled: false, periods: [] }) }); };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl">Disponibilidade semanal</h1>
      <p className="mt-1 text-sm text-muted-foreground">Defina o expediente habitual. Bloqueios pontuais prevalecem sobre estes horários.</p>
      <div className="mt-6 space-y-3">
        {WEEK_ORDER.map((d) => {
          const day = form[d];
          if (!day) return null;
          return (
            <div key={d} className="card p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{WEEKDAYS[d]}</span>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <span className={day.enabled ? "text-sage-foreground" : "text-muted-foreground"}>{day.enabled ? "Disponível" : "Indisponível"}</span>
                  <input
                    type="checkbox" role="switch" className="peer sr-only" checked={day.enabled}
                    onChange={(e) => update(d, (c) => ({ enabled: e.target.checked, periods: e.target.checked && !c.periods.length ? [{ start: "09:00", end: "18:00" }] : c.periods }))}
                  />
                  <span className="relative h-6 w-11 rounded-full bg-input transition peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-card after:transition peer-checked:after:translate-x-5" />
                </label>
              </div>
              {day.enabled && (
                <div className="mt-3 space-y-2">
                  {day.periods.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="time" step={1800} aria-label={`Início período ${i + 1}`} className="field max-w-36" value={p.start} onChange={(e) => update(d, (c) => ({ ...c, periods: c.periods.map((x, j) => (j === i ? { ...x, start: e.target.value } : x)) }))} />
                      <span className="text-sm text-muted-foreground">às</span>
                      <input type="time" step={1800} aria-label={`Fim período ${i + 1}`} className="field max-w-36" value={p.end} onChange={(e) => update(d, (c) => ({ ...c, periods: c.periods.map((x, j) => (j === i ? { ...x, end: e.target.value } : x)) }))} />
                      <Button variant="plain" size="auto" type="button" className="btn btn-ghost size-11 px-0" aria-label="Remover período" onClick={() => update(d, (c) => ({ ...c, periods: c.periods.filter((_, j) => j !== i) }))}><Trash2 className="size-4" /></Button>
                    </div>
                  ))}
                  <Button variant="plain" size="auto" type="button" className="btn btn-ghost min-h-10 px-3 text-sm text-primary" onClick={() => update(d, (c) => ({ ...c, periods: [...c.periods, { start: "14:00", end: "18:00" }] }))}><Plus className="size-4" /> Adicionar período</Button>
                  {errors[d] && <p className="text-sm text-destructive" role="alert">{errors[d]}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="sticky bottom-0 mt-6 flex flex-col items-center gap-3 border-t bg-background/95 py-4 sm:flex-row sm:justify-end">
        {saved === "ok" && <p className="text-sm text-sage-foreground" role="status">✓ Disponibilidade salva. O calendário do cliente já foi atualizado.</p>}
        {saved === "err" && <p className="text-sm text-destructive" role="alert">Corrija os erros destacados antes de salvar.</p>}
        <Button variant="plain" size="auto" className="btn btn-primary w-full sm:w-auto" onClick={() => { if (hasErr) return setSaved("err"); setWeekly(structuredClone(form)); setSaved("ok"); }}>Salvar disponibilidade</Button>
      </div>
    </div>
  );
}
