import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { safeCallbackPath } from "@/lib/auth/callback-url";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; registered?: string }>;
}) {
  const [session, query] = await Promise.all([auth(), searchParams]);
  const callbackUrl = safeCallbackPath(query.callbackUrl);
  if (session?.user) redirect(callbackUrl);

  return (
    <AuthCard
      title="Chào mừng trở lại"
      description="Đăng nhập để quản lý tài khoản và danh sách phim yêu thích."
      footer={{
        text: "Chưa có tài khoản?",
        href: "/dang-ky",
        label: "Đăng ký",
      }}
    >
      <SignInForm
        callbackUrl={callbackUrl}
        registered={query.registered === "1"}
      />
    </AuthCard>
  );
}

