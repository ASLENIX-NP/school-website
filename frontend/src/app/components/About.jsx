import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { CheckCircle2, Award, Heart, Lightbulb } from "lucide-react";

const pillars = [
  {
    icon: Award,
    label: "Academic Excellence",
    desc: "Rigorous curriculum aligned with international standards and board exams.",
  },
  {
    icon: Heart,
    label: "Holistic Development",
    desc: "Sports, arts, music, and leadership programs for every student.",
  },
  {
    icon: Lightbulb,
    label: "Innovation Culture",
    desc: "STEM labs, maker spaces, and design thinking workshops.",
  },
];

const highlights = [
  "IB & Cambridge-aligned curriculum",
  "1:14 teacher-to-student ratio",
  "12 specialized science & tech labs",
  "Award-winning sports facilities",
  "Mental health & counseling center",
  "Global exchange partnerships",
];

export function About() {
  return (
    <section
      id="about"
      className="pt-36 pb-28 relative overflow-hidden min-h-screen"
      style={{ background: "#fdf8f3" }}
    >
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(107,33,168,0.06), transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "rgba(249,115,22,0.1)",
              color: "#ea580c",
              border: "1px solid rgba(249,115,22,0.2)",
            }}
          >
            Our Story
          </span>

          <h2
            className="text-4xl md:text-5xl mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "#0f1c3f",
            }}
          >
            More Than a School —{" "}
            <span className="italic" style={{ color: "#6b21a8" }}>
              A Community
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-lg" style={{ color: "#64748b" }}>
            Founded in 1989, Apex Academy has shaped over 35,000 graduates who
            lead in science, business, arts, and public service across 60
            countries.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div
              className="relative rounded-3xl overflow-hidden h-[420px]"
              style={{ boxShadow: "0 24px 64px rgba(15,28,63,0.2)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&h=500&fit=crop&auto=format"
                alt="Students in classroom with teacher"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(15,28,63,0.5) 0%, transparent 50%)",
                }}
              />
            </div>

            <div
              className="absolute -bottom-8 -right-8 p-6 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #0f1c3f, #1a0a3c)",
                boxShadow: "0 16px 48px rgba(15,28,63,0.4)",
                border: "1px solid rgba(107,33,168,0.3)",
                width: "200px",
              }}
            >
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-white font-semibold text-sm">
                National School of the Year
              </div>
              <div className="text-xs mt-1" style={{ color: "#f97316" }}>
                2023 & 2024
              </div>
            </div>

            <div
              className="absolute -top-6 -left-6 px-5 py-4 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 8px 32px rgba(15,28,63,0.15)",
                border: "1px solid rgba(107,33,168,0.12)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(107,33,168,0.1)" }}
                >
                  <Award className="w-5 h-5" style={{ color: "#6b21a8" }} />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "#0f1c3f" }}
                  >
                    NEASC Accredited
                  </div>
                  <div className="text-xs" style={{ color: "#64748b" }}>
                    Since 2001
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="space-y-5 mb-10">
              {pillars.map((p) => (
                <div
                  key={p.label}
                  className="flex gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(15,28,63,0.08)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(107,33,168,0.1)" }}
                  >
                    <p.icon className="w-6 h-6" style={{ color: "#6b21a8" }} />
                  </div>

                  <div>
                    <div
                      className="font-semibold mb-1"
                      style={{ color: "#0f1c3f" }}
                    >
                      {p.label}
                    </div>
                    <div className="text-sm" style={{ color: "#64748b" }}>
                      {p.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {highlights.map((h) => (
                <div key={h} className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#f97316" }}
                  />
                  <span className="text-sm" style={{ color: "#475569" }}>
                    {h}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                to="/academics"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #0f1c3f, #1a0a3c)",
                  boxShadow: "0 8px 24px rgba(15,28,63,0.3)",
                }}
              >
                Explore Our Programs →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}