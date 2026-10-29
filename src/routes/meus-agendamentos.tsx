import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-header";
import { BookingList } from "@/components/booking-list";
import { useBooking } from "@/lib/booking/store";

export const Route = createFileRoute("/meus-agendamentos")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Meus agendamentos — Ateliê Lume" },
      { name: "description", content: "Consulte e cancele seus agendamentos." },
      { property: "og:title", content: "Meus agendamentos — Ateliê Lume" },
      { property: "og:description", content: "Consulte e cancele seus agendamentos." },
    ],
  }),
  component: Meus,
});

function Meus() {
  const { client, bookings } = useBooking();
  const mine = client ? bookings.filter((b) => b.clientName === client.name) : [];
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-4xl">Meus agendamentos</h1>
          <Link to={client ? "/agendar" : "/cadastro"} className="btn btn-primary">Novo agendamento</Link>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Os dados desta sessão são reiniciados ao recarregar a página.</p>
        <div className="mt-6">
          {mine.length ? <BookingList items={mine} /> : (
            <div className="card p-8 text-center text-sm text-muted-foreground">
              {client ? "Você ainda não tem agendamentos nesta sessão." : "Faça seu cadastro e agende para ver seus horários aqui."}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
