import { useEffect, useState } from "react";
import { X, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const API_URL = "https://school-website-backend-ixx2.onrender.com";

function getImageUrl(item) {
  return item?.image_url || item?.imageUrl || item?.image || "";
}

export default function HomeAnnouncementPopup() {
  const [announcement, setAnnouncement] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetch(`${API_URL}/api/announcements`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;

        const list = Array.isArray(data?.data) ? data.data : [];

        const homepageAnnouncement = list.find(
          (item) =>
            item.active !== false &&
            item.visible !== false &&
            item.show_on_homepage === true
        );

        if (homepageAnnouncement) {
          setAnnouncement(homepageAnnouncement);
          setOpen(true);
        }
      })
      .catch((err) => {
        console.error("Announcement popup load error:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [open]);

  if (!announcement) return null;

  const imageUrl = getImageUrl(announcement);
  const hasImage = imageUrl && !imageError;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[28px] bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close announcement"
              className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-xl transition-all hover:scale-105"
            >
              <X size={22} />
            </button>

            <div className="max-h-[90vh] overflow-y-auto">
              {hasImage ? (
                <div className="bg-slate-100">
                  <img
                    src={imageUrl}
                    alt={announcement.title || "School announcement"}
                    onError={() => setImageError(true)}
                    className="block w-full max-h-[78vh] object-contain"
                  />
                </div>
              ) : (
                <div className="px-6 py-12 sm:px-10 sm:py-14 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <Megaphone className="h-8 w-8" />
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black text-slate-950 leading-tight">
                    {announcement.title || "School Announcement"}
                  </h2>

                  {announcement.description && (
                    <p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-base sm:text-lg leading-relaxed text-slate-600">
                      {announcement.description}
                    </p>
                  )}
                </div>
              )}

              {(announcement.title || announcement.description) && hasImage && (
                <div className="px-5 py-5 sm:px-7 bg-white border-t border-slate-100">
                  {announcement.title && (
                    <h2 className="pr-12 text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                      {announcement.title}
                    </h2>
                  )}

                  {announcement.description && (
                    <p className="mt-2 whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-600">
                      {announcement.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}