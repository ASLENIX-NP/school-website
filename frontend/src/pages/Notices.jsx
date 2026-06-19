import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Bell } from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cream: "#FFF8EE",
};

const defaultSettings = {
  page_badge: "School Updates",
  page_title: "School Notices",
  page_description:
    "Stay informed with examination schedules, admissions, holidays, events and important announcements.",
  calendar_title: "Nepali Calendar",
  calendar_subtitle: "Nepali date reference",
  calendar_embed_url: "https://www.hamropatro.com/widgets/calender-small.php",
  sidebar_title: "Admin Ready",
  sidebar_description:
    "Notice title, date, category, description and PDF file can come directly from the admin dashboard.",
  sidebar_button_text: "Contact School Office",
  sidebar_button_link: "/contact",
};

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

function sortNoticesNewestFirst(notices = []) {
  return [...notices].sort((a, b) => {
    const pinnedA = a.pinned ? 1 : 0;
    const pinnedB = b.pinned ? 1 : 0;

    if (pinnedA !== pinnedB) {
      return pinnedB - pinnedA;
    }

    const dateA = new Date(
      a.notice_date || a.date || a.created_at || 0
    ).getTime();

    const dateB = new Date(
      b.notice_date || b.date || b.created_at || 0
    ).getTime();

    return dateB - dateA;
  });
}

function NoticeCard({ notice, index }) {
  const noticeDate = formatNoticeDate(notice.notice_date || notice.date);
  const isPinned = notice.pinned === true;
  const accentColor = isPinned ? colors.red : colors.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-2 cursor-default"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(255,255,255,0.82))",
        border: `1px solid ${accentColor}22`,
        boxShadow:
          "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 26px 64px rgba(11,16,32,0.14), 0 0 0 1px ${accentColor}22`;
        e.currentTarget.style.borderColor = `${accentColor}55`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)";
        e.currentTarget.style.borderColor = `${accentColor}22`;
      }}
    >
      <div className="grid md:grid-cols-[150px_1fr_auto] gap-6 items-start p-6 md:p-7">
        <div
          className="rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(145deg, rgba(248,250,252,0.96), rgba(255,255,255,0.86))",
            border: "1px solid rgba(15,23,42,0.06)",
          }}
        >
          <div
            className="w-14 h-1 rounded-full mb-4 transition-all duration-300 group-hover:w-20"
            style={{
              background: isPinned
                ? `linear-gradient(90deg, ${colors.red}, ${colors.green})`
                : accentColor,
            }}
          />

          <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
            Notice Date
          </div>

          <div className="text-sm font-bold text-slate-800">{noticeDate}</div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: `${accentColor}10`,
                color: accentColor,
                border: `1px solid ${accentColor}22`,
              }}
            >
              {notice.category || "Notice"}
            </span>

            {isPinned && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: "rgba(215,25,32,0.08)",
                  color: colors.red,
                  border: "1px solid rgba(215,25,32,0.16)",
                }}
              >
                Important
              </span>
            )}
          </div>

          <h3
            className="text-2xl md:text-3xl mb-3 transition-colors duration-300 group-hover:text-green-700"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
            }}
          >
            {notice.title || "School Notice"}
          </h3>

          <p className="text-base leading-relaxed text-slate-500">
            {notice.description || "Please open this notice for more details."}
          </p>
        </div>

        <div className="flex md:justify-end">
          {notice.pdf_url ? (
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:items-end">
              <a
                href={notice.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:-translate-y-1"
                style={{
                  color: "#0F172A",
                  background: "#FFFFFF",
                  border: "1px solid rgba(15,23,42,0.12)",
                  boxShadow: "0 10px 26px rgba(15,23,42,0.08)",
                }}
              >
                View PDF
              </a>

              <a
                href={notice.pdf_url}
                download
                className="inline-flex items-center justify-center px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:-translate-y-1"
                style={{
                  color: "#FFFFFF",
                  background: `linear-gradient(135deg, ${colors.green}, ${colors.purple})`,
                  boxShadow: "0 14px 34px rgba(22,138,58,0.2)",
                }}
              >
                Download PDF
              </a>
            </div>
          ) : (
            <span className="text-sm font-semibold text-slate-400">
              No PDF attached
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    fetchNotices();
    fetchSettings();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notices");
      const result = await response.json();

      if (result.success) {
        const noticeList = Array.isArray(result.data) ? result.data : [];
        setNotices(sortNoticesNewestFirst(noticeList));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notice-settings");
      const result = await response.json();

      if (result.success) {
        setSettings({
          ...defaultSettings,
          ...(result.data || {}),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section
      className="min-h-screen pt-32 pb-24 relative overflow-hidden"
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

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
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
            <Bell className="w-4 h-4" />
            {settings.page_badge}
          </span>

          <h1
            className="text-4xl md:text-6xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            {settings.page_title}
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-500 leading-relaxed">
            {settings.page_description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_330px] gap-8 items-start">
          <div className="space-y-6">
            {notices.length === 0 ? (
              <div
                className="rounded-3xl p-10 text-center"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(255,255,255,0.82))",
                  border: "1px solid rgba(11,16,32,0.08)",
                  boxShadow:
                    "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
                }}
              >
                <h3
                  className="text-2xl mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 850,
                    color: colors.dark,
                    letterSpacing: "-0.03em",
                  }}
                >
                  No notices available
                </h3>

                <p className="text-slate-500">
                  New school notices will appear here once added from the admin
                  dashboard.
                </p>
              </div>
            ) : (
              notices.map((notice, index) => (
                <NoticeCard
                  key={notice.id || index}
                  notice={notice}
                  index={index}
                />
              ))
            )}
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28 rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
              border: "1px solid rgba(11,16,32,0.08)",
              boxShadow:
                "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="p-5">
              <div className="mb-5">
                <div
                  className="w-16 h-1 rounded-full mb-4"
                  style={{
                    background:
                      "linear-gradient(90deg, #D71920 0%, #168A3A 100%)",
                  }}
                />

                <h3
                  className="text-2xl leading-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 850,
                    color: colors.dark,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {settings.calendar_title}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {settings.calendar_subtitle}
                </p>
              </div>

              <div
                className="rounded-2xl overflow-hidden flex justify-center items-start"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(11,16,32,0.08)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                  height: "345px",
                  paddingTop: "10px",
                }}
              >
                <iframe
                  title="Nepali Calendar"
                  src={settings.calendar_embed_url}
                  style={{
                    width: "245px",
                    height: "330px",
                    border: "0",
                    transform: "scale(1.03)",
                    transformOrigin: "top center",
                    background: "#FFFFFF",
                  }}
                />
              </div>
            </div>

            <div
              className="p-6"
              style={{
                background: `linear-gradient(135deg, ${colors.dark}, ${colors.purple})`,
              }}
            >
              <div
                className="w-16 h-1 rounded-full mb-5"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(250,204,21,0.95), rgba(56,189,248,0.95))",
                }}
              />

              <div className="text-white font-bold text-xl">
                {settings.sidebar_title}
              </div>

              <p
                className="text-sm leading-relaxed mt-3 mb-5"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                {settings.sidebar_description}
              </p>

              <a
                href={settings.sidebar_button_link}
                className="inline-flex items-center text-sm font-bold text-white transition-all duration-300 hover:tracking-wide"
              >
                {settings.sidebar_button_text}
              </a>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}