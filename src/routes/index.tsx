import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-header";
import { SERVICES, brl, fmtDuration } from "@/lib/booking/data";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ateliê Lume — Beleza & bem-estar com hora marcada" },
      { name: "description", content: "Conheça nossos serviços de estética e agende seu horário em poucos passos." },
      { property: "og:title", content: "Ateliê Lume — Beleza & bem-estar" },
      { property: "og:description", content: "Conheça nossos serviços e agende seu horário em poucos passos." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="eyebrow">Estética · Cílios · Sobrancelhas · Unhas</p>
          <h1 className="mt-4 text-5xl leading-[1.05] sm:text-6xl">Um tempo só seu, <em className="text-primary">com cuidado</em> em cada detalhe.</h1>
          <p className="mt-5 max-w-md text-muted-foreground">
            Bem-vinda ao Ateliê Lume. Escolha o serviço, veja os horários livres e garanta seu momento em menos de um minuto.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/cadastro" className="btn btn-primary px-7">Fazer meu agendamento</Link>
            <Link to="/meus-agendamentos" className="btn btn-outline">Meus agendamentos</Link>
          </div>
        </div>
        <img src={hero} alt="Ambiente do ateliê com flores secas e tecidos suaves" width={1280} height={960} className="aspect-[4/3] w-full rounded-2xl object-cover" />
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl sm:text-4xl">Serviços</h2>
          <span className="text-sm text-muted-foreground">Valores demonstrativos</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article key={s.id} className="card p-5">
              <h3 className="text-2xl">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
              <p className="mt-4 text-sm"><span className="font-medium">{brl(s.price)}</span> <span className="text-muted-foreground">· {fmtDuration(s.duration)}</span></p>
            </article>
          ))}
        </div>
      </section>

      <section className="card mt-16 flex flex-col items-start justify-between gap-4 bg-champagne/50 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow">Protótipo</p>
          <p className="mt-1 font-display text-2xl">Área do profissional</p>
          <p className="text-sm text-muted-foreground">Acesso demonstrativo para configurar horários e bloqueios.</p>
        </div>
        <Link to="/admin" className="btn btn-outline">Abrir painel</Link>
      </section>
    </PageShell>
  );
}
