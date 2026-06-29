import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  PhoneIncoming,
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
  Mail,
  Building2,
  Wrench,
  HelpCircle,
  AlertTriangle,
  ExternalLink,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import { listCustomers, searchCustomers, SquareCustomer } from '@/lib/squareCRM';
import { sendBookingConfirmation } from '@/lib/emailService';
import { format, setHours, setMinutes } from 'date-fns';
import { cn } from '@/lib/utils';

// Script types
type ScriptType = 'incoming' | 'outbound-customer' | 'outbound-realtor' | 'follow-up' | 'troubleshooting';

const M365_BOOKING_URL = 'https://outlook.office.com/book/HomeSetupSolutions1@homesetupsolutions.ca/?ismsaljsauthenabled';

// ==================== INCOMING CALL SCRIPT ====================
const INCOMING_SCRIPT = [
  {
    step: 1,
    title: "Greeting",
    script: "Thank you for calling Home Setup Solutions, this is [Your Name]. How can I help you today?",
    responses: ["Book an appointment", "Pricing inquiry", "Existing appointment", "Speak to Evan", "Other question"],
    nextStep: { "Book an appointment": 2, "Pricing inquiry": 3, "Existing appointment": 4, "Speak to Evan": -7, "Other question": 5 }
  },
  {
    step: 2,
    title: "New Booking",
    script: "I'd be happy to help you book an appointment! What service are you looking for today? We offer deep cleaning, move-out cleans, handyman services, furniture moving, and smart home setup.",
    responses: ["Cleaning service", "Handyman work", "Moving/lifting", "Smart home/Tech", "Not sure yet"],
    nextStep: { "Cleaning service": 6, "Handyman work": 6, "Moving/lifting": 6, "Smart home/Tech": 6, "Not sure yet": 6 },
    collectInfo: ["address", "bedrooms", "bathrooms"]
  },
  {
    step: 3,
    title: "Pricing",
    script: "Our pricing depends on the service and scope. Deep cleans start at $150, move-out cleans from $200, handyman work is $75/hour, and tech setup starts at $85. Would you like me to give you a custom quote?",
    responses: ["Yes, get a quote", "Book an appointment", "Just browsing", "Too expensive"],
    nextStep: { "Yes, get a quote": 6, "Book an appointment": 2, "Just browsing": -5, "Too expensive": -8 }
  },
  {
    step: 4,
    title: "Existing Appointment",
    script: "I can help with your existing appointment. Can I get your name or phone number to look it up?",
    responses: ["Confirm appointment", "Reschedule", "Cancel appointment", "Question about service"],
    nextStep: { "Confirm appointment": -3, "Reschedule": -9, "Cancel appointment": -10, "Question about service": 5 }
  },
  {
    step: 5,
    title: "General Question",
    script: "Of course! What would you like to know? I'm happy to help with any questions about our services, availability, or process.",
    responses: ["Question answered", "Book an appointment", "Need to speak to Evan", "Will call back"],
    nextStep: { "Question answered": -3, "Book an appointment": 2, "Need to speak to Evan": -7, "Will call back": -5 }
  },
  {
    step: 6,
    title: "Collect Details",
    script: "Great choice! Let me get some details. What's the address for the service, and when works best for you?",
    responses: ["Details provided", "Need to check schedule", "Just getting a quote"],
    nextStep: { "Details provided": 7, "Need to check schedule": -5, "Just getting a quote": -3 },
    showCalendar: true
  },
  {
    step: 7,
    title: "Confirm Booking",
    script: "Let me confirm: [Service] at [Address] on [Date] at [Time]. I'll send you a confirmation text. Is there anything else I can help with?",
    responses: ["Perfect, thank you!", "Change something", "Add another service"],
    nextStep: { "Perfect, thank you!": 8, "Change something": 6, "Add another service": 2 },
    isComplete: true
  },
  {
    step: 8,
    title: "Closing",
    script: "You're all set! You'll receive a confirmation text shortly. Feel free to text us at 1-778-989-4357 if you have any questions. Have a great day!",
    responses: ["Goodbye"],
    nextStep: { "Goodbye": -3 }
  }
];

// ==================== OUTBOUND CUSTOMER SCRIPT ====================
const OUTBOUND_CUSTOMER_SCRIPT = [
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
    script: "Great! This is [Your Name] calling from Home Setup Solutions in Vancouver. We help homeowners with deep cleaning, handyman work, and heavy lifting. Do you have a quick minute to chat?",
    responses: ["Sure, go ahead", "Not right now", "What services do you offer?"],
    nextStep: { "Sure, go ahead": 3, "Not right now": -5, "What services do you offer?": 3 }
  },
  {
    step: 3,
    title: "Value Pitch",
    script: "We handle things like move-out cleans, deep cleans, drywall patches, furniture moving, and smart home setups – so you don't have to spend your weekends doing it yourself.",
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
    script: "Perfect. We offer deep cleans, move-out cleans, post-reno cleanup, furniture moving, WiFi setup, and smart home installation. What kind of job would be most helpful for you?",
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
    nextStep: { "Yes, book it!": 8, "Change date": 6, "Change service": 5, "Cancel": -2 },
    isComplete: true
  },
  {
    step: 8,
    title: "Complete",
    script: "You're all set! I'll send you a confirmation text with our number. If anything changes, just text us. Is there anything else I can help with?",
    responses: ["No, thank you", "Yes, one more thing"],
    nextStep: { "No, thank you": -3, "Yes, one more thing": 4 }
  }
];

// ==================== REALTOR SCRIPT ====================
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
    script: "Great! This is [Your Name] from Home Setup Solutions. We work with realtors in Vancouver to help get listings show-ready fast. Do you have a quick minute?",
    responses: ["Sure, go ahead", "Not right now", "Tell me more"],
    nextStep: { "Sure, go ahead": 3, "Not right now": -5, "Tell me more": 3 }
  },
  {
    step: 3,
    title: "Value Pitch",
    script: "We help realtors with pre-listing prep – deep cleans, move-out cleans, minor repairs, staging prep, and decluttering. We get properties photo-ready fast so you can list quicker and impress your sellers.",
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
    script: "Here's what we offer: pre-listing deep cleans, move-out cleans, minor drywall patches, decluttering, and furniture moving. We send you before/after photos for every job. What do you usually need help with?",
    responses: ["Cleaning", "Repairs/touch-ups", "Full pre-listing prep", "Multiple services"],
    nextStep: { "Cleaning": 6, "Repairs/touch-ups": 6, "Full pre-listing prep": 6, "Multiple services": 6 },
    collectInfo: ["address", "bedrooms", "bathrooms"]
  },
  {
    step: 6,
    title: "Scheduling",
    script: "We can usually turn properties around in 24-48 hours. Do you have a listing coming up that needs prep, or should I just send you our info for next time?",
    responses: ["Have a listing now", "Send me your info", "Specific date", "Need to think about it"],
    nextStep: { "Have a listing now": 7, "Send me your info": -6, "Specific date": 7, "Need to think about it": -5 },
    showCalendar: true
  },
  {
    step: 7,
    title: "Confirm Booking",
    script: "Let me confirm: [Service] at [Address] on [Date] at [Time]. We'll send you photos when it's done. Sound good?",
    responses: ["Yes, book it!", "Change date", "Change service", "Cancel"],
    nextStep: { "Yes, book it!": 8, "Change date": 6, "Change service": 5, "Cancel": -2 },
    isComplete: true
  },
  {
    step: 8,
    title: "Complete",
    script: "Perfect! I'll text you the confirmation and our contact info. Feel free to share with other agents – we give priority to referrals. Anything else I can help with?",
    responses: ["No, thank you", "Yes, one more thing"],
    nextStep: { "No, thank you": -3, "Yes, one more thing": 4 }
  }
];

// ==================== FOLLOW-UP SCRIPT ====================
const FOLLOW_UP_SCRIPT = [
  {
    step: 1,
    title: "Introduction",
    script: "Hi, is this [Customer Name]? This is [Your Name] from Home Setup Solutions calling to follow up.",
    responses: ["Yes, speaking", "No, wrong number", "Who?"],
    nextStep: { "Yes, speaking": 2, "No, wrong number": -1, "Who?": 2 }
  },
  {
    step: 2,
    title: "Context",
    script: "I'm following up on [previous quote/service/inquiry]. I wanted to check if you had any questions or if you'd like to move forward with booking?",
    responses: ["Ready to book", "Still thinking", "Have questions", "Not interested"],
    nextStep: { "Ready to book": 3, "Still thinking": 4, "Have questions": 5, "Not interested": -2 }
  },
  {
    step: 3,
    title: "Booking",
    script: "Excellent! Let's get you scheduled. When would work best for you?",
    responses: ["This week", "Next week", "Need to check"],
    nextStep: { "This week": 6, "Next week": 6, "Need to check": -5 },
    showCalendar: true
  },
  {
    step: 4,
    title: "Thinking",
    script: "No problem at all! Is there anything specific holding you back that I can address? We also offer flexible scheduling and payment options.",
    responses: ["Price concern", "Timing issue", "Need spouse approval", "Just busy"],
    nextStep: { "Price concern": -8, "Timing issue": 3, "Need spouse approval": -5, "Just busy": -5 }
  },
  {
    step: 5,
    title: "Questions",
    script: "Of course! What questions do you have? I'm happy to clarify anything about our services, pricing, or process.",
    responses: ["Question answered", "Ready to book now", "Need more time", "Not interested"],
    nextStep: { "Question answered": 3, "Ready to book now": 3, "Need more time": -5, "Not interested": -2 }
  },
  {
    step: 6,
    title: "Confirm",
    script: "Perfect! Let me confirm your appointment: [Service] on [Date] at [Time]. I'll send a confirmation text right away.",
    responses: ["Sounds great!", "Need to change something"],
    nextStep: { "Sounds great!": 7, "Need to change something": 3 },
    isComplete: true
  },
  {
    step: 7,
    title: "Closing",
    script: "You're all set! We look forward to helping you. Have a great day!",
    responses: ["Thank you, goodbye"],
    nextStep: { "Thank you, goodbye": -3 }
  }
];

// ==================== TROUBLESHOOTING SCRIPT ====================
const TROUBLESHOOTING_SCRIPT = [
  {
    step: 1,
    title: "Identify Issue",
    script: "I understand you're experiencing an issue. Can you tell me more about what's happening?",
    responses: ["Tech not working", "Service quality concern", "Billing question", "Scheduling issue", "Staff complaint"],
    nextStep: { "Tech not working": 2, "Service quality concern": 3, "Billing question": 4, "Scheduling issue": 5, "Staff complaint": 6 }
  },
  {
    step: 2,
    title: "Tech Issue",
    script: "I'm sorry the technology isn't working as expected. Can you describe what's happening? Is it completely not working or behaving unexpectedly?",
    responses: ["Not working at all", "Partially working", "Need help using it"],
    nextStep: { "Not working at all": 7, "Partially working": 7, "Need help using it": 8 }
  },
  {
    step: 3,
    title: "Quality Concern",
    script: "I'm very sorry to hear that. Your satisfaction is our priority. Can you tell me specifically what wasn't up to standard?",
    responses: ["Cleaning wasn't thorough", "Work incomplete", "Damage occurred", "Other issue"],
    nextStep: { "Cleaning wasn't thorough": 9, "Work incomplete": 9, "Damage occurred": 10, "Other issue": 9 }
  },
  {
    step: 4,
    title: "Billing",
    script: "I can help with billing questions. What would you like to know about your invoice or payment?",
    responses: ["Dispute charge", "Payment question", "Need invoice", "Refund request"],
    nextStep: { "Dispute charge": 11, "Payment question": 11, "Need invoice": 11, "Refund request": 11 }
  },
  {
    step: 5,
    title: "Scheduling",
    script: "I can help with scheduling. What would you like to do with your appointment?",
    responses: ["Reschedule", "Cancel", "Change service", "Add time"],
    nextStep: { "Reschedule": -9, "Cancel": -10, "Change service": 12, "Add time": 12 }
  },
  {
    step: 6,
    title: "Staff Complaint",
    script: "I'm very sorry to hear about your experience. We take feedback seriously. Can you tell me what happened so I can escalate this?",
    responses: ["Provide details", "Want to speak to manager"],
    nextStep: { "Provide details": 10, "Want to speak to manager": -7 }
  },
  {
    step: 7,
    title: "Schedule Tech Visit",
    script: "Let me schedule a technician to come take a look at this. When would be a good time for a service call?",
    responses: ["ASAP", "This week", "Schedule for later"],
    nextStep: { "ASAP": 13, "This week": 13, "Schedule for later": 13 },
    showCalendar: true
  },
  {
    step: 8,
    title: "Remote Help",
    script: "I'd be happy to walk you through it. Let me connect you with our tech support, or I can provide basic instructions now.",
    responses: ["Instructions now", "Connect to tech support", "Schedule visit instead"],
    nextStep: { "Instructions now": 14, "Connect to tech support": -7, "Schedule visit instead": 7 }
  },
  {
    step: 9,
    title: "Service Recovery",
    script: "I sincerely apologize for this. I'd like to make it right. We can either send someone back to complete the work at no charge, or offer a discount on your next service. Which would you prefer?",
    responses: ["Send someone back", "Discount on next service", "Want refund", "Speak to manager"],
    nextStep: { "Send someone back": 13, "Discount on next service": 15, "Want refund": 11, "Speak to manager": -7 }
  },
  {
    step: 10,
    title: "Escalation",
    script: "I'm documenting this now and will escalate to our supervisor Evan immediately. He will call you back within 24 hours. Is that acceptable?",
    responses: ["Yes, that's fine", "No, need immediate call", "Want to file formal complaint"],
    nextStep: { "Yes, that's fine": 15, "No, need immediate call": -7, "Want to file formal complaint": 15 }
  },
  {
    step: 11,
    title: "Billing Resolution",
    script: "I'll note your concern and have our billing team review this. You'll receive a call or email within 2 business days. Is there anything else I can help with?",
    responses: ["That works", "Need faster resolution"],
    nextStep: { "That works": 15, "Need faster resolution": -7 }
  },
  {
    step: 12,
    title: "Service Change",
    script: "I can help modify your service. Let me pull up your appointment to make the changes.",
    responses: ["Changes made", "Need to reschedule too"],
    nextStep: { "Changes made": 15, "Need to reschedule too": -9 }
  },
  {
    step: 13,
    title: "Appointment Set",
    script: "I've got you scheduled for [Date/Time]. A technician will arrive to address the issue. Is there anything else?",
    responses: ["All set, thank you", "One more thing"],
    nextStep: { "All set, thank you": 15, "One more thing": 1 },
    isComplete: true
  },
  {
    step: 14,
    title: "Instructions",
    script: "Here are some quick steps to try: [Provide relevant troubleshooting]. Did that help resolve the issue?",
    responses: ["Yes, it's working now", "No, still having issues", "Need more help"],
    nextStep: { "Yes, it's working now": 15, "No, still having issues": 7, "Need more help": -7 }
  },
  {
    step: 15,
    title: "Closing",
    script: "Thank you for your patience. I've documented everything. Is there anything else I can help you with today?",
    responses: ["No, thank you", "Yes, another question"],
    nextStep: { "No, thank you": -3, "Yes, another question": 1 }
  }
];

const SCRIPTS = {
  'incoming': { script: INCOMING_SCRIPT, label: 'Incoming Call', icon: PhoneIncoming, color: 'text-green-600' },
  'outbound-customer': { script: OUTBOUND_CUSTOMER_SCRIPT, label: 'Outbound (Customer)', icon: Phone, color: 'text-blue-600' },
  'outbound-realtor': { script: REALTOR_SCRIPT, label: 'Outbound (Realtor)', icon: Building2, color: 'text-purple-600' },
  'follow-up': { script: FOLLOW_UP_SCRIPT, label: 'Follow-Up Call', icon: Users, color: 'text-orange-600' },
  'troubleshooting': { script: TROUBLESHOOTING_SCRIPT, label: 'Troubleshooting', icon: Wrench, color: 'text-red-600' }
};

interface ServiceItem {
  id: string;
  name: string;
  duration: number;
  price: number;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { id: 'move-out', name: 'Move-Out Clean', duration: 180, price: 250 },
  { id: 'deep-clean', name: 'Deep Clean', duration: 120, price: 175 },
  { id: 'post-reno', name: 'Post-Reno Cleanup', duration: 180, price: 275 },
  { id: 'heavy-lifting', name: 'Heavy Lifting / Furniture Moving', duration: 90, price: 125 },
  { id: 'handyman', name: 'Handyman Touch-ups', duration: 60, price: 95 },
  { id: 'pre-listing', name: 'Pre-Listing Prep (Realtors)', duration: 150, price: 225 },
  { id: 'smart-home', name: 'Smart Home Setup', duration: 90, price: 150 },
  { id: 'wifi-setup', name: 'WiFi/Network Setup', duration: 60, price: 85 },
];

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

export function CallScripts() {
  const { toast } = useToast();
  
  // Customer search
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<SquareCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<SquareCustomer | null>(null);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  
  // Services
  const [services] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  
  // Call state
  const [scriptType, setScriptType] = useState<ScriptType>('incoming');
  const [callStarted, setCallStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState<string | null>(null);
  
  // Get current script based on type
  const activeScriptData = SCRIPTS[scriptType];
  const activeScript = activeScriptData.script;
  
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

  // Load customers
  useEffect(() => {
    fetchCustomers();
  }, []);

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
      description: `Using ${activeScriptData.label} script for ${name || phone}`
    });
  };

  const handleResponse = (response: string) => {
    const currentScriptStep = activeScript.find(s => s.step === currentStep);
    if (!currentScriptStep) return;
    
    const nextStep = currentScriptStep.nextStep[response];
    
    // Handle special outcome codes
    if (nextStep < 0) {
      const outcomes: Record<number, string> = {
        '-1': 'Wrong Number',
        '-2': 'Not Interested',
        '-3': 'Call Completed Successfully',
        '-4': 'Already Has Service Provider',
        '-5': 'Callback Requested',
        '-6': 'Info Sent',
        '-7': 'Transfer to Evan/Supervisor',
        '-8': 'Price Objection - Offered Discount',
        '-9': 'Reschedule Requested',
        '-10': 'Cancellation Processed'
      };
      
      setCallOutcome(outcomes[nextStep.toString()] || 'Call Ended');
      
      if (nextStep === -7) {
        toast({ title: 'Transfer Required', description: 'Please transfer call to Evan at ext. 101' });
      } else if (nextStep === -9) {
        window.open(M365_BOOKING_URL, '_blank');
        toast({ title: 'M365 Bookings Opened', description: 'Reschedule in Microsoft Bookings' });
      }
      
      return;
    }
    
    setCurrentStep(nextStep);
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
        await sendBookingConfirmation(
          booking.customerEmail,
          booking.customerName,
          booking.service,
          format(scheduledDate, 'MMMM d, yyyy'),
          booking.time,
          booking.address,
          booking.servicePrice
        );
      }

      toast({
        title: 'Appointment Booked! ✓',
        description: `${booking.service} on ${format(scheduledDate, 'MMM d')} at ${booking.time}`
      });

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
  const ScriptIcon = activeScriptData.icon;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Phone className="h-6 w-6 text-primary" />
            Call Scripts
          </h2>
          <p className="text-muted-foreground">Guided scripts for different call scenarios</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" onClick={() => window.open(M365_BOOKING_URL, '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            M365 Bookings
          </Button>
          {callStarted && (
            <Button variant="destructive" onClick={resetCall}>
              <PhoneOff className="h-4 w-4 mr-2" />
              End Call
            </Button>
          )}
        </div>
      </div>

      {/* Script Type Selector */}
      <Card>
        <CardContent className="py-4">
          <Tabs value={scriptType} onValueChange={(v) => { setScriptType(v as ScriptType); resetCall(); }}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-5 gap-2 h-auto">
              {Object.entries(SCRIPTS).map(([key, { label, icon: Icon, color }]) => (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2 py-2">
                  <Icon className={`h-4 w-4 ${scriptType === key ? color : ''}`} />
                  <span className="hidden sm:inline text-xs">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {!callStarted ? (
        /* Customer Selection / Start Call */
        <div className="grid md:grid-cols-2 gap-4">
          {/* Customer List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Customer
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
              
              <div className="max-h-[250px] overflow-y-auto space-y-2">
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
              </div>

              {selectedCustomer && (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => startCall(selectedCustomer.phone_number || '', `${selectedCustomer.given_name} ${selectedCustomer.family_name}`)}
                >
                  <ScriptIcon className="h-5 w-5 mr-2" />
                  Start {activeScriptData.label}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Manual/Incoming */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PhoneIncoming className="h-5 w-5" />
                {scriptType === 'incoming' ? 'Incoming Call' : 'Manual Dial'}
              </CardTitle>
              <CardDescription>
                {scriptType === 'incoming' 
                  ? 'Start script when you answer a call'
                  : 'Enter phone number to start outbound call'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scriptType !== 'incoming' && (
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="Enter phone number..."
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    type="tel"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  placeholder="Enter name..."
                  value={booking.customerName}
                  onChange={(e) => setBooking(prev => ({ ...prev, customerName: e.target.value }))}
                />
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => {
                  if (scriptType !== 'incoming' && manualPhone) {
                    setBooking(prev => ({ ...prev, customerPhone: manualPhone }));
                  }
                  startCall(manualPhone || 'incoming', booking.customerName);
                }}
              >
                <ScriptIcon className={`h-5 w-5 mr-2 ${activeScriptData.color}`} />
                Start {activeScriptData.label}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : callOutcome ? (
        /* Call Outcome */
        <Card className="border-2">
          <CardContent className="py-8 text-center">
            {callOutcome.includes('Successfully') || callOutcome.includes('Completed') ? (
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
            ) : callOutcome.includes('Not Interested') || callOutcome.includes('Wrong') ? (
              <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            ) : (
              <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
            )}
            <h3 className="text-2xl font-bold mb-2">{callOutcome}</h3>
            <p className="text-muted-foreground mb-6">Call has ended</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={resetCall}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Start New Call
              </Button>
              {booking.service && booking.date && (
                <Button variant="default" onClick={saveAppointment} disabled={savingBooking}>
                  {savingBooking ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                  Save Booking
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Call In Progress */
        <div className="grid md:grid-cols-3 gap-4">
          {/* Script Panel */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ScriptIcon className={`h-5 w-5 ${activeScriptData.color}`} />
                  Step {currentStep}: {currentScriptStep?.title}
                </CardTitle>
                <Badge variant="outline" className="text-green-600">
                  <Phone className="h-3 w-3 mr-1 animate-pulse" />
                  On Call
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Script text */}
              <div className="bg-muted p-4 rounded-lg text-lg leading-relaxed">
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
              {(currentScriptStep as any)?.collectInfo && (
                <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                  <div className="col-span-3 space-y-2">
                    <Label>Address</Label>
                    <Input
                      placeholder="123 Main St, City"
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
                  <div className="space-y-2">
                    <Label>Service</Label>
                    <Select value={services.find(s => s.name === booking.service)?.id || ''} onValueChange={handleServiceSelect}>
                      <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                      <SelectContent>
                        {services.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Calendar for scheduling */}
              {currentScriptStep?.showCalendar && (
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
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
                  <div className="space-y-4">
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
                    {!booking.service && (
                      <div className="space-y-2">
                        <Label>Select Service</Label>
                        <Select value={services.find(s => s.name === booking.service)?.id || ''} onValueChange={handleServiceSelect}>
                          <SelectTrigger><SelectValue placeholder="Choose service" /></SelectTrigger>
                          <SelectContent>
                            {services.map(s => (
                              <SelectItem key={s.id} value={s.id}>{s.name} - ${s.price}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Complete step */}
              {currentScriptStep?.isComplete && booking.date && booking.time && booking.service && (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-lg space-y-4">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Ready to Book!</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p><strong>Customer:</strong> {booking.customerName}</p>
                    <p><strong>Service:</strong> {booking.service} (${booking.servicePrice})</p>
                    <p><strong>Address:</strong> {booking.address}</p>
                    <p><strong>Date:</strong> {booking.date ? format(booking.date, 'MMM d, yyyy') : ''} at {booking.time}</p>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={savingBooking}
                    onClick={saveAppointment}
                  >
                    {savingBooking ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
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
                  onClick={() => setCurrentStep(Math.min(activeScript.length, currentStep + 1))}
                >
                  Skip
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Call Summary</CardTitle>
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
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Email"
                    value={booking.customerEmail}
                    onChange={(e) => setBooking(prev => ({ ...prev, customerEmail: e.target.value }))}
                    className="h-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Quick Notes</Label>
                <Textarea
                  placeholder="Notes..."
                  value={booking.notes}
                  onChange={(e) => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                  className="h-20 text-sm"
                />
              </div>

              {booking.service && (
                <div className="p-3 bg-muted rounded-lg text-sm space-y-1">
                  <p><strong>Service:</strong> {booking.service}</p>
                  {booking.address && <p><strong>Address:</strong> {booking.address}</p>}
                  {booking.date && <p><strong>Date:</strong> {format(booking.date, 'MMM d')}</p>}
                  {booking.time && <p><strong>Time:</strong> {booking.time}</p>}
                </div>
              )}

              {/* Quick Book */}
              <Button 
                className="w-full"
                disabled={!booking.date || !booking.time || !booking.service || savingBooking}
                onClick={saveAppointment}
              >
                {savingBooking ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                Quick Book
              </Button>

              {/* Progress */}
              <div className="pt-4 border-t">
                <Label className="text-xs mb-2 block">Progress</Label>
                <div className="flex gap-1">
                  {activeScript.slice(0, 8).map((step, idx) => (
                    <div
                      key={idx}
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
