import { z } from "zod";

export const eventBasicsSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title is too long"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description is too long"),
  category: z.string().min(2, "Category is required"),
  subCategory: z.string().optional(),
});

export const eventLocationSchema = z
  .object({
    venue: z.string().min(2, "Venue is required"),
    address: z.string().min(2, "Address is required"),
    city: z.string().min(2, "City is required"),
    country: z.string().min(2, "Country is required"),
    isVirtual: z.boolean().default(false),
    virtualLink: z
      .string()
      .url("Enter a valid URL")
      .optional()
      .or(z.literal("")),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((d) => !d.startDate || new Date(d.startDate).getTime() > Date.now(), {
    message: "Start date must be in the future",
    path: ["startDate"],
  })
  .refine(
    (d) =>
      !d.startDate ||
      !d.endDate ||
      new Date(d.endDate).getTime() > new Date(d.startDate).getTime(),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export const eventSettingsSchema = z.object({
  maxTicketsPerUser: z.coerce.number().int().positive().default(4),
  isWaitlistEnabled: z.boolean().default(true),
  allowRefund: z.boolean().default(true),
  ageRestriction: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal("")),
  bannerImage: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

export const ticketTierSchema = z
  .object({
    name: z.string().min(2, "Name is required").max(50),
    description: z.string().max(500).optional(),
    price: z.coerce.number().nonnegative("Price must be positive"),
    quantity: z.coerce.number().int().positive("Quantity must be positive"),
    minPurchase: z.coerce.number().int().positive().default(1),
    maxPurchase: z.coerce.number().int().positive().default(4),
    includes: z.string().optional(), // comma-separated, split before submit
  })
  .refine((d) => d.maxPurchase >= d.minPurchase, {
    message: "Max purchase must be ≥ min purchase",
    path: ["maxPurchase"],
  });

export type EventBasicsValues = z.infer<typeof eventBasicsSchema>;
export type EventLocationValues = z.infer<typeof eventLocationSchema>;
export type EventSettingsValues = z.infer<typeof eventSettingsSchema>;
export type TicketTierValues = z.infer<typeof ticketTierSchema>;
