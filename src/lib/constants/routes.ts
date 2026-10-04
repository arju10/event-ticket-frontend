import type { UserRole } from "@/types/enums";

export const ROUTES = {
  home: "/",
  about: "/about",
  contact: "/contact",
  pricing: "/pricing",
  events: "/events",
  eventDetail: (id: string) => `/events/${id}`,
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",

  dashboard: "/dashboard",
  dashboardBookings: "/dashboard/bookings",
  dashboardBookingDetail: (id: string) => `/dashboard/bookings/${id}`,
  dashboardWaitlist: "/dashboard/waitlist",
  dashboardNotifications: "/dashboard/notifications",
  dashboardProfile: "/dashboard/profile",

  organizer: "/organizer",
  organizerEvents: "/organizer/events",
  organizerNewEvent: "/organizer/events/new",
  organizerEventDetail: (id: string) => `/organizer/events/${id}`,
  organizerEventWaitlist: (id: string) => `/organizer/events/${id}/waitlist`,
  organizerEventCheckIn: (id: string) => `/organizer/events/${id}/check-in`,
  organizerEarnings: "/organizer/earnings",

  admin: "/admin",
  adminUsers: "/admin/users",
  adminCoupons: "/admin/coupons",
  adminAuditLogs: "/admin/audit-logs",

  paymentSuccess: "/payment/success",
  paymentCancel: "/payment/cancel",
} as const;

export const HOME_BY_ROLE: Record<UserRole, string> = {
  ATTENDEE: ROUTES.dashboard,
  ORGANIZER: ROUTES.organizer,
  ADMIN: ROUTES.admin,
};

export const PROTECTED_PREFIXES: Record<string, UserRole[]> = {
  "/dashboard": ["ATTENDEE"],
  "/organizer": ["ORGANIZER"],
  "/admin": ["ADMIN"],
};
