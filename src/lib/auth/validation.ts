import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Email không hợp lệ."));

const passwordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
  .regex(/[A-Za-z]/, "Mật khẩu phải có ít nhất một chữ cái.")
  .regex(/[0-9]/, "Mật khẩu phải có ít nhất một chữ số.");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .max(80, "Tên không được dài quá 80 ký tự.")
    .optional()
    .transform((value) => value || undefined),
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;

