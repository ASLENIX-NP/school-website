import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Home,
  Info,
  MessageSquareText,
  GraduationCap,
  Bell,
  Images,
  Users,
  CalendarDays,
  Phone,
  Footprints,
  LogOut,
  ArrowRight,
  Settings,
  School,
  Newspaper,
  Mail,
} from "lucide-react";

const colors = {
  green: "#168A3A",
  purple: "#4B2E83",
  red: "#D71920",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const adminSections = [
  {
    title: "Manage Home",
    description: "Edit hero section, homepage stats, highlights, and main CTA.",
    icon: Home,
    color: "#38BDF8",
    path: "/admin/home",
  },
  {
    title: "Manage Navbar",
    description: "Edit logo text, menu links, admission button, and navigation.",
    icon: LayoutDashboard,
    color: "#FACC15",
    path: "/admin/navbar",
  },
  {
    title: "Manage About",
    description: "Edit school introduction, story, mission, vision, and timeline.",
    icon: Info,
    color: "#4B2E83",
    path: "/admin/about",
  },
  {
    title: "Manage Messages",
    description: "Edit principal and vice principal messages.",
    icon: MessageSquareText,
    color: "#168A3A",
    path: "/admin/messages",
  },
  {
    title: "Manage Academics",
    description: "Edit academic programs, facilities, classes, and learning sections.",
    icon: GraduationCap,
    color: "#D71920",
    path: "/admin/academics",
  },
  {
    title: "Manage Admissions",
    description: "Edit admission process, requirements, dates, and scholarship info.",
    icon: School,
    color: "#38BDF8",
    path: "/admin/admissions",
  },
  {
    title: "Manage Notices",
    description: "Add notices, examination updates, school alerts, and PDF files.",
    icon: Bell,
    color: "#D71920",
    path: "/admin/notices",
  },
  {
    title: "Manage Staff",
    description: "Add teachers, departments, roles, and staff profile images.",
    icon: Users,
    color: "#168A3A",
    path: "/admin/staff",
  },
  {
    title: "Manage Facilities",
    description: "Edit facilities, labs, library, transport, sports and other infrastructure.",
    icon: School,
    color: "#4B2E83",
    path: "/admin/facilities",
  },
  {
    title: "Manage Gallery",
    description: "Add gallery images, categories, titles, and activity photos.",
    icon: Images,
    color: "#FACC15",
    path: "/admin/gallery",
  },
  {
    title: "Manage Contact Page",
    description: "Edit address, phone numbers, email, map text, and office details.",
    icon: Phone,
    color: "#38BDF8",
    path: "/admin/contact",
  },
  {
    title: "Contact Messages",
    description: "View messages submitted from the public contact form.",
    icon: Mail,
    color: "#D71920",
    path: "/admin/contact-messages",
  },
  {
    title: "Manage Footer",
    description: "Edit footer logo text, quick links, contact details, and social links.",
    icon: Footprints,
    color: "#168A3A",
    path: "/admin/footer",
  },
  {
    title: "Website Settings",
    description: "Manage general school name, colors, contact defaults, and site settings.",
    icon: Settings,
    color: "#4B2E83",
    path: "/admin/settings",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState(adminSections[0]);

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(250,204,21,0.12), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <header
        className="sticky top-0 z-40"
        style={{
          background:
            "linear-gradient(145deg, rgba(2,6,23,0.96), rgba(15,23,42,0.88))",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 18px 52px rgba(0,0,0,0.22)",
          backdropFilter: "blur(22px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
              }}
            >
              <LayoutDashboard className="w-6 h-6 text-slate-950" />
            </div>

            <div>
              <div className="text-white font-bold text-lg">
                Baljagriti Admin
              </div>
              <div className="text-xs text-white/55">
                {adminUser.email || "admin"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#FFFFFF",
            }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(22,138,58,0.09)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.16)",
            }}
          >
            <Newspaper className="w-4 h-4" />
            Admin Control Panel
          </span>

          <h1
            className="text-4xl md:text-6xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            Manage Website Sections
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Choose one website section below. We will build each admin editor
            one by one, starting from the most important sections.
          </p>
        </motion.div>

        <div className="grid xl:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {adminSections.map((section, index) => {
              const Icon = section.icon;
              const active = selectedSection.title === section.title;

              return (
                <motion.button
                  key={section.title}
                  type="button"
                  onClick={() => setSelectedSection(section)}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.035 }}
                  className="text-left rounded-3xl p-5 group transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: active
                      ? "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.94))"
                      : "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.76))",
                    border: active
                      ? "1px solid rgba(255,255,255,0.14)"
                      : "1px solid rgba(11,16,32,0.08)",
                    boxShadow: active
                      ? "0 22px 58px rgba(11,16,32,0.25)"
                      : "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      width: "52px",
                      height: "52px",
                      background: `${section.color}16`,
                      border: `1px solid ${section.color}28`,
                      boxShadow: `0 14px 32px ${section.color}16`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: section.color }} />
                  </div>

                  <h3
                    className="text-xl mb-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 850,
                      color: active ? "#FFFFFF" : colors.dark,
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {section.title}
                  </h3>

                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{
                      color: active
                        ? "rgba(255,255,255,0.64)"
                        : "rgb(100,116,139)",
                    }}
                  >
                    {section.description}
                  </p>

                  <div
                    className="inline-flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3"
                    style={{ color: section.color }}
                  >
                    Select Section
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          <motion.aside
            key={selectedSection.title}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="xl:sticky xl:top-28 rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.76))",
              border: "1px solid rgba(11,16,32,0.08)",
              boxShadow:
                "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="p-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: `${selectedSection.color}16`,
                  border: `1px solid ${selectedSection.color}28`,
                  boxShadow: `0 14px 32px ${selectedSection.color}16`,
                }}
              >
                <selectedSection.icon
                  className="w-8 h-8"
                  style={{ color: selectedSection.color }}
                />
              </div>

              <h2
                className="text-3xl mb-3"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 850,
                  color: colors.dark,
                  letterSpacing: "-0.04em",
                }}
              >
                {selectedSection.title}
              </h2>

              <p className="text-slate-500 leading-relaxed mb-6">
                {selectedSection.description}
              </p>

              <button
                type="button"
                onClick={() => navigate(selectedSection.path)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.01]"
                style={{
                  color: "#020617",
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                  boxShadow:
                    "0 18px 42px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
                }}
              >
                Open Editor
                <ArrowRight className="w-4 h-4" />
              </button>

              <div
                className="mt-5 rounded-2xl p-4 text-sm"
                style={{
                  background: "rgba(15,23,42,0.04)",
                  border: "1px solid rgba(15,23,42,0.08)",
                  color: "#64748B",
                }}
              >
                We will create this editor page next. For now, this dashboard
                is the control menu for all editable website sections.
              </div>
            </div>
          </motion.aside>
        </div>
      </main>
    </section>
  );
}