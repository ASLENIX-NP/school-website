import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Eye,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

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

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
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
        setNotices(
          result.data.map((notice) => ({
            id: notice.id,
            title: notice.title || "",
            category: notice.category || "",
            date: notice.notice_date || "",
            description: notice.description || "",
            pdfUrl: notice.pdf_url || "",
            pinned: notice.pinned || false,
          }))
        );
      }
    } catch (err) {
      console.error("Fetch notices error:", err);
    }
  };

  const addNotice = () => {
    setNotices([
      {
        id: Date.now(),
        title: "",
        category: "",
        date: "",
        description: "",
        pdfUrl: "",
        pinned: false,
      },
      ...notices,
    ]);
  };

  const updateNotice = (id, field, value) => {
    setNotices((prev) =>
      prev.map((notice) =>
        notice.id === id ? { ...notice, [field]: value } : notice
      )
    );
  };

  const deleteNotice = (id) => {
    setNotices((prev) => prev.filter((notice) => notice.id !== id));
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
      await fetch("http://localhost:5000/api/notices", {
        method: "DELETE",
      });

      for (const notice of notices) {
        if (!notice.title.trim()) continue;

        await fetch("http://localhost:5000/api/notices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: notice.title,
            category: notice.category,
            notice_date: notice.date,
            description: notice.description,
            pdf_url: notice.pdfUrl,
            pinned: notice.pinned,
          }),
        });
      }

      await fetch("http://localhost:5000/api/notice-settings", {
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
      });

      setSuccess("Notices saved successfully.");
      await fetchNotices();
      await fetchSettings();
    } catch (err) {
      console.error("Save notices error:", err);
      setError("Failed to save notices. Check backend connection.");
    } finally {
      setSaving(false);
    }
  };

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
            className="inline-flex items-center gap-2 text-white font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
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
              disabled={saving || uploadingId}
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
            Edit Notice Content
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Add notices, upload PDF files, pin important notices, and update the
            notice page heading, calendar, and sidebar card.
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

        <div className="grid xl:grid-cols-[620px_1fr] gap-8 items-start">
          <div className="space-y-6">
            <button
              onClick={addNotice}
              className="w-full p-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              style={{
                background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                boxShadow: "0 14px 34px rgba(75,46,131,0.22)",
              }}
            >
              <Plus className="w-5 h-5" />
              Add Notice
            </button>

            {notices.length === 0 && (
              <EditorCard title="No Notices Yet">
                <div className="text-center">
                  <FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                  <div className="font-bold text-slate-800">
                    No notices added
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Click Add Notice to create your first notice.
                  </p>
                </div>
              </EditorCard>
            )}

            {notices.map((notice, index) => (
              <EditorCard key={notice.id} title={`Notice ${index + 1}`}>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="font-black text-slate-950">
                      {notice.title || "Untitled notice"}
                    </div>
                    <div className="text-sm text-slate-500">
                      {notice.category || "No category"}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteNotice(notice.id)}
                    className="p-3 rounded-xl"
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
                        PDF only, maximum 10 MB. Click Save Changes after upload.
                      </span>

                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        disabled={uploadingId === notice.id}
                        onChange={(e) => {
                          uploadNoticePdf(notice.id, e.target.files?.[0]);
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
                        updateNotice(notice.id, "pinned", e.target.checked)
                      }
                    />
                    Pin this notice as important
                  </label>
                </div>
              </EditorCard>
            ))}

            <EditorCard title="Page Settings">
              <div className="grid gap-4">
                <Field
                  label="Page Badge"
                  value={pageSettings.badge}
                  onChange={(value) =>
                    setPageSettings({
                      ...pageSettings,
                      badge: value,
                    })
                  }
                />

                <Field
                  label="Page Title"
                  value={pageSettings.title}
                  onChange={(value) =>
                    setPageSettings({
                      ...pageSettings,
                      title: value,
                    })
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
                  onChange={(value) =>
                    setSidebar({ ...sidebar, title: value })
                  }
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
              <div className="text-white font-bold text-lg flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Notices Page Preview
              </div>

              <div className="text-sm text-white/55">
                Preview updates while editing.
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
                    "radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
                }}
              >
                <div className="text-center mb-10">
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
                    className="text-5xl font-black mt-5 text-slate-950"
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

                <div className="grid gap-6">
                  {notices.length === 0 && (
                    <div className="rounded-3xl bg-white p-8 border text-center">
                      <FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                      <div className="font-bold text-slate-800">
                        No notices added
                      </div>
                    </div>
                  )}

                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="rounded-3xl bg-white p-6"
                      style={{
                        border: "1px solid rgba(15,23,42,0.08)",
                        boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
                      }}
                    >
                      <div className="grid md:grid-cols-[120px_1fr] gap-5">
                        <div>
                          <div
                            className="w-16 h-1 rounded-full mb-4"
                            style={{
                              background: notice.pinned
                                ? colors.red
                                : colors.green,
                            }}
                          />

                          <div className="text-sm font-black text-slate-950">
                            {formatNoticeDate(notice.date)}
                          </div>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{
                                background: "rgba(22,138,58,0.1)",
                                color: colors.green,
                              }}
                            >
                              {notice.category || "Category"}
                            </span>

                            {notice.pinned && (
                              <span
                                className="px-3 py-1 rounded-full text-xs font-bold"
                                style={{
                                  background: "rgba(215,25,32,0.1)",
                                  color: colors.red,
                                }}
                              >
                                Important
                              </span>
                            )}
                          </div>

                          <h2 className="text-2xl font-black text-slate-950 mb-3">
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
                      </div>
                    </div>
                  ))}

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="bg-white rounded-3xl p-5 border">
                      <h3 className="font-black text-2xl">{calendar.title}</h3>
                      <p className="text-slate-500 mb-4">{calendar.subtitle}</p>

                      <iframe
                        title="Nepali Calendar"
                        src={
                          calendar.embedUrl ||
                          "https://www.hamropatro.com/widgets/calender-small.php"
                        }
                        className="w-full h-[330px] border-0 rounded-xl"
                      />
                    </div>

                    <div
                      className="p-5 rounded-3xl text-white shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${colors.dark}, ${colors.purple})`,
                      }}
                    >
                      <div
                        className="w-16 h-1 rounded-full mb-5"
                        style={{
                          background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
                        }}
                      />

                      <h3 className="font-bold text-xl">{sidebar.title}</h3>

                      <p className="mt-3 text-white/70 text-sm leading-relaxed">
                        {sidebar.description}
                      </p>

                      <span className="inline-block mt-5 font-bold bg-white/10 px-4 py-2 rounded-xl text-center text-sm border border-white/20">
                        {sidebar.buttonText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}