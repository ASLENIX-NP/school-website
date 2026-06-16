import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Download,
  Bell,
  FileText,
  ArrowRight,
  Clock,
  Pin,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cream: "#FFF8EE",
};

/*
  Later this whole object can come from backend/admin dashboard.
  Admin can add:
  - title
  - date
  - description
  - category
  - pdfUrl
*/


function NoticeCard({ notice, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-3xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-1"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
        border: "1px solid rgba(11,16,32,0.08)",
        boxShadow:
          "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: notice.pinned
            ? `linear-gradient(90deg, ${colors.red}, ${colors.green})`
            : "rgba(11,16,32,0.08)",
        }}
      />

      <div className="flex flex-col md:flex-row md:items-start gap-5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: notice.pinned
              ? "rgba(215,25,32,0.1)"
              : "rgba(75,46,131,0.09)",
            border: notice.pinned
              ? "1px solid rgba(215,25,32,0.18)"
              : "1px solid rgba(75,46,131,0.16)",
            boxShadow: notice.pinned
              ? "0 14px 30px rgba(215,25,32,0.11)"
              : "0 14px 30px rgba(75,46,131,0.09)",
          }}
        >
          {notice.pinned ? (
            <Pin className="w-6 h-6" style={{ color: colors.red }} />
          ) : (
            <FileText className="w-6 h-6" style={{ color: colors.purple }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(22,138,58,0.09)",
                color: colors.green,
                border: "1px solid rgba(22,138,58,0.16)",
              }}
            >
              {notice.category}
            </span>

            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              {notice.notice_date}
            </span>
          </div>

          <h3
            className="text-2xl md:text-3xl mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.035em",
            }}
          >
            {notice.title}
          </h3>

          <p className="text-base leading-relaxed text-slate-500 mb-6">
            {notice.description}
          </p>

          <a
            href={notice.pdf_url}
            download
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105"
            style={{
              color: "#FFFFFF",
              background: `linear-gradient(135deg, ${colors.green}, ${colors.purple})`,
              boxShadow: "0 14px 34px rgba(22,138,58,0.22)",
            }}
          >
            <Download className="w-4 h-4" />
            Download Notice
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Notices() {
  const [notices, setNotices] = useState([]);
const [settings, setSettings] = useState(null);

useEffect(() => {
  fetchNotices();
  fetchSettings();
}, []);

const fetchNotices = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/notices"
    );

    const result = await response.json();

    if (result.success) {
      setNotices(result.data);
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchSettings = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/notice-settings"
    );

    const result = await response.json();

    if (result.success) {
      setSettings(result.data);
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
            {settings?.page_badge}
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
            {settings?.page_title}
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-500 leading-relaxed">
          {settings?.page_description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_330px] gap-8 items-start">
          <div className="space-y-6">
          {notices.map((notice, index) => (
              <NoticeCard key={notice.id} notice={notice} index={index} />
            ))}
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
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(75,46,131,0.09)",
                    border: "1px solid rgba(75,46,131,0.16)",
                  }}
                >
                  <Calendar className="w-5 h-5" style={{ color: colors.purple }} />
                </div>

                <div>
                  <h3
                    className="text-2xl leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 850,
                      color: colors.dark,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Nepali Calendar
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Nepali date reference
                  </p>
                </div>
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
                  src="https://www.hamropatro.com/widgets/calender-small.php"
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
              className="p-5"
              style={{
                background: `linear-gradient(135deg, ${colors.dark}, ${colors.purple})`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                >
                  <Clock className="w-5 h-5 text-white" />
                </div>

                <div>
                  <div className="text-white font-bold">Admin Ready</div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.68)" }}
                  >
                    Notices can be added later
                  </div>
                </div>
              </div>

              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                Notice title, date, category, description, and PDF file can later
                come directly from the admin dashboard.
              </p>

              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-bold text-white transition-all hover:gap-3"
              >
                Contact School Office
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}