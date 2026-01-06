import { motion } from "framer-motion";
import { Check, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SquareService } from "@/lib/squareBooking";

interface ServiceSelectorProps {
  services: SquareService[];
  selectedService: SquareService | null;
  selectedVariation: string | null;
  onSelectService: (service: SquareService) => void;
  onSelectVariation: (variationId: string) => void;
}

export function ServiceSelector({
  services,
  selectedService,
  selectedVariation,
  onSelectService,
  onSelectVariation,
}: ServiceSelectorProps) {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency || 'CAD',
    }).format(amount / 100);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select a Service</h2>
      <div className="grid gap-4">
        {services.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border-2 p-4 cursor-pointer transition-all",
              selectedService?.id === service.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => onSelectService(service)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                {service.description && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {service.description}
                  </p>
                )}
              </div>
              {selectedService?.id === service.id && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Show variations when service is selected */}
            {selectedService?.id === service.id && service.variations.length > 0 && (
              <div className="mt-4 space-y-2 border-t pt-4">
                {service.variations.map((variation) => (
                  <div
                    key={variation.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all",
                      selectedVariation === variation.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVariation(variation.id);
                    }}
                  >
                    <span className="font-medium">{variation.name}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {variation.duration_minutes} min
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <DollarSign className="w-4 h-4" />
                        {formatPrice(variation.price, variation.currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Show price range if multiple variations */}
            {selectedService?.id !== service.id && service.variations.length > 0 && (
              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.min(...service.variations.map(v => v.duration_minutes))}
                  {service.variations.length > 1 && 
                    ` - ${Math.max(...service.variations.map(v => v.duration_minutes))}`
                  } min
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {formatPrice(Math.min(...service.variations.map(v => v.price)), 'CAD')}
                  {service.variations.length > 1 && 
                    ` - ${formatPrice(Math.max(...service.variations.map(v => v.price)), 'CAD')}`
                  }
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
