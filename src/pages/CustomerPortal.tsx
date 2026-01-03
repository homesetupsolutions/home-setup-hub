import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, History, User, LogOut, Phone, Mail, Clock, MapPin, CreditCard, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { getMyTransactions, SquarePayment, SquareBooking } from '@/lib/squareCRM';

interface Appointment {
  id: string;
  service_name: string;
  scheduled_at: string;
  status: string;
  address?: string;
  notes?: string;
  duration_minutes: number;
}

interface Profile {
  full_name: string | null;
  email: string;
  phone: string | null;
}

export default function CustomerPortal() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [squarePayments, setSquarePayments] = useState<SquarePayment[]>([]);
  const [squareBookings, setSquareBookings] = useState<SquareBooking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?type=customer');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('user_id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setProfile(profileData);
      }

      // Fetch local appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, service_name, scheduled_at, status, address, notes, duration_minutes')
        .eq('customer_id', user?.id)
        .order('scheduled_at', { ascending: false });

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
      } else {
        setAppointments(appointmentsData || []);
      }

      // Fetch Square transaction history
      try {
        const squareData = await getMyTransactions();
        setSquarePayments(squareData.payments || []);
        setSquareBookings(squareData.bookings || []);
        console.log('Fetched Square data:', squareData.payments?.length, 'payments,', squareData.bookings?.length, 'bookings');
      } catch (squareError) {
        console.error('Error fetching Square transactions:', squareError);
        // Don't fail the whole fetch if Square fails
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'in_progress':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.scheduled_at) >= new Date() && apt.status !== 'cancelled'
  );

  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.scheduled_at) < new Date() || apt.status === 'cancelled'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Customer Portal | Home Setup Solutions</title>
        <meta name="description" content="View your appointments and book new services with Home Setup Solutions." />
      </Helmet>
      <Layout>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
                </h1>
                <p className="text-muted-foreground">
                  Manage your appointments and book new services
                </p>
              </div>
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </motion.div>

            {/* Profile Summary Card */}
            {profile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Your Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-6">
                      {profile.full_name && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{profile.full_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.email}</span>
                      </div>
                      {profile.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="upcoming" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <History className="w-4 h-4" />
                  History
                </TabsTrigger>
                <TabsTrigger value="book" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Book
                </TabsTrigger>
              </TabsList>

              {/* Upcoming Appointments */}
              <TabsContent value="upcoming">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {loadingData ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : upcomingAppointments.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Upcoming Appointments</h3>
                        <p className="text-muted-foreground mb-4">
                          You don't have any scheduled appointments.
                        </p>
                        <Button onClick={() => document.querySelector('[data-value="book"]')?.dispatchEvent(new Event('click', { bubbles: true }))}>
                          Book a Service
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map((apt) => (
                        <Card key={apt.id}>
                          <CardContent className="py-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-semibold text-lg">{apt.service_name}</h3>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{format(new Date(apt.scheduled_at), 'EEEE, MMMM d, yyyy')}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{format(new Date(apt.scheduled_at), 'h:mm a')} ({apt.duration_minutes} min)</span>
                                  </div>
                                  {apt.address && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>{apt.address}</span>
                                    </div>
                                  )}
                                </div>
                                {apt.notes && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    <strong>Notes:</strong> {apt.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              {/* Past Appointments & Transactions */}
              <TabsContent value="history">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {loadingData ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      {/* Square Payments Section */}
                      {squarePayments.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            Payment History
                          </h3>
                          {squarePayments.map((payment) => (
                            <Card key={payment.id}>
                              <CardContent className="py-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                      <span className="font-semibold text-lg">
                                        ${payment.amount_money ? (payment.amount_money.amount / 100).toFixed(2) : '0.00'} {payment.amount_money?.currency || 'CAD'}
                                      </span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                        payment.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-muted text-muted-foreground border-border'
                                      }`}>
                                        {payment.status}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{payment.created_at ? format(new Date(payment.created_at), 'MMMM d, yyyy') : 'Unknown date'}</span>
                                      </div>
                                      {payment.source_type && (
                                        <div className="flex items-center gap-1">
                                          <CreditCard className="w-4 h-4" />
                                          <span>{payment.source_type.replace(/_/g, ' ')}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {payment.receipt_url && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                                        <ExternalLink className="w-4 h-4" />
                                        Receipt
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Local Past Appointments */}
                      {pastAppointments.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" />
                            Past Appointments
                          </h3>
                          {pastAppointments.map((apt) => (
                            <Card key={apt.id} className="opacity-80">
                              <CardContent className="py-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                      <h3 className="font-semibold text-lg">{apt.service_name}</h3>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{format(new Date(apt.scheduled_at), 'EEEE, MMMM d, yyyy')}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{format(new Date(apt.scheduled_at), 'h:mm a')}</span>
                                      </div>
                                      {apt.address && (
                                        <div className="flex items-center gap-1">
                                          <MapPin className="w-4 h-4" />
                                          <span>{apt.address}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* No history at all */}
                      {pastAppointments.length === 0 && squarePayments.length === 0 && (
                        <Card>
                          <CardContent className="py-12 text-center">
                            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No History Yet</h3>
                            <p className="text-muted-foreground">
                              Your past appointments and payments will appear here.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </motion.div>
              </TabsContent>

              {/* Book New Service */}
              <TabsContent value="book">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Book a New Service</CardTitle>
                      <CardDescription>
                        Select a service and choose your preferred date and time
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="aspect-[4/3] md:aspect-[16/10] w-full">
                        <iframe
                          src="https://book.squareup.com/appointments/ygqnrdv6a907zu/location/LBJ4C01HMM5JH/services"
                          title="Book an Appointment with Home Setup Solutions"
                          className="w-full h-full border-0"
                          allow="payment"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </Layout>
    </>
  );
}
