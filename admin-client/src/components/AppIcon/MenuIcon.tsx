import { AppIconSVGProps } from "./types";

export function MenuIcon({ color, size }: AppIconSVGProps) {
  return (
    <svg
      width={size}
      height={size}
      className={color}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 16L21 18L3 18L3 16L21 16ZM21 11L3 11L3 13L21 13L21 11ZM21 6L3 6L3 8L21 8L21 6Z" />
    </svg>
  );
}
