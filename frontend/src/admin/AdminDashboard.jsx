import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Home, Info, GraduationCap,
  Bell, Images, Users, Phone, Footprints, LogOut, ArrowRight,
  Settings, School, Newspaper, Inbox, Mail, Menu, X, FileText,
  Megaphone, Clock, Star, ChevronRight, Zap, Globe, Shield,
  Navigation,
} from "lucide-react";

// ── IMPORT ALL YOUR EXISTING ADMIN PAGES ──
import AdminHome from "./AdminHome";
import AdminNavbar from "./AdminNavbar";
import AdminAbout from "./AdminAbout";
import AdminAcademics from "./AdminAcademics";
import AdminAdmissions from "./AdminAdmissions";
import AdminNotices from "./AdminNotices";
import AdminAnnouncements from "./AdminAnnouncements";
import AdminStaff from "./AdminStaff";
import AdminFacilities from "./AdminFacilities";
import AdminGallery from "./AdminGallery";
import AdminContact from "./AdminContact";
import AdminFooter from "./AdminFooter";
import AdminSettings from "./AdminSettings";

const colors = {
  green: "#168A3A", purple: "#4B2E83", red: "#D71920", dark: "#0B1020",
  cyan: "#38BDF8", gold: "#FACC15", orange: "#F97316", pink: "#EC4899",
  blue: "#3B82F6", indigo: "#6366F1",
};

const adminSections = [
  { title: "Manage Home", icon: Home, color: colors.cyan, editorKey: "home" },
  { title: "Manage About", icon: Info, color: colors.purple, editorKey: "about" },
  { title: "Manage Academics", icon: GraduationCap, color: colors.red, editorKey: "academics" },
  { title: "Manage Admissions", icon: School, color: colors.cyan, editorKey: "admissions" },
  { title: "Manage Notices", icon: Bell, color: colors.red, editorKey: "notices" },
  { title: "Manage Announcements", icon: Newspaper, color: colors.orange, editorKey: "announcements" },
  { title: "Manage Staff", icon: Users, color: colors.green, editorKey: "staff" },
  { title: "Manage Facilities", icon: School, color: colors.purple, editorKey: "facilities" },
  { title: "Manage Gallery", icon: Images, color: colors.gold, editorKey: "gallery" },
  { title: "Manage Contact", icon: Phone, color: colors.cyan, editorKey: "contact" },
  { title: "Manage Footer", icon: Footprints, color: colors.green, editorKey: "footer" },
  { title: "Website Settings", icon: Settings, color: colors.purple, editorKey: "settings" },
];

// ── Sidebar navigation items ──────────────────────────────────────
const navigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, editorKey: null },
  { title: "Manage Navbar", icon: Navigation, editorKey: "navbar" },
  { title: "Manage Home", icon: Home, editorKey: "home" },
  { title: "Manage About", icon: Info, editorKey: "about" },
  { title: "Manage Academics", icon: GraduationCap, editorKey: "academics" },
  { title: "Manage Admissions", icon: School, editorKey: "admissions" },
  { title: "Manage Notices", icon: Bell, editorKey: "notices" },
  { title: "Manage Announcements", icon: Newspaper, editorKey: "announcements" },
  { title: "Manage Staff", icon: Users, editorKey: "staff" },
  { title: "Manage Facilities", icon: School, editorKey: "facilities" },
  { title: "Manage Gallery", icon: Images, editorKey: "gallery" },
  { title: "Manage Contact", icon: Phone, editorKey: "contact" },
  { title: "Manage Footer", icon: Footprints, editorKey: "footer" },
  { title: "Website Settings", icon: Settings, editorKey: "settings" },
];

function formatDate(value) {
  if (!value) return "Recently";
  try {
    return new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } catch { return "Recently"; }
}

function getSourceLabel(source) {
  return source === "admission" ? "Admissions" : "Contact";
}

function getCurrentTime() {
  return new Date().toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

// ── Light theme color tokens ──────────────────────────────────
const bg = {
  page:       "#F0F2F5",
  sidebar:    "#FFFFFF",
  card:       "#FFFFFF",
  cardHover:  "#F8F9FA",
  header:     "rgba(255,255,255,0.92)",
  border:     "rgba(15,23,42,0.06)",
  borderSoft: "rgba(15,23,42,0.04)",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notices, setNotices] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentTime] = useState(getCurrentTime());
  const [activeEditor, setActiveEditor] = useState(null);

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  useEffect(() => {
    const loadData = async () => {
      try {
        const msgRes = await axios.get("http://localhost:5000/api/contact-messages");
        setMessages(Array.isArray(msgRes.data?.data) ? msgRes.data.data : []);
        const noticeRes = await axios.get("http://localhost:5000/api/notices");
        setNotices(Array.isArray(noticeRes.data?.data) ? noticeRes.data.data : []);
        const annRes = await axios.get("http://localhost:5000/api/announcements");
        setAnnouncements(Array.isArray(annRes.data?.data) ? annRes.data.data : []);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setMessagesLoading(false);
      }
    };
    loadData();
  }, []);

  const logout = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      if (token) {
        await axios.post(
          "http://localhost:5000/api/admin/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (err) {
      console.error("Admin logout error:", err);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      setShowLogoutConfirm(false);
      navigate("/admin/login");
    }
  };

  const latestMessages = messages.slice(0, 4);
  const unreadCount = messages.filter((m) => !m.is_read).length;
  const noticeCount = notices.length;
  const announcementCount = announcements.length;
  const pinnedCount = notices.filter((n) => n.pinned).length;

  const stats = [
    { icon: FileText,  label: "Total Notices",  value: noticeCount,       sub: `${pinnedCount} pinned`,  color: colors.red,    trend: "+5%" },
    { icon: Megaphone, label: "Announcements",  value: announcementCount, sub: `${announcements.filter(a => a.active !== false).length} active`, color: colors.orange, trend: "+3%" },
    { icon: Inbox,     label: "Messages",        value: messages.length,   sub: `${unreadCount} unread`, color: colors.purple, trend: unreadCount > 0 ? `${unreadCount} new` : "All read" },
    { icon: Users,     label: "Staff Members",   value: "12",              sub: "Active teachers",        color: colors.cyan,   trend: "Active" },
  ];

  // ── Sidebar component ──────────────────────────────────────────────
  const SidebarContent = () => (
    <>
      <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${bg.border}` }}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #FACC15, #38BDF8)", boxShadow: "0 6px 18px rgba(56,189,248,0.2)" }}
          >
            <Shield className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="font-black text-slate-950 text-sm">Baljagriti</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(15,23,42,0.4)" }}>Admin Panel</div>
          </div>
        </div>

        <div
          className="px-3 py-2.5 rounded-xl flex items-center gap-2.5"
          style={{ background: "rgba(15,23,42,0.04)", border: `1px solid ${bg.border}` }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
            style={{ background: "linear-gradient(135deg, #FACC15, #F97316)" }}
          >
            {(adminUser.email || "A")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-slate-950 text-xs font-bold truncate">{adminUser.name || "Administrator"}</div>
            <div className="text-[10px] truncate" style={{ color: "rgba(15,23,42,0.4)" }}>{adminUser.email || "admin@baljagriti.edu.np"}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeEditor === item.editorKey || (item.editorKey === null && activeEditor === null);
          
          return (
            <button
              key={item.title}
              onClick={() => {
                setSidebarOpen(false);
                setActiveEditor(item.editorKey);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left"
              style={{
                background: isActive ? "rgba(56,189,248,0.1)" : "transparent",
                color: isActive ? "#0B1020" : "rgba(15,23,42,0.55)",
                border: isActive ? "1px solid rgba(56,189,248,0.15)" : "1px solid transparent",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(15,23,42,0.04)"; e.currentTarget.style.color = "#0B1020"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(15,23,42,0.55)"; } }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{item.title}</span>
              {isActive && <div className="ml-auto w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: "linear-gradient(180deg, #38BDF8, #FACC15)" }} />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5 flex-shrink-0">
        <div className="h-px mb-3" style={{ background: bg.border }} />
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
          style={{ color: "rgba(215,25,32,0.6)", border: "1px solid transparent" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(215,25,32,0.06)"; e.currentTarget.style.border = "1px solid rgba(215,25,32,0.12)"; e.currentTarget.style.color = "#D71920"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.color = "rgba(215,25,32,0.6)"; }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: bg.page }}>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile sidebar ── */}
      <motion.aside
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.26, ease: "easeInOut" }}
        className="fixed inset-y-0 left-0 z-40 w-[240px] flex flex-col lg:hidden"
        style={{ background: bg.sidebar, borderRight: `1px solid ${bg.border}` }}
      >
        <SidebarContent />
      </motion.aside>

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-[220px] flex-shrink-0"
        style={{
          background: bg.sidebar,
          borderRight: `1px solid ${bg.border}`,
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header
          className="flex-shrink-0 sticky top-0 z-30 px-4 sm:px-6"
          style={{ background: bg.header, backdropFilter: "blur(20px)", borderBottom: `1px solid ${bg.border}` }}
        >
          <div className="h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.6)" }}
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
              <div>
                <h1 className="font-black text-slate-950 text-sm">
                  {activeEditor ? `Editing: ${activeEditor.charAt(0).toUpperCase() + activeEditor.slice(1)}` : "Dashboard"}
                </h1>
                <p className="text-[10px] hidden sm:block" style={{ color: "rgba(15,23,42,0.4)" }}>{currentTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                style={{ background: "rgba(22,138,58,0.08)", border: "1px solid rgba(22,138,58,0.12)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.green }} />
                <span className="text-[10px] font-bold" style={{ color: colors.green }}>Live</span>
              </div>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(15,23,42,0.05)", color: "rgba(15,23,42,0.5)", border: `1px solid ${bg.border}` }}
              >
                <Globe className="w-3.5 h-3.5" />
                View Site
              </a>

              {activeEditor && (
                <button
                  onClick={() => setActiveEditor(null)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all hover:-translate-y-0.5"
                  style={{
                    background: "rgba(15,23,42,0.06)",
                    color: "rgba(15,23,42,0.6)",
                    border: `1px solid ${bg.border}`,
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                  Close Editor
                </button>
              )}

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all hover:-translate-y-0.5"
                style={{
                  background: "rgba(215,25,32,0.08)",
                  color: "#D71920",
                  border: "1px solid rgba(215,25,32,0.15)",
                }}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-5 max-w-full">

            {!activeEditor ? (
              // ── Dashboard View ──
              <div className="space-y-5">
                {/* Welcome banner */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="relative overflow-hidden rounded-[24px] p-6 md:p-7"
                  style={{
                    background: "linear-gradient(135deg, #E8EDF5 0%, #DCE3EF 50%, #E8E0F0 100%)",
                    border: `1px solid ${bg.border}`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08), transparent 70%)", transform: "translate(30%,-30%)" }} />
                  <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(250,204,21,0.06), transparent 70%)", transform: "translate(-30%,30%)" }} />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.green }} />
                        <span className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: "rgba(15,23,42,0.4)" }}>Admin Dashboard</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-950 leading-tight mb-1.5" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.04em" }}>
                        Hello, {adminUser.name || "Admin"}!
                      </h2>
                      <p className="text-sm text-slate-500">Manage your school website — notices, staff, gallery, and more.</p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => setActiveEditor("notices")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg, #D71920, #9B1117)", color: "#fff", boxShadow: "0 4px 14px rgba(215,25,32,0.2)" }}
                      >
                        <Bell className="w-4 h-4" /> Add Notice
                      </button>
                      <button
                        onClick={() => setActiveEditor("announcements")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all hover:-translate-y-0.5"
                        style={{ background: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.7)", border: `1px solid ${bg.border}` }}
                      >
                        <Megaphone className="w-4 h-4" /> Announcement
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                        className="relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1"
                        style={{ background: bg.card, border: `1px solid ${bg.border}`, boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${stat.color}10, transparent 70%)`, transform: "translate(30%,-30%)" }} />
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 rounded-xl" style={{ background: `${stat.color}10` }}>
                            <Icon className="w-4 h-4" style={{ color: stat.color }} />
                          </div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${stat.color}10`, color: stat.color }}>
                            {stat.trend}
                          </span>
                        </div>
                        <div className="text-2xl font-black text-slate-950 mb-0.5">{stat.value}</div>
                        <div className="text-xs font-bold text-slate-500">{stat.label}</div>
                        <div className="text-[10px] mt-0.5 text-slate-400">{stat.sub}</div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ── Two Column Layout: Recent Messages + Quick Stats ── */}
                <div className="grid lg:grid-cols-3 gap-4">
                  {/* Recent Messages - takes 2/3 */}
                  <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: bg.card, border: `1px solid ${bg.border}`, boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
                    <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${bg.borderSoft}` }}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl" style={{ background: "rgba(75,46,131,0.08)" }}>
                          <Mail className="w-4 h-4" style={{ color: colors.purple }} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-950 text-sm">Recent Messages</h3>
                          <p className="text-[11px] text-slate-400">Latest inquiries from visitors</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate("/admin/contact-messages")}
                        className="flex items-center gap-1 text-xs font-bold transition-colors text-slate-400 hover:text-slate-950"
                      >
                        View All <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      {messagesLoading ? (
                        <div className="py-8 text-center text-sm text-slate-400">Loading messages...</div>
                      ) : latestMessages.length === 0 ? (
                        <div className="py-8 text-center">
                          <Mail className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                          <p className="text-sm text-slate-400">No messages yet</p>
                        </div>
                      ) : (
                        latestMessages.map((message) => (
                          <div
                            key={message.id}
                            className="rounded-xl p-4 transition-all duration-200 cursor-pointer"
                            style={{
                              background: message.is_read ? "rgba(15,23,42,0.02)" : "rgba(75,46,131,0.06)",
                              border: message.is_read ? `1px solid ${bg.borderSoft}` : "1px solid rgba(75,46,131,0.12)",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(15,23,42,0.04)"}
                            onMouseLeave={e => e.currentTarget.style.background = message.is_read ? "rgba(15,23,42,0.02)" : "rgba(75,46,131,0.06)"}
                          >
                            <div className="flex items-start justify-between gap-3 mb-1.5">
                              <div className="flex items-center gap-2">
                                {!message.is_read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors.green }} />}
                                <span className="font-black text-slate-950 text-sm">{message.name || "Unknown Sender"}</span>
                              </div>
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-black flex-shrink-0"
                                style={{
                                  background: message.source === "admission" ? "rgba(75,46,131,0.1)" : "rgba(215,25,32,0.08)",
                                  color: message.source === "admission" ? colors.purple : colors.red,
                                }}
                              >
                                {getSourceLabel(message.source)}
                              </span>
                            </div>
                            <p className="text-xs leading-relaxed line-clamp-2 text-slate-500">{message.message || "No message text."}</p>
                            <p className="text-[10px] mt-1.5 text-slate-400">{formatDate(message.created_at)}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right sidebar - Quick Stats + Recent Activity */}
                  <div className="space-y-3">
                    {/* Quick stats */}
                    <div className="rounded-2xl p-5" style={{ background: "linear-gradient(145deg, #E8EDF5, #E8E0F0)", border: `1px solid ${bg.border}`, boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4" style={{ color: colors.gold }} />
                        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Quick Stats</span>
                      </div>
                      {[
                        { label: "Total Notices", value: noticeCount, color: colors.red },
                        { label: "Announcements", value: announcementCount, color: colors.orange },
                        { label: "Unread Messages", value: unreadCount, color: unreadCount > 0 ? colors.green : "rgba(15,23,42,0.3)" },
                        { label: "Staff Members", value: "12", color: colors.cyan },
                      ].map((item, i, arr) => (
                        <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${bg.borderSoft}` : "none" }}>
                          <span className="text-xs text-slate-500">{item.label}</span>
                          <span className="text-sm font-black" style={{ color: item.color }}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Recent activity */}
                    <div className="rounded-2xl p-5" style={{ background: bg.card, border: `1px solid ${bg.border}`, boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-3.5 h-3.5" style={{ color: "rgba(15,23,42,0.3)" }} />
                        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Recent Activity</span>
                      </div>
                      {[
                        { dot: colors.green,  text: "Notice added",            time: "2 min ago"  },
                        { dot: colors.blue,   text: "Announcement published",  time: "1 hr ago"   },
                        { dot: colors.purple, text: "New message received",    time: "3 hrs ago"  },
                        { dot: colors.gold,   text: "Gallery updated",         time: "Yesterday"  },
                      ].map((item, i, arr) => (
                        <div key={i} className="flex items-center gap-3 py-2" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${bg.borderSoft}` : "none" }}>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.dot }} />
                          <span className="text-xs flex-1 truncate text-slate-500">{item.text}</span>
                          <span className="text-[10px] flex-shrink-0 text-slate-400">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // ── Editor View ──
              <div>
  {activeEditor === "navbar" && <AdminNavbar />}
  {activeEditor === "home" && <AdminHome />}
  {activeEditor === "about" && <AdminAbout />}
                {activeEditor === "academics" && <AdminAcademics />}
                {activeEditor === "admissions" && <AdminAdmissions />}
                {activeEditor === "notices" && <AdminNotices />}
                {activeEditor === "announcements" && <AdminAnnouncements />}
                {activeEditor === "staff" && <AdminStaff />}
                {activeEditor === "facilities" && <AdminFacilities />}
                {activeEditor === "gallery" && <AdminGallery />}
                {activeEditor === "contact" && <AdminContact />}
                {activeEditor === "footer" && <AdminFooter />}
                {activeEditor === "settings" && <AdminSettings />}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Logout Confirm ── */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.88, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="w-full max-w-sm overflow-hidden rounded-[28px]"
              style={{ background: "#FFFFFF", border: `1px solid ${bg.border}`, boxShadow: "0 40px 80px rgba(0,0,0,0.15)" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="h-1" style={{ background: "linear-gradient(90deg, #D71920, #FACC15)" }} />
              <div className="p-7 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(215,25,32,0.08)", border: "1px solid rgba(215,25,32,0.12)" }}
                >
                  <LogOut className="w-6 h-6" style={{ color: "#D71920" }} />
                </div>
                <h3 className="text-xl font-black text-slate-950 mb-2">Log out?</h3>
                <p className="text-sm mb-6 text-slate-500">
                  You'll need to sign in again to access the admin panel.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.6)", border: `1px solid ${bg.border}` }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={logout}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #D71920, #9B1117)", color: "#fff", boxShadow: "0 4px 14px rgba(215,25,32,0.2)" }}
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}