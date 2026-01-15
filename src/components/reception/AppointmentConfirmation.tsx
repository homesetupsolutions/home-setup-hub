import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  MessageSquare,
  User,
  AlertCircle,
  PhoneCall,
  Send,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, isToday, isTomorrow, addDays, startOfDay, endOfDay } from 'date-fns';

interface Appointment {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  service_name: string;
  scheduled_at: string;
  duration_minutes: number;
  address: string | null;
  status: string;
  notes: string | null;
  reminder_morning_sent: boolean | null;
  reminder_hour_sent: boolean | null;
}

const M365_BOOKING_URL = 'https://outlook.office.com/book/allbookings@homesetupsolutions.ca/';

export function AppointmentConfirmation() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'week'>('today');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const getDateRange = () => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (selectedDate) {
      case 'today':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'tomorrow':
        start = startOfDay(addDays(now, 1));
        end = endOfDay(addDays(now, 1));
        break;
      case 'week':
        start = startOfDay(now);
        end = endOfDay(addDays(now, 7));
        break;
      default:
        start = startOfDay(now);
        end = endOfDay(now);
    }

    return { start, end };
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { start, end } = getDateRange();
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('scheduled_at', start.toISOString())
        .lte('scheduled_at', end.toISOString())
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load appointments',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmAppointment = async (appointment: Appointment) => {
    setConfirmingId(appointment.id);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'confirmed',
          reminder_morning_sent: true
        })
        .eq('id', appointment.id);

      if (error) throw error;

      toast({
        title: 'Appointment Confirmed',
        description: `${appointment.customer_name}'s appointment has been confirmed`
      });

      fetchAppointments();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to confirm appointment',
        variant: 'destructive'
      });
    } finally {
      setConfirmingId(null);
    }
  };

  const cancelAppointment = async (appointment: Appointment) => {
    setConfirmingId(appointment.id);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointment.id);

      if (error) throw error;

      toast({
        title: 'Appointment Cancelled',
        description: `${appointment.customer_name}'s appointment has been cancelled`
      });

      fetchAppointments();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel appointment',
        variant: 'destructive'
      });
    } finally {
      setConfirmingId(null);
    }
  };

  const rescheduleAppointment = async (appointment: Appointment) => {
    // Open M365 Bookings page for rescheduling
    window.open(M365_BOOKING_URL, '_blank');
    toast({
      title: 'M365 Bookings Opened',
      description: 'Reschedule the appointment in Microsoft Bookings'
    });
  };

  const sendConfirmationSMS = (appointment: Appointment) => {
    if (!appointment.customer_phone) {
      toast({
        title: 'No Phone Number',
        description: 'Customer has no phone number on file',
        variant: 'destructive'
      });
      return;
    }

    const date = format(new Date(appointment.scheduled_at), 'MMM d');
    const time = format(new Date(appointment.scheduled_at), 'h:mm a');
    const message = `Hi ${appointment.customer_name?.split(' ')[0] || 'there'}! This is Home Setup Solutions confirming your ${appointment.service_name} appointment on ${date} at ${time}. Reply YES to confirm or call 1-833-230-2933 with any questions.`;
    
    // Open SMS link (would integrate with actual SMS service)
    window.open(`sms:${appointment.customer_phone}?body=${encodeURIComponent(message)}`, '_blank');
    
    toast({
      title: 'SMS Opened',
      description: 'Confirmation message ready to send'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const pendingCount = appointments.filter(a => a.status === 'scheduled').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Appointment Confirmation
          </h2>
          <p className="text-muted-foreground">Confirm and manage upcoming appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchAppointments}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => window.open(M365_BOOKING_URL, '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open M365 Bookings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Need Confirmation</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{confirmedCount}</p>
                <p className="text-xs text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.length}</p>
                <p className="text-xs text-muted-foreground">Total Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <a href={M365_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="p-2 rounded-lg bg-primary/10">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">M365 Bookings</p>
                <p className="text-xs text-muted-foreground">View Full Calendar</p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Date Filter */}
      <Tabs value={selectedDate} onValueChange={(v) => setSelectedDate(v as any)}>
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          <TabsTrigger value="week">Next 7 Days</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Appointments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Appointments</h3>
            <p className="text-muted-foreground mb-4">
              No appointments scheduled for {selectedDate === 'today' ? 'today' : selectedDate === 'tomorrow' ? 'tomorrow' : 'this week'}
            </p>
            <Button onClick={() => window.open(M365_BOOKING_URL, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map(appointment => (
            <Card key={appointment.id} className={`${appointment.status === 'cancelled' ? 'opacity-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Appointment Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{appointment.customer_name || 'Unknown Customer'}</h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(appointment.scheduled_at), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(appointment.scheduled_at), 'h:mm a')} ({appointment.duration_minutes}min)</span>
                      </div>
                      {appointment.customer_phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${appointment.customer_phone}`} className="hover:text-primary">{appointment.customer_phone}</a>
                        </div>
                      )}
                      {appointment.address && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{appointment.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{appointment.service_name}</Badge>
                      {appointment.reminder_morning_sent && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Reminder Sent
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {appointment.customer_phone && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendConfirmationSMS(appointment)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Text
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${appointment.customer_phone}`, '_self')}
                        >
                          <PhoneCall className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </>
                    )}
                    
                    {appointment.status === 'scheduled' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => confirmAppointment(appointment)}
                          disabled={confirmingId === appointment.id}
                        >
                          {confirmingId === appointment.id ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                          )}
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rescheduleAppointment(appointment)}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => cancelAppointment(appointment)}
                          disabled={confirmingId === appointment.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rescheduleAppointment(appointment)}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Reschedule
                      </Button>
                    )}
                  </div>
                </div>

                {appointment.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Notes:</strong> {appointment.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
