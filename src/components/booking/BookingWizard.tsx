import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ServiceSelector } from "./ServiceSelector";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { CustomerForm, type CustomerInfo } from "./CustomerForm";
import { SquarePaymentForm } from "./SquarePaymentForm";
import { BookingConfirmation } from "./BookingConfirmation";
import {
  getServices,
  getAvailability,
  createBooking,
  type SquareService,
  type SquareAvailability,
} from "@/lib/squareBooking";
import { supabase } from "@/integrations/supabase/client";

type BookingStep = "service" | "time" | "details" | "payment" | "confirmation";

interface SquareConfig {
  applicationId: string;
  locationId: string;
}

export function BookingWizard() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<BookingStep>("service");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Data
  const [services, setServices] = useState<SquareService[]>([]);
  const [availabilities, setAvailabilities] = useState<SquareAvailability[]>([]);
  const [squareConfig, setSquareConfig] = useState<SquareConfig | null>(null);

  // Selections
  const [selectedService, setSelectedService] = useState<SquareService | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Services to exclude from booking
  const EXCLUDED_SERVICES = [
    "grandfather pricing",
    "task rabbit hire mush",
    "drive time",
  ];

  // Load services and Square config on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [servicesResult, configResult] = await Promise.all([
          getServices(),
          supabase.functions.invoke("square-booking", {
            body: { action: "get_config" },
          }),
        ]);

        // Filter out excluded services
        const filteredServices = (servicesResult.services || []).filter(
          (service: SquareService) =>
            !EXCLUDED_SERVICES.some((excluded) =>
              service.name.toLowerCase().includes(excluded)
            )
        );

        setServices(filteredServices);
        
        if (configResult.data?.applicationId && configResult.data?.locationId) {
          setSquareConfig({
            applicationId: configResult.data.applicationId,
            locationId: configResult.data.locationId,
          });
        }
      } catch (error) {
        console.error("Failed to load services:", error);
        toast({
          title: "Error",
          description: "Failed to load services. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, [toast]);

  // Load availability when service variation is selected
  useEffect(() => {
    async function loadAvailability() {
      if (!selectedVariation) return;

      setIsLoading(true);
      try {
        const startDate = new Date().toISOString();
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const result = await getAvailability(startDate, selectedVariation, endDate);
        setAvailabilities(result.availabilities || []);
      } catch (error) {
        console.error("Failed to load availability:", error);
        toast({
          title: "Error",
          description: "Failed to load availability. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadAvailability();
  }, [selectedVariation, toast]);

  const handleSelectService = (service: SquareService) => {
    setSelectedService(service);
    // Auto-select if only one variation
    if (service.variations.length === 1) {
      setSelectedVariation(service.variations[0].id);
    } else {
      setSelectedVariation(null);
    }
    setSelectedTime(null);
  };

  const handleSelectVariation = (variationId: string) => {
    setSelectedVariation(variationId);
    setSelectedTime(null);
  };

  const handlePaymentComplete = async (paymentToken: string, verificationToken?: string) => {
    if (!selectedService || !selectedVariation || !selectedTime) return;

    setIsProcessing(true);
    try {
      const variation = selectedService.variations.find(v => v.id === selectedVariation);
      
      const result = await supabase.functions.invoke("square-booking", {
        body: {
          action: "create_booking_with_payment",
          startAt: selectedTime,
          serviceVariationId: selectedVariation,
          durationMinutes: variation?.duration_minutes || 60,
          customerFirstName: customerInfo.firstName,
          customerLastName: customerInfo.lastName,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerNote: customerInfo.notes,
          paymentToken,
          verificationToken,
          amount: variation?.price || 0,
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to create booking");
      }

      if (result.data?.error) {
        throw new Error(result.data.error);
      }

      setBookingId(result.data?.booking?.id || "confirmed");
      setCurrentStep("confirmation");
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Error",
      description: error,
      variant: "destructive",
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case "service":
        return selectedService && selectedVariation;
      case "time":
        return selectedTime;
      case "details":
        return (
          customerInfo.firstName.trim() &&
          customerInfo.lastName.trim() &&
          customerInfo.email.trim() &&
          customerInfo.phone.trim()
        );
      default:
        return false;
    }
  };

  const goNext = () => {
    const steps: BookingStep[] = ["service", "time", "details", "payment"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goBack = () => {
    const steps: BookingStep[] = ["service", "time", "details", "payment"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const selectedVariationData = selectedService?.variations.find(
    v => v.id === selectedVariation
  );

  if (isLoading && currentStep === "service") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Progress indicator
  const steps = [
    { key: "service", label: "Service" },
    { key: "time", label: "Time" },
    { key: "details", label: "Details" },
    { key: "payment", label: "Payment" },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      {currentStep !== "confirmation" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className="flex items-center"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index <= currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 text-sm hidden sm:inline ${
                    index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-2 transition-colors ${
                      index < currentStepIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === "service" && (
            <ServiceSelector
              services={services}
              selectedService={selectedService}
              selectedVariation={selectedVariation}
              onSelectService={handleSelectService}
              onSelectVariation={handleSelectVariation}
            />
          )}

          {currentStep === "time" && (
            <TimeSlotPicker
              availabilities={availabilities}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              isLoading={isLoading}
            />
          )}

          {currentStep === "details" && (
            <CustomerForm
              customerInfo={customerInfo}
              onChange={setCustomerInfo}
            />
          )}

          {currentStep === "payment" && squareConfig && selectedVariationData && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-card rounded-xl border p-6">
                <h3 className="font-semibold mb-4">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Option</span>
                    <span className="font-medium">{selectedVariationData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{selectedVariationData.duration_minutes} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">
                      {selectedTime && new Date(selectedTime).toLocaleString("en-CA", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total (Hold)</span>
                      <span className="text-primary">
                        {new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: selectedVariationData.currency || "CAD",
                        }).format(selectedVariationData.price / 100)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <SquarePaymentForm
                applicationId={squareConfig.applicationId}
                locationId={squareConfig.locationId}
                amount={selectedVariationData.price}
                currency={selectedVariationData.currency}
                onPaymentComplete={handlePaymentComplete}
                onError={handlePaymentError}
                isProcessing={isProcessing}
                customerEmail={customerInfo.email}
              />
            </div>
          )}

          {currentStep === "confirmation" && selectedService && selectedVariation && selectedTime && (
            <BookingConfirmation
              service={selectedService}
              variationId={selectedVariation}
              selectedTime={selectedTime}
              customerInfo={customerInfo}
              bookingId={bookingId || "confirmed"}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {currentStep !== "confirmation" && currentStep !== "payment" && (
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentStep === "service"}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={goNext}
            disabled={!canProceed()}
          >
            Continue
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {currentStep === "payment" && (
        <div className="flex justify-start mt-8 pt-6 border-t">
          <Button variant="outline" onClick={goBack} disabled={isProcessing}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
