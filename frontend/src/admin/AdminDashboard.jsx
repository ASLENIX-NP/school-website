import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Bell,
  Images,
  MessageSquareText,
  Users,
  Mail,
  LogOut,
  ArrowRight,
} from "lucide-react";

const colors = {
  green: "#168A3A",
  purple: "#4B2E83",
  red: "#D71920",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const cards = [
  {
    title: "Manage Notices",
    description: "Add examination notices, school updates, and PDF files.",
    icon: Bell,
    color: "#D71920",
    path: "/admin/notices",
  },
  {
    title: "Manage Gallery",
    description: "Add school photos, categories, events, and activities.",
    icon: Images,
    color: "#168A3A",
    path: "/admin/gallery",
  },
  {
    title: "Leadership Messages",
    description: "Update principal and vice principal messages.",
    icon: MessageSquareText,
    color: "#4B2E83",
    path: "/admin/messages",
  },
  {
    title: "Manage Staff",
    description: "Add teachers, departments, roles, and profile images.",
    icon: Users,
    color: "#38BDF8",
    path: "/admin/staff",
  },
  {
    title: "Contact Messages",
    description: "View messages submitted from the public contact form.",
    icon: Mail,
    color: "#FACC15",
    path: "/admin/contact-messages",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

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
            <LayoutDashboard className="w-4 h-4" />
            Admin Dashboard
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
            Manage Website Content
          </h1>

          <p className="text-slate-500 max-w-2xl text-lg">
            Start by managing notices, gallery, leadership messages, staff, and
            contact submissions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.button
                key={card.title}
                type="button"
                onClick={() => navigate(card.path)}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="text-left rounded-3xl p-6 group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.76))",
                  border: "1px solid rgba(11,16,32,0.08)",
                  boxShadow:
                    "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: `${card.color}14`,
                    border: `1px solid ${card.color}24`,
                    boxShadow: `0 14px 32px ${card.color}16`,
                  }}
                >
                  <Icon className="w-7 h-7" style={{ color: card.color }} />
                </div>

                <h3
                  className="text-2xl mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 850,
                    color: colors.dark,
                    letterSpacing: "-0.035em",
                  }}
                >
                  {card.title}
                </h3>

                <p className="text-slate-500 leading-relaxed mb-5">
                  {card.description}
                </p>

                <div
                  className="inline-flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3"
                  style={{ color: card.color }}
                >
                  Open Section
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>
    </section>
  );
}