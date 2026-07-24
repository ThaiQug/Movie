// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FavoriteButton } from "../favorite-button";

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => navigation,
}));

const movie = {
  movieSlug: "phim-hay",
  movieName: "Phim hay",
  moviePosterUrl: "https://img.ophim.live/uploads/phim-hay.jpg",
};

describe("FavoriteButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("redirects guests to sign in with a safe callback path", () => {
    render(
      <FavoriteButton
        movie={movie}
        isAuthenticated={false}
        initialFavorite={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Thêm yêu thích" }));

    expect(navigation.push).toHaveBeenCalledWith(
      "/dang-nhap?callbackUrl=%2Fphim%2Fphim-hay",
    );
  });

  it("updates optimistically and keeps the result after a successful request", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    render(
      <FavoriteButton
        movie={movie}
        isAuthenticated
        initialFavorite={false}
      />,
    );

    const button = screen.getByRole("button", { name: "Thêm yêu thích" });
    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Đang cập nhật...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("Đã yêu thích");
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/favorites",
      expect.objectContaining({ method: "POST" }),
    );
    expect(navigation.refresh).toHaveBeenCalled();
  });

  it("rolls the optimistic state back when the API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 500,
        }),
      ),
    );
    render(
      <FavoriteButton
        movie={movie}
        isAuthenticated
        initialFavorite={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Thêm yêu thích" }));

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Có lỗi xảy ra. Vui lòng thử lại.",
    );
  });
});
