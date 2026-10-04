export type BadgeVariant =
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

export const BOOKING_STATUS_COLORS: Record<string, BadgeVariant> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CHECKED_IN: "default",
  CANCELLED: "secondary",
  EXPIRED: "outline",
  REFUNDED: "destructive",
  PARTIALLY_REFUNDED: "destructive",
};

export const EVENT_STATUS_COLORS: Record<string, BadgeVariant> = {
  DRAFT: "outline",
  PUBLISHED: "success",
  CANCELLED: "destructive",
  COMPLETED: "secondary",
  POSTPONED: "warning",
};

export const PAYMENT_STATUS_COLORS: Record<string, BadgeVariant> = {
  INITIATED: "warning",
  SUCCESS: "success",
  FAILED: "destructive",
  REFUNDED: "secondary",
  PARTIALLY_REFUNDED: "secondary",
};

export const WAITLIST_STATUS_COLORS: Record<string, BadgeVariant> = {
  WAITING: "warning",
  NOTIFIED: "default",
  CONVERTED: "success",
  EXPIRED: "outline",
  CANCELLED: "secondary",
};

export const USER_ROLE_COLORS: Record<string, BadgeVariant> = {
  ATTENDEE: "secondary",
  ORGANIZER: "default",
  ADMIN: "destructive",
};
