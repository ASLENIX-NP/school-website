import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function HomeAnnouncementPopup() {
  const [announcement, setAnnouncement] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("https://school-website-backend-ixx2.onrender.com/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          const latest = data.data[0];

          if (
            latest.active === true &&
            latest.show_on_homepage === true
          ) {
            setAnnouncement(latest);
            setOpen(true);
          }
        }
      })
      .catch(console.error);
  }, []);

  if (!announcement) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-20 bg-black text-white rounded-full p-2"
            >
              <X size={20} />
            </button>

            <img
              src={announcement.image_url}
              alt={announcement.title}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

