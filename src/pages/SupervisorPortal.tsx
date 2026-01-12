import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  LogOut, 
  Users, 
  Calendar, 
  Clock,
  Home,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import logo from '@/assets/logo.png';

interface StaffMember {
  id: string;
  user_id: string;
  is_active: boolean;
  availability: unknown;
  profile?: {
    full_name: string | null;
    email: string;
    phone: string | null;
  };
}

interface Appointment {
  id: string;
  customer_name: string | null;
  service_name: string;
  scheduled_at: string;
  status: string;
  staff_id: string | null;
  duration_minutes: number;
}

interface CallLog {
  id: string;
  phone_number: string;
  direction: string;
  status: string;
  duration_seconds: number | null;
  created_at: string;
  customer_name: string | null;
}

export default function SupervisorPortal() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ full_name: string | null; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Week navigation
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 }); // Sunday
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Data
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: 'Access Denied',
        description: 'Please log in to access the supervisor portal.',
        variant: 'destructive',
      });
      navigate('/auth?type=staff');
    }
  }, [user, loading, navigate, toast]);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) return;
      
      const { data, error } = await supabase.rpc('get_user_role', { _user_id: user.id });
      
      if (error) {
        console.error('Error checking role:', error);
        setIsAuthorized(false);
      } else {
        // Only admin can access supervisor portal
        setIsAuthorized(data === 'admin');
        setUserRole(data);
      }
      setCheckingRole(false);
    };

    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setProfile(data);
      }
    };

    if (user) {
      checkAuthorization();
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (!checkingRole && !isAuthorized) {
      toast({
        title: 'Access Denied',
        description: 'This area is restricted to supervisors and admins only.',
        variant: 'destructive',
      });
      navigate('/staff');
    }
  }, [isAuthorized, checkingRole, navigate, toast]);

  useEffect(() => {
    if (isAuthorized) {
      fetchWeekData();
    }
  }, [isAuthorized, currentWeek]);

  const fetchWeekData = async () => {
    setLoadingData(true);
    try {
      // Fetch staff members with profiles
      const { data: staffData } = await supabase
        .from('staff_details')
        .select('id, user_id, is_active, availability');

      if (staffData) {
        // Fetch profiles for each staff member
        const staffWithProfiles = await Promise.all(
          staffData.map(async (staff) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, email, phone')
              .eq('user_id', staff.user_id)
              .single();
            return { ...staff, profile: profileData || undefined };
          })
        );
        setStaffMembers(staffWithProfiles);
      }

      // Fetch appointments for the week
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('id, customer_name, service_name, scheduled_at, status, staff_id, duration_minutes')
        .gte('scheduled_at', weekStart.toISOString())
        .lte('scheduled_at', weekEnd.toISOString())
        .order('scheduled_at', { ascending: true });

      if (appointmentsData) {
        setAppointments(appointmentsData);
      }

      // Fetch call logs for the week
      const { data: callData } = await supabase
        .from('call_logs')
        .select('id, phone_number, direction, status, duration_seconds, created_at, customer_name')
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString())
        .order('created_at', { ascending: false });

      if (callData) {
        setCallLogs(callData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return null;
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.scheduled_at), day));
  };

  const getCallsForDay = (day: Date) => {
    return callLogs.filter(call => isSameDay(new Date(call.created_at), day));
  };

  // Stats
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;
  const totalCalls = callLogs.length;
  const activeStaff = staffMembers.filter(s => s.is_active).length;

  return (
    <>
      <Helmet>
        <title>Supervisor Portal | Home Setup Solutions</title>
        <meta name="description" content="Supervisor portal for Home Setup Solutions" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2">
                  <img src={logo} alt="Home Setup Solutions" className="w-10 h-10 rounded-lg" />
                </Link>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h1 className="font-semibold text-lg">Supervisor Portal</h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Main Site</span>
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button variant="outline" size="sm">Admin</Button>
                </Link>
                <Link to="/reception">
                  <Button variant="outline" size="sm">Reception</Button>
                </Link>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(profile?.full_name ?? null, profile?.email ?? user.email ?? '')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Weekly Overview</h2>
                <p className="text-muted-foreground">
                  {format(weekStart, 'MMMM d')} - {format(weekEnd, 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setCurrentWeek(new Date())}>
                  This Week
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Appointments</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{totalAppointments}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Completed</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{completedAppointments}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Cancelled</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{cancelledAppointments}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Calls</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{totalCalls}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Active Staff</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{activeStaff}</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 max-w-lg">
                <TabsTrigger value="overview" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="staff" className="gap-2">
                  <Users className="h-4 w-4" />
                  Staff
                </TabsTrigger>
                <TabsTrigger value="calls" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Calls
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                {loadingData ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => {
                      const dayAppointments = getAppointmentsForDay(day);
                      return (
                        <Card key={day.toISOString()} className={isToday(day) ? 'border-primary' : ''}>
                          <CardHeader className="py-3 px-3">
                            <CardTitle className={`text-sm ${isToday(day) ? 'text-primary' : ''}`}>
                              {format(day, 'EEE')}
                            </CardTitle>
                            <CardDescription className="text-lg font-bold">
                              {format(day, 'd')}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="px-3 pb-3">
                            <div className="space-y-1">
                              {dayAppointments.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No appointments</p>
                              ) : (
                                dayAppointments.slice(0, 3).map((apt) => (
                                  <div
                                    key={apt.id}
                                    className={`text-xs p-1.5 rounded ${
                                      apt.status === 'completed' ? 'bg-green-500/10' :
                                      apt.status === 'cancelled' ? 'bg-red-500/10' :
                                      'bg-primary/10'
                                    }`}
                                  >
                                    <p className="font-medium truncate">{format(new Date(apt.scheduled_at), 'h:mm a')}</p>
                                    <p className="truncate text-muted-foreground">{apt.service_name}</p>
                                  </div>
                                ))
                              )}
                              {dayAppointments.length > 3 && (
                                <p className="text-xs text-muted-foreground">+{dayAppointments.length - 3} more</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="staff">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {staffMembers.map((staff) => (
                    <Card key={staff.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(staff.profile?.full_name ?? null, staff.profile?.email ?? '')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{staff.profile?.full_name || 'Unknown'}</p>
                              <Badge variant={staff.is_active ? 'default' : 'secondary'}>
                                {staff.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{staff.profile?.email}</p>
                            {staff.profile?.phone && (
                              <p className="text-sm text-muted-foreground">{staff.profile.phone}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {staffMembers.length === 0 && (
                    <Card className="col-span-full">
                      <CardContent className="py-8 text-center">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No staff members found</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="calls">
                <Card>
                  <CardHeader>
                    <CardTitle>Call Log</CardTitle>
                    <CardDescription>Calls made this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {callLogs.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No calls logged this week</p>
                    ) : (
                      <div className="space-y-2">
                        {callLogs.map((call) => (
                          <div key={call.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <Phone className={`h-4 w-4 ${call.direction === 'inbound' ? 'text-green-500' : 'text-blue-500'}`} />
                              <div>
                                <p className="font-medium">{call.customer_name || call.phone_number}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(call.created_at), 'MMM d, h:mm a')} • {call.direction}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={call.status === 'completed' ? 'default' : 'secondary'}>
                                {call.status}
                              </Badge>
                              {call.duration_seconds && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {Math.floor(call.duration_seconds / 60)}:{(call.duration_seconds % 60).toString().padStart(2, '0')}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </>
  );
}
