import defaultSchoolLogo from "../../assets/school-logo.jpeg";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  MapPin,
  Menu,
  Pencil,
  Phone,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  defaultNavbarContent,
  mergeNavbarContent,
} from "./navbarContent";

const schoolAddress = "Basudev Marga, Hetauda-2";
const schoolPhoneNumbers = ["057-590144", "057-590145", "057-590146"];

const palette = {
  navy: "#17145E",
  gold: "#E7A000",
};

/**
 * These are the requested navigation sections and submenu links.
 * Change the href values if your React Router routes use different paths.
 */
const requestedMenus = {
  about: {
    eyebrow: "GET TO KNOW US",
    title: "About Our School",
    description:
      "Discover our story, values, leadership, and the journey of our school community.",
    links: [
      { label: "Our Story", href: "/about#our-story" },
      { label: "Our Core Values", href: "/about#core-values" },
      { label: "Leadership Messages", href: "/about#leadership" },
      { label: "Timeline", href: "/about#timeline" },
    ],
    featureTitle: "Our journey. Our values.",
    featureText:
      "Learn about the people, principles, and milestones that shape Baljagriti.",
  },
  academics: {
    eyebrow: "LEARNING AT BALJAGRITI",
    title: "Academics at Baljagriti",
    description:
      "Explore our academic strengths, learning approach, and examination system.",
    links: [
      { label: "Academics at Baljagriti", href: "/academics" },
      { label: "Academic Strengths", href: "/academics#academic-strengths" },
      { label: "Our Examination System", href: "/academics#examination-system" },
    ],
    featureTitle: "Learning with purpose",
    featureText:
      "A strong academic foundation that supports curiosity, confidence, and achievement.",
  },
  facilities: {
    eyebrow: "CAMPUS & RESOURCES",
    title: "Explore Our Facilities",
    description:
      "Discover the spaces and resources that support practical, creative, and healthy learning.",
    links: [
      { label: "E-Library", href: "/facilities#e-library" },
      { label: "Computer Lab", href: "/facilities#computer-lab" },
      { label: "Science Laboratory", href: "/facilities#science-laboratory" },
      { label: "Bus Facility", href: "/facilities#bus-facility" },
      { label: "Auditorium", href: "/facilities#auditorium" },
      { label: "Math Lab", href: "/facilities#math-lab" },
      { label: "Yoga Classroom", href: "/facilities#yoga-classroom" },
      { label: "Sports Ground", href: "/facilities#sports-ground" },
    ],
    featureTitle: "A place to explore",
    featureText:
      "From digital learning and laboratories to sports and student activities.",
  },
  staff: {
    eyebrow: "OUR PEOPLE",
    title: "Our Staff & Members",
    description:
      "Meet the teachers, leaders, and staff members who support our students every day.",
    links: [
      { label: "Our Staff & Members", href: "/staff" },
      { label: "Teaching Staff", href: "/staff#teaching-staff" },
      { label: "Administration", href: "/staff#administration" },
      { label: "Departments", href: "/staff#departments" },
    ],
    featureTitle: "Meet our school community",
    featureText:
      "Dedicated people working together to create a supportive learning environment.",
  },
  notices: {
    eyebrow: "SCHOOL INFORMATION",
    title: "Notices & Updates",
    description:
      "Find announcements, school updates, and information for students and families.",
    links: [
      { label: "All Notices", href: "/notices" },
      { label: "News & Updates", href: "/notices" },
    ],
    featureTitle: "Stay informed",
    featureText:
      "Keep up with important announcements and the latest school news.",
  },
  blog: {
    eyebrow: "FROM OUR COMMUNITY",
    title: "Stories & Highlights",
    description:
      "Read about school activities, student achievements, events, and community stories.",
    links: [
      { label: "Latest Articles", href: "/blogs" },
      { label: "Student Activities", href: "/blogs" },
      { label: "Achievements", href: "/blogs" },
    ],
    featureTitle: "Stories worth sharing",
    featureText:
      "Celebrate the experiences and achievements of the Baljagriti community.",
  },
  calendar: {
    eyebrow: "PLAN AHEAD",
    title: "School Calendar",
    description: "See upcoming school events, activities, and important dates.",
    links: [{ label: "View Calendar", href: "/calendar" }],
    featureTitle: "Every important date",
    featureText: "Keep track of the events and milestones in the school year.",
  },
  gallery: {
    eyebrow: "SCHOOL LIFE",
    title: "Photo Gallery",
    description: "Explore moments from classroom learning, events, and activities.",
    links: [{ label: "View Gallery", href: "/gallery" }],
    featureTitle: "Moments at Baljagriti",
    featureText: "A glimpse into the learning and experiences we share.",
  },
  contact: {
    eyebrow: "WE'RE HERE TO HELP",
    title: "Contact Our School",
    description: "Find our contact details or send a message to the school team.",
    links: [
      { label: "Contact Details", href: "/contact" },
      { label: "Send a Message", href: "/contact#contact-form" },
    ],
    featureTitle: "Let's connect",
    featureText: "Reach out to our team for questions, support, or information.",
  },
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

const normalizeKey = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

function getMenuConfig(link) {
  const labelKey = normalizeKey(link.label);
  const hrefKey = normalizeKey(link.href);

  // Only these five navbar items should open a mega-menu.
  // Calendar, Blog, Gallery, and Contact remain normal navigation links.
  const dropdownMenuKeys = [
    "about",
    "academics",
    "notices",
    "facilities",
    "staff",
  ];

  const key = dropdownMenuKeys.find(
    (name) => labelKey.includes(name) || hrefKey.includes(name)
  );

  // Do not show a dropdown even if the backend has submenu data for other links.
  if (!key) return null;

  // Requested menus are the source of truth for these main sections, so old
  // backend submenu data won't accidentally remove the requested links.
  const requested = requestedMenus[key];
  const configured = link.submenu || link.children || link.dropdownItems;

  if (requested) {
    const customImage = link.menuImage || link.image;
    return {
      ...requested,
      eyebrow: link.menuEyebrow || requested.eyebrow,
      title: link.menuTitle || requested.title,
      description: link.menuDescription || requested.description,
      featureTitle: link.featureTitle || requested.featureTitle,
      featureText: link.featureText || requested.featureText,
      image: customImage,
    };
  }

  if (Array.isArray(configured) && configured.length > 0) {
    return {
      eyebrow: link.menuEyebrow || "EXPLORE",
      title: link.menuTitle || link.label,
      description:
        link.menuDescription ||
        `Explore the ${link.label} section of our school website.`,
      links: configured.map((item, index) => ({
        id: item.id || `${link.id || link.label}-${index}`,
        label: item.label || item.title || "Untitled",
        href: item.href || item.path || item.url || link.href || "/",
      })),
      featureTitle: link.featureTitle || "Discover more",
      featureText:
        link.featureText || "Explore more information about our school.",
      image: link.menuImage || link.image,
    };
  }

  return null;
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
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

  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);

    if (location.hash) {
      // Wait for the destination page to render before looking for its section.
      const hash = decodeURIComponent(location.hash.slice(1));
      const timer = window.setTimeout(() => {
        const target = document.getElementById(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);

      return () => window.clearTimeout(timer);
    }

    // When navigating to a new page without a section hash, start at the top.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.hash]);

  const isActive = (href) => {
    if (editMode || !href) return false;
    if (href === "/") return location.pathname === "/";
    return (
      location.pathname === href ||
      location.pathname.startsWith(`${href}/`)
    );
  };

  const selectEditTarget = (event, target) => {
    if (!editMode) return;
    event.preventDefault();
    event.stopPropagation();
    onEditTarget(target);
  };

  const visibleLinks = (navbarContent.links || []).filter(
    (link) => link.visible !== false
  );
  const logoSrc = navbarContent.logoUrl || defaultSchoolLogo;

  const handleLinkClick = (event, target = { type: "menu" }) => {
    if (editMode) {
      selectEditTarget(event, target);
      return;
    }
    setMobileOpen(false);
    setActiveDropdown(null);
  };

  const renderEditIndicator = (label = "Edit menu item") =>
    editMode ? <HoverEditIcon label={label} /> : null;

  const renderDesktopLink = (link) => {
    const menu = getMenuConfig(link);
    const hasMenu = Boolean(menu?.links?.length);
    const active = isActive(link.href);
    const menuId = link.id || link.label;
    const isOpen = activeDropdown === menuId;

    return (
      <div
        key={menuId}
        className="relative flex h-full shrink-0 items-center"
        onMouseEnter={() => {
          if (!editMode && hasMenu) setActiveDropdown(menuId);
        }}
        onMouseLeave={() => {
          if (!editMode) setActiveDropdown(null);
        }}
      >
        <Link
          to={link.href || "/"}
          onClick={(event) => handleLinkClick(event)}
          onFocus={() => {
            if (!editMode && hasMenu) setActiveDropdown(menuId);
          }}
          className={`relative flex h-full items-center gap-1 px-3 text-[15px] transition-colors hover:text-[#17145e] after:absolute after:bottom-[18px] after:left-3 after:right-3 after:h-[3px] after:origin-left after:bg-[#e7a000] after:transition-transform ${
            active || isOpen
              ? "font-semibold text-[#17145e] after:scale-x-100"
              : "after:scale-x-0 hover:after:scale-x-100"
          } ${editMode ? "group" : ""}`}
          aria-current={active ? "page" : undefined}
          aria-haspopup={hasMenu ? "true" : undefined}
          aria-expanded={hasMenu ? isOpen : undefined}
        >
          {link.label}
          {hasMenu && (
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
          {renderEditIndicator("Edit menu items")}
        </Link>

        <AnimatePresence>
          {!editMode && hasMenu && isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onMouseEnter={() => setActiveDropdown(menuId)}
              onMouseLeave={() => setActiveDropdown(null)}
              className="fixed left-4 right-4 top-[110px] z-[70] mx-auto w-auto max-w-[760px] overflow-hidden rounded-b-2xl border border-gray-100 bg-white shadow-[0_20px_55px_rgba(18,20,50,0.18)] sm:left-6 sm:right-6"
              style={{
                maxHeight: "calc(100vh - 126px)",
                overflowY: "auto",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
                <div className="p-4 sm:p-5">
                  <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-[#c58b00]">
                    {menu.eyebrow}
                  </p>
                  <h2 className="text-lg font-extrabold tracking-tight text-[#17145e] sm:text-xl">
                    {menu.title}
                  </h2>
                  <p className="mt-1.5 max-w-md text-[13px] leading-5 text-gray-500">
                    {menu.description}
                  </p>

                  <div className="mt-3 grid grid-cols-1 gap-x-2 gap-y-0.5 sm:grid-cols-2 sm:mt-4">
                    {menu.links.map((item, index) => (
                      <Link
                        key={item.id || `${item.href}-${index}`}
                        to={item.href || "/"}
                        onClick={(event) => handleLinkClick(event)}
                        className="group flex min-w-0 items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-[#28265f] transition hover:bg-[#f7f6ff] hover:text-[#a87500]"
                      >
                        <span className="break-words">{item.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="relative flex min-h-[160px] flex-col justify-end overflow-hidden bg-gradient-to-br from-[#17145e] via-[#25216f] to-[#49346f] p-5 text-white sm:min-h-[210px] sm:p-5">
                  {menu.image ? (
                    <img
                      src={menu.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-35"
                    />
                  ) : (
                    <>
                      <div className="absolute -right-14 -top-16 h-56 w-56 rounded-full border border-white/15" />
                      <div className="absolute -right-4 -top-6 h-36 w-36 rounded-full border border-white/15" />
                      <div className="absolute bottom-16 right-12 h-20 w-20 rotate-12 rounded-2xl border border-white/10 bg-white/5" />
                    </>
                  )}
                  <div className="relative z-10">
                    <span className="mb-4 inline-block h-1 w-14 rounded-full bg-[#e7a000]" />
                    <p className="text-lg font-extrabold leading-tight">
                      {menu.featureTitle}
                    </p>
                    <p className="mt-2 max-w-xs text-[13px] leading-5 text-white/75">
                      {menu.featureText}
                    </p>
                    <Link
                      to={link.href || "/"}
                      onClick={(event) => handleLinkClick(event)}
                      className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold text-white transition hover:text-[#ffd56b]"
                    >
                      Explore section <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.header
      initial={editMode ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-50 h-[64px] w-full bg-[#f4f4f4] text-[#626262] xl:h-[110px]"
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
        style={{ left: "max(16px, calc((100vw - 1120px) / 2))" }}
        className={`absolute left-4 top-3 z-20 flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-xl bg-white shadow-md xl:top-[13px] xl:h-[190px] xl:w-[170px] xl:flex-col xl:rounded-b-[26px] xl:rounded-t-none xl:pt-3 ${
          editMode ? "group rounded-2xl ring-2 ring-amber-400" : ""
        }`}
      >
        <img
          src={logoSrc}
          alt={`${navbarContent.schoolName || "School"} Logo`}
          className="h-full w-full object-contain p-1 xl:h-[118px] xl:w-[135px] xl:p-0"
        />
        <span className="hidden max-w-full px-2 text-center font-extrabold leading-tight text-[#17145e] xl:block xl:text-[17px]">
          {navbarContent.schoolName || "School"}
        </span>
        <span className="hidden max-w-full px-2 pb-3 text-center text-[10px] leading-tight text-[#d88e00] xl:block">
          {navbarContent.schoolSubtitle || "Secondary English School"}
        </span>
        {renderEditIndicator("Edit School Branding")}
      </Link>

      <div className="mx-auto flex h-full max-w-[1120px] flex-col xl:pl-[190px]">
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
            {visibleLinks.map(renderDesktopLink)}
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
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-md p-2 text-[#444] hover:bg-white"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-40 max-h-[calc(100vh-64px)] overflow-y-auto border-t border-gray-200 bg-white shadow-lg xl:hidden"
          >
            <div className="mx-auto grid max-w-2xl gap-1 p-4">
              {visibleLinks.map((link, index) => {
                const menu = getMenuConfig(link);
                const hasMenu = Boolean(menu?.links?.length);
                const menuId = link.id || link.label;
                const expanded = activeDropdown === menuId;

                return (
                  <div key={menuId || index} className="rounded-lg">
                    <div className="flex items-center">
                      <Link
                        to={link.href || "/"}
                        onClick={(event) => handleLinkClick(event)}
                        className={`flex-1 rounded-md px-4 py-3 text-sm font-medium hover:bg-gray-50 ${
                          isActive(link.href)
                            ? "bg-[#fff6df] text-[#17145e]"
                            : "text-gray-700"
                        }`}
                      >
                        {link.label}
                      </Link>
                      {hasMenu && (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveDropdown(expanded ? null : menuId)
                          }
                          className="rounded-md p-3 text-[#17145e] hover:bg-gray-100"
                          aria-label={`Toggle ${link.label} submenu`}
                          aria-expanded={expanded}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {hasMenu && expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 border-l-2 border-[#e7a000] py-1 pl-3">
                            {menu.links.map((item, itemIndex) => (
                              <Link
                                key={item.id || `${item.href}-${itemIndex}`}
                                to={item.href || "/"}
                                onClick={(event) => handleLinkClick(event)}
                                className="block rounded-md px-3 py-2.5 text-sm text-gray-600 hover:bg-[#f7f6ff] hover:text-[#17145e]"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {editMode && (
                <button
                  type="button"
                  onClick={(event) => selectEditTarget(event, { type: "menu" })}
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
