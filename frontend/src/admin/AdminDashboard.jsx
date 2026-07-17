import defaultSchoolLogo from "../assets/school-logo.jpeg";
import { useEffect, useRef, useState } from "react";
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
  Settings,
  School,
  Newspaper,
  Inbox,
  Menu,
  X,
  Megaphone,
  Clock,
  ChevronRight,
  Globe,
  Navigation,
  Eye,
  ArrowUp,
  Mail,
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
const SIDEBAR_SCROLL_KEY = "baljagriti-admin-sidebar-scroll";

const colors = {
  green: "#168A3A",
  purple: "#4B2E83",
  red: "#D71920",
  dark: "#0F172A",
  cyan: "#0284C7",
  orange: "#EA580C",
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
];

const editorLabels = {
  navbar: "Manage Navbar",
  home: "Manage Home",
  about: "Manage About",
  academics: "Manage Academics",
  admissions: "Manage Admissions",
  notices: "Manage Notices",
  calendar: "Manage Calendar",
  blogs: "Manage Blog",
  announcements: "Manage Announcements",
  staff: "Manage Staff",
  facilities: "Manage Facilities",
  gallery: "Manage Gallery",
  contact: "Manage Contact",
  footer: "Manage Footer",
  settings: "Admin Profile",
};

const ui = {
  page: "#F5F6F8",
  sidebar: "#FFFFFF",
  header: "rgba(255,255,255,0.96)",
  border: "#E5E7EB",
  borderSoft: "#EEF0F3",
  text: "#111827",
  muted: "#6B7280",
};

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

function getItemViews(item) {
  return Math.max(0, Number(item?.view_count) || 0);
}

function sumViews(items = []) {
  return items.reduce((total, item) => total + getItemViews(item), 0);
}

function sortByViews(items = []) {
  return [...items].sort((first, second) => {
    const viewDifference = getItemViews(second) - getItemViews(first);

    if (viewDifference !== 0) return viewDifference;

    const firstTime = new Date(first?.created_at || first?.notice_date || 0).getTime();
    const secondTime = new Date(
      second?.created_at || second?.notice_date || 0
    ).getTime();

    return secondTime - firstTime;
  });
}

function AnalyticsRow({
  title,
  subtitle,
  views,
  color,
  badge,
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-xl px-4 py-3"
      style={{
        background: "#FFFFFF",
        border: `1px solid ${ui.borderSoft}`,
      }}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="h-2 w-2 flex-shrink-0 rounded-full"
            style={{ background: color }}
          />
          <h4 className="truncate text-sm font-bold text-slate-900">
            {title || "Untitled item"}
          </h4>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2 pl-4 text-[11px] text-slate-400">
          {subtitle && <span>{subtitle}</span>}
          {badge && (
            <span
              className="rounded-full px-2 py-0.5 font-semibold"
              style={{
                background: `${color}10`,
                color,
              }}
            >
              {badge}
            </span>
          )}
        </div>
      </div>

      <div
        className="flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold"
        style={{
          background: `${color}0D`,
          color,
        }}
      >
        <Eye className="h-3.5 w-3.5" />
        {views}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const desktopNavRef = useRef(null);
  const mobileNavRef = useRef(null);
  const contentScrollRef = useRef(null);
  const sidebarScrollPositionRef = useRef(
    typeof window !== "undefined"
      ? Number(sessionStorage.getItem(SIDEBAR_SCROLL_KEY) || 0)
      : 0
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notices, setNotices] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [currentTime] = useState(getCurrentTime());
  const [activeEditor, setActiveEditor] = useState(null);
  const [showGoTop, setShowGoTop] = useState(false);
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
      const requestOptions = { timeout: 12000 };

      const [messageResponse, noticeResponse, announcementResponse, navbarResponse] =
        await Promise.allSettled([
          axios.get(`${API_BASE}/api/contact-messages`, requestOptions),
          axios.get(`${API_BASE}/api/notices`, requestOptions),
          axios.get(`${API_BASE}/api/announcements`, requestOptions),
          axios.get(`${API_BASE}/api/site-content/navbar`, requestOptions),
        ]);

      if (!alive) return;

      if (messageResponse.status === "fulfilled") {
        setMessages(
          Array.isArray(messageResponse.value.data?.data)
            ? messageResponse.value.data.data
            : []
        );
      }

      if (noticeResponse.status === "fulfilled") {
        setNotices(
          Array.isArray(noticeResponse.value.data?.data)
            ? noticeResponse.value.data.data
            : []
        );
      }

      if (announcementResponse.status === "fulfilled") {
        setAnnouncements(
          Array.isArray(announcementResponse.value.data?.data)
            ? announcementResponse.value.data.data
            : []
        );
      }

      if (navbarResponse.status === "fulfilled") {
        const navbarContent =
          navbarResponse.value.data?.data?.content || {};

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

      [
        messageResponse,
        noticeResponse,
        announcementResponse,
        navbarResponse,
      ].forEach((result) => {
        if (result.status === "rejected") {
          console.error("Dashboard data load error:", result.reason);
        }
      });
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    };

    const refreshWhenFocused = () => {
      loadData();
    };

    loadData();

    window.addEventListener("focus", refreshWhenFocused);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      alive = false;
      window.removeEventListener("focus", refreshWhenFocused);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  useEffect(() => {
    const restoreSidebarScroll = () => {
      const savedPosition = sidebarScrollPositionRef.current;

      if (desktopNavRef.current) {
        desktopNavRef.current.scrollTop = savedPosition;
      }

      if (mobileNavRef.current) {
        mobileNavRef.current.scrollTop = savedPosition;
      }
    };

    const frame = window.requestAnimationFrame(restoreSidebarScroll);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [activeEditor, sidebarOpen]);

  const saveSidebarScroll = (event) => {
    const nextPosition = event.currentTarget.scrollTop;

    sidebarScrollPositionRef.current = nextPosition;
    sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(nextPosition));
  };

  const openEditor = (editorKey, navElement = null) => {
    if (navElement) {
      const navigation = navElement.closest("nav");

      if (navigation) {
        sidebarScrollPositionRef.current = navigation.scrollTop;
        sessionStorage.setItem(
          SIDEBAR_SCROLL_KEY,
          String(navigation.scrollTop)
        );
      }
    }

    setActiveEditor(editorKey);
    setSidebarOpen(false);

    window.requestAnimationFrame(() => {
      contentScrollRef.current?.scrollTo({
        top: 0,
        behavior: "auto",
      });
    });
  };

  const unreadCount = messages.filter((message) => !message.is_read).length;
  const admissionMessageCount = messages.filter(
    (message) => message.source === "admission"
  ).length;
  const contactMessageCount = messages.length - admissionMessageCount;

  const totalNoticeViews = sumViews(notices);
  const totalAnnouncementViews = sumViews(announcements);
  const totalContentViews = totalNoticeViews + totalAnnouncementViews;

  const noticeAnalytics = sortByViews(notices);
  const announcementAnalytics = sortByViews(announcements);

  const currentEditorTitle =
    activeEditor === null
      ? "Dashboard"
      : editorLabels[activeEditor] ||
        `Editing: ${
          activeEditor.charAt(0).toUpperCase() + activeEditor.slice(1)
        }`;

  const SidebarContent = ({ navRef }) => (
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
      </div>

      <nav
        ref={navRef}
        onScroll={saveSidebarScroll}
        className="flex-1 overflow-y-auto px-3 py-4"
      >
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
                onClick={(event) =>
                  openEditor(item.editorKey, event.currentTarget)
                }
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

                <span className="truncate text-[13px]">{item.title}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="flex-shrink-0 px-3 pb-4 pt-2">
        <div className="mb-3 h-px" style={{ background: ui.border }} />

        <div
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3"
          style={{
            background: "#F8F9FB",
            border: `1px solid ${ui.border}`,
          }}
        >
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
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
    </>
  );

  return (
    <div className="flex min-h-screen" style={{ background: ui.page }}>
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
        <SidebarContent navRef={mobileNavRef} />
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
        <SidebarContent navRef={desktopNavRef} />
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
                className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-semibold text-slate-600 sm:px-3"
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
                  onClick={() => openEditor(null)}
                  className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-semibold text-slate-600 sm:px-3"
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
                onClick={() => openEditor("settings")}
                className="flex h-10 items-center gap-2 rounded-xl px-2 text-left sm:px-2.5"
                style={{
                  background:
                    activeEditor === "settings" ? "#F3F0FA" : "#FFFFFF",
                  border:
                    activeEditor === "settings"
                      ? "1px solid rgba(75,46,131,0.24)"
                      : `1px solid ${ui.border}`,
                }}
                title="Open admin profile"
              >
                <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-white">
                  <img
                    src={schoolBrand.logoUrl || defaultSchoolLogo}
                    alt="Admin profile"
                    className="h-full w-full object-contain p-0.5"
                    onError={(event) => {
                      if (event.currentTarget.src !== defaultSchoolLogo) {
                        event.currentTarget.src = defaultSchoolLogo;
                      }
                    }}
                  />
                </span>
                <span className="hidden text-xs font-bold text-slate-800 md:block">
                  Profile
                </span>
              </button>
            </div>
          </div>
        </header>

        <div
          ref={contentScrollRef}
          onScroll={(event) =>
            setShowGoTop(event.currentTarget.scrollTop > 420)
          }
          className="flex-1 overflow-y-auto"
        >
          <div className="max-w-full px-3 py-4 sm:px-5 sm:py-5">
            {!activeEditor ? (
              <div className="space-y-5">
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex min-h-[156px] overflow-hidden rounded-2xl bg-white p-5 sm:p-7"
                  style={{
                    border: `1px solid ${ui.border}`,
                    boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                  }}
                >
                  <span
                    className="absolute bottom-0 left-0 top-0 w-1"
                    style={{ background: colors.red }}
                  />

                  <div className="flex w-full flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                      <div className="mb-2 text-xs font-semibold text-slate-500">
                        School website dashboard
                      </div>

                      <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-3xl">
                        Welcome, {adminUser.name || "Administrator"}
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                        Open messages, review per-item public views, or use the
                        sidebar to edit website content.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditor("notices")}
                        className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold text-white"
                        style={{ background: colors.red }}
                      >
                        <Bell className="h-4 w-4" />
                        Add notice
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditor("announcements")}
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

                <motion.button
                  type="button"
                  onClick={() => navigate("/admin/contact-messages")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="relative flex min-h-[156px] w-full overflow-hidden rounded-2xl bg-white p-5 text-left transition-all hover:-translate-y-0.5 sm:p-7"
                  style={{
                    border: `1px solid ${ui.border}`,
                    boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                  }}
                >
                  <span
                    className="absolute bottom-0 left-0 top-0 w-1"
                    style={{ background: colors.purple }}
                  />

                  <div className="flex w-full flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 items-start gap-4">
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: "#F5F3FF",
                          color: colors.purple,
                        }}
                      >
                        <Mail className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-purple-700">
                          Message Center
                        </div>

                        <h3 className="text-xl font-extrabold text-slate-950 sm:text-2xl">
                          Open Contact & Admission Inquiries
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                          Click this card to read messages, mark them as read,
                          and manage contact or admission inquiries.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 flex-wrap items-center gap-3 sm:justify-end">
                      {[
                        ["Total", messages.length],
                        ["Unread", unreadCount],
                        ["Contact", contactMessageCount],
                        ["Admission", admissionMessageCount],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="min-w-[78px] rounded-xl px-3 py-2.5 text-center"
                          style={{
                            background: "#FAFAFC",
                            border: `1px solid ${ui.border}`,
                          }}
                        >
                          <div className="text-lg font-extrabold text-slate-950">
                            {value}
                          </div>
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            {label}
                          </div>
                        </div>
                      ))}

                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </motion.button>

                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="overflow-hidden rounded-2xl bg-white"
                  style={{
                    border: `1px solid ${ui.border}`,
                    boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                  }}
                >
                  <div
                    className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    style={{ borderBottom: `1px solid ${ui.borderSoft}` }}
                  >
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        Public Content Analytics
                      </div>
                      <h3 className="mt-1 text-xl font-extrabold text-slate-950">
                        Notice and Announcement Views
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Total views and the view count for every individual
                        notice and announcement.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="rounded-xl bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-100">
                        <div className="text-xl font-extrabold text-slate-950">
                          {totalContentViews}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Total Views
                        </div>
                      </div>

                      <div className="rounded-xl bg-red-50 px-4 py-3 text-center ring-1 ring-red-100">
                        <div className="text-xl font-extrabold text-red-700">
                          {totalNoticeViews}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wide text-red-400">
                          Notice Views
                        </div>
                      </div>

                      <div className="rounded-xl bg-orange-50 px-4 py-3 text-center ring-1 ring-orange-100">
                        <div className="text-xl font-extrabold text-orange-700">
                          {totalAnnouncementViews}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wide text-orange-400">
                          Announcement Views
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="max-h-[430px] overflow-y-auto overscroll-contain p-4 sm:p-5"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(75,46,131,0.35) transparent",
                    }}
                  >
                    <div className="grid gap-6 xl:grid-cols-2">
                      <section>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                              <Bell className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-extrabold text-slate-950">
                                Per Notice Views
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                {notices.length} notice
                                {notices.length === 1 ? "" : "s"}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => openEditor("notices")}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-950"
                          >
                            Manage
                          </button>
                        </div>

                        <div className="space-y-2">
                          {noticeAnalytics.length === 0 ? (
                            <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-400">
                              No notices available.
                            </div>
                          ) : (
                            noticeAnalytics.map((notice, index) => (
                              <AnalyticsRow
                                key={notice.id || notice._id || `notice-${index}`}
                                title={notice.title}
                                subtitle={notice.category || "Notice"}
                                badge={notice.pinned ? "Important" : ""}
                                views={getItemViews(notice)}
                                color={colors.red}
                              />
                            ))
                          )}
                        </div>
                      </section>

                      <section>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                              <Megaphone className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-extrabold text-slate-950">
                                Per Announcement Views
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                {announcements.length} announcement
                                {announcements.length === 1 ? "" : "s"}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => openEditor("announcements")}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-950"
                          >
                            Manage
                          </button>
                        </div>

                        <div className="space-y-2">
                          {announcementAnalytics.length === 0 ? (
                            <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-400">
                              No announcements available.
                            </div>
                          ) : (
                            announcementAnalytics.map(
                              (announcement, index) => (
                                <AnalyticsRow
                                  key={
                                    announcement.id ||
                                    `announcement-${index}`
                                  }
                                  title={announcement.title}
                                  subtitle={
                                    announcement.show_on_homepage
                                      ? "Homepage popup"
                                      : "Announcement"
                                  }
                                  badge={
                                    announcement.active === false
                                      ? "Inactive"
                                      : "Active"
                                  }
                                  views={getItemViews(announcement)}
                                  color={colors.orange}
                                />
                              )
                            )
                          )}
                        </div>
                      </section>
                    </div>
                  </div>
                </motion.section>
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
        {showGoTop && (
          <motion.button
            type="button"
            aria-label="Go to top"
            title="Go to top"
            onClick={() =>
              contentScrollRef.current?.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="fixed bottom-5 right-5 z-[90] flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
