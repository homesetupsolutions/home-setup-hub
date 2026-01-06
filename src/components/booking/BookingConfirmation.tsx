import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, MapPin, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { SquareService } from "@/lib/squareBooking";
import type { CustomerInfo } from "./CustomerForm";

interface BookingConfirmationProps {
  service: SquareService;
  variationId: string;
  selectedTime: string;
  customerInfo: CustomerInfo;
  bookingId: string;
}

export function BookingConfirmation({
  service,
  variationId,
  selectedTime,
  customerInfo,
  bookingId,
}: BookingConfirmationProps) {
  const variation = service.variations.find(v => v.id === variationId);
  const dateTime = parseISO(selectedTime);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency || 'CAD',
    }).format(amount / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </motion.div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground">
          A confirmation text has been sent to {customerInfo.phone}
        </p>
      </div>

      <div className="bg-card rounded-xl border p-6 text-left max-w-md mx-auto">
        <h3 className="font-semibold mb-4">Appointment Details</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">{format(dateTime, 'EEEE, MMMM d, yyyy')}</p>
              <p className="text-sm text-muted-foreground">
                {format(dateTime, 'h:mm a')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">{service.name}</p>
              {variation && (
                <p className="text-sm text-muted-foreground">
                  {variation.name} • {variation.duration_minutes} min • {formatPrice(variation.price, variation.currency)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Home Setup Solutions</p>
              <p className="text-sm text-muted-foreground">
                We'll come to your location
              </p>
            </div>
          </div>
        </div>

        {customerInfo.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Notes:</span> {customerInfo.notes}
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          Booking ID: {bookingId}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Need to make changes? Contact us:
        </p>
        <a
          href="tel:5878994357"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <Phone className="w-4 h-4" />
          (587) 899-4357
        </a>
      </div>

      <Link to="/">
        <Button variant="outline" size="lg">
          Return to Home
        </Button>
      </Link>
    </motion.div>
  );
}
