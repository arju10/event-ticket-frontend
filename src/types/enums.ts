export type UserRole = "ATTENDEE" | "ORGANIZER" | "ADMIN";

export type EventStatus =
  "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED" | "POSTPONED";

export type TicketTierStatus = "ACTIVE" | "SOLD_OUT" | "PAUSED";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "EXPIRED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type PaymentMethod = "STRIPE" | "SSLCOMMERZ" | "BKASH";

export type PaymentStatus =
  "INITIATED" | "SUCCESS" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";

export type WaitlistStatus =
  "WAITING" | "NOTIFIED" | "CONVERTED" | "EXPIRED" | "CANCELLED";

export type DiscountType = "PERCENTAGE" | "FIXED";

export type NotificationType =
  | "BOOKING_CONFIRMATION"
  | "BOOKING_CANCELLATION"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "EVENT_REMINDER"
  | "EVENT_CANCELLED"
  | "EVENT_UPDATED"
  | "WAITLIST_OFFER"
  | "WAITLIST_CONFIRMED"
  | "REVIEW_RESPONSE";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "SOFT_DELETE"
  | "STATUS_CHANGE"
  | "ROLE_CHANGE"
  | "SUSPEND"
  | "CANCEL"
  | "CHECK_IN"
  | "PAYMENT_INITIATE"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "REFUND"
  | "COUPON_CREATE";
