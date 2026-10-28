import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dateKey } from "@/lib/booking/availability";

type Props = {
  selected?: string;
  onSelect: (k: string) => void;
  isAvailable: (k: string) => boolean;
};

const WD = ["D", "S", "T", "Q", "Q", "S", "S"];

export function MonthCalendar({ selected, onSelect, isAvailable }: Props) {
  const today = new Date();
  const todayKey = dateKey(today);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const first = view.getDay();
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1);
  const move = (n: number) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button type="button" className="btn btn-ghost size-11 px-0" onClick={() => move(-1)} disabled={!canPrev} aria-label="Mês anterior"><ChevronLeft className="size-4" /></button>
        <p className="font-display text-xl capitalize">{view.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</p>
        <button type="button" className="btn btn-ghost size-11 px-0" onClick={() => move(1)} aria-label="Próximo mês"><ChevronRight className="size-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WD.map((d, i) => <span key={i} className="pb-2 text-xs text-muted-foreground">{d}</span>)}
        {Array.from({ length: first }).map((_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const k = dateKey(new Date(view.getFullYear(), view.getMonth(), i + 1));
          const past = k < todayKey;
          const ok = !past && isAvailable(k);
          const sel = k === selected;
          return (
            <button
              key={k}
              type="button"
              disabled={!ok}
              onClick={() => onSelect(k)}
              aria-pressed={sel}
              aria-label={`${i + 1}${ok ? ", disponível" : ", indisponível"}`}
              className={`relative aspect-square min-h-10 rounded-lg text-sm transition ${
                sel ? "bg-primary font-semibold text-primary-foreground"
                : ok ? "bg-sage/60 text-foreground hover:bg-sage"
                : "text-muted-foreground/50 line-through decoration-muted-foreground/40"
              } ${k === todayKey && !sel ? "ring-1 ring-primary/40" : ""}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-sage" /> Disponível</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-primary" /> Selecionado</span>
        <span className="flex items-center gap-1.5"><span className="text-muted-foreground/60 line-through">12</span> Indisponível</span>
      </div>
    </div>
  );
}
