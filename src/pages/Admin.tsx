import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, Users, Calendar, CreditCard, MessageSquare, UserCog, Settings, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CustomersTab } from '@/components/admin/CustomersTab';
import { BookingsTab } from '@/components/admin/BookingsTab';
import { PaymentsTab } from '@/components/admin/PaymentsTab';
import { CallingSystemTab } from '@/components/admin/CallingSystemTab';
import SMSServices from '@/components/staff/SMSServices';
import StaffManagement from '@/components/staff/StaffManagement';
import SiteSettings from '@/components/staff/SiteSettings';
import logo from '@/assets/logo.png';

export default function Admin() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('calling');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges. Redirecting to customer portal...',
        variant: 'destructive',
      });
      navigate('/portal');
    }
  }, [user, loading, isAdmin, navigate, toast]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>CRM Dashboard | Home Setup Solutions</title>
        <meta name="description" content="Admin CRM dashboard for Home Setup Solutions." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Home Setup Solutions" className="w-10 h-10 rounded-lg" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">CRM Dashboard</h1>
                <p className="text-sm text-muted-foreground">Square Integration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-7 max-w-3xl">
                <TabsTrigger value="calling" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">Calling</span>
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Customers</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Payments</span>
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">SMS</span>
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span className="hidden sm:inline">Staff</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calling">
                <CallingSystemTab />
              </TabsContent>

              <TabsContent value="customers">
                <CustomersTab />
              </TabsContent>

              <TabsContent value="bookings">
                <BookingsTab />
              </TabsContent>

              <TabsContent value="payments">
                <PaymentsTab />
              </TabsContent>

              <TabsContent value="sms">
                <SMSServices />
              </TabsContent>

              <TabsContent value="staff">
                <StaffManagement />
              </TabsContent>

              <TabsContent value="settings">
                <SiteSettings />
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </>
  );
}
