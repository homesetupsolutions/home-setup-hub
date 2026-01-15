import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

// Placeholder images - in production, these would be real project photos
const galleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "Living Room TV Mount",
    category: "TV Mounting",
    beforeImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
    description: "75\" Samsung QLED mounted with hidden cable management",
  },
  {
    id: "2",
    title: "Home Theater Setup",
    category: "Home Theater",
    beforeImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    description: "Complete 7.1 surround sound with 4K projector installation",
  },
  {
    id: "3",
    title: "Smart Home Integration",
    category: "Smart Home",
    beforeImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1558002038-1055e2daf749?w=800&q=80",
    description: "Alexa-controlled lighting, thermostat, and security",
  },
  {
    id: "4",
    title: "Network Overhaul",
    category: "Network Setup",
    beforeImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    description: "Enterprise-grade mesh WiFi covering 4,000 sq ft",
  },
  {
    id: "5",
    title: "Security Camera System",
    category: "Security",
    beforeImage: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80",
    description: "8-camera 4K system with night vision and mobile app",
  },
  {
    id: "6",
    title: "Outdoor Entertainment",
    category: "Audio System",
    beforeImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    description: "Weatherproof speakers with landscape lighting control",
  },
];

const categories = ["All", "TV Mounting", "Home Theater", "Smart Home", "Network Setup", "Security", "Audio System"];

export function BeforeAfterGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showAfter, setShowAfter] = useState(false);

  const filteredItems = selectedCategory === "All"
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-24 md:py-32 relative">
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
            <Camera className="w-4 h-4" />
            Our Work
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
            Before & <span className="text-gradient-orange">After</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            See the transformations we've made for our happy customers
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="glass-card overflow-hidden cursor-pointer group hover-lift"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowAfter(false);
                  }}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={item.afterImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary mb-2 inline-block">
                          {item.category}
                        </span>
                        <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                        <p className="text-white/70 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            {selectedItem && (
              <div className="relative">
                <div className="relative aspect-video">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={showAfter ? "after" : "before"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={showAfter ? selectedItem.afterImage : selectedItem.beforeImage}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  
                  {/* Before/After Label */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      showAfter ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}>
                      {showAfter ? "AFTER" : "BEFORE"}
                    </span>
                  </div>

                  {/* Navigation Buttons */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={() => setShowAfter(false)}
                    disabled={!showAfter}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={() => setShowAfter(true)}
                    disabled={showAfter}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                        {selectedItem.category}
                      </span>
                      <h3 className="text-xl font-semibold mt-2">{selectedItem.title}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{selectedItem.description}</p>
                  
                  {/* Toggle Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant={!showAfter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowAfter(false)}
                    >
                      Before
                    </Button>
                    <Button
                      variant={showAfter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowAfter(true)}
                    >
                      After
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
