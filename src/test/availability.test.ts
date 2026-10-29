import { describe, expect, it } from "vitest";
import { getSlots, validateBlock, validateDay, type Block, type Weekly } from "@/lib/booking/availability";

const weekly: Weekly = {
  0: { enabled: false, periods: [] },
  1: { enabled: true, periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "18:00" }] },
  2: { enabled: true, periods: [{ start: "09:00", end: "12:00" }] },
  3: { enabled: false, periods: [] },
  4: { enabled: true, periods: [{ start: "10:00", end: "19:00" }] },
  5: { enabled: true, periods: [{ start: "09:00", end: "12:00" }] },
  6: { enabled: false, periods: [] },
};
const now = new Date(2030, 0, 1, 8, 0); // terça
const MON = "2030-01-07";
const free = (s: ReturnType<typeof getSlots>) => s.filter((x) => x.state === "livre").map((x) => x.time);

describe("disponibilidade", () => {
  it("dia indisponível não oferece horários", () => {
    expect(getSlots("2030-01-09", 30, weekly, [], [], now)).toEqual([]);
  });
  it("bloqueio de dia inteiro remove todos os horários", () => {
    const b: Block[] = [{ id: "1", kind: "day", date: MON }];
    expect(free(getSlots(MON, 30, weekly, b, [], now))).toEqual([]);
  });
  it("bloqueio entre datas cobre o intervalo", () => {
    const b: Block[] = [{ id: "1", kind: "range", date: "2030-01-05", endDate: "2030-01-08" }];
    expect(free(getSlots(MON, 30, weekly, b, [], now))).toEqual([]);
  });
  it("bloqueio parcial retira apenas horários afetados (14h às 16h)", () => {
    const b: Block[] = [{ id: "1", kind: "time", date: MON, start: "14:00", end: "16:00" }];
    const f = free(getSlots(MON, 30, weekly, b, [], now));
    expect(f).not.toContain("14:00");
    expect(f).not.toContain("15:30");
    expect(f).toContain("16:00");
    expect(f).toContain("09:00");
  });
  it("datas passadas não têm horários livres", () => {
    expect(free(getSlots("2029-12-31", 30, weekly, [], [], now))).toEqual([]);
  });
  it("horário ocupado fica indisponível", () => {
    const s = getSlots(MON, 30, weekly, [], [{ id: "x", serviceId: "a", date: MON, time: "09:00", duration: 60, clientName: "A", status: "confirmado" }], now);
    expect(free(s)).not.toContain("09:30");
    expect(free(s)).toContain("10:00");
  });
  it("valida fim posterior ao início e sobreposição", () => {
    expect(validateDay({ enabled: true, periods: [{ start: "12:00", end: "09:00" }] })).toBeTruthy();
    expect(validateDay({ enabled: true, periods: [{ start: "09:00", end: "12:00" }, { start: "11:00", end: "13:00" }] })).toBeTruthy();
    expect(validateDay({ enabled: true, periods: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "18:00" }] })).toBeNull();
  });
  it("rejeita períodos com horários inválidos", () => {
    expect(validateDay({ enabled: true, periods: [{ start: "25:00", end: "26:00" }] })).not.toBeNull();
  });
  it("exige início e fim para bloqueio parcial", () => {
    expect(validateBlock({ id: "x", kind: "time", date: MON, start: "", end: "16:00" })).not.toBeNull();
  });
  it("bloqueio parcial exige fim posterior ao início", () => {
    expect(validateBlock({ id: "x", kind: "time", date: MON, start: "16:00", end: "14:00" })).not.toBeNull();
  });
  it("bloqueio entre datas exige ordem cronológica", () => {
    expect(validateBlock({ id: "x", kind: "range", date: "2030-01-08", endDate: MON })).not.toBeNull();
  });
  it("cancelamento libera o horário ocupado", () => {
    const booking = { id: "x", serviceId: "a", date: MON, time: "09:00", duration: 60, clientName: "A", status: "cancelado" as const };
    expect(free(getSlots(MON, 30, weekly, [], [booking], now))).toContain("09:00");
  });
  it("remover bloqueio restaura expediente sem liberar horários ocupados", () => {
    const booking = { id: "x", serviceId: "a", date: MON, time: "14:00", duration: 60, clientName: "A", status: "confirmado" as const };
    expect(free(getSlots(MON, 30, weekly, [], [booking], now))).toContain("15:00");
    expect(free(getSlots(MON, 30, weekly, [], [booking], now))).not.toContain("14:00");
  });
  it("serviço deve caber inteiro no expediente", () => {
    const slots = free(getSlots(MON, 90, weekly, [], [], now));
    expect(slots).toContain("10:30");
    expect(slots).not.toContain("11:00");
    expect(slots).not.toContain("17:00");
  });
  it("mudança no expediente atualiza horários disponíveis", () => {
    const changed = { ...weekly, 1: { enabled: true, periods: [{ start: "10:00", end: "11:00" }] } };
    expect(free(getSlots(MON, 30, changed, [], [], now))).toEqual(["10:00", "10:30"]);
  });
});
