import {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import {
  ArrowRight,
  Pencil,
  X,
} from "lucide-react";

import PdfNoticePreview from "./PdfNoticePreview";
import HomeAnnouncementPopup from "./HomeAnnouncementPopup";

import {
  formatBsNoticeDate,
} from "./BsNoticeDatePicker";

/* =========================================================
   API
   ========================================================= */

const API_URL =
  "https://school-website-backend-ixx2.onrender.com";


/* =========================================================
   BALJAGRITI BRAND COLORS
   ========================================================= */

const palette = {
  green: "#168A3A",
  greenDark: "#0C682B",

  yellow: "#E7B92F",
  yellowSoft: "#FFF4C7",

  red: "#D43B32",
  redSoft: "#FFE9E6",

  orange: "#F29B38",

  dark: "#111827",
  text: "#475569",
  muted: "#64748B",

  white: "#FFFFFF",
  cream: "#FFFDF8",
};


/* =========================================================
   PUBLIC VIEW TRACKING
   ========================================================= */

async function recordPublicView(type, id) {
  if (
    !id ||
    !["notice", "announcement"].includes(type)
  ) {
    return;
  }

  const storageKey =
    `baljagriti-${type}-view-${id}`;

  try {
    if (sessionStorage.getItem(storageKey)) {
      return;
    }
  } catch {
    // Ignore storage errors.
  }

  const endpoint =
    type === "notice"
      ? `${API_URL}/api/notices/${id}/view`
      : `${API_URL}/api/announcements/${id}/view`;

  try {
    const response = await fetch(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{}",
        keepalive: true,
      }
    );

    if (!response.ok) {
      throw new Error(
        `View request failed: ${response.status}`
      );
    }

    try {
      sessionStorage.setItem(
        storageKey,
        "1"
      );
    } catch {
      // Ignore storage errors.
    }
  } catch (error) {
    console.error(
      `Could not record ${type} view:`,
      error
    );
  }
}


/* =========================================================
   DEFAULT DATA
   ========================================================= */

export const defaultStatsSectionData = {
  eyebrow: "School Highlights",

  title:
    "Numbers that reflect our journey.",

  description:
    "A growing learning community committed to academic excellence, character, creativity, and the holistic development of every student.",

  stats: [
    {
      value: "1500",
      suffix: "+",
      label: "Enrolled Students",
      note: "Across school programs",
    },

    {
      value: "80",
      suffix: "+",
      label: "Expert Teachers",
      note: "Academic and support team",
    },

    {
      value: "37",
      suffix: " yrs",
      label: "Years of Excellence",
      note: "Serving Makwanpur",
    },

    {
      value: "98",
      suffix: "%",
      label: "Success Rate",
      note: "Academic performance",
    },
  ],

  excellence: {
    title:
      "Academic Excellence",

    description:
      "Our students are encouraged to achieve academic excellence while developing confidence, creativity, discipline, leadership, and strong values.",

    cards: [
      {
        title:
          "Strong Academic Results",

        description:
          "A focused academic environment helps students build strong foundations and achieve their educational goals.",
      },

      {
        title:
          "Holistic Development",

        description:
          "We support students beyond the classroom through creativity, leadership, sports, activities, and practical learning.",
      },

      {
        title:
          "Future Ready Students",

        description:
          "Digital learning, communication skills, discipline, and values prepare students for a changing world.",
      },
    ],
  },

  notices: {
    title:
      "Latest Notices",

    description:
      "Stay informed with the latest school announcements and important updates.",
  },
};


/* =========================================================
   MERGE DATA
   ========================================================= */

export function mergeStatsSectionData(saved = {}) {
  return {
    ...defaultStatsSectionData,

    ...saved,

    stats:
      Array.isArray(saved.stats) &&
      saved.stats.length > 0
        ? defaultStatsSectionData.stats.map(
            (item, index) => ({
              ...item,
              ...(saved.stats[index] || {}),
            })
          )
        : defaultStatsSectionData.stats,

    excellence: {
      ...defaultStatsSectionData.excellence,
      ...(saved.excellence || {}),

      cards:
        Array.isArray(
          saved.excellence?.cards
        )
          ? defaultStatsSectionData.excellence.cards.map(
              (item, index) => ({
                ...item,
                ...(saved.excellence.cards[index] || {}),
              })
            )
          : defaultStatsSectionData.excellence.cards,
    },

    notices: {
      ...defaultStatsSectionData.notices,
      ...(saved.notices || {}),
    },
  };
}


/* =========================================================
   EDIT BUTTON
   ========================================================= */

function EditIconButton({
  editMode,
  target,
  onEditTarget,
  icon: Icon = Pencil,
  label = "Edit",
}) {
  if (!editMode) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        onEditTarget(target);
      }}
      className="
        absolute
        -top-3
        -right-3
        z-[90]
        opacity-0
        scale-90
        group-hover:opacity-100
        group-hover:scale-100
        transition-all
        duration-200
        w-8
        h-8
        rounded-full
        flex
        items-center
        justify-center
        shadow-xl
      "
      style={{
        background: palette.green,
        color: palette.white,
        border: "2px solid white",
      }}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}


/* =========================================================
   EDITABLE WRAPPER
   ========================================================= */

function EditableWrap({
  editMode,
  target,
  onEditTarget,
  icon = Pencil,
  label = "Edit",
  className = "",
  children,
}) {
  if (!editMode) {
    return children;
  }

  return (
    <div
      className={`relative group ${className}`}
    >
      {children}

      <EditIconButton
        editMode={editMode}
        target={target}
        onEditTarget={onEditTarget}
        icon={icon}
        label={label}
      />
    </div>
  );
}


/* =========================================================
   NUMBER COUNTER
   ========================================================= */

function Counter({
  target,
  suffix,
  editMode = false,
}) {
  const [count, setCount] = useState(0);

  const ref = useRef(null);

  const numericTarget =
    Number.parseInt(
      String(target || "0"),
      10
    ) || 0;

  useEffect(() => {
    if (editMode) {
      setCount(numericTarget);
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    let animated = false;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting &&
            !animated
          ) {
            animated = true;

            const duration = 1200;
            const start =
              performance.now();

            const animate = (time) => {
              const progress =
                Math.min(
                  (time - start) /
                    duration,
                  1
                );

              const eased =
                1 -
                Math.pow(
                  1 - progress,
                  3
                );

              setCount(
                Math.floor(
                  numericTarget *
                    eased
                )
              );

              if (progress < 1) {
                requestAnimationFrame(
                  animate
                );
              }
            };

            requestAnimationFrame(
              animate
            );
          }
        },
        {
          threshold: 0.35,
        }
      );

    observer.observe(element);

    return () =>
      observer.disconnect();
  }, [
    numericTarget,
    editMode,
  ]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}


/* =========================================================
   NOTICE HELPERS
   ========================================================= */

function getNoticeTime(value) {
  const time =
    new Date(
      value || 0
    ).getTime();

  return Number.isNaN(time)
    ? 0
    : time;
}


function sortNotices(list = []) {
  return [...list].sort(
    (a, b) => {
      const pinnedA =
        a?.pinned ? 1 : 0;

      const pinnedB =
        b?.pinned ? 1 : 0;

      if (
        pinnedA !== pinnedB
      ) {
        return (
          pinnedB -
          pinnedA
        );
      }

      return (
        getNoticeTime(
          b?.created_at ||
            b?.createdAt
        ) -
        getNoticeTime(
          a?.created_at ||
            a?.createdAt
        )
      );
    }
  );
}


function getNoticeExcerpt(notice) {
  const text =
    notice?.description ||
    notice?.content ||
    "Click to read the full school notice.";

  return text.length > 110
    ? `${text.slice(0, 110)}...`
    : text;
}


/* =========================================================
   MAIN STATS COMPONENT
   ========================================================= */

function Stats({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
}) {
  const [
    statsData,
    setStatsData,
  ] = useState(() =>
    mergeStatsSectionData(
      contentOverride ||
        defaultStatsSectionData
    )
  );

  const [
    notices,
    setNotices,
  ] = useState([]);

  const [
    selectedNotice,
    setSelectedNotice,
  ] = useState(null);


  /* =======================================================
     LOAD CONTENT
     ======================================================= */

  useEffect(() => {
    if (contentOverride) {
      setStatsData(
        mergeStatsSectionData(
          contentOverride
        )
      );

      return;
    }

    let alive = true;

    async function loadContent() {
      try {
        const response =
          await axios.get(
            `${API_URL}/api/site-content/home`,
            {
              timeout: 10000,
            }
          );

        if (!alive) {
          return;
        }

        const saved =
          response.data
            ?.data
            ?.content
            ?.statsSection;

        setStatsData(
          mergeStatsSectionData(
            saved ||
              defaultStatsSectionData
          )
        );
      } catch (error) {
        console.error(
          "Stats content load error:",
          error
        );

        if (alive) {
          setStatsData(
            mergeStatsSectionData(
              defaultStatsSectionData
            )
          );
        }
      }
    }

    loadContent();

    return () => {
      alive = false;
    };
  }, [
    contentOverride,
  ]);


  /* =======================================================
     LOAD NOTICES
     ======================================================= */

  useEffect(() => {
    if (editMode) {
      return undefined;
    }

    let alive = true;

    fetch(
      `${API_URL}/api/notices`,
      {
        cache: "no-store",
      }
    )
      .then(
        (response) =>
          response.json()
      )
      .then((data) => {
        if (!alive) {
          return;
        }

        const list =
          Array.isArray(data)
            ? data
            : Array.isArray(
                data?.data
              )
            ? data.data
            : [];

        setNotices(
          sortNotices(
            list
          ).slice(0, 3)
        );
      })
      .catch((error) => {
        console.error(
          "Notice loading error:",
          error
        );
      });

    return () => {
      alive = false;
    };
  }, [
    editMode,
  ]);


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <>
      {!editMode && (
        <HomeAnnouncementPopup />
      )}

      <section
        className="
          relative
          overflow-hidden
          py-16
          sm:py-20
          lg:py-24
        "
        style={{
          background: `
            radial-gradient(
              circle at 8% 8%,
              rgba(22,138,58,0.13),
              transparent 24%
            ),
            radial-gradient(
              circle at 92% 15%,
              rgba(231,185,47,0.16),
              transparent 25%
            ),
            radial-gradient(
              circle at 80% 68%,
              rgba(212,59,50,0.055),
              transparent 20%
            ),
            radial-gradient(
              circle at 15% 78%,
              rgba(231,185,47,0.08),
              transparent 22%
            ),
            linear-gradient(
              180deg,
              #FFFDF8 0%,
              #FFFFFF 42%,
              #FFFDF8 100%
            )
          `,
        }}
      >

        {/* =================================================
            MAIN CONTENT
            ================================================= */}

        <div
          className="
            relative
            z-10
            max-w-[1280px]
            mx-auto
            px-5
            sm:px-8
            lg:px-10
          "
        >

          {/* =================================================
              SECTION HEADING
              ================================================= */}

          <EditableWrap
            editMode={editMode}
            target={{
              type:
                "statsHeader",
            }}
            onEditTarget={
              onEditTarget
            }
            label="Edit statistics heading"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.55,
              }}
              className="
                text-center
                max-w-3xl
                mx-auto
                mb-12
              "
            >

              {/* SIMPLE LABEL */}

              <div
                className="
                  inline-flex
                  items-center
                  px-4
                  py-2
                  rounded-full
                  border
                  bg-white/80
                  backdrop-blur-sm
                  shadow-sm
                "
                style={{
                  borderColor:
                    "rgba(22,138,58,0.18)",
                }}
              >
                <span
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-slate-700
                  "
                >
                  School Highlights
                </span>
              </div>


              <h2
                className="
                  mt-5
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                {
                  statsData.title
                }
              </h2>


              {/* BRAND LINE */}

              <div
                className="
                  flex
                  justify-center
                  items-center
                  gap-1.5
                  mt-5
                "
              >
                <span
                  className="
                    w-14
                    h-[3px]
                    rounded-full
                  "
                  style={{
                    background:
                      palette.green,
                  }}
                />

                <span
                  className="
                    w-5
                    h-[3px]
                    rounded-full
                  "
                  style={{
                    background:
                      palette.yellow,
                  }}
                />

                <span
                  className="
                    w-3
                    h-[3px]
                    rounded-full
                  "
                  style={{
                    background:
                      palette.red,
                  }}
                />
              </div>


              <p
                className="
                  mt-5
                  text-base
                  md:text-lg
                  leading-8
                  text-slate-500
                "
              >
                {
                  statsData.description
                }
              </p>

            </motion.div>
          </EditableWrap>


          {/* =================================================
              STATISTICS CARDS
              ================================================= */}

          <div
            className="
              grid
              grid-cols-2
              lg:grid-cols-4
              gap-4
              lg:gap-5
              mb-24
            "
          >
            {statsData.stats.map(
              (
                stat,
                index
              ) => {

                const cardColors = [
                  {
                    main:
                      palette.green,

                    soft:
                      "rgba(22,138,58,0.09)",

                    border:
                      "rgba(22,138,58,0.20)",
                  },

                  {
                    main:
                      palette.yellow,

                    soft:
                      "rgba(231,185,47,0.13)",

                    border:
                      "rgba(231,185,47,0.28)",
                  },

                  {
                    main:
                      palette.red,

                    soft:
                      "rgba(212,59,50,0.07)",

                    border:
                      "rgba(212,59,50,0.18)",
                  },

                  {
                    main:
                      palette.greenDark,

                    soft:
                      "rgba(12,104,43,0.08)",

                    border:
                      "rgba(12,104,43,0.18)",
                  },
                ];

                const color =
                  cardColors[
                    index %
                      cardColors.length
                  ];

                return (
                  <EditableWrap
                    key={
                      `${stat.label}-${index}`
                    }
                    editMode={
                      editMode
                    }
                    target={{
                      type:
                        "statsCard",
                      index,
                    }}
                    onEditTarget={
                      onEditTarget
                    }
                    label="Edit statistic"
                  >
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration:
                          0.45,
                        delay:
                          index *
                          0.08,
                      }}
                      className="
                        relative
                        overflow-hidden
                        min-h-[205px]
                        p-6
                        sm:p-7
                        lg:p-8
                        rounded-[24px]
                        bg-white/90
                        backdrop-blur-sm
                        border
                        shadow-[0_15px_45px_rgba(15,23,42,0.06)]
                        hover:-translate-y-1.5
                        hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]
                        transition-all
                        duration-300
                      "
                      style={{
                        borderColor:
                          color.border,
                      }}
                    >

                      {/* TOP COLOR STRIP */}

                      <div
                        className="
                          absolute
                          top-0
                          left-0
                          right-0
                          h-1
                        "
                        style={{
                          background:
                            color.main,
                        }}
                      />


                      {/* SOFT COLOR BLOB */}

                      <div
                        className="
                          absolute
                          -right-12
                          -top-12
                          w-32
                          h-32
                          rounded-full
                          blur-2xl
                          pointer-events-none
                        "
                        style={{
                          background:
                            color.soft,
                        }}
                      />


                      {/* CARD NUMBER */}

                      <div
                        className="
                          relative
                          text-xs
                          font-bold
                          tracking-widest
                          mb-7
                        "
                        style={{
                          color:
                            color.main,
                        }}
                      >
                        0{index + 1}
                      </div>


                      {/* BIG NUMBER */}

                      <div
                        className="
                          relative
                          text-4xl
                          sm:text-5xl
                          font-bold
                          tracking-tight
                          text-slate-900
                        "
                      >
                        <Counter
                          target={
                            stat.value
                          }
                          suffix={
                            stat.suffix
                          }
                          editMode={
                            editMode
                          }
                        />
                      </div>


                      {/* LABEL */}

                      <div
                        className="
                          relative
                          mt-3
                          text-sm
                          sm:text-base
                          font-bold
                          text-slate-800
                        "
                      >
                        {
                          stat.label
                        }
                      </div>


                      {/* NOTE */}

                      <div
                        className="
                          relative
                          mt-1
                          text-xs
                          sm:text-sm
                          leading-6
                          text-slate-500
                        "
                      >
                        {
                          stat.note
                        }
                      </div>

                    </motion.div>
                  </EditableWrap>
                );
              }
            )}
          </div>


          {/* =================================================
              ACADEMIC EXCELLENCE
              ================================================= */}

          <div
            className="
              relative
              mb-28
            "
          >

            {/* SOFT COLOR BACKGROUND */}

            <div
              className="
                absolute
                inset-0
                rounded-[36px]
                pointer-events-none
              "
              style={{
                background: `
                  radial-gradient(
                    circle at 10% 20%,
                    rgba(22,138,58,0.08),
                    transparent 25%
                  ),
                  radial-gradient(
                    circle at 90% 80%,
                    rgba(231,185,47,0.11),
                    transparent 25%
                  ),
                  rgba(255,255,255,0.65)
                `,
              }}
            />


            <div
              className="
                relative
                px-4
                sm:px-8
                lg:px-12
                py-10
                sm:py-14
              "
            >

              <EditableWrap
                editMode={
                  editMode
                }
                target={{
                  type:
                    "excellenceHeader",
                }}
                onEditTarget={
                  onEditTarget
                }
                label="Edit excellence heading"
              >
                <div
                  className="
                    text-center
                    max-w-3xl
                    mx-auto
                    mb-12
                  "
                >

                  <h2
                    className="
                      text-3xl
                      md:text-4xl
                      lg:text-5xl
                      font-bold
                      text-slate-900
                    "
                  >
                    {
                      statsData
                        .excellence
                        .title
                    }
                  </h2>


                  {/* BRAND LINE */}

                  <div
                    className="
                      flex
                      justify-center
                      items-center
                      gap-1.5
                      mt-5
                    "
                  >
                    <span
                      className="
                        w-12
                        h-[3px]
                        rounded-full
                      "
                      style={{
                        background:
                          palette.green,
                      }}
                    />

                    <span
                      className="
                        w-5
                        h-[3px]
                        rounded-full
                      "
                      style={{
                        background:
                          palette.yellow,
                      }}
                    />

                    <span
                      className="
                        w-3
                        h-[3px]
                        rounded-full
                      "
                      style={{
                        background:
                          palette.red,
                      }}
                    />
                  </div>


                  <p
                    className="
                      mt-5
                      text-base
                      md:text-lg
                      leading-8
                      text-slate-500
                    "
                  >
                    {
                      statsData
                        .excellence
                        .description
                    }
                  </p>

                </div>
              </EditableWrap>


              {/* EXCELLENCE CARDS */}

              <div
                className="
                  grid
                  md:grid-cols-3
                  gap-5
                "
              >
                {statsData.excellence.cards.map(
                  (
                    card,
                    index
                  ) => {

                    const colors = [
                      palette.green,
                      palette.yellow,
                      palette.red,
                    ];

                    const currentColor =
                      colors[
                        index % 3
                      ];

                    return (
                      <EditableWrap
                        key={
                          `${card.title}-${index}`
                        }
                        editMode={
                          editMode
                        }
                        target={{
                          type:
                            "excellenceCard",
                          index,
                        }}
                        onEditTarget={
                          onEditTarget
                        }
                        label="Edit excellence card"
                      >
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 20,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                          }}
                          viewport={{
                            once: true,
                          }}
                          transition={{
                            duration:
                              0.45,
                            delay:
                              index *
                              0.08,
                          }}
                          className="
                            relative
                            overflow-hidden
                            bg-white
                            rounded-[24px]
                            border
                            border-slate-200
                            p-7
                            shadow-[0_12px_40px_rgba(15,23,42,0.05)]
                            hover:-translate-y-1
                            hover:shadow-[0_20px_50px_rgba(15,23,42,0.09)]
                            transition-all
                            duration-300
                          "
                        >

                          {/* TOP COLOR STRIP */}

                          <div
                            className="
                              absolute
                              top-0
                              left-0
                              right-0
                              h-1
                            "
                            style={{
                              background:
                                currentColor,
                            }}
                          />


                          {/* CARD NUMBER */}

                          <div
                            className="
                              w-10
                              h-10
                              flex
                              items-center
                              justify-center
                              text-sm
                              font-bold
                              mb-6
                              rounded-xl
                            "
                            style={{
                              background:
                                `${currentColor}12`,
                              color:
                                currentColor,
                            }}
                          >
                            0{index + 1}
                          </div>


                          <h3
                            className="
                              text-xl
                              font-bold
                              text-slate-900
                            "
                          >
                            {
                              card.title
                            }
                          </h3>


                          <p
                            className="
                              mt-3
                              text-sm
                              md:text-base
                              leading-7
                              text-slate-500
                            "
                          >
                            {
                              card.description
                            }
                          </p>

                        </motion.div>
                      </EditableWrap>
                    );
                  }
                )}
              </div>

            </div>
          </div>


          {/* =================================================
              LATEST NOTICES
              ================================================= */}

          {!editMode && (
            <div>

              <div
                className="
                  flex
                  flex-col
                  md:flex-row
                  md:items-end
                  md:justify-between
                  gap-5
                  mb-8
                "
              >

                <div>

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      mb-4
                    "
                  >
                    <span
                      className="
                        w-10
                        h-[3px]
                        rounded-full
                      "
                      style={{
                        background:
                          palette.green,
                      }}
                    />

                    <span
                      className="
                        w-5
                        h-[3px]
                        rounded-full
                      "
                      style={{
                        background:
                          palette.yellow,
                      }}
                    />

                    <span
                      className="
                        w-3
                        h-[3px]
                        rounded-full
                      "
                      style={{
                        background:
                          palette.red,
                      }}
                    />
                  </div>


                  <h2
                    className="
                      text-3xl
                      md:text-4xl
                      font-bold
                      text-slate-900
                    "
                  >
                    {
                      statsData
                        .notices
                        .title
                    }
                  </h2>


                  <p
                    className="
                      mt-3
                      text-base
                      leading-7
                      text-slate-500
                    "
                  >
                    {
                      statsData
                        .notices
                        .description
                    }
                  </p>

                </div>


                <Link
                  to="/notices"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    font-bold
                    text-[#168A3A]
                    hover:gap-3
                    transition-all
                  "
                >
                  View All

                  <ArrowRight
                    className="w-4 h-4"
                  />
                </Link>

              </div>


              {notices.length === 0 ? (

                <div
                  className="
                    rounded-[24px]
                    border
                    border-slate-200
                    bg-white
                    p-10
                    text-center
                    shadow-sm
                  "
                >

                  <h3
                    className="
                      text-xl
                      font-bold
                      text-slate-900
                    "
                  >
                    No notices available
                    right now
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    New school notices
                    will appear here.
                  </p>

                </div>

              ) : (

                <div
                  className="
                    rounded-[24px]
                    overflow-hidden
                    border
                    border-slate-200
                    bg-white
                    shadow-[0_15px_45px_rgba(15,23,42,0.05)]
                  "
                >

                  {notices.map(
                    (
                      notice,
                      index
                    ) => {

                      const noticeId =
                        notice.id ||
                        notice._id;

                      const noticeDate =
                        notice.notice_date ||
                        notice.date;

                      const hasPdf =
                        Boolean(
                          notice.pdf_url ||
                          notice.pdfUrl
                        );

                      return (
                        <motion.div
                          key={
                            noticeId ||
                            notice.title ||
                            index
                          }
                          initial={{
                            opacity: 0,
                            y: 15,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                          }}
                          viewport={{
                            once: true,
                          }}
                        >

                          <button
                            type="button"
                            onClick={() => {
                              recordPublicView(
                                "notice",
                                noticeId
                              );

                              setSelectedNotice(
                                notice
                              );
                            }}
                            className="
                              group
                              w-full
                              text-left
                              px-5
                              sm:px-7
                              py-6
                              hover:bg-[#FFFDF8]
                              transition-colors
                              border-b
                              border-slate-100
                              last:border-b-0
                            "
                          >

                            <div
                              className="
                                grid
                                md:grid-cols-[150px_1fr_auto]
                                gap-5
                                items-center
                              "
                            >

                              {/* DATE */}

                              <div>

                                <div
                                  className="
                                    text-[11px]
                                    uppercase
                                    tracking-wider
                                    font-bold
                                    text-slate-400
                                  "
                                >
                                  Notice Date
                                </div>

                                <div
                                  className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                  "
                                >
                                  {
                                    formatBsNoticeDate(
                                      noticeDate
                                    )
                                  }
                                </div>

                              </div>


                              {/* CONTENT */}

                              <div>

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                    mb-1
                                  "
                                >

                                  <span
                                    className="
                                      text-xs
                                      font-bold
                                      text-[#168A3A]
                                    "
                                  >
                                    {
                                      notice.category ||
                                      "Notice"
                                    }
                                  </span>

                                  {hasPdf && (
                                    <span
                                      className="
                                        text-xs
                                        text-slate-400
                                      "
                                    >
                                      PDF
                                    </span>
                                  )}

                                </div>


                                <h3
                                  className="
                                    text-lg
                                    md:text-xl
                                    font-bold
                                    text-slate-900
                                    group-hover:text-[#168A3A]
                                    transition-colors
                                  "
                                >
                                  {
                                    notice.title ||
                                    "School Notice"
                                  }
                                </h3>


                                <p
                                  className="
                                    mt-1
                                    text-sm
                                    leading-6
                                    text-slate-500
                                  "
                                >
                                  {
                                    getNoticeExcerpt(
                                      notice
                                    )
                                  }
                                </p>

                              </div>


                              {/* ARROW */}

                              <div
                                className="
                                  hidden
                                  md:flex
                                  w-10
                                  h-10
                                  rounded-full
                                  items-center
                                  justify-center
                                  border
                                  border-slate-200
                                  text-slate-400
                                  group-hover:border-[#168A3A]
                                  group-hover:text-[#168A3A]
                                  transition-all
                                "
                              >
                                <ArrowRight
                                  className="w-4 h-4"
                                />
                              </div>

                            </div>

                          </button>

                        </motion.div>
                      );
                    }
                  )}

                </div>
              )}

            </div>
          )}

        </div>


        {/* =================================================
            NOTICE MODAL
            ================================================= */}

        {selectedNotice &&
          (() => {

            const pdfUrl =
              selectedNotice.pdf_url ||
              selectedNotice.pdfUrl;

            const hasPdf =
              Boolean(pdfUrl);

            return (
              <div
                className="
                  fixed
                  inset-0
                  z-[200]
                  flex
                  items-center
                  justify-center
                  px-4
                  py-5
                  bg-black/60
                  backdrop-blur-sm
                "
                onClick={() =>
                  setSelectedNotice(
                    null
                  )
                }
              >

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  className={`
                    relative
                    w-full
                    overflow-hidden
                    bg-white
                    shadow-2xl
                    ${
                      hasPdf
                        ? "max-w-[1180px] h-[92vh]"
                        : "max-w-3xl"
                    }
                  `}
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >

                  {/* BRAND COLOR BAR */}

                  <div
                    className="
                      h-1
                      w-full
                    "
                    style={{
                      background:
                        `linear-gradient(90deg, ${palette.green} 0%, ${palette.yellow} 65%, ${palette.red} 100%)`,
                    }}
                  />


                  {hasPdf ? (

                    <div
                      className="
                        h-[calc(92vh-4px)]
                        flex
                        flex-col
                      "
                    >

                      {/* MODAL HEADER */}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          px-5
                          py-4
                          border-b
                          border-slate-200
                        "
                      >

                        <h2
                          className="
                            truncate
                            text-xl
                            md:text-2xl
                            font-bold
                            text-slate-900
                          "
                        >
                          {
                            selectedNotice.title ||
                            "School Notice"
                          }
                        </h2>


                        <button
                          type="button"
                          onClick={() =>
                            setSelectedNotice(
                              null
                            )
                          }
                          className="
                            w-10
                            h-10
                            flex
                            items-center
                            justify-center
                            border
                            border-slate-200
                            hover:bg-slate-50
                          "
                        >
                          <X
                            className="w-5 h-5"
                          />
                        </button>

                      </div>


                      {/* PDF */}

                      <div
                        className="
                          flex-1
                          min-h-0
                          p-4
                        "
                      >
                        <PdfNoticePreview
                          fileUrl={
                            pdfUrl
                          }
                          title={
                            selectedNotice.title ||
                            "Notice PDF"
                          }
                        />
                      </div>

                    </div>

                  ) : (

                    <div
                      className="
                        relative
                        p-7
                        md:p-10
                      "
                    >

                      {/* CLOSE */}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedNotice(
                            null
                          )
                        }
                        className="
                          absolute
                          right-5
                          top-5
                          w-10
                          h-10
                          flex
                          items-center
                          justify-center
                          border
                          border-slate-200
                          hover:bg-slate-50
                        "
                      >
                        <X
                          className="w-5 h-5"
                        />
                      </button>


                      <h2
                        className="
                          pr-12
                          text-2xl
                          md:text-4xl
                          font-bold
                          text-slate-900
                        "
                      >
                        {
                          selectedNotice.title ||
                          "School Notice"
                        }
                      </h2>


                      <div
                        className="
                          mt-7
                          border-l-4
                          pl-5
                        "
                        style={{
                          borderColor:
                            palette.green,
                        }}
                      >
                        <p
                          className="
                            text-base
                            md:text-lg
                            leading-8
                            text-slate-600
                            whitespace-pre-line
                          "
                        >
                          {
                            selectedNotice.description ||
                            selectedNotice.content ||
                            "No description added for this notice."
                          }
                        </p>
                      </div>

                    </div>

                  )}

                </motion.div>

              </div>
            );
          })()}

      </section>
    </>
  );
}


/* =========================================================
   EXPORT
   ========================================================= */

export {
  Stats,
};

export default Stats;