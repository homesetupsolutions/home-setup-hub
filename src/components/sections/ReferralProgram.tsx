import { motion } from "framer-motion";
import { Gift, Users, DollarSign, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Share2,
    title: "Share Your Code",
    description: "Share your unique referral code with friends and family",
  },
  {
    icon: Users,
    title: "They Book a Service",
    description: "When they use your code at booking, they get 10% off",
  },
  {
    icon: DollarSign,
    title: "You Get Rewarded",
    description: "Earn $10 off your next service for each successful referral",
  },
];

export function ReferralProgram() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Generate a simple referral code based on user or a generic one
  const referralCode = user ? `HSS-${user.id.slice(0, 8).toUpperCase()}` : "HSS-FRIEND25";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    const shareData = {
      title: "Home Setup Solutions Referral",
      text: `Use my referral code ${referralCode} to get 10% off your first service with Home Setup Solutions!`,
      url: `https://homesetupsolutions.ca/book?ref=${referralCode}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <section id="referral" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 tech-grid opacity-20" />
      
      {/* Gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-primary text-sm font-medium mb-8">
            <Gift className="w-4 h-4" />
            Referral Program
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
            Share & <span className="text-gradient-orange">Earn</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Love our service? Share it with friends and earn rewards!
          </p>
        </motion.div>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-card h-full text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="relative inline-block mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Referral Code Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl mx-auto"
        >
          <Card className="glass-card border-primary/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Your Referral Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  value={referralCode}
                  readOnly
                  className="text-center text-lg font-mono font-bold tracking-wider"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={shareReferral}
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share with Friends
              </Button>

              {!user && (
                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/auth?type=customer" className="text-primary hover:underline">
                    Sign in
                  </Link>{" "}
                  to get your personalized referral code and track your rewards!
                </p>
              )}

              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-primary">$10</p>
                    <p className="text-sm text-muted-foreground">Off Per Referral</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">10%</p>
                    <p className="text-sm text-muted-foreground">Friend's Discount</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
