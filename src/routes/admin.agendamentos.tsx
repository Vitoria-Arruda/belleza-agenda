import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useBooking } from "@/lib/booking/store";
import { BookingList } from "@/components/booking-list";

export const Route = createFileRoute("/admin/agendamentos")({
  head: () => ({ meta: [
    { title: "Agenda do profissional — Ateliê Lume" },
    { name: "description", content: "Consulte e gerencie os agendamentos demonstrativos do Ateliê Lume." },
    { property: "og:title", content: "Agenda do profissional — Ateliê Lume" },
    { property: "og:description", content: "Consulte e gerencie os agendamentos demonstrativos do Ateliê Lume." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Agendamentos });

function Agendamentos() {
  const { bookings } = useBooking();
  const [filter, setFilter] = useState<"todos" | "confirmado" | "cancelado">("todos");
  const items = filter === "todos" ? bookings : bookings.filter((b) => b.status === filter);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl">Agendamentos</h1>
      <div className="mt-4 flex gap-2">
        {(["todos", "confirmado", "cancelado"] as const).map((f) => (
          <Button variant="plain" size="auto" key={f} aria-pressed={filter === f} onClick={() => setFilter(f)} className={`min-h-10 rounded-full border px-4 text-sm capitalize ${filter === f ? "border-primary bg-secondary text-secondary-foreground" : "bg-card"}`}>{f === "todos" ? "Todos" : f + "s"}</Button>
        ))}
      </div>
      <div className="mt-6">{items.length ? <BookingList items={items} showClient /> : <p className="card p-6 text-sm text-muted-foreground">Nenhum agendamento.</p>}</div>
    </div>
  );
}
