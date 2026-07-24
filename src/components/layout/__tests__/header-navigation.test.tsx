// @vitest-environment jsdom

import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeaderNavigation } from "../header-navigation";

const navigation = vi.hoisted(() => ({
  pathname: "/the-loai/hanh-dong",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

const categories = [
  { id: "category-1", name: "Hành Động", slug: "hanh/dong" },
  { id: "category-2", name: "Tình Cảm", slug: "tinh-cam" },
];

const countries = [
  { id: "country-1", name: "Hàn Quốc", slug: "han-quoc" },
];

function renderNavigation(
  props: Partial<React.ComponentProps<typeof HeaderNavigation>> = {},
) {
  return render(
    <HeaderNavigation
      user={null}
      categories={categories}
      countries={countries}
      {...props}
    />,
  );
}

describe("HeaderNavigation taxonomy menus", () => {
  beforeEach(() => {
    navigation.pathname = "/the-loai/hanh-dong";
  });

  it("opens one desktop dropdown at a time and encodes taxonomy links", () => {
    renderNavigation();

    const categoryButton = screen.getByRole("button", { name: "Thể loại" });
    expect(categoryButton).toHaveClass("bg-white/10");
    fireEvent.click(categoryButton);

    expect(categoryButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Hành Động" })).toHaveAttribute(
      "href",
      "/the-loai/hanh%2Fdong",
    );

    const countryButton = screen.getByRole("button", { name: "Quốc gia" });
    fireEvent.click(countryButton);

    expect(categoryButton).toHaveAttribute("aria-expanded", "false");
    expect(countryButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByRole("link", { name: "Hành Động" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Hàn Quốc" })).toHaveAttribute(
      "href",
      "/quoc-gia/han-quoc",
    );
  });

  it("closes a dropdown on Escape and outside pointer interaction", () => {
    renderNavigation();

    const categoryButton = screen.getByRole("button", { name: "Thể loại" });
    fireEvent.click(categoryButton);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(categoryButton).toHaveAttribute("aria-expanded", "false");
    expect(categoryButton).toHaveFocus();

    fireEvent.click(categoryButton);
    fireEvent.pointerDown(document.body);
    expect(categoryButton).toHaveAttribute("aria-expanded", "false");
  });

  it("shows taxonomy groups on mobile and closes navigation after selection", () => {
    renderNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Mở menu" }));
    const mobileNavigation = screen.getByRole("navigation", { name: "Di động" });
    const mobileCategoryButton = within(mobileNavigation).getByRole("button", {
      name: "Thể loại",
    });

    fireEvent.click(mobileCategoryButton);
    fireEvent.click(
      within(mobileNavigation).getByRole("link", { name: "Tình Cảm" }),
    );

    expect(
      screen.queryByRole("navigation", { name: "Di động" }),
    ).not.toBeInTheDocument();
  });

  it("keeps the dropdown available with an error state when OPhim fails", () => {
    renderNavigation({
      categories: [],
      categoriesUnavailable: true,
    });

    fireEvent.click(screen.getByRole("button", { name: "Thể loại" }));
    expect(
      screen.getByText("Tạm thời chưa tải được danh sách."),
    ).toBeInTheDocument();
  });
});
