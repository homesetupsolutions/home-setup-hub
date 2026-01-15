import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setLoading(true);
    
    try {
      // For now, we'll just show a success message
      // In production, this would connect to an email service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscribed(true);
      toast({
        title: "Subscribed!",
        description: "You'll receive our latest updates and exclusive offers.",
      });
      setEmail("");
      
      setTimeout(() => setSubscribed(false), 5000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-card p-8 md:p-12 rounded-3xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Updated
            </h3>
            <p className="text-muted-foreground mb-8">
              Get exclusive deals, tips, and updates delivered to your inbox. No spam, ever.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
                disabled={loading || subscribed}
              />
              <Button
                type="submit"
                variant="hero"
                disabled={loading || subscribed}
                className="min-w-[140px]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : subscribed ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Subscribed
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
