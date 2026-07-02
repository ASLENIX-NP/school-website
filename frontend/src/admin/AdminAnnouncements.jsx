import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  UploadCloud,
  CheckCircle2,
  Eye,
  EyeOff,
  Calendar,
  X,
  ExternalLink,
  Megaphone,
  Edit2,
  Sparkles,
  Zap,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const lightAdminPanelStyle = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95))",
  border: "1px solid rgba(75,46,131,0.12)",
  boxShadow: "0 18px 44px rgba(15,23,42,0.08)",
  backdropFilter: "blur(14px)",
};

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  icon: Icon,
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm transition-all focus:ring-2 focus:ring-red-200"
          style={{
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
            paddingLeft: Icon ? "44px" : "16px",
          }}
        />
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none transition-all focus:ring-2 focus:ring-red-200"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function EditorCard({ icon: Icon, title, color, children, gradient }) {
  return (
    <div
      className="rounded-3xl p-5 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-xl"
      style={{
        background:
          gradient ||
          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
        border: "1px solid rgba(11,16,32,0.08)",
        boxShadow:
          "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl" style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function AnnouncementCard({
  announcement,
  onDelete,
  onToggleVisibility,
  onEdit,
}) {
  const hasImage = announcement.image_url && announcement.image_url !== "";

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(75,46,131,0.10)",
        boxShadow: "0 12px 32px rgba(11,16,32,0.06)",
        opacity: announcement.visible !== false ? 1 : 0.6,
      }}
    >
      {hasImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={announcement.image_url}
            alt={announcement.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
              style={{
                background: "rgba(215,25,32,0.9)",
                color: "#fff",
              }}
            >
              <Zap className="w-3 h-3" />
              {announcement.active !== false ? "Active" : "Inactive"}
            </span>
            {announcement.show_on_homepage && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  background: "rgba(250,204,21,0.9)",
                  color: "#0B1020",
                }}
              >
                <Sparkles className="w-3 h-3" />
                Homepage
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-950">
              {announcement.title || "Untitled"}
            </h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
              {announcement.description || "No description"}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {announcement.created_at
                  ? new Date(announcement.created_at).toLocaleDateString()
                  : "No date"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => onEdit(announcement)}
              className="p-2 rounded-xl transition-all hover:scale-110"
              style={{
                background: "rgba(75,46,131,0.08)",
                color: colors.purple,
              }}
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onToggleVisibility(announcement)}
              className="p-2 rounded-xl transition-all hover:scale-110"
              style={{
                background:
                  announcement.visible !== false
                    ? "rgba(22,138,58,0.08)"
                    : "rgba(100,116,139,0.1)",
                color:
                  announcement.visible !== false ? colors.green : "#64748B",
              }}
              title={announcement.visible !== false ? "Visible" : "Hidden"}
            >
              {announcement.visible !== false ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onDelete(announcement.id)}
              className="p-2 rounded-xl transition-all hover:scale-110"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnnouncementPreview({ announcements }) {
  const visible = announcements.filter((a) => a.visible !== false);

  return (
    <div
      className="min-h-full p-5 sm:p-6"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(75,46,131,0.08), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 100%)",
      }}
    >
      <div className="text-center mb-6">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-3"
          style={{
            background: "rgba(215,25,32,0.08)",
            color: colors.red,
            border: "1px solid rgba(215,25,32,0.15)",
          }}
        >
          <Megaphone className="w-4 h-4" />
          Announcements
        </div>

        <h3
          className="text-2xl text-slate-950 leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 850,
            letterSpacing: "-0.04em",
          }}
        >
          Latest Announcements
        </h3>

        <p className="mt-2 text-slate-500 text-sm">
          Newest announcement appears first.
        </p>
      </div>

      {visible.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "1px dashed rgba(15,23,42,0.12)",
          }}
        >
          <Megaphone className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 font-semibold">No announcements yet</p>
          <p className="text-sm text-slate-400">Add your first announcement</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                border: "1px solid rgba(215,25,32,0.08)",
                boxShadow: "0 12px 32px rgba(215,25,32,0.08)",
              }}
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div className="p-4">
                <div className="font-black text-slate-950">{item.title}</div>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "No date"}
                </div>
              </div>
            </div>
          ))}
          {visible.length > 3 && (
            <p className="text-center text-sm text-slate-400 font-semibold">
              +{visible.length - 3} more announcements
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminAnnouncements() {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    description: "",
    active: true,
    visible: true,
    show_on_homepage: true,
  });

  const [imageFile, setImageFile] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/announcements");
      const data = await res.json();

      if (data.success) {
        setAnnouncements(data.data || []);
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      console.error("Fetch announcements error:", err);
      setError("Could not load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      image_url: "",
      description: "",
      active: true,
      visible: true,
      show_on_homepage: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setSuccess("");
    setError("");
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      image_url: item.image_url || "",
      description: item.description || "",
      active: item.active !== false,
      visible: item.visible !== false,
      show_on_homepage: item.show_on_homepage !== false,
    });
    setImageFile(null);
    setImagePreview(item.image_url || null);
    setSuccess("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Announcement deleted successfully.");
        fetchAnnouncements();
        if (editingId === id) resetForm();
      } else {
        setError(data.message || "Could not delete.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Could not delete announcement.");
    }
  };

  const handleToggleVisibility = async (item) => {
    const newVisibility = item.visible !== false ? false : true;

    try {
      const res = await fetch(
        `http://localhost:5000/api/announcements/${item.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, visible: newVisibility }),
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchAnnouncements();
      }
    } catch (err) {
      console.error("Toggle visibility error:", err);
      setError("Could not update visibility.");
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 6 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, WebP, or GIF images.");
      return null;
    }

    if (file.size > maxSize) {
      setError("Image must be less than 6 MB.");
      return null;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const uploadedUrl =
        res.data?.url ||
        res.data?.imageUrl ||
        res.data?.fileUrl ||
        res.data?.data?.url ||
        res.data?.data?.imageUrl ||
        res.data?.data?.fileUrl ||
        res.data?.secure_url ||
        res.data?.data?.secure_url;

      if (!uploadedUrl) {
        setError("Image uploaded but URL not returned.");
        return null;
      }

      return uploadedUrl;
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err.response?.data?.message || "Image upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormData({ ...formData, image_url: "Uploading..." });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setSaving(false);
          return;
        }
      }

      if (imageUrl === "Uploading...") {
        setError("Image upload failed. Please try again.");
        setSaving(false);
        return;
      }

      const announcementData = {
        title: formData.title,
        image_url: imageUrl || "",
        description: formData.description,
        active: formData.active,
        visible: formData.visible,
        show_on_homepage: formData.show_on_homepage,
      };

      const url = editingId
        ? `http://localhost:5000/api/announcements/${editingId}`
        : "http://localhost:5000/api/announcements";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(
          editingId
            ? "Announcement updated successfully."
            : "Announcement added successfully."
        );
        resetForm();
        fetchAnnouncements();
      } else {
        setError(data.message || "Could not save announcement.");
      }
    } catch (err) {
      console.error("Save announcement error:", err);
      setError("Could not save announcement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFF8EE" }}
      >
        <div className="text-slate-600 font-semibold">
          Loading announcements...
        </div>
      </div>
    );
  }

  return (
    <section
      className="admin-announcements-editor min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(250,204,21,0.12), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <style>
        {`
          @media (max-width: 767px) {
            .admin-announcements-editor [class*="opacity-0"] {
              opacity: 1 !important;
            }

            .admin-announcements-editor [class*="group-hover:opacity"] {
              opacity: 1 !important;
            }

            .admin-announcements-editor [class*="z-50"],
            .admin-announcements-editor [class*="z-[50]"],
            .admin-announcements-editor [class*="z-[60]"],
            .admin-announcements-editor [class*="z-[70]"],
            .admin-announcements-editor [class*="z-[80]"],
            .admin-announcements-editor [class*="z-[90]"],
            .admin-announcements-editor [class*="z-[999]"] {
              z-index: 20 !important;
            }
          }
        `}
      </style>

      <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-20 w-72 h-72 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      <header
        className="relative z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95))",
          borderBottom: "1px solid rgba(75,46,131,0.12)",
          boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex w-fit items-center gap-2 font-black transition-all hover:-translate-x-1"
            style={{ color: colors.dark }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all hover:scale-105 disabled:opacity-60"
              style={{
                color: "#020617",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                boxShadow:
                  "0 18px 42px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.15)",
              }}
            >
              <Megaphone className="w-4 h-4" />
              Manage Announcements
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-red-200 to-transparent" />
          </div>

          <h1
            className="text-3xl md:text-6xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            Announcement Manager
          </h1>

          <p className="text-slate-500 max-w-3xl text-base sm:text-lg">
            Add, edit, and manage announcements. These will appear on the
            homepage as popups.
          </p>
        </motion.div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold"
            style={{
              background: "rgba(22,138,58,0.1)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.2)",
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl px-5 py-4 font-semibold"
            style={{
              background: "rgba(215,25,32,0.1)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.2)",
            }}
          >
            {error}
          </motion.div>
        )}

        <div className="grid xl:grid-cols-[780px_1fr] gap-8 items-start">
          <div className="space-y-8">
            <EditorCard
              icon={editingId ? Edit2 : Plus}
              title={editingId ? "Edit Announcement" : "Add New Announcement"}
              color={colors.red}
              gradient="linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,245,245,0.92))"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <Field
                  label="Announcement Title"
                  value={formData.title}
                  onChange={(value) =>
                    setFormData({ ...formData, title: value })
                  }
                  placeholder="e.g., Vacancy Announcement 2026"
                  required
                  icon={Edit2}
                />

                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">
                    Image / Banner
                  </label>
                  <div
                    className="rounded-2xl p-4 transition-all hover:border-purple-300"
                    style={{
                      background: "rgba(255,255,255,0.88)",
                      border: "2px dashed rgba(75,46,131,0.16)",
                    }}
                  >
                    {(imagePreview || formData.image_url) &&
                    formData.image_url !== "Uploading..." ? (
                      <div className="space-y-3">
                        <div className="relative rounded-xl overflow-hidden">
                          <img
                            src={imagePreview || formData.image_url}
                            alt="Announcement"
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/400x300?text=No+Image";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, image_url: "" });
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-6 hover:bg-purple-50/50 rounded-xl transition-colors">
                        <div
                          className="p-3 rounded-full"
                          style={{ background: "rgba(75,46,131,0.08)" }}
                        >
                          <UploadCloud
                            className="w-8 h-8"
                            style={{ color: colors.purple }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-800">
                          {uploading ? "Uploading..." : "Click to Upload Image"}
                        </span>
                        <span className="text-xs text-slate-500">
                          PNG, JPG, WebP, GIF • Max 5MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploading}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {imageFile && formData.image_url === "Uploading..." && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Selected: {imageFile.name}
                    </div>
                  )}
                </div>

                <TextArea
                  label="Description"
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                  placeholder="Write the announcement details here..."
                  rows={5}
                />

                <div
                  className="flex flex-wrap items-center gap-6 p-4 rounded-2xl"
                  style={{ background: "rgba(15,23,42,0.03)" }}
                >
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          active: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-red-500"
                    />
                    Active
                  </label>

                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.visible}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visible: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-green-500"
                    />
                    Visible on website
                  </label>

                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.show_on_homepage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          show_on_homepage: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-yellow-500"
                    />
                    Show on homepage
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105"
                      style={{
                        background: "rgba(100,116,139,0.1)",
                        color: "#64748B",
                        border: "1px solid rgba(100,116,139,0.2)",
                      }}
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 disabled:opacity-60 hover:shadow-xl"
                    style={{
                      color: "#fff",
                      background: `linear-gradient(135deg, ${colors.red}, #9B1117)`,
                      boxShadow: "0 14px 34px rgba(215,25,32,0.25)",
                    }}
                  >
                    <Save className="w-4 h-4" />
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Announcement"
                      : "Add Announcement"}
                  </button>
                </div>
              </form>
            </EditorCard>

            <EditorCard
              icon={Megaphone}
              title="All Announcements"
              color={colors.green}
              gradient="linear-gradient(145deg, rgba(255,255,255,0.96), rgba(245,255,245,0.92))"
            >
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Megaphone className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="font-semibold text-lg">
                      No announcements added yet
                    </p>
                    <p className="text-sm">
                      Add your first announcement using the form.
                    </p>
                  </div>
                ) : (
                  announcements.map((item) => (
                    <AnnouncementCard
                      key={item.id}
                      announcement={item}
                      onDelete={handleDelete}
                      onToggleVisibility={handleToggleVisibility}
                      onEdit={handleEdit}
                    />
                  ))
                )}
              </div>
            </EditorCard>
          </div>

          <aside
            className="xl:sticky xl:top-28 rounded-3xl overflow-hidden"
            style={lightAdminPanelStyle}
          >
            <div
              className="p-5"
              style={{
                borderBottom: "1px solid rgba(75,46,131,0.1)",
              }}
            >
              <div
                className="font-black text-lg flex items-center gap-2"
                style={{ color: colors.dark }}
              >
                <div
                  className="p-1.5 rounded-lg"
                  style={{
                    background: "rgba(75,46,131,0.1)",
                    color: colors.purple,
                  }}
                >
                  <Eye className="w-5 h-5" />
                </div>
                Homepage Preview
              </div>
              <div className="text-sm text-slate-500">
                Preview how announcements appear on homepage.
              </div>
            </div>

            <div
              className="bg-white overflow-y-auto"
              style={{ height: "600px" }}
            >
              <AnnouncementPreview announcements={announcements} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}