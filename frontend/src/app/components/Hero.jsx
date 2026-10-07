import {

  useEffect,
 
  useMemo,
 
  useState,
 
 } from "react";
 
 
 
 import axios from "axios";
 
 import { Link } from "react-router-dom";
 
 
 
 import {
 
  motion,
 } from "motion/react";
 
 
 
 import {
 
  Camera,
  Pencil,
 
  ArrowRight,
 
  Image as ImageIcon,
 
 } from "lucide-react";
 
 
 
 
 
 /* =========================================================
 
   CONFIG
 
   \========================================================= */
 
 
 
 const API_URL =
 
  "https://school-website-backend-ixx2.onrender.com";
 
 
 
 const IMAGE_SLIDE_MS = 3000;
 
 
 
 
 
 /* =========================================================
 
   COLORS
 
   \========================================================= */
 
 
 
 const COLORS = {
 
  green: "#168A3A",
 
  greenDark: "#0F6B2D",
 
  gold: "#D9A514",
 
  navy: "#101B2D",
 
  navyDark: "#08111F",
 
  text: "#222222",
 
  muted: "#666666",
 
  white: "#FFFFFF",
 
 };
 
 
 
 
 
 /* =========================================================
 
   FONT
 
   \========================================================= */
 
 
 
 const DISPLAY_FONT =
 
  "'Playfair Display', Georgia, 'Times New Roman', serif";
 
 
 
 
 
 /* =========================================================
 
   DEFAULT HERO
 
   \========================================================= */
 
 
 
 export const defaultHeroData = {
 
  badge: "",
 
 
 
  titleLine1:
 
    "Baljagriti School",
 
 
 
  titleLine2: "",
 
 
 
  titleLine3: "",
 
 
 
  description: "",
 
 
 
  image: "",
 
 
 
  images: [],
 
 
 
  media: [],
 
 
 
  slides: [],
 
 
 
  heroMedia: [],
 
 
 
  heroImages: [],
 
 
 
  imageAdjustments: {},
 
 
 
  primaryButtonText: "",
 
 
 
  primaryButtonLink:
 
    "/admissions",
 
 
 
  secondaryButtonText: "",
 
 
 
  secondaryButtonLink:
 
    "/about",
 
 
 
  motto:
 
    "Our motto is to provide quality education.",
 
 
 
  quickLinks: [],
 
 };
 
 
 
 
 
 /* =========================================================
 
   DEFAULT ABOUT
 
   \========================================================= */
 
 
 
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
 
 };
 
 
 
 
 
 /* =========================================================
 
   URL HELPERS
 
   \========================================================= */
 
 
 
 function makeAbsoluteUrl(value) {
 
  if (!value) {
 
    return "";
 
  }
 
 
 
  const clean = String(value).trim();
 
 
 
  if (!clean) {
 
    return "";
 
  }
 
 
 
  /*
 
   Already a complete URL
 
  */
 
 
 
  if (
 
    clean.startsWith("http\://") ||
 
    clean.startsWith("https://") ||
 
    clean.startsWith("blob:") ||
 
    clean.startsWith("data:")
 
  ) {
 
    return clean;
 
  }
 
 
 
  /*
 
   Backend-relative image path
 
   Example:
 
   /uploads/hero/image.jpg
 
  */
 
 
 
  if (clean.startsWith("/")) {
 
    return `${API_URL}${clean}`;
 
  }
 
 
 
  /*
 
   Relative path without slash
 
  */
 
 
 
  return `${API_URL}/${clean}`;
 
 }
 
 
 
 
 
 /* =========================================================
 
   VIDEO DETECTION
 
   \========================================================= */
 
 
 
 function isVideoUrl(url = "") {
 
  const clean =
 
    String(url)
 
      .toLowerCase()
 
      .split("?")[0]
 
      .split("#")[0];
 
 
 
  return (
 
    clean.endsWith(".mp4") ||
 
    clean.endsWith(".webm") ||
 
    clean.endsWith(".ogg") ||
 
    clean.endsWith(".mov") ||
 
    clean.endsWith(".m4v")
 
  );
 
 }
 
 
 
 
 
 /* =========================================================
 
   GET URL FROM ANY MEDIA FORMAT
 
   \========================================================= */
 
 
 
 function extractMediaUrl(item) {
 
  if (!item) {
 
    return "";
 
  }
 
 
 
  /*
 
   String
 
  */
 
 
 
  if (typeof item === "string") {
 
    return item.trim();
 
  }
 
 
 
  /*
 
   Object
 
  */
 
 
 
  if (
 
    typeof item === "object"
 
  ) {
 
    const possibleValues = [
 
      item.url,
 
      item.src,
 
      item.image,
 
      item.imageUrl,
 
      item.image_url,
 
      item.video,
 
      item.videoUrl,
 
      item.video_url,
 
      item.file,
 
      item.fileUrl,
 
      item.file_url,
 
      item.path,
 
      item.location,
 
    ];
 
 
 
    for (
 
      const value of possibleValues
 
    ) {
 
      if (
 
        typeof value === "string" &&
 
        value.trim()
 
      ) {
 
        return value.trim();
 
      }
 
    }
 
  }
 
 
 
  return "";
 
 }
 
 
 
 
 
 /* =========================================================
 
   GET MEDIA TYPE
 
   \========================================================= */
 
 
 
 function getMediaType(item) {
 
  if (
 
    item &&
 
    typeof item === "object"
 
  ) {
 
    if (
 
      String(item.type || "")
 
        .toLowerCase() ===
 
      "video"
 
    ) {
 
      return "video";
 
    }
 
 
 
    if (
 
      String(item.type || "")
 
        .toLowerCase() ===
 
      "image"
 
    ) {
 
      return "image";
 
    }
 
  }
 
 
 
  const url =
 
    extractMediaUrl(item);
 
 
 
  return isVideoUrl(url)
 
    ? "video"
 
    : "image";
 
 }
 
 
 
 
 
 /* =========================================================
 
   NORMALIZE MEDIA
 
   \========================================================= */
 
 
 
 function normalizeMediaList(
 
  list
 
 ) {
 
  if (!Array.isArray(list)) {
 
    return [];
 
  }
 
 
 
  const result = [];
 
 
 
  list.forEach((item) => {
 
    const rawUrl =
 
      extractMediaUrl(item);
 
 
 
    if (!rawUrl) {
 
      return;
 
    }
 
 
 
    const url =
 
      makeAbsoluteUrl(rawUrl);
 
 
 
    if (!url) {
 
      return;
 
    }
 
 
 
    result.push({
 
      url,
 
      type: getMediaType(item),
 
    });
 
  });
 
 
 
  return result;
 
 }
 
 
 
 
 
 /* =========================================================
 
   FIND MEDIA FROM BACKEND DATA
 
   \========================================================= */
 
 
 
 function findHeroMedia(source) {
 
  if (!source) {
 
    return [];
 
  }
 
 
 
  /*
 
   Direct arrays
 
  */
 
 
 
  const possibleArrays = [
 
    source.media,
 
    source.slides,
 
    source.heroMedia,
 
    source.heroImages,
 
    source.images,
 
 
 
    source.content?.media,
 
    source.content?.slides,
 
    source.content?.heroMedia,
 
    source.content?.heroImages,
 
    source.content?.images,
 
 
 
    source.hero?.media,
 
    source.hero?.slides,
 
    source.hero?.images,
 
  ];
 
 
 
  for (
 
    const candidate of possibleArrays
 
  ) {
 
    const normalized =
 
      normalizeMediaList(
 
        candidate
 
      );
 
 
 
    if (
 
      normalized.length > 0
 
    ) {
 
      return normalized;
 
    }
 
  }
 
 
 
  /*
 
   Single image fields
 
  */
 
 
 
  const possibleSingleImages = [
 
    source.image,
 
    source.heroImage,
 
    source.backgroundImage,
 
 
 
    source.content?.image,
 
    source.content?.heroImage,
 
    source.content?.backgroundImage,
 
 
 
    source.hero?.image,
 
    source.hero?.heroImage,
 
    source.hero?.backgroundImage,
 
  ];
 
 
 
  for (
 
    const candidate of possibleSingleImages
 
  ) {
 
    const normalized =
 
      normalizeMediaList([
 
        candidate,
 
      ]);
 
 
 
    if (
 
      normalized.length > 0
 
    ) {
 
      return normalized;
 
    }
 
  }
 
 
 
  /*
 
   Sometimes backend stores an object
 
   like:
 
 
 
   {
 
      media: {
 
        url: "..."
 
      }
 
   }
 
 
 
   Handle that too.
 
  */
 
 
 
  const possibleObjects = [
 
    source.media,
 
    source.heroMedia,
 
    source.heroImage,
 
    source.image,
 
  ];
 
 
 
  for (
 
    const candidate of possibleObjects
 
  ) {
 
    if (
 
      candidate &&
 
      typeof candidate ===
 
        "object" &&
 
      !Array.isArray(candidate)
 
    ) {
 
      const normalized =
 
        normalizeMediaList([
 
          candidate,
 
        ]);
 
 
 
      if (
 
        normalized.length > 0
 
      ) {
 
        return normalized;
 
      }
 
    }
 
  }
 
 
 
  return [];
 
 }
 
 
 
 
 
 /* =========================================================
 
   MERGE HERO DATA
 
   \========================================================= */
 
 
 
 export function mergeHeroData(
 
  saved = {}
 
 ) {
 
  const source =
 
    saved || {};
 
 
 
  const media =
 
    findHeroMedia(source);
 
 
 
  return {
 
    ...defaultHeroData,
 
 
 
    ...source,
 
 
 
    titleLine1:
 
      String(
 
        source.titleLine1 ||
 
          source.title ||
 
          "Baljagriti School"
 
      ).trim(),
 
 
 
    motto:
 
      String(
 
        source.motto ||
 
          "Our motto is to provide quality education."
 
      ).trim(),
 
 
 
    media,
 
 
 
    images:
 
      media.map(
 
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
 
   MERGE ABOUT
 
   \========================================================= */
 
 
 
 export function mergeAboutData(
 
  saved = {}
 
 ) {
 
  const source =
 
    saved || {};
 
 
 
  return {
 
    ...defaultAboutData,
 
 
 
    ...source,
 
 
 
    paragraphs:
 
      Array.isArray(
 
        source.paragraphs
 
      ) &&
 
      source.paragraphs.length
 
        ? source.paragraphs
 
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
 
   IMAGE POSITION
 
   \========================================================= */
 
 
 
 function clamp(value, min, max) {
 
  const number =
 
    Number(value);
 
 
 
  if (
 
    !Number.isFinite(number)
 
  ) {
 
    return min;
 
  }
 
 
 
  return Math.min(
 
    max,
 
    Math.max(min, number)
 
  );
 
 }
 
 
 
 
 
 function getHeroImageStyle(
 
  heroData,
 
  url
 
 ) {
 
  const adjustment =
 
    heroData
 
      ?.imageAdjustments?.[
 
      url
 
    ] || {};
 
 
 
  const zoom =
 
    clamp(
 
      adjustment.imageZoom ??
 
        1,
 
      1,
 
      3
 
    );
 
 
 
  const x =
 
    clamp(
 
      adjustment.imageOffsetX ??
 
        0,
 
      -60,
 
      60
 
    );
 
 
 
  const y =
 
    clamp(
 
      adjustment.imageOffsetY ??
 
        0,
 
      -60,
 
      60
 
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
 
   \========================================================= */
 
 
 
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
 
 
 
        onEditTarget(
 
          target
 
        );
 
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
 
   \========================================================= */
 
 
 
 function HeroMedia({
   heroData,
   editMode,
   onEditTarget,
 }) {
   const mediaItems = useMemo(
     () =>
       Array.isArray(heroData?.media)
         ? heroData.media.filter(
             (item) => item && item.url
           )
         : [],
     [heroData?.media]
   );
 
   const [activeIndex, setActiveIndex] = useState(0);
   const [loadedMedia, setLoadedMedia] = useState(() => new Set());
   const [failedMedia, setFailedMedia] = useState(() => new Set());
 
   const mediaKey = mediaItems
     .map((item) => `${item.type}:${item.url}`)
     .join("|");
 
   useEffect(() => {
     setActiveIndex(0);
     setLoadedMedia(new Set());
     setFailedMedia(new Set());
   }, [mediaKey]);
 
   useEffect(() => {
     if (activeIndex >= mediaItems.length) {
       setActiveIndex(0);
     }
   }, [activeIndex, mediaItems.length]);
 
   const activeMedia =
     mediaItems[activeIndex] || null;
 
   const markLoaded = (url) => {
     if (!url) return;
 
     setLoadedMedia((previous) => {
       if (previous.has(url)) return previous;
 
       const next = new Set(previous);
       next.add(url);
       return next;
     });
   };
 
   const markFailed = (url) => {
     if (!url) return;
 
     console.error("Hero media failed:", url);
 
     setFailedMedia((previous) => {
       const next = new Set(previous);
       next.add(url);
       return next;
     });
   };
 
   /* =======================================================
      PRELOAD ALL IMAGES
 
      The next image is loaded before the slideshow switches.
      This prevents a grey/blank frame.
      ======================================================= */
 
   useEffect(() => {
     if (!mediaItems.length) {
       return undefined;
     }
 
     const imageObjects = [];
 
     mediaItems.forEach((item) => {
       if (
         item.type !== "image" ||
         !item.url ||
         loadedMedia.has(item.url)
       ) {
         return;
       }
 
       const image = new Image();
       imageObjects.push(image);
 
       image.onload = () => {
         markLoaded(item.url);
       };
 
       image.onerror = () => {
         markFailed(item.url);
       };
 
       image.src = item.url;
     });
 
     return () => {
       imageObjects.forEach((image) => {
         image.onload = null;
         image.onerror = null;
       });
     };
   }, [mediaKey]);
 
   /* =======================================================
      AUTOMATIC SLIDESHOW
 
      Every image remains visible for 3 seconds.
      We never switch to an image until it is loaded.
      ======================================================= */
 
   useEffect(() => {
     if (
       editMode ||
       mediaItems.length <= 1 ||
       !activeMedia
     ) {
       return undefined;
     }
 
     if (
       activeMedia.type === "image" &&
       !loadedMedia.has(activeMedia.url)
     ) {
       return undefined;
     }
 
     if (failedMedia.has(activeMedia.url)) {
       const timer = window.setTimeout(() => {
         setActiveIndex(
           (current) =>
             (current + 1) % mediaItems.length
         );
       }, 100);
 
       return () =>
         window.clearTimeout(timer);
     }
 
     if (activeMedia.type === "video") {
       return undefined;
     }
 
     const timer = window.setTimeout(() => {
       const nextIndex =
         (activeIndex + 1) % mediaItems.length;
 
       const nextMedia =
         mediaItems[nextIndex];
 
       /*
         Never switch to an image that is still loading.
         The current image stays on screen instead.
       */
       if (
         nextMedia?.type === "image" &&
         !loadedMedia.has(nextMedia.url)
       ) {
         return;
       }
 
       setActiveIndex(nextIndex);
     }, IMAGE_SLIDE_MS);
 
     return () =>
       window.clearTimeout(timer);
   }, [
     activeIndex,
     activeMedia,
     editMode,
     failedMedia,
     loadedMedia,
     mediaItems,
   ]);
 
   /* =======================================================
      VIDEO END
      ======================================================= */
 
   const handleVideoEnded = () => {
     if (mediaItems.length <= 1) {
       return;
     }
 
     setActiveIndex(
       (current) =>
         (current + 1) % mediaItems.length
     );
   };
 
   /* =======================================================
      EMPTY STATE
      ======================================================= */
 
   if (!activeMedia) {
     return (
       <div className="absolute inset-0 overflow-hidden bg-[#08111F]">
         {editMode && (
           <div className="absolute inset-0 flex items-center justify-center text-white">
             <div className="text-center">
               <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
               <p className="text-sm opacity-70">
                 No hero image has been added yet
               </p>
             </div>
           </div>
         )}
       </div>
     );
   }
 
   return (
     <div className="absolute inset-0 overflow-hidden bg-[#08111F]">
       {/* =================================================
           ALL MEDIA STAYS MOUNTED
 
           Only opacity changes. This means the old image
           never disappears while the next image loads.
           ================================================= */}
 
       {mediaItems.map((item, index) => {
         const isActive =
           index === activeIndex;
 
         if (failedMedia.has(item.url)) {
           return null;
         }
 
         return (
           <motion.div
             key={`${item.type}:${item.url}`}
             className="absolute inset-0"
             initial={false}
             animate={{
               opacity: isActive ? 1 : 0,
             }}
             transition={{
               duration: 0.8,
               ease: [0.22, 1, 0.36, 1],
             }}
             style={{
               zIndex: isActive ? 2 : 1,
               pointerEvents: isActive
                 ? "auto"
                 : "none",
             }}
           >
             {item.type === "video" ? (
               <video
                 src={item.url}
                 className="absolute inset-0 w-full h-full block"
                 style={getHeroImageStyle(
                   heroData,
                   item.url
                 )}
                 autoPlay={isActive}
                 muted
                 loop={false}
                 playsInline
                 preload="auto"
                 onLoadedData={() =>
                   markLoaded(item.url)
                 }
                 onCanPlay={() =>
                   markLoaded(item.url)
                 }
                 onEnded={
                   isActive
                     ? handleVideoEnded
                     : undefined
                 }
                 onError={() =>
                   markFailed(item.url)
                 }
               />
             ) : (
               <img
                 src={item.url}
                 alt="Baljagriti English Secondary School"
                 className="absolute inset-0 w-full h-full block"
                 style={getHeroImageStyle(
                   heroData,
                   item.url
                 )}
                 draggable={false}
                 onLoad={() =>
                   markLoaded(item.url)
                 }
                 onError={() =>
                   markFailed(item.url)
                 }
               />
             )}
           </motion.div>
         );
       })}
 
       {/* Fixed overlay stays above the images during the cross-fade. */}
       <div
         className="absolute inset-0 z-10 pointer-events-none"
         style={{
           background:
             "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.06) 45%, rgba(0,0,0,0.35) 100%)",
         }}
       />
 
       {/* Admin edit button remains available in edit mode. */}
       <EditIconButton
         editMode={editMode}
         target={{
           type: "heroImage",
         }}
         onEditTarget={onEditTarget}
         icon={Camera}
         label="Change hero images or videos"
       />
 
       {/* No left/right arrows and no slide dots. */}
     </div>
   );
 }
 
 
 /* =========================================================
 
   ABOUT SECTION
 
   \========================================================= */
 
 
 
 function AboutSection({
 
  aboutData,
 
  editMode,
 
  onEditTarget,
 
 }) {
 
  return (
 
    <section
 
      className="
 
        w-full
 
        bg-white
 
        py-20
 
        sm:py-24
 
        lg:py-28
 
      "
 
    >
 
 
 
      <div
 
        className="
 
          max-w-[1200px]
 
          mx-auto
 
          px-5
 
          sm:px-8
 
          lg:px-10
 
        "
 
      >
 
 
 
        <div
 
          className="
 
            grid
 
            lg:grid-cols-2
 
            gap-12
 
            lg:gap-20
 
            items-center
 
          "
 
        >
 
 
 
          {/* =================================================
 
              IMAGE
 
              \================================================= */}
 
 
 
          <div
 
            className="
 
              relative
 
              min-h-[420px]
 
              overflow-hidden
 
              bg-slate-100
 
            "
 
          >
 
 
 
            {aboutData.image ? (
 
 
 
              <img
 
                src={
 
                  makeAbsoluteUrl(
 
                    aboutData.image
 
                  )
 
                }
 
                alt=
 
                  "Baljagriti School"
 
                className="
 
                  absolute
 
                  inset-0
 
                  w-full
 
                  h-full
 
                  object-cover
 
                "
 
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
 
 
 
                <ImageIcon
 
                  className="
 
                    w-14
 
                    h-14
 
                    text-slate-300
 
                  "
 
                />
 
 
 
              </div>
 
 
 
            )}
 
 
 
          </div>
 
 
 
 
 
          {/* =================================================
 
              TEXT
 
              \================================================= */}
 
 
 
          <div>
 
 
 
            <div
 
              className="
 
                flex
 
                items-center
 
                gap-3
 
                mb-5
 
              "
 
            >
 
 
 
              <span
 
                className="
 
                  w-10
 
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
 
                About Baljagriti
 
              </span>
 
 
 
            </div>
 
 
 
 
 
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
 
              {
 
                aboutData.title
 
              }
 
            </h2>
 
 
 
 
 
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
 
                (
 
                  paragraph,
 
                  index
 
                ) => (
 
                  <p
 
                    key={index}
 
                  >
 
                    {paragraph}
 
                  </p>
 
                )
 
              )}
 
 
 
            </div>
 
 
 
 
 
            <div
 
              className="mt-8"
 
            >
 
 
 
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
 
 
 
                {
 
                  aboutData.buttonText ||
 
                  "Learn More"
 
                }
 
 
 
                <ArrowRight
 
                  className="w-4 h-4"
 
                />
 
 
 
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
 
   \========================================================= */
 
 
 
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
 
     LOAD FONT
 
     \======================================================= */
 
 
 
  useEffect(() => {
 
    const existing =
 
      document.getElementById(
 
        "baljagriti-playfair-font"
 
      );
 
 
 
    if (existing) {
 
      return;
 
    }
 
 
 
    const link =
 
      document.createElement(
 
        "link"
 
      );
 
 
 
    link.id =
 
      "baljagriti-playfair-font";
 
 
 
    link.rel =
 
      "stylesheet";
 
 
 
    link.href =
 
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap";
 
 
 
    document.head.appendChild(
 
      link
 
    );
 
  }, []);
 
 
 
 
 
  /* =======================================================
 
     LOAD HOME CONTENT
 
     \======================================================= */
 
 
 
  useEffect(() => {
 
 
 
    if (contentOverride) {
 
 
 
      const merged =
 
        mergeHeroData(
 
          contentOverride
 
        );
 
 
 
      console.log(
 
        "Hero contentOverride:",
 
        contentOverride
 
      );
 
 
 
      console.log(
 
        "Normalized hero media:",
 
        merged.media
 
      );
 
 
 
      setHeroData(
 
        merged
 
      );
 
 
 
      return;
 
    }
 
 
 
 
 
    let alive = true;
 
 
 
 
 
    async function loadHomeContent() {
 
 
 
      try {
 
 
 
        const response =
 
          await axios.get(
 
            `${API_URL}/api/site-content/home`,
 
            {
 
              timeout: 15000,
 
            }
 
          );
 
 
 
 
 
        if (!alive) {
 
          return;
 
        }
 
 
 
 
 
        console.log(
 
          "HOME API RESPONSE:",
 
          response.data
 
        );
 
 
 
 
 
        /*
 
         \* Support several possible
 
         \* backend response structures.
 
         */
 
 
 
        const root =
 
          response.data || {};
 
 
 
 
 
        const data =
 
          root.data || {};
 
 
 
 
 
        const content =
 
          data.content ||
 
          root.content ||
 
          data ||
 
          root;
 
 
 
 
 
        /*
 
         \* HERO
 
         */
 
 
 
        const savedHero =
 
          content.hero ||
 
          content.home?.hero ||
 
          root.hero ||
 
          {};
 
 
 
 
 
        const normalizedHero =
 
          mergeHeroData(
 
            savedHero
 
          );
 
 
 
 
 
        console.log(
 
          "SAVED HERO:",
 
          savedHero
 
        );
 
 
 
 
 
        console.log(
 
          "NORMALIZED HERO MEDIA:",
 
          normalizedHero.media
 
        );
 
 
 
 
 
        setHeroData(
 
          normalizedHero
 
        );
 
 
 
 
 
        /*
 
         \* ABOUT / STORY
 
         */
 
 
 
        const savedStats =
 
          content.statsSection ||
 
          content.stats ||
 
          {};
 
 
 
 
 
        const savedStory =
 
          savedStats.story ||
 
          content.story ||
 
          {};
 
 
 
 
 
        setAboutData(
 
          mergeAboutData(
 
            savedStory
 
          )
 
        );
 
 
 
      } catch (error) {
 
 
 
        console.error(
 
          "Homepage content loading error:",
 
          error
 
        );
 
 
 
 
 
        if (!alive) {
 
          return;
 
        }
 
 
 
 
 
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
 
 
 
 
 
    loadHomeContent();
 
 
 
 
 
    return () => {
 
      alive = false;
 
    };
 
 
 
  }, [
 
    contentOverride,
 
  ]);
 
 
 
 
 
  /* =======================================================
 
     RENDER
 
     \======================================================= */
 
 
 
  return (
 
    <main
 
      className="
 
        w-full
 
        bg-white
 
      "
 
    >
 
 
 
      {/* =================================================
 
          HERO
 
          \================================================= */}
 
 
 
      <section
 
        id="home"
 
        className="
 
          relative
 
          w-full
 
          h-[calc(100svh-80px)]
 
          min-h-[580px]
 
          max-h-[900px]
 
          overflow-hidden
 
        "
 
      >
 
 
 
        <HeroMedia
 
          heroData={
 
            heroData
 
          }
 
          editMode={
 
            editMode
 
          }
 
          onEditTarget={
 
            onEditTarget
 
          }
 
        />
 
 
 
      </section>
 
 
 
 
 
      {/* =================================================
 
          ABOUT
 
          \================================================= */}
 
 
 
      <AboutSection
 
        aboutData={
 
          aboutData
 
        }
 
        editMode={
 
          editMode
 
        }
 
        onEditTarget={
 
          onEditTarget
 
        }
 
      />
 
 
 
    </main>
 
  );
 
 }
 
 
 
 
 
 /* =========================================================
 
   EXPORT
 
   \========================================================= */
 
 
 
 export {
 
  Hero,
 
 };
 
 
 
 export default Hero;