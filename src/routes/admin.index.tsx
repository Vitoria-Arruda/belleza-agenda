import { createFileRoute, Link } from "@tanstack/react-router";
import { useBooking } from "@/lib/booking/store";
import { dateKey, fmtTime } from "@/lib/booking/availability";
import { WEEKDAYS, WEEK_ORDER, fmtDate, getService } from "@/lib/booking/data";

export const Route = createFileRoute("/admin/")({ component: Overview });

function Overview() {
  const { bookings, blocks, weekly } = useBooking();
  const today = dateKey(new Date());
  const upcoming = bookings.filter((b) => b.status === "confirmado" && b.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const stats = [
    ["Agendamentos confirmados", bookings.filter((b) => b.status === "confirmado").length],
    ["Próximos", upcoming.length],
    ["Cancelados", bookings.filter((b) => b.status === "cancelado").length],
    ["Bloqueios ativos", blocks.length],
  ] as const;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([l, v]) => (
          <div key={l} className="card p-4"><p className="font-display text-4xl">{v}</p><p className="text-sm text-muted-foreground">{l}</p></div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-2xl">Próximos compromissos</h2>
          {upcoming.length ? (
            <ul className="mt-3 divide-y">
              {upcoming.slice(0, 5).map((b) => (
                <li key={b.id} className="flex justify-between gap-3 py-3 text-sm">
                  <span><span className="font-medium">{getService(b.serviceId)?.name}</span><br /><span className="text-muted-foreground">{b.clientName}</span></span>
                  <span className="text-right capitalize text-muted-foreground">{fmtDate(b.date, { weekday: "short", day: "numeric", month: "short" })}<br />{fmtTime(b.time)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-muted-foreground">Nenhum compromisso futuro.</p>}
        </section>
        <section className="card p-5">
          <div className="flex items-center justify-between"><h2 className="text-2xl">Expediente semanal</h2><Link to="/admin/disponibilidade" className="text-sm text-primary underline-offset-4 hover:underline">Editar</Link></div>
          <ul className="mt-3 space-y-2 text-sm">
            {WEEK_ORDER.map((d) => (
              <li key={d} className="flex justify-between gap-3">
                <span>{WEEKDAYS[d]}</span>
                <span className={weekly[d].enabled ? "" : "text-muted-foreground"}>
                  {weekly[d].enabled ? weekly[d].periods.map((p) => `${fmtTime(p.start)}–${fmtTime(p.end)}`).join(" · ") : "Indisponível"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
