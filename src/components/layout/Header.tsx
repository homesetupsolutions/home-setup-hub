import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MessageSquare, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const M365_BOOKING_URL = 'https://outlook.office.com/book/HomeSetupSolutions1@homesetupsolutions.ca/?ismsaljsauthenabled';

const navLinks = [
  { label: "Home", path: "/", staffOnly: false },
  { label: "Services", path: "/#services", staffOnly: false },
  { label: "About", path: "/#about", staffOnly: false },
  { label: "Staff Portal", path: "/staff", staffOnly: true },
  { label: "Contact", path: "/#contact", staffOnly: false },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (path.includes("#")) {
      const id = path.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={logo} alt="Home Setup Solutions" className="w-11 h-11 rounded-xl relative z-10" />
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="font-bold text-lg hidden sm:block">
              Home Setup <span className="text-primary">Solutions</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks
              .filter((link) => !link.staffOnly || (link.staffOnly && user && isAdmin))
              .map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </nav>

          {/* Contact Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:18332302933"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 whitespace-nowrap"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>1-833-230-2933</span>
            </a>
            
            {/* Login Buttons */}
            {user ? (
              <Link to={isAdmin ? "/admin" : "/portal"}>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  {isAdmin ? "Admin Panel" : "My Portal"}
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth?type=customer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Customer Login
                  </Button>
                </Link>
                <Link to="/auth?type=staff">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Briefcase className="w-4 h-4" />
                    Staff Login
                  </Button>
                </Link>
              </div>
            )}
            
            <a href={M365_BOOKING_URL}>
              <Button variant="hero" size="lg">
                Book Now
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-muted/50 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border/30"
          >
            <div className="container mx-auto px-6 py-6 space-y-2">
              {navLinks
                .filter((link) => !link.staffOnly || (link.staffOnly && user && isAdmin))
                .map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      location.pathname === link.path
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              <div className="pt-6 space-y-4">
                <a
                  href="tel:18332302933"
                  className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-primary"
                >
                  <Phone className="w-5 h-5" />
                  <span>1-833-230-2933</span>
                </a>
                <a
                  href="sms:15878994357"
                  className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-primary"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Text: 1-587-899-HELP (4357)</span>
                </a>
                
                {/* Mobile Login Buttons */}
                {user ? (
                  <Link to={isAdmin ? "/admin" : "/portal"} className="block">
                    <Button variant="outline" className="w-full gap-2">
                      <User className="w-4 h-4" />
                      {isAdmin ? "Admin Panel" : "My Portal"}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth?type=customer" className="block">
                      <Button variant="outline" className="w-full gap-2">
                        <User className="w-4 h-4" />
                        Customer Login
                      </Button>
                    </Link>
                    <Link to="/auth?type=staff" className="block">
                      <Button variant="ghost" className="w-full gap-2">
                        <Briefcase className="w-4 h-4" />
                        Staff Login
                      </Button>
                    </Link>
                  </>
                )}
                
                <a href={M365_BOOKING_URL} className="block">
                  <Button variant="hero" size="lg" className="w-full">
                    Book Now
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
