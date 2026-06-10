import { useState } from "react";
import { GraduationCap, Facebook, Twitter, Instagram, Youtube, Linkedin, ArrowRight } from "lucide-react";

const quickLinks = ["About Us", "Academics", "Admissions", "Faculty", "Research", "Alumni"];
const studentLinks = ["Student Portal", "Library", "E-Learning", "Exam Schedule", "Health Center", "Campus Map"];
const contactLines = [
  "42 Apex Boulevard",
  "Springfield, IL 62701",
  "+1 (555) 842-0011",
  "admissions@apexacademy.edu",
];

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <footer style={{ background: "#070e21" }}>
      {/* Top CTA bar */}
      <div
        className="py-12"
        style={{ background: "linear-gradient(135deg, #0f1c3f, #1a0a3c)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3
              className="text-2xl text-white mb-1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Ready to Join Apex Academy?
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Admissions for 2026–27 are now open. Seats are limited.
            </p>
          </div>
          <a
            href="#admissions"
            className="flex-shrink-0 px-7 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 8px 24px rgba(249,115,22,0.3)" }}
          >
            Apply Now →
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #f97316, #fb923c)" }}
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-lg" style={{ fontFamily: "var(--font-display)" }}>
                  Apex Academy
                </div>
                <div className="text-xs" style={{ color: "#f97316" }}>Excellence in Education</div>
              </div>
            </div>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              Shaping the next generation of leaders through rigorous academics, character development, and global awareness since 1989.
            </p>
            {/* Social links */}
            <div className="flex gap-2 flex-wrap">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <s.icon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="text-sm font-semibold mb-5 uppercase tracking-widest" style={{ color: "#f97316" }}>
              Quick Links
            </div>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm flex items-center gap-2 transition-all duration-200 hover:gap-3"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    <ArrowRight className="w-3 h-3 opacity-50" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Students */}
          <div>
            <div className="text-sm font-semibold mb-5 uppercase tracking-widest" style={{ color: "#f97316" }}>
              Student Resources
            </div>
            <ul className="space-y-2.5">
              {studentLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm flex items-center gap-2 transition-all duration-200 hover:gap-3"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    <ArrowRight className="w-3 h-3 opacity-50" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div>
            <div className="text-sm font-semibold mb-5 uppercase tracking-widest" style={{ color: "#f97316" }}>
              Contact
            </div>
            <ul className="space-y-2 mb-8">
              {contactLines.map((line) => (
                <li key={line} className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {line}
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div
              className="p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="text-xs font-semibold mb-3 text-white">Stay Updated</div>
              {subscribed ? (
                <div className="text-sm text-center py-2" style={{ color: "#4ade80" }}>
                  ✓ You're subscribed!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2.5 rounded-lg text-xs outline-none min-w-0"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#ffffff" }}
                  />
                  <button
                    type="submit"
                    className="px-3 py-2.5 rounded-lg text-white flex items-center gap-1 text-xs font-semibold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t py-6"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          <span>© 2026 Apex Academy. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
