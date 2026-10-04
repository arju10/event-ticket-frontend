import type {
  AuditAction,
  BookingStatus,
  DiscountType,
  EventStatus,
  NotificationType,
  PaymentMethod,
  PaymentStatus,
  TicketTierStatus,
  UserRole,
  WaitlistStatus,
} from "./enums";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  profileImage?: string | null;
  bio?: string | null;
  dateOfBirth?: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: string | null;
  notificationPreferences?: {
    email?: boolean;
    sms?: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicUserProfile {
  id: string;
  name: string;
  profileImage: string | null;
  bio: string | null;
  role: UserRole;
  totalEvents: number;
  averageRating: number | null;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  subCategory: string | null;
  venue: string;
  address: string;
  city: string;
  country: string;
  isVirtual: boolean;
  virtualLink: string | null;
  startDate: string;
  endDate: string;
  timezone: string | null;
  status: EventStatus;
  publishedAt: string | null;
  cancelledAt: string | null;
  maxTicketsPerUser: number;
  isWaitlistEnabled: boolean;
  allowRefund: boolean;
  ageRestriction: number | null;
  bannerImage: string | null;
  galleryImages: string[] | null;
  additionalInfo: Record<string, unknown> | null;
  organizerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventCard {
  id: string;
  title: string;
  slug: string;
  category: string;
  venue: string;
  city: string;
  startDate: string;
  bannerImage: string | null;
  status: EventStatus;
  organizer: {
    id: string;
    name: string;
    profileImage: string | null;
  };
  lowestPrice: number | null;
}

export interface EventDetail extends Event {
  organizer: {
    id: string;
    name: string;
    profileImage: string | null;
    email: string;
  };
  ticketTiers: TicketTier[];
  statistics: {
    totalBookings: number;
    averageRating: number | null;
    totalReviews: number;
  };
}

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  sold: number;
  reserved: number;
  available: number;
  minPurchase: number;
  maxPurchase: number;
  saleStartDate: string | null;
  saleEndDate: string | null;
  status: TicketTierStatus;
  includes: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  eventId: string;
  ticketTierId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountAmount: number;
  finalAmount: number;
  couponCode: string | null;
  specialRequests: string | null;
  dietaryNeeds: string | null;
  status: BookingStatus;
  expiresAt: string | null;
  checkedInAt: string | null;
  checkedInBy: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  refundAmount: number | null;
  refundProcessedAt: string | null;
  createdAt: string;
  updatedAt: string;
  event?: {
    id: string;
    title: string;
    venue: string;
    startDate: string;
    endDate: string;
    bannerImage: string | null;
    organizerId: string;
    allowRefund: boolean;
    isWaitlistEnabled: boolean;
  };
  ticketTier?: {
    id: string;
    name: string;
    price: number;
  };
  payment?: {
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId: string | null;
  } | null;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string | null;
  refundedAmount: number | null;
  refundReason: string | null;
  refundedAt: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistEntry {
  id: string;
  eventId: string;
  userId: string;
  ticketTierId: string;
  quantity: number;
  status: WaitlistStatus;
  position?: number | null;
  notifiedAt: string | null;
  offerExpiresAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Review {
  id: string;
  userId: string;
  eventId: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  organizerResponse: string | null;
  responseDate: string | null;
  isHidden: boolean;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}

export interface ReviewStatistics {
  averageRating: number | null;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface CouponValidationResult {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  discountedAmount: number;
  finalAmount: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  description: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  totalBookings: number;
}

export interface DashboardStats {
  overview: {
    totalUsers: number;
    totalOrganizers: number;
    totalEvents: number;
    totalBookings: number;
    totalRevenue: number;
    totalRefunds: number;
  };
  recentActivity: {
    newUsersToday: number;
    newEventsToday: number;
    newBookingsToday: number;
  };
  popularCategories: Array<{
    category: string;
    count: number;
  }>;
  platformHealth: {
    activeUsers: number;
    conversionRate: number;
    refundRate: number;
  };
}
