import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Book, 
  Shield, 
  Code, 
  Calendar, 
  Users, 
  CreditCard, 
  Phone,
  Monitor,
  Smartphone,
  Settings,
  Database,
  Key,
  Server,
  FileText,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  Download,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Documentation = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isStaff, setIsStaff] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

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
      }
      setCheckingRole(false);
    };

    if (user) {
      checkStaffRole();
    }
  }, [user]);

  useEffect(() => {
    if (!checkingRole && isStaff === false) {
      toast({
        title: "Access Denied",
        description: "This area is restricted to staff members only.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isStaff, checkingRole, navigate, toast]);

  if (loading || checkingRole) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || isStaff === false) {
    return null;
  }
  return (
    <Layout>
      <Helmet>
        <title>Documentation & Guides | Home Setup Solutions Calgary</title>
        <meta name="description" content="Complete guides for Home Setup Solutions customers, admins, and staff. Learn how to book services, manage appointments, and use the platform." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Everything you need to know about using Home Setup Solutions
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap print:hidden">
              <a href="/docs/customer-guide.md" download>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Customer Guide
                </Button>
              </a>
              <a href="/docs/admin-guide.md" download>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Admin Guide
                </Button>
              </a>
              <a href="/docs/technical-docs.md" download>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Technical Docs
                </Button>
              </a>
            </div>
          </motion.div>

          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span className="hidden sm:inline">Customer Guide</span>
                <span className="sm:hidden">Customer</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Guide</span>
                <span className="sm:hidden">Admin</span>
              </TabsTrigger>
              <TabsTrigger value="technical" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Technical Docs</span>
                <span className="sm:hidden">Technical</span>
              </TabsTrigger>
            </TabsList>

            {/* Customer Guide */}
            <TabsContent value="customer">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                  <Card>
                    <CardHeader>
                      <Calendar className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Booking Services</CardTitle>
                      <CardDescription>How to schedule your tech support</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Navigate to the "Book" page</li>
                        <li>Select your desired service</li>
                        <li>Choose a date and time</li>
                        <li>Enter your contact information</li>
                        <li>Confirm your booking</li>
                      </ol>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Monitor className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Our Services</CardTitle>
                      <CardDescription>What we offer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Computer Setup & Repair
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Network Configuration
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Smart Home Installation
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Security Systems
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Tech Training
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Phone className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Contact Us</CardTitle>
                      <CardDescription>Get in touch</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>📞 Call us for immediate support</li>
                        <li>📧 Email for non-urgent inquiries</li>
                        <li>💬 Use the contact form on our website</li>
                        <li>📍 Visit our location page for directions</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How do I cancel or reschedule my appointment?</AccordionTrigger>
                        <AccordionContent>
                          You can cancel or reschedule your appointment by contacting us at least 24 hours before your scheduled time. Call our support line or use the contact form to request changes.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                        <AccordionContent>
                          We accept all major credit cards, debit cards, and cash payments. Payment is typically collected after service completion.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Do you offer remote support?</AccordionTrigger>
                        <AccordionContent>
                          Yes! Many issues can be resolved remotely. During booking, select "Remote Support" as your service type, and our technician will connect with you virtually.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>What areas do you service?</AccordionTrigger>
                        <AccordionContent>
                          We provide on-site services within a 30-mile radius of our main location. Remote support is available nationwide.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-5">
                        <AccordionTrigger>Do you offer warranties on repairs?</AccordionTrigger>
                        <AccordionContent>
                          Yes, all our repair services come with a 30-day warranty. If the same issue recurs within this period, we'll fix it at no additional charge.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Admin Guide */}
            <TabsContent value="admin">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  <Card>
                    <CardHeader>
                      <Users className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Managing Customers</CardTitle>
                      <CardDescription>Customer management features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Viewing Customers</h4>
                        <p className="text-sm text-muted-foreground">
                          Access the Customers tab in the Admin dashboard to view all customer records, including contact information and service history.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Customer Search</h4>
                        <p className="text-sm text-muted-foreground">
                          Use the search bar to quickly find customers by name, email, or phone number.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Customer Details</h4>
                        <p className="text-sm text-muted-foreground">
                          Click on any customer to view their full profile, appointment history, and notes.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Calendar className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Managing Bookings</CardTitle>
                      <CardDescription>Appointment management</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Viewing Appointments</h4>
                        <p className="text-sm text-muted-foreground">
                          The Bookings tab displays all scheduled appointments with filters for date range and status.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Appointment Status</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• <span className="text-yellow-500">Pending</span> - Awaiting confirmation</li>
                          <li>• <span className="text-blue-500">Confirmed</span> - Ready to proceed</li>
                          <li>• <span className="text-green-500">Completed</span> - Service finished</li>
                          <li>• <span className="text-red-500">Cancelled</span> - Appointment cancelled</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Updating Appointments</h4>
                        <p className="text-sm text-muted-foreground">
                          Click on any appointment to update its status, add notes, or reschedule.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CreditCard className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Managing Payments</CardTitle>
                      <CardDescription>Payment tracking and invoicing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Payment Overview</h4>
                        <p className="text-sm text-muted-foreground">
                          The Payments tab shows all transactions with status indicators for paid, pending, and overdue invoices.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Recording Payments</h4>
                        <p className="text-sm text-muted-foreground">
                          Mark invoices as paid once payment is received. The system tracks payment method and date automatically.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Generating Reports</h4>
                        <p className="text-sm text-muted-foreground">
                          Export payment data for accounting purposes using the export function.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Phone className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Phone System</CardTitle>
                      <CardDescription>Call management features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Call Logs</h4>
                        <p className="text-sm text-muted-foreground">
                          View incoming and outgoing call history with timestamps and duration.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Call Notes</h4>
                        <p className="text-sm text-muted-foreground">
                          Add notes to call records to track conversation details and follow-up actions.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Customer Linking</h4>
                        <p className="text-sm text-muted-foreground">
                          Calls are automatically linked to customer profiles when phone numbers match.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Admin Access Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Key className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Authentication</h4>
                          <p className="text-sm text-muted-foreground">
                            Admin access requires a valid account with admin role privileges. Contact the system administrator to request admin access.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Role-Based Access</h4>
                          <p className="text-sm text-muted-foreground">
                            The system supports three roles: Admin (full access), Staff (limited access), and Customer (view-only for own data).
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Technical Documentation */}
            <TabsContent value="technical">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  <Card>
                    <CardHeader>
                      <Server className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Technology Stack</CardTitle>
                      <CardDescription>Core technologies used</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-center justify-between">
                          <span className="font-medium">Frontend Framework</span>
                          <code className="bg-muted px-2 py-1 rounded">React 18</code>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="font-medium">Build Tool</span>
                          <code className="bg-muted px-2 py-1 rounded">Vite</code>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="font-medium">Styling</span>
                          <code className="bg-muted px-2 py-1 rounded">Tailwind CSS</code>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="font-medium">Language</span>
                          <code className="bg-muted px-2 py-1 rounded">TypeScript</code>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="font-medium">UI Components</span>
                          <code className="bg-muted px-2 py-1 rounded">shadcn/ui</code>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="font-medium">Backend</span>
                          <code className="bg-muted px-2 py-1 rounded">Lovable Cloud</code>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="font-medium">Mobile</span>
                          <code className="bg-muted px-2 py-1 rounded">Capacitor</code>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Database className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Database Schema</CardTitle>
                      <CardDescription>Main data tables</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm">
                        <li className="border-b pb-2">
                          <code className="font-medium text-primary">appointments</code>
                          <p className="text-muted-foreground text-xs mt-1">
                            Stores booking information, service details, and scheduling data
                          </p>
                        </li>
                        <li className="border-b pb-2">
                          <code className="font-medium text-primary">profiles</code>
                          <p className="text-muted-foreground text-xs mt-1">
                            User profile information linked to authentication
                          </p>
                        </li>
                        <li className="border-b pb-2">
                          <code className="font-medium text-primary">call_logs</code>
                          <p className="text-muted-foreground text-xs mt-1">
                            Phone call records with duration and notes
                          </p>
                        </li>
                        <li className="border-b pb-2">
                          <code className="font-medium text-primary">user_roles</code>
                          <p className="text-muted-foreground text-xs mt-1">
                            Role-based access control (admin, staff, customer)
                          </p>
                        </li>
                        <li>
                          <code className="font-medium text-primary">staff_details</code>
                          <p className="text-muted-foreground text-xs mt-1">
                            Staff-specific information and availability
                          </p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Shield className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Authentication</CardTitle>
                      <CardDescription>Security implementation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">User Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Email/password authentication with secure session management via Lovable Cloud.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Role-Based Access Control</h4>
                        <p className="text-sm text-muted-foreground">
                          Three-tier role system: Admin, Staff, and Customer with granular permissions.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Row-Level Security</h4>
                        <p className="text-sm text-muted-foreground">
                          Database policies ensure users can only access their authorized data.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Smartphone className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Mobile App</CardTitle>
                      <CardDescription>Native mobile implementation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Capacitor Integration</h4>
                        <p className="text-sm text-muted-foreground">
                          The web app is wrapped using Capacitor for iOS and Android deployment.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Build Commands</h4>
                        <div className="bg-muted p-3 rounded-lg text-xs font-mono space-y-1">
                          <p>npx cap sync</p>
                          <p>npx cap run android</p>
                          <p>npx cap run ios</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">App Configuration</h4>
                        <p className="text-sm text-muted-foreground">
                          App ID: <code className="bg-muted px-1 rounded">com.homesetupsolutions.app</code>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      API Endpoints
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-mono">GET</span>
                          <code className="text-sm">/rest/v1/appointments</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Retrieve all appointments (requires authentication)</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-mono">POST</span>
                          <code className="text-sm">/rest/v1/appointments</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Create a new appointment booking</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded font-mono">PATCH</span>
                          <code className="text-sm">/rest/v1/appointments?id=eq.{'{id}'}</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Update an existing appointment</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-mono">GET</span>
                          <code className="text-sm">/functions/v1/square-crm</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Square CRM integration endpoint</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Documentation;
