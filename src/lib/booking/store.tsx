import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import type { Block, Booking, Weekly } from "./availability";
import { getSlots } from "./availability";
import { getService, initialBlocks, initialBookings, initialWeekly } from "./data";

export type Client = { name: string; email: string; phone: string; cpf: string };
export type Draft = { serviceId?: string | undefined; date?: string | undefined; time?: string | undefined; notes: string };

type Store = {
  client: Client | null;
  setClient: (c: Client) => void;
  draft: Draft;
  setDraft: (d: Draft) => void;
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id" | "status">) => Booking | null;
  cancelBooking: (id: string) => void;
  weekly: Weekly;
  setWeekly: (w: Weekly) => void;
  blocks: Block[];
  addBlock: (b: Block) => void;
  removeBlock: (id: string) => void;
};

const Ctx = createContext<Store | null>(null);
const uid = () => Math.random().toString(36).slice(2, 9);

/** Estado apenas em memória: reinicia ao recarregar (sem persistência nesta etapa). */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [draft, setDraft] = useState<Draft>({ notes: "" });
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [weekly, setWeekly] = useState<Weekly>(initialWeekly);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const bookingsRef = useRef(bookings);
  bookingsRef.current = bookings;

  const value: Store = {
    client, setClient, draft, setDraft, bookings, weekly, setWeekly, blocks,
    addBooking: (b) => {
      const service = getService(b.serviceId);
      if (!service || b.duration !== service.duration || !getSlots(b.date, b.duration, weekly, blocks, bookingsRef.current).some((s) => s.time === b.time && s.state === "livre")) return null;
      const nb: Booking = { ...b, id: uid(), status: "confirmado" };
      bookingsRef.current = [...bookingsRef.current, nb];
      setBookings(bookingsRef.current);
      return nb;
    },
    cancelBooking: (id) => setBookings((p) => p.map((b) => (b.id === id ? { ...b, status: "cancelado" } : b))),
    addBlock: (b) => setBlocks((p) => [...p, { ...b, id: uid() }]),
    removeBlock: (id) => setBlocks((p) => p.filter((b) => b.id !== id)),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBooking fora do BookingProvider");
  return c;
}
