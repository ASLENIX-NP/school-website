import schoolLogo from "../../assets/school-logo.jpeg";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Facilities", href: "/facilities" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const palette = {
  cyan: "#38BDF8",
  gold: "#FACC15",
  green: "#22C55E",
};

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #020617 0%, #07111F 55%, #0F172A 100%)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -left-24 -top-24 w-72 h-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.18), transparent 70%)",
          }}
        />

        <div
          className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(250,204,21,0.14), transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1450px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl bg-white overflow-hidden flex items-center justify-center"
              style={{
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

            <div>
              <div
                className="text-white text-lg font-bold leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Baljagriti
              </div>
              <div className="text-xs" style={{ color: palette.green }}>
                Secondary English Boarding School
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/10"
                style={{ color: "rgba(226,232,240,0.72)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <s.icon
                  className="w-4 h-4"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                />
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-7 pt-6 border-t grid lg:grid-cols-3 gap-4 text-sm"
          style={{
            borderColor: "rgba(255,255,255,0.09)",
            color: "rgba(226,232,240,0.58)",
          }}
        >
          <div className="flex items-start gap-2">
            <MapPin
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: palette.cyan }}
            />
            <span>Basudev Marga, Hetauda-2, Makawanpur, Nepal</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone
              className="w-4 h-4 flex-shrink-0"
              style={{ color: palette.green }}
            />
            <span>057-590144, 057-590145, 057-590146</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail
              className="w-4 h-4 flex-shrink-0"
              style={{ color: palette.gold }}
            />
            <span className="break-all">infobjess2046@gmail.com</span>
          </div>
        </div>

        <div
          className="mt-6 text-xs text-center"
          style={{ color: "rgba(226,232,240,0.38)" }}
        >
          © 2026 Baljagriti Secondary English Boarding School. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}