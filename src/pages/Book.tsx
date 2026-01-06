import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Calendar, Clock, Shield, Phone, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addDays, startOfDay } from "date-fns";

import { ServiceSelector } from "@/components/booking/ServiceSelector";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { CustomerForm, type CustomerInfo } from "@/components/booking/CustomerForm";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { 
  getServices, 
  getAvailability, 
  createBooking,
  type SquareService,
  type SquareAvailability 
} from "@/lib/squareBooking";

const features = [
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Choose the date and time that works best for you",
  },
  {
    icon: Clock,
    title: "Quick Service",
    description: "Most installations completed in under 2 hours",
  },
  {
    icon: Shield,
    title: "Guaranteed Quality",
    description: "100% satisfaction guaranteed on all services",
  },
];

type BookingStep = 'service' | 'time' | 'info' | 'confirmed';

const Book = () => {
  const [step, setStep] = useState<BookingStep>('service');
  const [services, setServices] = useState<SquareService[]>([]);
  const [selectedService, setSelectedService] = useState<SquareService | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
  const [availabilities, setAvailabilities] = useState<SquareAvailability[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [bookingId, setBookingId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load services on mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { services: fetchedServices } = await getServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error('Failed to load services:', error);
        toast.error('Failed to load services. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  // Load availability when service variation is selected
  useEffect(() => {
    const loadAvailability = async () => {
      if (!selectedVariation) return;

      setIsLoadingAvailability(true);
      try {
        const startDate = startOfDay(new Date()).toISOString();
        const endDate = addDays(new Date(), 30).toISOString();
        const { availabilities: slots } = await getAvailability(startDate, selectedVariation, endDate);
        setAvailabilities(slots);
      } catch (error) {
        console.error('Failed to load availability:', error);
        toast.error('Failed to load available times. Please try again.');
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    loadAvailability();
  }, [selectedVariation]);

  const handleServiceSelect = (service: SquareService) => {
    setSelectedService(service);
    // Auto-select first variation if only one
    if (service.variations.length === 1) {
      setSelectedVariation(service.variations[0].id);
    } else {
      setSelectedVariation(null);
    }
  };

  const handleNext = () => {
    if (step === 'service' && selectedVariation) {
      setStep('time');
    } else if (step === 'time' && selectedTime) {
      setStep('info');
    }
  };

  const handleBack = () => {
    if (step === 'time') {
      setStep('service');
    } else if (step === 'info') {
      setStep('time');
    }
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedVariation || !selectedTime) return;

    // Validate form
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const variation = selectedService.variations.find(v => v.id === selectedVariation);
      
      const { booking } = await createBooking({
        startAt: selectedTime,
        serviceVariationId: selectedVariation,
        durationMinutes: variation?.duration_minutes || 60,
        customerFirstName: customerInfo.firstName,
        customerLastName: customerInfo.lastName,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerNote: customerInfo.notes,
      });

      setBookingId(booking.id);
      setStep('confirmed');
      toast.success('Booking confirmed!');
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Failed to create booking. Please try again or call us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 'service') return !!selectedVariation;
    if (step === 'time') return !!selectedTime;
    if (step === 'info') {
      return customerInfo.firstName && customerInfo.lastName && 
             customerInfo.email && customerInfo.phone;
    }
    return false;
  };

  return (
    <>
      <Helmet>
        <title>Book an Appointment | Home Setup Solutions</title>
        <meta
          name="description"
          content="Book your home technology installation appointment online. Quick and easy scheduling for TV mounting, smart home setup, and more."
        />
      </Helmet>
      <Layout>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Book Online
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Schedule Your <span className="text-gradient-orange">Appointment</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Select your service and preferred time below. We'll confirm your appointment via text message.
              </p>
            </motion.div>

            {/* Progress Steps */}
            {step !== 'confirmed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex justify-center mb-8"
              >
                <div className="flex items-center gap-2 md:gap-4">
                  {['service', 'time', 'info'].map((s, i) => (
                    <div key={s} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step === s
                            ? 'bg-primary text-primary-foreground'
                            : ['service', 'time', 'info'].indexOf(step) > i
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {i + 1}
                      </div>
                      {i < 2 && (
                        <div className={`w-12 md:w-24 h-1 mx-2 ${
                          ['service', 'time', 'info'].indexOf(step) > i
                            ? 'bg-primary'
                            : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Features (only on first step) */}
            {step === 'service' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              >
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Main Content */}
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl border p-6 md:p-8"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : step === 'service' ? (
                <ServiceSelector
                  services={services}
                  selectedService={selectedService}
                  selectedVariation={selectedVariation}
                  onSelectService={handleServiceSelect}
                  onSelectVariation={setSelectedVariation}
                />
              ) : step === 'time' ? (
                <TimeSlotPicker
                  availabilities={availabilities}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                  isLoading={isLoadingAvailability}
                />
              ) : step === 'info' ? (
                <CustomerForm
                  customerInfo={customerInfo}
                  onChange={setCustomerInfo}
                />
              ) : step === 'confirmed' && selectedService && selectedVariation && selectedTime ? (
                <BookingConfirmation
                  service={selectedService}
                  variationId={selectedVariation}
                  selectedTime={selectedTime}
                  customerInfo={customerInfo}
                  bookingId={bookingId}
                />
              ) : null}

              {/* Navigation Buttons */}
              {step !== 'confirmed' && (
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={step === 'service'}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  {step === 'info' ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed() || isSubmitting}
                      className="gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        'Confirm Booking'
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="gap-2"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </motion.div>

            {/* Alternative Contact */}
            {step !== 'confirmed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center mt-12"
              >
                <p className="text-muted-foreground mb-4">
                  Prefer to book by phone? Call us directly:
                </p>
                <a
                  href="tel:5878994357"
                  className="inline-flex items-center gap-2 text-xl font-semibold text-primary hover:underline"
                >
                  <Phone className="w-5 h-5" />
                  (587) 899-4357
                </a>
              </motion.div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Book;
