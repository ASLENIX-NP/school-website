import { useState, useEffect } from "react";
import { motion } from "motion/react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cream: "#FFF8EE",
  gold: "#FACC15",
  cyan: "#38BDF8",
};

const defaultSettings = {
  page_badge: "School Updates",
  page_title: "School Notices",
  page_description:
    "Stay informed with examination schedules, admissions, holidays, events and important announcements.",
  calendar_title: "Nepali Calendar",
  calendar_subtitle: "Nepali date reference",
  calendar_embed_url: "https://www.hamropatro.com/widgets/calender-small.php",
  sidebar_title: "Need Assistance?",
  sidebar_description:
    "For questions about notices, admissions, examinations, or official documents, please contact the school office.",
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

function normalizeNotice(notice = {}) {
  return {
    id: notice.id,
    title: notice.title || "",
    category: notice.category || "General",
    notice_date: notice.notice_date || notice.date || "",
    description: notice.description || "",
    pdf_url: notice.pdf_url || notice.pdfUrl || "",
    pinned: Boolean(notice.pinned),
    created_at: notice.created_at || notice.createdAt || "",
  };
}

function getTime(value) {
  const time = new Date(value || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function sortNoticesNewestFirst(notices = []) {
  return [...notices].sort((a, b) => {
    const pinnedA = a.pinned ? 1 : 0;
    const pinnedB = b.pinned ? 1 : 0;

    if (pinnedA !== pinnedB) return pinnedB - pinnedA;

    const createdA = getTime(a.created_at);
    const createdB = getTime(b.created_at);

    if (createdA !== createdB) return createdB - createdA;

    const dateA = getTime(a.notice_date);
    const dateB = getTime(b.notice_date);

    return dateB - dateA;
  });
}

function NoticeCard({ notice, index }) {
  const isPinned = notice.pinned === true;
  const accentColor = isPinned ? colors.red : colors.green;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
      className="group relative overflow-hidden rounded-[28px] bg-white transition-all duration-300 hover:-translate-y-1"
      style={{
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow:
          "0 16px 44px rgba(15,23,42,0.075), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-1.5 transition-all duration-300 group-hover:w-2"
        style={{
          background: `linear-gradient(180deg, ${accentColor}, ${colors.purple})`,
        }}
      />

      <div className="grid gap-5 p-6 pl-8 md:grid-cols-[145px_1fr_170px] md:items-center">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Date
          </div>

          <div className="mt-2 text-base font-black text-slate-900">
            {formatNoticeDate(notice.notice_date)}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-black"
              style={{
                background: `${accentColor}10`,
                color: accentColor,
                border: `1px solid ${accentColor}24`,
              }}
            >
              {notice.category || "General"}
            </span>

            {isPinned && (
              <span
                className="rounded-full px-3 py-1 text-xs font-black"
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
        </div>

        <div className="min-w-0">
          <h3
            className="text-2xl text-slate-950 transition-colors duration-300 group-hover:text-green-700"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              letterSpacing: "-0.035em",
              lineHeight: 1.12,
            }}
          >
            {notice.title || "School Notice"}
          </h3>

          <p className="mt-3 text-base leading-relaxed text-slate-500">
            {notice.description || "Please open this notice for more details."}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          {notice.pdf_url ? (
            <>
              <a
                href={notice.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-black transition-all duration-300 hover:-translate-y-0.5 md:w-auto"
                style={{
                  color: colors.dark,
                  background: "#FFFFFF",
                  border: "1px solid rgba(15,23,42,0.12)",
                  boxShadow: "0 10px 24px rgba(15,23,42,0.07)",
                }}
              >
                View PDF
              </a>

              <a
  href={notice.pdf_url}
  download
  className="inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-black transition-all duration-300 hover:-translate-y-0.5 md:w-auto"
  style={{
    color: "#FFFFFF",
    background: colors.dark,
    border: "1px solid rgba(15,23,42,0.14)",
    boxShadow: "0 12px 28px rgba(15,23,42,0.18)",
  }}
>
  Download
</a>
            </>
          ) : (
            <span className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-400">
              No PDF
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function EmptyNotice() {
  return (
    <div
      className="rounded-[30px] p-10 text-center"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.82))",
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow:
          "0 16px 44px rgba(15,23,42,0.075), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      <div
        className="mx-auto mb-5 h-1.5 w-24 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${colors.red}, ${colors.green}, ${colors.purple})`,
        }}
      />

      <h3
        className="text-3xl text-slate-950"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 850,
          letterSpacing: "-0.04em",
        }}
      >
        No notices available
      </h3>

      <p className="mx-auto mt-3 max-w-xl text-slate-500">
        New school notices will appear here once they are added from the admin
        dashboard.
      </p>
    </div>
  );
}

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNoticePage = async () => {
      await Promise.all([fetchNotices(), fetchSettings()]);
      setLoading(false);
    };

    loadNoticePage();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notices");
      const result = await response.json();

      if (result.success) {
        const noticeList = Array.isArray(result.data)
          ? result.data.map(normalizeNotice)
          : [];

        setNotices(sortNoticesNewestFirst(noticeList));
      }
    } catch (error) {
      console.error("Fetch notices error:", error);
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
      console.error("Fetch notice settings error:", error);
    }
  };

  const latestNoticeDate = notices.length
    ? formatNoticeDate(notices[0].notice_date)
    : "No notices";

  const importantCount = notices.filter((notice) => notice.pinned).length;

  return (
    <section
      className="min-h-screen pt-32 pb-24 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(75,46,131,0.12), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.10), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 58%, #F1ECFF 100%)
        `,
      }}
    >
      <div
        className="absolute top-24 right-10 h-72 w-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(75,46,131,0.10), transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      <div
        className="absolute bottom-16 left-8 h-72 w-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.09), transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-end">
            <div>
              <span
                className="inline-flex rounded-full px-4 py-1.5 text-sm font-black uppercase tracking-[0.14em] mb-5"
                style={{
                  background: "rgba(215,25,32,0.08)",
                  color: colors.red,
                  border: "1px solid rgba(215,25,32,0.16)",
                }}
              >
                {settings.page_badge}
              </span>

              <h1
                className="text-5xl md:text-7xl text-slate-950 leading-[0.95]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  letterSpacing: "-0.065em",
                }}
              >
                {settings.page_title}
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-500">
                {settings.page_description}
              </p>
            </div>

            <div
              className="rounded-[28px] p-5"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow:
                  "0 18px 46px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div
                className="h-1.5 w-20 rounded-full mb-5"
                style={{
                  background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
                }}
              />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-3xl font-black text-slate-950">
                    {notices.length}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Notices
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-black text-slate-950">
                    {importantCount}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Important
                  </div>
                </div>

                <div>
                  <div className="text-sm font-black text-slate-950 leading-tight">
                    {latestNoticeDate}
                  </div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Latest
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_330px] gap-8 items-start">
          <div className="space-y-5">
            <div
              className="rounded-[28px] px-6 py-5"
              style={{
                background:
                  "linear-gradient(145deg, rgba(15,23,42,0.97), rgba(30,41,59,0.94))",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 18px 46px rgba(15,23,42,0.18)",
              }}
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-black uppercase tracking-[0.18em] text-white/45">
                    Notice Board
                  </div>

                  <h2
                    className="mt-1 text-2xl text-white"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 850,
                      letterSpacing: "-0.035em",
                    }}
                  >
                    Latest School Announcements
                  </h2>
                </div>

                <div className="text-sm font-semibold text-white/55">
                  Newest notices appear first
                </div>
              </div>
            </div>

            {loading ? (
              <div
                className="rounded-[30px] p-10 text-center font-bold text-slate-500"
                style={{
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(15,23,42,0.08)",
                }}
              >
                Loading notices...
              </div>
            ) : notices.length === 0 ? (
              <EmptyNotice />
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
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28 space-y-6"
          >
            <div
              className="rounded-[28px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.94), rgba(255,255,255,0.76))",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow:
                  "0 18px 46px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="p-5">
                <div
                  className="w-16 h-1.5 rounded-full mb-4"
                  style={{
                    background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
                  }}
                />

                <h3
                  className="text-2xl text-slate-950"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 850,
                    letterSpacing: "-0.035em",
                  }}
                >
                  {settings.calendar_title}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {settings.calendar_subtitle}
                </p>

                <div
                  className="rounded-2xl overflow-hidden flex justify-center items-start mt-5"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(15,23,42,0.08)",
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
            </div>

            <div
              className="rounded-[28px] p-6"
              style={{
                background: `linear-gradient(135deg, ${colors.dark}, ${colors.purple})`,
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 18px 46px rgba(15,23,42,0.2)",
              }}
            >
              <div
                className="w-16 h-1.5 rounded-full mb-5"
                style={{
                  background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan})`,
                }}
              />

              <h3 className="text-white font-black text-xl">
                {settings.sidebar_title}
              </h3>

              <p className="text-sm leading-relaxed mt-3 mb-5 text-white/70">
                {settings.sidebar_description}
              </p>

              <a
                href={settings.sidebar_button_link}
                className="inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-black transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: colors.dark,
                }}
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