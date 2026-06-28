import defaultSchoolLogo from "../../assets/school-logo.jpeg";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { Camera, Menu, Pencil, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const defaultNavbarContent = {
  logoUrl: "",
  schoolName: "Baljagriti",
  schoolSubtitle: "Secondary English School",
  admissionButtonText: "Admission Open",
  admissionButtonLink: "/admissions",
  showAdmissionButton: true,
  links: [
    { id: "home", label: "Home", href: "/", visible: true },
    { id: "about", label: "About", href: "/about", visible: true },
    { id: "messages", label: "Messages", href: "/messages", visible: true },
    { id: "academics", label: "Academics", href: "/academics", visible: true },
    { id: "notices", label: "Notices", href: "/notices", visible: true },
    { id: "facilities", label: "Facilities", href: "/facilities", visible: true },
    { id: "staff", label: "Staff", href: "/staff", visible: true },
    { id: "gallery", label: "Gallery", href: "/gallery", visible: true },
    { id: "contact", label: "Contact", href: "/contact", visible: true },
  ],
};

const palette = {
  navy: "#020617",
  cyan: "#38BDF8",
  gold: "#FACC15",
  green: "#22C55E",
};

export function mergeNavbarContent(saved = {}) {
  const savedLinks = Array.isArray(saved.links) ? saved.links : [];

  return {
    ...defaultNavbarContent,
    ...saved,
    links: defaultNavbarContent.links.map((defaultLink) => {
      const savedLink = savedLinks.find((link) => link.id === defaultLink.id);

      return {
        ...defaultLink,
        ...(savedLink || {}),
        visible: savedLink?.visible !== false,
      };
    }),
  };
}

function HoverEditIcon({ icon: Icon = Pencil, label = "Edit" }) {
  return (
    <span
      className="pointer-events-none absolute -top-3 -right-3 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${palette.gold}, ${palette.cyan})`,
        color: "#020617",
        border: "1px solid rgba(255,255,255,0.8)",
      }}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </span>
  );
}

export function Navbar({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
}) {
  const [navbarContent, setNavbarContent] = useState(
    mergeNavbarContent(contentOverride || defaultNavbarContent)
  );
  const [scrolled, setScrolled] = useState(editMode);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (contentOverride) {
      setNavbarContent(mergeNavbarContent(contentOverride));
      return;
    }

    const loadNavbarContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/navbar"
        );

        const savedContent = res.data?.data?.content || {};
        setNavbarContent(mergeNavbarContent(savedContent));
      } catch (error) {
        console.error("Navbar content load error:", error);
      }
    };

    loadNavbarContent();
  }, [contentOverride]);

  useEffect(() => {
    if (editMode) {
      setScrolled(true);
      return;
    }

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [editMode]);

  const isActive = (href) => {
    if (editMode) return false;
    if (href === "/") return location.pathname === "/";
    return location.pathname === href;
  };

  const selectEditTarget = (event, target) => {
    if (!editMode) return;

    event.preventDefault();
    event.stopPropagation();
    onEditTarget(target);
  };

  const visibleLinks = navbarContent.links.filter((link) => link.visible);
  const logoSrc = navbarContent.logoUrl || defaultSchoolLogo;

  const quickLinks = ["home", "academics", "notices"]
    .map((id) => navbarContent.links.find((link) => link.id === id))
    .filter(Boolean)
    .filter((link) => link.visible !== false);

  return (
    <>
      <motion.header
        initial={editMode ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className={
          editMode
            ? "relative z-50 w-full px-0 pt-0"
            : "fixed top-0 left-0 right-0 z-50 px-4 pt-3"
        }
      >
        <nav
          className="max-w-[1450px] mx-auto h-[68px] md:h-[76px] px-3 md:px-6 flex items-center justify-between rounded-[1.7rem] transition-all duration-300"
          style={{
            background: scrolled
              ? "linear-gradient(145deg, rgba(2,6,23,0.95), rgba(15,23,42,0.88))"
              : "linear-gradient(145deg, rgba(2,6,23,0.9), rgba(15,23,42,0.78))",
            border: editMode
              ? "2px solid rgba(56,189,248,0.45)"
              : "1px solid rgba(255,255,255,0.14)",
            boxShadow: scrolled
              ? "0 24px 70px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.12)"
              : "0 18px 52px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.1)",
            backdropFilter: "blur(24px)",
          }}
        >
          <Link
            to="/"
            onClick={(e) => {
              if (editMode) {
                e.preventDefault();
                return;
              }

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <div
              onClick={(e) => selectEditTarget(e, { type: "logo" })}
              className={
                editMode
                  ? "relative group cursor-pointer rounded-2xl"
                  : "relative rounded-2xl"
              }
              title={editMode ? "Change logo image" : ""}
            >
              <div
                className="rounded-2xl overflow-hidden bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                style={{
                  width: "46px",
                  height: "46px",
                  border: "1px solid rgba(255,255,255,0.7)",
                  boxShadow:
                    "0 0 0 3px rgba(34,197,94,0.2), 0 14px 34px rgba(34,197,94,0.22)",
                }}
              >
                <img
                  src={logoSrc}
                  alt={`${navbarContent.schoolName} Logo`}
                  className="w-full h-full object-contain p-1"
                />
              </div>

              {editMode && <HoverEditIcon icon={Camera} label="Change Logo" />}
            </div>

            <div className="hidden sm:block">
              <div
                onClick={(e) => selectEditTarget(e, { type: "schoolName" })}
                className={
                  editMode
                    ? "relative group cursor-pointer rounded-lg px-1"
                    : "relative"
                }
                title={editMode ? "Edit school name" : ""}
              >
                <div
                  className="font-bold text-lg leading-tight"
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {navbarContent.schoolName}
                </div>

                {editMode && <HoverEditIcon icon={Pencil} label="Edit Name" />}
              </div>

              <div
                onClick={(e) => selectEditTarget(e, { type: "schoolSubtitle" })}
                className={
                  editMode
                    ? "relative group cursor-pointer rounded-lg px-1"
                    : "relative"
                }
                title={editMode ? "Edit school subtitle" : ""}
              >
                <div
                  className="text-xs leading-tight"
                  style={{ color: palette.green }}
                >
                  {navbarContent.schoolSubtitle}
                </div>

                {editMode && (
                  <HoverEditIcon icon={Pencil} label="Edit Subtitle" />
                )}
              </div>
            </div>
          </Link>

          <div
            className="hidden xl:flex items-center gap-1 px-2 py-2 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.055)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {visibleLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.id}
                  to={link.href || "/"}
                  onClick={(e) => {
                    if (editMode) {
                      selectEditTarget(e, { type: "link", id: link.id });
                    }
                  }}
                  className={
                    editMode
                      ? "relative group px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer"
                      : "relative px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                  }
                  title={editMode ? `Edit ${link.label}` : ""}
                  style={{
                    color: active ? "#020617" : "rgba(255,255,255,0.84)",
                    background: active
                      ? `linear-gradient(135deg, ${palette.gold}, ${palette.cyan})`
                      : "transparent",
                    boxShadow: active
                      ? "0 12px 28px rgba(56,189,248,0.22)"
                      : "none",
                  }}
                >
                  {link.label}
                  {editMode && <HoverEditIcon icon={Pencil} label="Edit Link" />}
                </Link>
              );
            })}
          </div>

          {navbarContent.showAdmissionButton && (
            <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
              <Link
                to={navbarContent.admissionButtonLink || "/admissions"}
                onClick={(e) => {
                  if (editMode) {
                    selectEditTarget(e, { type: "admission" });
                  }
                }}
                className={
                  editMode
                    ? "relative group overflow-hidden px-6 py-3 rounded-2xl text-sm font-bold text-slate-950 transition-all duration-300 hover:scale-105 cursor-pointer"
                    : "relative overflow-hidden px-6 py-3 rounded-2xl text-sm font-bold text-slate-950 transition-all duration-300 hover:scale-105"
                }
                title={editMode ? "Edit admission button" : ""}
                style={{
                  background: `linear-gradient(135deg, ${palette.gold}, ${palette.cyan})`,
                  boxShadow:
                    "0 18px 42px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.42)",
                }}
              >
                <span className="relative z-10">
                  {navbarContent.admissionButtonText} →
                </span>

                {editMode && <HoverEditIcon icon={Pencil} label="Edit Button" />}

                <span
                  className="absolute top-0 bottom-0 w-16 opacity-40"
                  style={{
                    left: 0,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                    animation: "navShine 2.8s ease-in-out infinite",
                  }}
                />
              </Link>
            </div>
          )}

          <div className="xl:hidden flex items-center gap-1.5 ml-auto mr-2">
            {quickLinks.map((link) => (
              <Link
                key={link.id}
                to={link.href || "/"}
                onClick={(e) => {
                  if (editMode) {
                    selectEditTarget(e, { type: "link", id: link.id });
                  } else {
                    setOpen(false);
                  }
                }}
                className="px-2.5 py-2 rounded-xl text-[11px] font-black leading-none transition-all"
                style={{
                  color: isActive(link.href) ? "#020617" : "rgba(255,255,255,0.9)",
                  background: isActive(link.href)
                    ? `linear-gradient(135deg, ${palette.gold}, ${palette.cyan})`
                    : "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden p-2 rounded-xl transition-colors"
            style={{
              color: "#FFFFFF",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </motion.header>

      <style>{`
        @keyframes navShine {
          0% { transform: translateX(-130%) rotate(18deg); }
          100% { transform: translateX(190%) rotate(18deg); }
        }
      `}</style>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className={
              editMode
                ? "absolute top-[96px] left-4 right-4 z-40 xl:hidden rounded-[1.7rem] overflow-hidden"
                : "fixed top-[96px] left-4 right-4 z-40 xl:hidden rounded-[1.7rem] overflow-hidden"
            }
            style={{
              background:
                "linear-gradient(145deg, rgba(2,6,23,0.97), rgba(15,23,42,0.9))",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 28px 80px rgba(0,0,0,0.36)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="p-4 grid gap-1">
              {visibleLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.id}
                    to={link.href || "/"}
                    onClick={(e) => {
                      if (editMode) {
                        selectEditTarget(e, { type: "link", id: link.id });
                      } else {
                        setOpen(false);
                      }
                    }}
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      color: active ? "#020617" : "rgba(255,255,255,0.86)",
                      background: active
                        ? `linear-gradient(135deg, ${palette.gold}, ${palette.cyan})`
                        : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {navbarContent.showAdmissionButton && (
                <Link
                  to={navbarContent.admissionButtonLink || "/admissions"}
                  onClick={(e) => {
                    if (editMode) {
                      selectEditTarget(e, { type: "admission" });
                    } else {
                      setOpen(false);
                    }
                  }}
                  className="mt-3 px-5 py-3 rounded-xl text-sm font-bold text-center text-slate-950"
                  style={{
                    background: `linear-gradient(135deg, ${palette.gold}, ${palette.cyan})`,
                    boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
                  }}
                >
                  {navbarContent.admissionButtonText} →
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;