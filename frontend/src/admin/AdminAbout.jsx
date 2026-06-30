import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  BookOpen,
  Camera,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  MessageSquareText,
  Pencil,
  Save,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import {
  About,
  defaultAboutContent,
  mergeAboutContent,
} from "../app/components/About";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const cardColors = [
  "#4B2E83",
  "#168A3A",
  "#D71920",
  "#38BDF8",
  "#F97316",
  "#FACC15",
  "#14B8A6",
  "#8B5CF6",
];

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  textarea = false,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
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
          type={type}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
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

function getDeleteName(target) {
  if (!target) return "this item";

  if (target.type === "pillarCard") return "this core value card";
  if (target.type === "leadershipMessage") return "this leadership message";
  if (target.type === "missionVision") return "this mission / vision card";
  if (target.type === "journeyItem") return "this journey item";

  return "this item";
}

export default function AdminAbout() {
  const [form, setForm] = useState(defaultAboutContent);
  const [loading, setLoading] = useState(true);
  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/about");
        const savedContent = res.data?.data?.content || {};
        setForm(mergeAboutContent(savedContent));
      } catch (err) {
        console.error("Load about content error:", err);
        setError("Could not load saved about content. Default content shown.");
      } finally {
        setLoading(false);
      }
    };

    loadAboutContent();
  }, []);

  const openEditor = (target) => {
    setSuccess("");
    setError("");
    setEditingTarget(target);

    if (target.type === "pageHeader") {
      setModalForm({
        pageTitle: form.pageTitle || "",
        pageSubtitle: form.pageSubtitle || "",
      });
      return;
    }

    if (target.type === "storyText") {
      setModalForm({
        storyBadge: form.storyBadge || "",
        storyTitle: form.storyTitle || "",
        paragraph1: form.storyParagraphs?.[0] || "",
        paragraph2: form.storyParagraphs?.[1] || "",
      });
      return;
    }

    if (target.type === "storyImage") {
      setModalForm({
        storyImageUrl: form.storyImageUrl || "",
        storyImageAlt: form.storyImageAlt || "",
      });
      return;
    }

    if (target.type === "storyImageText") {
      setModalForm({
        storyImageTitle: form.storyImageTitle || "",
        storyImageSubtitle: form.storyImageSubtitle || "",
      });
      return;
    }

    if (target.type === "pillarHeader") {
      setModalForm({
        pillarBadge: form.pillarBadge || "",
        pillarTitle: form.pillarTitle || "",
      });
      return;
    }

    if (target.type === "pillarCard") {
      const item = form.pillars?.[target.index];

      setModalForm({
        label: item?.label || "",
        desc: item?.desc || "",
        color: item?.color || colors.green,
        visible: item?.visible !== false,
      });
      return;
    }

    if (target.type === "leadershipHeader") {
      setModalForm({
        leadershipBadge: form.leadershipBadge || "",
        leadershipTitle: form.leadershipTitle || "",
        leadershipDescription: form.leadershipDescription || "",
      });
      return;
    }

    if (target.type === "leadershipMessage") {
      const item = form.messages?.[target.index];

      setModalForm({
        name: item?.name || "",
        role: item?.role || "",
        title: item?.title || "",
        message: item?.message || "",
        image: item?.image || "",
        visible: item?.visible !== false,
      });
      return;
    }

    if (target.type === "leadershipPhoto") {
      const item = form.messages?.[target.index];

      setModalForm({
        image: item?.image || "",
      });
      return;
    }

    if (target.type === "missionVision") {
      const item = form.missionVision?.[target.index];

      setModalForm({
        title: item?.title || "",
        desc: item?.desc || "",
        color: item?.color || colors.purple,
        visible: item?.visible !== false,
      });
      return;
    }

    if (target.type === "journeyHeader") {
      setModalForm({
        timelineBadge: form.timelineBadge || "",
        journeyTitle: form.journeyTitle || "",
      });
      return;
    }

    if (target.type === "journeyItem") {
      const item = form.journey?.[target.index];

      setModalForm({
        year: item?.year || "",
        title: item?.title || "",
        desc: item?.desc || "",
        visible: item?.visible !== false,
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

      if (editingTarget?.type === "storyImage") {
        updateModalField("storyImageUrl", uploadedUrl);
      } else {
        updateModalField("image", uploadedUrl);
      }

      setSuccess("Image uploaded. Click Save to publish this selected item.");
    } catch (err) {
      console.error("About image upload error:", err);
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const saveContentToBackend = async (nextForm, message) => {
    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return false;
    }

    await axios.put(
      "http://localhost:5000/api/site-content/about",
      {
        content: nextForm,
      },
      {
        headers: authHeaders,
      }
    );

    setForm(nextForm);
    setSuccess(message || "About page updated successfully.");
    return true;
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeAboutContent(form);

      if (editingTarget.type === "pageHeader") {
        nextForm = {
          ...nextForm,
          pageTitle: modalForm.pageTitle || "",
          pageSubtitle: modalForm.pageSubtitle || "",
        };
      }

      if (editingTarget.type === "storyText") {
        nextForm = {
          ...nextForm,
          storyBadge: modalForm.storyBadge || "",
          storyTitle: modalForm.storyTitle || "",
          storyParagraphs: [
            modalForm.paragraph1 || "",
            modalForm.paragraph2 || "",
          ],
        };
      }

      if (editingTarget.type === "storyImage") {
        nextForm = {
          ...nextForm,
          storyImageUrl: modalForm.storyImageUrl || "",
          storyImageAlt: modalForm.storyImageAlt || "",
        };
      }

      if (editingTarget.type === "storyImageText") {
        nextForm = {
          ...nextForm,
          storyImageTitle: modalForm.storyImageTitle || "",
          storyImageSubtitle: modalForm.storyImageSubtitle || "",
        };
      }

      if (editingTarget.type === "pillarHeader") {
        nextForm = {
          ...nextForm,
          pillarBadge: modalForm.pillarBadge || "",
          pillarTitle: modalForm.pillarTitle || "",
        };
      }

      if (editingTarget.type === "pillarCard") {
        nextForm = {
          ...nextForm,
          pillars: nextForm.pillars.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  label: modalForm.label || "",
                  desc: modalForm.desc || "",
                  color: modalForm.color || colors.green,
                  visible: modalForm.visible !== false,
                }
              : item
          ),
        };
      }

      if (editingTarget.type === "leadershipHeader") {
        nextForm = {
          ...nextForm,
          leadershipBadge: modalForm.leadershipBadge || "",
          leadershipTitle: modalForm.leadershipTitle || "",
          leadershipDescription: modalForm.leadershipDescription || "",
        };
      }

      if (editingTarget.type === "leadershipMessage") {
        nextForm = {
          ...nextForm,
          messages: nextForm.messages.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  name: modalForm.name || "",
                  role: modalForm.role || "",
                  title: modalForm.title || "",
                  message: modalForm.message || "",
                  image: modalForm.image || "",
                  visible: modalForm.visible !== false,
                }
              : item
          ),
        };
      }

      if (editingTarget.type === "leadershipPhoto") {
        nextForm = {
          ...nextForm,
          messages: nextForm.messages.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  image: modalForm.image || "",
                }
              : item
          ),
        };
      }

      if (editingTarget.type === "missionVision") {
        nextForm = {
          ...nextForm,
          missionVision: nextForm.missionVision.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  title: modalForm.title || "",
                  desc: modalForm.desc || "",
                  color: modalForm.color || colors.purple,
                  visible: modalForm.visible !== false,
                }
              : item
          ),
        };
      }

      if (editingTarget.type === "journeyHeader") {
        nextForm = {
          ...nextForm,
          timelineBadge: modalForm.timelineBadge || "",
          journeyTitle: modalForm.journeyTitle || "",
        };
      }

      if (editingTarget.type === "journeyItem") {
        nextForm = {
          ...nextForm,
          journey: nextForm.journey.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  year: modalForm.year || "",
                  title: modalForm.title || "",
                  desc: modalForm.desc || "",
                  visible: modalForm.visible !== false,
                }
              : item
          ),
        };
      }

      const cleanContent = mergeAboutContent(nextForm);
      await saveContentToBackend(
        cleanContent,
        "Selected about item saved successfully."
      );

      setEditingTarget(null);
      setModalForm({});
    } catch (err) {
      console.error("Save selected about item error:", err);

      if (err.response?.status === 401) {
        setError("Admin login expired or token is invalid. Please login again.");
      } else {
        setError(err.response?.data?.message || "Could not save selected item.");
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteTargetItem = async (target) => {
    if (!target) return;

    const deletableTypes = [
      "pillarCard",
      "leadershipMessage",
      "missionVision",
      "journeyItem",
    ];

    if (!deletableTypes.includes(target.type)) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeAboutContent(form);

      if (target.type === "pillarCard") {
        nextForm = {
          ...nextForm,
          pillars: nextForm.pillars.filter((_, index) => index !== target.index),
        };
      }

      if (target.type === "leadershipMessage") {
        nextForm = {
          ...nextForm,
          messages: nextForm.messages.filter((_, index) => index !== target.index),
        };
      }

      if (target.type === "missionVision") {
        nextForm = {
          ...nextForm,
          missionVision: nextForm.missionVision.filter(
            (_, index) => index !== target.index
          ),
        };
      }

      if (target.type === "journeyItem") {
        nextForm = {
          ...nextForm,
          journey: nextForm.journey.filter((_, index) => index !== target.index),
        };
      }

      const cleanContent = mergeAboutContent(nextForm);
      await saveContentToBackend(cleanContent, "Selected item deleted successfully.");

      setDeleteTarget(null);
      setEditingTarget(null);
      setModalForm({});
    } catch (err) {
      console.error("Delete selected about item error:", err);
      setError(err.response?.data?.message || "Could not delete selected item.");
    } finally {
      setSaving(false);
    }
  };

  const addItem = async (type) => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeAboutContent(form);

      if (type === "pillar") {
        const nextColor = cardColors[nextForm.pillars.length % cardColors.length];

        nextForm = {
          ...nextForm,
          pillars: [
            ...nextForm.pillars,
            {
              id: Date.now(),
              icon: "award",
              label: "New Core Value",
              desc: "Write a short description for this core value.",
              color: nextColor,
              visible: true,
            },
          ],
        };
      }

      if (type === "message") {
        nextForm = {
          ...nextForm,
          messages: [
            ...nextForm.messages,
            {
              id: Date.now(),
              name: "New Leader",
              role: "Role",
              title: "Message Title",
              message: "Write the leadership message here.",
              image: "",
              visible: true,
            },
          ],
        };
      }

      if (type === "missionVision") {
        const nextColor =
          cardColors[nextForm.missionVision.length % cardColors.length];

        nextForm = {
          ...nextForm,
          missionVision: [
            ...nextForm.missionVision,
            {
              id: Date.now(),
              icon: "target",
              title: "New Section",
              desc: "Write the section description here.",
              color: nextColor,
              visible: true,
            },
          ],
        };
      }

      if (type === "journey") {
        nextForm = {
          ...nextForm,
          journey: [
            ...nextForm.journey,
            {
              id: Date.now(),
              year: "Year",
              title: "Journey Title",
              desc: "Write journey description here.",
              visible: true,
            },
          ],
        };
      }

      const cleanContent = mergeAboutContent(nextForm);
      await saveContentToBackend(cleanContent, "New item added successfully.");
    } catch (err) {
      console.error("Add about item error:", err);
      setError(err.response?.data?.message || "Could not add item.");
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";

    const titles = {
      pageHeader: "Edit About Page Header",
      storyText: "Edit Story Text",
      storyImage: "Change Story Image",
      storyImageText: "Edit Story Image Caption",
      pillarHeader: "Edit Core Values Heading",
      pillarCard: "Edit Core Value Card",
      leadershipHeader: "Edit Leadership Heading",
      leadershipMessage: "Edit Leadership Message",
      leadershipPhoto: "Change Leadership Photo",
      missionVision: "Edit Mission / Vision Card",
      journeyHeader: "Edit Journey Heading",
      journeyItem: "Edit Journey Item",
    };

    return titles[editingTarget.type] || "Edit About Page";
  }, [editingTarget]);

  const ModalIcon = useMemo(() => {
    if (!editingTarget) return Pencil;

    if (
      editingTarget.type === "storyImage" ||
      editingTarget.type === "leadershipPhoto"
    ) {
      return Camera;
    }

    if (
      editingTarget.type === "leadershipMessage" ||
      editingTarget.type === "leadershipHeader"
    ) {
      return MessageSquareText;
    }

    return Pencil;
  }, [editingTarget]);

  const canDeleteSelected = useMemo(() => {
    if (!editingTarget) return false;

    return [
      "pillarCard",
      "leadershipMessage",
      "missionVision",
      "journeyItem",
    ].includes(editingTarget.type);
  }, [editingTarget]);

  const needsImageUpload = useMemo(() => {
    if (!editingTarget) return false;

    return [
      "storyImage",
      "leadershipPhoto",
      "leadershipMessage",
    ].includes(editingTarget.type);
  }, [editingTarget]);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-slate-600 font-semibold">
          Loading visual about editor...
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-purple-50 text-purple-700 border border-purple-100">
              <Eye className="w-3.5 h-3.5" />
              Visual About Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit About Page
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Hover content to edit. Core values, messages, mission cards, and journey items also show a delete icon with confirmation.
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
            <About
              editMode
              contentOverride={form}
              onEditTarget={openEditor}
              onDeleteTarget={(target) => setDeleteTarget(target)}
              onAddTarget={addItem}
            />
          </div>
        </div>
      </motion.div>

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
              onClick={(event) => event.stopPropagation()}
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
                        Save only this selected About page item.
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
                  {needsImageUpload && (
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
                            {modalForm.storyImageUrl || modalForm.image ? (
                              <img
                                src={modalForm.storyImageUrl || modalForm.image}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                            )}
                          </div>

                          <div>
                            <div className="text-white font-black">Image Preview</div>
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
                            onChange={(event) => {
                              uploadImage(event.target.files?.[0]);
                              event.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {editingTarget.type === "storyImage" ? (
                        <>
                          <Field
                            label="Story Image URL"
                            value={modalForm.storyImageUrl}
                            onChange={(value) =>
                              updateModalField("storyImageUrl", value)
                            }
                          />

                          <Field
                            label="Image Alt Text"
                            value={modalForm.storyImageAlt}
                            onChange={(value) =>
                              updateModalField("storyImageAlt", value)
                            }
                          />
                        </>
                      ) : (
                        <Field
                          label="Image URL"
                          value={modalForm.image}
                          onChange={(value) => updateModalField("image", value)}
                        />
                      )}
                    </>
                  )}

                  {editingTarget.type === "pageHeader" && (
                    <>
                      <Field
                        label="Page Title"
                        value={modalForm.pageTitle}
                        onChange={(value) => updateModalField("pageTitle", value)}
                      />

                      <Field
                        label="Page Subtitle"
                        value={modalForm.pageSubtitle}
                        onChange={(value) =>
                          updateModalField("pageSubtitle", value)
                        }
                        textarea
                      />
                    </>
                  )}

                  {editingTarget.type === "storyText" && (
                    <>
                      <Field
                        label="Story Badge"
                        value={modalForm.storyBadge}
                        onChange={(value) => updateModalField("storyBadge", value)}
                      />

                      <Field
                        label="Story Title"
                        value={modalForm.storyTitle}
                        onChange={(value) => updateModalField("storyTitle", value)}
                      />

                      <Field
                        label="Paragraph 1"
                        value={modalForm.paragraph1}
                        onChange={(value) => updateModalField("paragraph1", value)}
                        textarea
                      />

                      <Field
                        label="Paragraph 2"
                        value={modalForm.paragraph2}
                        onChange={(value) => updateModalField("paragraph2", value)}
                        textarea
                      />
                    </>
                  )}

                  {editingTarget.type === "storyImageText" && (
                    <>
                      <Field
                        label="Image Caption Title"
                        value={modalForm.storyImageTitle}
                        onChange={(value) =>
                          updateModalField("storyImageTitle", value)
                        }
                      />

                      <Field
                        label="Image Caption Subtitle"
                        value={modalForm.storyImageSubtitle}
                        onChange={(value) =>
                          updateModalField("storyImageSubtitle", value)
                        }
                      />
                    </>
                  )}

                  {editingTarget.type === "pillarHeader" && (
                    <>
                      <Field
                        label="Core Values Badge"
                        value={modalForm.pillarBadge}
                        onChange={(value) => updateModalField("pillarBadge", value)}
                      />

                      <Field
                        label="Core Values Title"
                        value={modalForm.pillarTitle}
                        onChange={(value) => updateModalField("pillarTitle", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "pillarCard" && (
                    <>
                      <Field
                        label="Card Title"
                        value={modalForm.label}
                        onChange={(value) => updateModalField("label", value)}
                      />

                      <Field
                        label="Description"
                        value={modalForm.desc}
                        onChange={(value) => updateModalField("desc", value)}
                        textarea
                      />

                      <Field
                        label="Accent Color"
                        value={modalForm.color}
                        onChange={(value) => updateModalField("color", value)}
                        type="color"
                      />

                      <Toggle
                        label="Show this card on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "leadershipHeader" && (
                    <>
                      <Field
                        label="Leadership Badge"
                        value={modalForm.leadershipBadge}
                        onChange={(value) =>
                          updateModalField("leadershipBadge", value)
                        }
                      />

                      <Field
                        label="Leadership Title"
                        value={modalForm.leadershipTitle}
                        onChange={(value) =>
                          updateModalField("leadershipTitle", value)
                        }
                      />

                      <Field
                        label="Leadership Description"
                        value={modalForm.leadershipDescription}
                        onChange={(value) =>
                          updateModalField("leadershipDescription", value)
                        }
                        textarea
                      />
                    </>
                  )}

                  {editingTarget.type === "leadershipMessage" && (
                    <>
                      <Field
                        label="Name"
                        value={modalForm.name}
                        onChange={(value) => updateModalField("name", value)}
                      />

                      <Field
                        label="Role"
                        value={modalForm.role}
                        onChange={(value) => updateModalField("role", value)}
                      />

                      <Field
                        label="Message Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Message"
                        value={modalForm.message}
                        onChange={(value) => updateModalField("message", value)}
                        textarea
                      />

                      <Toggle
                        label="Show this message on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "missionVision" && (
                    <>
                      <Field
                        label="Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Description"
                        value={modalForm.desc}
                        onChange={(value) => updateModalField("desc", value)}
                        textarea
                      />

                      <Field
                        label="Accent Color"
                        value={modalForm.color}
                        onChange={(value) => updateModalField("color", value)}
                        type="color"
                      />

                      <Toggle
                        label="Show this card on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "journeyHeader" && (
                    <>
                      <Field
                        label="Timeline Badge"
                        value={modalForm.timelineBadge}
                        onChange={(value) =>
                          updateModalField("timelineBadge", value)
                        }
                      />

                      <Field
                        label="Journey Title"
                        value={modalForm.journeyTitle}
                        onChange={(value) =>
                          updateModalField("journeyTitle", value)
                        }
                      />
                    </>
                  )}

                  {editingTarget.type === "journeyItem" && (
                    <>
                      <Field
                        label="Year / Label"
                        value={modalForm.year}
                        onChange={(value) => updateModalField("year", value)}
                      />

                      <Field
                        label="Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Description"
                        value={modalForm.desc}
                        onChange={(value) => updateModalField("desc", value)}
                        textarea
                      />

                      <Toggle
                        label="Show this timeline item on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  {canDeleteSelected && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(editingTarget)}
                      disabled={saving || uploadingImage}
                      className="sm:w-auto px-5 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                      style={{
                        background: "rgba(215,25,32,0.08)",
                        color: colors.red,
                        border: "1px solid rgba(215,25,32,0.18)",
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}

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
                    {saving ? "Saving..." : "Save This Item"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-5"
            style={{
              background: "rgba(2,6,23,0.62)",
              backdropFilter: "blur(14px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!saving) setDeleteTarget(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-md rounded-[28px] bg-white overflow-hidden"
              style={{
                boxShadow: "0 42px 110px rgba(0,0,0,0.32)",
                border: "1px solid rgba(255,255,255,0.75)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
                  <Trash2 className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-2">
                  Are you sure?
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  This will permanently delete {getDeleteName(deleteTarget)} from the About page.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60"
                    style={{
                      background: "rgba(15,23,42,0.06)",
                      color: "rgba(15,23,42,0.68)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => deleteTargetItem(deleteTarget)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.red}, #991B1B)`,
                      color: "#FFFFFF",
                      boxShadow: "0 16px 38px rgba(215,25,32,0.24)",
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    {saving ? "Deleting..." : "Yes, Delete"}
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
