import { describe, expect, it } from "vitest";
import { formatCPF, formatPhone, validateClient } from "@/lib/booking/validation";

const valid = { name: "Maria da Silva", email: "maria@example.com", phone: "11912345678", cpf: "12345678901" };
describe("cadastro demonstrativo", () => {
  it("exige todos os campos obrigatórios", () => {
    expect(Object.keys(validateClient({ name: "", email: "", phone: "", cpf: "" })).sort()).toEqual(["cpf", "email", "name", "phone"]);
  });
  it("rejeita email sem formato válido", () => {
    expect(validateClient({ ...valid, email: "maria@" })).toHaveProperty("email");
  });
  it("aceita cadastro com campos preenchidos e formatos válidos", () => {
    expect(validateClient(valid)).toEqual({});
  });
  it("formata telefone com DDD", () => {
    expect(formatPhone("11912345678")).toBe("(11) 91234-5678");
  });
  it("formata CPF", () => {
    expect(formatCPF("12345678901")).toBe("123.456.789-01");
  });
});