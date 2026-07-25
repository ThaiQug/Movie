import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SearchIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function FilmIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...baseProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function HeartIcon({
  filled = false,
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      {...baseProps}
      fill={filled ? "currentColor" : "none"}
      {...props}
    >
      <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z" />
    </svg>
  );
}
