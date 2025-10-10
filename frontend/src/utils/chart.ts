// utils/chart.ts
export function getMaxTicks(): number {
  if (typeof window === "undefined") return 10;
  return window.innerWidth < 500 ? 2 : 10;
}
