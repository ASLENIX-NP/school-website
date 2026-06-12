import schoolLogo from "../../assets/school-logo.jpeg";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Facebook,
  Youtube,
  Globe,
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
  {
    icon: Facebook,
    href: "https://www.facebook.com/baljagritiesschool",
    label: "Facebook",
  },
  {
    icon: Globe,
    href: "https://baljagriti.edu.np/",
    label: "Website",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@BaljagritiEngSecondarySchool",
    label: "YouTube",
  },
];

const palette = {
  cyan: "#38BDF8",
  gold: "#FACC15",
  green: "#22C55E",
};

export function Footer() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [copied, setCopied] = useState("");

const isMobile =
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #020617 0%, #07111F 55%, #0F172A 100%)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
      <div
  className="
    absolute
    left-1/2
    top-0
    -translate-x-1/2
    w-[900px]
    h-[300px]
  "
  style={{
    background:
      "radial-gradient(circle, rgba(56,189,248,0.15), transparent 70%)",
    filter: "blur(100px)",
  }}
/>
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

      <div
  className="
    relative
    z-10
    max-w-[1450px]
    mx-auto
    px-6
    py-8
    rounded-[40px]
    border
    border-white/10
    backdrop-blur-3xl
  "
  style={{
    background:
      "linear-gradient(145deg, rgba(4,12,30,0.92), rgba(9,20,45,0.95))",
    boxShadow:
      "0 40px 100px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
  }}
>
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="
              w-12
              h-12
              rounded-2xl
              bg-white
              overflow-hidden
              flex
              items-center
              justify-center
              animate-pulse
              "
              
              style={{
                boxShadow:
                  "0 0 0 3px rgba(34,197,94,0.2), 0 14px 34px rgba(34,197,94,0.22)",
              }}
            >
              <div className="flex items-center gap-2 mt-1">
  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
  <span className="text-[11px] text-green-400">
    Admissions Open 2026
  </span>
</div>
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

              <div
                className="text-xs"
                style={{ color: palette.green }}
              >
                Secondary English Boarding School
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="
                group
                relative
                overflow-hidden
                text-sm
                px-4
                py-2
                rounded-xl
                transition-all
                duration-500
                hover:-translate-y-1
                hover:scale-105
                "
                style={{ color: "rgba(226,232,240,0.72)" }}
              >
                <div
  className="
    absolute
    inset-0
    opacity-0
    group-hover:opacity-100
    transition-all
    duration-500
  "
  style={{
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
  }}
/>
<span className="relative z-10">
  {link.label}
</span>
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="
w-10
h-10
rounded-xl
flex
items-center
justify-center
transition-all
duration-500
hover:scale-110
hover:-translate-y-2
hover:rotate-6
"
                style={{
                  background:
"linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
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

        {/* Contact Section */}
        <div
          className="mt-7 pt-6 border-t grid lg:grid-cols-3 gap-4 text-sm"
          style={{
            borderColor: "rgba(255,255,255,0.09)",
            color: "rgba(226,232,240,0.58)",
          }}
        >
      <a
  href="https://www.google.com/maps?sca_esv=d8401202f79e7010&output=search&q=baljagriti+english+secondary+school&source=lnms&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3jljrY5CkLlk8Dq3IvwBz-Q1-TMkKKwSK4jyJcbwv3yCGImjc6iJcpu4PR3QaSAygDukMvAqoeOyIrUKwQeMNaQDFC5-yaaQ4n-rdJpQ1_Yqrz0NzxvY1wmRZE02E_Hlg3Cl-XyLo1fKoQjHyGCthBCsnrOc80OriUzbdTKwwX_P5Bj1mg&entry=mc&ved=1t:200715&ictx=111"
  target="_blank"
  rel="noopener noreferrer"
  className="
    flex
    items-start
    gap-2
    transition-all
    duration-300
    hover:text-cyan-300
    hover:translate-x-1
    group
  "
>
  <MapPin
    className="w-4 h-4 mt-0.5 flex-shrink-0 transition-all duration-300 group-hover:scale-110"
    style={{ color: palette.cyan }}
  />

  <span>
    Basudev Marga, Hetauda-2, Makawanpur, Nepal
  </span>
</a>

        {/* Phone */}
<div className="flex items-center gap-2 flex-wrap">
  <Phone
    className="w-4 h-4 flex-shrink-0"
    style={{ color: palette.green }}
  />

  {isMobile ? (
    <>
      <a href="tel:+97757590144" className="hover:text-green-400">
        057-590144
      </a>
      <span>,</span>
      <a href="tel:+97757590145" className="hover:text-green-400">
        057-590145
      </a>
      <span>,</span>
      <a href="tel:+97757590146" className="hover:text-green-400">
        057-590146
      </a>
    </>
  ) : (
    <button
      onClick={() => setShowContactModal(true)}
      className="hover:text-green-400 transition-colors"
    >
      057-590144, 057-590145, 057-590146
    </button>
  )}
</div>
          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail
              className="w-4 h-4 flex-shrink-0"
              style={{ color: palette.gold }}
            />

            <a
              href="mailto:infobjess2046@gmail.com"
              className="break-all hover:text-yellow-300 transition-colors"
            >
              infobjess2046@gmail.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="mt-6 text-xs text-center"
          style={{ color: "rgba(226,232,240,0.38)" }}
        >
          © 2026 Baljagriti Secondary English Boarding School. All rights
          reserved.
        </div>
      </div>
      {showContactModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
   <div
  className="
    relative
    w-full
    max-w-md
    overflow-hidden
    rounded-[32px]
    border
    border-white/10
    backdrop-blur-3xl
    shadow-[0_30px_80px_rgba(0,0,0,0.6)]
  "
  
  style={{
    background: `
      linear-gradient(
        145deg,
        rgba(8,15,35,0.95),
        rgba(12,25,55,0.92)
      )
    `,
  }}
>
<div
  className="absolute -top-20 -right-20 w-52 h-52 rounded-full"
  style={{
    background:
      "radial-gradient(circle, rgba(34,197,94,0.35), transparent 70%)",
    filter: "blur(60px)",
  }}
/>

<div
  className="absolute -bottom-24 -left-20 w-52 h-52 rounded-full"
  style={{
    background:
      "radial-gradient(circle, rgba(56,189,248,0.25), transparent 70%)",
    filter: "blur(60px)",
  }}
/>
{copied && (
  <div
    className="
      absolute
      top-5
      right-5
      z-50
      px-4
      py-2
      rounded-xl
      text-white
      font-bold
      animate-bounce
    "
    style={{
      background:
        "linear-gradient(135deg,#22C55E,#38BDF8)",
      boxShadow:
        "0 15px 40px rgba(34,197,94,0.4)",
    }}
  >
    ✓ Copied
  </div>
)}
<div className="relative z-10 flex items-center gap-4 p-6 pb-4">
        <Phone className="w-5 h-5 text-green-400" />
        <h3 className="text-xl font-bold text-white">
          Contact Baljagriti School
        </h3>
      </div>

      <div className="space-y-3">
      <button
  onClick={() => {
    navigator.clipboard.writeText("057-590144");
    setCopied("057-590144");

    setTimeout(() => {
      setCopied("");
    }, 2000);
  }}
  className="
    group
    relative
    overflow-hidden
    w-full
    text-left
    p-4
    rounded-2xl
    bg-white/5
    border
    border-white/10
    transition-all
    duration-500
    hover:scale-[1.03]
    hover:bg-white/10
  "
>
  <div
    className="
      absolute
      inset-0
      opacity-0
      group-hover:opacity-100
      transition-all
      duration-500
    "
    style={{
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
    }}
  />

  <span className="relative z-10 text-white text-lg">
    📞 057-590144
  </span>
</button>

<button
  onClick={() => {
    navigator.clipboard.writeText("057-590144");
    setCopied("057-590144");

    setTimeout(() => {
      setCopied("");
    }, 2000);
  }}
  className="
    group
    relative
    overflow-hidden
    w-full
    text-left
    p-4
    rounded-2xl
    bg-white/5
    border
    border-white/10
    transition-all
    duration-500
    hover:scale-[1.03]
    hover:bg-white/10
  "
>
  <div
    className="
      absolute
      inset-0
      opacity-0
      group-hover:opacity-100
      transition-all
      duration-500
    "
    style={{
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
    }}
  />

  <span className="relative z-10 text-white text-lg">
    📞 057-590144
  </span>
</button>

<button
  onClick={() => {
    navigator.clipboard.writeText("057-590144");
    setCopied("057-590144");

    setTimeout(() => {
      setCopied("");
    }, 2000);
  }}
  className="
    group
    relative
    overflow-hidden
    w-full
    text-left
    p-4
    rounded-2xl
    bg-white/5
    border
    border-white/10
    transition-all
    duration-500
    hover:scale-[1.03]
    hover:bg-white/10
  "
>
  <div
    className="
      absolute
      inset-0
      opacity-0
      group-hover:opacity-100
      transition-all
      duration-500
    "
    style={{
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
    }}
  />

  <span className="relative z-10 text-white text-lg">
    📞 057-590144
  </span>
</button>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Click any number to copy it.
      </p>

      <button
        onClick={() => setShowContactModal(false)}
        className="
  mt-6
  w-full
  py-4
  rounded-2xl
  text-white
  font-bold
  transition-all
  duration-500
  hover:scale-[1.03]
"
style={{
  background:
    "linear-gradient(135deg,#22C55E,#38BDF8)",
  boxShadow:
    "0 20px 40px rgba(34,197,94,0.35)",
}}
      >
        Close
      </button>
    </div>
  </div>
)}
    </footer>
  );
}