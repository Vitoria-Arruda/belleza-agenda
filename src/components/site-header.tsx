import { Link } from "@tanstack/react-router";
import { BUSINESS } from "@/lib/booking/data";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-full bg-blush font-display text-xl text-primary">L</span>
      <span className="leading-tight">
        <span className="block font-display text-xl">{BUSINESS.name}</span>
        <span className="eyebrow block text-[0.6rem]">{BUSINESS.tagline}</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const cls = "rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground";
  const active = { className: "rounded-full px-3 py-2 text-sm bg-secondary text-secondary-foreground" };
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Logo />
        <nav className="flex items-center gap-1">
          <Link to="/meus-agendamentos" className={cls} activeProps={active}>Meus agendamentos</Link>
          <Link to="/admin" className={`${cls} hidden sm:inline-flex`} activeProps={active}>Admin</Link>
        </nav>
      </div>
    </header>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">{children}</main>
    </div>
  );
}

export function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Cadastro", "Agendamento", "Confirmação"];
  return (
    <ol className="mb-8 flex items-center gap-2 text-xs sm:text-sm" aria-label="Etapas">
      {steps.map((s, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "now" : "next";
        return (
          <li key={s} className="flex items-center gap-2" aria-current={state === "now" ? "step" : undefined}>
            <span className={`grid size-7 place-items-center rounded-full border text-xs ${state === "now" ? "border-primary bg-primary text-primary-foreground" : state === "done" ? "border-sage-foreground/30 bg-sage text-sage-foreground" : "bg-card text-muted-foreground"}`}>
              {state === "done" ? "✓" : n}
            </span>
            <span className={state === "now" ? "font-medium" : "text-muted-foreground"}>{s}</span>
            {n < 3 && <span className="mx-1 h-px w-4 bg-border sm:w-8" />}
          </li>
        );
      })}
    </ol>
  );
}
