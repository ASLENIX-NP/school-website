import defaultSchoolLogo from "../../assets/school-logo.jpeg";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  Pencil,
  X,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "motion/react";

/* =========================================================
   BALJAGRITI SCHOOL NAVBAR

   Design:
   - Simple white navbar
   - Sticky while scrolling
   - Green admission button
   - Gold active underline
   - No dark/blue colors
   - Clean institutional school design
   ========================================================= */

const API_URL =
  "https://school-website-backend-ixx2.onrender.com";

/* =========================================================
   DEFAULT NAVBAR CONTENT
   ========================================================= */

export const defaultNavbarContent = {
  logoUrl: "",

  schoolName: "Baljagriti",

  schoolSubtitle:
    "English Secondary School",

  admissionButtonText:
    "Admission Open",

  admissionButtonLink:
    "/admissions",

  showAdmissionButton: true,

  links: [
    {
      id: "home",
      label: "Home",
      href: "/",
      visible: true,
    },

    {
      id: "about",
      label: "About",
      href: "/about",
      visible: true,
    },

    {
      id: "academics",
      label: "Academics",
      href: "/academics",
      visible: true,
    },

    {
      id: "notices",
      label: "Notices",
      href: "/notices",
      visible: true,
    },

    {
      id: "calendar",
      label: "Calendar",
      href: "/calendar",
      visible: true,
    },

    {
      id: "blogs",
      label: "Blog",
      href: "/blogs",
      visible: true,
    },

    {
      id: "facilities",
      label: "Facilities",
      href: "/facilities",
      visible: true,
    },

    {
      id: "staff",
      label: "Staff",
      href: "/staff",
      visible: true,
    },

    {
      id: "gallery",
      label: "Gallery",
      href: "/gallery",
      visible: true,
    },

    {
      id: "contact",
      label: "Contact",
      href: "/contact",
      visible: true,
    },
  ],
};

/* =========================================================
   COLORS
   ========================================================= */

const palette = {
  green: "#168A3A",
  greenDark: "#0F6B2D",

  gold: "#D9A514",

  text: "#222222",
  muted: "#666666",

  border: "#E5E7EB",

  white: "#FFFFFF",

  light: "#F8F8F8",
};

/* =========================================================
   SAFE ID
   ========================================================= */

function makeSafeId(
  value,
  fallback,
  usedIds
) {
  const raw =
    String(
      value ||
        fallback ||
        "menu-item"
    )
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9-_]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        "") ||
    "menu-item";

  let nextId = raw;

  let counter = 2;

  while (usedIds.has(nextId)) {
    nextId =
      `${raw}-${counter}`;

    counter += 1;
  }

  usedIds.add(nextId);

  return nextId;
}

/* =========================================================
   MERGE NAVBAR CONTENT
   ========================================================= */

export function mergeNavbarContent(
  saved = {}
) {
  const hasSavedLinks =
    Array.isArray(
      saved.links
    );

  const sourceLinks =
    hasSavedLinks
      ? saved.links
      : defaultNavbarContent.links;

  const usedIds = new Set();

  const links = sourceLinks
    .filter(
      (link) =>
        link &&
        typeof link === "object"
    )
    .map(
      (link, index) => {
        const matchingDefault =
          defaultNavbarContent.links.find(
            (defaultLink) =>
              defaultLink.id ===
              link.id
          );

        return {
          ...(matchingDefault ||
            {}),
          ...link,

          id: makeSafeId(
            link.id,
            matchingDefault?.id ||
              `menu-${index + 1}`,
            usedIds
          ),

          label: String(
            link.label ??
              matchingDefault?.label ??
              ""
          ).trim(),

          href:
            String(
              link.href ??
                matchingDefault?.href ??
                "/"
            ).trim() || "/",

          visible:
            link.visible !==
            false,
        };
      }
    );

  return {
    ...defaultNavbarContent,

    ...saved,

    logoUrl: String(
      saved.logoUrl ??
        defaultNavbarContent.logoUrl
    ).trim(),

    schoolName: String(
      saved.schoolName ??
        defaultNavbarContent.schoolName
    ).trim(),

    schoolSubtitle: String(
      saved.schoolSubtitle ??
        defaultNavbarContent.schoolSubtitle
    ).trim(),

    admissionButtonText:
      String(
        saved.admissionButtonText ??
          defaultNavbarContent.admissionButtonText
      ).trim(),

    admissionButtonLink:
      String(
        saved.admissionButtonLink ??
          defaultNavbarContent.admissionButtonLink
      ).trim() ||
      "/admissions",

    showAdmissionButton:
      saved.showAdmissionButton !==
      false,

    links,
  };
}

/* =========================================================
   ADMIN EDIT ICON
   ========================================================= */

function HoverEditIcon({
  label = "Edit",
}) {
  return (
    <span
      className="
        pointer-events-none
        absolute
        -top-3
        -right-3
        z-[120]
        opacity-0
        scale-90
        group-hover:opacity-100
        group-hover:scale-100
        transition-all
        duration-200
        rounded-full
        w-7
        h-7
        flex
        items-center
        justify-center
        shadow-lg
      "
      style={{
        background:
          palette.green,

        color:
          "#FFFFFF",

        border:
          "2px solid #FFFFFF",
      }}
      title={label}
    >
      <Pencil className="w-3.5 h-3.5" />
    </span>
  );
}

/* =========================================================
   NAVBAR
   ========================================================= */

export function Navbar({
  editMode = false,

  contentOverride = null,

  onEditTarget = () => {},
}) {
  const [
    navbarContent,
    setNavbarContent,
  ] = useState(
    mergeNavbarContent(
      contentOverride ||
        defaultNavbarContent
    )
  );

  const [
    open,
    setOpen,
  ] = useState(false);

  const location =
    useLocation();

  /* =======================================================
     LOAD NAVBAR CONTENT
     ======================================================= */

  useEffect(() => {
    if (contentOverride) {
      setNavbarContent(
        mergeNavbarContent(
          contentOverride
        )
      );

      return;
    }

    let alive = true;

    const loadNavbarContent =
      async () => {
        try {
          const response =
            await axios.get(
              `${API_URL}/api/site-content/navbar`,
              {
                timeout: 10000,
              }
            );

          if (!alive) {
            return;
          }

          const savedContent =
            response.data?.data
              ?.content || {};

          setNavbarContent(
            mergeNavbarContent(
              savedContent
            )
          );
        } catch (error) {
          console.error(
            "Navbar content load error:",
            error
          );
        }
      };

    loadNavbarContent();

    return () => {
      alive = false;
    };
  }, [
    contentOverride,
  ]);

  /* =======================================================
     CLOSE MOBILE MENU WHEN PAGE CHANGES
     ======================================================= */

  useEffect(() => {
    setOpen(false);
  }, [
    location.pathname,
  ]);

  /* =======================================================
     ACTIVE LINK
     ======================================================= */

  const isActive = (
    href
  ) => {
    if (editMode) {
      return false;
    }

    if (href === "/") {
      return (
        location.pathname ===
          "/" ||
        location.pathname ===
          "/home"
      );
    }

    return (
      location.pathname ===
      href
    );
  };

  /* =======================================================
     EDIT HANDLER
     ======================================================= */

  const selectEditTarget = (
    event,
    target
  ) => {
    if (!editMode) {
      return;
    }

    event.preventDefault();

    event.stopPropagation();

    onEditTarget(target);
  };

  /* =======================================================
     VISIBLE LINKS
     ======================================================= */

  const visibleLinks =
    navbarContent.links.filter(
      (link) =>
        link.visible !==
        false
    );

  /* =======================================================
     LOGO
     ======================================================= */

  const logoSrc =
    navbarContent.logoUrl ||
    defaultSchoolLogo;

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <>
      {/* ===================================================
          STICKY NAVBAR

          IMPORTANT:
          sticky + top-0 keeps this navbar visible
          while the page is being scrolled.

          It is NOT a floating pill.
          It is NOT dark.
          It is NOT blue.
          =================================================== */}

      <header
        className="
          sticky
          top-0
          z-[100]
          w-full
          bg-white
          border-b
          border-slate-200
        "
      >
        <nav
          className="
            max-w-[1280px]
            mx-auto
            min-h-[82px]
            px-5
            sm:px-8
            lg:px-10
            flex
            items-center
            justify-between
            gap-8
          "
        >
          {/* =================================================
              SCHOOL BRAND
              ================================================= */}

          <Link
            to="/"
            onClick={(event) => {
              if (editMode) {
                selectEditTarget(
                  event,
                  {
                    type:
                      "branding",
                  }
                );

                return;
              }

              window.scrollTo({
                top: 0,
                behavior:
                  "smooth",
              });
            }}
            className="
              relative
              group
              flex
              items-center
              gap-3
              flex-shrink-0
            "
            title={
              editMode
                ? "Edit school logo and name"
                : ""
            }
          >
            {/* Logo */}

            <div
              className="
                w-[58px]
                h-[58px]
                flex
                items-center
                justify-center
                bg-white
                overflow-hidden
              "
            >
              <img
                src={logoSrc}
                alt={`${navbarContent.schoolName || "School"} Logo`}
                className="
                  w-full
                  h-full
                  object-contain
                "
              />
            </div>

            {/* School name */}

            <div className="hidden sm:block">
              <div
                className="
                  text-[17px]
                  font-bold
                  leading-tight
                  text-slate-900
                "
              >
                {
                  navbarContent.schoolName
                }
              </div>

              <div
                className="
                  mt-0.5
                  text-[11px]
                  font-medium
                  leading-tight
                "
                style={{
                  color:
                    palette.green,
                }}
              >
                {
                  navbarContent.schoolSubtitle
                }
              </div>
            </div>

            {editMode && (
              <HoverEditIcon
                label="Edit School Branding"
              />
            )}
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
              ================================================= */}

          <div
            onClick={(event) => {
              if (editMode) {
                selectEditTarget(
                  event,
                  {
                    type:
                      "menu",
                  }
                );
              }
            }}
            className={`
              relative
              group
              hidden
              lg:flex
              items-center
              justify-center
              flex-1
              ${
                editMode
                  ? "cursor-pointer"
                  : ""
              }
            `}
          >
            <div
              className="
                flex
                items-center
                justify-center
                gap-1
              "
            >
              {visibleLinks.map(
                (link) => {
                  const active =
                    isActive(
                      link.href
                    );

                  return (
                    <Link
                      key={
                        link.id
                      }
                      to={
                        link.href ||
                        "/"
                      }
                      onClick={(
                        event
                      ) => {
                        if (
                          editMode
                        ) {
                          selectEditTarget(
                            event,
                            {
                              type:
                                "menu",
                            }
                          );
                        }
                      }}
                      className="
                        relative
                        px-3
                        py-4
                        text-[14px]
                        font-medium
                        text-slate-700
                        transition-colors
                        duration-200
                        hover:text-slate-950
                      "
                    >
                      {
                        link.label
                      }

                      {/* Active gold underline */}

                      <span
                        className="
                          absolute
                          left-3
                          right-3
                          bottom-0
                          h-[2px]
                          transition-all
                          duration-200
                        "
                        style={{
                          background:
                            active
                              ? palette.gold
                              : "transparent",
                        }}
                      />
                    </Link>
                  );
                }
              )}
            </div>

            {editMode && (
              <HoverEditIcon
                label="Manage All Menu Items"
              />
            )}
          </div>

          {/* =================================================
              GREEN ADMISSION BUTTON
              ================================================= */}

          <div
            className="
              hidden
              lg:flex
              items-center
              flex-shrink-0
            "
          >
            {navbarContent.showAdmissionButton ? (
              <Link
                to={
                  navbarContent.admissionButtonLink ||
                  "/admissions"
                }
                onClick={(
                  event
                ) => {
                  if (
                    editMode
                  ) {
                    selectEditTarget(
                      event,
                      {
                        type:
                          "admission",
                      }
                    );
                  }
                }}
                className="
                  relative
                  group
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  bg-[#168A3A]
                  border
                  border-[#168A3A]
                  text-white
                  text-[13px]
                  font-bold
                  transition-all
                  duration-200
                  hover:bg-[#0F6B2D]
                  hover:border-[#0F6B2D]
                "
                title={
                  editMode
                    ? "Edit admission button"
                    : ""
                }
              >
                {
                  navbarContent.admissionButtonText
                }

                <span
                  className="
                    text-base
                    leading-none
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>

                {editMode && (
                  <HoverEditIcon
                    label="Edit Admission Button"
                  />
                )}
              </Link>
            ) : editMode ? (
              <button
                type="button"
                onClick={(event) =>
                  selectEditTarget(
                    event,
                    {
                      type:
                        "admission",
                    }
                  )
                }
                className="
                  px-4
                  py-2
                  border
                  border-dashed
                  border-slate-400
                  text-xs
                  font-bold
                  text-slate-500
                "
              >
                Admission button hidden
              </button>
            ) : null}
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
              ================================================= */}

          <button
            type="button"
            onClick={() =>
              setOpen(
                (value) =>
                  !value
              )
            }
            className="
              lg:hidden
              w-10
              h-10
              flex
              items-center
              justify-center
              border
              border-slate-300
              text-slate-800
              bg-white
              transition-colors
              hover:bg-slate-50
            "
            aria-label="Toggle navigation menu"
          >
            {open ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </nav>
      </header>

      {/* ===================================================
          MOBILE MENU
          =================================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              lg:hidden
              sticky
              top-[82px]
              z-[90]
              w-full
              bg-white
              border-b
              border-slate-200
              shadow-sm
            "
          >
            <div
              className="
                max-w-[1280px]
                mx-auto
                px-5
                py-3
              "
            >
              {/* Mobile links */}

              <div
                className="
                  flex
                  flex-col
                "
              >
                {visibleLinks.map(
                  (link) => {
                    const active =
                      isActive(
                        link.href
                      );

                    return (
                      <Link
                        key={
                          link.id
                        }
                        to={
                          link.href ||
                          "/"
                        }
                        onClick={(
                          event
                        ) => {
                          if (
                            editMode
                          ) {
                            selectEditTarget(
                              event,
                              {
                                type:
                                  "menu",
                              }
                            );
                          } else {
                            setOpen(
                              false
                            );
                          }
                        }}
                        className="
                          relative
                          py-3.5
                          px-2
                          border-b
                          border-slate-100
                          text-sm
                          font-medium
                          transition-colors
                        "
                        style={{
                          color:
                            active
                              ? palette.green
                              : palette.text,

                          fontWeight:
                            active
                              ? 700
                              : 500,
                        }}
                      >
                        {
                          link.label
                        }

                        {active && (
                          <span
                            className="
                              absolute
                              left-0
                              bottom-0
                              w-8
                              h-[2px]
                            "
                            style={{
                              background:
                                palette.gold,
                            }}
                          />
                        )}
                      </Link>
                    );
                  }
                )}
              </div>

              {/* =================================================
                  MOBILE GREEN ADMISSION BUTTON
                  ================================================= */}

              {navbarContent.showAdmissionButton && (
                <Link
                  to={
                    navbarContent.admissionButtonLink ||
                    "/admissions"
                  }
                  onClick={(
                    event
                  ) => {
                    if (
                      editMode
                    ) {
                      selectEditTarget(
                        event,
                        {
                          type:
                            "admission",
                        }
                      );
                    } else {
                      setOpen(
                        false
                      );
                    }
                  }}
                  className="
                    mt-4
                    mb-2
                    flex
                    items-center
                    justify-center
                    gap-2
                    w-full
                    px-5
                    py-3
                    bg-[#168A3A]
                    border
                    border-[#168A3A]
                    text-white
                    text-sm
                    font-bold
                    transition-colors
                    hover:bg-[#0F6B2D]
                    hover:border-[#0F6B2D]
                  "
                >
                  {
                    navbarContent.admissionButtonText
                  }

                  <span>
                    →
                  </span>
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