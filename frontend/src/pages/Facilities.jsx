import { useState } from "react";
import { motion } from "framer-motion"; // Note: Changed to "framer-motion" as "motion/react" is atypical, change back if your project explicitly uses it.
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
};

const facilities = [
  {
    emoji: "📚",
    title: "E-Library",
    category: "Digital Learning",
    description: "Access thousands of digital books, journals, educational resources and online learning platforms.",
    details: "Students can access e-books, research journals, academic databases, digital resources, and online learning platforms from school.",
    color: colors.red,
  },
  {
    emoji: "💻",
    title: "Computer Lab",
    category: "Technology",
    description: "Modern computer laboratory equipped with internet access and updated software for practical learning.",
    details: "40+ modern computers with internet access, programming tools, office applications, and multimedia software.",
    color: colors.purple,
  },
  {
    emoji: "🔬",
    title: "Science Laboratory",
    category: "Practical Education",
    description: "Physics, Chemistry and Biology practical experiments with modern laboratory equipment and safety measures.",
    details: "Fully equipped separate labs for Physics, Chemistry, and Biology, providing hands-on experimental learning and top-tier safety gear.",
    color: colors.green,
  },
  {
    emoji: "🚌",
    title: "Bus Facility",
    category: "Transportation",
    description: "Safe and reliable transportation service covering multiple routes.",
    details: "Baljagriti provides safe transportation with experienced drivers, route management, student safety monitoring, and comfortable buses for daily travel.",
    color: "#F59E0B",
  },
  {
    emoji: "🎭",
    title: "Auditorium",
    category: "Events & Activities",
    description: "Spacious auditorium for seminars, cultural events, presentations, and school programs.",
    details: "A state-of-the-art auditorium with advanced audio-visual technology, comfortable seating, and staging for hosting all major school events and presentations.",
    color: colors.red,
  },
  {
    emoji: "⚽",
    title: "Sports Ground",
    category: "Physical Development",
    description: "Indoor and outdoor sports facilities encouraging fitness, teamwork, and healthy competition.",
    details: "Expansive playgrounds and courts facilitating football, basketball, cricket, and various indoor games under expert physical guidance.",
    color: colors.green,
  },
];

export default function Facilities() {
  const [selectedFacility, setSelectedFacility] = useState(null);

  return (
    <div
      className="min-h-screen pt-32 pb-24"
      style={{
        background: "linear-gradient(180deg,#FFF8EE 0%,#F8FAFC 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-20">
          <span
            className="px-5 py-2 rounded-full text-sm font-semibold"
            style={{
              background: "rgba(22,138,58,0.08)",
              color: colors.green,
            }}
          >
            School Facilities
          </span>

          <h1 className="text-5xl md:text-6xl font-bold mt-6 text-slate-900">
            Learning Beyond <span style={{ color: colors.red }}>Classrooms</span>
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-lg text-slate-600">
            Baljagriti provides modern facilities that create an engaging, practical, and technology-driven learning
            environment for every student.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{
                y: -15,
                scale: 1.03,
                rotateY: 6,
              }}
              className="rounded-3xl p-8 border backdrop-blur-md hover:-translate-y-4 hover:rotate-1 hover:shadow-2xl transition-all duration-300"
              style={{
                background: `${facility.color}08`,
                borderColor: `${facility.color}25`,
                boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
                style={{
                  background: `${facility.color}15`,
                }}
              >
                {facility.emoji}
              </div>

              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: `${facility.color}15`,
                  color: facility.color,
                }}
              >
                {facility.category}
              </span>

              <h3 className="text-2xl font-bold mt-4 text-slate-900">{facility.title}</h3>

              <p className="mt-4 text-slate-600 leading-relaxed">{facility.description}</p>

              <button
                onClick={() => setSelectedFacility(facility)}
                className="mt-5 flex items-center gap-2 font-medium hover:gap-3 transition-all"
                style={{ color: facility.color }}
              >
                Learn More
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-24 rounded-[32px] p-12 text-center text-white"
          style={{
            background: "linear-gradient(135deg,#D71920,#4B2E83,#168A3A)",
          }}
        >
          <h2 className="text-4xl font-bold mb-4">Explore Our Campus Facilities</h2>

          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            We provide students with the resources, environment, and infrastructure needed for academic excellence and
            personal development.
          </p>

          <Link
            to="/admissions"
            className="inline-block bg-white text-black px-8 py-3 rounded-2xl font-semibold hover:scale-105 transition"
          >
            Admission Details
          </Link>
        </div>
      </div>

      {selectedFacility && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
    style={{
      background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(12px)",
    }}
    onClick={() => setSelectedFacility(null)}
  >
          <motion.div
          onClick={(e) => e.stopPropagation()}
            initial={{
              opacity: 0,
              scale: 0.7,
              rotateX: 25,
              y: 100,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              y: 0,
            }}
            whileHover={{
              scale: 1.03,
              rotateY: 3,
              rotateX: -2,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
            }}
            exit={{ opacity: 0 }}
            className="relative max-w-2xl w-full overflow-hidden rounded-[32px]"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))",
              boxShadow: "0 60px 120px rgba(0,0,0,0.28), 0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at top right,
                  ${selectedFacility.color}30,
                  transparent 40%)
                `,
              }}
            />

            <div
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full"
              style={{
                background: `${selectedFacility.color}25`,
                filter: "blur(80px)",
              }}
            />

<button
  type="button"
  onClick={() => {
    setSelectedFacility(null);
  }}
  className="
    absolute
    top-5
    right-5
    z-[99999]
    w-14
    h-14
    rounded-full
    bg-white
    shadow-2xl
    cursor-pointer
    text-xl
    font-bold
    hover:bg-red-500
    hover:text-white
    hover:rotate-180
    hover:scale-125
    transition-all
    duration-500
  "
>
  ✕
</button>

            <div className="p-10 relative z-10">
              <motion.div
                whileHover={{
                  scale: 1.15,
                  rotate: 10,
                  y: -8,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
                className="
                  w-24 h-24 rounded-3xl
                  flex items-center justify-center
                  text-5xl mb-6
                  transition-all duration-500
                "
                style={{
                  background: `${selectedFacility.color}15`,
                  border: `1px solid ${selectedFacility.color}30`,
                }}
              >
                {selectedFacility.emoji}
              </motion.div>

              <span
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: `${selectedFacility.color}15`,
                  color: selectedFacility.color,
                }}
              >
                {selectedFacility.category}
              </span>

              <h2 className="text-5xl font-black mt-5 text-slate-900">{selectedFacility.title}</h2>

              <p className="mt-5 text-lg text-slate-600"> {selectedFacility.description}</p>

              <div
                className="mt-8 p-5 rounded-2xl"
                style={{
                  background: `${selectedFacility.color}08`,
                  border: `1px solid ${selectedFacility.color}20`,
                }}
              >
                <h4 className="font-bold text-slate-900 mb-3">Facility Highlights</h4>

                <p className="text-slate-600 leading-relaxed">{selectedFacility.details}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}