import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  Link as LinkIcon,
  Pencil,
  Save,
  UploadCloud,
  X,
} from "lucide-react";

import { Hero, defaultHeroData, mergeHeroData } from "../app/components/Hero";
import {
  Stats,
  defaultStatsSectionData,
  mergeStatsSectionData,
} from "../app/components/Stats";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultHomeContent = {
  hero: defaultHeroData,
  statsSection: defaultStatsSectionData,
};

function mergeHomeContent(saved = {}) {
  return {
    ...defaultHomeContent,
    ...(saved || {}),
    hero: mergeHeroData(saved?.hero || {}),
    statsSection: mergeStatsSectionData(saved?.statsSection || {}),
  };
}

function Field({ label, value, onChange, placeholder = "", textarea = false }) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
          }}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
          }}
        />
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left"
      style={{
        background: checked
          ? "rgba(22,138,58,0.08)"
          : "rgba(100,116,139,0.08)",
        border: checked
          ? "1px solid rgba(22,138,58,0.18)"
          : "1px solid rgba(100,116,139,0.18)",
      }}
    >
      <span className="text-sm font-black text-slate-700">{label}</span>

      <span
        className="relative w-12 h-7 rounded-full transition-all"
        style={{
          background: checked ? colors.green : "#CBD5E1",
        }}
      >
        <span
          className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow"
          style={{
            left: checked ? "24px" : "4px",
          }}
        />
      </span>
    </button>
  );
}

function getUploadUrl(payload) {
  return (
    payload?.url ||
    payload?.imageUrl ||
    payload?.fileUrl ||
    payload?.data?.url ||
    payload?.data?.imageUrl ||
    payload?.data?.fileUrl ||
    payload?.data?.secure_url ||
    payload?.file?.url ||
    ""
  );
}

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");

  if (!token) return null;

  return {
    Authorization: `Bearer ${token}`,
  };
}

export default function AdminHome() {
  const [form, setForm] = useState(defaultHomeContent);
  const [loading, setLoading] = useState(true);
  const [editingTarget, setEditingTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/home");
        const savedContent = res.data?.data?.content || {};
        setForm(mergeHomeContent(savedContent));
      } catch (err) {
        console.error("Load home content error:", err);
        setError("Could not load saved home content. Default content shown.");
      } finally {
        setLoading(false);
      }
    };

    loadHomeContent();
  }, []);

  const heroFloatingMap = [
    ["floating1Title", "floating1Subtitle"],
    ["floating2Title", "floating2Subtitle"],
    ["floating3Title", "floating3Subtitle"],
    ["floating4Title", "floating4Subtitle"],
  ];

  const openEditor = (target) => {
    setSuccess("");
    setError("");
    setEditingTarget(target);

    if (target.type === "heroBadge") {
      setModalForm({ badge: form.hero.badge || "" });
      return;
    }

    if (target.type === "heroTitle") {
      setModalForm({
        titleLine1: form.hero.titleLine1 || "",
        titleLine2: form.hero.titleLine2 || "",
        titleLine3: form.hero.titleLine3 || "",
      });
      return;
    }

    if (target.type === "heroDescription") {
      setModalForm({
        description: form.hero.description || "",
      });
      return;
    }

    if (target.type === "heroButtons") {
      setModalForm({
        primaryButtonText: form.hero.primaryButtonText || "",
        primaryButtonLink: form.hero.primaryButtonLink || "/admissions",
        secondaryButtonText: form.hero.secondaryButtonText || "",
        secondaryButtonLink: form.hero.secondaryButtonLink || "/facilities",
      });
      return;
    }

    if (target.type === "heroImage") {
      setModalForm({
        image: form.hero.image || "",
      });
      return;
    }

    if (target.type === "heroImageText") {
      setModalForm({
        imageBottomTitle: form.hero.imageBottomTitle || "",
        imageBottomDescription: form.hero.imageBottomDescription || "",
      });
      return;
    }

    if (target.type === "heroStat") {
      const pairs = [
        ["stat1Value", "stat1Label"],
        ["stat2Value", "stat2Label"],
        ["stat3Value", "stat3Label"],
      ];

      const [valueKey, labelKey] = pairs[target.index];

      setModalForm({
        value: form.hero[valueKey] || "",
        label: form.hero[labelKey] || "",
      });
      return;
    }

    if (target.type === "heroFloating") {
      const [titleKey, subtitleKey] = heroFloatingMap[target.index];

      setModalForm({
        title: form.hero[titleKey] || "",
        subtitle: form.hero[subtitleKey] || "",
      });
      return;
    }

    if (target.type === "statsHeader") {
      setModalForm({
        eyebrow: form.statsSection.eyebrow || "",
        title: form.statsSection.title || "",
        description: form.statsSection.description || "",
      });
      return;
    }

    if (target.type === "statsCard") {
      const stat = form.statsSection.stats[target.index];

      setModalForm({
        value: stat?.value || "",
        suffix: stat?.suffix || "",
        label: stat?.label || "",
        note: stat?.note || "",
      });
      return;
    }

    if (target.type === "storyImage") {
      setModalForm({
        image: form.statsSection.story.image || "",
      });
      return;
    }

    if (target.type === "storyImageText") {
      setModalForm({
        imageTopTitle: form.statsSection.story.imageTopTitle || "",
        imageTopSubtitle: form.statsSection.story.imageTopSubtitle || "",
        imageBottomTitle: form.statsSection.story.imageBottomTitle || "",
        imageBottomDescription:
          form.statsSection.story.imageBottomDescription || "",
      });
      return;
    }

    if (target.type === "storyText") {
      setModalForm({
        badge: form.statsSection.story.badge || "",
        title: form.statsSection.story.title || "",
        paragraph1: form.statsSection.story.paragraphs?.[0] || "",
        paragraph2: form.statsSection.story.paragraphs?.[1] || "",
      });
      return;
    }

    if (target.type === "storyButton") {
      setModalForm({
        buttonText: form.statsSection.story.buttonText || "",
        buttonLink: form.statsSection.story.buttonLink || "/about",
      });
      return;
    }

    if (target.type === "excellenceHeader") {
      setModalForm({
        title: form.statsSection.excellence.title || "",
        description: form.statsSection.excellence.description || "",
      });
      return;
    }

    if (target.type === "excellenceCard") {
      const card = form.statsSection.excellence.cards[target.index];

      setModalForm({
        title: card?.title || "",
        description: card?.description || "",
      });
    }
  };

  const closeEditor = () => {
    if (saving || uploadingImage) return;
    setEditingTarget(null);
    setModalForm({});
  };

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImage = async (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 6 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > maxSize) {
      setError("Image must be less than 6 MB.");
      return;
    }

    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return;
    }

    setSuccess("");
    setError("");
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          ...authHeaders,
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedUrl = getUploadUrl(res.data);

      if (!uploadedUrl) {
        setError("Image uploaded but backend did not return image URL.");
        return;
      }

      updateModalField("image", uploadedUrl);
      setSuccess("Image uploaded. Click Save to publish this selected item.");
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return;
    }

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeHomeContent(form);

      if (editingTarget.type === "heroBadge") {
        nextForm.hero = {
          ...nextForm.hero,
          badge: modalForm.badge || "",
        };
      }

      if (editingTarget.type === "heroTitle") {
        nextForm.hero = {
          ...nextForm.hero,
          titleLine1: modalForm.titleLine1 || "",
          titleLine2: modalForm.titleLine2 || "",
          titleLine3: modalForm.titleLine3 || "",
        };
      }

      if (editingTarget.type === "heroDescription") {
        nextForm.hero = {
          ...nextForm.hero,
          description: modalForm.description || "",
        };
      }

      if (editingTarget.type === "heroButtons") {
        nextForm.hero = {
          ...nextForm.hero,
          primaryButtonText: modalForm.primaryButtonText || "",
          primaryButtonLink: modalForm.primaryButtonLink || "/admissions",
          secondaryButtonText: modalForm.secondaryButtonText || "",
          secondaryButtonLink: modalForm.secondaryButtonLink || "/facilities",
        };
      }

      if (editingTarget.type === "heroImage") {
        nextForm.hero = {
          ...nextForm.hero,
          image: modalForm.image || "",
        };
      }

      if (editingTarget.type === "heroImageText") {
        nextForm.hero = {
          ...nextForm.hero,
          imageBottomTitle: modalForm.imageBottomTitle || "",
          imageBottomDescription: modalForm.imageBottomDescription || "",
        };
      }

      if (editingTarget.type === "heroStat") {
        const pairs = [
          ["stat1Value", "stat1Label"],
          ["stat2Value", "stat2Label"],
          ["stat3Value", "stat3Label"],
        ];

        const [valueKey, labelKey] = pairs[editingTarget.index];

        nextForm.hero = {
          ...nextForm.hero,
          [valueKey]: modalForm.value || "",
          [labelKey]: modalForm.label || "",
        };
      }

      if (editingTarget.type === "heroFloating") {
        const [titleKey, subtitleKey] = heroFloatingMap[editingTarget.index];

        nextForm.hero = {
          ...nextForm.hero,
          [titleKey]: modalForm.title || "",
          [subtitleKey]: modalForm.subtitle || "",
        };
      }

      if (editingTarget.type === "statsHeader") {
        nextForm.statsSection = {
          ...nextForm.statsSection,
          eyebrow: modalForm.eyebrow || "",
          title: modalForm.title || "",
          description: modalForm.description || "",
        };
      }

      if (editingTarget.type === "statsCard") {
        nextForm.statsSection = {
          ...nextForm.statsSection,
          stats: nextForm.statsSection.stats.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  value: modalForm.value || "",
                  suffix: modalForm.suffix || "",
                  label: modalForm.label || "",
                  note: modalForm.note || "",
                }
              : item
          ),
        };
      }

      if (editingTarget.type === "storyImage") {
        nextForm.statsSection = {
          ...nextForm.statsSection,
          story: {
            ...nextForm.statsSection.story,
            image: modalForm.image || "",
          },
        };
      }

      if (editingTarget.type === "storyImageText") {
        nextForm.statsSection = {
          ...nextForm.statsSection,
          story: {
            ...nextForm.statsSection.story,
            imageTopTitle: modalForm.imageTopTitle || "",
            imageTopSubtitle: modalForm.imageTopSubtitle || "",
            imageBottomTitle: modalForm.imageBottomTitle || "",
            imageBottomDescription: modalForm.imageBottomDescription || "",
          },
        };
      }

      if (editingTarget.type === "storyText") {
        nextForm.statsSection = {
          ...nextForm.statsSection,
          story: {
            ...nextForm.statsSection.story,
            badge: modalForm.badge || "",
            title: modalForm.title || "",
            paragraphs: [modalForm.paragraph1 || "", modalForm.paragraph2 || ""],
          },
        };
      }

      if (editingTarget.type === "storyButton") {
        nextForm.statsSection = {
          ...nextForm.statsSection,
          story: {
            ...nextForm.statsSection.story,
            buttonText: modalForm.buttonText || "",
            buttonLink: modalForm.buttonLink || "/about",
          },
        };
      }

      if (editingTarget.type === "excellenceHeader") {
        nextForm.statsSection = {
          ...nextForm.statsSection,
          excellence: {
            ...nextForm.statsSection.excellence,
            title: modalForm.title || "",
            description: modalForm.description || "",
          },
        };
      }

      if (editingTarget.type === "excellenceCard") {
        nextForm.statsSection = {
          ...nextForm.statsSection,
          excellence: {
            ...nextForm.statsSection.excellence,
            cards: nextForm.statsSection.excellence.cards.map((item, index) =>
              index === editingTarget.index
                ? {
                    ...item,
                    title: modalForm.title || "",
                    description: modalForm.description || "",
                  }
                : item
            ),
          },
        };
      }

      const cleanContent = mergeHomeContent(nextForm);

      await axios.put(
        "http://localhost:5000/api/site-content/home",
        {
          content: cleanContent,
        },
        {
          headers: authHeaders,
        }
      );

      setForm(cleanContent);
      setEditingTarget(null);
      setModalForm({});
      setSuccess("Selected homepage item saved successfully.");
    } catch (err) {
      console.error("Save selected home item error:", err);

      if (err.response?.status === 401) {
        setError("Admin login expired or token is invalid. Please login again.");
      } else {
        setError(err.response?.data?.message || "Could not save selected item.");
      }
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";

    const titles = {
      heroBadge: "Edit Hero Badge",
      heroTitle: "Edit Hero Title",
      heroDescription: "Edit Hero Description",
      heroButtons: "Edit Hero Buttons",
      heroImage: "Change Hero Image",
      heroImageText: "Edit Hero Image Text",
      heroStat: "Edit Hero Stat",
      heroFloating: "Edit Floating Label",
      statsHeader: "Edit School Highlights Heading",
      statsCard: "Edit Highlight Number Card",
      storyImage: "Change Story Image",
      storyImageText: "Edit Story Image Text",
      storyText: "Edit Story Text",
      storyButton: "Edit Story Button",
      excellenceHeader: "Edit Academic Excellence Heading",
      excellenceCard: "Edit Academic Excellence Card",
    };

    return titles[editingTarget.type] || "Edit Homepage";
  }, [editingTarget]);

  const ModalIcon = useMemo(() => {
    if (!editingTarget) return Pencil;
    if (editingTarget.type === "heroImage" || editingTarget.type === "storyImage") {
      return Camera;
    }
    if (
      editingTarget.type === "heroButtons" ||
      editingTarget.type === "storyButton" ||
      editingTarget.type === "heroFloating"
    ) {
      return LinkIcon;
    }
    return Pencil;
  }, [editingTarget]);

  const saveButtonText = useMemo(() => {
    if (!editingTarget) return "Save";

    if (editingTarget.type === "heroImage") return "Save Hero Image";
    if (editingTarget.type === "storyImage") return "Save Story Image";
    if (editingTarget.type === "heroTitle") return "Save Hero Title";
    if (editingTarget.type === "heroButtons") return "Save Buttons";
    if (editingTarget.type === "statsCard") return "Save Number Card";
    if (editingTarget.type === "excellenceCard") return "Save Card";

    return "Save This Item";
  }, [editingTarget]);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-slate-600 font-semibold">
          Loading visual home editor...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-5 md:p-6"
        style={{
          background:
            "linear-gradient(135deg, #E8EDF5 0%, #DCE3EF 50%, #E8E0F0 100%)",
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-sky-50 text-sky-700 border border-sky-100">
              <Eye className="w-3.5 h-3.5" />
              Visual Homepage Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit Homepage
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Hover over homepage content, click the pencil or camera icon, edit
              only that selected item, and save it.
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-green-50 text-green-700 border border-green-100">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-red-50 text-red-700 border border-red-100">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div
          className="rounded-[2rem] overflow-x-auto"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div className="min-w-[1180px] bg-white">
            <Hero
              editMode
              contentOverride={form.hero}
              onEditTarget={openEditor}
            />
            <Stats
              editMode
              contentOverride={form.statsSection}
              onEditTarget={openEditor}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 bg-white border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
            <Pencil className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-950">Text</div>
          <div className="text-sm text-slate-500 mt-1">
            Hover titles, descriptions, buttons, or cards.
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <Camera className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-950">Images</div>
          <div className="text-sm text-slate-500 mt-1">
            Hover hero image or story image and click camera icon.
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <Save className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-950">Specific Save</div>
          <div className="text-sm text-slate-500 mt-1">
            Each popup saves only the selected homepage item.
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editingTarget && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
            style={{
              background: "rgba(2,6,23,0.55)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditor}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="w-full max-w-xl rounded-[28px] overflow-hidden max-h-[92vh] overflow-y-auto"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 42px 110px rgba(0,0,0,0.28)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan}, ${colors.green})`,
                }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(56,189,248,0.18))",
                        color: colors.dark,
                      }}
                    >
                      <ModalIcon className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-950">
                        {modalTitle}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Save only this selected homepage item.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeEditor}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {(editingTarget.type === "heroImage" ||
                    editingTarget.type === "storyImage") && (
                    <>
                      <div
                        className="rounded-3xl p-5"
                        style={{
                          background:
                            "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,41,59,0.92))",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-28 h-24 rounded-2xl bg-white overflow-hidden flex items-center justify-center">
                            {modalForm.image ? (
                              <img
                                src={modalForm.image}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                            )}
                          </div>

                          <div>
                            <div className="text-white font-black">
                              Image Preview
                            </div>
                            <div className="text-white/55 text-sm mt-1 leading-relaxed">
                              Recommended: JPG/PNG/WebP, max 6 MB.
                            </div>
                          </div>
                        </div>

                        <label
                          className="mt-5 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black cursor-pointer"
                          style={{
                            background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                            color: colors.dark,
                          }}
                        >
                          <UploadCloud className="w-4 h-4" />
                          {uploadingImage ? "Uploading..." : "Upload New Image"}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage}
                            onChange={(e) => {
                              uploadImage(e.target.files?.[0]);
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <Field
                        label="Image URL"
                        value={modalForm.image}
                        onChange={(value) => updateModalField("image", value)}
                        placeholder="Image URL appears here after upload"
                      />
                    </>
                  )}

                  {editingTarget.type === "heroBadge" && (
                    <Field
                      label="Badge Text"
                      value={modalForm.badge}
                      onChange={(value) => updateModalField("badge", value)}
                      placeholder="Admissions Open..."
                    />
                  )}

                  {editingTarget.type === "heroTitle" && (
                    <>
                      <Field
                        label="Title Line 1"
                        value={modalForm.titleLine1}
                        onChange={(value) =>
                          updateModalField("titleLine1", value)
                        }
                      />

                      <Field
                        label="Title Line 2"
                        value={modalForm.titleLine2}
                        onChange={(value) =>
                          updateModalField("titleLine2", value)
                        }
                      />

                      <Field
                        label="Title Line 3"
                        value={modalForm.titleLine3}
                        onChange={(value) =>
                          updateModalField("titleLine3", value)
                        }
                      />
                    </>
                  )}

                  {editingTarget.type === "heroDescription" && (
                    <Field
                      label="Hero Description"
                      value={modalForm.description}
                      onChange={(value) =>
                        updateModalField("description", value)
                      }
                      textarea
                    />
                  )}

                  {editingTarget.type === "heroButtons" && (
                    <>
                      <Field
                        label="Primary Button Text"
                        value={modalForm.primaryButtonText}
                        onChange={(value) =>
                          updateModalField("primaryButtonText", value)
                        }
                      />

                      <Field
                        label="Primary Button Link"
                        value={modalForm.primaryButtonLink}
                        onChange={(value) =>
                          updateModalField("primaryButtonLink", value)
                        }
                        placeholder="/admissions"
                      />

                      <Field
                        label="Secondary Button Text"
                        value={modalForm.secondaryButtonText}
                        onChange={(value) =>
                          updateModalField("secondaryButtonText", value)
                        }
                      />

                      <Field
                        label="Secondary Button Link"
                        value={modalForm.secondaryButtonLink}
                        onChange={(value) =>
                          updateModalField("secondaryButtonLink", value)
                        }
                        placeholder="/facilities"
                      />
                    </>
                  )}

                  {editingTarget.type === "heroStat" && (
                    <>
                      <Field
                        label="Stat Value"
                        value={modalForm.value}
                        onChange={(value) => updateModalField("value", value)}
                      />

                      <Field
                        label="Stat Label"
                        value={modalForm.label}
                        onChange={(value) => updateModalField("label", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "heroImageText" && (
                    <>
                      <Field
                        label="Image Bottom Title"
                        value={modalForm.imageBottomTitle}
                        onChange={(value) =>
                          updateModalField("imageBottomTitle", value)
                        }
                      />

                      <Field
                        label="Image Bottom Description"
                        value={modalForm.imageBottomDescription}
                        onChange={(value) =>
                          updateModalField("imageBottomDescription", value)
                        }
                        textarea
                      />
                    </>
                  )}

                  {editingTarget.type === "heroFloating" && (
                    <>
                      <Field
                        label="Floating Label Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Floating Label Subtitle"
                        value={modalForm.subtitle}
                        onChange={(value) =>
                          updateModalField("subtitle", value)
                        }
                      />
                    </>
                  )}

                  {editingTarget.type === "statsHeader" && (
                    <>
                      <Field
                        label="Eyebrow"
                        value={modalForm.eyebrow}
                        onChange={(value) => updateModalField("eyebrow", value)}
                      />

                      <Field
                        label="Section Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Section Description"
                        value={modalForm.description}
                        onChange={(value) =>
                          updateModalField("description", value)
                        }
                        textarea
                      />
                    </>
                  )}

                  {editingTarget.type === "statsCard" && (
                    <>
                      <Field
                        label="Number Value"
                        value={modalForm.value}
                        onChange={(value) => updateModalField("value", value)}
                      />

                      <Field
                        label="Suffix"
                        value={modalForm.suffix}
                        onChange={(value) => updateModalField("suffix", value)}
                        placeholder="+ / % / yrs"
                      />

                      <Field
                        label="Label"
                        value={modalForm.label}
                        onChange={(value) => updateModalField("label", value)}
                      />

                      <Field
                        label="Small Note"
                        value={modalForm.note}
                        onChange={(value) => updateModalField("note", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "storyImageText" && (
                    <>
                      <Field
                        label="Image Top Title"
                        value={modalForm.imageTopTitle}
                        onChange={(value) =>
                          updateModalField("imageTopTitle", value)
                        }
                      />

                      <Field
                        label="Image Top Subtitle"
                        value={modalForm.imageTopSubtitle}
                        onChange={(value) =>
                          updateModalField("imageTopSubtitle", value)
                        }
                      />

                      <Field
                        label="Image Bottom Title"
                        value={modalForm.imageBottomTitle}
                        onChange={(value) =>
                          updateModalField("imageBottomTitle", value)
                        }
                      />

                      <Field
                        label="Image Bottom Description"
                        value={modalForm.imageBottomDescription}
                        onChange={(value) =>
                          updateModalField("imageBottomDescription", value)
                        }
                        textarea
                      />
                    </>
                  )}

                  {editingTarget.type === "storyText" && (
                    <>
                      <Field
                        label="Story Badge"
                        value={modalForm.badge}
                        onChange={(value) => updateModalField("badge", value)}
                      />

                      <Field
                        label="Story Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Paragraph 1"
                        value={modalForm.paragraph1}
                        onChange={(value) =>
                          updateModalField("paragraph1", value)
                        }
                        textarea
                      />

                      <Field
                        label="Paragraph 2"
                        value={modalForm.paragraph2}
                        onChange={(value) =>
                          updateModalField("paragraph2", value)
                        }
                        textarea
                      />
                    </>
                  )}

                  {editingTarget.type === "storyButton" && (
                    <>
                      <Field
                        label="Button Text"
                        value={modalForm.buttonText}
                        onChange={(value) =>
                          updateModalField("buttonText", value)
                        }
                      />

                      <Field
                        label="Button Link"
                        value={modalForm.buttonLink}
                        onChange={(value) =>
                          updateModalField("buttonLink", value)
                        }
                        placeholder="/about"
                      />
                    </>
                  )}

                  {editingTarget.type === "excellenceHeader" && (
                    <>
                      <Field
                        label="Academic Excellence Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Academic Excellence Description"
                        value={modalForm.description}
                        onChange={(value) =>
                          updateModalField("description", value)
                        }
                        textarea
                      />
                    </>
                  )}

                  {editingTarget.type === "excellenceCard" && (
                    <>
                      <Field
                        label="Card Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Card Description"
                        value={modalForm.description}
                        onChange={(value) =>
                          updateModalField("description", value)
                        }
                        textarea
                      />
                    </>
                  )}
                </div>

                <div className="flex gap-3 mt-7">
                  <button
                    type="button"
                    onClick={closeEditor}
                    disabled={saving || uploadingImage}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60"
                    style={{
                      background: "rgba(15,23,42,0.06)",
                      color: "rgba(15,23,42,0.65)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveSelectedPart}
                    disabled={saving || uploadingImage}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                      color: "#020617",
                      boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
                    }}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : saveButtonText}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
