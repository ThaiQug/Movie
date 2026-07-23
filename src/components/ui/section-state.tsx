import { FilmIcon } from "./icons";

interface SectionStateProps {
  title: string;
  description: string;
  variant?: "empty" | "error";
}

export function SectionState({
  title,
  description,
  variant = "empty",
}: SectionStateProps) {
  return (
    <div
      className={`rounded-2xl border p-8 text-center ${
        variant === "error"
          ? "border-amber-400/15 bg-amber-400/[0.06]"
          : "border-white/8 bg-white/[0.025]"
      }`}
      role={variant === "error" ? "alert" : "status"}
    >
      <span
        className={`mx-auto flex size-11 items-center justify-center rounded-full ${
          variant === "error"
            ? "bg-amber-400/10 text-amber-300"
            : "bg-white/5 text-zinc-500"
        }`}
      >
        <FilmIcon className="size-5" />
      </span>
      <h2 className="mt-4 font-semibold text-zinc-100">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-500">
        {description}
      </p>
    </div>
  );
}
