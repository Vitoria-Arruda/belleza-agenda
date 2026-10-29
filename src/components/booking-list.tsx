import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Booking } from "@/lib/booking/availability";
import { fmtTime } from "@/lib/booking/availability";
import { brl, fmtDate, fmtDuration, getService } from "@/lib/booking/data";
import { ConfirmDialog, StatusBadge } from "./confirm-dialog";
import { useBooking } from "@/lib/booking/store";

export function BookingList({ items, showClient }: { items: Booking[]; showClient?: boolean }) {
  const { cancelBooking } = useBooking();
  const [open, setOpen] = useState<string | null>(null);
  const [toCancel, setToCancel] = useState<string | null>(null);
  const sorted = [...items].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <>
      <ul className="space-y-3">
        {sorted.map((b) => {
          const s = getService(b.serviceId);
          const expanded = open === b.id;
          return (
            <li key={b.id} className={`card p-4 sm:p-5 ${b.status === "cancelado" ? "opacity-70" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl">{s?.name}</p>
                  <p className="text-sm capitalize text-muted-foreground">{fmtDate(b.date)} · {fmtTime(b.time)}</p>
                  {showClient && <p className="text-sm">{b.clientName}</p>}
                </div>
                <StatusBadge status={b.status} />
              </div>
              {expanded && (
                <dl className="mt-4 grid gap-1 rounded-lg bg-muted p-3 text-sm sm:grid-cols-2">
                  <div><dt className="inline text-muted-foreground">Duração: </dt><dd className="inline">{fmtDuration(b.duration)}</dd></div>
                  <div><dt className="inline text-muted-foreground">Valor: </dt><dd className="inline">{s && brl(s.price)}</dd></div>
                  <div className="sm:col-span-2"><dt className="inline text-muted-foreground">Cliente: </dt><dd className="inline">{b.clientName}</dd></div>
                  {b.notes && <div className="sm:col-span-2"><dt className="inline text-muted-foreground">Observações: </dt><dd className="inline">{b.notes}</dd></div>}
                </dl>
              )}
              <div className="mt-3 flex gap-2">
                <Button variant="plain" size="auto" className="btn btn-ghost min-h-10 px-3 text-sm" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : b.id)}>{expanded ? "Ocultar detalhes" : "Ver detalhes"}</Button>
                {b.status === "confirmado" && <Button variant="plain" size="auto" className="btn btn-ghost min-h-10 px-3 text-sm text-destructive" onClick={() => setToCancel(b.id)}>Cancelar</Button>}
              </div>
            </li>
          );
        })}
      </ul>
      <ConfirmDialog
        open={!!toCancel} title="Cancelar agendamento?" text="O horário ficará livre novamente. Esta ação não pode ser desfeita."
        confirmLabel="Sim, cancelar" onConfirm={() => toCancel && cancelBooking(toCancel)} onClose={() => setToCancel(null)}
      />
    </>
  );
}
