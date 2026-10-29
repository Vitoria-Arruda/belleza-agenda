import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-header";
import { SERVICES, brl, fmtDuration } from "@/lib/booking/data";
import hero from "@/assets/atelier.jpg";
import { ArrowRight, CalendarDays, Clock3, Flower2, Sparkles, Heart, Eye, Paintbrush, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Ateliê Lume — Beleza & bem-estar com hora marcada" },
      { name: "description", content: "Conheça nossos serviços de estética e agende seu horário em poucos passos." },
      { property: "og:title", content: "Ateliê Lume — Beleza & bem-estar" },
      { property: "og:description", content: "Conheça nossos serviços e agende seu horário em poucos passos." },
    ],
  }),
  component: Index,
});

function Index() {
  const icons = [Eye, Sparkles, Flower2, Hand, Paintbrush, Heart];
  return (
    <PageShell>
      <section className="relative -mx-4 -mt-8 overflow-hidden border-b sm:-mt-12" aria-labelledby="welcome">
        <img src={hero} alt="Espaço ilustrativo do Ateliê Lume, com maca rosa e bancada de cuidados" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
        <div className="relative bg-background/85 px-6 py-12 sm:bg-background/70 sm:px-12 sm:py-16 md:w-3/5 md:bg-background/85 lg:py-20">
          <p className="eyebrow flex items-center gap-2"><Flower2 className="size-4 text-primary" /> Beleza & bem-estar</p>
          <h1 id="welcome" className="mt-5 text-5xl leading-tight sm:text-6xl">Ateliê Lume</h1>
          <p className="mt-3 font-display text-3xl leading-tight">Seu momento de <em className="text-primary">cuidado.</em></p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-foreground">
            Bem-vinda. Um espaço para valorizar sua beleza e desacelerar. Escolha seu cuidado e encontre o melhor horário para você.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="plain" size="auto" className="btn btn-primary px-6"><Link to="/cadastro"><CalendarDays className="size-4" /> Fazer meu agendamento <ArrowRight className="size-4" /></Link></Button>
            <Button asChild variant="plain" size="auto" className="btn btn-outline"><Link to="/meus-agendamentos">Meus agendamentos</Link></Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><Heart className="size-3.5 text-primary" /> Beleza com atenção a cada detalhe</p>
        </div>
      </section>

      <section className="mt-10 sm:mt-12">
        <p className="eyebrow mb-2">Escolha seu cuidado</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl sm:text-4xl">Serviços</h2>
          <span className="text-xs text-muted-foreground">Valores e serviços demonstrativos</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = icons[i] ?? Flower2;
            return <article key={s.id} className="card flex flex-col p-5 transition hover:border-primary/40">
              <span className={`mb-4 grid size-10 place-items-center rounded-lg ${i % 3 === 0 ? "bg-blush text-secondary-foreground" : i % 3 === 1 ? "bg-lavender text-accent-foreground" : "bg-sage text-sage-foreground"}`}><Icon className="size-5" strokeWidth={1.5} /></span>
              <h3 className="text-2xl">{s.name}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{s.description}</p>
              <p className="mt-5 flex items-center justify-between border-t pt-4 text-sm"><span className="font-medium">{brl(s.price)}</span> <span className="flex items-center gap-1.5 text-muted-foreground"><Clock3 className="size-3.5" />{fmtDuration(s.duration)}</span></p>
            </article>;
          })}
        </div>
      </section>

      <section className="mt-12 flex flex-col items-start justify-between gap-4 border-t py-8 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow">Acesso demonstrativo</p>
          <p className="mt-1 font-display text-2xl">Área do profissional</p>
          <p className="text-sm text-muted-foreground">Sua agenda, disponibilidade e bloqueios.</p>
        </div>
        <Button asChild variant="plain" size="auto" className="btn btn-outline"><Link to="/admin">Abrir painel <ArrowRight className="size-4" /></Link></Button>
      </section>
    </PageShell>
  );
}
