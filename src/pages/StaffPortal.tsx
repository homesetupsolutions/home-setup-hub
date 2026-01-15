import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  LogOut,
  Loader2,
  BookOpen,
  Camera,
  ChevronRight,
  Home,
  MessageSquare,
  UserCog,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffManagement from "@/components/staff/StaffManagement";
import SMSServices from "@/components/staff/SMSServices";
import { CustomersTab } from "@/components/admin/CustomersTab";
import { PaymentsTab } from "@/components/admin/PaymentsTab";
import { TodaysAppointments } from "@/components/staff/TodaysAppointments";
import { EmergencyButton } from "@/components/staff/EmergencyButton";
import { WorkPhotoUpload } from "@/components/staff/WorkPhotoUpload";
import logo from "@/assets/logo.png";

const staffResources = [
  {
    title: "Documentation",
    description: "Guides and technical docs",
    icon: BookOpen,
    path: "/docs",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "My Schedule",
    description: "View your appointments",
    icon: Calendar,
    tabKey: "today",
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Time Clock",
    description: "Clock in/out and timecards",
    icon: Clock,
    tabKey: "timeclock",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    title: "Customer Lookup",
    description: "Search customer records",
    icon: Users,
    tabKey: "customers",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Work Photos",
    description: "Upload job photos",
    icon: Camera,
    tabKey: "photos",
    color: "bg-pink-500/10 text-pink-500",
  },
];

const quickLinks = [
  { title: "Main Site", path: "/", icon: Home },
  { title: "Book Appointment", path: "https://outlook.office.com/book/allbookings@homesetupsolutions.ca/?ismsaljsauthenabled", icon: Calendar, external: true },
];

const StaffPortal = () => {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isStaff, setIsStaff] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ full_name: string | null; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState("resources");

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the staff portal.",
        variant: "destructive",
      });
      navigate("/auth?type=staff");
    }
  }, [user, loading, navigate, toast]);

  useEffect(() => {
    const checkStaffRole = async () => {
      if (!user) return;
      
      const { data, error } = await supabase.rpc('get_user_role', { _user_id: user.id });
      
      if (error) {
        console.error('Error checking role:', error);
        setIsStaff(false);
      } else {
        setIsStaff(data === 'staff' || data === 'admin');
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
      checkStaffRole();
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (!checkingRole && isStaff === false) {
      toast({
        title: "Access Denied",
        description: "This area is restricted to staff members only. Redirecting to customer portal...",
        variant: "destructive",
      });
      navigate("/portal");
    }
  }, [isStaff, checkingRole, navigate, toast]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || isStaff === false) {
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
        <title>Staff Portal | Home Setup Solutions</title>
        <meta name="description" content="Staff portal for Home Setup Solutions employees" />
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
                <h1 className="font-semibold text-lg">Staff Portal</h1>
              </div>

              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Main Site</span>
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(profile?.full_name ?? null, profile?.email ?? user.email ?? '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{profile?.full_name || 'Staff Member'}</p>
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
              <h2 className="text-3xl font-bold mb-2">
                Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
              </h2>
              <p className="text-muted-foreground">
                Access your tools and resources from the staff portal.
              </p>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full mb-8 ${isAdmin ? 'grid-cols-8' : 'grid-cols-5'}`}>
                <TabsTrigger value="resources" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Resources</span>
                </TabsTrigger>
                <TabsTrigger value="today" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Today</span>
                </TabsTrigger>
                <TabsTrigger value="timeclock" className="gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Time Clock</span>
                </TabsTrigger>
                <TabsTrigger value="customers" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Customers</span>
                </TabsTrigger>
                <TabsTrigger value="photos" className="gap-2">
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline">Photos</span>
                </TabsTrigger>
                {isAdmin && (
                  <>
                    <TabsTrigger value="sms" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">SMS</span>
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="hidden sm:inline">Payments</span>
                    </TabsTrigger>
                    <TabsTrigger value="staff" className="gap-2">
                      <UserCog className="h-4 w-4" />
                      <span className="hidden sm:inline">Staff</span>
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              <TabsContent value="resources">
                {/* Resource Cards Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                  {staffResources.map((resource, index) => (
                    <motion.div
                      key={resource.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {resource.path ? (
                        <Link to={resource.path}>
                          <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 group cursor-pointer">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-lg ${resource.color}`}>
                                  <resource.icon className="h-6 w-6" />
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <CardTitle className="text-lg mb-1">{resource.title}</CardTitle>
                              <CardDescription>{resource.description}</CardDescription>
                            </CardContent>
                          </Card>
                        </Link>
                      ) : (
                        <Card 
                          className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 group cursor-pointer"
                          onClick={() => resource.tabKey && setActiveTab(resource.tabKey)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className={`p-3 rounded-lg ${resource.color}`}>
                                <resource.icon className="h-6 w-6" />
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardTitle className="text-lg mb-1">{resource.title}</CardTitle>
                            <CardDescription>{resource.description}</CardDescription>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Quick Links Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {quickLinks.map((link) => (
                      <Link key={link.title} to={link.path}>
                        <Button variant="outline" className="gap-2">
                          <link.icon className="h-4 w-4" />
                          {link.title}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Downloads Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Downloadable Resources
                    </CardTitle>
                    <CardDescription>
                      Download guides and documentation for offline use
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <a href="/docs/customer-guide.md" download="Customer-Guide.md">
                        <Button variant="secondary" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Customer Guide (MD)
                        </Button>
                      </a>
                      <a href="/docs/admin-guide.md" download="Admin-Guide.md">
                        <Button variant="secondary" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Admin Guide (MD)
                        </Button>
                      </a>
                      <a href="/docs/technical-docs.md" download="Technical-Docs.md">
                        <Button variant="secondary" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Technical Docs (MD)
                        </Button>
                      </a>
                      <a href="/docs/call_script.zip" download>
                        <Button variant="secondary" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          Call Scripts (ZIP)
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="today">
                <TodaysAppointments />
              </TabsContent>

              <TabsContent value="timeclock">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Time Clock
                    </CardTitle>
                    <CardDescription>
                      Clock in/out and view your timecards
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Time clock feature coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customers">
                <CustomersTab />
              </TabsContent>

              <TabsContent value="photos">
                <WorkPhotoUpload />
              </TabsContent>

              {isAdmin && (
                <>
                  <TabsContent value="sms">
                    <SMSServices />
                  </TabsContent>

                  <TabsContent value="payments">
                    <PaymentsTab />
                  </TabsContent>

                  <TabsContent value="staff">
                    <StaffManagement />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </motion.div>
        </main>

        {/* Emergency Button */}
        <EmergencyButton />

        {/* Footer */}
        <footer className="border-t py-6 mt-auto">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground">
              Home Setup Solutions Staff Portal • Emergency: 1-833-230-2933 ext. 9
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default StaffPortal;
