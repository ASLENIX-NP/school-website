import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  Sparkles,
  X,
  Layers,
  CalendarDays,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cream: "#FFF8EE",
};

const fallbackCategoryDescriptions = {
  Classroom:
    "Students participate in active classroom learning, discussion, collaboration, and academic activities.",
  Events:
    "School events highlight student participation, celebration, leadership, and community involvement.",
  Sports:
    "Sports activities encourage teamwork, discipline, confidence, fitness, and healthy competition.",
  ECA:
    "Extra-curricular activities help students explore creativity, leadership, teamwork, and personal growth.",
  Facilities:
    "School facilities support practical learning, technology use, science activities, and overall student development.",
};

const defaultGalleryContent = {
  badge: "Gallery",
  title: "School in Action",
  highlightedText: "in Action",
  description:
    "Explore moments from classrooms, activities, events, facilities, and student life at Baljagriti Secondary English School.",

  categories: ["All", "Classroom", "Events", "Sports", "ECA", "Facilities"],

  categoryDescriptions: fallbackCategoryDescriptions,

  images: [
    {
      id: 1,
      title: "Classroom Learning",
      category: "Classroom",
      date: "Academic Session",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200",
      images: [
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200",
        "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200",
      ],
      visible: true,
    },
    {
      id: 2,
      title: "School Event",
      category: "Events",
      date: "Annual Program",
      image:
        "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=900&h=700&fit=crop&auto=format",
      images: [
        "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=900&h=700&fit=crop&auto=format",
      ],
      visible: true,
    },
  ],

  bottomTitle: "School Memories",
  bottomDescription:
    "Gallery images are updated by the school administration to highlight student life and School activities.",
  bottomNote: "Click image to preview",
};

function normalizeCategories(categories = []) {
  const cleaned = categories
    .map((item) => String(item || "").trim())
    .filter(Boolean);

  const withoutAll = cleaned.filter((item) => item.toLowerCase() !== "all");

  return ["All", ...(withoutAll.length ? withoutAll : ["Classroom"])];
}

function mergeGalleryContent(saved = {}) {
  return {
    ...defaultGalleryContent,
    ...saved,
    categories: Array.isArray(saved.categories)
      ? normalizeCategories(saved.categories)
      : defaultGalleryContent.categories,
    categoryDescriptions:
      saved.categoryDescriptions && typeof saved.categoryDescriptions === "object"
        ? {
            ...fallbackCategoryDescriptions,
            ...saved.categoryDescriptions,
          }
        : fallbackCategoryDescriptions,
    images: Array.isArray(saved.images)
      ? saved.images
      : defaultGalleryContent.images,
  };
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) {
    return <>{title}</>;
  }

  const [before, after] = title.split(highlightedText);

  return (
    <>
      {before}
      <span className="italic" style={{ color: colors.red }}>
        {highlightedText}
      </span>
      {after}
    </>
  );
}

function buildCategoryAlbums(content) {
  const categories = normalizeCategories(content.categories).filter(
    (category) => category !== "All"
  );

  const visibleImages = (content.images || []).filter(
    (item) => item.visible !== false
  );

  return categories
    .map((category) => {
      const categoryItems = visibleImages.filter(
        (item) => item.category === category
      );

      const seen = new Set();
      const photos = [];

      categoryItems.forEach((item) => {
        const urls =
          Array.isArray(item.images) && item.images.length > 0
            ? item.images
            : item.image
            ? [item.image]
            : [];

        urls.forEach((url) => {
          if (!url || seen.has(url)) return;

          seen.add(url);
          photos.push({
            url,
            title: item.title || category,
            date: item.date || "School Activity",
            category,
          });
        });
      });

      const cover =
        categoryItems.find((item) => item.image)?.image ||
        photos[0]?.url ||
        "";

      return {
        category,
        title: category,
        date: categoryItems[0]?.date || "School Activity",
        description:
          content.categoryDescriptions?.[category] ||
          fallbackCategoryDescriptions[category] ||
          "Explore school moments, activities, learning experiences, and student participation from this category.",
        cover,
        photos,
        total: photos.length,
      };
    })
    .filter((album) => album.total > 0);
}

function GalleryCategoryCard({ album, index, onClick }) {
  const isLarge = index === 0 || index === 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`grid lg:grid-cols-2 gap-12 items-center ${
        index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="overflow-hidden rounded-[32px] shadow-2xl bg-white">
        {album.cover ? (
          <img
            src={album.cover}
            alt={album.title}
            className="w-full h-[450px] object-cover hover:scale-105 transition duration-700"
          />
        ) : (
          <div className="w-full h-[450px] bg-slate-100 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-slate-300" />
          </div>
        )}
      </div>

      <div>
        <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
          {album.category}
        </span>

        <h2 className="text-5xl font-black text-slate-900 mt-5">
          {album.title}
        </h2>

        <p className="text-slate-500 mt-3">{album.date}</p>

        <p className="text-lg text-slate-600 mt-6 leading-relaxed">
          {album.description}
        </p>

        <button
          type="button"
          onClick={() => onClick(album)}
          className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-green-600 text-white font-bold relative z-50"
        >
          View Album ({album.total})
        </button>
      </div>
    </motion.div>
  );
}

function Gallery() {
  const [content, setContent] = useState(defaultGalleryContent);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    const loadGalleryContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/gallery"
        );

        const savedContent = res.data?.data?.content || {};
        setContent(mergeGalleryContent(savedContent));
      } catch (error) {
        console.error("Gallery content load error:", error);
        setContent(defaultGalleryContent);
      }
    };

    loadGalleryContent();
  }, []);

  const categories = normalizeCategories(content.categories);

  const categoryAlbums = useMemo(() => buildCategoryAlbums(content), [content]);

  const filteredAlbums =
    activeCategory === "All"
      ? categoryAlbums
      : categoryAlbums.filter((album) => album.category === activeCategory);

  const currentPhoto = selectedAlbum?.photos?.[currentImageIndex];

  const openAlbum = (album) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(0);
    setZoomOpen(false);
    setZoomScale(1);
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setCurrentImageIndex(0);
    setZoomOpen(false);
    setZoomScale(1);
  };

  const previousImage = (e) => {
    e?.stopPropagation();
    if (!selectedAlbum?.photos?.length) return;

    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1
    );
    setZoomScale(1);
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (!selectedAlbum?.photos?.length) return;

    setCurrentImageIndex((prev) => (prev + 1) % selectedAlbum.photos.length);
    setZoomScale(1);
  };

  return (
    <section
      id="gallery"
      className="min-h-screen pt-32 pb-24 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.14), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.11), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(75,46,131,0.09)",
              color: colors.purple,
              border: "1px solid rgba(75,46,131,0.16)",
            }}
          >
            <Camera className="w-4 h-4" />
            {content.badge}
          </span>

          <h1
            className="text-4xl md:text-6xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            <HighlightedTitle
              title={content.title}
              highlightedText={content.highlightedText}
            />
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-500 leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: active ? "#FFFFFF" : colors.dark,
                  background: active
                    ? `linear-gradient(135deg, ${colors.red}, ${colors.green})`
                    : "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.68))",
                  border: active
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid rgba(11,16,32,0.08)",
                  boxShadow: active
                    ? "0 16px 38px rgba(22,138,58,0.22)"
                    : "0 10px 28px rgba(11,16,32,0.06)",
                  backdropFilter: "blur(14px)",
                }}
              >
                {category}
              </button>
            );
          })}
        </motion.div>

        <div
          className="rounded-[2rem] p-4 md:p-5"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.38), rgba(255,255,255,0.16))",
            border: "1px solid rgba(255,255,255,0.45)",
            boxShadow:
              "0 24px 80px rgba(11,16,32,0.1), inset 0 1px 0 rgba(255,255,255,0.72)",
            backdropFilter: "blur(18px)",
          }}
        >
          {filteredAlbums.length > 0 ? (
            <div className="space-y-24">
              {filteredAlbums.map((album, index) => (
                <GalleryCategoryCard
                  key={album.category}
                  album={album}
                  index={index}
                  onClick={openAlbum}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center">
              <ImageIcon className="w-14 h-14 mx-auto text-slate-300 mb-4" />
              <div className="font-bold text-slate-800">
                No gallery images found.
              </div>
              <div className="text-sm text-slate-500 mt-1">
                Please check another category.
              </div>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-10 rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(11,16,32,0.96), rgba(75,46,131,0.9))",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 22px 58px rgba(11,16,32,0.28)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <Layers className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="text-white font-bold">{content.bottomTitle}</div>
              <div
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.68)" }}
              >
                {content.bottomDescription}
              </div>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            <Sparkles className="w-4 h-4" style={{ color: "#FACC15" }} />
            {content.bottomNote}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAlbum}
            className="fixed inset-0 z-[100] flex items-center justify-center p-5"
            style={{
              background: "rgba(2,6,23,0.82)",
              backdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full rounded-[2rem] overflow-hidden"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 35px 100px rgba(0,0,0,0.42)",
              }}
            >
              <button
                type="button"
                onClick={closeAlbum}
                className="absolute top-5 right-5 z-[99999] w-12 h-12 rounded-full bg-white shadow-2xl cursor-pointer font-bold hover:bg-red-500 hover:text-white hover:rotate-180 hover:scale-110 transition-all duration-500 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0">
                <div className="relative bg-slate-950 min-h-[520px] flex items-center justify-center p-5">
                  {currentPhoto?.url ? (
                    <button
                      type="button"
                      onClick={() => {
                        setZoomOpen(true);
                        setZoomScale(1);
                      }}
                      className="w-full h-full"
                    >
                      <img
                        src={currentPhoto.url}
                        alt={currentPhoto.title || selectedAlbum.title}
                        className="max-h-[560px] w-full object-contain rounded-2xl"
                      />
                    </button>
                  ) : (
                    <ImageIcon className="w-16 h-16 text-slate-500" />
                  )}

                  {selectedAlbum.photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={previousImage}
                        className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
                      >
                        <ChevronLeft size={26} />
                      </button>

                      <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
                      >
                        <ChevronRight size={26} />
                      </button>
                    </>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: "rgba(22,138,58,0.09)",
                        color: colors.green,
                        border: "1px solid rgba(22,138,58,0.16)",
                      }}
                    >
                      {selectedAlbum.category}
                    </span>

                    <span className="text-sm text-slate-500">
                      {currentPhoto?.date || selectedAlbum.date}
                    </span>
                  </div>

                  <h2
                    className="text-3xl"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 850,
                      color: colors.dark,
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {selectedAlbum.title}
                  </h2>

                  <p className="text-slate-600 mt-4 leading-relaxed">
                    {selectedAlbum.description}
                  </p>

                  <div className="mt-5 text-sm font-bold text-slate-500">
                    {currentImageIndex + 1} of {selectedAlbum.photos.length}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-5 max-h-[300px] overflow-y-auto pr-1">
                    {selectedAlbum.photos.map((photo, index) => (
                      <button
                        key={`${photo.url}-${index}`}
                        type="button"
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setZoomScale(1);
                        }}
                        className="rounded-2xl overflow-hidden border-2 bg-slate-100"
                        style={{
                          borderColor:
                            currentImageIndex === index
                              ? colors.green
                              : "rgba(15,23,42,0.08)",
                        }}
                      >
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-24 object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setZoomOpen(true);
                      setZoomScale(1);
                    }}
                    className="mt-6 w-full px-5 py-3 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                    }}
                  >
                    <ZoomIn className="w-4 h-4" />
                    Open Full Image
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomOpen && currentPhoto?.url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setZoomOpen(false);
              setZoomScale(1);
            }}
            className="fixed inset-0 z-[999999] bg-black/92 flex items-center justify-center p-6 overflow-hidden"
          >
            {selectedAlbum?.photos?.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center"
                >
                  <ChevronLeft size={32} />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomScale((prev) => Math.max(1, prev - 0.25));
                }}
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl"
              >
                <ZoomOut size={22} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomScale((prev) => Math.min(3, prev + 0.25));
                }}
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl"
              >
                <ZoomIn size={22} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomOpen(false);
                  setZoomScale(1);
                }}
                className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-red-500 hover:text-white hover:rotate-180 transition-all duration-500"
              >
                <X size={24} />
              </button>
            </div>

            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: zoomScale }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              src={currentPhoto.url}
              alt=""
              className="max-w-[92vw] max-h-[86vh] rounded-3xl shadow-2xl object-contain cursor-zoom-in"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export { Gallery };
export default Gallery;