import { motion } from "framer-motion";
import { Star, Quote, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock reviews - in production, these would come from Google Places API
const reviews = [
  {
    id: "1",
    author: "Michael R.",
    avatar: "",
    rating: 5,
    date: "2 weeks ago",
    text: "Incredible service! They mounted my 75\" TV perfectly and hid all the cables in the wall. Very professional and cleaned up after themselves. Highly recommend!",
  },
  {
    id: "2",
    author: "Sarah T.",
    avatar: "",
    rating: 5,
    date: "1 month ago",
    text: "Best smart home installation experience ever. They set up my entire home with smart lights, thermostat, and security cameras. Everything works flawlessly with Alexa.",
  },
  {
    id: "3",
    author: "David L.",
    avatar: "",
    rating: 5,
    date: "3 weeks ago",
    text: "Fixed my WiFi dead zones completely! Now I have perfect coverage throughout my 3-story home. The technician was knowledgeable and explained everything.",
  },
  {
    id: "4",
    author: "Jennifer M.",
    avatar: "",
    rating: 4,
    date: "1 month ago",
    text: "Great home theater setup. The surround sound is amazing! Only giving 4 stars because they were 30 minutes late, but the work quality was excellent.",
  },
  {
    id: "5",
    author: "Robert K.",
    avatar: "",
    rating: 5,
    date: "2 months ago",
    text: "Second time using their services and just as impressed. This time they set up my outdoor entertainment system. Will definitely use again!",
  },
];

const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

export function GoogleReviews() {
  return (
    <section id="reviews" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 tech-grid opacity-20" />
      
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-primary text-sm font-medium mb-8">
            <Star className="w-4 h-4 fill-primary" />
            Reviews
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
            What Customers <span className="text-gradient-orange">Say</span>
          </h2>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating) ? "fill-primary text-primary" : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">based on {reviews.length} reviews</span>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.slice(0, 6).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {review.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{review.author}</h4>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating ? "fill-primary text-primary" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                    <p className="text-muted-foreground text-sm leading-relaxed pl-4">
                      {review.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Google Reviews CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button variant="outline" asChild className="gap-2">
            <a
              href="https://www.google.com/maps/place/Home+Setup+Solutions"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"
                />
                <path
                  fill="#4285F4"
                  d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7z"
                />
              </svg>
              See All Google Reviews
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
