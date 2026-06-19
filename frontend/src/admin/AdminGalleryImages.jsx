import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
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
  title: "Campus in Action",
  highlightedText: "in Action",
  description:
    "Explore moments from classrooms, activities, events, facilities, and student life at Baljagriti Secondary English School.",
  categories: ["Classroom", "Events", "Sports", "ECA", "Facilities"],
  categoryDescriptions: fallbackCategoryDescriptions,
  images: [],
  bottomTitle: "School Memories",
  bottomDescription:
    "Gallery images are updated by the school administration to highlight student life and campus activities.",
  bottomNote: "Click image to preview",
};

function normalizeCategories(categories = []) {
  const cleaned = categories
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item) => item.toLowerCase() !== "all");

  return cleaned.length > 0 ? cleaned : ["Classroom"];
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
    images: Array.isArray(saved.images) ? saved.images : [],
  };
}

function cleanFileName(fileName = "") {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function uploadGalleryImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("http://localhost:5000/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const uploadedUrl =
    res.data?.url ||
    res.data?.imageUrl ||
    res.data?.fileUrl ||
    res.data?.data?.url ||
    res.data?.data?.imageUrl ||
    res.data?.data?.fileUrl;

  if (!uploadedUrl) {
    throw new Error("Image uploaded but backend did not return image URL.");
  }

  return uploadedUrl;
}

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

export default function AdminGalleryImages() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultGalleryContent);
  const [selectedCategory, setSelectedCategory] = useState("Classroom");
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadGalleryContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/gallery"
        );

        const savedContent = res.data?.data?.content || {};
        const merged = mergeGalleryContent(savedContent);
        const categories = normalizeCategories(merged.categories);

        setForm(merged);
        setSelectedCategory(categories[0]);
      } catch (err) {
        console.error("Load gallery content error:", err);
        setError("Could not load gallery content.");
      } finally {
        setLoading(false);
      }
    };

    loadGalleryContent();
  }, []);

  const categoryOptions = normalizeCategories(form.categories);

  const selectedCategoryImages = (form.images || []).filter(
    (item) => item.category === selectedCategory
  );

  const allSelected =
    selectedCategoryImages.length > 0 &&
    selectedCategoryImages.every((item) => selectedIds.includes(item.id));

  const updateImage = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateCategoryDescription = (value) => {
    setForm((prev) => ({
      ...prev,
      categoryDescriptions: {
        ...(prev.categoryDescriptions || {}),
        [selectedCategory]: value,
      },
    }));
  };

  const validateImageFile = (file) => {
    if (!file.type.startsWith("image/")) {
      return "Please upload only image files.";
    }

    if (file.size > 3 * 1024 * 1024) {
      return "Image is too large. Please upload images under 3 MB.";
    }

    return "";
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter(
          (id) => !selectedCategoryImages.some((item) => item.id === id)
        )
      );
      return;
    }

    setSelectedIds((prev) =>
      Array.from(
        new Set([...prev, ...selectedCategoryImages.map((item) => item.id)])
      )
    );
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) {
      setError("Select at least one image to delete.");
      return;
    }

    const ok = window.confirm(
      `Delete ${selectedIds.length} selected image${
        selectedIds.length > 1 ? "s" : ""
      }?`
    );

    if (!ok) return;

    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((item) => !selectedIds.includes(item.id)),
    }));

    setSelectedIds([]);
    setSuccess("Selected image(s) removed. Click Save Changes to publish.");
    setError("");
  };

  const deleteOne = (id) => {
    const ok = window.confirm("Delete this image?");
    if (!ok) return;

    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((item) => item.id !== id),
    }));

    setSelectedIds((prev) => prev.filter((item) => item !== id));
    setSuccess("Image removed. Click Save Changes to publish.");
  };

  const handleUploadImages = async (files) => {
    setError("");
    setSuccess("");

    const selectedFiles = Array.from(files || []);
    if (selectedFiles.length === 0) return;

    const validationError = selectedFiles.map(validateImageFile).find(Boolean);

    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      const uploadedImages = await Promise.all(
        selectedFiles.map(async (file, index) => {
          const imageUrl = await uploadGalleryImage(file);

          return {
            id: `${Date.now()}-${index}-${Math.random()
              .toString(36)
              .substring(2)}`,
            title: cleanFileName(file.name) || `Gallery Image ${index + 1}`,
            category: selectedCategory,
            date: "School Activity",
            description: "",
            image: imageUrl,
            images: [imageUrl],
            visible: true,
          };
        })
      );

      setForm((prev) => ({
        ...prev,
        images: [...uploadedImages, ...prev.images],
      }));

      setSuccess(
        `${uploadedImages.length} image${
          uploadedImages.length > 1 ? "s" : ""
        } uploaded to ${selectedCategory}. Click Save Changes to publish.`
      );
    } catch (err) {
      console.error("Gallery upload error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not upload selected images. Make sure backend is running and /api/upload is working."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceImage = async (id, file) => {
    setError("");
    setSuccess("");

    if (!file) return;

    const validationError = validateImageFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadGalleryImage(file);

      setForm((prev) => ({
        ...prev,
        images: prev.images.map((item) =>
          item.id === id
            ? {
                ...item,
                image: imageUrl,
                images: [imageUrl],
              }
            : item
        ),
      }));

      setSuccess("Image replaced. Click Save Changes to publish.");
    } catch (err) {
      console.error("Replace gallery image error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not replace image."
      );
    } finally {
      setUploading(false);
    }
  };

  async function saveGalleryContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      const cleanedCategories = normalizeCategories(form.categories);

      const cleanedDescriptions = cleanedCategories.reduce((acc, category) => {
        acc[category] =
          form.categoryDescriptions?.[category] ||
          fallbackCategoryDescriptions[category] ||
          "";
        return acc;
      }, {});

      const cleanedForm = {
        ...form,
        categories: cleanedCategories,
        categoryDescriptions: cleanedDescriptions,
        images: form.images.map((image) => ({
          ...image,
          description: "",
          category: cleanedCategories.includes(image.category)
            ? image.category
            : cleanedCategories[0],
          images:
            Array.isArray(image.images) && image.images.length > 0
              ? image.images
              : image.image
              ? [image.image]
              : [],
        })),
      };

      await axios.put(
        "http://localhost:5000/api/site-content/gallery",
        { content: cleanedForm },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm(cleanedForm);
      setSuccess("Gallery images saved successfully. Redirecting...");

      setTimeout(() => {
        navigate("/admin/gallery");
      }, 900);
    } catch (err) {
      console.error("Save gallery images error:", err);
      setError(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          "Could not save gallery images."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFF8EE" }}
      >
        <div className="text-slate-600 font-semibold">
          Loading gallery image manager...
        </div>
      </div>
    );
  }

  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(250,204,21,0.12), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <header
        className="sticky top-0 z-40"
        style={{
          background:
            "linear-gradient(145deg, rgba(2,6,23,0.96), rgba(15,23,42,0.88))",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 18px 52px rgba(0,0,0,0.22)",
          backdropFilter: "blur(22px)",
        }}
      >
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/gallery")}
            className="inline-flex items-center gap-2 text-white font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Gallery Editor
          </button>

          <button
            type="button"
            onClick={saveGalleryContent}
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
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(75,46,131,0.1)",
              color: colors.purple,
              border: "1px solid rgba(75,46,131,0.2)",
            }}
          >
            <ImageIcon className="w-4 h-4" />
            Gallery Image Manager
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
            Upload / Remove Gallery Images
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Select a category, write one category description, upload one or
            multiple images, select multiple images, and delete selected images.
          </p>
        </motion.div>

        {success && (
          <div
            className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold"
            style={{
              background: "rgba(22,138,58,0.1)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.2)",
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </div>
        )}

        {error && (
          <div
            className="mb-6 rounded-2xl px-5 py-4 font-semibold"
            style={{
              background: "rgba(215,25,32,0.1)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.2)",
            }}
          >
            {error}
          </div>
        )}

        <div
          className="rounded-[32px] p-6 mb-8"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
            border: "1px solid rgba(11,16,32,0.08)",
            boxShadow:
              "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-end">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">
                Select Category
              </label>

              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedIds([]);
                }}
                className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  border: "1px solid rgba(75,46,131,0.16)",
                  color: colors.dark,
                }}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <p className="text-xs text-slate-500 mt-2">
                Upload one or many images. All selected images will go inside{" "}
                <b>{selectedCategory}</b>.
              </p>
            </div>

            <label
              className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
              }}
            >
              <Upload className="w-5 h-5" />
              {uploading ? "Uploading..." : "Upload Image(s)"}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                className="hidden"
                onChange={(e) => {
                  handleUploadImages(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <div className="mt-6">
            <TextArea
              label={`${selectedCategory} Category Description`}
              value={
                form.categoryDescriptions?.[selectedCategory] ||
                fallbackCategoryDescriptions[selectedCategory] ||
                ""
              }
              onChange={updateCategoryDescription}
              rows={4}
            />

            <p className="text-xs text-slate-500 mt-2">
              This single description will be shown for the whole{" "}
              <b>{selectedCategory}</b> album on the public gallery page.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              {selectedCategory} Images
            </h2>
            <p className="text-slate-500">
              {selectedCategoryImages.length} total · {selectedIds.length} selected
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="px-5 py-3 rounded-2xl font-bold bg-white border border-slate-200 text-slate-800"
            >
              {allSelected ? "Unselect All" : "Select All"}
            </button>

            <button
              type="button"
              onClick={deleteSelected}
              className="px-5 py-3 rounded-2xl font-bold text-white"
              style={{
                background:
                  selectedIds.length > 0
                    ? colors.red
                    : "rgba(100,116,139,0.55)",
              }}
            >
              Delete Selected
            </button>
          </div>
        </div>

        {selectedCategoryImages.length === 0 ? (
          <div
            className="rounded-[32px] p-12 text-center"
            style={{
              background: "rgba(255,255,255,0.84)",
              border: "1px dashed rgba(15,23,42,0.18)",
            }}
          >
            <ImageIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <div className="font-black text-slate-900">
              No images in {selectedCategory}.
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Upload one or multiple images from your device.
            </div>
          </div>
        ) : (
          <div className="grid xl:grid-cols-2 gap-6">
            {selectedCategoryImages.map((item) => {
              const checked = selectedIds.includes(item.id);
              const displayImage = item.image || item.images?.[0];

              return (
                <div
                  key={item.id}
                  className="rounded-[32px] p-5"
                  style={{
                    background: checked
                      ? "linear-gradient(145deg, rgba(22,138,58,0.12), rgba(255,255,255,0.86))"
                      : "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
                    border: checked
                      ? "1px solid rgba(22,138,58,0.32)"
                      : "1px solid rgba(11,16,32,0.08)",
                    boxShadow:
                      "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
                  }}
                >
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSelect(item.id)}
                        className="w-5 h-5"
                      />
                      <span className="font-black text-slate-950">
                        {item.title || "Untitled Image"}
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateImage(item.id, "visible", !item.visible)
                        }
                        className="p-3 rounded-xl"
                        style={{
                          background:
                            item.visible !== false
                              ? "rgba(22,138,58,0.1)"
                              : "rgba(100,116,139,0.12)",
                          color:
                            item.visible !== false ? colors.green : "#64748B",
                        }}
                        title={item.visible !== false ? "Visible" : "Hidden"}
                      >
                        {item.visible !== false ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteOne(item.id)}
                        className="p-3 rounded-xl"
                        style={{
                          background: "rgba(215,25,32,0.09)",
                          color: colors.red,
                        }}
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[220px_1fr] gap-5">
                    <div>
                      <div
                        className="w-full h-44 rounded-2xl overflow-hidden bg-slate-100 border flex items-center justify-center"
                        style={{ borderColor: "rgba(15,23,42,0.08)" }}
                      >
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-12 h-12 text-slate-300" />
                        )}
                      </div>

                      <label
                        className="mt-3 w-full cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                        }}
                      >
                        <Upload className="w-4 h-4" />
                        Replace Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => {
                            handleReplaceImage(item.id, e.target.files?.[0]);
                            e.target.value = "";
                          }}
                        />
                      </label>

                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Recommended size: 1200 × 800 px. Max 3 MB.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <Field
                        label="Image Title"
                        value={item.title}
                        onChange={(value) =>
                          updateImage(item.id, "title", value)
                        }
                      />

                      <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700">
                          Image Category
                        </label>

                        <select
                          value={item.category || ""}
                          onChange={(e) =>
                            updateImage(item.id, "category", e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                          style={{
                            background: "rgba(255,255,255,0.88)",
                            border: "1px solid rgba(75,46,131,0.16)",
                            color: colors.dark,
                          }}
                        >
                          {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>

                        <p className="text-xs text-slate-500 mt-2">
                          Changing this moves the image to another category.
                        </p>
                      </div>

                      <Field
                        label="Date / Label"
                        value={item.date}
                        onChange={(value) =>
                          updateImage(item.id, "date", value)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </section>
  );
}