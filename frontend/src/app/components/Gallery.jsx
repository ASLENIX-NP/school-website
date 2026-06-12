import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  X,
  Layers,
  CalendarDays,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cream: "#FFF8EE",
};

/*
  Later this can come from backend/admin dashboard.
  Admin can add:
  - image
  - title
  - category
  - date
*/
const galleryData = {
  badge: "Gallery",
  title: "Campus in Action",
  description:
    "Explore moments from classrooms, activities, events, facilities, and student life at Baljagriti Secondary English School.",

  categories: ["All", "Classroom", "Events", "Sports", "ECA", "Facilities"],

  images: [
    {
      id: 1,
      title: "Classroom Learning",
      category: "Classroom",
      date: "Academic Session",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop&auto=format",
    },
    {
      id: 2,
      title: "Interactive Teaching",
      category: "Classroom",
      date: "Daily Learning",
      image:
        "https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&h=700&fit=crop&auto=format",
    },
    {
      id: 3,
      title: "School Event",
      category: "Events",
      date: "Annual Program",
      image:
        "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=900&h=700&fit=crop&auto=format",
    },
    {
      id: 4,
      title: "Sports Activities",
      category: "Sports",
      date: "Sports Week",
      image:
        "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=900&h=700&fit=crop&auto=format",
    },
    {
      id: 5,
      title: "Creative Activities",
      category: "ECA",
      date: "Extra Curricular",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&h=700&fit=crop&auto=format",
    },
    {
      id: 6,
      title: "Computer Lab",
      category: "Facilities",
      date: "Digital Learning",
      image:
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=900&h=700&fit=crop&auto=format",
    },
    {
      id: 7,
      title: "Science Learning",
      category: "Facilities",
      date: "Practical Class",
      image:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&h=700&fit=crop&auto=format",
    },
    {
      id: 8,
      title: "Student Participation",
      category: "Events",
      date: "School Program",
      image:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&h=700&fit=crop&auto=format",
    },
  ],
};

function GalleryCard({ item, index, onClick }) {
  const isLarge = index === 0 || index === 5;

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
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

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
          <span className="text-xs font-medium text-white/70">
            {item.date}
          </span>
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages =
    activeCategory === "All"
      ? galleryData.images
      : galleryData.images.filter((item) => item.category === activeCategory);

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
            {galleryData.badge}
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
            Campus{" "}
            <span
              className="italic"
              style={{
                color: colors.red,
              }}
            >
              in Action
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-500 leading-relaxed">
            {galleryData.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {galleryData.categories.map((category) => {
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
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={setSelectedImage}
                />
              ))}
            </AnimatePresence>
          </motion.div>
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
              <div className="text-white font-bold">Admin Gallery Ready</div>
              <div
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.68)" }}
              >
                Images, categories, titles, and dates can later come from admin
                dashboard.
              </div>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            <Sparkles className="w-4 h-4" style={{ color: "#FACC15" }} />
            Click image to preview
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
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
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-10 w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(2,6,23,0.72)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(14px)",
                }}
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-[70vh] object-cover"
              />

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
                    {selectedImage.category}
                  </span>

                  <span className="text-sm text-slate-500">
                    {selectedImage.date}
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
                  {selectedImage.title}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export { Gallery };
export default Gallery;