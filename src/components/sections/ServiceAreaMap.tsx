import { motion } from "framer-motion";
import { MapPin, Check, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const serviceAreas = [
  {
    region: "Calgary",
    cities: ["Downtown", "NW Calgary", "NE Calgary", "SW Calgary", "SE Calgary"],
    featured: true,
  },
  {
    region: "Calgary Suburbs",
    cities: ["Airdrie", "Cochrane", "Chestermere", "Okotoks", "High River"],
    featured: true,
  },
  {
    region: "Surrounding Areas",
    cities: ["Strathmore", "Crossfield", "Irricana", "Black Diamond", "Turner Valley"],
    featured: true,
  },
];

export function ServiceAreaMap() {
  return (
    <section id="service-areas" className="py-24 md:py-32 relative">
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
            <MapPin className="w-4 h-4" />
            Coverage
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
            Service <span className="text-gradient-orange">Areas</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            We proudly serve Calgary and surrounding areas. Check if we're in your area!
          </p>
        </motion.div>

        {/* Map Placeholder with styled regions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-[21/9] bg-gradient-to-br from-primary/5 to-primary/10">
                {/* Stylized Canada Map Background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 800 400"
                    className="w-full h-full opacity-20"
                    fill="currentColor"
                  >
                    {/* Simplified Canada outline */}
                    <path
                      d="M100,200 Q150,150 200,180 Q250,140 300,160 Q350,120 400,150 Q450,100 500,140 Q550,110 600,150 Q650,120 700,170 L700,300 Q600,320 500,300 Q400,320 300,300 Q200,320 100,300 Z"
                      className="text-primary"
                    />
                  </svg>
                </div>
                
                {/* Service Area Pins */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-8 md:gap-16 px-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2 animate-pulse">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-semibold text-sm">Western Canada</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2 animate-pulse">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-semibold text-sm">Central Canada</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2 animate-pulse">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-semibold text-sm">Eastern Canada</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceAreas.map((area, index) => (
            <motion.div
              key={area.region}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`glass-card h-full ${area.featured ? "border-primary/30" : ""}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      area.featured ? "bg-primary/20" : "bg-muted"
                    }`}>
                      <MapPin className={`w-5 h-5 ${area.featured ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <h3 className="text-xl font-semibold">{area.region}</h3>
                    {area.featured && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {area.cities.map((city) => (
                      <li key={city} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary" />
                        {city}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Not in area CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Don't see your area? We may still be able to help!
          </p>
          <Button variant="outline" asChild>
            <a href="tel:18332302933" className="gap-2">
              <Phone className="w-4 h-4" />
              Call to Check Availability
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
