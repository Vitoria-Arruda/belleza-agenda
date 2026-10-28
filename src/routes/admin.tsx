import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — Ateliê Lume" },
      { name: "description", content: "Configure disponibilidade, bloqueios e consulte agendamentos." },
      { property: "og:title", content: "Painel administrativo — Ateliê Lume" },
      { property: "og:description", content: "Configure disponibilidade, bloqueios e consulte agendamentos." },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Visão geral", exact: true },
  { to: "/admin/disponibilidade", label: "Disponibilidade" },
  { to: "/admin/bloqueios", label: "Bloqueios" },
  { to: "/admin/agendamentos", label: "Agendamentos" },
] as const;

function AdminLayout() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="eyebrow">Painel do profissional · acesso demonstrativo</p>
        <nav className="mt-3 -mx-4 flex gap-1 overflow-x-auto border-b px-4">
          {NAV.map((n) => (
            <Link
              key={n.to} to={n.to} activeOptions={{ exact: "exact" in n }}
              className="whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm text-muted-foreground hover:text-foreground"
              activeProps={{ className: "whitespace-nowrap border-b-2 border-primary px-3 py-3 text-sm font-medium text-foreground" }}
            >{n.label}</Link>
          ))}
        </nav>
        <div className="py-8"><Outlet /></div>
      </div>
    </div>
  );
}
