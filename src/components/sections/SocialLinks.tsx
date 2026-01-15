import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://facebook.com/homesetupsolutions",
    color: "hover:bg-[#1877F2]/20 hover:text-[#1877F2]",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://instagram.com/homesetupsolutions",
    color: "hover:bg-[#E4405F]/20 hover:text-[#E4405F]",
  },
  {
    name: "YouTube",
    icon: Youtube,
    url: "https://youtube.com/@homesetupsolutions",
    color: "hover:bg-[#FF0000]/20 hover:text-[#FF0000]",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/company/homesetupsolutions",
    color: "hover:bg-[#0A66C2]/20 hover:text-[#0A66C2]",
  },
  {
    name: "X (Twitter)",
    icon: Twitter,
    url: "https://twitter.com/homesetupsolns",
    color: "hover:bg-foreground/20 hover:text-foreground",
  },
];

export function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-3">
      {socialLinks.map((social, index) => (
        <motion.div
          key={social.name}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={`w-12 h-12 rounded-xl glass transition-all duration-300 ${social.color}`}
          >
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${social.name}`}
            >
              <social.icon className="w-5 h-5" />
            </a>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
