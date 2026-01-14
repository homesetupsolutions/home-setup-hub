import { Link } from "react-router-dom";
import { Phone, Mail, MessageSquare, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/40 backdrop-blur-sm border-t border-border/50 relative z-10">
      <div className="container mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Home Setup Solutions" className="w-12 h-12 rounded-xl" />
              <span className="font-bold text-xl">
                Home Setup <span className="text-primary">Solutions</span>
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Professional home installation and setup services. We make your technology work seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="font-semibold text-lg text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Services", path: "/#services" },
                { label: "Book Appointment", path: "/book" },
                { label: "About Us", path: "/#about" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-5">
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
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="font-semibold text-lg text-foreground">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:18332302933"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Phone className="w-5 h-5" />
                  <span>1-833-230-2933 (Toll Free)</span>
                </a>
              </li>
              <li>
                <a
                  href="sms:15876045127"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Text: 1-587-604-5127</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:customerservice@homesetupsolutions.ca"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Mail className="w-5 h-5" />
                  <span>customerservice@homesetupsolutions.ca</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                <span>Serving all of Canada</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
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
