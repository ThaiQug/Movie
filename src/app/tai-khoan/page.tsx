import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { HeartIcon } from "@/components/ui/icons";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/dang-nhap?callbackUrl=/tai-khoan");

  return (
    <section className="page-container py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
          Tài khoản
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          Xin chào, {session.user.name || "bạn"}
        </h1>
        <p className="mt-3 text-zinc-400">{session.user.email}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/tai-khoan/yeu-thich"
          className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-red-400/30 hover:bg-red-500/[0.06]"
        >
          <HeartIcon className="size-7 text-red-400" />
          <h2 className="mt-5 text-lg font-bold">Phim yêu thích</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Xem và quản lý những bộ phim bạn đã lưu.
          </p>
        </Link>
      </div>

      <div className="mt-10 border-t border-white/8 pt-6">
        <SignOutButton />
      </div>
    </section>
  );
}

