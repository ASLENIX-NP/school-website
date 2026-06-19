import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Phone,
  Footprints,
  LogOut,
  ArrowRight,
  Settings,
  School,
  Newspaper,
  Inbox,
  Mail,
  CheckCircle2,
  Circle,
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

function formatDate(value) {
  if (!value) return "Recently";

  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Recently";
  }
}

function getSourceLabel(source) {
  if (source === "admission") return "Admissions";
  return "Contact";
}

function MessagePreviewCard({ message }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: message.is_read
          ? "rgba(15,23,42,0.035)"
          : "rgba(22,138,58,0.08)",
        border: message.is_read
          ? "1px solid rgba(15,23,42,0.08)"
          : "1px solid rgba(22,138,58,0.22)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            {message.is_read ? (
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
            ) : (
              <Circle className="w-4 h-4" style={{ color: colors.green }} />
            )}

            <div className="font-black text-slate-950">
              {message.name || "Unknown Sender"}
            </div>
          </div>

          <div className="text-xs text-slate-500 mt-1">
            {getSourceLabel(message.source)} · {formatDate(message.created_at)}
          </div>
        </div>

        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background:
              message.source === "admission"
                ? "rgba(75,46,131,0.1)"
                : "rgba(215,25,32,0.09)",
            color: message.source === "admission" ? colors.purple : colors.red,
          }}
        >
          {getSourceLabel(message.source)}
        </span>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
        {message.message || "No message text."}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState(adminSections[0]);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/contact-messages");
        setMessages(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error("Dashboard messages load error:", err);
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const latestMessages = messages.slice(0, 2);
  const unreadCount = messages.filter((item) => !item.is_read).length;

  return (
    <section
      className="min-h-screen relative overflow-visible"
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
            Choose one website section below. Recent admission and contact
            messages are shown separately so the dashboard stays clean.
          </p>
        </motion.div>

        <div
          className="rounded-[32px] p-6 md:p-7 mb-8"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.76))",
            border: "1px solid rgba(11,16,32,0.08)",
            boxShadow:
              "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-5">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(215,25,32,0.09)",
                  border: "1px solid rgba(215,25,32,0.18)",
                  color: colors.red,
                }}
              >
                <Inbox className="w-7 h-7" />
              </div>

              <div>
                <h2
                  className="text-2xl md:text-3xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 850,
                    color: colors.dark,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Recent Messages
                </h2>

                <p className="text-slate-500 text-sm md:text-base">
                  Latest messages from Contact and Admissions forms.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div
                className="px-4 py-3 rounded-2xl text-sm font-bold"
                style={{
                  background: "rgba(22,138,58,0.09)",
                  color: colors.green,
                  border: "1px solid rgba(22,138,58,0.16)",
                }}
              >
                {unreadCount} unread
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/contact-messages")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  boxShadow: "0 16px 36px rgba(22,138,58,0.2)",
                }}
              >
                View More
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {messagesLoading ? (
            <div className="rounded-2xl p-5 bg-slate-50 text-slate-500 font-semibold">
              Loading latest messages...
            </div>
          ) : latestMessages.length === 0 ? (
            <div className="rounded-2xl p-5 bg-slate-50 text-slate-500 font-semibold flex items-center gap-3">
              <Mail className="w-5 h-5" />
              No contact or admission messages yet.
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-4">
              {latestMessages.map((message) => (
                <MessagePreviewCard key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>

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
                    className="rounded-2xl flex items-center justify-center mb-5"
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
                Use this dashboard to open each admin editor. Messages from
                public forms are shown in the Recent Messages panel above.
              </div>
            </div>
          </motion.aside>
        </div>
      </main>
    </section>
  );
}