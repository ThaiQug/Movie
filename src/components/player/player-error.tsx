"use client";

interface PlayerErrorProps {
  onRetry: () => void;
}

export function PlayerError({ onRetry }: PlayerErrorProps) {
  return (
    <div
      role="alert"
      className="flex aspect-video size-full flex-col items-center justify-center bg-zinc-950 px-6 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-full border border-red-400/25 bg-red-500/10 text-xl text-red-400">
        !
      </span>
      <h2 className="mt-4 text-lg font-bold text-white">
        Không thể phát nội dung này
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
        Nguồn phát hiện không khả dụng hoặc không vượt qua kiểm tra an toàn.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
      >
        Thử lại
      </button>
    </div>
  );
}
