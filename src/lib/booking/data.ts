import { dateKey, type Booking, type Block, type Weekly } from "./availability";

export const BUSINESS = { name: "Ateliê Lume", tagline: "Beleza & bem-estar" };

export type Service = { id: string; name: string; description: string; duration: number; price: number };

export const SERVICES: Service[] = [
  { id: "sobrancelha", name: "Design de sobrancelhas", description: "Mapeamento facial e modelagem com pinça.", duration: 30, price: 70 },
  { id: "lash", name: "Extensão de cílios", description: "Técnica fio a fio para um olhar natural.", duration: 90, price: 180 },
  { id: "limpeza", name: "Limpeza de pele", description: "Higienização profunda e hidratação.", duration: 60, price: 150 },
  { id: "manicure", name: "Manicure & esmaltação", description: "Cutilagem cuidadosa e esmaltação em gel.", duration: 60, price: 65 },
  { id: "make", name: "Maquiagem social", description: "Make para eventos, com preparação de pele.", duration: 60, price: 220 },
  { id: "massagem", name: "Massagem relaxante", description: "Óleos aromáticos e toque terapêutico.", duration: 60, price: 160 },
];

export const getService = (id: string) => SERVICES.find((s) => s.id === id);

export const WEEKDAYS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export const initialWeekly = (): Weekly => ({
  0: { enabled: false, periods: [] },
  1: { enabled: true, periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "18:00" }] },
  2: { enabled: true, periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "18:00" }] },
  3: { enabled: false, periods: [] },
  4: { enabled: true, periods: [{ start: "10:00", end: "19:00" }] },
  5: { enabled: true, periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "18:00" }] },
  6: { enabled: true, periods: [{ start: "09:00", end: "13:00" }] },
});

function nextWeekday(wd: number, offsetWeeks = 0) {
  const d = new Date();
  d.setDate(d.getDate() + ((wd - d.getDay() + 7) % 7 || 7) + offsetWeeks * 7);
  return dateKey(d);
}

export const initialBookings = (): Booking[] => [
  { id: "b1", serviceId: "limpeza", date: nextWeekday(1), time: "10:00", duration: 60, clientName: "Marina Lopes", status: "confirmado" },
  { id: "b2", serviceId: "sobrancelha", date: nextWeekday(4), time: "15:00", duration: 30, clientName: "Juliana Reis", status: "confirmado" },
];

export const initialBlocks = (): Block[] => [
  { id: "k1", kind: "time", date: nextWeekday(2), start: "14:00", end: "16:00", reason: "Curso de atualização" },
];

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const fmtDate = (k: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) => {
  const [y = 1970, m = 1, d = 1] = k.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", opts);
};
export const fmtDuration = (m: number) => (m < 60 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)}h${m % 60}` : `${m / 60}h`);
