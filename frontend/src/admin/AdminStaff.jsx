import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Camera,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Pencil,
  Save,
  Trash2,
  UploadCloud,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Staff,
  defaultStaffContent,
  mergeStaffContent,
} from "../pages/Staff";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const statColors = [colors.green, colors.purple, colors.red, colors.cyan];

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

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
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
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
        style={{ background: checked ? colors.green : "#CBD5E1" }}
      >
        <span
          className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow"
          style={{ left: checked ? "24px" : "4px" }}
        />
      </span>
    </button>
  );
}

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");

  if (!token) return null;

  return {
    Authorization: `Bearer ${token}`,
  };
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

function getDeleteName(target) {
  if (!target) return "this item";
  if (target.type === "staffCard") return "this staff member";
  return "this item";
}

export default function AdminStaff() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultStaffContent);
  const [loading, setLoading] = useState(true);
  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStaffContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/staff");
        const savedContent = res.data?.data?.content || {};
        setForm(mergeStaffContent(savedContent));
      } catch (err) {
        console.error("Load staff content error:", err);
        setError("Could not load saved staff content. Default content shown.");
      } finally {
        setLoading(false);
      }
    };

    loadStaffContent();
  }, []);

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEditor = (target) => {
    setSuccess("");
    setError("");
    setEditingTarget(target);

    if (target.type === "pageHeader") {
      setModalForm({
        badgeText: form.badgeText || "",
        title: form.title || "",
        highlightedWord: form.highlightedWord || "",
        subtitle: form.subtitle || "",
      });
      return;
    }

    if (target.type === "statCard") {
      const stat = form.stats?.[target.index] || {};
      setModalForm({
        value: stat.value || "",
        label: stat.label || "",
        icon: stat.icon || "users",
        color: stat.color || statColors[target.index % statColors.length],
      });
      return;
    }

    if (target.type === "staffCard" || target.type === "staffImage") {
      const member = form.staff?.[target.index] || {};
      setModalForm({
        name: member.name || "",
        position: member.position || "",
        imageUrl: member.imageUrl || "",
        qualification: member.qualification || "",
        phone: member.phone || "",
        email: member.email || "",
        description: member.description || "",
        visible: member.visible !== false,
      });
    }
  };

  const closeEditor = () => {
    if (saving || uploadingImage) return;
    setEditingTarget(null);
    setModalForm({});
  };

  const saveContentToBackend = async (nextForm, message) => {
    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return false;
    }

    await axios.put(
      "http://localhost:5000/api/site-content/staff",
      { content: nextForm },
      { headers: authHeaders }
    );

    setForm(nextForm);
    setSuccess(message || "Staff page updated successfully.");
    return true;
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
      setError("Staff photo must be less than 6 MB.");
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

      updateModalField("imageUrl", uploadedUrl);
      setSuccess("Staff photo uploaded. Click Save This Item to publish it.");
    } catch (err) {
      console.error("Staff photo upload error:", err);
      setError(err.response?.data?.message || "Staff photo upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeStaffContent(form);

      if (editingTarget.type === "pageHeader") {
        nextForm = {
          ...nextForm,
          badgeText: modalForm.badgeText || "",
          title: modalForm.title || "",
          highlightedWord: modalForm.highlightedWord || "",
          subtitle: modalForm.subtitle || "",
        };
      }

      if (editingTarget.type === "statCard") {
        nextForm = {
          ...nextForm,
          stats: nextForm.stats.map((stat, index) =>
            index === editingTarget.index
              ? {
                  ...stat,
                  value: modalForm.value || "",
                  label: modalForm.label || "",
                  icon: modalForm.icon || "users",
                  color: modalForm.color || statColors[index % statColors.length],
                }
              : stat
          ),
        };
      }

      if (editingTarget.type === "staffCard" || editingTarget.type === "staffImage") {
        nextForm = {
          ...nextForm,
          staff: nextForm.staff.map((member, index) =>
            index === editingTarget.index
              ? {
                  ...member,
                  name: modalForm.name || "",
                  position: modalForm.position || "",
                  imageUrl: modalForm.imageUrl || "",
                  qualification: modalForm.qualification || "",
                  phone: modalForm.phone || "",
                  email: modalForm.email || "",
                  description: modalForm.description || "",
                  visible: modalForm.visible !== false,
                }
              : member
          ),
        };
      }

      const cleanContent = mergeStaffContent(nextForm);
      await saveContentToBackend(cleanContent, "Selected staff item saved successfully.");

      setEditingTarget(null);
      setModalForm({});
    } catch (err) {
      console.error("Save selected staff item error:", err);

      if (err.response?.status === 401) {
        setError("Admin login expired or token is invalid. Please login again.");
      } else {
        setError(err.response?.data?.message || "Could not save selected item.");
      }
    } finally {
      setSaving(false);
    }
  };

  const addStaffMember = async () => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const newMember = {
        id: Date.now(),
        name: "New Staff Member",
        position: "Teacher",
        imageUrl: "",
        qualification: "",
        phone: "",
        email: "",
        description: "Write a short bio about this staff member.",
        visible: true,
      };

      const nextForm = mergeStaffContent({
        ...form,
        staff: [...form.staff, newMember],
      });

      await saveContentToBackend(nextForm, "New staff member added successfully.");
    } catch (err) {
      console.error("Add staff member error:", err);
      setError(err.response?.data?.message || "Could not add staff member.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTargetItem = async (target) => {
    if (!target || target.type !== "staffCard") return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const nextForm = mergeStaffContent({
        ...form,
        staff: form.staff.filter((_, index) => index !== target.index),
      });

      await saveContentToBackend(nextForm, "Staff member deleted successfully.");
      setDeleteTarget(null);
      setEditingTarget(null);
      setModalForm({});
    } catch (err) {
      console.error("Delete staff member error:", err);
      setError(err.response?.data?.message || "Could not delete staff member.");
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";

    if (editingTarget.type === "pageHeader") return "Edit Staff Heading";
    if (editingTarget.type === "statCard") return "Edit Staff Number Card";
    if (editingTarget.type === "staffImage") return "Change Staff Photo";
    if (editingTarget.type === "staffCard") return "Edit Staff Member";

    return "Edit Staff Page";
  }, [editingTarget]);

  const needsImageUpload = useMemo(() => {
    if (!editingTarget) return false;
    return editingTarget.type === "staffCard" || editingTarget.type === "staffImage";
  }, [editingTarget]);

  const ModalIcon = useMemo(() => {
    if (!editingTarget) return Pencil;
    if (editingTarget.type === "staffImage") return Camera;
    if (editingTarget.type === "staffCard") return UserRound;
    if (editingTarget.type === "statCard") return BarChart3;
    return Pencil;
  }, [editingTarget]);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-slate-600 font-semibold">
          Loading visual staff editor...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <style>
        {`
          @media (max-width: 767px) {
            .admin-staff-preview-frame .group .opacity-0,
            .admin-staff-preview-frame .group [class*="opacity-0"],
            .admin-staff-preview-frame .group .md\\:opacity-0,
            .admin-staff-preview-frame .group [class*="md:opacity-0"],
            .admin-staff-preview-frame .group [class*="group-hover:opacity"],
            .admin-staff-preview-frame [class*="group-hover:opacity"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-staff-preview-frame .group .pointer-events-none,
            .admin-staff-preview-frame .group [class*="pointer-events-none"] {
              pointer-events: auto !important;
            }

            .admin-staff-preview-frame .group button[class*="opacity-0"],
            .admin-staff-preview-frame button[class*="group-hover:opacity"],
            .admin-staff-preview-frame button[class*="opacity-0"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-staff-preview-frame .group .hidden,
            .admin-staff-preview-frame .group [class*="hidden"] {
              display: inline-flex !important;
            }

            .admin-staff-preview-frame [class*="absolute"] button,
            .admin-staff-preview-frame button[class*="rounded-full"] {
              min-width: 2.25rem !important;
              min-height: 2.25rem !important;
              max-width: calc(100vw - 2rem) !important;
              white-space: nowrap !important;
              z-index: 30 !important;
              pointer-events: auto !important;
            }

            .admin-staff-preview-frame [class*="absolute"][class*="z-50"],
            .admin-staff-preview-frame [class*="absolute"][class*="z-[50]"],
            .admin-staff-preview-frame [class*="absolute"][class*="z-[60]"],
            .admin-staff-preview-frame [class*="absolute"][class*="z-[70]"],
            .admin-staff-preview-frame [class*="absolute"][class*="z-[80]"],
            .admin-staff-preview-frame [class*="absolute"][class*="z-[90]"],
            .admin-staff-preview-frame [class*="absolute"][class*="z-[999]"] {
              z-index: 30 !important;
            }
          }
        `}
      </style>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-4 sm:p-5 md:p-6"
        style={{
          background:
            "linear-gradient(135deg, #E8EDF5 0%, #DCE3EF 50%, #E8E0F0 100%)",
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-green-50 text-green-700 border border-green-100">
              <Users className="w-3.5 h-3.5" />
              Visual Staff Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit Staff Page
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Hover the heading, number cards, or staff cards. Click pencil/camera to edit and trash to delete a staff member.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-black bg-white text-slate-700 border border-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>

            <a
              href="/staff"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-black bg-white text-slate-700 border border-slate-100"
            >
              <ExternalLink className="w-4 h-4" />
              View Page
            </a>
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
          className="admin-staff-preview-frame rounded-[2rem] overflow-x-auto"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div className="w-full min-w-0 bg-white">
            <Staff
              editMode
              contentOverride={form}
              onEditTarget={openEditor}
              onDeleteTarget={(target) => setDeleteTarget(target)}
              onAddTarget={addStaffMember}
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editingTarget && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
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
                        Save only this selected Staff page item.
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
                          <div className="w-28 h-28 rounded-2xl bg-white overflow-hidden flex items-center justify-center">
                            {modalForm.imageUrl ? (
                              <img
                                src={modalForm.imageUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                            )}
                          </div>

                          <div>
                            <div className="text-white font-black">Photo Preview</div>
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
                          {uploadingImage ? "Uploading..." : "Upload New Photo"}
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

                      <Field
                        label="Image URL"
                        value={modalForm.imageUrl}
                        onChange={(value) => updateModalField("imageUrl", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "pageHeader" && (
                    <>
                      <Field
                        label="Badge Text"
                        value={modalForm.badgeText}
                        onChange={(value) => updateModalField("badgeText", value)}
                      />

                      <Field
                        label="Main Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Green Highlight Word"
                        value={modalForm.highlightedWord}
                        onChange={(value) => updateModalField("highlightedWord", value)}
                      />

                      <TextArea
                        label="Subtitle"
                        value={modalForm.subtitle}
                        onChange={(value) => updateModalField("subtitle", value)}
                        rows={4}
                      />
                    </>
                  )}

                  {editingTarget.type === "statCard" && (
                    <>
                      <Field
                        label="Number"
                        value={modalForm.value}
                        onChange={(value) => updateModalField("value", value)}
                      />

                      <Field
                        label="Label"
                        value={modalForm.label}
                        onChange={(value) => updateModalField("label", value)}
                      />

                      <Field
                        label="Icon Type"
                        value={modalForm.icon}
                        onChange={(value) => updateModalField("icon", value)}
                        placeholder="users / graduation / award"
                      />

                      <Field
                        label="Accent Color"
                        type="color"
                        value={modalForm.color}
                        onChange={(value) => updateModalField("color", value)}
                      />
                    </>
                  )}

                  {(editingTarget.type === "staffCard" ||
                    editingTarget.type === "staffImage") && (
                    <>
                      <Field
                        label="Name"
                        value={modalForm.name}
                        onChange={(value) => updateModalField("name", value)}
                      />

                      <Field
                        label="Position"
                        value={modalForm.position}
                        onChange={(value) => updateModalField("position", value)}
                      />

                      <Field
                        label="Qualification"
                        value={modalForm.qualification}
                        onChange={(value) => updateModalField("qualification", value)}
                      />

                      <Field
                        label="Phone"
                        value={modalForm.phone}
                        onChange={(value) => updateModalField("phone", value)}
                        placeholder="+977-98XXXXXXXX"
                      />

                      <Field
                        label="Email"
                        value={modalForm.email}
                        onChange={(value) => updateModalField("email", value)}
                        placeholder="Optional"
                      />

                      <TextArea
                        label="Description / About"
                        value={modalForm.description}
                        onChange={(value) => updateModalField("description", value)}
                        rows={5}
                      />

                      <Toggle
                        label="Show this staff member on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  {editingTarget.type === "staffCard" && (
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
            className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5"
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
                  This will permanently delete {getDeleteName(deleteTarget)} from the Staff page.
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

