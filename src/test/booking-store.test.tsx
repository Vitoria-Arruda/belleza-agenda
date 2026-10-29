import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { BookingProvider, useBooking } from "@/lib/booking/store";

afterEach(() => vi.useRealTimers());

describe("booking confirmation", () => {
  it("rejects a second overlapping confirmation in the same action", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2030, 0, 1, 8));
    const { result } = renderHook(() => useBooking(), { wrapper: BookingProvider });
    const booking = { serviceId: "sobrancelha", date: "2030-01-07", time: "09:00", duration: 30, clientName: "Cliente Teste" };
    let first, second;
    act(() => {
      first = result.current.addBooking(booking);
      second = result.current.addBooking(booking);
    });
    expect(first).toMatchObject({ status: "confirmado", time: "09:00" });
    expect(second).toBeNull();
    expect(result.current.bookings.filter((b) => b.clientName === "Cliente Teste")).toHaveLength(1);
  });

  it("rejects confirmation after administrative day blocking", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2030, 0, 1, 8));
    const { result } = renderHook(() => useBooking(), { wrapper: BookingProvider });
    act(() => result.current.addBlock({ id: "", kind: "day", date: "2030-01-07" }));
    let booking;
    act(() => { booking = result.current.addBooking({ serviceId: "sobrancelha", date: "2030-01-07", time: "09:00", duration: 30, clientName: "Cliente Teste" }); });
    expect(booking).toBeNull();
  });
});