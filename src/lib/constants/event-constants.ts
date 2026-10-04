export const EVENT_CATEGORIES = [
  "Conference",
  "Workshop",
  "Concert",
  "Sports",
  "Festival",
  "Networking",
  "Exhibition",
  "Webinar",
  "Meetup",
  "Other",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const BANGLADESH_CITIES = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cox's Bazar",
] as const;

/**
 * Deterministic gradient + accent color per category — used to render
 * event cards when `bannerImage` is null. Same category always renders the
 * same gradient so the UI feels consistent and never shows a broken image.
 */
export const CATEGORY_GRADIENTS: Record<
  string,
  { from: string; to: string; accent: string }
> = {
  Conference: { from: "#7c3aed", to: "#4f46e5", accent: "#c4b5fd" },
  Workshop: { from: "#0891b2", to: "#0e7490", accent: "#a5f3fc" },
  Concert: { from: "#db2777", to: "#be185d", accent: "#fbcfe8" },
  Sports: { from: "#059669", to: "#047857", accent: "#a7f3d0" },
  Festival: { from: "#ea580c", to: "#c2410c", accent: "#fed7aa" },
  Networking: { from: "#2563eb", to: "#1d4ed8", accent: "#bfdbfe" },
  Exhibition: { from: "#9333ea", to: "#7e22ce", accent: "#e9d5ff" },
  Webinar: { from: "#0d9488", to: "#0f766e", accent: "#99f6e4" },
  Meetup: { from: "#f59e0b", to: "#d97706", accent: "#fde68a" },
  Other: { from: "#64748b", to: "#475569", accent: "#cbd5e1" },
};

export function gradientForCategory(category: string) {
  return CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.Other!;
}
