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
    classes: ["Nursery", "LKG", "UKG"],
    highlight: "Early childhood development focused on social, emotional, and cognitive learning."
  },
  {
    level: "Primary Level",
    span: "Grade 1 – 5",
    bgGradient: "linear-gradient(135deg, rgba(22,138,58,0.04), rgba(215,25,32,0.03))",
    border: "rgba(22,138,58,0.15)",
    badgeColor: colors.green,
    classes: ["English", "Nepali", "Mathematics", "Science", "Social Studies"],
    highlight: "Building deep core foundational understanding with regular continuous assessment."
  },
  {
    level: "Lower Secondary Level",
    span: "Grade 6 – 8",
    bgGradient: "linear-gradient(135deg, rgba(75,46,131,0.04), rgba(124,92,196,0.03))",
    border: "rgba(75,46,131,0.15)",
    badgeColor: colors.purple,
    classes: ["Science", "Computer", "Mathematics", "EPH", "Social Studies"],
    highlight: "Transitioning into systematic academic paradigms, critical logic, and digital assets."
  },
  {
    level: "Secondary Level",
    span: "Grade 9 – 10",
    bgGradient: "linear-gradient(135deg, rgba(11,16,32,0.04), rgba(215,25,32,0.03))",
    border: "rgba(11,16,32,0.12)",
    badgeColor: colors.dark,
    classes: ["SEE Preparation", "Computer Education", "Science Lab Focus", "Career Guidance"],
    highlight: "Rigorous academic performance pipelines optimizing for exceptional SEE results."
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
      style={{ background: `linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)` }}
    >
      {/* Background Ornaments */}
      <div
        className="absolute top-20 left-0 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(215,25,32,0.08), transparent 70%)",
          filter: "blur(12px)",
        }}
      />
      <div
        className="absolute bottom-1/3 right-0 w-[520px] h-[520px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(22,138,58,0.08), transparent 70%)",
          filter: "blur(12px)",
        }}
      />

      {/* ==================== 1. ACADEMIC HERO SECTION ==================== */}
      <section className="pt-40 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-6"
            >
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(215,25,32,0.08)",
                  color: colors.red,
                  border: "1px solid rgba(215,25,32,0.16)",
                }}
              >
                Nurturing Excellence
              </span>
              <h1 
                className="text-5xl md:text-6xl font-extrabold tracking-tight"
                style={{ fontFamily: "var(--font-display)", color: colors.dark }}
              >
                Academics at <span style={{ color: colors.red }}>Baljagriti</span>
              </h1>
              <p className="text-xl leading-relaxed text-slate-600 max-w-2xl">
                Comprehensive education from Play Group to Grade 10 under the national NEB Curriculum. 
                We combine intellectual discipline with structural practical insights.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: colors.green }} />
                  <span className="text-sm font-medium text-slate-700">Students: <strong className="font-bold text-base">3800+</strong></span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: colors.purple }} />
                  <span className="text-sm font-medium text-slate-700">Teachers: <strong className="font-bold text-base">240+</strong></span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-5 justify-center"
            >
              <div 
                className="p-6 rounded-3xl flex items-center gap-5 bg-white shadow-xl transition-all duration-300 hover:scale-102"
                style={{ borderLeft: `6px solid ${colors.green}` }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-3xl" style={{ backgroundColor: colors.green }}>🏆</div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">SEE GPA 4.0</h4>
                  <p className="text-sm text-slate-500">Highest Tier Achievement Badge</p>
                </div>
              </div>

              <div 
                className="p-6 rounded-3xl flex items-center gap-5 bg-white shadow-xl transition-all duration-300 hover:scale-102"
                style={{ borderLeft: `6px solid ${colors.purple}` }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-3xl" style={{ backgroundColor: colors.purple }}>🌟</div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">Academic Excellence</h4>
                  <p className="text-sm text-slate-500">Certified Quality Framework Badge</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== 2. ACADEMIC PROGRAMS ==================== */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: colors.dark }}>
              Our Academic Programs
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Structured progressive development stages carefully fine-tuned to align with natural cognitive growth frameworks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((prog, i) => (
              <motion.div
                key={prog.level}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-white shadow-md border flex flex-col justify-between group transition-all duration-300 hover:shadow-xl"
                style={{ borderColor: prog.border }}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white mb-4 inline-block" style={{ backgroundColor: prog.badgeColor }}>
                    {prog.span}
                  </span>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-green-700 transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                    {prog.level}
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">{prog.highlight}</p>
                  
                  <div className="space-y-2.5 border-t pt-4 border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wide">Core Structure:</span>
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
                className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex gap-4 items-start transition-all duration-300 hover:shadow-md"
              >
                <div className="text-3xl p-3 bg-slate-50 rounded-xl">{feat.emoji}</div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1" style={{ fontFamily: "var(--font-display)" }}>{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. ACADEMIC STATISTICS ==================== */}
      <section className="py-16 relative z-10" style={{ backgroundColor: colors.dark }}>
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
                  className="space-y-2 flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                    <IconComponent className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400 font-medium tracking-wide uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 5. TEACHING METHODOLOGY ==================== */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Side: Illustration / Visual Representation Block */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative"
            >
              <div 
                className="absolute inset-0 rounded-3xl transform rotate-3 scale-102 opacity-20"
                style={{ background: `linear-gradient(135deg, ${colors.red}, ${colors.purple})` }}
              />
              <div className="relative bg-gradient-to-br from-slate-900 to-indigo-950 p-10 rounded-3xl text-white shadow-2xl space-y-6 overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-xl" />
                <span className="text-xs uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">
                  Operational Philosophy
                </span>
                <h3 className="text-3xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  How We Drive Cognitive Growth
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Our conceptual design shifts focus away from rigid static learning structures toward experiential, continuous discovery parameters.
                </p>
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Continuous diagnostic testing loops
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Interactive laboratory applications
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Content Framework */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-6"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: "rgba(75,46,131,0.1)", color: colors.purple }}>
                  Our Approach
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3 text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                  Teaching Methodology
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {methodologies.map((method) => (
                  <div key={method.label} className="p-4 rounded-xl bg-white/70 border border-slate-100 shadow-sm space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.green }} />
                      {method.label}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{method.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== 6. ACADEMIC FACILITIES ==================== */}
      <section className="py-20 relative z-10 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{
                background: "rgba(22,138,58,0.1)",
                color: colors.green,
                border: "1px solid rgba(22,138,58,0.24)",
              }}
            >
              Facilities
            </span>

            <h2 className="text-4xl md:text-5xl mb-5 font-bold" style={{ fontFamily: "var(--font-display)", color: colors.dark }}>
              Learning Beyond <span className="italic" style={{ color: colors.red }}>Classrooms</span>
            </h2>

            <p className="max-w-2xl mx-auto text-lg text-slate-600">
              Baljagriti provides academic, digital, practical, creative, and sports facilities that support students in learning with confidence, curiosity, and discipline.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-white"
                style={{
                  border: `1px solid ${item.border}`,
                  boxShadow: "0 18px 46px rgba(11,16,32,0.04)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, ${item.color}, ${colors.green})` }}
                />

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                  }}
                >
                  {item.emoji}
                </div>

                <div className="text-xs font-semibold mb-1 px-2 py-0.5 rounded-full inline-block" style={{ background: item.bg, color: item.color }}>
                  {item.label}
                </div>

                <h3 className="mt-2 mb-2 text-lg font-bold text-slate-950" style={{ fontFamily: "var(--font-display)" }}>
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed mb-4 text-slate-500">
                  {item.desc}
                </p>

                <div className="flex items-center gap-1 text-sm font-medium transition-all duration-200 group-hover:gap-2" style={{ color: item.color }}>
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}

            {/* Injected CTA inside items array */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: facilities.length * 0.05 }}
              className="p-6 rounded-3xl flex flex-col items-center justify-center text-center min-h-[200px]"
              style={{
                background: `linear-gradient(135deg, ${colors.dark}, ${colors.purple})`,
                boxShadow: "0 24px 64px rgba(11,16,32,0.2)",
              }}
            >
              <div className="text-4xl mb-3">🌟</div>
              <div className="text-white font-semibold mb-2 text-lg" style={{ fontFamily: "var(--font-display)" }}>
                Join Baljagriti
              </div>
              <p className="text-xs mb-4 text-slate-300 max-w-[200px]">
                Quality education with supportive modern institutional assets
              </p>
              <Link
                to="/admissions"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${colors.red}, ${colors.green})`,
                }}
              >
                Admission Details
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== 7. EXAMINATION SYSTEM ==================== */}
      <section className="py-20 relative z-10">
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
                  className="flex gap-4 relative z-10 bg-white/60 p-4 rounded-2xl border border-slate-100 shadow-sm"
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

      {/* ==================== 8. SEE ACHIEVEMENT BANNER ==================== */}
      <section className="py-4 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl text-white text-center relative overflow-hidden shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.red} 50%, ${colors.dark} 100%)`
            }}
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                District Distinction Framework
              </span>
              <h2 className="text-3xl md:text-5xl font-black" style={{ fontFamily: "var(--font-display)" }}>
                🏆 SEE GPA 4.0 – Best Results Under NEB
              </h2>
              <p className="text-base md:text-lg text-slate-200 font-light leading-relaxed">
                "Our students consistently rank among the top performers in the district, pulling record-tier analytics year after year."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== 9. ADMISSION CTA ==================== */}
      <section className="py-24 text-center relative z-10">
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
              className="px-8 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg w-full sm:w-auto"
              style={{
                background: `linear-gradient(135deg, ${colors.green}, ${colors.purple})`,
                boxShadow: "0 12px 32px rgba(22,138,58,0.2)"
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