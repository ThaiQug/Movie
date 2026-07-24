import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/tai-khoan");

  return (
    <AuthCard
      title="Tạo tài khoản"
      description="Đăng ký bằng email để lưu những bộ phim bạn yêu thích."
      footer={{
        text: "Đã có tài khoản?",
        href: "/dang-nhap",
        label: "Đăng nhập",
      }}
    >
      <RegisterForm />
    </AuthCard>
  );
}

