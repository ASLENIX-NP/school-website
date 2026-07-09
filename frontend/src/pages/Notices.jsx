import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import PdfNoticePreview from "../app/components/PdfNoticePreview";
import {
  X,
  Megaphone,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cream: "#FFF8EE",
  gold: "#FACC15",
  cyan: "#38BDF8",
  blue: "#1877F2",
  pink: "#E4405F",
  orange: "#F97316",
};

const API_URL = "https://school-website-backend-ixx2.onrender.com";
const REQUEST_TIMEOUT_MS = 12000;

async function fetchJsonWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export const defaultNoticeSettings = {
  page_badge: "School Updates",
  page_title: "School Notices",
  page_description:
    "Stay informed with examination schedules, admissions, holidays, events and important announcements.",
  sidebar_title: "Need Assistance?",
  sidebar_description:
    "For questions about notices, admissions, examinations, or official documents, please contact the school office.",
  sidebar_button_text: "Contact School Office",
  sidebar_button_link: "/contact",
};

export const formatNoticeDate = (dateValue) => {
  if (!dateValue) return "No date";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function normalizeNotice(notice = {}) {
  return {
    id: notice.id,
    title: notice.title || "",
    category: notice.category || "General",
    notice_date: notice.notice_date || notice.date || "",
    description: notice.description || "",
    pdf_url: notice.pdf_url || notice.pdfUrl || "",
    file_url: notice.file_url || notice.fileUrl || "",
    file_type: notice.file_type || notice.fileType || "",
    pinned: Boolean(notice.pinned),
    created_at: notice.created_at || notice.createdAt || "",
  };
}

function getTime(value) {
  const time = new Date(value || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function sortNoticesNewestFirst(notices = []) {
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


function ActionButtons({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget,
  canDelete = false,
}) {
  if (!editMode) return null;

  return (
    <div className="absolute -top-3 -right-3 z-[90] flex items-center gap-2 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onEditTarget(target);
        }}
        className="w-9 h-9 rounded-full flex items-center justify-center shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
          color: "#020617",
          border: "1px solid rgba(255,255,255,0.85)",
        }}
        title="Edit"
      >
        <Pencil className="w-4 h-4" />
      </button>

      {canDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDeleteTarget(target);
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center shadow-xl"
          style={{
            background: "linear-gradient(135deg, #FEE2E2, #FCA5A5)",
            color: colors.red,
            border: "1px solid rgba(255,255,255,0.85)",
          }}
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function EditableWrap({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget = () => {},
  canDelete = false,
  className = "",
  children,
}) {
  if (!editMode) return children;

  return (
    <div className={`relative group ${className}`}>
      {children}
      <ActionButtons
        editMode={editMode}
        target={target}
        onEditTarget={onEditTarget}
        onDeleteTarget={onDeleteTarget}
        canDelete={canDelete}
      />
    </div>
  );
}

function AddNoticeButton({ editMode, onAddNotice }) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onAddNotice();
      }}
      className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition-all hover:-translate-y-0.5"
      style={{
        background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
        color: "#020617",
        boxShadow: "0 14px 34px rgba(56,189,248,0.24)",
      }}
    >
      <Plus className="w-4 h-4" />
      Add Notice
    </button>
  );
}

function ReactionButton({ type, emoji, count, isActive, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(type);
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 text-sm"
      style={{
        background: isActive
          ? "rgba(24,119,242,0.08)"
          : "rgba(15,23,42,0.04)",
        border: isActive
          ? "1px solid rgba(24,119,242,0.25)"
          : "1px solid transparent",
        color: isActive ? colors.blue : "#64748B",
      }}
    >
      <span className="text-base">{emoji}</span>
      {count > 0 && (
        <span
          className="text-xs font-bold"
          style={{ color: isActive ? colors.blue : "#64748B" }}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
}

function NoticeCard({
  notice,
  index,
  onClick,
  editMode = false,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
}) {
  const isPinned = notice.pinned === true;
  const accentColor = isPinned ? colors.red : colors.green;
  const fileUrl = notice.pdf_url || notice.file_url;
  const noticeId = notice.id || `notice-${index}`;

  const reactionTypes = [
    { type: "like", emoji: "👍", label: "Like" },
    { type: "heart", emoji: "❤️", label: "Love" },
    { type: "laugh", emoji: "😂", label: "Haha" },
    { type: "sad", emoji: "😢", label: "Sad" },
    { type: "fire", emoji: "🔥", label: "Fire" },
  ];

  const [reactions, setReactions] = useState({
    like: 0,
    heart: 0,
    laugh: 0,
    sad: 0,
    fire: 0,
  });

  const [userReaction, setUserReaction] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(`notice_reactions_${noticeId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReactions(
          parsed.counts || { like: 0, heart: 0, laugh: 0, sad: 0, fire: 0 }
        );
        setUserReaction(parsed.user || null);
      } catch (error) {
        console.error("Error loading reactions:", error);
      }
    }
  }, [noticeId]);

  const handleReaction = (type) => {
    if (editMode) return;

    const newReactions = { ...reactions };

    if (userReaction === type) {
      newReactions[type] = Math.max(0, newReactions[type] - 1);
      setUserReaction(null);
    } else {
      if (userReaction) {
        newReactions[userReaction] = Math.max(
          0,
          newReactions[userReaction] - 1
        );
      }

      newReactions[type] = (newReactions[type] || 0) + 1;
      setUserReaction(type);
    }

    setReactions(newReactions);

    localStorage.setItem(
      `notice_reactions_${noticeId}`,
      JSON.stringify({
        counts: newReactions,
        user: userReaction === type ? null : type,
      })
    );
  };

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

  const getTopReaction = () => {
    const sorted = Object.entries(reactions).sort((a, b) => b[1] - a[1]);
    const top = sorted.find(([, count]) => count > 0);

    if (top) {
      return reactionTypes.find((item) => item.type === top[0])?.emoji || "";
    }

    return null;
  };

  const topEmoji = getTopReaction();

  const handleDownload = async (e) => {
    e.stopPropagation();

    if (!fileUrl) return;

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileUrl.split("/").pop() || "notice.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <EditableWrap
      editMode={editMode}
      target={{ type: "notice", id: notice.id, index }}
      onEditTarget={onEditTarget}
      onDeleteTarget={onDeleteTarget}
      canDelete
    >
      <motion.article
        onClick={editMode ? () => onEditTarget({ type: "notice", id: notice.id, index }) : onClick}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
        className="group relative overflow-hidden rounded-[28px] bg-white transition-all duration-300 hover:-translate-y-1"
        style={{
          cursor: "pointer",
          border: editMode
            ? "1px dashed rgba(56,189,248,0.65)"
            : "1px solid rgba(15,23,42,0.08)",
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

        <div className="grid gap-4 p-6 pl-8 md:grid-cols-[145px_1fr] md:items-center">
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

            <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
              {notice.description || "Please open this notice for more details."}
            </p>

            {!editMode && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {reactionTypes.map(({ type, emoji }) => (
                  <ReactionButton
                    key={type}
                    type={type}
                    emoji={emoji}
                    count={reactions[type] || 0}
                    isActive={userReaction === type}
                    onClick={handleReaction}
                  />
                ))}

                {totalReactions > 0 && (
                  <div className="flex items-center gap-1 ml-1 text-xs text-slate-400">
                    <span className="text-sm">{topEmoji}</span>
                    <span className="font-medium">{totalReactions}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.article>
    </EditableWrap>
  );
}

function AnnouncementCard({ announcement, index, onClick }) {
  const fileUrl = announcement.image_url;

  const handleDownload = async (e) => {
    e.stopPropagation();

    if (!fileUrl) return;

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileUrl.split("/").pop() || "announcement.jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <motion.article
      onClick={onClick}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
      className="group relative overflow-hidden rounded-[28px] bg-white transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      style={{
        border: "1px solid rgba(215,25,32,0.12)",
        boxShadow:
          "0 16px 44px rgba(215,25,32,0.075), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-1.5 transition-all duration-300 group-hover:w-2"
        style={{
          background: `linear-gradient(180deg, ${colors.red}, ${colors.gold})`,
        }}
      />

      <div className="grid gap-5 p-6 pl-8 md:grid-cols-[145px_1fr_170px] md:items-center">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Announcement
          </div>

          <div className="mt-2 text-base font-black text-slate-900">
            {announcement.created_at
              ? formatNoticeDate(announcement.created_at)
              : "No date"}
          </div>

          <div className="mt-4">
            <span
              className="rounded-full px-3 py-1 text-xs font-black"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.16)",
              }}
            >
              Announcement
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <h3
            className="text-2xl text-slate-950 transition-colors duration-300 group-hover:text-red-600"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              letterSpacing: "-0.035em",
              lineHeight: 1.12,
            }}
          >
            {announcement.title || "Announcement"}
          </h3>

          <p className="mt-3 text-base leading-relaxed text-slate-500 line-clamp-2">
            {announcement.description || "Click to view full announcement."}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <span
            className="rounded-2xl px-5 py-3 text-sm font-black text-center"
            style={{
              background: fileUrl
                ? "rgba(215,25,32,0.08)"
                : "rgba(100,116,139,0.08)",
              color: fileUrl ? colors.red : "#94A3B8",
              border: fileUrl
                ? "1px solid rgba(215,25,32,0.15)"
                : "1px solid rgba(100,116,139,0.1)",
            }}
          >
            {fileUrl ? "Click to View" : "No Image"}
          </span>

          {fileUrl && (
            <button
              onClick={handleDownload}
              className="rounded-2xl px-5 py-3 text-sm font-black text-center transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: colors.dark,
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
              }}
            >
              Download
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function AnnouncementPopup({ announcement, onClose }) {
  if (!announcement) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="relative w-[95vw] max-w-[1400px] rounded-[32px] overflow-hidden flex flex-col"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 60px 160px rgba(0,0,0,0.45)",
            maxHeight: "95vh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="h-1.5 w-full flex-shrink-0"
            style={{ background: "linear-gradient(90deg, #D71920, #FACC15, #168A3A)" }}
          />

          <div
            className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#fafafa" }}
          >
            <div className="min-w-0 flex-1">
              <h2
                className="text-xl md:text-2xl font-black text-slate-950 truncate"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.035em" }}
              >
                {announcement.title || "Announcement"}
              </h2>
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ rotate: 180, scale: 1.15 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg flex-shrink-0 ml-4"
              style={{
                background: "#D71920",
                color: "#ffffff",
                boxShadow: "0 8px 24px rgba(215,25,32,0.35)",
              }}
            >
              <X className="h-6 w-6" strokeWidth={2.5} />
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {announcement.image_url && (
              <div className="mb-6 flex justify-center">
                <img
                  src={announcement.image_url}
                  alt={announcement.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-xl"
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {announcement.description}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function EmptyNotice({ editMode, onAddNotice }) {
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

      <div className="mt-6 flex justify-center">
        <AddNoticeButton editMode={editMode} onAddNotice={onAddNotice} />
      </div>
    </div>
  );
}

export default function Notices({
  editMode = false,
  noticesOverride = null,
  announcementsOverride = null,
  settingsOverride = null,
  loadingOverride = false,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddNotice = () => {},
  onViewAllNotices = () => {},
}) {
  const [notices, setNotices] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [settings, setSettings] = useState(defaultNoticeSettings);
  const [loading, setLoading] = useState(Boolean(loadingOverride));
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    if (editMode) {
      const noticeList = Array.isArray(noticesOverride)
        ? noticesOverride.map(normalizeNotice)
        : [];

      setNotices(sortNoticesNewestFirst(noticeList));
      setAnnouncements(Array.isArray(announcementsOverride) ? announcementsOverride : []);
      setSettings({ ...defaultNoticeSettings, ...(settingsOverride || {}) });
      setLoading(Boolean(loadingOverride));
      return;
    }

    setLoading(false);
    fetchSettings();
    fetchNotices();
    fetchAnnouncements();
  }, [editMode, noticesOverride, announcementsOverride, settingsOverride, loadingOverride]);

  const fetchNotices = async () => {
    try {
      const result = await fetchJsonWithTimeout(`${API_URL}/api/notices`);

      if (result?.success === false) return;

      const rawNotices = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : [];

      const noticeList = rawNotices.map(normalizeNotice);
      setNotices(sortNoticesNewestFirst(noticeList));
    } catch (error) {
      console.error("Fetch notices error:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const result = await fetchJsonWithTimeout(`${API_URL}/api/announcements`);

      if (result?.success === false) return;

      const rawAnnouncements = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : [];

      const visibleAnnouncements = rawAnnouncements.filter(
        (a) => a.visible !== false && a.active !== false
      );

      setAnnouncements(visibleAnnouncements);
    } catch (error) {
      console.error("Fetch announcements error:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const result = await fetchJsonWithTimeout(`${API_URL}/api/notice-settings`);

      if (result?.success === false) return;

      setSettings({
        ...defaultNoticeSettings,
        ...(result?.data || result || {}),
      });
    } catch (error) {
      console.error("Fetch notice settings error:", error);
    }
  };

  const importantCount = notices.filter((notice) => notice.pinned).length;

  const handleModalDownload = async (fileUrl) => {
    if (!fileUrl) return;

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileUrl.split("/").pop() || "notice.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(fileUrl, "_blank");
    }
  };

  const hasAnnouncements = announcements.length > 0;
  const hasNotices = notices.length > 0;
  const hasContent = hasAnnouncements || hasNotices;
  const displayedNotices = editMode ? notices.slice(0, 2) : notices;
  const hiddenNoticeCount = editMode ? Math.max(notices.length - 2, 0) : 0;

  return (
    <>
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
              <EditableWrap
                editMode={editMode}
                target={{ type: "pageHeader" }}
                onEditTarget={onEditTarget}
              >
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
              </EditableWrap>

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
                  <div
                    className="rounded-3xl p-4 text-center"
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <h3 className="text-4xl font-black text-slate-950">
                      {notices.length}
                    </h3>

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                      Notices
                    </p>
                  </div>

                  <div
                    className="rounded-3xl p-4 text-center"
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <h3 className="text-4xl font-black text-slate-950">
                      {importantCount}
                    </h3>

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                      Important
                    </p>
                  </div>

                  <div
                    className="rounded-3xl p-4 text-center"
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <h3 className="text-4xl font-black text-slate-950">
                      {announcements.length}
                    </h3>

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                      Announcements
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-8 items-start">
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
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                      Latest School Updates
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-sm font-semibold text-white/55">
                      Newest appears first
                    </div>
                    <AddNoticeButton editMode={editMode} onAddNotice={onAddNotice} />
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
                  Loading notice editor...
                </div>
              ) : !hasContent ? (
                <EmptyNotice editMode={editMode} onAddNotice={onAddNotice} />
              ) : (
                <>
                  {hasAnnouncements && !editMode && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Megaphone className="w-5 h-5" style={{ color: colors.red }} />
                        <h3
                          className="text-lg font-black text-slate-950"
                          style={{
                            fontFamily: "var(--font-display)",
                            letterSpacing: "-0.03em",
                          }}
                        >
                          Announcements
                        </h3>
                        <div
                          className="h-px flex-1"
                          style={{ background: "rgba(215,25,32,0.15)" }}
                        />
                      </div>
                      {announcements.map((announcement, index) => (
                        <AnnouncementCard
                          key={announcement.id || index}
                          announcement={announcement}
                          index={index}
                          onClick={() => setSelectedAnnouncement(announcement)}
                        />
                      ))}
                    </div>
                  )}

                  {hasNotices && (
                    <div className="space-y-5">
                      {hasAnnouncements && !editMode && (
                        <div className="flex items-center gap-2 mb-4 mt-6">
                          <div
                            className="h-px flex-1"
                            style={{ background: "rgba(22,138,58,0.15)" }}
                          />
                          <h3
                            className="text-lg font-black text-slate-950"
                            style={{
                              fontFamily: "var(--font-display)",
                              letterSpacing: "-0.03em",
                            }}
                          >
                            Notices
                          </h3>
                          <div
                            className="h-px flex-1"
                            style={{ background: "rgba(22,138,58,0.15)" }}
                          />
                        </div>
                      )}

                      {displayedNotices.map((notice, index) => (
                        <NoticeCard
                          key={notice.id || index}
                          notice={notice}
                          index={index}
                          editMode={editMode}
                          onEditTarget={onEditTarget}
                          onDeleteTarget={onDeleteTarget}
                          onClick={() => setSelectedNotice(notice)}
                        />
                      ))}

                      {hiddenNoticeCount > 0 && (
                        <button
                          type="button"
                          onClick={onViewAllNotices}
                          className="w-full rounded-2xl px-5 py-4 text-sm font-black transition-all hover:-translate-y-0.5"
                          style={{
                            background: "rgba(75,46,131,0.08)",
                            color: colors.purple,
                            border: "1px solid rgba(75,46,131,0.18)",
                          }}
                        >
                          View All Notices to manage remaining {hiddenNoticeCount} notice(s)
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedNotice && !editMode && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNotice(null)}
          >
            <motion.div
              className="bg-white rounded-[32px] max-w-6xl w-full max-h-[90vh] flex flex-col"
              style={{ overflow: "hidden" }}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="h-2 w-full flex-shrink-0"
                style={{
                  background: `linear-gradient(90deg, ${colors.red}, ${colors.gold}, ${colors.green})`,
                }}
              />

              {(() => {
                const isPinnedNotice = selectedNotice.pinned === true;
                const accentColor = isPinnedNotice ? colors.red : colors.green;
                const hasImage =
                  selectedNotice.file_url && selectedNotice.file_type === "image";
                const pdfSrc = selectedNotice.pdf_url || selectedNotice.file_url;
                const hasPdf = !hasImage && Boolean(pdfSrc);

                return (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-5 p-6 md:p-8 border-b border-slate-100 flex-shrink-0">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span
                            className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em]"
                            style={{
                              background: `${accentColor}10`,
                              color: accentColor,
                              border: `1px solid ${accentColor}24`,
                            }}
                          >
                            {selectedNotice.category || "General"}
                          </span>

                          <span className="text-sm font-semibold text-slate-400">
                            {formatNoticeDate(selectedNotice.notice_date)}
                          </span>
                        </div>

                        <h2
                          className="text-3xl md:text-4xl text-slate-950 leading-tight"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 850,
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {selectedNotice.title || "School Notice"}
                        </h2>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">

                        <button
                          onClick={() => setSelectedNotice(null)}
                          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all duration-300 flex-shrink-0"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-auto p-4 md:p-8">
                      {hasImage ? (
                        <img
                          src={selectedNotice.file_url}
                          alt={selectedNotice.title}
                          className="w-full rounded-xl"
                        />
                      ) : hasPdf ? (
                        <>
                          <div className="h-[70vh] rounded-[24px] overflow-hidden">
                            <PdfNoticePreview
                              fileUrl={pdfSrc}
                              title={selectedNotice.title || "Notice PDF"}
                            />
                          </div>
                        </>
                      ) : (
                        <div
                          className="rounded-3xl p-6 md:p-8"
                          style={{
                            background: "rgba(15,23,42,0.035)",
                            border: "1px solid rgba(15,23,42,0.06)",
                          }}
                        >
                          <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line">
                            {selectedNotice.description ||
                              "No further details were provided for this notice."}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAnnouncement && !editMode && (
          <AnnouncementPopup
            announcement={selectedAnnouncement}
            onClose={() => setSelectedAnnouncement(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}


