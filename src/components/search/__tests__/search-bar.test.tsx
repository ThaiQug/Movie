// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchBar } from "../search-bar";

const navigation = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/tim-kiem",
  useRouter: () => navigation,
}));

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it("debounces, normalizes and synchronizes the query with the URL", () => {
    render(<SearchBar initialQuery="" />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Tên phim" }), {
      target: { value: "  phim   hay  " },
    });

    vi.advanceTimersByTime(399);
    expect(navigation.replace).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(navigation.replace).toHaveBeenCalledWith(
      "/tim-kiem?q=phim+hay",
      { scroll: false },
    );
  });

  it("removes the query string when the search is cleared", () => {
    render(<SearchBar initialQuery="phim hay" />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Tên phim" }), {
      target: { value: "" },
    });
    vi.advanceTimersByTime(400);

    expect(navigation.replace).toHaveBeenCalledWith("/tim-kiem", {
      scroll: false,
    });
  });
});
