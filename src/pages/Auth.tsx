import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, User } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const customerSignupSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Please enter your full name'),
  phone: z.string().min(10, 'Please enter a valid phone number').regex(/^[\d\s\-\(\)\+]+$/, 'Please enter a valid phone number'),
});

export default function Auth() {
  const [searchParams] = useSearchParams();
  const authType = searchParams.get('type') || 'customer';
  const isCustomer = authType === 'customer';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { user, loading, isAdmin, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    }
  }, [user, loading, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
          toast({
            title: 'Validation Error',
            description: validation.error.errors[0].message,
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(email, password);
        if (error) {
          let message = error.message;
          if (error.message.includes('Invalid login credentials')) {
            message = 'Invalid email or password. Please try again.';
          }
          toast({
            title: 'Login Failed',
            description: message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'Successfully logged in.',
          });
        }
      } else {
        // Signup
        if (isCustomer) {
          const validation = customerSignupSchema.safeParse({ email, password, fullName, phone });
          if (!validation.success) {
            toast({
              title: 'Validation Error',
              description: validation.error.errors[0].message,
              variant: 'destructive',
            });
            setIsLoading(false);
            return;
          }
        } else {
          const validation = loginSchema.safeParse({ email, password });
          if (!validation.success) {
            toast({
              title: 'Validation Error',
              description: validation.error.errors[0].message,
              variant: 'destructive',
            });
            setIsLoading(false);
            return;
          }
        }

        const { error } = await signUp(email, password, isCustomer ? { fullName, phone } : undefined);
        if (error) {
          let message = error.message;
          if (error.message.includes('User already registered')) {
            message = 'An account with this email already exists. Please log in instead.';
          }
          toast({
            title: 'Sign Up Failed',
            description: message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Account Created',
            description: 'Your account has been created. You can now log in.',
          });
          setActiveTab('login');
          // Reset form
          setFullName('');
          setPhone('');
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <title>{isCustomer ? 'Customer Login' : 'Staff Login'} | Home Setup Solutions</title>
        <meta name="description" content={isCustomer ? "Customer portal login for Home Setup Solutions." : "Staff portal login for Home Setup Solutions."} />
      </Helmet>
      
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-border bg-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {isCustomer ? (
                  <User className="h-6 w-6 text-primary" />
                ) : (
                  <Shield className="h-6 w-6 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {isCustomer ? 'Customer Portal' : 'Staff Portal'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {isCustomer 
                  ? 'View your appointments and book services' 
                  : 'Access the staff management dashboard'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Customer signup fields */}
                  {activeTab === 'signup' && isCustomer && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Smith"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <TabsContent value="login" className="mt-0">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        'Log In'
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="signup" className="mt-0">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </TabsContent>
                </form>
              </Tabs>
              
              <div className="mt-6 text-center space-y-2">
                <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                  ← Back to Home
                </a>
                <a 
                  href={isCustomer ? '/auth?type=staff' : '/auth?type=customer'} 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                >
                  {isCustomer ? 'Staff login →' : '← Customer login'}
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}