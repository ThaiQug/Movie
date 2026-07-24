import { describe, expect, it } from "vitest";
import { registerSchema, signInSchema } from "../validation";

describe("auth validation", () => {
  it("normalizes registration email and trims the optional name", () => {
    const result = registerSchema.parse({
      name: "  Nguyễn An  ",
      email: "  USER@Example.COM ",
      password: "matkhau123",
    });

    expect(result).toEqual({
      name: "Nguyễn An",
      email: "user@example.com",
      password: "matkhau123",
    });
  });

  it.each([
    ["too short", "abc123"],
    ["missing a number", "matkhaudai"],
    ["missing a letter", "12345678"],
  ])("rejects a password that is %s", (_case, password) => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password,
    });

    expect(result.success).toBe(false);
  });

  it("requires a password when signing in", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});
