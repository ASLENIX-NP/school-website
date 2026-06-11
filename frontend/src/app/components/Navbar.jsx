import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }

    return location.pathname === href;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(15,28,63,0.96)"
            : "rgba(15,28,63,0.75)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "none",
          boxShadow: scrolled ? "0 4px 32px rgba(15,28,63,0.3)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                background: "linear-gradient(135deg, #f97316, #fb923c)",
              }}
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </div>

            <div>
              <div
                className="text-white font-semibold text-lg leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Apex Academy
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(249,115,22,0.9)" }}
              >
                Excellence in Education
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="relative px-4 py-2 text-sm transition-colors duration-200 group"
                style={{
                  color: isActive(link.href)
                    ? "#f97316"
                    : "rgba(255,255,255,0.82)",
                }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full transition-all duration-200 origin-left"
                  style={{
                    background: "#f97316",
                    transform: isActive(link.href)
                      ? "scaleX(1)"
                      : "scaleX(0)",
                  }}
                />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/admissions"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
              }}
            >
              Apply Now →
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 left-0 right-0 z-40 lg:hidden"
            style={{
              background: "rgba(15,28,63,0.98)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm transition-colors"
                  style={{
                    color: isActive(link.href)
                      ? "#f97316"
                      : "rgba(255,255,255,0.85)",
                    background: isActive(link.href)
                      ? "rgba(249,115,22,0.12)"
                      : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to="/admissions"
                onClick={() => setOpen(false)}
                className="mt-3 px-5 py-3 rounded-xl text-sm font-semibold text-white text-center"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                }}
              >
                Apply Now →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}