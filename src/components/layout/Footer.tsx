import { Link } from "react-router-dom";
import { Phone, Mail, MessageSquare, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Home Setup Solutions" className="w-10 h-10 rounded-lg" />
              <span className="font-bold text-lg">
                Home Setup <span className="text-primary">Solutions</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Professional home installation and setup services. We make your technology work seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "Services", path: "/#services" },
                { label: "Book Appointment", path: "/book" },
                { label: "About Us", path: "/#about" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", path: "/policy" },
                { label: "Terms of Service", path: "/policy#terms" },
                { label: "SMS Policy", path: "/policy#sms" },
                { label: "Cancellation Policy", path: "/policy#cancellation" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:8332302933"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>833-230-2933 (Toll Free)</span>
                </a>
              </li>
              <li>
                <a
                  href="sms:15873164353"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Text: 587-316-4353</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:customerservice@homesetupsolutions.ca"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>customerservice@homesetupsolutions.ca</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Serving all of Canada</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Home Setup Solutions. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
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