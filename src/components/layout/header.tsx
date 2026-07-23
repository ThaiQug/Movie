"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";

const navigation = [
  { href: "/", label: "Trang chủ" },
  { href: "/phim-bo", label: "Phim bộ" },
  { href: "/phim-le", label: "Phim lẻ" },
  { href: "/hoat-hinh", label: "Hoạt hình" },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#07080b]/88 backdrop-blur-xl">
      <div className="page-container flex h-16 items-center justify-between gap-5 sm:h-[4.5rem]">
        <Link
          href="/"
          className="shrink-0 text-lg font-black tracking-[0.18em] text-white"
          onClick={() => setIsOpen(false)}
        >
          CINE<span className="text-red-500">MATIC</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Chính">
          {navigation.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/tim-kiem"
            className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            aria-label="Tìm kiếm phim"
          >
            <SearchIcon className="size-5" />
          </Link>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 md:hidden"
            aria-label={isOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav
          id="mobile-navigation"
          className="border-t border-white/8 bg-[#0b0c10] px-4 py-3 md:hidden"
          aria-label="Di động"
        >
          <div className="mx-auto grid max-w-xl gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  pathname === item.href
                    ? "bg-red-500/12 text-red-300"
                    : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
