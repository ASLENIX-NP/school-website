import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const programs = [
  {
    emoji: "📖",
    title: "Primary School",
    grades: "Grades 1–5",
    desc: "Building foundational skills through play-based, inquiry-driven learning in literacy, numeracy, and social development.",
    color: "#f97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.2)",
  },
  {
    emoji: "🧩",
    title: "Middle School",
    grades: "Grades 6–8",
    desc: "Transitional years focused on interdisciplinary projects, critical thinking, and personal identity development.",
    color: "#6b21a8",
    bg: "rgba(107,33,168,0.08)",
    border: "rgba(107,33,168,0.2)",
  },
  {
    emoji: "🎓",
    title: "High School",
    grades: "Grades 9–12",
    desc: "University-prep academics with AP/IB tracks, dual enrollment, and extensive college counseling support.",
    color: "#0f1c3f",
    bg: "rgba(15,28,63,0.06)",
    border: "rgba(15,28,63,0.15)",
  },
  {
    emoji: "🔬",
    title: "Science & STEM",
    grades: "All Levels",
    desc: "State-of-the-art labs for biology, chemistry, physics, robotics, and AI exploration.",
    color: "#059669",
    bg: "rgba(5,150,105,0.07)",
    border: "rgba(5,150,105,0.2)",
  },
  {
    emoji: "💻",
    title: "Technology",
    grades: "All Levels",
    desc: "Coding, app development, cybersecurity, and digital design taught by industry professionals.",
    color: "#2563eb",
    bg: "rgba(37,99,235,0.07)",
    border: "rgba(37,99,235,0.2)",
  },
  {
    emoji: "🎨",
    title: "Arts & Culture",
    grades: "All Levels",
    desc: "Visual arts, drama, music, dance, and film production in fully-equipped creative studios.",
    color: "#db2777",
    bg: "rgba(219,39,119,0.07)",
    border: "rgba(219,39,119,0.2)",
  },
  {
    emoji: "⚽",
    title: "Sports",
    grades: "All Levels",
    desc: "Olympic-standard facilities for 20+ sports with competitive leagues and elite coaching staff.",
    color: "#f97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.2)",
  },
];

export function Academics() {
  return (
    <section
      id="academics"
      className="py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fdf8f3 0%, #f0e8ff 100%)" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-20 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.06), transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(107,33,168,0.06), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "rgba(107,33,168,0.1)", color: "#6b21a8", border: "1px solid rgba(107,33,168,0.2)" }}
          >
            Programs
          </span>
          <h2
            className="text-4xl md:text-5xl mb-5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#0f1c3f" }}
          >
            Every Student,{" "}
            <span className="italic" style={{ color: "#f97316" }}>Every Talent</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg" style={{ color: "#64748b" }}>
            Our broad curriculum ensures that every student finds their passion — whether in science labs, sports fields, or creative studios.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                background: "#ffffff",
                border: `1px solid ${p.border}`,
                boxShadow: "0 4px 20px rgba(15,28,63,0.06)",
              }}
            >
              {/* Colored top strip on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: p.color }}
              />

              {/* Emoji */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: p.bg, border: `1px solid ${p.border}` }}
              >
                {p.emoji}
              </div>

              <div
                className="text-xs font-semibold mb-1 px-2 py-0.5 rounded-full inline-block"
                style={{ background: p.bg, color: p.color }}
              >
                {p.grades}
              </div>

              <h3
                className="mt-2 mb-2 text-lg"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "#0f1c3f" }}
              >
                {p.title}
              </h3>

              <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748b" }}>
                {p.desc}
              </p>

              <div
                className="flex items-center gap-1 text-sm font-medium transition-all duration-200 group-hover:gap-2"
                style={{ color: p.color }}
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: programs.length * 0.07 }}
            className="p-6 rounded-3xl flex flex-col items-center justify-center text-center min-h-[200px]"
            style={{
              background: "linear-gradient(135deg, #0f1c3f, #1a0a3c)",
              boxShadow: "0 16px 48px rgba(15,28,63,0.3)",
            }}
          >
            <div className="text-4xl mb-3">🌟</div>
            <div className="text-white font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Discover All Programs
            </div>
            <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
              20+ specialized tracks & electives
            </p>
            <a
              href="#admissions"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
            >
              View All
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
