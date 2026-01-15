import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, Check, Tv, Wifi, Speaker, Camera, Lightbulb, Home, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

interface Service {
  id: string;
  name: string;
  icon: any;
  basePrice: number;
  description: string;
}

const services: Service[] = [
  { id: "tv-mounting", name: "TV Mounting", icon: Tv, basePrice: 99, description: "Wall mount installation" },
  { id: "network-setup", name: "Network Setup", icon: Wifi, basePrice: 149, description: "WiFi optimization" },
  { id: "audio-system", name: "Audio System", icon: Speaker, basePrice: 199, description: "Speaker setup" },
  { id: "security-camera", name: "Security Cameras", icon: Camera, basePrice: 249, description: "Per camera install" },
  { id: "smart-lighting", name: "Smart Lighting", icon: Lightbulb, basePrice: 79, description: "Smart bulb setup" },
  { id: "home-theater", name: "Home Theater", icon: Home, basePrice: 399, description: "Full system setup" },
  { id: "computer-setup", name: "Computer Setup", icon: Monitor, basePrice: 99, description: "Desktop/laptop setup" },
  { id: "smart-home", name: "Smart Home Hub", icon: Smartphone, basePrice: 149, description: "Voice assistant setup" },
];

export function QuoteCalculator() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [tvCount, setTvCount] = useState(1);
  const [cameraCount, setCameraCount] = useState(1);
  const [showResult, setShowResult] = useState(false);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
    setShowResult(false);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedServices.forEach((serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        if (serviceId === "tv-mounting") {
          total += service.basePrice * tvCount;
        } else if (serviceId === "security-camera") {
          total += service.basePrice * cameraCount;
        } else {
          total += service.basePrice;
        }
      }
    });
    return total;
  };

  return (
    <section id="quote-calculator" className="py-24 md:py-32 relative">
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
            <Calculator className="w-4 h-4" />
            Instant Quote
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
            Get Your <span className="text-gradient-orange">Free Quote</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Select the services you need and get an instant estimate. No obligations!
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">Select Your Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedServices.includes(service.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        selectedServices.includes(service.id) ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{service.name}</h3>
                          <Checkbox checked={selectedServices.includes(service.id)} />
                        </div>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <p className="text-primary font-semibold mt-1">From ${service.basePrice}</p>
                      </div>
                    </div>
                    
                    {/* Quantity inputs for specific services */}
                    {selectedServices.includes(service.id) && service.id === "tv-mounting" && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <Label htmlFor="tv-count">Number of TVs</Label>
                        <Input
                          id="tv-count"
                          type="number"
                          min={1}
                          max={10}
                          value={tvCount}
                          onChange={(e) => setTvCount(parseInt(e.target.value) || 1)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 w-24"
                        />
                      </div>
                    )}
                    {selectedServices.includes(service.id) && service.id === "security-camera" && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <Label htmlFor="camera-count">Number of Cameras</Label>
                        <Input
                          id="camera-count"
                          type="number"
                          min={1}
                          max={20}
                          value={cameraCount}
                          onChange={(e) => setCameraCount(parseInt(e.target.value) || 1)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 w-24"
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {selectedServices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pt-6 border-t border-border"
                >
                  <Button
                    onClick={() => setShowResult(true)}
                    className="w-full"
                    size="lg"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Estimate
                  </Button>
                </motion.div>
              )}

              {showResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-xl bg-primary/10 border border-primary/20"
                >
                  <div className="text-center mb-6">
                    <p className="text-muted-foreground mb-2">Estimated Total</p>
                    <p className="text-5xl font-bold text-primary">${calculateTotal()}</p>
                    <p className="text-sm text-muted-foreground mt-2">*Final price may vary based on complexity</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold">Selected Services:</h4>
                    {selectedServices.map((serviceId) => {
                      const service = services.find((s) => s.id === serviceId);
                      let quantity = 1;
                      if (serviceId === "tv-mounting") quantity = tvCount;
                      if (serviceId === "security-camera") quantity = cameraCount;
                      
                      return (
                        <div key={serviceId} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            {service?.name} {quantity > 1 && `(x${quantity})`}
                          </span>
                          <span className="text-muted-foreground">
                            ${(service?.basePrice || 0) * quantity}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <a href="https://outlook.office.com/book/allbookings@homesetupsolutions.ca/" target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="hero" size="lg" className="w-full group">
                      Book Now
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
