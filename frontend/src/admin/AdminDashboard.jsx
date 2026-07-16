import defaultSchoolLogo from "../assets/school-logo.jpeg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Home,
  Info,
  GraduationCap,
  Bell,
  Images,
  Users,
  Phone,
  Footprints,
  LogOut,
  Settings,
  School,
  Newspaper,
  Inbox,
  Mail,
  Menu,
  X,
  FileText,
  Megaphone,
  Clock,
  ChevronRight,
  Globe,
  Navigation,
} from "lucide-react";

import AdminHome from "./AdminHome";
import AdminNavbar from "./AdminNavbar";
import AdminAbout from "./AdminAbout";
import AdminAcademics from "./AdminAcademics";
import AdminAdmissions from "./AdminAdmissions";
import AdminNotices from "./AdminNotices";
import AdminCalendar from "./AdminCalendar";
import AdminBlog from "./AdminBlog";
import AdminAnnouncements from "./AdminAnnouncements";
import AdminStaff from "./AdminStaff";
import AdminFacilities from "./AdminFacilities";
import AdminGallery from "./AdminGallery";
import AdminContact from "./AdminContact";
import AdminFooter from "./AdminFooter";
import AdminSettings from "./AdminSettings";

const API_BASE = "https://school-website-backend-ixx2.onrender.com";

const colors = {
  green: "#168A3A",
  purple: "#4B2E83",
  red: "#D71920",
  dark: "#0F172A",
  cyan: "#0284C7",
  orange: "#EA580C",
  indigo: "#4F46E5",
};

const navigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, editorKey: null },
  { title: "Manage Navbar", icon: Navigation, editorKey: "navbar" },
  { title: "Manage Home", icon: Home, editorKey: "home" },
  { title: "Manage About", icon: Info, editorKey: "about" },
  { title: "Manage Academics", icon: GraduationCap, editorKey: "academics" },
  { title: "Manage Admissions", icon: School, editorKey: "admissions" },
  { title: "Manage Notices", icon: Bell, editorKey: "notices" },
  { title: "Manage Calendar", icon: Clock, editorKey: "calendar" },
  { title: "Manage Blog", icon: Newspaper, editorKey: "blogs" },
  {
    title: "Manage Announcements",
    icon: Megaphone,
    editorKey: "announcements",
  },
  { title: "Manage Staff", icon: Users, editorKey: "staff" },
  { title: "Manage Facilities", icon: School, editorKey: "facilities" },
  { title: "Manage Gallery", icon: Images, editorKey: "gallery" },
  { title: "Manage Contact", icon: Phone, editorKey: "contact" },
  { title: "Manage Footer", icon: Footprints, editorKey: "footer" },
  { title: "Website Settings", icon: Settings, editorKey: "settings" },
];

const editorLabels = Object.fromEntries(
  navigationItems.map((item) => [item.editorKey, item.title])
);

const ui = {
  page: "#F5F6F8",
  sidebar: "#FFFFFF",
  card: "#FFFFFF",
  header: "rgba(255,255,255,0.96)",
  border: "#E5E7EB",
  borderSoft: "#EEF0F3",
  text: "#111827",
  muted: "#6B7280",
  subtle: "#9CA3AF",
};

function formatDate(value) {
  if (!value) return "Recently";

  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Recently";
  }
}

function getSourceLabel(source) {
  return source === "admission" ? "Admissions" : "Contact";
}

function getCurrentTime() {
  return new Date().toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getInitial(value = "") {
  return String(value || "A").trim().charAt(0).toUpperCase() || "A";
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notices, setNotices] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [staff, setStaff] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentTime] = useState(getCurrentTime());
  const [activeEditor, setActiveEditor] = useState(null);
  const [schoolBrand, setSchoolBrand] = useState({
    schoolName: "Baljagriti",
    schoolSubtitle: "Secondary English School",
    logoUrl: "",
  });

  let adminUser = {};

  try {
    adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
  } catch {
    adminUser = {};
  }

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      setMessagesLoading(true);

      const requestOptions = { timeout: 12000 };

      try {
        const [msgRes, noticeRes, annRes, staffRes, navbarRes] =
          await Promise.allSettled([
            axios.get(`${API_BASE}/api/contact-messages`, requestOptions),
            axios.get(`${API_BASE}/api/notices`, requestOptions),
            axios.get(`${API_BASE}/api/announcements`, requestOptions),
            axios.get(`${API_BASE}/api/site-content/staff`, requestOptions),
            axios.get(`${API_BASE}/api/site-content/navbar`, requestOptions),
          ]);

        if (!alive) return;

        if (msgRes.status === "fulfilled") {
          setMessages(
            Array.isArray(msgRes.value.data?.data)
              ? msgRes.value.data.data
              : []
          );
        }

        if (noticeRes.status === "fulfilled") {
          setNotices(
            Array.isArray(noticeRes.value.data?.data)
              ? noticeRes.value.data.data
              : []
          );
        }

        if (annRes.status === "fulfilled") {
          setAnnouncements(
            Array.isArray(annRes.value.data?.data)
              ? annRes.value.data.data
              : []
          );
        }

        if (staffRes.status === "fulfilled") {
          const staffContent = staffRes.value.data?.data?.content;

          setStaff(
            Array.isArray(staffContent?.staff) ? staffContent.staff : []
          );
        }

        if (navbarRes.status === "fulfilled") {
          const navbarContent =
            navbarRes.value.data?.data?.content || {};

          setSchoolBrand((previous) => ({
            schoolName:
              String(navbarContent.schoolName || "").trim() ||
              previous.schoolName,
            schoolSubtitle:
              String(navbarContent.schoolSubtitle || "").trim() ||
              previous.schoolSubtitle,
            logoUrl: String(navbarContent.logoUrl || "").trim(),
          }));
        }

        [msgRes, noticeRes, annRes, staffRes, navbarRes].forEach(
          (result) => {
            if (result.status === "rejected") {
              console.error(
                "Dashboard data load error:",
                result.reason
              );
            }
          }
        );
      } finally {
        if (alive) setMessagesLoading(false);
      }
    };

    loadData();

    return () => {
      alive = false;
    };
  }, []);

  const logout = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      if (token) {
        await axios.post(
          `${API_BASE}/api/admin/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      setShowLogoutConfirm(false);
      navigate("/admin/login");
    }
  };

  const latestMessages = messages.slice(0, 4);
  const unreadCount = messages.filter((message) => !message.is_read).length;
  const noticeCount = notices.length;
  const announcementCount = announcements.length;
  const pinnedCount = notices.filter((notice) => notice.pinned).length;

  const stats = [
    {
      icon: FileText,
      label: "Total Notices",
      value: noticeCount,
      sub: `${pinnedCount} pinned`,
      color: colors.red,
    },
    {
      icon: Megaphone,
      label: "Announcements",
      value: announcementCount,
      sub: `${
        announcements.filter((item) => item.active !== false).length
      } active`,
      color: colors.orange,
    },
    {
      icon: Inbox,
      label: "Messages",
      value: messages.length,
      sub: `${unreadCount} unread`,
      color: colors.purple,
    },
    {
      icon: Users,
      label: "Staff Members",
      value: staff.length,
      sub: "Published profiles",
      color: colors.cyan,
    },
  ];

  const currentEditorTitle =
    activeEditor === null
      ? "Dashboard"
      : editorLabels[activeEditor] ||
        `Editing: ${
          activeEditor.charAt(0).toUpperCase() + activeEditor.slice(1)
        }`;

  const SidebarContent = () => (
    <>
      <div
        className="flex-shrink-0 px-4 pb-4 pt-5"
        style={{ borderBottom: `1px solid ${ui.border}` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white"
            style={{
              border: `1px solid ${ui.border}`,
              boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
            }}
          >
            <img
              src={schoolBrand.logoUrl || defaultSchoolLogo}
              alt={`${schoolBrand.schoolName} logo`}
              className="h-full w-full object-contain p-1"
              onError={(event) => {
                if (event.currentTarget.src !== defaultSchoolLogo) {
                  event.currentTarget.src = defaultSchoolLogo;
                }
              }}
            />
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold text-slate-950">
              {schoolBrand.schoolName || "Baljagriti"}
            </div>
            <div className="mt-0.5 truncate text-[11px] font-medium text-slate-500">
              Website administration
            </div>
          </div>
        </div>

        <div
          className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3"
          style={{
            background: "#F8F9FB",
            border: `1px solid ${ui.border}`,
          }}
        >
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: colors.purple }}
          >
            {getInitial(adminUser.name || adminUser.email)}
          </div>

          <div className="min-w-0">
            <div className="truncate text-xs font-bold text-slate-900">
              {adminUser.name || "Administrator"}
            </div>
            <div className="mt-0.5 truncate text-[10px] text-slate-500">
              {adminUser.email || "admin@baljagriti.com"}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
          Website
        </div>

        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeEditor === item.editorKey ||
              (item.editorKey === null && activeEditor === null);

            return (
              <button
                key={item.title}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  setSidebarOpen(false);
                  setActiveEditor(item.editorKey);
                }}
                className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                style={{
                  background: isActive ? "#F1F3F6" : "transparent",
                  color: isActive ? ui.text : ui.muted,
                  fontWeight: isActive ? 700 : 500,
                }}
                onMouseEnter={(event) => {
                  if (!isActive) {
                    event.currentTarget.style.background = "#F8F9FB";
                    event.currentTarget.style.color = ui.text;
                  }
                }}
                onMouseLeave={(event) => {
                  if (!isActive) {
                    event.currentTarget.style.background = "transparent";
                    event.currentTarget.style.color = ui.muted;
                  }
                }}
              >
                {isActive && (
                  <span
                    className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full"
                    style={{ background: colors.red }}
                  />
                )}

                <Icon
                  className="h-[17px] w-[17px] flex-shrink-0"
                  strokeWidth={isActive ? 2.2 : 1.8}
                />

                <span className="truncate text-[13px]">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="flex-shrink-0 px-3 pb-4">
        <div
          className="mb-3 h-px"
          style={{ background: ui.border }}
        />

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold transition-colors"
          style={{ color: colors.red }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "#FEF2F2";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut className="h-[17px] w-[17px] flex-shrink-0" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div
      className="flex min-h-screen"
      style={{ background: ui.page }}
    >
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            type="button"
            aria-label="Close admin menu"
            className="fixed inset-0 z-30 lg:hidden"
            style={{
              background: "rgba(15,23,42,0.38)",
              backdropFilter: "blur(2px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ x: sidebarOpen ? 0 : -270 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col lg:hidden"
        style={{
          background: ui.sidebar,
          borderRight: `1px solid ${ui.border}`,
          boxShadow: "12px 0 40px rgba(15,23,42,0.10)",
        }}
      >
        <SidebarContent />
      </motion.aside>

      <aside
        className="hidden h-screen w-[248px] flex-shrink-0 flex-col lg:flex"
        style={{
          background: ui.sidebar,
          borderRight: `1px solid ${ui.border}`,
          position: "sticky",
          top: 0,
        }}
      >
        <SidebarContent />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header
          className="sticky top-0 z-30 flex-shrink-0 px-3 sm:px-5"
          style={{
            background: ui.header,
            backdropFilter: "blur(14px)",
            borderBottom: `1px solid ${ui.border}`,
          }}
        >
          <div className="flex h-16 items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen((open) => !open)}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg lg:hidden"
                style={{
                  background: "#F3F4F6",
                  color: ui.muted,
                  border: `1px solid ${ui.border}`,
                }}
              >
                {sidebarOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-extrabold text-slate-950 sm:text-base">
                  {currentEditorTitle}
                </h1>
                <p className="mt-0.5 hidden truncate text-[11px] text-slate-500 sm:block">
                  {currentTime}
                </p>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <div
                className="hidden items-center gap-2 rounded-lg px-3 py-2 sm:flex"
                style={{
                  background: "#F0FDF4",
                  border: "1px solid #DCFCE7",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: colors.green }}
                />
                <span
                  className="text-[11px] font-bold"
                  style={{ color: colors.green }}
                >
                  Website online
                </span>
              </div>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-semibold text-slate-600 transition-colors sm:px-3"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${ui.border}`,
                }}
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">View website</span>
              </a>

              {activeEditor && (
                <button
                  type="button"
                  onClick={() => setActiveEditor(null)}
                  className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-semibold text-slate-600 transition-colors sm:px-3"
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${ui.border}`,
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Close editor</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-semibold sm:px-3"
                style={{
                  background: "#FFF7F7",
                  border: "1px solid #FECACA",
                  color: colors.red,
                }}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-full px-3 py-4 sm:px-5 sm:py-5">
            {!activeEditor ? (
              <div className="space-y-5">
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-2xl bg-white p-5 sm:p-7"
                  style={{
                    border: `1px solid ${ui.border}`,
                    boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                  }}
                >
                  <span
                    className="absolute bottom-0 left-0 top-0 w-1"
                    style={{ background: colors.red }}
                  />

                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                      <div className="mb-2 text-xs font-semibold text-slate-500">
                        School website dashboard
                      </div>

                      <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-3xl">
                        Welcome, {adminUser.name || "Administrator"}
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                        Review website activity and open a section from the
                        sidebar to update its content.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveEditor("notices")}
                        className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold text-white"
                        style={{ background: colors.red }}
                      >
                        <Bell className="h-4 w-4" />
                        Add notice
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveEditor("announcements")
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-slate-700"
                        style={{
                          background: "#FFFFFF",
                          border: `1px solid ${ui.border}`,
                        }}
                      >
                        <Megaphone className="h-4 w-4" />
                        Add announcement
                      </button>
                    </div>
                  </div>
                </motion.section>

                <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.28,
                          delay: index * 0.04,
                        }}
                        className="rounded-xl bg-white p-4 sm:p-5"
                        style={{
                          border: `1px solid ${ui.border}`,
                          boxShadow:
                            "0 2px 10px rgba(15,23,42,0.035)",
                        }}
                      >
                        <div className="mb-5 flex items-start justify-between gap-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg"
                            style={{
                              background: `${stat.color}0D`,
                              color: stat.color,
                            }}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <span
                            className="mt-1 h-1.5 w-8 rounded-full"
                            style={{ background: stat.color }}
                          />
                        </div>

                        <div className="text-2xl font-extrabold text-slate-950">
                          {stat.value}
                        </div>
                        <div className="mt-1 text-xs font-bold text-slate-600 sm:text-sm">
                          {stat.label}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-400">
                          {stat.sub}
                        </div>
                      </motion.div>
                    );
                  })}
                </section>

                <section
                  className="overflow-hidden rounded-2xl bg-white"
                  style={{
                    border: `1px solid ${ui.border}`,
                    boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                  }}
                >
                  <div
                    className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5"
                    style={{ borderBottom: `1px solid ${ui.borderSoft}` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{
                          background: "#F5F3FF",
                          color: colors.purple,
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-extrabold text-slate-950">
                          Recent messages
                        </h3>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Latest contact and admission inquiries
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/admin/contact-messages")
                      }
                      className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-950"
                    >
                      View all
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2 p-3 sm:p-4">
                    {messagesLoading ? (
                      <div className="py-10 text-center text-sm text-slate-400">
                        Loading messages...
                      </div>
                    ) : latestMessages.length === 0 ? (
                      <div className="py-10 text-center">
                        <Mail className="mx-auto mb-2 h-8 w-8 text-slate-200" />
                        <p className="text-sm text-slate-400">
                          No messages yet
                        </p>
                      </div>
                    ) : (
                      latestMessages.map((message) => (
                        <button
                          type="button"
                          key={message.id}
                          onClick={() =>
                            navigate("/admin/contact-messages")
                          }
                          className="block w-full rounded-xl px-4 py-3 text-left transition-colors"
                          style={{
                            background: message.is_read
                              ? "#FFFFFF"
                              : "#FAF8FF",
                            border: message.is_read
                              ? `1px solid ${ui.borderSoft}`
                              : "1px solid #EDE9FE",
                          }}
                          onMouseEnter={(event) => {
                            event.currentTarget.style.background =
                              "#F8F9FB";
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.background =
                              message.is_read ? "#FFFFFF" : "#FAF8FF";
                          }}
                        >
                          <div className="mb-1.5 flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                              {!message.is_read && (
                                <span
                                  className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                  style={{ background: colors.green }}
                                />
                              )}

                              <span className="truncate text-sm font-bold text-slate-900">
                                {message.name || "Unknown sender"}
                              </span>
                            </div>

                            <span
                              className="flex-shrink-0 rounded-md px-2 py-1 text-[10px] font-bold"
                              style={{
                                background:
                                  message.source === "admission"
                                    ? "#F5F3FF"
                                    : "#FEF2F2",
                                color:
                                  message.source === "admission"
                                    ? colors.purple
                                    : colors.red,
                              }}
                            >
                              {getSourceLabel(message.source)}
                            </span>
                          </div>

                          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                            {message.message || "No message text."}
                          </p>

                          <p className="mt-2 text-[10px] text-slate-400">
                            {formatDate(message.created_at)}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </section>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {activeEditor === "navbar" && <AdminNavbar />}
                {activeEditor === "home" && <AdminHome />}
                {activeEditor === "about" && <AdminAbout />}
                {activeEditor === "academics" && <AdminAcademics />}
                {activeEditor === "admissions" && <AdminAdmissions />}
                {activeEditor === "notices" && <AdminNotices />}
                {activeEditor === "calendar" && <AdminCalendar />}
                {activeEditor === "blogs" && <AdminBlog />}
                {activeEditor === "announcements" && (
                  <AdminAnnouncements />
                )}
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

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{
              background: "rgba(15,23,42,0.48)",
              backdropFilter: "blur(5px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6"
              style={{
                border: `1px solid ${ui.border}`,
                boxShadow: "0 24px 60px rgba(15,23,42,0.18)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: "#FEF2F2", color: colors.red }}
              >
                <LogOut className="h-5 w-5" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-950">
                Log out of the admin panel?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                You will need to sign in again before making website
                changes.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 rounded-lg py-2.5 text-sm font-bold text-slate-600"
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${ui.border}`,
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="flex-1 rounded-lg py-2.5 text-sm font-bold text-white"
                  style={{ background: colors.red }}
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}