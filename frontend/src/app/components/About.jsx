import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { CheckCircle2, Award, Heart, Lightbulb } from "lucide-react";

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

const pillars = [
  {
    icon: Award,
    label: "Academic Excellence",
    desc: "Focused classroom learning that helps students build a strong academic foundation from early years to Grade 10.",
  },
  {
    icon: Heart,
    label: "Holistic Development",
    desc: "A nurturing and child-friendly environment where students grow academically, personally, socially, and morally.",
  },
  {
    icon: Lightbulb,
    label: "Creative & Practical Learning",
    desc: "Extra-curricular activities, competitions, sports, arts, and school programs help students explore their talents.",
  },
];

const highlights = [
  "Play Group to Grade 10",
  "Co-educational day school",
  "Located in Hetauda-2, Makwanpur",
  "Child-friendly learning environment",
  "Focus on academic and moral foundation",
  "ECA, sports, arts, and competitions",
];

export function About() {
  return (
    <section
      id="about"
      className="pt-36 pb-28 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.14), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(22,138,58,0.11), transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "rgba(215,25,32,0.09)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.22)",
              boxShadow: "0 10px 28px rgba(215,25,32,0.08)",
            }}
          >
            About Baljagriti
          </span>

          <h2
            className="text-4xl md:text-5xl mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: colors.dark,
            }}
          >
            Quality Education with{" "}
            <span className="italic" style={{ color: colors.purple }}>
              Holistic Growth
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-lg" style={{ color: "#475569" }}>
            Baljagriti Secondary English Boarding School is a well-established
            school in Basudev Marga, Hetauda, Makwanpur, committed to academic
            excellence, discipline, creativity, and the overall development of
            every student.
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
              style={{
                boxShadow:
                  "0 30px 80px rgba(11,16,32,0.26), 0 0 0 1px rgba(255,255,255,0.55)",
                transform: "perspective(1000px) rotateY(3deg) rotateX(2deg)",
                border: "1px solid rgba(255,255,255,0.5)",
              }}
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
                    "linear-gradient(to top, rgba(11,16,32,0.62) 0%, transparent 56%)",
                }}
              />
            </div>

            <div
              className="absolute -bottom-8 -right-8 p-6 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${colors.dark}, ${colors.purple})`,
                boxShadow:
                  "0 22px 58px rgba(11,16,32,0.42), 0 0 38px rgba(75,46,131,0.22)",
                border: "1px solid rgba(255,255,255,0.14)",
                width: "200px",
              }}
            >
              <div className="text-4xl mb-2">🏫</div>
              <div className="text-white font-semibold text-sm">
                Baljagriti Secondary English Boarding School
              </div>
              <div className="text-xs mt-1" style={{ color: colors.green }}>
                Hetauda, Makwanpur
              </div>
            </div>

            <div
              className="absolute -top-6 -left-6 px-5 py-4 rounded-2xl"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(241,236,255,0.86))",
                boxShadow:
                  "0 18px 48px rgba(11,16,32,0.16), 0 0 0 1px rgba(255,255,255,0.6)",
                border: "1px solid rgba(75,46,131,0.16)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(22,138,58,0.12)",
                    border: "1px solid rgba(22,138,58,0.22)",
                  }}
                >
                  <Award className="w-5 h-5" style={{ color: colors.green }} />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: colors.dark }}
                  >
                    PG to Grade 10
                  </div>
                  <div className="text-xs" style={{ color: "#64748b" }}>
                    Co-educational day school
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
              {pillars.map((p, index) => {
                const Icon = p.icon;
                const cardColor =
                  index === 0
                    ? colors.red
                    : index === 1
                    ? colors.green
                    : colors.purple;

                return (
                  <div
                    key={p.label}
                    className="flex gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.72))",
                      border: `1px solid ${cardColor}22`,
                      boxShadow: "0 16px 42px rgba(11,16,32,0.08)",
                      backdropFilter: "blur(14px)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${cardColor}14`,
                        border: `1px solid ${cardColor}24`,
                        boxShadow: `0 10px 24px ${cardColor}18`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: cardColor }} />
                    </div>

                    <div>
                      <div
                        className="font-semibold mb-1"
                        style={{ color: colors.dark }}
                      >
                        {p.label}
                      </div>
                      <div className="text-sm" style={{ color: "#64748b" }}>
                        {p.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {highlights.map((h) => (
                <div key={h} className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: colors.green }}
                  />
                  <span className="text-sm" style={{ color: "#475569" }}>
                    {h}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                to="/facilities"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.red}, ${colors.green})`,
                  boxShadow: "0 16px 38px rgba(215,25,32,0.25)",
                }}
              >
                Explore Our Facilities →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}