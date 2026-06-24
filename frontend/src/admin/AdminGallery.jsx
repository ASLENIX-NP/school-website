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
  Sparkles,
  Upload,
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

const DEFAULT_GALLERY_CATEGORIES = ["Classroom", "Events", "Certificate"];
const SUBCATEGORY_PARENT_CATEGORIES = ["Events", "Certificate"];

const fallbackCategoryDescriptions = {
  Classroom:
    "Classroom moments show students learning, discussing, writing, presenting, and growing through daily academic activities.",
  Events:
    "School events highlight celebrations, programs, competitions, cultural activities, student participation, and community moments.",
  Certificate:
    "Certificates and awards recognize student achievement, participation, discipline, excellence, and school accomplishments.",
};

const fallbackSubcategories = {
  Events: [
    {
      id: "annual-program",
      name: "Annual Program",
      description:
        "Photos from annual programs, performances, celebrations, and school-wide events.",
      visible: true,
    },
    {
      id: "sports-events",
      name: "Sports Events",
      description:
        "Photos from sports competitions, games, student teamwork, and athletic participation.",
      visible: true,
    },
  ],
  Certificate: [
    {
      id: "student-certificates",
      name: "Student Certificates",
      description:
        "Certificates awarded to students for academic, creative, sports, and extracurricular achievements.",
      visible: true,
    },
    {
      id: "school-awards",
      name: "School Awards",
      description:
        "Awards and recognitions received by the school, staff, and student groups.",
      visible: true,
    },
  ],
};

const defaultGalleryContent = {
  badge: "Gallery",
  title: "School in Action",
  highlightedText: "in Action",
  description:
    "Explore classroom learning, school events, certificates, achievements, and student life at Baljagriti Secondary English School.",

  categories: DEFAULT_GALLERY_CATEGORIES,
  categoryDescriptions: fallbackCategoryDescriptions,
  subcategories: fallbackSubcategories,

  images: [],

  bottomTitle: "School Memories",
  bottomDescription:
    "Gallery images are updated by the school administration to highlight student life and school activities.",
  bottomNote: "Click image to preview",
};

function normalizeCategories(categories = []) {
  const cleaned = (Array.isArray(categories) ? categories : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item) => item.toLowerCase() !== "all");

  const combined = [...DEFAULT_GALLERY_CATEGORIES, ...cleaned];

  return Array.from(new Set(combined));
}

function normalizeImageCategory(category, categories = []) {
  const clean = String(category || "").trim();
  const validCategories = normalizeCategories(categories);

  if (validCategories.includes(clean)) {
    return clean;
  }

  const legacyMap = {
    Sports: "Events",
    ECA: "Events",
    Facilities: "Classroom",
  };

  return legacyMap[clean] || "Classroom";
}

function normalizeCategoryDescriptions(descriptions = {}, categories = []) {
  return normalizeCategories(categories).reduce((acc, category) => {
    acc[category] =
      descriptions?.[category] || fallbackCategoryDescriptions[category] || "";
    return acc;
  }, {});
}

function normalizeSubcategories(subcategories = {}) {
  return SUBCATEGORY_PARENT_CATEGORIES.reduce((acc, category) => {
    const source = Array.isArray(subcategories?.[category])
      ? subcategories[category]
      : fallbackSubcategories[category];

    acc[category] = source
      .map((item, index) => {
        const name =
          typeof item === "string" ? item : String(item?.name || "").trim();

        if (!name) return null;

        return {
          id:
            item?.id ||
            `${category.toLowerCase()}-${index}-${name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`,
          name,
          description:
            typeof item === "string"
              ? ""
              : item?.description ||
                `Photos and memories from ${name.toLowerCase()}.`,
          visible: item?.visible !== false,
        };
      })
      .filter(Boolean);

    return acc;
  }, {});
}

function mergeGalleryContent(saved = {}) {
  const categories = normalizeCategories(saved.categories);

  const categoryDescriptions = normalizeCategoryDescriptions(
    saved.categoryDescriptions,
    categories
  );

  const subcategories = normalizeSubcategories(saved.subcategories);

  return {
    ...defaultGalleryContent,
    ...saved,
    categories,
    categoryDescriptions,
    subcategories,
    images: Array.isArray(saved.images)
      ? saved.images.map((image) => ({
          ...image,
          category: normalizeImageCategory(image.category, categories),
          subcategory: image.subcategory || "",
          images:
            Array.isArray(image.images) && image.images.length > 0
              ? image.images
              : image.image
              ? [image.image]
              : [],
        }))
      : [],
  };
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
function DeferredField({ label, value, onCommit, placeholder = "" }) {
  const [draft, setDraft] = useState(value || "");

  useEffect(() => {
    setDraft(value || "");
  }, [value]);

  const commitValue = () => {
    const cleanValue = draft.trim();

    if (!cleanValue) {
      setDraft(value || "");
      return;
    }

    if (cleanValue !== value) {
      onCommit(cleanValue);
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitValue}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }

          if (e.key === "Escape") {
            setDraft(value || "");
            e.currentTarget.blur();
          }
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />

      <p className="text-[11px] text-slate-400 mt-1">
        Press Enter or click outside to apply.
      </p>
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

function GalleryPreview({ form }) {
  const categories = normalizeCategories(form.categories);
  const visibleImages = [];

  const categoryDescriptions = normalizeCategoryDescriptions(
    form.categoryDescriptions,
    categories
  );

  const subcategories = normalizeSubcategories(form.subcategories);

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
            border: "1px solid rgba(75,46,131,0.16)",
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

        {categories.map((category) => (
          <span
            key={category}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white border text-slate-700"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="grid gap-4 mb-8">
        {categories.map((category) => (
          <div
            key={category}
            className="rounded-3xl p-5"
            style={{
              background: "rgba(255,255,255,0.78)",
              border: "1px solid rgba(15,23,42,0.08)",
            }}
          >
            <div className="font-black text-slate-950">{category}</div>

            <div className="text-sm text-slate-500 mt-2 leading-relaxed">
              {categoryDescriptions[category] ||
                "Add a description for this category."}
            </div>

            {SUBCATEGORY_PARENT_CATEGORIES.includes(category) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {(subcategories[category] || []).map((sub) => (
                  <span
                    key={sub.id}
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background:
                        sub.visible !== false
                          ? "rgba(22,138,58,0.09)"
                          : "rgba(100,116,139,0.12)",
                      color:
                        sub.visible !== false ? colors.green : "#64748B",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {visibleImages.slice(0, 5).map((item) => {
          const displayImage = item.image || item.images?.[0];

          return (
            <div key={item.id}>
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={item.title}
                  className="w-full h-52 object-cover rounded-3xl"
                  style={{ boxShadow: "0 12px 32px rgba(15,23,42,0.12)" }}
                />
              ) : (
                <div className="w-full h-52 rounded-3xl bg-slate-200 flex items-center justify-center">
                  <ImageIcon className="w-14 h-14 text-slate-400" />
                </div>
              )}

              <div className="mt-3 px-1">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                  {item.category}
                  {item.subcategory ? ` / ${item.subcategory}` : ""}
                </div>

                <div className="font-black text-slate-950 mt-0.5">
                  {item.title}
                </div>

                <div className="text-xs text-slate-400 mt-0.5">
                  {item.date}
                </div>

                <button
                  type="button"
                  className="mt-2 px-4 py-1.5 rounded-xl text-xs font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  View Album ({(item.images || []).length})
                </button>
              </div>
            </div>
          );
        })}

        {visibleImages.length === 0 && (
          <div className="rounded-3xl p-8 text-center bg-white border border-slate-100">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <div className="font-black text-slate-900">
              No gallery images yet
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Upload images from Gallery Image Manager.
            </div>
          </div>
        )}
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

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
  let alive = true;

  const loadGalleryContent = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
  "http://localhost:5000/api/site-content/gallery",
  {
    timeout: 20000,
  }
);

      if (!alive) return;

      const savedContent = res.data?.data?.content || {};
      const mergedContent = mergeGalleryContent(savedContent);

      setForm(mergedContent);
      setError("");
    } catch (err) {
      console.error("Load gallery content error:", err);

      if (!alive) return;

      setForm(defaultGalleryContent);
      setError(
        "Gallery content took too long to load. Default editor is shown. Check backend if saved content is missing."
      );
    } finally {
      if (alive) {
        setLoading(false);
      }
    }
  };

  loadGalleryContent();

  return () => {
    alive = false;
  };
}, []);

  const categoryOptions = normalizeCategories(form.categories);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateCategoryDescription = (category, value) => {
    setForm((prev) => ({
      ...prev,
      categoryDescriptions: {
        ...(prev.categoryDescriptions || {}),
        [category]: value,
      },
    }));
  };

  const getSubcategories = (category) => {
    return normalizeSubcategories(form.subcategories)[category] || [];
  };

  const updateSubcategory = (parentCategory, subcategoryId, field, value) => {
    setForm((prev) => {
      const normalized = normalizeSubcategories(prev.subcategories);
      const currentList = normalized[parentCategory] || [];
      const oldItem = currentList.find((item) => item.id === subcategoryId);

      const updatedList = currentList.map((item) =>
        item.id === subcategoryId ? { ...item, [field]: value } : item
      );

      const updatedImages =
        field === "name" && oldItem
          ? prev.images.map((image) =>
              image.category === parentCategory &&
              image.subcategory === oldItem.name
                ? { ...image, subcategory: value }
                : image
            )
          : prev.images;

      return {
        ...prev,
        subcategories: {
          ...normalized,
          [parentCategory]: updatedList,
        },
        images: updatedImages,
      };
    });
  };

  const addSubcategory = (parentCategory) => {
    setForm((prev) => {
      const normalized = normalizeSubcategories(prev.subcategories);
      const currentList = normalized[parentCategory] || [];

      const newItem = {
        id: `${parentCategory.toLowerCase()}-${Date.now()}`,
        name: `New ${parentCategory} Subcategory`,
        description: "",
        visible: true,
      };

      return {
        ...prev,
        subcategories: {
          ...normalized,
          [parentCategory]: [...currentList, newItem],
        },
      };
    });
  };

  const deleteSubcategory = (parentCategory, subcategoryId) => {
    const ok = window.confirm("Delete this subcategory?");
    if (!ok) return;

    setForm((prev) => {
      const normalized = normalizeSubcategories(prev.subcategories);
      const deletedItem = (normalized[parentCategory] || []).find(
        (item) => item.id === subcategoryId
      );

      const remaining = (normalized[parentCategory] || []).filter(
        (item) => item.id !== subcategoryId
      );

      return {
        ...prev,
        subcategories: {
          ...normalized,
          [parentCategory]: remaining,
        },
        images: prev.images.map((image) =>
          image.category === parentCategory &&
          image.subcategory === deletedItem?.name
            ? { ...image, subcategory: "" }
            : image
        ),
      };
    });
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

      return {
        ...prev,
        categories: [...categories, newName],
        categoryDescriptions: {
          ...(prev.categoryDescriptions || {}),
          [newName]: "",
        },
      };
    });
  };

  const updateCategoryName = (index, oldCategory, newValue) => {
    const cleanValue = newValue.trimStart();

    if (!cleanValue) return;

    setForm((prev) => {
      const categories = normalizeCategories(prev.categories);

      if (DEFAULT_GALLERY_CATEGORIES.includes(oldCategory)) {
        return prev;
      }

      const updatedCategories = categories.map((category, categoryIndex) =>
        categoryIndex === index ? cleanValue : category
      );

      const oldDescription = prev.categoryDescriptions?.[oldCategory] || "";

      const nextDescriptions = {
        ...(prev.categoryDescriptions || {}),
        [cleanValue]: oldDescription,
      };

      delete nextDescriptions[oldCategory];

      return {
        ...prev,
        categories: Array.from(new Set(updatedCategories)),
        categoryDescriptions: nextDescriptions,
        images: prev.images.map((image) =>
          image.category === oldCategory
            ? { ...image, category: cleanValue, subcategory: "" }
            : image
        ),
      };
    });
  };

  const deleteCategory = (categoryToDelete) => {
    if (DEFAULT_GALLERY_CATEGORIES.includes(categoryToDelete)) {
      setError("Default categories cannot be deleted.");
      return;
    }

    const ok = window.confirm(`Delete category "${categoryToDelete}"?`);
    if (!ok) return;

    setForm((prev) => {
      const categories = normalizeCategories(prev.categories).filter(
        (category) => category !== categoryToDelete
      );

      const nextDescriptions = {
        ...(prev.categoryDescriptions || {}),
      };

      delete nextDescriptions[categoryToDelete];

      return {
        ...prev,
        categories,
        categoryDescriptions: nextDescriptions,
        images: prev.images.map((image) =>
          image.category === categoryToDelete
            ? { ...image, category: "Classroom", subcategory: "" }
            : image
        ),
      };
    });
  };

  async function saveGalleryContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      const cleanedCategories = normalizeCategories(form.categories);
      const cleanedDescriptions = normalizeCategoryDescriptions(
        form.categoryDescriptions,
        cleanedCategories
      );
      const cleanedSubcategories = normalizeSubcategories(form.subcategories);

      const cleanedImages = form.images.map((image) => {
        const category = normalizeImageCategory(image.category, cleanedCategories);
        const subcategoryOptions = cleanedSubcategories[category] || [];

        const validSubcategory = subcategoryOptions.some(
          (item) => item.name === image.subcategory
        );

        return {
          ...image,
          category,
          subcategory:
            subcategoryOptions.length > 0
              ? validSubcategory
                ? image.subcategory
                : subcategoryOptions[0]?.name || ""
              : "",
          images:
            Array.isArray(image.images) && image.images.length > 0
              ? image.images
              : image.image
              ? [image.image]
              : [],
        };
      });

      const cleanedForm = {
        ...form,
        categories: cleanedCategories,
        categoryDescriptions: cleanedDescriptions,
        subcategories: cleanedSubcategories,
        images: cleanedImages,
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Save gallery content error:", err);

      setError(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          "Could not save gallery content."
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
            Edit the gallery heading, main categories, category descriptions,
            Events subcategories, Certificate subcategories, and bottom
            information.
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
            <button
              type="button"
              onClick={() => navigate("/admin/gallery-images")}
              className="w-full rounded-[32px] p-7 text-left transition-all hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${colors.dark}, ${colors.purple})`,
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 24px 70px rgba(11,16,32,0.18)",
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white font-bold mb-4">
                    <Upload className="w-4 h-4" />
                    Upload / Remove Images
                  </div>

                  <h2
                    className="text-3xl font-black text-white"
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Manage Gallery Images
                  </h2>

                  <p className="text-white/65 mt-2 max-w-xl">
                    Upload images and assign them to categories. Events and
                    Certificate images can also be assigned to subcategories.
                  </p>
                </div>

                <div
                  className="px-6 py-4 rounded-2xl font-black"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                    color: colors.dark,
                  }}
                >
                  Open Image Manager
                </div>
              </div>
            </button>

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

            <EditorCard
              icon={Layers}
              title="Main Categories, Descriptions & Subcategories"
              color={colors.green}
            >
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

              <div className="space-y-6">
                {categoryOptions.map((category, index) => (
                  <div
                    key={`category-${index}`}
                    className="rounded-3xl p-5"
                    style={{
                      background: "rgba(15,23,42,0.035)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        {DEFAULT_GALLERY_CATEGORIES.includes(category) ? (
                          <h3 className="text-xl font-black text-slate-950">
                            {category}
                          </h3>
                        ) : (
                          <DeferredField
  label="Category Name"
  value={category}
  onCommit={(value) =>
    updateCategoryName(index, category, value)
  }
/>
                        )}

                        <p className="text-xs text-slate-500 mt-2">
                          This description appears in the public Gallery page.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="px-4 py-2 rounded-2xl text-xs font-black"
                          style={{
                            background: "rgba(22,138,58,0.09)",
                            color: colors.green,
                            border: "1px solid rgba(22,138,58,0.16)",
                          }}
                        >
                          Main Category
                        </span>

                        {!DEFAULT_GALLERY_CATEGORIES.includes(category) && (
                          <button
                            type="button"
                            onClick={() => deleteCategory(category)}
                            className="px-4 py-2 rounded-2xl text-xs font-black"
                            style={{
                              background: "rgba(215,25,32,0.09)",
                              color: colors.red,
                              border: "1px solid rgba(215,25,32,0.18)",
                            }}
                          >
                            Delete Category
                          </button>
                        )}
                      </div>
                    </div>

                    <TextArea
                      label={`${category} Description`}
                      value={
                        form.categoryDescriptions?.[category] ||
                        fallbackCategoryDescriptions[category] ||
                        ""
                      }
                      onChange={(value) =>
                        updateCategoryDescription(category, value)
                      }
                      rows={3}
                    />

                    {SUBCATEGORY_PARENT_CATEGORIES.includes(category) && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div>
                            <h4 className="font-black text-slate-900">
                              {category} Subcategories
                            </h4>

                            <p className="text-xs text-slate-500 mt-1">
                              These appear when users open the {category} tab.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => addSubcategory(category)}
                            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white"
                            style={{
                              background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                            }}
                          >
                            <Plus className="w-4 h-4" />
                            Add Subcategory
                          </button>
                        </div>

                        <div className="space-y-4">
                          {getSubcategories(category).map((sub) => (
                            <div
                              key={sub.id}
                              className="rounded-2xl p-4"
                              style={{
                                background: "rgba(255,255,255,0.82)",
                                border: "1px solid rgba(75,46,131,0.12)",
                              }}
                            >
                              <div className="grid gap-4">
                                <DeferredField
  label="Subcategory Name"
  value={sub.name}
  onCommit={(value) =>
    updateSubcategory(
      category,
      sub.id,
      "name",
      value
    )
  }
/>

                                <TextArea
                                  label="Subcategory Description"
                                  value={sub.description}
                                  onChange={(value) =>
                                    updateSubcategory(
                                      category,
                                      sub.id,
                                      "description",
                                      value
                                    )
                                  }
                                  rows={3}
                                />

                                <div className="flex flex-wrap items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSubcategory(
                                        category,
                                        sub.id,
                                        "visible",
                                        !sub.visible
                                      )
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold"
                                    style={{
                                      background:
                                        sub.visible !== false
                                          ? "rgba(22,138,58,0.1)"
                                          : "rgba(100,116,139,0.12)",
                                      color:
                                        sub.visible !== false
                                          ? colors.green
                                          : "#64748B",
                                    }}
                                  >
                                    {sub.visible !== false ? (
                                      <>
                                        <Eye className="w-4 h-4" />
                                        Visible
                                      </>
                                    ) : (
                                      <>
                                        <EyeOff className="w-4 h-4" />
                                        Hidden
                                      </>
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteSubcategory(category, sub.id)
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold"
                                    style={{
                                      background: "rgba(215,25,32,0.09)",
                                      color: colors.red,
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {getSubcategories(category).length === 0 && (
                            <div className="rounded-2xl p-5 text-sm font-semibold text-slate-500 bg-white/70 border border-slate-100">
                              No subcategories added yet.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 mt-5 leading-relaxed">
                Classroom, Events, and Certificate are default categories.
                You can add more categories. Only Events and Certificate have
                subcategories.
              </p>
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