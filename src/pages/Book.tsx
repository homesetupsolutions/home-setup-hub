import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, Shield, Phone, Star, ChevronRight, 
  MessageSquare, MapPin, User, Mail, CheckCircle2, Home, ArrowLeft, Loader2
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addDays, setHours, setMinutes, isSameDay, startOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  icon: string | null;
}

// Generate available time slots for next 14 days
const generateTimeSlots = () => {
  const slots: { date: Date; times: Date[] }[] = [];
  const now = new Date();
  
  for (let day = 1; day <= 14; day++) {
    const date = addDays(startOfDay(now), day);
    const dayOfWeek = date.getDay();
    
    // Skip Sundays
    if (dayOfWeek === 0) continue;
    
    const times: Date[] = [];
    const startHour = dayOfWeek === 6 ? 10 : 9; // Saturday starts at 10am
    const endHour = dayOfWeek === 6 ? 16 : 18; // Saturday ends at 4pm
    
    for (let hour = startHour; hour < endHour; hour++) {
      times.push(setMinutes(setHours(date, hour), 0));
      if (hour < endHour - 1) {
        times.push(setMinutes(setHours(date, hour), 30));
      }
    }
    
    slots.push({ date, times });
  }
  
  return slots;
};

const features = [
  {
    icon: Calendar,
    title: "Easy Online Scheduling",
    description: "Book your appointment 24/7 with our easy online system",
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

const testimonials = [
  { name: "Sarah M.", text: "Amazing service! Evan was professional and thorough. Highly recommend!", rating: 5 },
  { name: "Mike T.", text: "Best cleaning service in Calgary. My house has never looked better.", rating: 5 },
  { name: "Jennifer L.", text: "Quick, reliable, and affordable. Will definitely book again!", rating: 5 },
];

type BookingStep = "service" | "datetime" | "details" | "confirmation";

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

const Book = () => {
  const [step, setStep] = useState<BookingStep>("service");
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("id, name, description, duration_minutes, price_cents, icon")
          .order("display_order", { ascending: true });

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to load services");
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const timeSlots = generateTimeSlots();
  const availableDates = timeSlots.map(s => s.date);
  
  const timesForSelectedDate = selectedDate 
    ? timeSlots.find(s => isSameDay(s.date, selectedDate))?.times || []
    : [];

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount / 100);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep("datetime");
  };

  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time);
    setStep("details");
  };

  const handleBack = () => {
    if (step === "datetime") {
      setStep("service");
      setSelectedDate(undefined);
      setSelectedTime(null);
    } else if (step === "details") {
      setStep("datetime");
    }
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedTime) return;
    
    // Validate form
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert appointment into database
      const { data, error } = await supabase
        .from("appointments")
        .insert({
          customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          address: customerInfo.address,
          service_name: selectedService.name,
          service_price: selectedService.price_cents,
          scheduled_at: selectedTime.toISOString(),
          duration_minutes: selectedService.duration_minutes,
          notes: customerInfo.notes || null,
          status: "confirmed",
        })
        .select()
        .single();

      if (error) throw error;

      setBookingId(data.id);
      setStep("confirmation");
      toast.success("Booking confirmed! We'll send you a confirmation shortly.");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("Failed to complete booking. Please try again or call us.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderServiceSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Choose Your Service</h2>
        <p className="text-muted-foreground">Select the service you'd like to book</p>
      </div>

      {isLoadingServices ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all hover:border-primary/50",
                selectedService?.id === service.id && "border-primary bg-primary/5"
              )}
              onClick={() => handleServiceSelect(service)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{service.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {service.duration_minutes} min
                      </span>
                      <span className="font-semibold text-primary">
                        {formatPrice(service.price_cents)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      )}
    </motion.div>
  );

  const renderDateTimeSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Button variant="ghost" onClick={handleBack} className="gap-2 mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Services
      </Button>

      {selectedService && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{selectedService.icon}</div>
              <div>
                <h3 className="font-semibold">{selectedService.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedService.duration_minutes} min • {formatPrice(selectedService.price_cents)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Select Date & Time</h2>
        <p className="text-muted-foreground">Pick your preferred appointment slot</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                const isAvailable = availableDates.some(d => isSameDay(d, date));
                return !isAvailable;
              }}
              modifiers={{
                available: availableDates,
              }}
              modifiersStyles={{
                available: { fontWeight: 'bold' },
              }}
              className="rounded-md"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            {selectedDate ? (
              <div className="space-y-4">
                <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                
                <div className="grid grid-cols-3 gap-2">
                  {timesForSelectedDate.map((time) => (
                    <motion.button
                      key={time.toISOString()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        selectedTime && isSameDay(selectedTime, time) && selectedTime.getTime() === time.getTime()
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {format(time, 'h:mm a')}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Calendar className="w-12 h-12 mb-2 opacity-50" />
                <p>Select a date to see available times</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderDetailsForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Button variant="ghost" onClick={handleBack} className="gap-2 mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Date & Time
      </Button>

      {selectedService && selectedTime && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{selectedService.icon}</div>
                <div>
                  <h3 className="font-semibold">{selectedService.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedService.duration_minutes} min • {formatPrice(selectedService.price_cents)}
                  </p>
                </div>
              </div>
              <div className="text-sm sm:text-right">
                <p className="font-medium">{format(selectedTime, 'EEEE, MMMM d')}</p>
                <p className="text-muted-foreground">{format(selectedTime, 'h:mm a')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Information</h2>
        <p className="text-muted-foreground">Please provide your contact and service details</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                First Name *
              </Label>
              <Input
                id="firstName"
                value={customerInfo.firstName}
                onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                placeholder="John"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={customerInfo.lastName}
                onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                placeholder="Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                placeholder="(587) 899-4357"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Service Address *
            </Label>
            <Input
              id="address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              placeholder="123 Main St, Calgary, AB"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Special Requests (Optional)
            </Label>
            <Textarea
              id="notes"
              value={customerInfo.notes}
              onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
              placeholder="Any special instructions, access codes, or requests..."
              rows={3}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            * Required fields. We'll send a confirmation to your email and phone.
          </p>

          <Button 
            size="lg" 
            className="w-full" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                Confirm Booking
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderConfirmation = () => (
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
          A confirmation has been sent to {customerInfo.email}
        </p>
      </div>

      {selectedService && selectedTime && (
        <Card className="max-w-md mx-auto text-left">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold">Appointment Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{format(selectedTime, 'EEEE, MMMM d, yyyy')}</p>
                  <p className="text-sm text-muted-foreground">{format(selectedTime, 'h:mm a')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{selectedService.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedService.duration_minutes} min • {formatPrice(selectedService.price_cents)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{customerInfo.address}</p>
                  <p className="text-sm text-muted-foreground">Service location</p>
                </div>
              </div>
            </div>

            {bookingId && (
              <p className="text-xs text-muted-foreground pt-4 border-t">
                Booking ID: {bookingId.slice(0, 8)}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Need to make changes? Contact us:
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:18332302933"
            className="inline-flex items-center justify-center gap-2 text-primary hover:underline"
          >
            <Phone className="w-4 h-4" />
            1-833-230-2933
          </a>
          <a
            href="sms:15876045127"
            className="inline-flex items-center justify-center gap-2 text-primary hover:underline"
          >
            <MessageSquare className="w-4 h-4" />
            Text 587-604-5127
          </a>
        </div>
      </div>

      <Button 
        variant="outline" 
        size="lg" 
        onClick={() => {
          setStep("service");
          setSelectedService(null);
          setSelectedDate(undefined);
          setSelectedTime(null);
          setBookingId(null);
          setCustomerInfo({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            notes: "",
          });
        }}
      >
        Book Another Service
      </Button>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Book an Appointment | Home Setup Solutions Calgary</title>
        <meta
          name="description"
          content="Book your home cleaning, handyman, or smart home installation appointment online. Serving Calgary and surrounding areas. Quick and easy scheduling!"
        />
      </Helmet>
      <Layout>
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Book Online 24/7
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Schedule Your <span className="text-gradient-orange">Appointment</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose your service and book online instantly. We'll confirm your appointment via text message.
              </p>
            </motion.div>

            {/* Features - only show on service selection step */}
            {step === "service" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Booking Flow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              {/* Progress Indicator */}
              {step !== "confirmation" && (
                <div className="flex justify-center mb-8">
                  <div className="flex items-center gap-2">
                    {["service", "datetime", "details"].map((s, i) => (
                      <div key={s} className="flex items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                            step === s || ["service", "datetime", "details"].indexOf(step) > i
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {i + 1}
                        </div>
                        {i < 2 && (
                          <div
                            className={cn(
                              "w-12 h-1 mx-1 transition-all",
                              ["service", "datetime", "details"].indexOf(step) > i
                                ? "bg-primary"
                                : "bg-muted"
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === "service" && renderServiceSelection()}
                {step === "datetime" && renderDateTimeSelection()}
                {step === "details" && renderDetailsForm()}
                {step === "confirmation" && renderConfirmation()}
              </AnimatePresence>
            </motion.div>

            {/* Testimonials - only show on service selection */}
            {step === "service" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex gap-1 mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                        <p className="font-medium">— {testimonial.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Help Booking?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Give us a call or send a text if you have any questions about our services!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="tel:18332302933" className="gap-2">
                    <Phone className="h-5 w-5" />
                    Call 1-833-230-2933
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="sms:15876045127" className="gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Text 587-604-5127
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>1-833-230-2933</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span>Text: 587-604-5127</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Serving Calgary & Area</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Book;
