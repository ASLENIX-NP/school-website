import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ZoomIn } from "lucide-react";

const images = [
  {
    src: "https://images.unsplash.com/photo-1758270705654-bd043ed13d5d?w=600&h=400&fit=crop&auto=format",
    alt: "Students in lecture hall",
    span: "col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=400&fit=crop&auto=format",
    alt: "Teacher with students",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1581726707445-75cbe4efc586?w=400&h=400&fit=crop&auto=format",
    alt: "Student studying",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=400&fit=crop&auto=format",
    alt: "Graduation ceremony",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1643199121319-b3b5695e4acb?w=600&h=400&fit=crop&auto=format",
    alt: "Computer lab",
    span: "col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1496469888073-80de7e952517?w=400&h=400&fit=crop&auto=format",
    alt: "Graduation day",
    span: "",
  },
];

export function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section
      id="gallery"
      className="pt-36 pb-28 relative min-h-screen"
      style={{
        background: "linear-gradient(180deg, #fdf8f3 0%, #f0e8ff 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "rgba(107,33,168,0.1)",
              color: "#6b21a8",
              border: "1px solid rgba(107,33,168,0.2)",
            }}
          >
            Gallery
          </span>

          <h2
            className="text-4xl md:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "#0f1c3f",
            }}
          >
            Campus{" "}
            <span className="italic" style={{ color: "#f97316" }}>
              in Action
            </span>
          </h2>

          <p className="mt-4 max-w-xl mx-auto" style={{ color: "#64748b" }}>
            A glimpse into the daily life, events, and achievements that define
the Baljagriti experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
          {images.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group ${img.span}`}
              onClick={() => setLightbox(img.src)}
              style={{ boxShadow: "0 8px 32px rgba(15,28,63,0.12)" }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                style={{ background: "rgba(15,28,63,0.5)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #0f1c3f, #1a0a3c)",
              color: "#ffffff",
              boxShadow: "0 8px 24px rgba(15,28,63,0.2)",
            }}
          >
            View Full Gallery →
          </button>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.9)",
              backdropFilter: "blur(12px)",
            }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={lightbox}
              alt="Gallery preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}
              onClick={(e) => e.stopPropagation()}
            />

            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}