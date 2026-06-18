import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { X } from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultFacilitiesContent = {
  badgeText: "School Facilities",
  title: "Learning Beyond Classrooms",
  highlightedText: "Classrooms",
  subtitle:
    "Baljagriti provides modern facilities that create an engaging, practical, and technology-driven learning environment for every student.",
  learnMoreText: "Learn More",
  highlightsTitle: "Facility Highlights",
  facilities: [
    {
      id: 1,
      emoji: "📚",
      title: "E-Library",
      category: "Digital Learning",
      description:
        "Access thousands of digital books, journals, educational resources and online learning platforms.",
      details:
        "Students can access e-books, research journals, academic databases, digital resources, and online learning platforms from school.",
      imageUrl: "",
      color: colors.red,
      visible: true,
    },
    {
      id: 2,
      emoji: "💻",
      title: "Computer Lab",
      category: "Technology",
      description:
        "Modern computer laboratory equipped with internet access and updated software for practical learning.",
      details:
        "40+ modern computers with internet access, programming tools, office applications, and multimedia software.",
      imageUrl: "",
      color: colors.purple,
      visible: true,
    },
    {
      id: 3,
      emoji: "🔬",
      title: "Science Laboratory",
      category: "Practical Education",
      description:
        "Physics, Chemistry and Biology practical experiments with modern laboratory equipment and safety measures.",
      details:
        "Fully equipped separate labs for Physics, Chemistry, and Biology, providing hands-on experimental learning and top-tier safety gear.",
      imageUrl: "",
      color: colors.green,
      visible: true,
    },
    {
      id: 4,
      emoji: "🚌",
      title: "Bus Facility",
      category: "Transportation",
      description:
        "Safe and reliable transportation service covering multiple routes.",
      details:
        "Baljagriti provides safe transportation with experienced drivers, route management, student safety monitoring, and comfortable buses for daily travel.",
      imageUrl: "",
      color: "#F59E0B",
      visible: true,
    },
    {
      id: 5,
      emoji: "🎭",
      title: "Auditorium",
      category: "Events & Activities",
      description:
        "Spacious auditorium for seminars, cultural events, presentations, and school programs.",
      details:
        "A state-of-the-art auditorium with advanced audio-visual technology, comfortable seating, and staging for hosting all major school events and presentations.",
      imageUrl: "",
      color: colors.red,
      visible: true,
    },
    {
      id: 6,
      emoji: "⚽",
      title: "Sports Ground",
      category: "Physical Development",
      description:
        "Indoor and outdoor sports facilities encouraging fitness, teamwork, and healthy competition.",
      details:
        "Expansive playgrounds and courts facilitating football, basketball, cricket, and various indoor games under expert physical guidance.",
      imageUrl: "",
      color: colors.green,
      visible: true,
    },
  ],
};

function mergeFacilitiesContent(saved = {}) {
  return {
    ...defaultFacilitiesContent,
    ...saved,
    facilities: Array.isArray(saved.facilities)
      ? saved.facilities
      : defaultFacilitiesContent.facilities,
  };
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) {
    return <>{title}</>;
  }

  const [before, after] = title.split(highlightedText);

  return (
    <>
      {before}
      <span style={{ color: colors.red }}>{highlightedText}</span>
      {after}
    </>
  );
}

function FacilityVisual({ facility, className = "" }) {
  const facilityColor = facility.color || colors.green;

  if (facility.imageUrl) {
    return (
      <img
        src={facility.imageUrl}
        alt={facility.title}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{
        background: `
          radial-gradient(circle at top right, ${facilityColor}24, transparent 36%),
          linear-gradient(145deg, rgba(11,16,32,0.96), rgba(75,46,131,0.9))
        `,
      }}
    >
      <div className="text-center px-8">
        <div
          className="w-20 h-1 rounded-full mx-auto mb-5"
          style={{
            background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
          }}
        />

        <div
          className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
          style={{ color: "rgba(255,255,255,0.58)" }}
        >
          {facility.category}
        </div>

        <div
          className="text-3xl font-black text-white leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.045em",
          }}
        >
          {facility.title}
        </div>
      </div>
    </div>
  );
}

export default function Facilities() {
  const [content, setContent] = useState(defaultFacilitiesContent);
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    const loadFacilitiesContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/facilities"
        );

        const savedContent = res.data?.data?.content || {};
        setContent(mergeFacilitiesContent(savedContent));
      } catch (error) {
        console.error("Facilities content load error:", error);
        setContent(defaultFacilitiesContent);
      }
    };

    loadFacilitiesContent();
  }, []);

  const visibleFacilities = content.facilities.filter(
    (facility) => facility.visible !== false
  );

  return (
    <div
      className="min-h-screen pt-32 pb-24 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(75,46,131,0.12), transparent 34%),
          radial-gradient(circle at bottom right, rgba(22,138,58,0.10), transparent 34%),
          linear-gradient(180deg,#FFF8EE 0%,#F8FAFC 100%)
        `,
      }}
    >
      <div className="absolute top-20 left-8 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-green-500/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-20"
        >
          <span
            className="px-5 py-2 rounded-full text-sm font-bold inline-flex items-center"
            style={{
              background: "rgba(22,138,58,0.08)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.18)",
            }}
          >
            {content.badgeText}
          </span>

          <h1
            className="text-5xl md:text-7xl mt-6 text-slate-950 leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              letterSpacing: "-0.055em",
            }}
          >
            <HighlightedTitle
              title={content.title}
              highlightedText={content.highlightedText}
            />
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleFacilities.map((facility, index) => {
            const facilityColor = facility.color || colors.green;

            return (
              <motion.div
                key={facility.id || facility.title}
                onClick={() => setSelectedFacility(facility)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="group rounded-[2rem] overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(255,255,255,0.82))",
                  border: `1px solid ${facilityColor}24`,
                  boxShadow:
                    "0 22px 54px rgba(15,23,42,0.09), inset 0 1px 0 rgba(255,255,255,0.82)",
                  backdropFilter: "blur(16px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = `0 30px 72px rgba(15,23,42,0.16), 0 0 0 1px ${facilityColor}22`;
                  e.currentTarget.style.borderColor = `${facilityColor}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 22px 54px rgba(15,23,42,0.09), inset 0 1px 0 rgba(255,255,255,0.82)";
                  e.currentTarget.style.borderColor = `${facilityColor}24`;
                }}
              >
                <div className="h-56 relative overflow-hidden">
                  <FacilityVisual
                    facility={facility}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                  <div
                    className="absolute bottom-5 left-5 right-5"
                  >
                    <div
                      className="w-16 h-1 rounded-full mb-4 transition-all duration-300 group-hover:w-28"
                      style={{
                        background: facilityColor,
                      }}
                    />

                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        color: facilityColor,
                        border: `1px solid ${facilityColor}22`,
                      }}
                    >
                      {facility.category}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3
                    className="text-3xl font-black text-slate-950 leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {facility.title}
                  </h3>

                  <p className="mt-4 text-slate-600 leading-relaxed">
                    {facility.description}
                  </p>

                  <div
                    className="mt-6 inline-flex items-center font-bold transition-all duration-300 group-hover:tracking-wide"
                    style={{ color: facilityColor }}
                  >
                    {content.learnMoreText}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {selectedFacility && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          style={{
            background: "rgba(0,0,0,0.48)",
            backdropFilter: "blur(12px)",
          }}
          onClick={() => setSelectedFacility(null)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{
              opacity: 0,
              scale: 0.86,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 16,
            }}
            className="relative max-w-3xl w-full overflow-hidden rounded-[32px]"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))",
              boxShadow:
                "0 60px 120px rgba(0,0,0,0.28), 0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at top right,
                  ${selectedFacility.color || colors.green}24,
                  transparent 40%)
                `,
              }}
            />

            <button
              type="button"
              onClick={() => setSelectedFacility(null)}
              className="absolute top-5 right-5 z-[99999] w-12 h-12 rounded-full bg-white shadow-2xl cursor-pointer font-bold hover:bg-red-500 hover:text-white hover:rotate-180 hover:scale-110 transition-all duration-500 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-[300px_1fr] relative z-10">
              <div className="h-72 md:h-full min-h-[360px] relative overflow-hidden">
                <FacilityVisual facility={selectedFacility} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              </div>

              <div className="p-8 md:p-10">
                <div
                  className="w-20 h-1 rounded-full mb-6"
                  style={{
                    background: selectedFacility.color || colors.green,
                  }}
                />

                <span
                  className="px-4 py-2 rounded-full text-sm font-bold"
                  style={{
                    background: `${selectedFacility.color || colors.green}12`,
                    color: selectedFacility.color || colors.green,
                    border: `1px solid ${
                      selectedFacility.color || colors.green
                    }22`,
                  }}
                >
                  {selectedFacility.category}
                </span>

                <h2
                  className="text-4xl md:text-5xl font-black mt-5 text-slate-950 leading-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.055em",
                  }}
                >
                  {selectedFacility.title}
                </h2>

                <p className="mt-5 text-lg text-slate-600 leading-relaxed">
                  {selectedFacility.description}
                </p>

                <div
                  className="mt-8 p-5 rounded-2xl"
                  style={{
                    background: `${selectedFacility.color || colors.green}08`,
                    border: `1px solid ${
                      selectedFacility.color || colors.green
                    }20`,
                  }}
                >
                  <h4 className="font-bold text-slate-950 mb-3">
                    {content.highlightsTitle}
                  </h4>

                  <p className="text-slate-600 leading-relaxed">
                    {selectedFacility.details}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}