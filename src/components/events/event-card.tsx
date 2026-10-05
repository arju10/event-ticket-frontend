import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Ticket, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gradientForCategory } from "@/lib/constants/event-constants";
import { ROUTES } from "@/lib/constants/routes";
import type { EventCard as EventCardType } from "@/types/models";

interface EventCardProps {
  event: EventCardType;
}

export function EventCard({ event }: EventCardProps) {
  const gradient = gradientForCategory(event.category);
  const startDate = new Date(event.startDate);

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <Link
        href={ROUTES.eventDetail(event.id)}
        className="relative block h-40 w-full overflow-hidden"
        aria-label={`View ${event.title}`}
      >
        {event.bannerImage ? (
          <Image
            src={event.bannerImage}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
            }}
          >
            <Ticket
              className="h-12 w-12 opacity-80"
              style={{ color: gradient.accent }}
              aria-hidden
            />
          </div>
        )}
        <span className="bg-background/90 text-foreground absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur">
          {event.category}
        </span>
      </Link>

      <CardContent className="flex flex-1 flex-col p-4">
        <Link href={ROUTES.eventDetail(event.id)}>
          <h3 className="group-hover:text-primary line-clamp-2 text-base leading-tight font-semibold transition-colors">
            {event.title}
          </h3>
        </Link>

        <div className="text-muted-foreground mt-3 space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{format(startDate, "EEE, MMM d · h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">
              {event.venue}, {event.city}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <div>
            {event.lowestPrice !== null ? (
              <>
                <p className="text-muted-foreground text-xs">From</p>
                <p className="text-base font-semibold">
                  ৳{event.lowestPrice.toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Pricing TBA</p>
            )}
          </div>
          <Button size="sm" variant="ghost" asChild>
            <Link href={ROUTES.eventDetail(event.id)}>
              View <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
