import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Loader2, 
  LogOut, 
  Phone, 
  Users, 
  Calendar, 
  MessageSquare,
  Home,
  FileText,
  Headphones,
  ClipboardList,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CallScripts } from '@/components/reception/CallScripts';
import { AppointmentConfirmation } from '@/components/reception/AppointmentConfirmation';
import { DailyChecklist } from '@/components/reception/DailyChecklist';
import { CustomersTab } from '@/components/admin/CustomersTab';
import { BookingsTab } from '@/components/admin/BookingsTab';
import SMSServices from '@/components/staff/SMSServices';
import logo from '@/assets/logo.png';

const M365_BOOKING_URL = 'https://outlook.office.com/book/allbookings@homesetupsolutions.ca/?ismsaljsauthenabled';

export default function ReceptionPortal() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ full_name: string | null; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState('scripts');

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: 'Access Denied',
        description: 'Please log in to access the reception portal.',
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
        setIsAuthorized(data === 'admin' || data === 'staff');
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

  return (
    <>
      <Helmet>
        <title>Reception Portal | Home Setup Solutions</title>
        <meta name="description" content="Reception portal for Home Setup Solutions" />
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
                  <Headphones className="h-5 w-5 text-primary" />
                  <h1 className="font-semibold text-lg">Reception Portal</h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => window.open(M365_BOOKING_URL, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">M365 Bookings</span>
                </Button>
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Main Site</span>
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">Admin</Button>
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(profile?.full_name ?? null, profile?.email ?? user.email ?? '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{profile?.full_name || 'Receptionist'}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                  </div>
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
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Reception Desk</h2>
              <p className="text-muted-foreground">
                Handle calls, manage appointments, and complete daily tasks
              </p>
            </div>

            {/* Quick Contact Card */}
            <Card className="mb-6 border-primary/20">
              <CardContent className="py-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Main: 1-833-230-2933</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Text: 1-587-604-5127</span>
                  </div>
                  <a href="/docs/call_script.zip" download>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Download Scripts PDF
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="scripts" className="gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">Scripts</span>
                </TabsTrigger>
                <TabsTrigger value="confirm" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Confirm</span>
                </TabsTrigger>
                <TabsTrigger value="checklist" className="gap-2">
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">Checklist</span>
                </TabsTrigger>
                <TabsTrigger value="customers" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Customers</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="sms" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">SMS</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scripts">
                <CallScripts />
              </TabsContent>

              <TabsContent value="confirm">
                <AppointmentConfirmation />
              </TabsContent>

              <TabsContent value="checklist">
                <DailyChecklist />
              </TabsContent>

              <TabsContent value="customers">
                <CustomersTab />
              </TabsContent>

              <TabsContent value="bookings">
                <BookingsTab />
              </TabsContent>

              <TabsContent value="sms">
                <SMSServices />
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t py-6 mt-auto">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground">
              Home Setup Solutions Reception Portal • Main: 1-833-230-2933 • Text: 1-587-604-5127
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
