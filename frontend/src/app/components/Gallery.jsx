import { useEffect, useState } from "react";
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
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cream: "#FFF8EE",
};

const defaultGalleryContent = {
  badge: "Gallery",
  title: "Campus in Action",
  highlightedText: "in Action",
  description:
    "Explore moments from classrooms, activities, events, facilities, and student life at Baljagriti Secondary English School.",

  categories: ["All", "Classroom", "Events", "Sports", "ECA", "Facilities"],

  images: [
    {
      id: 1,
      title: "Classroom Learning",
      category: "Classroom",
      date: "Academic Session",
      description:
        "Students actively participate in classroom discussions and collaborative learning.",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200",
      images: [
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200",
        "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200",
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200",
        "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200",
      ],
      visible: true,
    },
    {
      id: 2,
      title: "Interactive Teaching",
      category: "Classroom",
      date: "Daily Learning",
      image:
        "https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&h=700&fit=crop&auto=format",
      images: [
        "https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&h=700&fit=crop&auto=format",
      ],
      visible: true,
    },
    {
      id: 3,
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
    {
      id: 4,
      title: "Sports Activities",
      category: "Sports",
      date: "Sports Week",
      image:
        "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=900&h=700&fit=crop&auto=format",
      images: [
        "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=900&h=700&fit=crop&auto=format",
      ],
      visible: true,
    },
    {
      id: 5,
      title: "Creative Activities",
      category: "ECA",
      date: "Extra Curricular",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&h=700&fit=crop&auto=format",
      images: [
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&h=700&fit=crop&auto=format",
      ],
      visible: true,
    },
    {
      id: 6,
      title: "Computer Lab",
      category: "Facilities",
      date: "Digital Learning",
      image:
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=900&h=700&fit=crop&auto=format",
      images: [
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=900&h=700&fit=crop&auto=format",
      ],
      visible: true,
    },
    {
      id: 7,
      title: "Science Learning",
      category: "Facilities",
      date: "Practical Class",
      image:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&h=700&fit=crop&auto=format",
      images: [
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&h=700&fit=crop&auto=format",
      ],
      visible: true,
    },
    {
      id: 8,
      title: "Student Participation",
      category: "Events",
      date: "School Program",
      image:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&h=700&fit=crop&auto=format",
      images: [
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&h=700&fit=crop&auto=format",
      ],
      visible: true,
    },
  ],

  bottomTitle: "School Memories",
  bottomDescription:
    "Gallery images are updated by the school administration to highlight student life and campus activities.",
  bottomNote: "Click image to preview",
};

function mergeGalleryContent(saved = {}) {
  return {
    ...defaultGalleryContent,
    ...saved,
    categories: Array.isArray(saved.categories)
      ? saved.categories
      : defaultGalleryContent.categories,
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

function GalleryCard({ item, index, onClick }) {
  const isLarge = index === 0 || index === 5;
  // FIX 3: Use item.image || item.images?.[0] consistently
  const displayImage = item.image || item.images?.[0];

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      onClick={() => onClick(item)}
      className={`group relative overflow-hidden rounded-3xl text-left ${
        isLarge ? "lg:col-span-2 lg:row-span-2 h-[420px]" : "h-[300px]"
      }`}
      style={{
        boxShadow:
          "0 24px 70px rgba(11,16,32,0.16), 0 0 0 1px rgba(255,255,255,0.65)",
        border: "1px solid rgba(255,255,255,0.55)",
        transform: "perspective(1000px)",
      }}
    >
      {displayImage ? (
        <img
          src={displayImage}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
          <ImageIcon className="w-16 h-16 text-slate-400" />
        </div>
      )}

      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(to top, rgba(11,16,32,0.78) 0%, rgba(11,16,32,0.24) 48%, rgba(11,16,32,0.06) 100%)",
        }}
      />

      <div
        className="absolute top-5 left-5 rounded-full px-3 py-1.5 text-xs font-bold"
        style={{
          background: "rgba(255,255,255,0.18)",
          color: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.24)",
          backdropFilter: "blur(16px)",
        }}
      >
        {item.category}
      </div>

      <div
        className="absolute bottom-5 left-5 right-5 rounded-2xl p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.07))",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 18px 48px rgba(0,0,0,0.26)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays className="w-4 h-4" style={{ color: "#FACC15" }} />
          <span className="text-xs font-medium text-white/70">{item.date}</span>
        </div>

        <h3
          className="text-xl md:text-2xl text-white"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 850,
            letterSpacing: "-0.03em",
          }}
        >
          {item.title}
        </h3>
      </div>
    </motion.button>
  );
}

function Gallery() {
  const [content, setContent] = useState(defaultGalleryContent);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const nextImage = () => {
    if (!selectedAlbum) return;
  
    const next =
      (currentImageIndex + 1) %
      selectedAlbum.images.length;
  
    setCurrentImageIndex(next);
    setActiveImage(selectedAlbum.images[next]);
  };
  
  const previousImage = () => {
    if (!selectedAlbum) return;
  
    const prev =
      (currentImageIndex - 1 + selectedAlbum.images.length) %
      selectedAlbum.images.length;
  
    setCurrentImageIndex(prev);
    setActiveImage(selectedAlbum.images[prev]);
  };
  // FIX 1: Move activeImage state INSIDE the Gallery component (was incorrectly at module level)
  const [activeImage, setActiveImage] = useState(null);

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

  const categories = Array.from(
    new Set(["All", ...(content.categories || []).filter(Boolean)])
  );

  const visibleImages = (content.images || []).filter(
    (item) => item.visible !== false
  );

  const filteredImages =
    activeCategory === "All"
      ? visibleImages
      : visibleImages.filter((item) => item.category === activeCategory);
      console.log("ALL IMAGES:", content.images);
      console.log("VISIBLE IMAGES:", visibleImages.length);
      console.log("FILTERED IMAGES:", filteredImages.length);
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
          {filteredImages.length > 0 ? (
            <div className="space-y-24">
              {filteredImages.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  {/* IMAGE */}
                  <div className="overflow-hidden rounded-[32px] shadow-2xl">
                    <img
                      // FIX 4: Use item.image || item.images?.[0] so items with only images[] still display
                      src={item.image || item.images?.[0]}
                      alt={item.title}
                      className="w-full h-[450px] object-cover hover:scale-105 transition duration-700"
                    />
                  </div>

                  {/* CONTENT */}
                  <div>
                    <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
                      {item.category}
                    </span>

                    <h2 className="text-5xl font-black text-slate-900 mt-5">
                      {item.title}
                    </h2>

                    <p className="text-slate-500 mt-3">{item.date}</p>

                    <p className="text-lg text-slate-600 mt-6 leading-relaxed">
                      {item.description ||
                        "Students participate in engaging academic and extracurricular activities that promote creativity, leadership, teamwork, and practical learning."}
                    </p>

                    <button
                      onClick={() => {
                        setSelectedAlbum(item);
                      }}
                      className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-green-600 text-white font-bold relative z-50"
                    >
                      View Album ({item.images?.length || 0})
                    </button>
                  </div>
                </motion.div>
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

      {/* ALBUM MODAL */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // FIX 2: Was setselectedAlbum (lowercase s) — corrected to setSelectedAlbum
            onClick={() => setSelectedAlbum(null)}
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
              className="relative max-w-5xl w-full rounded-[2rem] overflow-hidden"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 35px 100px rgba(0,0,0,0.42)",
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedAlbum(null)}
                className="
                  absolute
                  top-5
                  right-5
                  z-[99999]
                  w-12
                  h-12
                  rounded-full
                  bg-white
                  shadow-2xl
                  cursor-pointer
                  font-bold
                  hover:bg-red-500
                  hover:text-white
                  hover:rotate-180
                  hover:scale-110
                  transition-all
                  duration-500
                  flex
                  items-center
                  justify-center
                "
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedAlbum.images?.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      onClick={() => {
                        setActiveImage(img);
                        setCurrentImageIndex(index);
                      }}
                      className="
                        w-full
                        h-72
                        object-cover
                        rounded-2xl
                        cursor-pointer
                        hover:scale-105
                        transition-all
                        duration-500
                      "
                    />
                  ))}
                </div>
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
                    {selectedAlbum.date}
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL-SCREEN IMAGE LIGHTBOX — moved OUTSIDE album modal so it's not clipped by overflow:hidden */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-[999999] bg-black/90 flex items-center justify-center p-6"
          >
            <button
  onClick={(e) => {
    e.stopPropagation();
    previousImage();
  }}
  className="
    absolute
    left-8
    top-1/2
    -translate-y-1/2
    w-16
    h-16
    rounded-full
    bg-white
    shadow-2xl
    hover:scale-110
    transition-all
    z-50
  "
>
<ChevronLeft size={32} />
</button>
<button
  onClick={(e) => {
    e.stopPropagation();
    nextImage();
  }}
  className="
    absolute
    right-8
    top-1/2
    -translate-y-1/2
    w-16
    h-16
    rounded-full
    bg-white
    shadow-2xl
    hover:scale-110
    transition-all
    z-[999999]
    flex
    items-center
    justify-center
  "
>
<ChevronRight size={32} />
</button>
            <button
              onClick={() => setActiveImage(null)}
              className="
                absolute
                top-6
                right-6
                w-14
                h-14
                rounded-full
                bg-white
                flex
                items-center
                justify-center
                hover:bg-red-500
                hover:text-white
                hover:rotate-180
                transition-all
                duration-500
              "
            >
              <X size={24} />
            </button>

            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={activeImage}
              alt=""
              className="
                max-w-[95vw]
                max-h-[90vh]
                rounded-3xl
                shadow-2xl
              "
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export { Gallery };
export default Gallery;