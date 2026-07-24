import Link from "next/link";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: {
    text: string;
    href: string;
    label: string;
  };
}

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <section className="page-container flex min-h-[68vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
          Cinematic
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        <div className="mt-7">{children}</div>
        <p className="mt-7 border-t border-white/8 pt-5 text-center text-sm text-zinc-500">
          {footer.text}{" "}
          <Link href={footer.href} className="font-semibold text-red-300 hover:text-red-200">
            {footer.label}
          </Link>
        </p>
      </div>
    </section>
  );
}

