export type Period = { start: string; end: string }; // "HH:MM"
export type DayConfig = { enabled: boolean; periods: Period[] };
export type Weekly = Record<number, DayConfig>; // 0 = domingo
export type Block =
  | { id: string; kind: "day"; date: string; reason?: string }
  | { id: string; kind: "time"; date: string; start: string; end: string; reason?: string }
  | { id: string; kind: "range"; date: string; endDate: string; reason?: string };
export type Booking = {
  id: string;
  serviceId: string;
  date: string;
  time: string;
  duration: number;
  notes?: string;
  clientName: string;
  status: "confirmado" | "cancelado";
};

export const SLOT_STEP = 30;

export const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
export const toTime = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const fmtTime = (t: string) => {
  const [h, m] = t.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
};

export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const parseKey = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export function validateDay(day: DayConfig): string | null {
  if (!day.enabled) return null;
  if (day.periods.length === 0) return "Adicione ao menos um período.";
  for (const p of day.periods) {
    if (!p.start || !p.end) return "Preencha início e fim.";
    if (toMin(p.end) <= toMin(p.start)) return "O horário final deve ser posterior ao inicial.";
  }
  const sorted = [...day.periods].sort((a, b) => toMin(a.start) - toMin(b.start));
  for (let i = 1; i < sorted.length; i++) {
    if (toMin(sorted[i].start) < toMin(sorted[i - 1].end)) return "Os períodos não podem se sobrepor.";
  }
  return null;
}

export function isDayBlocked(date: string, blocks: Block[]) {
  return blocks.some(
    (b) => (b.kind === "day" && b.date === date) || (b.kind === "range" && date >= b.date && date <= b.endDate),
  );
}

export type SlotState = "livre" | "ocupado" | "bloqueado" | "passado";
export type Slot = { time: string; state: SlotState };

/** Todos os horários do expediente do dia, com estado. Bloqueios prevalecem sobre a disponibilidade semanal. */
export function getSlots(
  date: string,
  duration: number,
  weekly: Weekly,
  blocks: Block[],
  bookings: Booking[],
  now: Date = new Date(),
): Slot[] {
  const day = weekly[parseKey(date).getDay()];
  if (!day?.enabled) return [];
  const fullBlock = isDayBlocked(date, blocks);
  const timeBlocks = blocks.filter((b): b is Extract<Block, { kind: "time" }> => b.kind === "time" && b.date === date);
  const active = bookings.filter((b) => b.status === "confirmado" && b.date === date);
  const today = dateKey(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const slots: Slot[] = [];
  for (const p of day.periods) {
    for (let s = toMin(p.start); s + duration <= toMin(p.end); s += SLOT_STEP) {
      const e = s + duration;
      let state: SlotState = "livre";
      if (date < today || (date === today && s <= nowMin)) state = "passado";
      else if (fullBlock || timeBlocks.some((b) => s < toMin(b.end) && e > toMin(b.start))) state = "bloqueado";
      else if (active.some((b) => s < toMin(b.time) + b.duration && e > toMin(b.time))) state = "ocupado";
      slots.push({ time: toTime(s), state });
    }
  }
  return slots;
}

export function hasFreeSlot(date: string, duration: number, weekly: Weekly, blocks: Block[], bookings: Booking[], now = new Date()) {
  return getSlots(date, duration, weekly, blocks, bookings, now).some((s) => s.state === "livre");
}
