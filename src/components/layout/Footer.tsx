import { Link } from "react-router-dom";
import { Phone, Mail, MessageSquare, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-strong relative z-10">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="container mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={logo} alt="Home Setup Solutions" className="w-12 h-12 rounded-xl relative z-10" />
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
              </div>
              <span className="font-bold text-xl">
                Home Setup <span className="text-primary">Solutions</span>
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Professional home installation and setup services. We make your technology work seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Services", path: "/#services" },
                { label: "About Us", path: "/#about" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:w-2 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://outlook.office.com/book/allbookings@homesetupsolutions.ca/?ismsaljsauthenabled"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:w-2 transition-all duration-300" />
                  Book Appointment
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-foreground">Legal</h4>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy", path: "/policy" },
                { label: "Terms of Service", path: "/policy#terms" },
                { label: "SMS Policy", path: "/policy#sms" },
                { label: "Cancellation Policy", path: "/policy#cancellation" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:w-2 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-foreground">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:18332302933"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:border-primary/40 transition-all duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span>1-833-230-2933</span>
                </a>
              </li>
              <li>
                <a
                  href="sms:15876045127"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:border-primary/40 transition-all duration-300">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span>Text: 1-587-604-5127</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:customerservice@homesetupsolutions.ca"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:border-primary/40 transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm">customerservice@homesetupsolutions.ca</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>Serving Calgary & Area</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground">
            © {currentYear} Home Setup Solutions. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Standard message and data rates may apply. See our{" "}
            <Link to="/policy#sms" className="text-primary hover:underline">
              SMS Policy
            </Link>{" "}
            for details.
          </p>
        </div>
      </div>
    </footer>
  );
}
