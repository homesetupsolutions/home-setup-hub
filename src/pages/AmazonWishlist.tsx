import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Gift, Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AmazonWishlist = () => {
  const wishlistUrl = "https://www.amazon.ca/hz/wishlist/ls/HIJX38KT6U60?leftNavSection=SharedWithOrg&ref_=abls_lnv_os&source=leftnav";

  return (
    <>
      <Helmet>
        <title>Amazon Wishlist | Home Setup Solutions</title>
        <meta
          name="description"
          content="Support Home Setup Solutions by shopping our Amazon Wishlist. Help us get the tools and equipment we need to serve you better!"
        />
      </Helmet>
      <Layout>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              {/* Hero Section */}
              <div className="mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
                  <Gift className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  Our <span className="text-gradient-orange">Amazon Wishlist</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Support Home Setup Solutions by helping us get the tools and equipment we need 
                  to continue providing excellent service to our community.
                </p>
              </div>

              {/* Main CTA Card */}
              <Card className="glass-strong mb-12">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                    <Heart className="w-6 h-6 text-red-500" />
                    Help Us Grow
                  </CardTitle>
                  <CardDescription className="text-base">
                    Every purchase from our wishlist helps us serve you better
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-card/50 border border-border/50">
                      <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Quality Tools</h3>
                      <p className="text-sm text-muted-foreground">
                        Better equipment means better installations
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-card/50 border border-border/50">
                      <Gift className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Direct Support</h3>
                      <p className="text-sm text-muted-foreground">
                        Items ship directly to our team
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-card/50 border border-border/50">
                      <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Community Love</h3>
                      <p className="text-sm text-muted-foreground">
                        Your support means the world to us
                      </p>
                    </div>
                  </div>

                  <a
                    href={wishlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button size="lg" className="gap-2 text-lg px-8 py-6">
                      <ExternalLink className="w-5 h-5" />
                      View Our Amazon Wishlist
                    </Button>
                  </a>
                  
                  <p className="text-sm text-muted-foreground">
                    Opens in a new tab on Amazon.ca
                  </p>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-left bg-card/50 rounded-2xl p-6 md:p-8 border border-border/50"
              >
                <h2 className="text-xl font-semibold mb-4">Why We Have a Wishlist</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    As a local Calgary business, we're always looking for ways to improve our services 
                    and expand our capabilities. Our Amazon Wishlist contains tools, equipment, and 
                    supplies that help us:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide faster and more efficient installations</li>
                    <li>Handle a wider variety of home technology projects</li>
                    <li>Ensure we have backup equipment for every job</li>
                    <li>Keep up with the latest smart home technology</li>
                  </ul>
                  <p>
                    If you've had a great experience with our services and want to show your support, 
                    consider picking something from our wishlist. Every item, big or small, makes a 
                    difference!
                  </p>
                </div>
              </motion.div>

              {/* Thank You Note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 text-lg text-muted-foreground"
              >
                Thank you for supporting local businesses! 🧡
              </motion.p>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default AmazonWishlist;
