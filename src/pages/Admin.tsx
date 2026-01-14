import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, Users, Calendar, CreditCard, MessageSquare, UserCog, Settings, Headphones, BarChart3, ExternalLink, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CustomersTab } from '@/components/admin/CustomersTab';
import { BookingsTab } from '@/components/admin/BookingsTab';
import { PaymentsTab } from '@/components/admin/PaymentsTab';
import SMSServices from '@/components/staff/SMSServices';
import StaffManagement from '@/components/staff/StaffManagement';
import SiteSettings from '@/components/staff/SiteSettings';
import { IntegrationsPanel } from '@/components/integrations/IntegrationsPanel';
import logo from '@/assets/logo.png';

export default function Admin() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

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

  const quickLinks = [
    {
      title: 'Reception Portal',
      description: 'Handle calls, book appointments, manage customers',
      icon: Headphones,
      path: '/reception',
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      title: 'Supervisor Portal',
      description: 'Weekly overview, staff schedules, call logs',
      icon: BarChart3,
      path: '/supervisor',
      color: 'bg-purple-500/10 text-purple-500'
    },
    {
      title: 'Azure Phone Monitor',
      description: 'Monitor phone system status',
      icon: ExternalLink,
      href: 'https://portal.azure.com',
      color: 'bg-green-500/10 text-green-500'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Home Setup Solutions</title>
        <meta name="description" content="Admin dashboard for Home Setup Solutions." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <img src={logo} alt="Home Setup Solutions" className="w-10 h-10 rounded-lg" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Home Setup Solutions</p>
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
              <TabsList className="grid w-full grid-cols-7 max-w-4xl">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
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
                <TabsTrigger value="staff" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span className="hidden sm:inline">Staff</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Integrations</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Admin Overview</h2>
                    <p className="text-muted-foreground">Quick access to all admin features and portals.</p>
                  </div>

                  {/* Quick Links */}
                  <div className="grid gap-4 md:grid-cols-3">
                    {quickLinks.map((link) => (
                      link.path ? (
                        <Link key={link.title} to={link.path}>
                          <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer">
                            <CardHeader>
                              <div className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center mb-2`}>
                                <link.icon className="h-6 w-6" />
                              </div>
                              <CardTitle className="text-lg">{link.title}</CardTitle>
                              <CardDescription>{link.description}</CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ) : (
                        <a key={link.title} href={link.href} target="_blank" rel="noopener noreferrer">
                          <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer">
                            <CardHeader>
                              <div className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center mb-2`}>
                                <link.icon className="h-6 w-6" />
                              </div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {link.title}
                                <ExternalLink className="h-4 w-4" />
                              </CardTitle>
                              <CardDescription>{link.description}</CardDescription>
                            </CardHeader>
                          </Card>
                        </a>
                      )
                    ))}
                  </div>

                  {/* SMS Services Quick Access */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        SMS Services
                      </CardTitle>
                      <CardDescription>Send SMS messages and manage text communications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SMSServices />
                    </CardContent>
                  </Card>
                </div>
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

              <TabsContent value="staff">
                <StaffManagement />
              </TabsContent>

              <TabsContent value="integrations">
                <IntegrationsPanel />
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
