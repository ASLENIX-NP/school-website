import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Camera,
  Type,
  Image as ImageIcon,
  Layers,
  Upload,
  Sparkles,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultGalleryContent = {
  badge: "Gallery",
  title: "Campus in Action",
  highlightedText: "in Action",
  description:
    "Explore moments from classrooms, activities, events, facilities, and student life at Baljagriti Secondary English School.",

  categories: ["Classroom", "Events", "Sports", "ECA", "Facilities"],

  images: [
    {
      id: 1,
      title: "Classroom Learning",
      category: "Classroom",
      date: "Academic Session",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop&auto=format",
      visible: true,
    },
    {
      id: 2,
      title: "Interactive Teaching",
      category: "Classroom",
      date: "Daily Learning",
      image:
        "https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&h=700&fit=crop&auto=format",
      visible: true,
    },
    {
      id: 3,
      title: "School Event",
      category: "Events",
      date: "Annual Program",
      image:
        "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=900&h=700&fit=crop&auto=format",
      visible: true,
    },
    {
      id: 4,
      title: "Sports Activities",
      category: "Sports",
      date: "Sports Week",
      image:
        "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=900&h=700&fit=crop&auto=format",
      visible: true,
    },
    {
      id: 5,
      title: "Creative Activities",
      category: "ECA",
      date: "Extra Curricular",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&h=700&fit=crop&auto=format",
      visible: true,
    },
    {
      id: 6,
      title: "Computer Lab",
      category: "Facilities",
      date: "Digital Learning",
      image:
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=900&h=700&fit=crop&auto=format",
      visible: true,
    },
  ],

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
    images: Array.isArray(saved.images)
      ? saved.images
      : defaultGalleryContent.images,
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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Image read failed"));

    reader.readAsDataURL(file);
  });
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

function EditorCard({ icon: Icon, title, color, children }) {
  return (
    <div
      className="rounded-3xl p-6 md:p-8"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
        border: "1px solid rgba(11,16,32,0.08)",
        boxShadow:
          "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-5 h-5" style={{ color }} />
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>

      {children}
    </div>
  );
}

function VisibilityDeleteControls({ visible, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className="p-3 rounded-xl"
        style={{
          background:
            visible !== false
              ? "rgba(22,138,58,0.1)"
              : "rgba(100,116,139,0.12)",
          color: visible !== false ? colors.green : "#64748B",
        }}
      >
        {visible !== false ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="p-3 rounded-xl"
        style={{
          background: "rgba(215,25,32,0.09)",
          color: colors.red,
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function GalleryPreview({ form }) {
  const visibleImages = (form.images || []).filter(
    (item) => item.visible !== false
  );

  return (
    <div
      className="min-h-full p-6"
      style={{
        background:
          "radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
      }}
    >
      <div className="text-center mb-8">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          style={{
            background: "rgba(75,46,131,0.09)",
            color: colors.purple,
          }}
        >
          {form.badge}
        </span>

        <h2
          className="text-4xl font-black text-slate-950"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.04em",
          }}
        >
          {form.title}
        </h2>

        <p className="text-sm text-slate-500 mt-4 leading-relaxed">
          {form.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <span className="px-4 py-2 rounded-xl text-sm font-bold bg-white border text-slate-700">
          All
        </span>

        {normalizeCategories(form.categories || []).map((category) => (
          <span
            key={category}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white border text-slate-700"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {visibleImages.map((item, index) => (
          <div
            key={item.id}
            className={`relative rounded-3xl overflow-hidden ${
              index === 0 ? "col-span-2 h-72" : "h-48"
            }`}
            style={{
              boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
            }}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                <ImageIcon className="w-14 h-14 text-slate-400" />
              </div>
            )}

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(11,16,32,0.75), transparent)",
              }}
            />

            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-white/70 text-xs">{item.category}</div>
              <div className="text-white font-black">{item.title}</div>
              <div className="text-white/60 text-xs">{item.date}</div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-8 rounded-3xl p-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(11,16,32,0.96), rgba(75,46,131,0.9))",
        }}
      >
        <div className="text-white font-bold">{form.bottomTitle}</div>
        <div className="text-sm text-white/60 mt-1">
          {form.bottomDescription}
        </div>
      </div>
    </div>
  );
}

export default function AdminGallery() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultGalleryContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Classroom");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadGalleryContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/gallery"
        );

        const savedContent = res.data?.data?.content || {};
        const mergedContent = mergeGalleryContent(savedContent);
        const categories = normalizeCategories(mergedContent.categories);

        setForm(mergedContent);
        setSelectedCategory(categories[0]);
      } catch (err) {
        console.error("Load gallery content error:", err);
        setSelectedCategory(defaultGalleryContent.categories[0]);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryContent();
  }, []);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCategoryOptions = () => normalizeCategories(form.categories);

  const updateCategory = (index, value) => {
    const cleanValue = value.trimStart();

    setForm((prev) => {
      const categories = normalizeCategories(prev.categories);
      const oldCategory = categories[index];

      categories[index] = cleanValue;

      return {
        ...prev,
        categories,
        images: prev.images.map((image) =>
          image.category === oldCategory && cleanValue.trim()
            ? { ...image, category: cleanValue }
            : image
        ),
      };
    });

    const oldCategory = getCategoryOptions()[index];

    if (selectedCategory === oldCategory) {
      setSelectedCategory(cleanValue);
    }
  };

  const addCategory = () => {
    setForm((prev) => {
      const categories = normalizeCategories(prev.categories);
      let newName = "New Category";
      let counter = 1;

      while (categories.includes(newName)) {
        counter += 1;
        newName = `New Category ${counter}`;
      }

      setSelectedCategory(newName);

      return {
        ...prev,
        categories: [...categories, newName],
      };
    });
  };

  const deleteCategory = (categoryToDelete) => {
    setError("");

    const categories = getCategoryOptions();

    if (categories.length <= 1) {
      setError("At least one category is required.");
      return;
    }

    const remainingCategories = categories.filter(
      (category) => category !== categoryToDelete
    );

    const fallbackCategory = remainingCategories[0];

    setForm((prev) => ({
      ...prev,
      categories: remainingCategories,
      images: prev.images.map((image) =>
        image.category === categoryToDelete
          ? { ...image, category: fallbackCategory }
          : image
      ),
    }));

    if (selectedCategory === categoryToDelete) {
      setSelectedCategory(fallbackCategory);
    }
  };

  const updateImage = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const deleteImage = (id) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((item) => item.id !== id),
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

  const handleReplaceImage = async (id, file) => {
    setError("");

    if (!file) return;

    const validationError = validateImageFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const imageData = await readFileAsDataUrl(file);
      updateImage(id, "image", imageData);
    } catch (err) {
      console.error("Single gallery image upload error:", err);
      setError("Could not read selected image.");
    }
  };

  const handleCategoryImageUpload = async (files) => {
    setError("");
    setSuccess("");

    const selectedFiles = Array.from(files || []);

    if (selectedFiles.length === 0) return;

    const category = selectedCategory || getCategoryOptions()[0] || "Classroom";

    const validationError = selectedFiles.map(validateImageFile).find(Boolean);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const uploadedImages = await Promise.all(
        selectedFiles.map(async (file, index) => ({
          id: Date.now() + index,
          title: cleanFileName(file.name) || `New Image ${index + 1}`,
          category,
          date: "School Activity",
          image: await readFileAsDataUrl(file),
          visible: true,
        }))
      );

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));

      setSuccess(
        `${uploadedImages.length} image${
          uploadedImages.length > 1 ? "s" : ""
        } uploaded to ${category}. Now edit title/date if needed, then click Save Changes.`
      );
    } catch (err) {
      console.error("Multiple gallery image upload error:", err);
      setError("Could not read selected images.");
    }
  };

  async function saveGalleryContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      const cleanedCategories = getCategoryOptions();

      const cleanedForm = {
        ...form,
        categories: cleanedCategories,
        images: form.images.map((image) => ({
          ...image,
          category: cleanedCategories.includes(image.category)
            ? image.category
            : cleanedCategories[0],
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
      setSuccess("Gallery page content saved successfully.");
    } catch (err) {
      console.error("Save gallery content error:", err);
      setError(err.response?.data?.message || "Could not save gallery content.");
    } finally {
      setSaving(false);
    }
  }

  const categoryOptions = getCategoryOptions();

  const selectedCategoryImages = (form.images || []).filter(
    (item) => item.category === selectedCategory
  );

  const visibleSelectedCount = selectedCategoryImages.filter(
    (item) => item.visible !== false
  ).length;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFF8EE" }}
      >
        <div className="text-slate-600 font-semibold">
          Loading gallery editor...
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
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-white font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <a
              href="/gallery"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Gallery Page
            </a>

            <button
              type="button"
              onClick={saveGalleryContent}
              disabled={saving}
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
            <Camera className="w-4 h-4" />
            Manage Gallery Page
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
            Edit Gallery Page
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Select a category, upload one or multiple images into that category,
            then edit each image title and date/label.
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

        <div className="grid xl:grid-cols-[780px_1fr] gap-8 items-start">
          <div className="space-y-8">
            <EditorCard
              icon={Type}
              title="Top Gallery Section"
              color={colors.purple}
            >
              <div className="grid gap-5">
                <Field
                  label="Badge Text"
                  value={form.badge}
                  onChange={(value) => updateField("badge", value)}
                />

                <Field
                  label="Main Title"
                  value={form.title}
                  onChange={(value) => updateField("title", value)}
                />

                <Field
                  label="Red Highlight Text"
                  value={form.highlightedText}
                  onChange={(value) => updateField("highlightedText", value)}
                />

                <TextArea
                  label="Description"
                  value={form.description}
                  onChange={(value) => updateField("description", value)}
                  rows={4}
                />
              </div>
            </EditorCard>

            <EditorCard icon={Layers} title="Categories" color={colors.green}>
              <div className="flex justify-end mb-5">
                <button
                  type="button"
                  onClick={addCategory}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>

              <div className="space-y-3">
                {categoryOptions.map((category, index) => (
                  <div
                    key={`${category}-${index}`}
                    className="grid grid-cols-[1fr_auto_auto] gap-3 items-center rounded-2xl p-3"
                    style={{
                      background:
                        selectedCategory === category
                          ? "rgba(22,138,58,0.08)"
                          : "rgba(15,23,42,0.04)",
                      border:
                        selectedCategory === category
                          ? "1px solid rgba(22,138,58,0.22)"
                          : "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <input
                      value={category}
                      onChange={(e) => updateCategory(index, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl outline-none text-sm font-semibold"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(75,46,131,0.16)",
                        color: colors.dark,
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className="px-4 py-3 rounded-xl text-sm font-bold"
                      style={{
                        background:
                          selectedCategory === category
                            ? colors.green
                            : "rgba(22,138,58,0.1)",
                        color:
                          selectedCategory === category ? "#FFFFFF" : colors.green,
                      }}
                    >
                      Select
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteCategory(category)}
                      className="p-3 rounded-xl"
                      style={{
                        background: "rgba(215,25,32,0.09)",
                        color: colors.red,
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                “All” is created automatically on the public gallery page. Here
                you only manage real categories. Select one category before
                uploading images.
              </p>
            </EditorCard>

            <EditorCard
              icon={ImageIcon}
              title={`Images in ${selectedCategory}`}
              color={colors.red}
            >
              <div
                className="rounded-3xl p-5 mb-6"
                style={{
                  background: "rgba(15,23,42,0.04)",
                  border: "1px solid rgba(15,23,42,0.08)",
                }}
              >
                <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">
                      Selected Category
                    </label>

                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
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
                      Upload one or many images. All selected images will go
                      inside <b>{selectedCategory}</b>.
                    </p>
                  </div>

                  <label
                    className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image(s)
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        handleCategoryImageUpload(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="font-black text-slate-950">
                    {selectedCategory} Gallery
                  </div>
                  <div className="text-sm text-slate-500">
                    {selectedCategoryImages.length} total image
                    {selectedCategoryImages.length === 1 ? "" : "s"} ·{" "}
                    {visibleSelectedCount} visible
                  </div>
                </div>
              </div>

              {selectedCategoryImages.length === 0 ? (
                <div
                  className="rounded-3xl p-10 text-center"
                  style={{
                    background: "rgba(15,23,42,0.04)",
                    border: "1px dashed rgba(15,23,42,0.18)",
                  }}
                >
                  <ImageIcon className="w-14 h-14 mx-auto text-slate-300 mb-4" />
                  <div className="font-black text-slate-900">
                    No images in {selectedCategory}.
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Click Upload Image(s) and select one or multiple images.
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {selectedCategoryImages.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-3xl p-5"
                      style={{
                        background: "rgba(15,23,42,0.04)",
                        border: "1px solid rgba(15,23,42,0.08)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <div className="font-black text-slate-950">
                            {item.title || "Untitled Image"}
                          </div>
                          <div className="text-sm text-slate-500">
                            {item.category} · {item.date}
                          </div>
                        </div>

                        <VisibilityDeleteControls
                          visible={item.visible}
                          onToggle={() =>
                            updateImage(item.id, "visible", !item.visible)
                          }
                          onDelete={() => deleteImage(item.id)}
                        />
                      </div>

                      <div className="grid md:grid-cols-[220px_1fr] gap-5">
                        <div>
                          <div
                            className="w-full h-44 rounded-2xl overflow-hidden bg-slate-100 border flex items-center justify-center"
                            style={{
                              borderColor: "rgba(15,23,42,0.08)",
                            }}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
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
                              onChange={(e) => {
                                handleReplaceImage(
                                  item.id,
                                  e.target.files?.[0]
                                );
                                e.target.value = "";
                              }}
                            />
                          </label>

                          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            Recommended size: 1200 × 800 px. Maximum size: 3 MB.
                            Use JPG, PNG, or WEBP.
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
                                updateImage(
                                  item.id,
                                  "category",
                                  e.target.value
                                )
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
                            placeholder="Annual Program"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </EditorCard>

            <EditorCard
              icon={Sparkles}
              title="Bottom Info Card"
              color={colors.green}
            >
              <div className="grid gap-5">
                <Field
                  label="Bottom Title"
                  value={form.bottomTitle}
                  onChange={(value) => updateField("bottomTitle", value)}
                />

                <TextArea
                  label="Bottom Description"
                  value={form.bottomDescription}
                  onChange={(value) => updateField("bottomDescription", value)}
                  rows={3}
                />

                <Field
                  label="Bottom Note"
                  value={form.bottomNote}
                  onChange={(value) => updateField("bottomNote", value)}
                />
              </div>
            </EditorCard>
          </div>

          <aside
            className="rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.94))",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 22px 58px rgba(11,16,32,0.25)",
            }}
          >
            <div className="p-5 border-b border-white/10">
              <div className="text-white font-bold text-lg flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Gallery Page Preview
              </div>

              <div className="text-sm text-white/55">
                Full preview updates while editing.
              </div>
            </div>

            <div className="bg-white">
              <GalleryPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}