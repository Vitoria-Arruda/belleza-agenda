import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useBooking } from "@/lib/booking/store";
import { BookingList } from "@/components/booking-list";

export const Route = createFileRoute("/admin/agendamentos")({ component: Agendamentos });

function Agendamentos() {
  const { bookings } = useBooking();
  const [filter, setFilter] = useState<"todos" | "confirmado" | "cancelado">("todos");
  const items = filter === "todos" ? bookings : bookings.filter((b) => b.status === filter);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl">Agendamentos</h1>
      <div className="mt-4 flex gap-2">
        {(["todos", "confirmado", "cancelado"] as const).map((f) => (
          <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)} className={`min-h-10 rounded-full border px-4 text-sm capitalize ${filter === f ? "border-primary bg-secondary text-secondary-foreground" : "bg-card"}`}>{f === "todos" ? "Todos" : f + "s"}</button>
        ))}
      </div>
      <div className="mt-6">{items.length ? <BookingList items={items} showClient /> : <p className="card p-6 text-sm text-muted-foreground">Nenhum agendamento.</p>}</div>
    </div>
  );
}
