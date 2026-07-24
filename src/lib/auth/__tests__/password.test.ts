import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../password";

describe("password hashing", () => {
  it("creates a bcrypt hash and verifies only the original password", async () => {
    const password = "matkhau123";
    const passwordHash = await hashPassword(password);

    expect(passwordHash).not.toBe(password);
    expect(passwordHash).toMatch(/^\$2[aby]\$/);
    await expect(verifyPassword(password, passwordHash)).resolves.toBe(true);
    await expect(verifyPassword("sai-mat-khau", passwordHash)).resolves.toBe(
      false,
    );
  });

  it("uses a unique salt for each hash", async () => {
    const [first, second] = await Promise.all([
      hashPassword("matkhau123"),
      hashPassword("matkhau123"),
    ]);

    expect(first).not.toBe(second);
  });
});
