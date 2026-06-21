import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Image as ImageIcon, UserRound, Quote, Sparkles } from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
  lightGreen: "#EAF7EF",
  lightPurple: "#F1ECFF",
  gold: "#FACC15",
  cyan: "#38BDF8",
  orange: "#F97316",
  pink: "#EC4899",
  indigo: "#6366F1",
  teal: "#14B8A6",
};

const defaultAboutContent = {
  pageTitle: "About Us",
  pageSubtitle:
    "Learn about Baljagriti Secondary English School, our values, and our commitment to quality education.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&h=500&fit=crop&auto=format",
  heroImageAlt: "Students in classroom with teacher",
  floatingCardEmoji: "🏫",
  floatingCardTitle: "Baljagriti Secondary English School",
  floatingCardSubtitle: "Hetauda, Makwanpur",
  topCardTitle: "PG to Grade 10",
  topCardSubtitle: "Co-educational day school",
  pillars: [
    {
      id: 1,
      icon: "award",
      label: "Academic Excellence",
      desc: "Focused classroom learning that helps students build a strong academic foundation from early years to Grade 10.",
      color: "#D71920",
      visible: true,
    },
    {
      id: 2,
      icon: "heart",
      label: "Holistic Development",
      desc: "A nurturing and child-friendly environment where students grow academically, personally, socially, and morally.",
      color: "#168A3A",
      visible: true,
    },
    {
      id: 3,
      icon: "lightbulb",
      label: "Creative & Practical Learning",
      desc: "Extra-curricular activities, competitions, sports, arts, and school programs help students explore their talents.",
      color: "#4B2E83",
      visible: true,
    },
  ],
  highlights: [
    "Play Group to Grade 10",
    "Co-educational day school",
    "Located in Hetauda-2, Makwanpur",
    "Child-friendly learning environment",
    "Focus on academic and moral foundation",
    "ECA, sports, arts, and competitions",
  ],
  storyBadge: "Our Story",
  storyTitle: "Building Tomorrow's Leaders Today",
  storyParagraphs: [
    "Baljagriti Secondary English School, located in the heart of Makwanpur, Nepal, has been a beacon of quality education for many years. What began as a small school with a strong vision has grown into a thriving institution serving students from Play Group to Grade 10.",
    "We take pride in our dedicated team of experienced educators who work tirelessly to ensure every child receives the attention, guidance, and learning environment they need to grow academically and personally.",
  ],
  storyImageUrl:
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&h=700&fit=crop&auto=format",
  storyImageAlt: "School campus",
  storyImageTitle: "School Campus",
  storyImageSubtitle: "Image can later be managed from admin dashboard",
  missionVision: [
    {
      id: 1,
      icon: "target",
      title: "Our Mission",
      desc: "To provide a safe, nurturing, and academically rigorous learning environment that empowers students to become confident, creative, and responsible citizens equipped for the challenges of the modern world.",
      color: "#4B2E83",
      visible: true,
    },
    {
      id: 2,
      icon: "eye",
      title: "Our Vision",
      desc: "To be a leading educational institution in Makwanpur, recognized for academic excellence, holistic development, and producing leaders who contribute positively to society and the nation.",
      color: "#168A3A",
      visible: true,
    },
  ],
  journeyTitle: "Our Journey",
  journey: [
    {
      id: 1,
      year: "2046 BS",
      title: "School Founded",
      desc: "Baljagriti Secondary English School was established in Makwanpur with a vision to provide quality English-medium education.",
      visible: true,
    },
    {
      id: 2,
      year: "Secondary Level",
      title: "Expanded to Grade 10",
      desc: "The school expanded its academic structure to support students from early learning levels up to Grade 10.",
      visible: true,
    },
    {
      id: 3,
      year: "Academic Growth",
      title: "Strong SEE Foundation",
      desc: "Students continued building strong academic results through focused classroom teaching, discipline, and guided learning.",
      visible: true,
    },
    {
      id: 4,
      year: "Today",
      title: "Growing Learning Community",
      desc: "The school community continues to grow with dedicated educators, modern facilities, and a focus on holistic student development.",
      visible: true,
      
      storyImageSubtitle: "Image can later be managed from admin dashboard",
      messages: [
        {
          id: 1,
          name: "Principal",
          role: "Principal",
          title: "Principal's Message",
          message:
            "Welcome to Baljagriti Secondary English School.",
          image: "",
          visible: true,
        },
        {
          id: 2,
          name: "Vice Principal",
          role: "Vice Principal",
          title: "Vice Principal's Message",
          message:
            "Our team works tirelessly to provide a safe environment.",
          image: "",
          visible: true,
        },
      ],
    },
  ],
};

function mergeAboutContent(saved = {}) {
  return {
    ...defaultAboutContent,
    ...saved,
    pillars: Array.isArray(saved.pillars)
      ? saved.pillars
      : defaultAboutContent.pillars,
      messages: Array.isArray(saved.messages)
  ? saved.messages
  : defaultAboutContent.messages,
    highlights: Array.isArray(saved.highlights)
      ? saved.highlights
      : defaultAboutContent.highlights,
    storyParagraphs: Array.isArray(saved.storyParagraphs)
      ? saved.storyParagraphs
      : defaultAboutContent.storyParagraphs,
    missionVision: Array.isArray(saved.missionVision)
      ? saved.missionVision
      : defaultAboutContent.missionVision,
    journey: Array.isArray(saved.journey)
      ? saved.journey
      : defaultAboutContent.journey,
  };
}

// ============================================================
// Messages Section Components
// ============================================================

const defaultMessagesContent = {
  badge: "Leadership Messages",
  title: "Messages From Leadership",
  description:
    "Words from school leadership guiding students toward academic excellence, discipline, values, and lifelong learning.",
  people: [
    {
      id: "principal",
      name: "Principal",
      role: "Principal",
      title: "Principal's Message",
      message:
        "Welcome to Baljagriti Secondary English School. We are committed to nurturing every child into a confident, capable, disciplined, and compassionate individual. Our goal is to provide quality education with strong values, creativity, and academic excellence.",
      image: "",
    },
    {
      id: "vice-principal",
      name: "Vice Principal",
      role: "Vice Principal",
      title: "Vice Principal's Message",
      message:
        "Our team works tirelessly to provide a safe, inspiring, and academically rigorous environment for every student. We believe every child deserves care, guidance, and opportunities to grow academically, socially, and personally.",
      image: "",
    },
  ],
};

function mergeMessagesContent(saved = {}) {
  return {
    ...defaultMessagesContent,
    ...saved,
    people:
      Array.isArray(saved.people) && saved.people.length > 0
        ? saved.people.map((person, index) => ({
            id: person.id || `leader-${index}`,
            name: person.name || "",
            role: person.role || "",
            title: person.title || "",
            message: person.message || "",
            image: person.image || "",
          }))
        : defaultMessagesContent.people,
  };
}

function ProfileBox({ person }) {
  return (
    <div
      className="w-full md:w-[280px] flex-shrink-0 flex flex-col items-center justify-center text-center p-8"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,248,238,0.96), rgba(241,236,255,0.8))",
        borderRight: "1px solid rgba(11,16,32,0.08)",
      }}
    >
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden mb-6"
        style={{
          background: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(11,16,32,0.08)",
          boxShadow:
            "0 20px 48px rgba(11,16,32,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {person.image ? (
          <img
            src={person.image}
            alt={person.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <UserRound className="w-12 h-12" style={{ color: "#9CA3AF" }} />
        )}
      </div>

      <h3
        className="text-2xl mb-2"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          color: colors.dark,
          letterSpacing: "-0.025em",
        }}
      >
        {person.name}
      </h3>

      <p className="text-base font-semibold" style={{ color: colors.green }}>
        {person.role}
      </p>
    </div>
  );
}

function MessageCard({ person, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="rounded-3xl overflow-hidden flex flex-col md:flex-row"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
        border: "1px solid rgba(11,16,32,0.08)",
        boxShadow:
          "0 22px 62px rgba(11,16,32,0.08), inset 0 1px 0 rgba(255,255,255,0.85)",
        backdropFilter: "blur(18px)",
      }}
    >
      <ProfileBox person={person} />

      <div className="relative flex-1 p-8 md:p-10 lg:p-12">
        <Quote
          className="absolute right-8 top-8 w-12 h-12 opacity-10"
          style={{ color: colors.purple }}
        />

        <h2
          className="text-3xl md:text-4xl mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 850,
            color: colors.dark,
            letterSpacing: "-0.035em",
          }}
        >
          {person.title}
        </h2>

        <p className="text-lg md:text-xl leading-relaxed text-slate-500 max-w-5xl">
          {person.message}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================
// Main About Component
// ============================================================

function AboutImage({ src, alt }) {
  if (src) {
    return <img src={src} alt={alt} className="w-full h-full object-cover" />;
  }

  return (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <ImageIcon className="w-20 h-20 text-slate-300" />
    </div>
  );
}

export function About() {
  const [content, setContent] = useState(defaultAboutContent);

  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/about"
        );
        const savedContent = res.data?.data?.content || {};
        setContent(mergeAboutContent(savedContent));
      } catch (error) {
        console.error("About content load error:", error);
        setContent(defaultAboutContent);
      }
    };


    loadAboutContent();
  }, []);

  const visiblePillars = content.pillars.filter(
    (item) => item.visible !== false
  );
  const visibleMissionVision = content.missionVision.filter(
    (item) => item.visible !== false
  );
  const visibleJourney = content.journey.filter(
    (item) => item.visible !== false
  );
  const visibleMessages =
  (content.messages || []).filter(
    (item) => item.visible !== false
  );
  const stats = [
    { value: "3800+", label: "Active Students", color: colors.purple },
    { value: "240+", label: "Expert Teachers", color: colors.green },
    { value: "35+", label: "Years Experience", color: colors.red },
    { value: "98%", label: "SEE Pass Rate", color: colors.softPurple },
  ];

  const glanceItems = [
    {
      value: content.topCardTitle || "PG to Grade 10",
      label: content.topCardSubtitle || "Co-educational day school",
      color: colors.gold,
    },
    {
      value: visibleJourney[0]?.year || "2046 BS",
      label: "Established",
      color: colors.cyan,
    },
    {
      value: content.floatingCardSubtitle || "Hetauda, Makwanpur",
      label: "School Location",
      color: colors.green,
    },
    {
      value: "ECA",
      label: "Sports, arts & activities",
      color: colors.purple,
    },
  ];

  return (
    <section
      id="about"
      className="pt-28 pb-28 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.14), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      {/* Decorative Elements */}
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

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-5"
            style={{
              background: "rgba(215,25,32,0.07)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.14)",
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: colors.red }} />
            School Profile
          </div>

          <h1
            className="text-5xl md:text-6xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            {content.pageTitle}
          </h1>

          <div 
            className="w-24 h-1.5 rounded-full mx-auto mb-5" 
            style={{ background: `linear-gradient(90deg, ${colors.red}, ${colors.gold}, ${colors.green})` }} 
          />

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed">
            {content.pageSubtitle}
          </p>
        </motion.div>

        {/* School Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
              style={{
                background: "rgba(75,46,131,0.09)",
                color: colors.purple,
                border: "1px solid rgba(75,46,131,0.18)",
              }}
            >
              {content.storyBadge}
            </span>

            <h2
              className="text-4xl md:text-5xl mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                color: colors.dark,
                lineHeight: 1.1,
                letterSpacing: "-0.045em",
              }}
            >
              {content.storyTitle}
            </h2>

            <div className="space-y-5">
              {content.storyParagraphs.map((text, idx) => (
                <p
                  key={idx}
                  className="text-lg leading-relaxed text-slate-500"
                >
                  {text}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden h-[460px]"
            style={{
              boxShadow: "0 24px 60px rgba(11,16,32,0.15)",
            }}
          >
            <AboutImage
              src={content.storyImageUrl}
              alt={content.storyImageAlt}
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(11,16,32,0.65) 0%, transparent 60%)",
              }}
            />

            <div
              className="absolute bottom-6 left-6 right-6 rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <div
                className="w-16 h-1 rounded-full mb-4"
                style={{
                  background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan})`,
                }}
              />

              <div className="text-white font-bold text-xl">
                {content.storyImageTitle}
              </div>

              <div className="text-white/70 text-sm">
                {content.storyImageSubtitle}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pillars Section - What Makes Us Different */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{
                background: "rgba(22,138,58,0.08)",
                color: colors.green,
                border: "1px solid rgba(22,138,58,0.14)",
              }}
            >
              Our Core Values
            </span>
            <h2
              className="text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                color: colors.dark,
                letterSpacing: "-0.045em",
              }}
            >
              What Makes Us Different
            </h2>
            <div 
              className="w-20 h-1 rounded-full mx-auto mt-4"
              style={{ background: `linear-gradient(90deg, ${colors.red}, ${colors.green}, ${colors.purple})` }}
            />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {visiblePillars.map((p, index) => {
              const cardColor = p.color || colors.green;

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-8 rounded-3xl transition-all duration-300 hover:-translate-y-3 cursor-default"
                  style={{
                    background: `linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.82))`,
                    border: `2px solid ${cardColor}22`,
                    boxShadow: "0 16px 42px rgba(11,16,32,0.08)",
                    backdropFilter: "blur(14px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 24px 56px rgba(11,16,32,0.14), 0 0 0 1px ${cardColor}22`;
                    e.currentTarget.style.borderColor = `${cardColor}55`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 16px 42px rgba(11,16,32,0.08)";
                    e.currentTarget.style.borderColor = `${cardColor}22`;
                  }}
                >
                  <div
                    className="text-3xl font-black tracking-widest mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ color: cardColor }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div
                    className="w-16 h-1 rounded-full mb-5 transition-all duration-300 group-hover:w-28"
                    style={{ background: cardColor }}
                  />

                  <div
                    className="font-bold text-2xl mb-3"
                    style={{ color: colors.dark }}
                  >
                    {p.label}
                  </div>

                  <div className="text-base text-slate-500 leading-relaxed">
                    {p.desc}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Leadership Messages Section */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.16)",
              }}
            >
              <Sparkles className="w-4 h-4" />
              Leadership Messages
            </span>

            <h2
              className="text-4xl md:text-5xl mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                color: colors.dark,
                letterSpacing: "-0.045em",
              }}
            >
              Messages From Leadership
            </h2>

            <p className="max-w-3xl mx-auto text-lg text-slate-500">
            Words from school leadership guiding students toward academic excellence, discipline, values, and lifelong learning.
            </p>
          </motion.div>

          <div className="space-y-10">
           {visibleMessages.map((person, index) => (
  <MessageCard
    key={person.id || index}
    person={person}
    index={index}
  />
))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {visibleMissionVision.map((item, index) => {
            const mvColor = item.color || colors.green;
            const gradientColors = index === 0 
              ? `linear-gradient(135deg, ${colors.purple}15, ${colors.softPurple}08)`
              : `linear-gradient(135deg, ${colors.green}15, ${colors.lightGreen}08)`;
            const borderColors = index === 0 ? colors.purple : colors.green;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: index * 0.1 }}
                className="group rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 cursor-default"
                style={{
                  background: gradientColors,
                  border: `2px solid ${borderColors}22`,
                  boxShadow: "0 18px 48px rgba(11,16,32,0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 24px 56px rgba(11,16,32,0.12), 0 0 0 1px ${borderColors}22`;
                  e.currentTarget.style.borderColor = `${borderColors}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 18px 48px rgba(11,16,32,0.06)";
                  e.currentTarget.style.borderColor = `${borderColors}22`;
                }}
              >
                <div
                  className="text-2xl font-black tracking-widest mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ color: mvColor }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div
                  className="w-20 h-1 rounded-full mb-6 transition-all duration-300 group-hover:w-32"
                  style={{ background: mvColor }}
                />

                <h3
                  className="text-3xl mb-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 850,
                    color: colors.dark,
                    letterSpacing: "-0.035em",
                  }}
                >
                  {item.title}
                </h3>

                <p className="text-base leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Journey Section */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="text-center mb-16"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.14)",
              }}
            >
              Timeline
            </span>
            <h2
              className="text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                color: colors.dark,
                letterSpacing: "-0.045em",
              }}
            >
              {content.journeyTitle}
            </h2>
            <div 
              className="w-20 h-1 rounded-full mx-auto mt-4"
              style={{ background: `linear-gradient(90deg, ${colors.red}, ${colors.orange}, ${colors.gold})` }}
            />
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Timeline line */}
            <div
              className="hidden md:block absolute left-8 top-0 bottom-0 w-1"
              style={{
                background: `linear-gradient(180deg, ${colors.red}, ${colors.gold}, ${colors.green}, ${colors.purple})`,
                borderRadius: "4px",
              }}
            />

            <div className="space-y-8">
              {visibleJourney.map((item, index) => {
                const journeyColors = [
                  colors.red,
                  colors.orange,
                  colors.gold,
                  colors.green,
                ];
                const journeyColor = journeyColors[index % journeyColors.length];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    className="relative md:pl-24"
                  >
                    <div
                      className="hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-full items-center justify-center text-sm font-black text-white"
                      style={{
                        background: `linear-gradient(135deg, ${journeyColor}, ${colors.dark})`,
                        boxShadow: `0 14px 34px ${journeyColor}44`,
                        zIndex: 2,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div
                      className="rounded-3xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: `linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))`,
                        border: `2px solid ${journeyColor}15`,
                        boxShadow: "0 16px 42px rgba(11,16,32,0.06)",
                      }}
                    >
                      <div
                        className="text-sm font-black tracking-widest mb-2"
                        style={{ color: journeyColor }}
                      >
                        {item.year}
                      </div>

                      <h3
                        className="text-2xl mb-2"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 850,
                          color: colors.dark,
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {item.title}
                      </h3>

                      <p className="text-base leading-relaxed text-slate-500">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;