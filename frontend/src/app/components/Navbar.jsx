import defaultSchoolLogo from "../../assets/school-logo.jpeg";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, MapPin, Menu, Pencil, Phone, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  defaultNavbarContent,
  mergeNavbarContent,
} from "./navbarContent";

const desktopLinkLimit = 8;
const schoolAddress = "Basudev Marga, Hetauda-2";
const schoolPhoneNumbers = ["057-590144", "057-590145", "057-590146"];

const palette = {
  navy: "#17145E",
  gold: "#E7A000",
};

function HoverEditIcon({ label = "Edit" }) {
  return (
    <span
      className="admin-navbar-edit-indicator pointer-events-none absolute -top-3 -right-3 z-[90] flex h-8 w-8 scale-90 items-center justify-center rounded-full opacity-0 shadow-xl transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
      style={{
        background: palette.gold,
        color: palette.navy,
        border: "1px solid rgba(255,255,255,0.8)",
      }}
      title={label}
    >
      <Pencil className="h-4 w-4" />
    </span>
  );
}

export function Navbar({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
}) {
  const [loadedNavbarContent, setLoadedNavbarContent] = useState(
    defaultNavbarContent
  );
  const navbarContent = contentOverride
    ? mergeNavbarContent(contentOverride)
    : loadedNavbarContent;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (contentOverride) return;

    const loadNavbarContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/navbar"
        );

        const savedContent = res.data?.data?.content || {};
        setLoadedNavbarContent(mergeNavbarContent(savedContent));
      } catch (error) {
        console.error("Navbar content load error:", error);
      }
    };

    loadNavbarContent();
  }, [contentOverride]);

  useEffect(() => {
    if (editMode) return;

    const onScroll = () => setScrolled(window.scrollY > 20);

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

  const visibleLinks = navbarContent.links.filter(
    (link) => link.visible !== false
  );
  const desktopLinks = visibleLinks.slice(0, desktopLinkLimit);
  const overflowLinks = visibleLinks.slice(desktopLinkLimit);
  const logoSrc = navbarContent.logoUrl || defaultSchoolLogo;

  const handleLinkClick = (event, target = { type: "menu" }) => {
    if (editMode) {
      selectEditTarget(event, target);
      return;
    }

    setOpen(false);
    setOverflowOpen(false);
  };

  const renderLink = (link, className, compact = false) => {
    const active = isActive(link.href);

    return (
      <Link
        key={link.id}
        to={link.href || "/"}
        onClick={(event) => handleLinkClick(event)}
        className={`${className} ${editMode ? "relative group" : ""}`}
        aria-current={active ? "page" : undefined}
        style={
          compact
            ? {
                color: active ? palette.navy : "#555",
                backgroundColor: active ? "#FFF6DF" : "transparent",
              }
            : undefined
        }
      >
        {link.label}
        {editMode && <HoverEditIcon label="Edit menu items" />}
      </Link>
    );
  };

  return (
    <motion.header
      initial={editMode ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-50 h-[64px] w-full bg-[#f4f4f4] text-[#626262] shadow-[0_2px_8px_rgba(0,0,0,0.08)] xl:h-[110px]"
      style={{
        borderTop: "1px solid #d7d7d7",
        boxShadow: scrolled
          ? "0 3px 12px rgba(0,0,0,0.12)"
          : "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Link
        to="/"
        onClick={(event) => {
          if (editMode) {
            selectEditTarget(event, { type: "branding" });
            return;
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        title={editMode ? "Edit school logo and name" : navbarContent.schoolName}
        className={`absolute left-4 top-3 z-20 flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-xl bg-white shadow-md xl:left-[max(16px,calc((100vw-1490px)/2))] xl:top-[13px] xl:h-[235px] xl:w-[200px] xl:flex-col xl:rounded-b-[30px] xl:rounded-t-none xl:pt-5 ${
          editMode ? "group rounded-2xl ring-2 ring-amber-400" : ""
        }`}
      >
        <img
          src={logoSrc}
          alt={`${navbarContent.schoolName || "School"} Logo`}
          className="h-full w-full object-contain p-1 xl:h-[145px] xl:w-[160px] xl:p-0"
        />
        <span className="hidden max-w-full px-2 text-center font-extrabold leading-tight text-[#17145e] xl:block xl:text-[19px]">
          {navbarContent.schoolName || "School"}
        </span>
        <span className="hidden max-w-full px-2 pb-5 text-center text-[12px] leading-tight text-[#d88e00] xl:block">
          {navbarContent.schoolSubtitle || "Secondary English School"}
        </span>
        {editMode && <HoverEditIcon label="Edit School Branding" />}
      </Link>

      <div className="mx-auto flex h-full max-w-[1490px] flex-col xl:pl-[220px]">
        <div className="hidden h-[46px] items-center justify-end gap-5 pr-4 text-[14px] xl:flex">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white text-[#666]">
              <MapPin className="h-[17px] w-[17px]" />
            </span>
            <span>{schoolAddress}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white text-[#666]">
              <Phone className="h-[17px] w-[17px]" />
            </span>
            <span>{schoolPhoneNumbers.join(", ")}</span>
          </div>
        </div>

        <nav
          aria-label="Main navigation"
          className="flex h-full items-center justify-end pl-[78px] pr-4 xl:h-[64px] xl:justify-between xl:pl-0 xl:pr-0"
        >
          <div className="hidden h-full min-w-0 items-center justify-between gap-1 xl:flex">
            {desktopLinks.map((link) =>
              renderLink(
                link,
                "relative flex h-full shrink-0 items-center px-3 text-[15px] transition-colors hover:text-[#17145e] after:absolute after:bottom-[18px] after:left-3 after:right-3 after:h-[3px] after:origin-left after:scale-x-0 after:bg-[#e7a000] after:transition-transform hover:after:scale-x-100 aria-[current=page]:font-semibold aria-[current=page]:text-[#555] aria-[current=page]:after:scale-x-100"
              )
            )}

            {overflowLinks.length > 0 && (
              <div className="relative h-full">
                <button
                  type="button"
                  onClick={() => setOverflowOpen((value) => !value)}
                  className="flex h-full items-center gap-1 px-3 font-semibold text-[#17145e] hover:text-[#e7a000]"
                  aria-expanded={overflowOpen}
                  aria-label={`Show ${overflowLinks.length} more navigation links`}
                >
                  +{overflowLinks.length}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      overflowOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {overflowOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 top-[calc(100%-8px)] z-30 min-w-[190px] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                    >
                      {overflowLinks.map((link) =>
                        renderLink(
                          link,
                          "block px-4 py-3 text-sm hover:bg-gray-50 hover:text-[#17145e]"
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="flex min-w-0 items-center gap-2 xl:hidden">
            <span className="truncate text-sm font-semibold text-[#17145e] sm:text-base">
              {navbarContent.schoolName || "School"}
            </span>
            {editMode && (
              <button
                type="button"
                onClick={(event) => selectEditTarget(event, { type: "menu" })}
                className="rounded p-2 text-[#17145e]"
                aria-label="Edit all menu items"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="rounded-md p-2 text-[#444] hover:bg-white"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-40 max-h-[calc(100vh-64px)] overflow-y-auto border-t border-gray-200 bg-white shadow-lg xl:hidden"
          >
            <div className="mx-auto grid max-w-2xl gap-1 p-4">
              {visibleLinks.length > 0
                ? visibleLinks.map((link) =>
                    renderLink(
                      link,
                      "rounded-md px-4 py-3 text-sm font-medium hover:bg-gray-50",
                      true
                    )
                  )
                : editMode && (
                    <button
                      type="button"
                      onClick={(event) =>
                        selectEditTarget(event, { type: "menu" })
                      }
                      className="rounded-md border border-dashed border-gray-300 px-4 py-3 text-left text-sm"
                    >
                      No visible menu items — click to manage
                    </button>
                  )}

              {editMode && (
                <button
                  type="button"
                  onClick={(event) =>
                    selectEditTarget(event, { type: "menu" })
                  }
                  className="rounded-md border border-dashed border-amber-400 px-4 py-3 text-left text-sm font-semibold text-[#17145e]"
                >
                  Manage All Menu Items
                </button>
              )}

              {navbarContent.showAdmissionButton ? (
                <Link
                  to={navbarContent.admissionButtonLink || "/admissions"}
                  onClick={(event) =>
                    handleLinkClick(event, { type: "admission" })
                  }
                  className="mt-2 rounded-md bg-[#17145e] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  {navbarContent.admissionButtonText || "Admission Open"}
                </Link>
              ) : editMode ? (
                <button
                  type="button"
                  onClick={(event) =>
                    selectEditTarget(event, { type: "admission" })
                  }
                  className="mt-2 rounded-md border border-dashed border-amber-400 px-4 py-3 text-sm font-semibold"
                >
                  Admission button hidden — Edit
                </button>
              ) : null}

              <div className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {schoolAddress}
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {schoolPhoneNumbers.join(", ")}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
