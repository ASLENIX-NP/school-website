import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Award, GraduationCap, Users, Milestone, Calendar } from "lucide-react";

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

  const programs = [
    {
      level: "Pre-Primary Level",
      span: "Nursery – KG",
      bgGradient: "linear-gradient(135deg, rgba(215,25,32,0.04), rgba(75,46,131,0.03))",
      border: "rgba(215,25,32,0.15)",
      badgeColor: colors.red,
      classes: [
        "English Readiness",
        "Nepali Readiness",
        "Numbers & Counting",
        "Creative Activities",
        "Rhymes & Storytelling"
      ],
      highlight:
        "Early childhood development focused on social, emotional, and cognitive learning."
    },
  
    {
      level: "Primary Level",
      span: "Grade 1 – 5",
      bgGradient: "linear-gradient(135deg, rgba(22,138,58,0.04), rgba(215,25,32,0.03))",
      border: "rgba(22,138,58,0.15)",
      badgeColor: colors.green,
      classes: [
        "English",
        "Nepali",
        "Mathematics",
        "Science",
        "Social Studies"
      ],
      highlight:
        "Building deep core foundational understanding with regular continuous assessment."
    },
  
    {
      level: "Lower Secondary Level",
      span: "Grade 6 – 8",
      bgGradient: "linear-gradient(135deg, rgba(75,46,131,0.04), rgba(124,92,196,0.03))",
      border: "rgba(75,46,131,0.15)",
      badgeColor: colors.purple,
      classes: [
        "English",
        "Nepali",
        "Mathematics",
        "Science",
        "Computer Science",
        "Social Studies"
      ],
      highlight:
        "Transitioning into systematic academic paradigms, critical logic, and digital assets."
    },
  
    {
      level: "Secondary Level",
      span: "Grade 9 – 10",
      bgGradient: "linear-gradient(135deg, rgba(11,16,32,0.04), rgba(215,25,32,0.03))",
      border: "rgba(11,16,32,0.12)",
      badgeColor: colors.dark,
      classes: [
        "English",
        "Nepali",
        "Mathematics",
        "Science",
        "Computer Science",
        "Optional Mathematics"
      ],
      highlight:
        "Rigorous academic performance pipelines optimizing for exceptional SEE results."
    }
  ];

const features = [
  { emoji: "📚", title: "NEB Curriculum", desc: "Rigorous alignment with National Education Board standards for universal academic mobility." },
  { emoji: "💻", title: "Smart Classrooms", desc: "Equipped with specialized digital projection frameworks and interactive learning resources." },
  { emoji: "🔬", title: "Science Laboratory", desc: "Practical hands-on exploration layouts helping convert theoretical principles into insight." },
  { emoji: "🖥", title: "Computer Lab", desc: "Individual system layouts ensuring modern digital literacy and localized computer education." },
  { emoji: "👩‍🏫", title: "Qualified Teachers", desc: "Educators committed to personalized guidance, interactive methods, and high safety standards." },
  { emoji: "🏆", title: "Excellent SEE Results", desc: "A definitive history of high-tier performance, distinctions, and absolute GPA 4.0 targets." }
];

const stats = [
  { value: "3800+", label: "Active Students", icon: Users, color: colors.purple },
  { value: "240+", label: "Expert Teachers", icon: GraduationCap, color: colors.green },
  { value: "35+", label: "Years Experience", icon: Milestone, color: colors.red },
  { value: "98%", label: "SEE Pass Rate", icon: Award, color: colors.softPurple }
];

const methodologies = [
  { label: "Project Based Learning", desc: "Collaborative research tasks that tie complex academic modules to physical outcomes." },
  { label: "Activity Based Learning", desc: "Eliminating dry memorization via interactive simulations, spatial puzzles, and peer models." },
  { label: "Digital Learning", desc: "Integrating presentation tooling, electronic resources, and modern visual references." },
  { label: "Field Visits", desc: "Expanding educational exploration out into civic environments, environmental landscapes, and factories." },
  { label: "Group Discussions", desc: "Encouraging verbal expression, analytical discourse, and open peer perspective checks." },
  { label: "Practical Education", desc: "Ensuring that conceptual theories are verified through laboratory tests and functional exercises." }
];

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

const timelineTerms = [
  { term: "First Terminal", timeframe: "Early Academic Session Evaluation" },
  { term: "Second Terminal", timeframe: "Mid-Session Progress Verification" },
  { term: "Third Terminal", timeframe: "Pre-Final Competency Benchmarking" },
  { term: "Final Examination", timeframe: "Comprehensive Session End Grading" }
];

const ongoingAssessments = ["Monthly Tests", "Unit Tests", "Assignments", "Practical Assessment"];

export function Academics() {
  return (
<div
  className="min-h-screen relative overflow-hidden"
  
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
    background:
      "radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)",
    filter: "blur(8px)",
  }}
/>

<div
  className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none"
  style={{
    background:
      "radial-gradient(circle, rgba(22,138,58,0.11), transparent 70%)",
    filter: "blur(8px)",
  }}
/>
     
      {/* ==================== 1. ACADEMIC HERO SECTION ==================== */}
      <section className="pt-36 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="space-y-8"
  >
    <span
      className="inline-block px-5 py-2 rounded-full text-sm font-semibold"
      style={{
        background: "rgba(215,25,32,0.08)",
        color: colors.red,
        border: "1px solid rgba(215,25,32,0.16)",
      }}
    >
      Nurturing Excellence
    </span>

    <h1
      className="text-5xl md:text-7xl font-extrabold tracking-tight"
      style={{
        fontFamily: "var(--font-display)",
        color: colors.dark,
      }}
    >
      Academics at{" "}
      <span style={{ color: colors.red }}>
        Baljagriti
      </span>
    </h1>

    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 max-w-3xl mx-auto">
      Comprehensive education from Play Group to Grade 10 under the
      National NEB Curriculum. We combine academic excellence,
      practical learning, critical thinking, and character development
      to prepare students for lifelong success.
    </p>
  </motion.div>
</div>
      </section>

      {/* ==================== 2. ACADEMIC PROGRAMS ==================== */}
      <section className="pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
        <div className="mb-6"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((prog, i) => (
           <motion.div
           key={prog.level}
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5, delay: i * 0.1 }}
           className="
             p-6
             rounded-3xl
             border
             flex
             flex-col
             justify-between
             group
             relative
             overflow-hidden
             transition-all
             duration-500
             hover:-translate-y-4
             hover:scale-[1.03]
             hover:shadow-[0_35px_80px_rgba(0,0,0,0.15)]
           "
           style={{
             borderColor: prog.border,
             background: `
             linear-gradient(
             145deg,
             rgba(255,255,255,0.98),
             rgba(248,250,252,0.88)
             )
             `,
             boxShadow: `
             0 20px 40px rgba(0,0,0,0.08)
             `,
             backdropFilter: "blur(18px)",
           }}
         >
          <div
  className="
    absolute
    top-0
    right-0
    w-40
    h-40
    rounded-full
    opacity-0
    group-hover:opacity-100
    transition-all
    duration-700
  "
  style={{
    background: `${prog.badgeColor}15`,
    filter: "blur(60px)",
  }}
/>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white mb-4 inline-block" style={{ backgroundColor: prog.badgeColor }}>
                    {prog.span}
                  </span>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-green-700 transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                    {prog.level}
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">{prog.highlight}</p>
                  
                  <div className="space-y-2.5 border-t pt-4 border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wide">
  Course Structure:
</span>
                    {prog.classes.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: prog.badgeColor }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 3. WHY CHOOSE OUR ACADEMICS ==================== */}
      <section className="py-20 bg-white/60 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: colors.dark }}>
              Why Choose Our Academics?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We focus on building balanced learning spaces through precise methodologies, institutional depth, and proven outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
              key={feat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -10 }}
              className="
              relative
              overflow-hidden
              p-7
              rounded-[28px]
              backdrop-blur-xl
              border
              transition-all
              duration-500
              shadow-lg
              "
              style={{
                background: `
                  linear-gradient(
                    135deg,
                    rgba(255,255,255,0.95),
                    rgba(255,255,255,0.82)
                  )
                `,
                borderColor: `${feat.color}30`,
              }}
            >
              <div
  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
  style={{
    background: feat.color,
    filter: "blur(60px)",
  }}
/>
<motion.div
whileHover={{
  rotate: 10,
  scale: 1.15,
}}
className="
w-16
h-16
rounded-2xl
flex
items-center
justify-center
text-3xl
mb-5
shadow-md
"
style={{
  background: feat.bg,
  color: feat.color,
}}
>
  {feat.emoji}
</motion.div>
                <div>
                <h3
className="
font-bold
text-xl
mb-3
group-hover:translate-x-1
transition-all
duration-300
"
style={{
  color: feat.color,
}}
>{feat.title}</h3>
<p className="text-sm leading-7 text-slate-600">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. ACADEMIC STATISTICS ==================== */}
      <section
  className="py-20 relative z-10"
  style={{
    background:
      "linear-gradient(180deg,#FFF8EE 0%,#F7F3FF 100%)",
  }}
>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => {
  const IconComponent = stat.icon;
  return (
    <motion.div
      key={stat.label}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      className="
      group
      relative
      overflow-hidden
      p-8
      rounded-[32px]
      backdrop-blur-xl
      transition-all
      duration-500
      hover:-translate-y-3
      hover:scale-[1.03]
      "
      style={{
        background:
          stat.label === "Active Students"
            ? "linear-gradient(135deg,#F1ECFF,#FFFFFF)"
            : stat.label === "Expert Teachers"
            ? "linear-gradient(135deg,#EAF7EF,#FFFFFF)"
            : stat.label === "Years Experience"
            ? "linear-gradient(135deg,#FFF1F2,#FFFFFF)"
            : "linear-gradient(135deg,#EEF8FF,#FFFFFF)",

        border: `1px solid ${stat.color}25`,
        boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
      }}
    >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                    <IconComponent className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div
  className="text-4xl md:text-5xl font-black"
  style={{
    color: stat.color,
    fontFamily: "var(--font-display)",
  }}
>
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 font-semibold tracking-wide uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ==================== 7. EXAMINATION SYSTEM ==================== */}
      <section className="pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: colors.dark }}>
              Our Examination System
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              A comprehensive grading matrix consisting of critical terminal points combined with ongoing continuous assessment frameworks.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Timeline terms */}
            <div className="lg:col-span-7 space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
              {timelineTerms.map((t, index) => (
                <motion.div 
                  key={t.term}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="
                  group
                  flex
                  gap-4
                  relative
                  z-10
                  bg-white/80
                  backdrop-blur-xl
                  p-5
                  rounded-3xl
                  border
                  transition-all
                  duration-500
                  hover:-translate-x-2
                  hover:shadow-xl
                  "
                >
                  <div className="w-4 h-4 rounded-full bg-white border-4 border-indigo-600 shrink-0 mt-1.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{t.term}</h4>
                    <p className="text-xs text-slate-500">{t.timeframe}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column: Continuous systems */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-lg text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Continuous Formative Evaluation</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                To prevent high-pressure examination variance, parameters are systematically logged week-over-week via the following modules:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ongoingAssessments.map((item) => (
                  <div key={item} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center font-medium text-slate-700 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 9. ADMISSION CTA ==================== */}
      <section className="pt-10 pb-24 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            Ready to Join Baljagriti?
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-base">
            Secure a placement in our upcoming academic track. Contact our admissions pipeline or drop by the main campus hub directly.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/apply"
             className="px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:scale-105 shadow-lg w-full sm:w-auto"
              style={{
                background:
                  "linear-gradient(135deg, #FACC15 0%, #A7F3D0 100%)",
                color: "#111827",
                boxShadow: "0 8px 20px rgba(250,204,21,0.18)"
              }}
              >
              Apply Now
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 rounded-xl text-base font-bold text-slate-800 bg-white border border-slate-200 transition-all duration-300 hover:bg-slate-50 w-full sm:w-auto shadow-sm"
            >
              Contact Administration
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}