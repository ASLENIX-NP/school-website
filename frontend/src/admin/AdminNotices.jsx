import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Eye
} from "lucide-react";

export default function AdminNotices() {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "First Terminal Examination Notice",
      category: "Examination",
      date: "2083-02-15",
      description:
        "Important notice regarding First Terminal Examination schedule, routines, and student guidelines.",
      pdfUrl: "",
      pinned: true,
    },
  ]);

  const [pageSettings, setPageSettings] = useState({
    badge: "School Updates",
    title: "School Notices",
    description:
      "Stay informed with examination schedules, admissions, holidays, events and important announcements.",
  });

  const [calendar, setCalendar] = useState({
    title: "Nepali Calendar",
    subtitle: "Nepali date reference",
    embedUrl: "",
  });

  const [sidebar, setSidebar] = useState({
    title: "Admin Ready",
    description:
      "Notice title, date, category, description and PDF file can later come directly from the admin dashboard.",
    buttonText: "Contact School Office",
    buttonLink: "/contact",
  });

  useEffect(() => {
    fetchNotices();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notice-settings"
      );
  
      const result = await response.json();
  
      if (result.success) {
        const s = result.data;
        setPageSettings({
          badge: s.page_badge || "",
          title: s.page_title || "",
          description: s.page_description || "",
        });
  
        setCalendar({
          title: s.calendar_title,
          subtitle: s.calendar_subtitle,
          embedUrl: s.calendar_embed_url,
        });
  
        setSidebar({
          title: s.sidebar_title,
          description: s.sidebar_description,
          buttonText: s.sidebar_button_text,
          buttonLink: s.sidebar_button_link,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notices");
      const result = await response.json();

      if (result.success) {
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
    } catch (error) {
      console.error(error);
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
    setNotices(
      notices.map((notice) =>
        notice.id === id ? { ...notice, [field]: value } : notice
      )
    );
  };

  const deleteNotice = (id) => {
    setNotices(notices.filter((n) => n.id !== id));
  };

  const saveChanges = async () => {
    try {
      // delete all old notices
      await fetch(
        "http://localhost:5000/api/notices",
        {
          method: "DELETE",
        }
      );
  
      // insert current notices
      for (const notice of notices) {
        await fetch(
          "http://localhost:5000/api/notices",
          {
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
          }
        );
      }
  
      // save page settings
      await fetch(
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
  
      alert("Saved successfully");
  
      await fetchNotices();
      await fetchSettings();
  
    } catch (error) {
      console.error(error);
      alert("Failed to save");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOP BAR */}
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
              className="px-8 py-4 rounded-3xl font-semibold flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg,#FACC15,#67E8F9)",
                color: "#0B1020",
              }}
            >
              <Save className="w-5 h-5" />
              Save Changes
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
              Add, edit, delete and preview notices.
            </p>
          </div>
        </div>

        {/* CORE LAYOUT STRUCTURE */}
        <div className="grid lg:grid-cols-[520px_1fr] gap-8">
          
          {/* LEFT SIDE: ADMIN CONTROLS */}
          <div className="space-y-6">

            {/* ADD NOTICE BUTTON */}
            <button
              onClick={addNotice}
              className="w-full p-4 rounded-2xl bg-blue-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition"
            >
              <Plus className="w-5 h-5" />
              Add Notice
            </button>

            {/* NOTICES LIST CONFIGURATION */}
            {notices.map((notice, index) => (
              <div key={notice.id} className="bg-white rounded-3xl p-6 border">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-xl">
                    Notice #{index + 1}
                  </h3>

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

                  <input
                    className="w-full border rounded-xl p-3"
                    placeholder="PDF URL"
                    value={notice.pdfUrl}
                    onChange={(e) =>
                      updateNotice(notice.id, "pdfUrl", e.target.value)
                    }
                  />

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

            {/* PAGE SETTINGS */}
            <div className="bg-white rounded-3xl p-6 border">
              <h2 className="font-bold text-xl mb-4">
                Page Settings
              </h2>
              <div className="space-y-4">
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Page Badge"
                  value={pageSettings.badge}
                  onChange={(e) => setPageSettings({ ...pageSettings, badge: e.target.value })}
                />
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Page Title"
                  value={pageSettings.title}
                  onChange={(e) => setPageSettings({ ...pageSettings, title: e.target.value })}
                />
                <textarea
                  rows={3}
                  className="w-full border rounded-xl p-3"
                  placeholder="Page Description"
                  value={pageSettings.description}
                  onChange={(e) => setPageSettings({ ...pageSettings, description: e.target.value })}
                />
              </div>
            </div>

            {/* CALENDAR SETTINGS */}
            <div className="bg-white rounded-3xl p-6 border">
              <h2 className="font-bold text-xl mb-4">
                Calendar Settings
              </h2>
              <div className="space-y-4">
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Calendar Title"
                  value={calendar.title}
                  onChange={(e) => setCalendar({ ...calendar, title: e.target.value })}
                />
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Calendar Subtitle"
                  value={calendar.subtitle}
                  onChange={(e) => setCalendar({ ...calendar, subtitle: e.target.value })}
                />
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Embed URL Override"
                  value={calendar.embedUrl}
                  onChange={(e) => setCalendar({ ...calendar, embedUrl: e.target.value })}
                />
              </div>
            </div>

            {/* SIDEBAR SETTINGS */}
            <div className="bg-white rounded-3xl p-6 border">
              <h2 className="font-bold text-xl mb-4">
                Sidebar Card
              </h2>
              <div className="space-y-4">
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Card Title"
                  value={sidebar.title}
                  onChange={(e) => setSidebar({ ...sidebar, title: e.target.value })}
                />
                <textarea
                  rows={3}
                  className="w-full border rounded-xl p-3"
                  placeholder="Card Description"
                  value={sidebar.description}
                  onChange={(e) => setSidebar({ ...sidebar, description: e.target.value })}
                />
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Button Text"
                  value={sidebar.buttonText}
                  onChange={(e) => setSidebar({ ...sidebar, buttonText: e.target.value })}
                />
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Button Action URL Link"
                  value={sidebar.buttonLink}
                  onChange={(e) => setSidebar({ ...sidebar, buttonLink: e.target.value })}
                />
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: LIVE USER PREVIEW */}
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
                <h2 className="text-2xl font-black">Live Notice Page Preview</h2>
                <p className="text-slate-500 mt-1">Updates instantly while typing</p>
              </div>

              <div className="p-6">
                {/* Header Information Preview Block */}
                <div className="text-center mb-10">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold">
                    <Bell className="w-4 h-4" />
                    {pageSettings.badge}
                  </span>

                  <h1 className="text-5xl font-black mt-5">{pageSettings.title}</h1>

                  <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                    {pageSettings.description}
                  </p>
                </div>

                {/* Main Split Grid Layout inside the User Preview */}
                <div className="grid lg:grid-cols-[1fr_320px] gap-8 mt-10">
                  
                  {/* Left inner column: Dynamic Notice List Render */}
                  <div className="space-y-6">
                    {notices.map((notice) => (
                      <div key={notice.id} className="rounded-3xl bg-white p-6 border shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            {notice.category || "Category"}
                          </span>
                          <span className="text-slate-500">{notice.date || "Date"}</span>
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
                            background: "linear-gradient(135deg,#168A3A,#4B2E83)",
                          }}
                        >
                          Download Notice
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Right inner column: Widgets Layout (Calendar & Sidebar) */}
                  <div>
                    {/* Calendar Wrapper Widget */}
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

                    {/* Integrated Sidebar Widget Component */}
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