import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Home,
  RefreshCw,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { use3CX } from '@/hooks/use3CX';
import { listCustomers, searchCustomers, listCatalogItems, SquareCustomer, SquareCatalogItem } from '@/lib/squareCRM';
import { sendBookingConfirmation } from '@/lib/emailService';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { cn } from '@/lib/utils';

// Script type
type ScriptType = 'customer' | 'realtor';

// Call script steps - Home Setup Solutions (Evan, Calgary) - CUSTOMER VERSION
const CUSTOMER_SCRIPT = [
  {
    step: 1,
    title: "Introduction",
    script: "Hi, is this [Customer Name]?",
    responses: ["Yes, speaking", "No, wrong number", "Who is this?"],
    nextStep: { "Yes, speaking": 2, "No, wrong number": -1, "Who is this?": 2 }
  },
  {
    step: 2,
    title: "Introduction",
    script: "Great! This is Evan calling from Home Setup Solutions in Calgary. I help homeowners with deep cleaning, handyman work, and heavy lifting. Do you have a quick minute to chat?",
    responses: ["Sure, go ahead", "Not right now", "What services do you offer?"],
    nextStep: { "Sure, go ahead": 3, "Not right now": -5, "What services do you offer?": 3 }
  },
  {
    step: 3,
    title: "Value Pitch",
    script: "I handle things like move-out cleans, deep cleans, drywall patches, furniture moving, and smart home setups – so you don't have to spend your weekends doing it yourself.",
    responses: ["Tell me more", "Not interested", "Already have someone"],
    nextStep: { "Tell me more": 4, "Not interested": -2, "Already have someone": -4 }
  },
  {
    step: 4,
    title: "Qualify",
    script: "Quick question: are you mostly handling that stuff yourself right now, or do you have someone helping?",
    responses: ["Doing it myself", "Have some help", "Looking for help"],
    nextStep: { "Doing it myself": 5, "Have some help": 5, "Looking for help": 5 }
  },
  {
    step: 5,
    title: "Service Selection",
    script: "Perfect. I offer deep cleans, move-out cleans, post-reno cleanup, furniture moving, WiFi setup, and smart home installation. What kind of job do you need help with?",
    responses: ["Cleaning", "Heavy lifting", "Tech setup", "Multiple services"],
    nextStep: { "Cleaning": 6, "Heavy lifting": 6, "Tech setup": 6, "Multiple services": 6 },
    collectInfo: ["address", "bedrooms", "bathrooms"]
  },
  {
    step: 6,
    title: "Scheduling",
    script: "Great! Let's get you on the schedule. Would this week or next week work better for you?",
    responses: ["This week", "Next week", "Specific date", "Need to think about it"],
    nextStep: { "This week": 7, "Next week": 7, "Specific date": 7, "Need to think about it": -5 },
    showCalendar: true
  },
  {
    step: 7,
    title: "Confirm Booking",
    script: "Let me confirm: [Service] at [Address] on [Date] at [Time]. Does that work for you?",
    responses: ["Yes, book it!", "Change date", "Change service", "Cancel"],
    nextStep: { "Yes, book it!": 8, "Change date": 6, "Change service": 5, "Cancel": -2 }
  },
  {
    step: 8,
    title: "Complete",
    script: "You're all set! I'll send you a confirmation text with my number. If anything changes, just text me. Is there anything else I can help with?",
    responses: ["No, thank you", "Yes, one more thing"],
    nextStep: { "No, thank you": -3, "Yes, one more thing": 4 },
    isComplete: true
  }
];

// Call script steps - Home Setup Solutions (Evan, Calgary) - REALTOR VERSION
const REALTOR_SCRIPT = [
  {
    step: 1,
    title: "Introduction",
    script: "Hi, is this [Customer Name]?",
    responses: ["Yes, speaking", "No, wrong number", "Who is this?"],
    nextStep: { "Yes, speaking": 2, "No, wrong number": -1, "Who is this?": 2 }
  },
  {
    step: 2,
    title: "Introduction",
    script: "Great! This is Evan from Home Setup Solutions. I work with realtors in Calgary to help get listings show-ready fast. Do you have a quick minute?",
    responses: ["Sure, go ahead", "Not right now", "Tell me more"],
    nextStep: { "Sure, go ahead": 3, "Not right now": -5, "Tell me more": 3 }
  },
  {
    step: 3,
    title: "Value Pitch",
    script: "I help realtors with pre-listing prep – deep cleans, move-out cleans, minor repairs, staging prep, and decluttering. I get properties photo-ready fast so you can list quicker and impress your sellers.",
    responses: ["That sounds useful", "Not interested", "Already have a team"],
    nextStep: { "That sounds useful": 4, "Not interested": -2, "Already have a team": -4 }
  },
  {
    step: 4,
    title: "Qualify",
    script: "Do you currently have a go-to person for pre-listing cleanups and touch-ups, or is that something your sellers usually handle?",
    responses: ["I have someone", "Sellers handle it", "Looking for someone reliable"],
    nextStep: { "I have someone": 5, "Sellers handle it": 5, "Looking for someone reliable": 5 }
  },
  {
    step: 5,
    title: "Service Selection",
    script: "Here's what I offer: pre-listing deep cleans, move-out cleans, minor drywall patches, decluttering, and furniture moving. I send you before/after photos for every job. What do you usually need help with?",
    responses: ["Cleaning", "Repairs/touch-ups", "Full pre-listing prep", "Multiple services"],
    nextStep: { "Cleaning": 6, "Repairs/touch-ups": 6, "Full pre-listing prep": 6, "Multiple services": 6 },
    collectInfo: ["address", "bedrooms", "bathrooms"]
  },
  {
    step: 6,
    title: "Scheduling",
    script: "I can usually turn properties around in 24-48 hours. Do you have a listing coming up that needs prep, or should I just send you my info for next time?",
    responses: ["Have a listing now", "Send me your info", "Specific date", "Need to think about it"],
    nextStep: { "Have a listing now": 7, "Send me your info": -6, "Specific date": 7, "Need to think about it": -5 },
    showCalendar: true
  },
  {
    step: 7,
    title: "Confirm Booking",
    script: "Let me confirm: [Service] at [Address] on [Date] at [Time]. I'll send you photos when it's done. Sound good?",
    responses: ["Yes, book it!", "Change date", "Change service", "Cancel"],
    nextStep: { "Yes, book it!": 8, "Change date": 6, "Change service": 5, "Cancel": -2 }
  },
  {
    step: 8,
    title: "Complete",
    script: "Perfect! I'll text you the confirmation and my contact. Feel free to share my info with other agents – I give priority to referrals. Anything else I can help with?",
    responses: ["No, thank you", "Yes, one more thing"],
    nextStep: { "No, thank you": -3, "Yes, one more thing": 4 },
    isComplete: true
  }
];

const SCRIPTS = {
  customer: CUSTOMER_SCRIPT,
  realtor: REALTOR_SCRIPT
};

interface ServiceItem {
  id: string;
  name: string;
  duration: number;
  price: number;
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

interface BookingInfo {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: string;
  serviceDuration: number;
  servicePrice: number;
  address: string;
  bedrooms: string;
  bathrooms: string;
  date: Date | null;
  time: string;
  notes: string;
}

export function CallingSystemTab() {
  const { toast } = useToast();
  const { initiateCall, endCall, isCallActive, formatPhoneFor3CX } = use3CX();
  
  // Customer search
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<SquareCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<SquareCustomer | null>(null);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  
  // Services from Square
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  
  // Call state
  const [scriptType, setScriptType] = useState<ScriptType>('customer');
  const [callStarted, setCallStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState<'booked' | 'callback' | 'not-interested' | null>(null);
  
  // Get current script based on type
  const activeScript = SCRIPTS[scriptType];
  
  // Booking info
  const [booking, setBooking] = useState<BookingInfo>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    service: '',
    serviceDuration: 60,
    servicePrice: 0,
    address: '',
    bedrooms: '',
    bathrooms: '',
    date: null,
    time: '',
    notes: ''
  });
  
  const [savingBooking, setSavingBooking] = useState(false);
  const [manualPhone, setManualPhone] = useState('');

  // Load customers and services
  useEffect(() => {
    fetchCustomers();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const result = await listCatalogItems();
      const serviceItems: ServiceItem[] = (result.items || []).map(item => {
        // Get the first variation's price, default to 0 if not set
        const firstVariation = item.variations?.[0];
        const priceInCents = firstVariation?.price || 0;
        const priceInDollars = priceInCents / 100;
        
        return {
          id: item.id,
          name: item.name,
          duration: 60, // Default duration, can be customized
          price: priceInDollars
        };
      });
      setServices(serviceItems);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback to default services if Square fails
      setServices([
        { id: 'move-out', name: 'Move-Out Clean', duration: 180, price: 250 },
        { id: 'deep-clean', name: 'Deep Clean', duration: 120, price: 175 },
        { id: 'post-reno', name: 'Post-Reno Cleanup', duration: 180, price: 275 },
        { id: 'heavy-lifting', name: 'Heavy Lifting / Furniture Moving', duration: 90, price: 125 },
        { id: 'handyman', name: 'Handyman Touch-ups', duration: 60, price: 95 },
        { id: 'pre-listing', name: 'Pre-Listing Prep (Realtors)', duration: 150, price: 225 },
      ]);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const result = await listCustomers(50);
      setCustomers(result.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchCustomers();
      return;
    }
    setLoadingCustomers(true);
    try {
      const result = await searchCustomers(searchQuery);
      setCustomers(result.customers || []);
    } catch (error) {
      toast({
        title: 'Search Error',
        description: 'Could not search customers',
        variant: 'destructive'
      });
    } finally {
      setLoadingCustomers(false);
    }
  };

  const selectCustomer = (customer: SquareCustomer) => {
    setSelectedCustomer(customer);
    setBooking(prev => ({
      ...prev,
      customerName: `${customer.given_name || ''} ${customer.family_name || ''}`.trim(),
      customerPhone: customer.phone_number || '',
      customerEmail: customer.email_address || ''
    }));
  };

  const startCall = async (phone: string, name?: string) => {
    setCallStarted(true);
    setCurrentStep(1);
    setCallOutcome(null);
    
    toast({
      title: 'Call Started',
      description: `Calling ${name || phone}...`
    });
  };

  const handleResponse = (response: string) => {
    const currentScriptStep = activeScript.find(s => s.step === currentStep);
    if (!currentScriptStep) return;
    
    const nextStep = currentScriptStep.nextStep[response];
    
    if (nextStep === -1) {
      // Wrong number
      setCallOutcome('not-interested');
      toast({ title: 'Wrong Number', description: 'Ending call flow' });
      resetCall();
    } else if (nextStep === -2) {
      // Not interested
      setCallOutcome('not-interested');
      toast({ title: 'Not Interested', description: 'Customer declined' });
      resetCall();
    } else if (nextStep === -3) {
      // Call complete - proceed to book if we have info
      setCallOutcome('booked');
    } else {
      setCurrentStep(nextStep);
    }
    
    // Add to notes
    setCallNotes(prev => prev + `\nStep ${currentStep}: ${response}`);
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setBooking(prev => ({
        ...prev,
        service: service.name,
        serviceDuration: service.duration,
        servicePrice: service.price
      }));
    }
  };

  const saveAppointment = async () => {
    if (!booking.date || !booking.time || !booking.service) {
      toast({
        title: 'Missing Info',
        description: 'Please select date, time, and service',
        variant: 'destructive'
      });
      return;
    }

    setSavingBooking(true);
    try {
      const [hours, minutes] = booking.time.split(':').map(Number);
      const scheduledDate = setMinutes(setHours(booking.date, hours), minutes);

      const { error } = await supabase.from('appointments').insert({
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        customer_email: booking.customerEmail,
        service_name: booking.service,
        service_price: booking.servicePrice,
        duration_minutes: booking.serviceDuration,
        address: booking.address,
        scheduled_at: scheduledDate.toISOString(),
        notes: `Bedrooms: ${booking.bedrooms}, Bathrooms: ${booking.bathrooms}\n${booking.notes}\n\nCall Notes:\n${callNotes}`,
        status: 'scheduled'
      });

      if (error) throw error;

      // Send email confirmation if customer has email
      if (booking.customerEmail) {
        const emailResult = await sendBookingConfirmation(
          booking.customerEmail,
          booking.customerName,
          booking.service,
          format(scheduledDate, 'MMMM d, yyyy'),
          booking.time,
          booking.address,
          booking.servicePrice
        );
        
        if (emailResult.success) {
          toast({
            title: 'Appointment Booked! ✓',
            description: `${booking.service} on ${format(scheduledDate, 'MMM d')} at ${booking.time}. Confirmation email sent!`
          });
        } else {
          toast({
            title: 'Appointment Booked! ✓',
            description: `${booking.service} on ${format(scheduledDate, 'MMM d')} at ${booking.time}. (Email not sent)`
          });
        }
      } else {
        toast({
          title: 'Appointment Booked! ✓',
          description: `${booking.service} on ${format(scheduledDate, 'MMM d')} at ${booking.time}`
        });
      }

      // Reset for next call
      resetCall();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast({
        title: 'Booking Error',
        description: error instanceof Error ? error.message : 'Could not save appointment',
        variant: 'destructive'
      });
    } finally {
      setSavingBooking(false);
    }
  };

  const resetCall = () => {
    setCallStarted(false);
    setCurrentStep(1);
    setCallNotes('');
    setCallOutcome(null);
    setSelectedCustomer(null);
    setBooking({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      service: '',
      serviceDuration: 60,
      servicePrice: 0,
      address: '',
      bedrooms: '',
      bathrooms: '',
      date: null,
      time: '',
      notes: ''
    });
    setManualPhone('');
  };

  const currentScriptStep = activeScript.find(s => s.step === currentStep);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Calling System</h2>
          <p className="text-muted-foreground">Click-through call script with easy booking</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Script Type Selector */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Script:</Label>
            <Select value={scriptType} onValueChange={(v) => setScriptType(v as ScriptType)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Homeowner
                  </div>
                </SelectItem>
                <SelectItem value="realtor">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Realtor
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {callStarted && (
            <Button variant="destructive" onClick={resetCall}>
              <PhoneOff className="h-4 w-4 mr-2" />
              End & Reset
            </Button>
          )}
        </div>
      </div>

      {!callStarted ? (
        /* Customer Selection / Manual Dial */
        <div className="grid md:grid-cols-2 gap-4">
          {/* Customer List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Customer to Call
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loadingCustomers}>
                  {loadingCustomers ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Search'}
                </Button>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {customers.map(customer => (
                  <div
                    key={customer.id}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors",
                      selectedCustomer?.id === customer.id && "border-primary bg-accent"
                    )}
                    onClick={() => selectCustomer(customer)}
                  >
                    <div className="font-medium">
                      {customer.given_name} {customer.family_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customer.phone_number || 'No phone'}
                    </div>
                  </div>
                ))}
                {customers.length === 0 && !loadingCustomers && (
                  <p className="text-center text-muted-foreground py-4">No customers found</p>
                )}
              </div>

              {selectedCustomer && selectedCustomer.phone_number && (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => startCall(selectedCustomer.phone_number!, `${selectedCustomer.given_name} ${selectedCustomer.family_name}`)}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call {selectedCustomer.given_name}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Manual Dial */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Manual Dial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="Enter phone number..."
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <Label>Customer Name (optional)</Label>
                <Input
                  placeholder="Enter name..."
                  value={booking.customerName}
                  onChange={(e) => setBooking(prev => ({ ...prev, customerName: e.target.value }))}
                />
              </div>
              <Button 
                className="w-full" 
                size="lg"
                disabled={!manualPhone}
                onClick={() => {
                  setBooking(prev => ({ ...prev, customerPhone: manualPhone }));
                  startCall(manualPhone, booking.customerName);
                }}
              >
                <Phone className="h-5 w-5 mr-2" />
                Start Call
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Call In Progress - Script Flow */
        <div className="grid md:grid-cols-3 gap-4">
          {/* Left: Script */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Step {currentStep}: {currentScriptStep?.title}
                </CardTitle>
                <Badge variant="outline" className="text-green-600">
                  <Phone className="h-3 w-3 mr-1 animate-pulse" />
                  On Call with {booking.customerName || 'Customer'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Script to read */}
              <div className="bg-muted p-4 rounded-lg text-lg">
                "{currentScriptStep?.script}"
              </div>

              {/* Response buttons */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Customer Response:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {currentScriptStep?.responses.map(response => (
                    <Button
                      key={response}
                      variant="outline"
                      size="lg"
                      className="h-auto py-3 text-left justify-start"
                      onClick={() => handleResponse(response)}
                    >
                      <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                      {response}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Collect info sections */}
              {currentScriptStep?.collectInfo && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3 space-y-2">
                    <Label>Address</Label>
                    <Input
                      placeholder="123 Main St, City, State"
                      value={booking.address}
                      onChange={(e) => setBooking(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Select value={booking.bedrooms} onValueChange={(v) => setBooking(prev => ({ ...prev, bedrooms: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {['1', '2', '3', '4', '5', '6+'].map(n => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Select value={booking.bathrooms} onValueChange={(v) => setBooking(prev => ({ ...prev, bathrooms: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {['1', '1.5', '2', '2.5', '3', '3.5', '4+'].map(n => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Service selection */}
              {currentStep === 3 && (
                <div className="space-y-2">
                  <Label>Select Service {loadingServices && <span className="text-xs text-muted-foreground">(Loading from Square...)</span>}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map(service => (
                      <Button
                        key={service.id}
                        variant={booking.service === service.name ? "default" : "outline"}
                        className="h-auto py-3 flex-col items-start"
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        <span className="font-medium">{service.name}</span>
                        <span className="text-xs opacity-70">${service.price} • {service.duration}min</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendar for scheduling */}
              {currentScriptStep?.showCalendar && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={booking.date || undefined}
                      onSelect={(date) => setBooking(prev => ({ ...prev, date: date || null }))}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Select Time</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {TIME_SLOTS.map(time => (
                        <Button
                          key={time}
                          variant={booking.time === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBooking(prev => ({ ...prev, time }))}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Complete step - Book button */}
              {currentScriptStep?.isComplete && (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-lg space-y-4">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Ready to Book!</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p><strong>Customer:</strong> {booking.customerName}</p>
                    <p><strong>Service:</strong> {booking.service}</p>
                    <p><strong>Address:</strong> {booking.address}</p>
                    <p><strong>Date:</strong> {booking.date ? format(booking.date, 'MMM d, yyyy') : 'Not set'}</p>
                    <p><strong>Time:</strong> {booking.time || 'Not set'}</p>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={savingBooking}
                    onClick={saveAppointment}
                  >
                    {savingBooking ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Book Appointment Now
                  </Button>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
                >
                  Skip
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right: Quick Info Panel */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Customer name"
                    value={booking.customerName}
                    onChange={(e) => setBooking(prev => ({ ...prev, customerName: e.target.value }))}
                    className="h-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Phone"
                    value={booking.customerPhone}
                    onChange={(e) => setBooking(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className="h-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{booking.service || 'No service selected'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{booking.address || 'No address'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.date ? format(booking.date, 'MMM d') : 'No date'} {booking.time || ''}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Quick Notes</Label>
                <Textarea
                  placeholder="Add notes during call..."
                  value={booking.notes}
                  onChange={(e) => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                  className="h-24 text-sm"
                />
              </div>

              {/* Quick Book Button */}
              <Button 
                className="w-full"
                disabled={!booking.date || !booking.time || !booking.service || savingBooking}
                onClick={saveAppointment}
              >
                {savingBooking ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Quick Book
              </Button>

              {/* Step Progress */}
              <div className="pt-4 border-t">
                <Label className="text-xs mb-2 block">Progress</Label>
                <div className="flex gap-1">
                  {activeScript.map(step => (
                    <div
                      key={step.step}
                      className={cn(
                        "h-2 flex-1 rounded-full transition-colors",
                        step.step < currentStep ? "bg-green-500" :
                        step.step === currentStep ? "bg-primary" :
                        "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
