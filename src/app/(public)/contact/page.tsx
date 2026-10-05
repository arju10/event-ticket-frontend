import type { Metadata } from "next";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { ContactForm } from "@/components/shared/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the EventHub team.",
};

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "support@eventhub.example",
    href: "mailto:support@eventhub.example",
  },
  {
    icon: MessageSquare,
    label: "Support",
    value: "Response within 1 business day",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dhaka, Bangladesh",
  },
];

export default function ContactPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get in touch
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Questions, bug reports, or partnership inquiries — we'd love to hear
          from you.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {CONTACT_DETAILS.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex gap-4">
                <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-muted-foreground text-sm">{item.value}</p>
                </div>
              </div>
            );

            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                className="block transition-opacity hover:opacity-80"
              >
                {content}
              </a>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
