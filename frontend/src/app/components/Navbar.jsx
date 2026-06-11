import schoolLogo from "../../assets/school-logo.jpeg";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Messages", href: "/messages" },
  { label: "Academics", href: "/academics" },
  { label: "Notices", href: "/notices" },
  { label: "Facilities", href: "/facilities" },
  { label: "Staff", href: "/staff" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const palette = {
  navy: "#020617",
  slate: "#0F172A",
  cyan: "#38BDF8",
  gold: "#FACC15",
  green: "#22C55E",
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname === href;
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-3"
      >
        <nav
          className="max-w-[1450px] mx-auto h-[76px] px-5 md:px-6 flex items-center justify-between rounded-[1.7rem] transition-all duration-300"
          style={{
            background: scrolled
              ? "linear-gradient(145deg, rgba(2,6,23,0.95), rgba(15,23,42,0.88))"
              : "linear-gradient(145deg, rgba(2,6,23,0.9), rgba(15,23,42,0.78))",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: scrolled
              ? "0 24px 70px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.12)"
              : "0 18px 52px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.1)",
            backdropFilter: "blur(24px)",
          }}
        >
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div
              className="rounded-2xl overflow-hidden bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-105"
              style={{
                width: "52px",
                height: "52px",
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow:
                  "0 0 0 3px rgba(34,197,94,0.2), 0 14px 34px rgba(34,197,94,0.22)",
              }}
            >
              <img
                src={schoolLogo}
                alt="Baljagriti School Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>

            <div className="hidden sm:block">
              <div
                className="font-bold text-lg leading-tight"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.02em",
                }}
              >
                Baljagriti
              </div>

              <div
                className="text-xs leading-tight"
                style={{ color: palette.green }}
              >
                Secondary English Boarding School
              </div>
            </div>
          </Link>

          <div
            className="hidden xl:flex items-center gap-1 px-2 py-2 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.055)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="relative px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                  style={{
                    color: active ? "#020617" : "rgba(255,255,255,0.84)",
                    background: active
                      ? `linear-gradient(135deg, ${palette.gold}, ${palette.cyan})`
                      : "transparent",
                    boxShadow: active
                      ? "0 12px 28px rgba(56,189,248,0.22)"
                      : "none",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
            <Link
              to="/admissions"
              className="relative overflow-hidden px-6 py-3 rounded-2xl text-sm font-bold text-slate-950 transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${palette.gold}, ${palette.cyan})`,
                boxShadow:
                  "0 18px 42px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.42)",
              }}
            >
              <span className="relative z-10">Admission Open →</span>
              <span
                className="absolute top-0 bottom-0 w-16 opacity-40"
                style={{
                  left: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                  animation: "navShine 2.8s ease-in-out infinite",
                }}
              />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden p-2 rounded-xl transition-colors"
            style={{
              color: "#FFFFFF",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </motion.header>

      <style>{`
        @keyframes navShine {
          0% { transform: translateX(-130%) rotate(18deg); }
          100% { transform: translateX(190%) rotate(18deg); }
        }
      `}</style>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[96px] left-4 right-4 z-40 xl:hidden rounded-[1.7rem] overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(2,6,23,0.97), rgba(15,23,42,0.9))",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 28px 80px rgba(0,0,0,0.36)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="p-4 grid gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      color: active ? "#020617" : "rgba(255,255,255,0.86)",
                      background: active
                        ? `linear-gradient(135deg, ${palette.gold}, ${palette.cyan})`
                        : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <Link
                to="/admissions"
                onClick={() => setOpen(false)}
                className="mt-3 px-5 py-3 rounded-xl text-sm font-bold text-center text-slate-950"
                style={{
                  background: `linear-gradient(135deg, ${palette.gold}, ${palette.cyan})`,
                  boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
                }}
              >
                Admission Open →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}