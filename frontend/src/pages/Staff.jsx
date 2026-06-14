import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  GraduationCap,
  Award,
  Phone,
  BookOpen,
  UserRound,
} from "lucide-react";
import { motion } from "motion/react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultStaffContent = {
  badgeText: "Our Faculty Team",
  title: "Our Staff & Members",
  highlightedWord: "Members",
  subtitle:
    "Meet the dedicated educators, mentors, and leaders who inspire excellence, character, and lifelong learning at Baljagriti Secondary English Boarding School.",
  stats: [
    {
      id: "teachingStaff",
      value: "50+",
      label: "Teaching Staff",
      icon: "users",
      color: colors.green,
    },
    {
      id: "expertFaculty",
      value: "240+",
      label: "Expert Faculty",
      icon: "graduation",
      color: colors.purple,
    },
    {
      id: "yearsExcellence",
      value: "35+",
      label: "Years Excellence",
      icon: "award",
      color: colors.red,
    },
  ],
  staff: [
    {
      id: 1,
      name: "Binod Subedi",
      position: "Principal",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      qualification: "M.Ed",
      phone: "+977-9800000000",
      visible: true,
    },
    {
      id: 2,
      name: "Amul Shrestha",
      position: "Vice Principal",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      qualification: "M.Ed",
      phone: "+977-9800000000",
      visible: true,
    },
    {
      id: 3,
      name: "Prem Hamal",
      position: "Science Teacher",
      imageUrl: "https://images.unsplash.com/photo-1504593811423-6dd665756598",
      qualification: "B.Sc, B.Ed",
      phone: "+977-9800000000",
      visible: true,
    },
  ],
};

function mergeStaffContent(saved = {}) {
  return {
    ...defaultStaffContent,
    ...saved,
    stats:
      Array.isArray(saved.stats) && saved.stats.length
        ? saved.stats
        : defaultStaffContent.stats,
    staff:
      Array.isArray(saved.staff) && saved.staff.length
        ? saved.staff
        : defaultStaffContent.staff,
  };
}

function getStatIcon(icon) {
  if (icon === "graduation") return GraduationCap;
  if (icon === "award") return Award;
  return Users;
}

function StaffImage({ src, name }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="w-full h-80 bg-slate-100 flex items-center justify-center">
      <UserRound className="w-20 h-20 text-slate-300" />
    </div>
  );
}

export default function Staff() {
  const [content, setContent] = useState(defaultStaffContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaffContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/staff");
        const savedContent = res.data?.data?.content || {};
        setContent(mergeStaffContent(savedContent));
      } catch (error) {
        console.error("Staff content load error:", error);
        setContent(defaultStaffContent);
      } finally {
        setLoading(false);
      }
    };

    loadStaffContent();
  }, []);

  const visibleStaff = content.staff.filter((staff) => staff.visible !== false);

  return (
    <section
      className="min-h-screen pt-32 pb-24 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(75,46,131,0.12), transparent 34%),
          radial-gradient(circle at top right, rgba(22,138,58,0.10), transparent 36%),
          radial-gradient(circle at bottom right, rgba(250,204,21,0.10), transparent 34%),
          linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 100%)
        `,
      }}
    >
      <div className="absolute top-24 left-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute top-72 right-16 w-52 h-52 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 font-semibold"
            style={{
              background: "rgba(22,138,58,0.08)",
              border: "1px solid rgba(22,138,58,0.18)",
              color: colors.green,
            }}
          >
            <Users size={16} />
            {content.badgeText}
          </div>

          <h1
            className="text-5xl md:text-7xl text-slate-950 leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              letterSpacing: "-0.045em",
            }}
          >
            {content.title.replace(content.highlightedWord, "").trim()}{" "}
            <span className="text-green-700">{content.highlightedWord}</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {content.stats.map((stat, index) => {
            const Icon = getStatIcon(stat.icon);

            return (
              <motion.div
                key={stat.id || index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-3xl p-8 text-center bg-white/90 backdrop-blur-xl"
                style={{
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow:
                    "0 22px 54px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.85)",
                }}
              >
                <Icon
                  className="mx-auto mb-4"
                  size={42}
                  style={{ color: stat.color || colors.green }}
                />

                <h3 className="text-4xl font-black text-slate-950">
                  {stat.value}
                </h3>

                <p className="text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center text-slate-500 font-semibold">
            Loading staff members...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleStaff.map((staff, index) => (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="group bg-white rounded-[2rem] overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow:
                    "0 22px 54px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.85)",
                }}
              >
                <div className="relative overflow-hidden">
                  <StaffImage src={staff.imageUrl} name={staff.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-black text-slate-950">
                    {staff.name}
                  </h3>

                  <p className="text-green-700 font-bold mt-1">
                    {staff.position}
                  </p>

                  <div className="mt-5 space-y-3">
                    {staff.qualification && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <BookOpen className="w-4 h-4 text-purple-700" />
                        <span>{staff.qualification}</span>
                      </div>
                    )}

                    {staff.phone && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <Phone className="w-4 h-4 text-green-700" />
                        <span>{staff.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}