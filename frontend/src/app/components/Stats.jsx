import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const palette = {
  cyan: "#38BDF8",
  gold: "#FACC15",
  green: "#22C55E",
  violet: "#8B5CF6",
};

const statsData = {
  eyebrow: "School Highlights",
  title: "Numbers that reflect our journey.",
  description:
    "These highlights can later be updated directly from the admin dashboard without changing frontend code.",

  stats: [
    {
      value: 3800,
      suffix: "+",
      label: "Students Enrolled",
      note: "Across school programs",
      color: palette.cyan,
    },
    {
      value: 240,
      suffix: "+",
      label: "Expert Teachers",
      note: "Academic and support team",
      color: palette.gold,
    },
    {
      value: 35,
      suffix: " yrs",
      label: "Years of Excellence",
      note: "Serving Makwanpur",
      color: palette.green,
    },
    {
      value: 98,
      suffix: "%",
      label: "Success Rate",
      note: "Academic performance",
      color: palette.violet,
    },
  ],

  story: {
    badge: "About Baljagriti",
    title: "Building Tomorrow's Leaders Today",
    paragraphs: [
      "Established with a vision to provide quality education in Makawanpur, Baljagriti Secondary English Boarding School has grown as one of Hetauda's respected academic institutions.",
      "With students from Play Group to Grade 10, the school focuses on academic discipline, values, creativity, digital learning, and holistic student development.",
    ],
    buttonText: "Read Our Story",
    buttonLink: "/about",
    image:
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1000&h=800&fit=crop&auto=format",
  },

  excellence: {
    title: "Academic Excellence",
    description:
      "Our students consistently achieve outstanding results in the SEE examinations under NEB.",
    cards: [
      {
        title: "Best SEE Results",
        description:
          "Consistently achieving top results in the Secondary Education Examination under the National Examination Board.",
      },
      {
        title: "GPA 4.00 Achievers",
        description:
          "Our brightest students attain a perfect GPA of 4.00, a testament to our teaching quality and student dedication.",
      },
      {
        title: "Holistic Development",
        description:
          "Beyond academics, we foster creativity, leadership, and sportsmanship through diverse extracurricular programs.",
      },
    ],
  },

  notices: {
    title: "Latest Notices",
    description: "Stay informed with the latest announcements.",
    items: [
      {
        title: "Annual Sports Day Announcement",
        date: "Mar 15, 2026",
        category: "Students",
      },
      {
        title: "Parent-Teacher Meeting Schedule",
        date: "Mar 10, 2026",
        category: "Parents",
      },
      {
        title: "Mid-Term Examination Routine Published",
        date: "Mar 5, 2026",
        category: "Students",
      },
    ],
  },
};

function Counter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;

          const duration = 1600;
          const start = performance.now();

          const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);

            setCount(Math.round(ease * target));

            if (t < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}
const formatNoticeDate = (dateValue) => {
  if (!dateValue) return "No date";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getNoticeExcerpt = (notice) => {
  const text =
    notice?.description ||
    notice?.content ||
    "Click to read the full school notice and important update.";

  return text.length > 110 ? `${text.slice(0, 110)}...` : text;
};
function Stats() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/notices")
      .then((res) => res.json())
      .then((data) => {
        const noticeList = Array.isArray(data) ? data : data?.data || [];
        setNotices(noticeList.slice(0, 3));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section
      className="relative overflow-hidden py-16"
      style={{
        background:
          "linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 45%, #F7F4EF 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-28 left-10 w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.11), transparent 70%)",
          }}
        />

        <div
          className="absolute top-72 right-10 w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(250,204,21,0.1), transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1450px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-9 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
        >
          <div>
            <div
              className="inline-flex items-center rounded-full px-4 py-2 mb-3"
              style={{
                background: "rgba(2,6,23,0.04)",
                border: "1px solid rgba(2,6,23,0.08)",
                color: "#0F172A",
              }}
            >
              <span className="text-sm font-bold">{statsData.eyebrow}</span>
            </div>

            <h2
              className="text-3xl md:text-4xl text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                letterSpacing: "-0.04em",
              }}
            >
              {statsData.title}
            </h2>
          </div>

          <p className="max-w-xl text-sm md:text-base leading-relaxed text-slate-600">
            {statsData.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {statsData.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-[1.6rem] p-6 transition-all duration-300 hover:-translate-y-2"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.94), rgba(255,255,255,0.74))",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow:
                  "0 20px 58px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div
                className="w-14 h-1 rounded-full mb-7 transition-all duration-300 group-hover:w-20"
                style={{ background: stat.color }}
              />

              <div
                className="text-4xl md:text-5xl mb-2 text-slate-950"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 850,
                  letterSpacing: "-0.055em",
                }}
              >
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>

              <div className="text-base font-bold text-slate-700">
                {stat.label}
              </div>

              <div className="text-sm mt-1 text-slate-500">{stat.note}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-10 items-center mb-24"
        >
          <div
            className="relative rounded-[2rem] overflow-hidden min-h-[430px]"
            style={{
              background:
                "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(2,6,23,0.92))",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow:
                "0 28px 80px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <img
              src={statsData.story.image}
              alt="Baljagriti school"
              className="absolute inset-0 w-full h-full object-cover opacity-78"
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(2,6,23,0.72), rgba(2,6,23,0.16) 45%, rgba(15,23,42,0.86))",
              }}
            />

            <div
              className="absolute top-6 left-6 rounded-2xl px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div className="text-white text-sm font-bold">
                Baljagriti School
              </div>

              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.68)" }}
              >
                Hetauda-2, Makwanpur
              </div>
            </div>

            <div
              className="absolute bottom-6 left-6 right-6 rounded-3xl p-5"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.07))",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 22px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div className="text-white text-lg font-bold mb-1">
                Quality Education Since 2046 BS
              </div>

              <div
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.68)" }}
              >
                This image and text can later come from the admin dashboard.
              </div>
            </div>
          </div>

          <div>
            <div
              className="inline-flex items-center rounded-full px-4 py-2 mb-5"
              style={{
                background: "rgba(215,25,32,0.06)",
                border: "1px solid rgba(215,25,32,0.16)",
                color: "#D71920",
              }}
            >
              <span className="text-sm font-bold">{statsData.story.badge}</span>
            </div>

            <h2
              className="text-3xl md:text-5xl text-slate-950 mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                letterSpacing: "-0.045em",
                lineHeight: 1.05,
              }}
            >
              {statsData.story.title}
            </h2>

            <div className="space-y-4 mb-7">
              {statsData.story.paragraphs.map((text) => (
                <p
                  key={text}
                  className="text-base md:text-lg leading-relaxed text-slate-500"
                >
                  {text}
                </p>
              ))}
            </div>

            <Link
              to={statsData.story.buttonLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:gap-3 hover:-translate-y-0.5"
              style={{
                color: "#0F172A",
                background: "#FFFFFF",
                border: "1px solid rgba(15,23,42,0.12)",
                boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
              }}
            >
              {statsData.story.buttonText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <h2
            className="text-3xl md:text-4xl text-slate-950 mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              letterSpacing: "-0.035em",
            }}
          >
            {statsData.excellence.title}
          </h2>

          <p className="max-w-2xl text-base md:text-lg leading-relaxed text-slate-500">
            {statsData.excellence.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {statsData.excellence.cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="rounded-2xl p-7 md:p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(15,23,42,0.1)",
                boxShadow: "0 8px 26px rgba(15,23,42,0.06)",
              }}
            >
              <div
                className="text-sm font-black tracking-widest mb-7"
                style={{ color: "#1F6F4A" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              <h3
                className="text-xl md:text-2xl text-slate-950 mb-3"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                }}
              >
                {card.title}
              </h3>

              <p className="text-sm md:text-base leading-relaxed text-slate-500">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

       <div className="mt-24">
  <div className="flex items-end justify-between gap-6 mb-10">
    <div>
      <h2
        className="text-3xl md:text-4xl text-slate-950 mb-3"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 850,
          letterSpacing: "-0.035em",
        }}
      >
        {statsData.notices.title}
      </h2>

      <p className="text-base md:text-lg text-slate-500">
        {statsData.notices.description}
      </p>
    </div>

    <Link
      to="/notices"
      className="hidden md:flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
      style={{ color: "#64748B" }}
    >
      View All <ArrowRight className="w-4 h-4" />
    </Link>
  </div>

  {notices.length === 0 ? (
    <div
      className="rounded-[28px] p-10 text-center"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(248,250,252,0.9))",
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow: "0 16px 42px rgba(15,23,42,0.06)",
      }}
    >
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        No notices available right now
      </h3>

      <p className="text-slate-500">
        New school notices will appear here once added from the admin panel.
      </p>
    </div>
  ) : (
    <div className="space-y-5">
      {notices.map((notice, i) => {
        const noticeId = notice.id || notice._id;
        const noticeDate = notice.notice_date || notice.date;
        const noticeLink = noticeId ? `/notices/${noticeId}` : "/notices";

        return (
          <motion.div
            key={noticeId || notice.title || i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
          >
            <Link
              to={noticeLink}
              className="group block rounded-[28px] transition-all duration-300 hover:-translate-y-1"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92))",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow:
                  "0 14px 38px rgba(15,23,42,0.065), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              <div className="grid md:grid-cols-[150px_1fr_160px] gap-6 items-center p-6 md:p-7">
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(215,25,32,0.06), rgba(22,138,58,0.06))",
                    border: "1px solid rgba(15,23,42,0.06)",
                  }}
                >
                  <div
                    className="w-14 h-1 rounded-full mb-4"
                    style={{
                      background:
                        "linear-gradient(90deg, #D71920 0%, #168A3A 100%)",
                    }}
                  />

                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">
                    Notice Date
                  </div>

                  <div className="text-sm font-bold text-slate-800">
                    {formatNoticeDate(noticeDate)}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: "rgba(22,138,58,0.09)",
                        color: "#168A3A",
                        border: "1px solid rgba(22,138,58,0.16)",
                      }}
                    >
                      {notice.category || "Notice"}
                    </span>

                    <span className="text-xs font-semibold text-slate-400">
                      School Announcement
                    </span>
                  </div>

                  <h3
                    className="text-xl md:text-2xl text-slate-950 leading-snug mb-2 transition-colors duration-300 group-hover:text-green-700"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 850,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {notice.title || "School Notice"}
                  </h3>

                  <p className="text-sm md:text-base leading-relaxed text-slate-500 line-clamp-2">
                    {getNoticeExcerpt(notice)}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  )}

  <Link
    to="/notices"
    className="mt-6 md:hidden flex items-center justify-center gap-2 text-sm font-semibold"
    style={{ color: "#64748B" }}
  >
    View All <ArrowRight className="w-4 h-4" />
  </Link>
</div>
      </div>
    </section>
  );
}

export { Stats };
export default Stats;