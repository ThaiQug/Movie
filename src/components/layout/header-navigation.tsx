"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MovieTaxonomy } from "@/lib/ophim";
import {
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from "@/components/ui/icons";

const navigation = [
  { href: "/", label: "Trang chủ" },
  { href: "/phim-bo", label: "Phim bộ" },
  { href: "/phim-le", label: "Phim lẻ" },
  { href: "/hoat-hinh", label: "Hoạt hình" },
];

type TaxonomyMenu = "categories" | "countries";

interface HeaderNavigationProps {
  user: {
    name?: string | null;
    email?: string | null;
  } | null;
  categories: MovieTaxonomy[];
  categoriesUnavailable?: boolean;
  countries: MovieTaxonomy[];
  countriesUnavailable?: boolean;
}

interface TaxonomyDropdownProps {
  id: string;
  label: string;
  basePath: "/the-loai" | "/quoc-gia";
  items: MovieTaxonomy[];
  unavailable: boolean;
  isOpen: boolean;
  isActive: boolean;
  onToggle: (trigger: HTMLButtonElement) => void;
  onNavigate: () => void;
}

function taxonomyHref(
  basePath: TaxonomyDropdownProps["basePath"],
  slug: string,
) {
  return `${basePath}/${encodeURIComponent(slug)}`;
}

function TaxonomyItems({
  basePath,
  items,
  unavailable,
  onNavigate,
}: Pick<
  TaxonomyDropdownProps,
  "basePath" | "items" | "unavailable" | "onNavigate"
>) {
  if (unavailable) {
    return (
      <p className="px-4 py-3 text-sm text-zinc-500" role="status">
        Tạm thời chưa tải được danh sách.
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="px-4 py-3 text-sm text-zinc-500" role="status">
        Danh sách đang được cập nhật.
      </p>
    );
  }

  return items.map((item) => (
    <Link
      key={item.id ?? item.slug}
      href={taxonomyHref(basePath, item.slug)}
      onClick={onNavigate}
      className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.06] focus-visible:outline-none"
    >
      {item.name}
    </Link>
  ));
}

function DesktopTaxonomyDropdown({
  id,
  label,
  basePath,
  items,
  unavailable,
  isOpen,
  isActive,
  onToggle,
  onNavigate,
}: TaxonomyDropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={(event) => onToggle(event.currentTarget)}
        className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-white/10 text-white"
            : "text-zinc-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        {label}
        <ChevronDownIcon
          className={`size-3.5 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen ? (
        <div
          id={id}
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(42rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#0b0c10]/98 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl"
        >
          <div className="grid max-h-[70vh] grid-cols-2 gap-1 overflow-y-auto sm:grid-cols-3">
            <TaxonomyItems
              basePath={basePath}
              items={items}
              unavailable={unavailable}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobileTaxonomyGroup({
  id,
  label,
  basePath,
  items,
  unavailable,
  isOpen,
  isActive,
  onToggle,
  onNavigate,
}: TaxonomyDropdownProps) {
  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={(event) => onToggle(event.currentTarget)}
        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium ${
          isActive ? "bg-red-500/12 text-red-300" : "text-zinc-300 hover:bg-white/5"
        }`}
      >
        {label}
        <ChevronDownIcon
          className={`size-4 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen ? (
        <div
          id={id}
          className="mt-1 grid max-h-64 grid-cols-2 gap-1 overflow-y-auto rounded-xl bg-black/20 p-2"
        >
          <TaxonomyItems
            basePath={basePath}
            items={items}
            unavailable={unavailable}
            onNavigate={onNavigate}
          />
        </div>
      ) : null}
    </div>
  );
}

export function HeaderNavigation({
  user,
  categories,
  categoriesUnavailable = false,
  countries,
  countriesUnavailable = false,
}: HeaderNavigationProps) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openTaxonomy, setOpenTaxonomy] = useState<TaxonomyMenu | null>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpenTaxonomy(null);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || openTaxonomy === null) return;
      setOpenTaxonomy(null);
      lastTriggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openTaxonomy]);

  function closeMenu() {
    setIsOpen(false);
    setOpenTaxonomy(null);
  }

  function toggleTaxonomy(menu: TaxonomyMenu, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    setOpenTaxonomy((current) => (current === menu ? null : menu));
  }

  const taxonomyMenus = [
    {
      menu: "categories" as const,
      label: "Thể loại",
      basePath: "/the-loai" as const,
      items: categories,
      unavailable: categoriesUnavailable,
    },
    {
      menu: "countries" as const,
      label: "Quốc gia",
      basePath: "/quoc-gia" as const,
      items: countries,
      unavailable: countriesUnavailable,
    },
  ];

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-white/8 bg-[#07080b]/88 backdrop-blur-xl"
    >
      <div className="page-container flex h-16 items-center justify-between gap-5 sm:h-[4.5rem]">
        <Link
          href="/"
          className="shrink-0 text-lg font-black tracking-[0.18em] text-white"
          onClick={closeMenu}
        >
          CINE<span className="text-red-500">MATIC</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Chính">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
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
          {taxonomyMenus.map((item) => (
            <DesktopTaxonomyDropdown
              key={item.menu}
              id={`desktop-${item.menu}-menu`}
              label={item.label}
              basePath={item.basePath}
              items={item.items}
              unavailable={item.unavailable}
              isOpen={openTaxonomy === item.menu}
              isActive={pathname.startsWith(item.basePath)}
              onToggle={(trigger) => toggleTaxonomy(item.menu, trigger)}
              onNavigate={closeMenu}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/tim-kiem"
            className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            aria-label="Tìm kiếm phim"
          >
            <SearchIcon className="size-5" />
          </Link>
          <Link
            href={user ? "/tai-khoan" : "/dang-nhap"}
            className="hidden min-h-10 items-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white sm:flex"
          >
            {user ? user.name || "Tài khoản" : "Đăng nhập"}
          </Link>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 lg:hidden"
            aria-label={isOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setIsOpen((value) => !value);
              setOpenTaxonomy(null);
            }}
          >
            {isOpen ? (
              <CloseIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav
          id="mobile-navigation"
          className="border-t border-white/8 bg-[#0b0c10] px-4 py-3 lg:hidden"
          aria-label="Di động"
        >
          <div className="mx-auto grid max-w-xl gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  pathname === item.href
                    ? "bg-red-500/12 text-red-300"
                    : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {taxonomyMenus.map((item) => (
              <MobileTaxonomyGroup
                key={item.menu}
                id={`mobile-${item.menu}-menu`}
                label={item.label}
                basePath={item.basePath}
                items={item.items}
                unavailable={item.unavailable}
                isOpen={openTaxonomy === item.menu}
                isActive={pathname.startsWith(item.basePath)}
                onToggle={(trigger) => toggleTaxonomy(item.menu, trigger)}
                onNavigate={closeMenu}
              />
            ))}
            <Link
              href={user ? "/tai-khoan" : "/dang-nhap"}
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5"
            >
              {user ? "Tài khoản" : "Đăng nhập"}
            </Link>
            {user ? (
              <button
                type="button"
                onClick={() => signOut({ redirectTo: "/" })}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-zinc-500 hover:bg-white/5 hover:text-white"
              >
                Đăng xuất
              </button>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
