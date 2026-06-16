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
} from "lucide-react";

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
      "Notice title, date, category, description and PDF file can later come directly from the admin dashboard.",
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
            "Notice title, date, category, description and PDF file can later come directly from the admin dashboard.",
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="font-bold text-slate-600">Loading notice editor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div
        className="h-[82px] flex items-center"
        style={{
          background:
            "linear-gradient(135deg,#020617 0%, #0F172A 40%, #1E293B 100%)",
        }}
      >
        <div className="max-w-[1600px] mx-auto w-full px-8 flex items-center justify-between">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 text-white text-base font-medium hover:opacity-80 transition"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "#FFFFFF" }} />
            <span style={{ color: "#FFFFFF" }}>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="/notices"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-3xl border border-white/10 bg-white/5 text-white font-semibold flex items-center gap-3"
            >
              <Eye className="w-5 h-5" />
              View Full Notices
            </a>

            <button
              onClick={saveChanges}
              disabled={saving || uploadingId}
              className="px-8 py-4 rounded-3xl font-semibold flex items-center gap-3 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg,#FACC15,#67E8F9)",
                color: "#0B1020",
              }}
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold">
              <Bell className="w-4 h-4" />
              Manage Notices
            </span>

            <h1 className="text-5xl font-black mt-4">Edit Notice Content</h1>

            <p className="text-slate-500 mt-3">
              Add, edit, delete, upload PDF, and preview notices.
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-6 rounded-2xl px-5 py-4 bg-green-50 text-green-700 border border-green-100 flex items-center gap-3 font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl px-5 py-4 bg-red-50 text-red-700 border border-red-100 flex items-center gap-3 font-semibold">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-[520px_1fr] gap-8">
          <div className="space-y-6">
            <button
              onClick={addNotice}
              className="w-full p-4 rounded-2xl bg-blue-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition"
            >
              <Plus className="w-5 h-5" />
              Add Notice
            </button>

            {notices.length === 0 && (
              <div className="bg-white rounded-3xl p-6 border text-center">
                <FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                <div className="font-bold text-slate-800">No notices yet</div>
                <p className="text-sm text-slate-500 mt-1">
                  Click Add Notice to create your first notice.
                </p>
              </div>
            )}

            {notices.map((notice, index) => (
              <div key={notice.id} className="bg-white rounded-3xl p-6 border">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-xl">Notice #{index + 1}</h3>

                  <button onClick={() => deleteNotice(notice.id)}>
                    <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    className="w-full border rounded-xl p-3"
                    placeholder="Notice Title"
                    value={notice.title}
                    onChange={(e) =>
                      updateNotice(notice.id, "title", e.target.value)
                    }
                  />

                  <input
                    className="w-full border rounded-xl p-3"
                    placeholder="Category"
                    value={notice.category}
                    onChange={(e) =>
                      updateNotice(notice.id, "category", e.target.value)
                    }
                  />

                  <input
                    type="date"
                    className="w-full border rounded-xl p-3"
                    value={notice.date}
                    onChange={(e) =>
                      updateNotice(notice.id, "date", e.target.value)
                    }
                  />

                  <textarea
                    rows={4}
                    className="w-full border rounded-xl p-3"
                    placeholder="Description"
                    value={notice.description}
                    onChange={(e) =>
                      updateNotice(notice.id, "description", e.target.value)
                    }
                  />

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Notice PDF
                    </label>

                    <label className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-2xl p-5 text-center border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition">
                      <UploadCloud className="w-7 h-7 text-purple-700" />

                      <span className="font-bold text-slate-800">
                        {uploadingId === notice.id
                          ? "Uploading PDF..."
                          : "Upload PDF from device"}
                      </span>

                      <span className="text-xs text-slate-500 leading-relaxed">
                        Recommended: PDF only, maximum 10 MB.
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
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-green-50 border border-green-100 px-4 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-green-700 flex-shrink-0" />
                          <span className="text-sm font-semibold text-green-700 truncate">
                            PDF uploaded
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={notice.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-bold text-green-700 hover:underline"
                          >
                            View
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              updateNotice(notice.id, "pdfUrl", "")
                            }
                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                            title="Remove PDF"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={notice.pinned}
                      onChange={(e) =>
                        updateNotice(notice.id, "pinned", e.target.checked)
                      }
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Pinned Notice
                    </span>
                  </label>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-3xl p-6 border">
              <h2 className="font-bold text-xl mb-4">Page Settings</h2>
              <div className="space-y-4">
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Page Badge"
                  value={pageSettings.badge}
                  onChange={(e) =>
                    setPageSettings({
                      ...pageSettings,
                      badge: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Page Title"
                  value={pageSettings.title}
                  onChange={(e) =>
                    setPageSettings({
                      ...pageSettings,
                      title: e.target.value,
                    })
                  }
                />
                <textarea
                  rows={3}
                  className="w-full border rounded-xl p-3"
                  placeholder="Page Description"
                  value={pageSettings.description}
                  onChange={(e) =>
                    setPageSettings({
                      ...pageSettings,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border">
              <h2 className="font-bold text-xl mb-4">Calendar Settings</h2>
              <div className="space-y-4">
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Calendar Title"
                  value={calendar.title}
                  onChange={(e) =>
                    setCalendar({ ...calendar, title: e.target.value })
                  }
                />
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Calendar Subtitle"
                  value={calendar.subtitle}
                  onChange={(e) =>
                    setCalendar({ ...calendar, subtitle: e.target.value })
                  }
                />
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Embed URL Override"
                  value={calendar.embedUrl}
                  onChange={(e) =>
                    setCalendar({ ...calendar, embedUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border">
              <h2 className="font-bold text-xl mb-4">Sidebar Card</h2>
              <div className="space-y-4">
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Card Title"
                  value={sidebar.title}
                  onChange={(e) =>
                    setSidebar({ ...sidebar, title: e.target.value })
                  }
                />
                <textarea
                  rows={3}
                  className="w-full border rounded-xl p-3"
                  placeholder="Card Description"
                  value={sidebar.description}
                  onChange={(e) =>
                    setSidebar({ ...sidebar, description: e.target.value })
                  }
                />
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Button Text"
                  value={sidebar.buttonText}
                  onChange={(e) =>
                    setSidebar({ ...sidebar, buttonText: e.target.value })
                  }
                />
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Button Action URL Link"
                  value={sidebar.buttonLink}
                  onChange={(e) =>
                    setSidebar({ ...sidebar, buttonLink: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="sticky top-6 h-[90vh] overflow-y-auto">
            <div
              className="rounded-[32px] overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
                border: "1px solid rgba(11,16,32,0.08)",
                boxShadow: "0 18px 48px rgba(11,16,32,0.075)",
              }}
            >
              <div className="p-5 border-b bg-white">
                <h2 className="text-2xl font-black">
                  Live Notice Page Preview
                </h2>
                <p className="text-slate-500 mt-1">
                  Updates instantly while typing
                </p>
              </div>

              <div className="p-6">
                <div className="text-center mb-10">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold">
                    <Bell className="w-4 h-4" />
                    {pageSettings.badge}
                  </span>

                  <h1 className="text-5xl font-black mt-5">
                    {pageSettings.title}
                  </h1>

                  <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                    {pageSettings.description}
                  </p>
                </div>

                <div className="grid lg:grid-cols-[1fr_320px] gap-8 mt-10">
                  <div className="space-y-6">
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
                        className="rounded-3xl bg-white p-6 border shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            {notice.category || "Category"}
                          </span>
                          <span className="text-slate-500">
                            {notice.date || "Date"}
                          </span>
                        </div>

                        <h2 className="text-3xl font-black mb-3">
                          {notice.title || "Notice Title"}
                        </h2>

                        <p className="text-slate-600 mb-5">
                          {notice.description || "Notice description"}
                        </p>

                        <button
                          className="px-5 py-3 rounded-xl text-white font-bold transition opacity-90 hover:opacity-100"
                          style={{
                            background:
                              "linear-gradient(135deg,#168A3A,#4B2E83)",
                          }}
                        >
                          Download Notice
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="bg-white rounded-3xl p-5 border shadow-sm">
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
                      className="p-5 rounded-3xl mt-4 text-white shadow-sm"
                      style={{
                        background: "linear-gradient(135deg,#0B1020,#4B2E83)",
                      }}
                    >
                      <h3 className="font-bold text-xl">{sidebar.title}</h3>
                      <p className="mt-3 text-white/70 text-sm leading-relaxed">
                        {sidebar.description}
                      </p>
                      <a
                        href={sidebar.buttonLink}
                        className="inline-block mt-5 font-bold bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-xl text-center text-sm border border-white/20"
                      >
                        {sidebar.buttonText}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}