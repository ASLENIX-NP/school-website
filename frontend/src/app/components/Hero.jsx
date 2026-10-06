import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Pencil,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";

/* =========================================================
   BALJAGRITI SCHOOL
   Simple RAI-inspired homepage structure

   Structure:
   1. Hero slideshow
   2. About section
   ========================================================= */

const API_URL =
  "https://school-website-backend-ixx2.onrender.com";

const IMAGE_SLIDE_MS = 2000;

const COLORS = {
  green: "#168A3A",
  greenDark: "#0F6B2D",
  gold: "#D9A514",
  navy: "#101B2D",
  navyDark: "#08111F",
  text: "#222222",
  muted: "#666666",
  light: "#F7F7F7",
  white: "#FFFFFF",
};

/* =========================================================
   FONT
   ========================================================= */

const DISPLAY_FONT =
  "'Playfair Display', Georgia, 'Times New Roman', serif";

/* =========================================================
   HARDCODED OLD IMAGE
   Do not use this old Unsplash image.
   ========================================================= */

const HARDCODED_HERO_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1509062522246-3755977927d7",
];

/* =========================================================
   DEFAULT HERO DATA
   ========================================================= */

export const defaultHeroData = {
  badge: "",

  titleLine1: "Baljagriti School",

  titleLine2: "",

  titleLine3: "",

  description: "",

  image: "",

  images: [],

  media: [],

  imageAdjustments: {},

  primaryButtonText: "",

  primaryButtonLink: "/admissions",

  secondaryButtonText: "",

  secondaryButtonLink: "/about",

  stat1Value: "",

  stat1Label: "",

  stat2Value: "",

  stat2Label: "",

  stat3Value: "",

  stat3Label: "",

  motto:
    "Our motto is to provide quality education.",

  quickLinks: [],
};

/* =========================================================
   DEFAULT ABOUT DATA

   This is based on the existing About/story structure
   already used by the project.
   ========================================================= */

export const defaultAboutData = {
  badge: "About Baljagriti",

  title:
    "Building Tomorrow's Leaders Today",

  paragraphs: [
    "Established with a vision to provide quality education in Makawanpur, Baljagriti Secondary English Boarding School has grown as one of Hetauda's respected academic institutions.",

    "With students from Play Group to Grade 10, the school focuses on academic discipline, values, creativity, digital learning, and holistic student development.",
  ],

  buttonText:
    "Learn More",

  buttonLink:
    "/about",

  image: "",

  imageZoom: 1,

  imageOffsetX: 0,

  imageOffsetY: 0,

  imageTopTitle:
    "Baljagriti School",

  imageTopSubtitle:
    "Hetauda-2, Makwanpur",

  imageBottomTitle:
    "Quality Education Since 2046 BS",

  imageBottomDescription:
    "Building knowledge, character, confidence, and a brighter future.",
};

/* =========================================================
   HELPERS
   ========================================================= */

function isHardcodedHeroImageUrl(value = "") {
  const clean = String(value || "").trim();

  return HARDCODED_HERO_IMAGE_URLS.some(
    (url) => clean.startsWith(url)
  );
}

function isVideoUrl(url = "") {
  const clean = String(url || "")
    .toLowerCase()
    .split("?")[0];

  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".ogg") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v")
  );
}

function getMediaType(item) {
  if (!item) {
    return "image";
  }

  if (typeof item === "object") {
    if (item.type === "video") {
      return "video";
    }

    if (item.type === "image") {
      return "image";
    }

    return isVideoUrl(
      item.url || item.src
    )
      ? "video"
      : "image";
  }

  return isVideoUrl(item)
    ? "video"
    : "image";
}

function getMediaUrl(item) {
  if (!item) {
    return "";
  }

  if (typeof item === "string") {
    return item.trim();
  }

  return String(
    item.url ||
      item.src ||
      item.image ||
      item.video ||
      ""
  ).trim();
}

function normalizeMediaList(list) {
  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .map((item) => {
      const url = getMediaUrl(item);

      if (!url) {
        return null;
      }

      if (isHardcodedHeroImageUrl(url)) {
        return null;
      }

      return {
        type: getMediaType(item),
        url,
      };
    })
    .filter(Boolean);
}

/* =========================================================
   HERO DATA NORMALIZATION
   ========================================================= */

export function mergeHeroData(saved = {}) {
  const source = saved || {};

  let media = normalizeMediaList(
    source.media
  );

  /*
   * Support alternative backend names.
   */

  if (media.length === 0) {
    media = normalizeMediaList(
      source.slides
    );
  }

  if (media.length === 0) {
    media = normalizeMediaList(
      source.heroMedia
    );
  }

  if (media.length === 0) {
    media = normalizeMediaList(
      source.heroImages
    );
  }

  if (media.length === 0) {
    media = normalizeMediaList(
      source.images
    );
  }

  if (
    media.length === 0 &&
    source.image
  ) {
    media = normalizeMediaList([
      source.image,
    ]);
  }

  if (
    media.length === 0 &&
    source.heroImage
  ) {
    media = normalizeMediaList([
      source.heroImage,
    ]);
  }

  if (
    media.length === 0 &&
    source.backgroundImage
  ) {
    media = normalizeMediaList([
      source.backgroundImage,
    ]);
  }

  return {
    ...defaultHeroData,
    ...source,

    titleLine1:
      String(
        source.titleLine1 ||
          "Baljagriti School"
      ).trim(),

    motto:
      String(
        source.motto ||
          "Our motto is to provide quality education."
      ).trim(),

    media,

    images: media.map(
      (item) => item.url
    ),

    image:
      media[0]?.url || "",

    imageAdjustments:
      source.imageAdjustments &&
      typeof source.imageAdjustments ===
        "object"
        ? source.imageAdjustments
        : {},
  };
}

/* =========================================================
   ABOUT DATA NORMALIZATION
   ========================================================= */

export function mergeAboutData(
  saved = {}
) {
  const source = saved || {};

  return {
    ...defaultAboutData,
    ...source,

    paragraphs:
      Array.isArray(
        source.paragraphs
      ) &&
      source.paragraphs.length > 0
        ? [
            source.paragraphs[0] ||
              defaultAboutData
                .paragraphs[0],

            source.paragraphs[1] ||
              defaultAboutData
                .paragraphs[1],
          ]
        : defaultAboutData.paragraphs,

    buttonText:
      source.buttonText ||
      defaultAboutData.buttonText,

    buttonLink:
      source.buttonLink ||
      defaultAboutData.buttonLink,
  };
}

/* =========================================================
   IMAGE CROP HELPERS
   ========================================================= */

function clampOffset(value) {
  const numberValue =
    Number(value);

  if (
    !Number.isFinite(
      numberValue
    )
  ) {
    return 0;
  }

  return Math.min(
    60,
    Math.max(-60, numberValue)
  );
}

function clampZoom(value) {
  const numberValue =
    Number(value);

  if (
    !Number.isFinite(
      numberValue
    )
  ) {
    return 1;
  }

  return Math.min(
    3,
    Math.max(1, numberValue)
  );
}

function getHeroImageStyle(
  heroData,
  mediaUrl
) {
  const adjustment =
    heroData.imageAdjustments?.[
      mediaUrl
    ] || {};

  const zoom = clampZoom(
    adjustment.imageZoom
  );

  const x = clampOffset(
    adjustment.imageOffsetX
  );

  const y = clampOffset(
    adjustment.imageOffsetY
  );

  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition:
      `${50 - x}% ${50 - y}%`,
    transform:
      `scale(${zoom})`,
    transformOrigin:
      "center center",
  };
}

function getAboutImageStyle(
  aboutData
) {
  const zoom = clampZoom(
    aboutData.imageZoom
  );

  const x = clampOffset(
    aboutData.imageOffsetX
  );

  const y = clampOffset(
    aboutData.imageOffsetY
  );

  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition:
      `${50 - x}% ${50 - y}%`,
    transform:
      `scale(${zoom})`,
    transformOrigin:
      "center center",
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
        top-5
        right-5
        z-[100]
        w-10
        h-10
        rounded-full
        flex
        items-center
        justify-center
        shadow-lg
        transition-all
        duration-200
        hover:scale-110
      "
      style={{
        background:
          COLORS.gold,
        color:
          COLORS.navyDark,
        border:
          "2px solid white",
      }}
      title={label}
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

/* =========================================================
   HERO MEDIA
   ========================================================= */

function HeroMedia({
  heroData,
  editMode,
  onEditTarget,
}) {
  const mediaItems =
    useMemo(() => {
      return Array.isArray(
        heroData.media
      )
        ? heroData.media.filter(
            (item) => item?.url
          )
        : [];
    }, [heroData.media]);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const videoRef =
    useRef(null);

  const activeMedia =
    mediaItems[
      activeIndex
    ] || null;

  /*
   * Reset slide when media
   * changes from admin.
   */

  useEffect(() => {
    setActiveIndex(0);
  }, [
    mediaItems
      .map(
        (item) => item.url
      )
      .join("|"),
  ]);

  /*
   * Every photo AND video
   * changes after 2 seconds.
   */

  useEffect(() => {
    if (
      editMode ||
      mediaItems.length <= 1
    ) {
      return undefined;
    }

    const timer =
      window.setTimeout(() => {
        setActiveIndex(
          (current) =>
            (current + 1) %
            mediaItems.length
        );
      }, IMAGE_SLIDE_MS);

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    activeIndex,
    editMode,
    mediaItems.length,
  ]);

  /*
   * Autoplay video.
   */

  useEffect(() => {
    if (
      !videoRef.current ||
      !activeMedia ||
      activeMedia.type !==
        "video"
    ) {
      return;
    }

    const video =
      videoRef.current;

    video.currentTime = 0;
    video.muted = true;

    const promise =
      video.play();

    if (
      promise &&
      typeof promise.catch ===
        "function"
    ) {
      promise.catch(() => {});
    }
  }, [
    activeMedia?.url,
  ]);

  const goNext = () => {
    if (
      mediaItems.length <= 1
    ) {
      return;
    }

    setActiveIndex(
      (current) =>
        (current + 1) %
        mediaItems.length
    );
  };

  const goPrevious = () => {
    if (
      mediaItems.length <= 1
    ) {
      return;
    }

    setActiveIndex(
      (current) =>
        (current -
          1 +
          mediaItems.length) %
        mediaItems.length
    );
  };

  return (
    <div className="absolute inset-0">
      {/* =================================================
          MEDIA
          ================================================= */}

      <div className="absolute inset-0 overflow-hidden bg-slate-100">
        {activeMedia ? (
          <AnimatePresence
            mode="wait"
          >
            <motion.div
              key={
                activeMedia.url
              }
              className="absolute inset-0"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.45,
                ease: "easeInOut",
              }}
            >
              {activeMedia.type ===
              "video" ? (
                <video
                  ref={videoRef}
                  src={
                    activeMedia.url
                  }
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                  "
                  style={getHeroImageStyle(
                    heroData,
                    activeMedia.url
                  )}
                  muted
                  autoPlay
                  playsInline
                  preload="auto"
                />
              ) : (
                <img
                  src={
                    activeMedia.url
                  }
                  alt="Baljagriti School"
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                  "
                  style={getHeroImageStyle(
                    heroData,
                    activeMedia.url
                  )}
                  draggable={false}
                />
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
            "
            style={{
              background:
                "#F1F5F9",
            }}
          >
            <ImageIcon
              className="w-14 h-14 text-slate-300"
            />
          </div>
        )}
      </div>

      {/* =================================================
          VERY LIGHT OVERLAY
          Keeps image bright.
          ================================================= */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
        "
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.04) 45%, rgba(0,0,0,0.28) 100%)",
        }}
      />

      {/* =================================================
          CENTER TEXT
          ================================================= */}

      <div
        className="
          absolute
          inset-0
          z-20
          flex
          items-center
          justify-center
          text-center
          px-6
          pointer-events-none
        "
      >
        <div className="max-w-4xl">
          <motion.h1
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="
              text-white
              font-bold
              tracking-tight
            "
            style={{
              fontFamily:
                DISPLAY_FONT,
              fontSize:
                "clamp(3rem, 7vw, 6.5rem)",
              lineHeight: 1.05,
              textShadow:
                "0 3px 24px rgba(0,0,0,0.45)",
            }}
          >
            Baljagriti School
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.18,
            }}
            className="
              mt-5
              text-white
              text-base
              sm:text-lg
              md:text-xl
              font-medium
            "
            style={{
              textShadow:
                "0 2px 14px rgba(0,0,0,0.45)",
            }}
          >
            Our motto is to provide
            quality education.
          </motion.p>
        </div>
      </div>

      {/* =================================================
          ADMIN EDIT BUTTON
          ================================================= */}

      <EditIconButton
        editMode={editMode}
        target={{
          type: "heroImage",
        }}
        onEditTarget={
          onEditTarget
        }
        icon={Camera}
        label="Change hero images or videos"
      />

      {/* =================================================
          PREVIOUS
          ================================================= */}

      {mediaItems.length >
        1 && (
        <button
          type="button"
          onClick={goPrevious}
          className="
            absolute
            left-5
            top-1/2
            -translate-y-1/2
            z-40
            w-11
            h-11
            rounded-full
            flex
            items-center
            justify-center
            transition-all
            hover:scale-110
          "
          style={{
            background:
              "rgba(255,255,255,0.85)",
            color:
              COLORS.navyDark,
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.12)",
          }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* =================================================
          NEXT
          ================================================= */}

      {mediaItems.length >
        1 && (
        <button
          type="button"
          onClick={goNext}
          className="
            absolute
            right-5
            top-1/2
            -translate-y-1/2
            z-40
            w-11
            h-11
            rounded-full
            flex
            items-center
            justify-center
            transition-all
            hover:scale-110
          "
          style={{
            background:
              "rgba(255,255,255,0.85)",
            color:
              COLORS.navyDark,
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.12)",
          }}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* =================================================
          SLIDE INDICATORS
          ================================================= */}

      {mediaItems.length >
        1 && (
        <div
          className="
            absolute
            bottom-7
            left-1/2
            -translate-x-1/2
            z-40
            flex
            gap-2
          "
        >
          {mediaItems.map(
            (item, index) => (
              <button
                key={`${item.url}-${index}`}
                type="button"
                onClick={() =>
                  setActiveIndex(
                    index
                  )
                }
                className="
                  h-1
                  rounded-full
                  transition-all
                  duration-300
                "
                style={{
                  width:
                    index ===
                    activeIndex
                      ? "36px"
                      : "12px",

                  background:
                    index ===
                    activeIndex
                      ? COLORS.green
                      : "rgba(255,255,255,0.75)",
                }}
                aria-label={`Show slide ${
                  index + 1
                }`}
              />
            )
          )}
        </div>
      )}

      {/* =================================================
          GREEN BOTTOM LINE
          ================================================= */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-1
          z-50
        "
        style={{
          background:
            COLORS.green,
        }}
      />
    </div>
  );
}

/* =========================================================
   ABOUT SECTION
   ========================================================= */

function AboutSection({
  aboutData,
  editMode,
  onEditTarget,
}) {
  const imageUrl =
    String(
      aboutData.image || ""
    ).trim();

  return (
    <section
      id="about"
      className="
        relative
        bg-white
        py-16
        sm:py-20
        lg:py-24
      "
    >
      <div
        className="
          max-w-[1200px]
          mx-auto
          px-6
          sm:px-8
          lg:px-10
        "
      >
        <div
          className="
            grid
            lg:grid-cols-[0.9fr_1.1fr]
            gap-10
            lg:gap-16
            items-center
          "
        >
          {/* =================================================
              SCHOOL PHOTO
              ================================================= */}

          <div className="relative">
            <EditIconButton
              editMode={
                editMode
              }
              target={{
                type: "storyImage",
              }}
              onEditTarget={
                onEditTarget
              }
              icon={Camera}
              label="Change school photo"
            />

            <div
              className="
                relative
                overflow-hidden
                bg-slate-100
                aspect-[4/5]
                lg:aspect-[4/5]
              "
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Baljagriti School"
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                  "
                  style={getAboutImageStyle(
                    aboutData
                  )}
                  draggable={false}
                />
              ) : (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-slate-100
                  "
                >
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />

                    <p className="text-sm text-slate-400">
                      Add school photo
                    </p>
                  </div>
                </div>
              )}

              {/* Small clean image label */}

              <div
                className="
                  absolute
                  left-5
                  bottom-5
                  bg-white
                  px-5
                  py-4
                  shadow-lg
                "
              >
                <div
                  className="
                    text-sm
                    font-semibold
                    text-slate-900
                  "
                >
                  {aboutData.imageTopTitle ||
                    "Baljagriti School"}
                </div>

                <div
                  className="
                    text-xs
                    text-slate-500
                    mt-1
                  "
                >
                  {aboutData.imageTopSubtitle ||
                    "Hetauda-2, Makwanpur"}
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              ABOUT CONTENT
              ================================================= */}

          <div>
            {/* Small heading */}

            <EditIconButton
              editMode={
                editMode
              }
              target={{
                type: "storyText",
              }}
              onEditTarget={
                onEditTarget
              }
              label="Edit about section"
            />

            <div
              className="
                inline-flex
                items-center
                gap-3
                mb-5
              "
            >
              <span
                className="
                  block
                  w-12
                  h-[2px]
                "
                style={{
                  background:
                    COLORS.green,
                }}
              />

              <span
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-slate-500
                "
              >
                {aboutData.badge}
              </span>
            </div>

            {/* Title */}

            <h2
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-bold
                text-slate-900
                leading-tight
                tracking-tight
              "
              style={{
                fontFamily:
                  DISPLAY_FONT,
              }}
            >
              {aboutData.title}
            </h2>

            {/* Green underline */}

            <div
              className="
                w-16
                h-[3px]
                mt-6
                mb-7
              "
              style={{
                background:
                  COLORS.green,
              }}
            />

            {/* Paragraphs */}

            <div
              className="
                space-y-5
                text-[15px]
                sm:text-base
                leading-7
                text-slate-600
              "
            >
              {aboutData.paragraphs.map(
                (paragraph, index) => (
                  <p
                    key={index}
                  >
                    {paragraph}
                  </p>
                )
              )}
            </div>

            {/* Learn more */}

            <div className="mt-8">
              <Link
                to={
                  aboutData.buttonLink ||
                  "/about"
                }
                className="
                  inline-flex
                  items-center
                  gap-3
                  px-6
                  py-3.5
                  border
                  border-slate-800
                  text-slate-800
                  text-sm
                  font-bold
                  uppercase
                  tracking-wide
                  transition-all
                  duration-200
                  hover:bg-slate-900
                  hover:text-white
                "
              >
                {aboutData.buttonText ||
                  "Learn More"}

                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HERO COMPONENT
   ========================================================= */

function Hero({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
}) {
  const [
    heroData,
    setHeroData,
  ] = useState(() =>
    mergeHeroData(
      contentOverride ||
        defaultHeroData
    )
  );

  const [
    aboutData,
    setAboutData,
  ] = useState(
    defaultAboutData
  );

  /* =======================================================
     LOAD GOOGLE FONT
     ======================================================= */

  useEffect(() => {
    if (
      document.getElementById(
        "baljagriti-playfair-font"
      )
    ) {
      return;
    }

    const link =
      document.createElement(
        "link"
      );

    link.id =
      "baljagriti-playfair-font";

    link.rel = "stylesheet";

    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap";

    document.head.appendChild(
      link
    );
  }, []);

  /* =======================================================
     LOAD HOME CONTENT
     ======================================================= */

  useEffect(() => {
    if (contentOverride) {
      setHeroData(
        mergeHeroData(
          contentOverride
        )
      );

      return;
    }

    let alive = true;

    const loadHomeContent =
      async () => {
        try {
          const response =
            await axios.get(
              `${API_URL}/api/site-content/home`,
              {
                timeout: 12000,
              }
            );

          if (!alive) {
            return;
          }

          const content =
            response.data
              ?.data?.content;

          /* ------------------------------
             HERO
             ------------------------------ */

          const savedHero =
            content?.hero;

          setHeroData(
            mergeHeroData(
              savedHero ||
                defaultHeroData
            )
          );

          /* ------------------------------
             ABOUT / STORY
             ------------------------------ */

          const savedStats =
            content?.statsSection;

          const savedStory =
            savedStats?.story;

          if (savedStory) {
            setAboutData(
              mergeAboutData(
                savedStory
              )
            );
          } else {
            setAboutData(
              mergeAboutData(
                defaultAboutData
              )
            );
          }
        } catch (error) {
          console.error(
            "Homepage content loading error:",
            error
          );

          if (alive) {
            setHeroData(
              mergeHeroData(
                defaultHeroData
              )
            );

            setAboutData(
              mergeAboutData(
                defaultAboutData
              )
            );
          }
        }
      };

    loadHomeContent();

    return () => {
      alive = false;
    };
  }, [
    contentOverride,
  ]);

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="w-full bg-white">
      {/* ===================================================
          HERO
          =================================================== */}

      <section
        id="home"
        className="
          relative
          w-full
          h-[calc(100svh-80px)]
          min-h-[580px]
          max-h-[900px]
          overflow-hidden
          bg-slate-100
        "
      >
        <HeroMedia
          heroData={heroData}
          editMode={editMode}
          onEditTarget={
            onEditTarget
          }
        />
      </section>

      {/* ===================================================
          ABOUT
          =================================================== */}

      <AboutSection
        aboutData={aboutData}
        editMode={editMode}
        onEditTarget={
          onEditTarget
        }
      />
    </main>
  );
}

/* =========================================================
   EXPORT
   ========================================================= */

export { Hero };

export default Hero;