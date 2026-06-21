import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  CheckSquare,
  Square,
  ListChecks,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

function formatNoticeDate(dateValue) {
  if (!dateValue) return "No date";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function sortNoticesNewestFirst(notices = []) {
  return [...notices].sort((a, b) => {
    const createdA = new Date(a.createdAt || a.created_at || 0).getTime();
    const createdB = new Date(b.createdAt || b.created_at || 0).getTime();

    if (createdA !== createdB) return createdB - createdA;

    const dateA = new Date(a.date || a.notice_date || 0).getTime();
    const dateB = new Date(b.date || b.notice_date || 0).getTime();

    if (dateA !== dateB) return dateB - dateA;

    return String(b.id || "").localeCompare(String(a.id || ""));
  });
}

function mapNoticeFromBackend(notice) {
  return {
    id: notice.id,
    title: notice.title || "",
    category: notice.category || "",
    date: notice.notice_date || "",
    description: notice.description || "",
    pdfUrl: notice.pdf_url || "",
    pinned: notice.pinned || false,
    createdAt: notice.created_at || "",
  };
}

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function EditorCard({ title, children }) {
  return (
    <div
      className="rounded-3xl p-6"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
        border: "1px solid rgba(11,16,32,0.08)",
        boxShadow:
          "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
      }}
    >
      <h2 className="text-xl font-black text-slate-950 mb-5">{title}</h2>
      {children}
    </div>
  );
}

function NoticePreviewCard({ notice }) {
  const isPinned = notice.pinned === true;
  const accentColor = isPinned ? colors.red : colors.green;

  return (
    <div
      className="rounded-3xl bg-white p-6"
      style={{
        border: `1px solid ${accentColor}24`,
        boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
      }}
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
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
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: "rgba(215,25,32,0.09)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.16)",
            }}
          >
            Important
          </span>
        )}
      </div>

      <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {formatNoticeDate(notice.date)}
      </div>

      <h2 className="text-2xl font-black text-slate-950 mt-3 mb-3">
        {notice.title || "Notice Title"}
      </h2>

      <p className="text-slate-500 mb-5 leading-relaxed">
        {notice.description || "Notice description"}
      </p>

      {notice.pdfUrl ? (
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-slate-800 border border-slate-200">
            View PDF
          </span>

          <span
            className="px-4 py-2 rounded-xl text-sm font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${colors.green}, ${colors.purple})`,
            }}
          >
            Download PDF
          </span>
        </div>
      ) : (
        <span className="text-sm font-semibold text-slate-400">
          No PDF attached
        </span>
      )}
    </div>
  );
}

export default function AdminNotices() {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [selectedNoticeIds, setSelectedNoticeIds] = useState([]);
  const [showAllNotices, setShowAllNotices] = useState(false);

  const [pageSettings, setPageSettings] = useState({
    badge: "School Updates",
    title: "School Notices",
    description:
      "Stay informed with examination schedules, admissions, holidays, events and important announcements.",
  });

  const [calendar, setCalendar] = useState({
    title: "Nepali Calendar",
    subtitle: "Nepali date reference",
    embedUrl: "https://www.hamropatro.com/widgets/calender-small.php",
  });

  const [sidebar, setSidebar] = useState({
    title: "Admin Ready",
    description:
      "Notice title, date, category, description and PDF file can come directly from the admin dashboard.",
    buttonText: "Contact School Office",
    buttonLink: "/contact",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      await fetchNotices();
      await fetchSettings();
      setLoading(false);
    };

    loadData();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notice-settings");
      const result = await response.json();

      if (result.success && result.data) {
        const s = result.data;

        setPageSettings({
          badge: s.page_badge || "School Updates",
          title: s.page_title || "School Notices",
          description:
            s.page_description ||
            "Stay informed with examination schedules, admissions, holidays, events and important announcements.",
        });

        setCalendar({
          title: s.calendar_title || "Nepali Calendar",
          subtitle: s.calendar_subtitle || "Nepali date reference",
          embedUrl:
            s.calendar_embed_url ||
            "https://www.hamropatro.com/widgets/calender-small.php",
        });

        setSidebar({
          title: s.sidebar_title || "Admin Ready",
          description:
            s.sidebar_description ||
            "Notice title, date, category, description and PDF file can come directly from the admin dashboard.",
          buttonText: s.sidebar_button_text || "Contact School Office",
          buttonLink: s.sidebar_button_link || "/contact",
        });
      }
    } catch (err) {
      console.error("Fetch notice settings error:", err);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notices");
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const mapped = result.data.map(mapNoticeFromBackend);
        setNotices(sortNoticesNewestFirst(mapped));
      }
    } catch (err) {
      console.error("Fetch notices error:", err);
    }
  };

  const addNotice = () => {
    navigate("/admin/notices/new");
  };

  const updateNotice = (id, field, value) => {
    setNotices((prev) =>
      prev.map((notice) =>
        notice.id === id ? { ...notice, [field]: value } : notice
      )
    );
  };

  const deleteNotice = async (id) => {
    const ok = window.confirm("Delete this notice permanently?");
    if (!ok) return;

    setSuccess("");
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:5000/api/notices/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete notice.");
      }

      setNotices((prev) => prev.filter((notice) => notice.id !== id));
      setSelectedNoticeIds((prev) => prev.filter((item) => item !== id));
      setSuccess("Notice deleted permanently.");
    } catch (err) {
      console.error("Delete notice error:", err);
      setError(err.message || "Failed to delete notice.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSelectedNotices = async () => {
    if (selectedNoticeIds.length === 0) {
      setError("Please select at least one notice to delete.");
      return;
    }

    const ok = window.confirm(
      `Delete ${selectedNoticeIds.length} selected notice(s) permanently?`
    );
    if (!ok) return;

    setSuccess("");
    setError("");
    setSaving(true);

    try {
      for (const id of selectedNoticeIds) {
        const response = await fetch(`http://localhost:5000/api/notices/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to delete selected notice.");
        }
      }

      setNotices((prev) =>
        prev.filter((notice) => !selectedNoticeIds.includes(notice.id))
      );
      setSelectedNoticeIds([]);
      setSuccess("Selected notices deleted permanently.");
    } catch (err) {
      console.error("Delete selected notices error:", err);
      setError(err.message || "Failed to delete selected notices.");
      await fetchNotices();
    } finally {
      setSaving(false);
    }
  };

  const toggleSelectedNotice = (id) => {
    setSelectedNoticeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedNoticeIds.length === notices.length) {
      setSelectedNoticeIds([]);
      return;
    }

    setSelectedNoticeIds(notices.map((notice) => notice.id));
  };

  const uploadNoticePdf = async (noticeId, file) => {
    if (!file) return;

    setSuccess("");
    setError("");

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    const maxSize = 10 * 1024 * 1024;

    if (!isPdf) {
      setError("Please upload only a PDF file.");
      return;
    }

    if (file.size > maxSize) {
      setError("PDF file must be less than 10 MB.");
      return;
    }

    setUploadingId(noticeId);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      const uploadedUrl =
        result?.url ||
        result?.imageUrl ||
        result?.fileUrl ||
        result?.data?.url ||
        result?.data?.imageUrl ||
        result?.data?.fileUrl;

      if (!response.ok || !uploadedUrl) {
        setError(result?.message || "PDF upload failed.");
        return;
      }

      updateNotice(noticeId, "pdfUrl", uploadedUrl);
      setSuccess("PDF uploaded successfully. Click Save Changes to publish it.");
    } catch (err) {
      console.error("PDF upload error:", err);
      setError("PDF upload failed. Make sure backend /api/upload is working.");
    } finally {
      setUploadingId(null);
    }
  };

  const saveChanges = async () => {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      for (const notice of notices) {
        if (!notice.title.trim()) continue;

        const response = await fetch(
          `http://localhost:5000/api/notices/${notice.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: notice.title,
              category: notice.category,
              notice_date: notice.date || null,
              description: notice.description,
              pdf_url: notice.pdfUrl,
              pinned: notice.pinned,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to update one notice.");
        }
      }

      const settingsResponse = await fetch(
        "http://localhost:5000/api/notice-settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page_badge: pageSettings.badge,
            page_title: pageSettings.title,
            page_description: pageSettings.description,

            calendar_title: calendar.title,
            calendar_subtitle: calendar.subtitle,
            calendar_embed_url: calendar.embedUrl,

            sidebar_title: sidebar.title,
            sidebar_description: sidebar.description,
            sidebar_button_text: sidebar.buttonText,
            sidebar_button_link: sidebar.buttonLink,
          }),
        }
      );

      const settingsResult = await settingsResponse.json();

      if (!settingsResponse.ok || !settingsResult.success) {
        throw new Error(settingsResult.message || "Failed to save settings.");
      }

      setSuccess("Notices updated successfully.");
      await fetchNotices();
      await fetchSettings();
    } catch (err) {
      console.error("Save notices error:", err);
      setError(err.message || "Failed to save notices.");
    } finally {
      setSaving(false);
    }
  };

  const previewNotices = sortNoticesNewestFirst(notices);
  const mainVisibleNotices = previewNotices.slice(0, 2);
  const hasMoreThanTwo = previewNotices.length > 2;
  const allSelected =
    notices.length > 0 && selectedNoticeIds.length === notices.length;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFF8EE" }}
      >
        <div className="font-bold text-slate-600">
          Loading notice editor...
        </div>
      </div>
    );
  }

  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(250,204,21,0.12), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <header
        className="sticky top-0 z-40"
        style={{
          background:
            "linear-gradient(145deg, rgba(2,6,23,0.96), rgba(15,23,42,0.88))",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 18px 52px rgba(0,0,0,0.22)",
          backdropFilter: "blur(22px)",
        }}
      >
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link
  to="/admin/dashboard"
  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all hover:scale-105"
  style={{
    color: "#FFFFFF",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
  }}
>
  <ArrowLeft
    className="w-5 h-5"
    style={{ color: "#FFFFFF" }}
  />
  <span style={{ color: "#FFFFFF" }}>
    Back to Dashboard
  </span>
</Link>
          <div className="flex items-center gap-3">
            <a
              href="/notices"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Notices Page
            </a>

            <button
              onClick={saveChanges}
              disabled={saving || Boolean(uploadingId)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all hover:scale-105 disabled:opacity-60"
              style={{
                color: "#020617",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                boxShadow:
                  "0 18px 42px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        <div className="mb-8">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(215,25,32,0.1)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.2)",
            }}
          >
            <Bell className="w-4 h-4" />
            Manage Notices
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
            Notice Manager
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Manage the latest two notices here. Use View All Notices to select
            and delete multiple notices.
          </p>
        </div>

        {success && (
          <div
            className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold"
            style={{
              background: "rgba(22,138,58,0.1)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.2)",
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </div>
        )}

        {error && (
          <div
            className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold"
            style={{
              background: "rgba(215,25,32,0.1)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.2)",
            }}
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid xl:grid-cols-[640px_1fr] gap-8 items-start">
          <div className="space-y-6">
            <EditorCard title="Notices">
              <div className="grid md:grid-cols-2 gap-3 mb-6">
                <button
                  onClick={addNotice}
                  className="w-full p-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                    boxShadow: "0 14px 34px rgba(75,46,131,0.22)",
                  }}
                >
                  <Plus className="w-5 h-5" />
                  Add New Notice
                </button>

                <button
                  type="button"
                  onClick={() => setShowAllNotices(true)}
                  className="w-full p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  style={{
                    color: colors.dark,
                    background: "rgba(255,255,255,0.88)",
                    border: "1px solid rgba(75,46,131,0.18)",
                    boxShadow: "0 12px 28px rgba(11,16,32,0.06)",
                  }}
                >
                  <ListChecks className="w-5 h-5" />
                  View All Notices ({notices.length})
                </button>
              </div>

              {notices.length === 0 ? (
                <div
                  className="rounded-3xl p-8 text-center"
                  style={{
                    background: "rgba(248,250,252,0.82)",
                    border: "1px dashed rgba(100,116,139,0.24)",
                  }}
                >
                  <FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                  <div className="font-bold text-slate-800">
                    No notices added
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Click Add New Notice to create your first notice.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {mainVisibleNotices.map((notice, index) => (
                    <div
                      key={notice.id}
                      className="rounded-3xl p-5"
                      style={{
                        background:
                          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(248,250,252,0.86))",
                        border: "1px solid rgba(11,16,32,0.08)",
                        boxShadow:
                          "0 12px 30px rgba(11,16,32,0.055), inset 0 1px 0 rgba(255,255,255,0.85)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div>
                          <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-2">
                            Notice {index + 1}
                          </div>

                          <div className="font-black text-slate-950">
                            {notice.title || "Untitled notice"}
                          </div>

                          <div className="text-sm text-slate-500">
                            {notice.category || "No category"} ·{" "}
                            {formatNoticeDate(notice.date)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteNotice(notice.id)}
                          disabled={saving}
                          className="p-3 rounded-xl disabled:opacity-50"
                          style={{
                            background: "rgba(215,25,32,0.09)",
                            color: colors.red,
                            border: "1px solid rgba(215,25,32,0.18)",
                          }}
                          title="Delete notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid gap-4">
                        <Field
                          label="Notice Title"
                          value={notice.title}
                          onChange={(value) =>
                            updateNotice(notice.id, "title", value)
                          }
                          placeholder="Notice Title"
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                          <Field
                            label="Category"
                            value={notice.category}
                            onChange={(value) =>
                              updateNotice(notice.id, "category", value)
                            }
                            placeholder="Exam / Holiday / Admission"
                          />

                          <Field
                            label="Notice Date"
                            type="date"
                            value={notice.date}
                            onChange={(value) =>
                              updateNotice(notice.id, "date", value)
                            }
                          />
                        </div>

                        <TextArea
                          label="Description"
                          rows={4}
                          value={notice.description}
                          onChange={(value) =>
                            updateNotice(notice.id, "description", value)
                          }
                          placeholder="Notice description"
                        />

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Notice PDF
                          </label>

                          <label
                            className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-2xl p-5 text-center transition"
                            style={{
                              background: "rgba(255,255,255,0.72)",
                              border: "1px dashed rgba(75,46,131,0.28)",
                            }}
                          >
                            <UploadCloud
                              className="w-7 h-7"
                              style={{ color: colors.purple }}
                            />

                            <span className="font-bold text-slate-800">
                              {uploadingId === notice.id
                                ? "Uploading PDF..."
                                : "Upload PDF from device"}
                            </span>

                            <span className="text-xs text-slate-500 leading-relaxed">
                              PDF only, maximum 10 MB. Click Save Changes after
                              upload.
                            </span>

                            <input
                              type="file"
                              accept="application/pdf,.pdf"
                              disabled={uploadingId === notice.id}
                              onChange={(e) => {
                                uploadNoticePdf(
                                  notice.id,
                                  e.target.files?.[0]
                                );
                                e.target.value = "";
                              }}
                              className="hidden"
                            />
                          </label>

                          {notice.pdfUrl && (
                            <div
                              className="mt-3 rounded-2xl px-4 py-4"
                              style={{
                                background: "rgba(22,138,58,0.08)",
                                border: "1px solid rgba(22,138,58,0.18)",
                              }}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <FileText
                                  className="w-4 h-4"
                                  style={{ color: colors.green }}
                                />

                                <span
                                  className="text-sm font-bold truncate"
                                  style={{ color: colors.green }}
                                >
                                  PDF uploaded
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <a
                                  href={notice.pdfUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition"
                                >
                                  View PDF
                                </a>

                                <a
                                  href={notice.pdfUrl}
                                  download
                                  className="px-4 py-2 rounded-xl text-sm font-bold text-white transition"
                                  style={{
                                    background: `linear-gradient(135deg, ${colors.green}, ${colors.purple})`,
                                  }}
                                >
                                  Download PDF
                                </a>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateNotice(notice.id, "pdfUrl", "")
                                  }
                                  className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-red-100 hover:bg-red-500 hover:text-white transition"
                                  style={{ color: colors.red }}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer select-none text-sm font-bold text-slate-700">
                          <input
                            type="checkbox"
                            className="w-5 h-5"
                            checked={notice.pinned}
                            onChange={(e) =>
                              updateNotice(
                                notice.id,
                                "pinned",
                                e.target.checked
                              )
                            }
                          />
                          Pin this notice as important
                        </label>
                      </div>
                    </div>
                  ))}

                  {hasMoreThanTwo && (
                    <button
                      type="button"
                      onClick={() => setShowAllNotices(true)}
                      className="w-full py-4 rounded-2xl font-black transition-all hover:scale-[1.01]"
                      style={{
                        color: colors.purple,
                        background: "rgba(75,46,131,0.08)",
                        border: "1px solid rgba(75,46,131,0.18)",
                      }}
                    >
                      View All Notices to manage remaining{" "}
                      {previewNotices.length - 2} notice(s)
                    </button>
                  )}
                </div>
              )}
            </EditorCard>

            <EditorCard title="Page Settings">
              <div className="grid gap-4">
                <Field
                  label="Page Badge"
                  value={pageSettings.badge}
                  onChange={(value) =>
                    setPageSettings({ ...pageSettings, badge: value })
                  }
                />

                <Field
                  label="Page Title"
                  value={pageSettings.title}
                  onChange={(value) =>
                    setPageSettings({ ...pageSettings, title: value })
                  }
                />

                <TextArea
                  label="Page Description"
                  rows={3}
                  value={pageSettings.description}
                  onChange={(value) =>
                    setPageSettings({
                      ...pageSettings,
                      description: value,
                    })
                  }
                />
              </div>
            </EditorCard>

            <EditorCard title="Calendar Settings">
              <div className="grid gap-4">
                <Field
                  label="Calendar Title"
                  value={calendar.title}
                  onChange={(value) =>
                    setCalendar({ ...calendar, title: value })
                  }
                />

                <Field
                  label="Calendar Subtitle"
                  value={calendar.subtitle}
                  onChange={(value) =>
                    setCalendar({ ...calendar, subtitle: value })
                  }
                />

                <Field
                  label="Embed URL"
                  value={calendar.embedUrl}
                  onChange={(value) =>
                    setCalendar({ ...calendar, embedUrl: value })
                  }
                />
              </div>
            </EditorCard>

            <EditorCard title="Sidebar Card">
              <div className="grid gap-4">
                <Field
                  label="Card Title"
                  value={sidebar.title}
                  onChange={(value) => setSidebar({ ...sidebar, title: value })}
                />

                <TextArea
                  label="Card Description"
                  rows={3}
                  value={sidebar.description}
                  onChange={(value) =>
                    setSidebar({ ...sidebar, description: value })
                  }
                />

                <Field
                  label="Button Text"
                  value={sidebar.buttonText}
                  onChange={(value) =>
                    setSidebar({ ...sidebar, buttonText: value })
                  }
                />

                <Field
                  label="Button Link"
                  value={sidebar.buttonLink}
                  onChange={(value) =>
                    setSidebar({ ...sidebar, buttonLink: value })
                  }
                />
              </div>
            </EditorCard>
          </div>

          <aside
            className="xl:sticky xl:top-28 rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.94))",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 22px 58px rgba(11,16,32,0.25)",
            }}
          >
            <div className="p-5 border-b border-white/10">
              <div className="text-white font-bold text-lg">
                Notices Page Preview
              </div>

              <div className="text-sm text-white/55">
                Newest notice appears first.
              </div>
            </div>

            <div
              className="bg-white overflow-y-auto"
              style={{ height: "760px" }}
            >
              <div
                className="min-h-full p-6"
                style={{
                  background:
                    "radial-gradient(circle at top right, rgba(124,92,196,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
                }}
              >
                <div className="text-center mb-8">
                  <span
                    className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold"
                    style={{
                      background: "rgba(215,25,32,0.08)",
                      color: colors.red,
                      border: "1px solid rgba(215,25,32,0.14)",
                    }}
                  >
                    {pageSettings.badge}
                  </span>

                  <h1
                    className="text-4xl font-black mt-5 text-slate-950"
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.045em",
                    }}
                  >
                    {pageSettings.title}
                  </h1>

                  <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                    {pageSettings.description}
                  </p>
                </div>

                <div className="space-y-5">
                  {previewNotices.length === 0 ? (
                    <div className="rounded-3xl bg-white p-8 border text-center">
                      <FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                      <div className="font-bold text-slate-800">
                        No notices added
                      </div>
                    </div>
                  ) : (
                    previewNotices.slice(0, 3).map((notice) => (
                      <NoticePreviewCard key={notice.id} notice={notice} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showAllNotices && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-5"
          style={{
            background: "rgba(2,6,23,0.72)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            className="w-full max-w-5xl rounded-[30px] overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
            }}
          >
            <div
              className="p-5 flex items-center justify-between gap-4"
              style={{
                background:
                  "linear-gradient(145deg, rgba(2,6,23,0.96), rgba(15,23,42,0.9))",
              }}
            >
              <div>
                <div className="text-white text-xl font-black">
                  All Notices
                </div>
                <div className="text-sm text-white/55">
                  Select one, many, or all notices to delete.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAllNotices(false)}
                className="p-3 rounded-2xl text-white"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black"
                  style={{
                    background: "rgba(75,46,131,0.08)",
                    color: colors.purple,
                    border: "1px solid rgba(75,46,131,0.18)",
                  }}
                >
                  {allSelected ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                  {allSelected ? "Unselect All" : "Select All"}
                </button>

                <button
                  type="button"
                  onClick={deleteSelectedNotices}
                  disabled={saving || selectedNoticeIds.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black disabled:opacity-50"
                  style={{
                    background: "rgba(215,25,32,0.1)",
                    color: colors.red,
                    border: "1px solid rgba(215,25,32,0.2)",
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Selected ({selectedNoticeIds.length})
                </button>
              </div>

              <div className="max-h-[62vh] overflow-y-auto pr-1 space-y-3">
                {previewNotices.length === 0 ? (
                  <div className="rounded-3xl p-10 text-center border border-slate-200">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <div className="font-black text-slate-900">
                      No notices available
                    </div>
                  </div>
                ) : (
                  previewNotices.map((notice, index) => {
                    const checked = selectedNoticeIds.includes(notice.id);

                    return (
                      <button
                        key={notice.id}
                        type="button"
                        onClick={() => toggleSelectedNotice(notice.id)}
                        className="w-full text-left rounded-3xl p-4 flex items-start gap-4 transition-all hover:-translate-y-0.5"
                        style={{
                          background: checked
                            ? "rgba(75,46,131,0.09)"
                            : "rgba(255,255,255,0.84)",
                          border: checked
                            ? "1px solid rgba(75,46,131,0.28)"
                            : "1px solid rgba(15,23,42,0.08)",
                        }}
                      >
                        <div
                          className="mt-1"
                          style={{
                            color: checked ? colors.purple : "#94A3B8",
                          }}
                        >
                          {checked ? (
                            <CheckSquare className="w-6 h-6" />
                          ) : (
                            <Square className="w-6 h-6" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-1">
                            Notice {index + 1}
                          </div>

                          <div className="font-black text-slate-950 truncate">
                            {notice.title || "Untitled notice"}
                          </div>

                          <div className="text-sm text-slate-500">
                            {notice.category || "No category"} ·{" "}
                            {formatNoticeDate(notice.date)}
                          </div>

                          <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                            {notice.description || "No description"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotice(notice.id);
                          }}
                          disabled={saving}
                          className="p-3 rounded-xl disabled:opacity-50"
                          style={{
                            background: "rgba(215,25,32,0.09)",
                            color: colors.red,
                            border: "1px solid rgba(215,25,32,0.18)",
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}