import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
  lightGreen: "#EAF7EF",
  lightPurple: "#F1ECFF",
};

const facilities = [
  {
    emoji: "📚",
    title: "E-library",
    label: "Digital Learning",
    desc: "Students get access to e-library support, information retrieval training, and broadband internet resources for learning and skill development.",
    color: "#D71920",
    bg: "rgba(215,25,32,0.08)",
    border: "rgba(215,25,32,0.22)",
  },
  {
    emoji: "💻",
    title: "Computer Lab",
    label: "Technology Facility",
    desc: "The computer lab is equipped with sufficient computers, updated software, and internet access to support practical computer education.",
    color: "#4B2E83",
    bg: "rgba(75,46,131,0.08)",
    border: "rgba(75,46,131,0.22)",
  },
  {
    emoji: "🔬",
    title: "Science Lab",
    label: "Practical Learning",
    desc: "Science laboratories support practical activities with safe, organized spaces and equipment for individual and group experiments.",
    color: "#168A3A",
    bg: "rgba(22,138,58,0.08)",
    border: "rgba(22,138,58,0.22)",
  },
  {
    emoji: "🎤",
    title: "Auditorium",
    label: "Events & Assembly",
    desc: "The auditorium provides a flexible space for presentations, assemblies, lectures, award ceremonies, performances, and school programs.",
    color: "#7C5CC4",
    bg: "rgba(124,92,196,0.09)",
    border: "rgba(124,92,196,0.24)",
  },
  {
    emoji: "🏫",
    title: "Teaching Facilities",
    label: "Modern Classrooms",
    desc: "The school focuses on qualified teachers, multimedia classrooms, child-friendly learning, project-based learning, field visits, and individual guidance.",
    color: "#0B1020",
    bg: "rgba(11,16,32,0.06)",
    border: "rgba(11,16,32,0.16)",
  },
  {
    emoji: "⚽",
    title: "Sports",
    label: "Physical Development",
    desc: "Baljagriti promotes sports for confidence, health, personality development, and overall student growth through various indoor and outdoor activities.",
    color: "#168A3A",
    bg: "rgba(22,138,58,0.08)",
    border: "rgba(22,138,58,0.22)",
  },
];

export function Academics() {
  return (
    <section
      id="facilities"
      className="pt-36 pb-28 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(215,25,32,0.12), transparent 32%),
          radial-gradient(circle at bottom right, rgba(22,138,58,0.14), transparent 34%),
          radial-gradient(circle at 60% 10%, rgba(75,46,131,0.14), transparent 34%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div
        className="absolute top-20 left-0 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(215,25,32,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "rgba(22,138,58,0.1)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.24)",
              boxShadow: "0 10px 28px rgba(22,138,58,0.08)",
            }}
          >
            Facilities
          </span>

          <h2
            className="text-4xl md:text-5xl mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: colors.dark,
            }}
          >
            Learning Beyond{" "}
            <span className="italic" style={{ color: colors.red }}>
              Classrooms
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-lg" style={{ color: "#475569" }}>
            Baljagriti provides academic, digital, practical, creative, and
            sports facilities that support students in learning with confidence,
            curiosity, and discipline.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {facilities.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.74))",
                border: `1px solid ${item.border}`,
                boxShadow:
                  "0 18px 46px rgba(11,16,32,0.09), 0 0 0 1px rgba(255,255,255,0.55)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, ${item.color}, ${colors.green})`,
                }}
              />

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                  boxShadow: `0 12px 28px ${item.color}18`,
                }}
              >
                {item.emoji}
              </div>

              <div
                className="text-xs font-semibold mb-1 px-2 py-0.5 rounded-full inline-block"
                style={{ background: item.bg, color: item.color }}
              >
                {item.label}
              </div>

              <h3
                className="mt-2 mb-2 text-lg"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  color: colors.dark,
                }}
              >
                {item.title}
              </h3>

              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "#64748b" }}
              >
                {item.desc}
              </p>

              <div
                className="flex items-center gap-1 text-sm font-medium transition-all duration-200 group-hover:gap-2"
                style={{ color: item.color }}
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: facilities.length * 0.07 }}
            className="p-6 rounded-3xl flex flex-col items-center justify-center text-center min-h-[200px]"
            style={{
              background: `linear-gradient(135deg, ${colors.dark}, ${colors.purple})`,
              boxShadow:
                "0 24px 64px rgba(11,16,32,0.34), 0 0 44px rgba(75,46,131,0.18)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div className="text-4xl mb-3">🌟</div>

            <div
              className="text-white font-semibold mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Join Baljagriti
            </div>

            <p
              className="text-xs mb-4"
              style={{ color: "rgba(255,255,255,0.66)" }}
            >
              Quality education with supportive facilities
            </p>

            <Link
              to="/admissions"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.red}, ${colors.green})`,
                boxShadow: "0 12px 28px rgba(215,25,32,0.26)",
              }}
            >
              Admission Details
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}