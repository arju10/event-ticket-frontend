import type { UserRole } from "@/types/enums";

export interface DemoAccount {
  role: UserRole;
  label: string;
  email: string;
  password: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "ADMIN",
    label: "Admin",
    email: "admin@example.com",
    password: "Password123!",
    description: "Full platform control",
  },
  {
    role: "ATTENDEE",
    label: "Attendee",
    email: "attendee@example.com",
    password: "Password123!",
    description: "Book & manage tickets",
  },
  {
    role: "ORGANIZER",
    label: "Organizer",
    email: "organizer@example.com",
    password: "Password123!",
    description: "Create & manage events",
  },
];
