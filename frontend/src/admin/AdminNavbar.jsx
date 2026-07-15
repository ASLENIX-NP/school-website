import defaultSchoolLogo from "../assets/school-logo.jpeg";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  Link as LinkIcon,
  ListTree,
  Pencil,
  Plus,
  Save,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import {
  Navbar,
  defaultNavbarContent,
  mergeNavbarContent,
} from "../app/components/Navbar";

const API_BASE = "https://school-website-backend-ixx2.onrender.com";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
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
        className="relative w-12 h-7 rounded-full transition-all flex-shrink-0"
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

function createMenuId(label, existingLinks) {
  const base =
    String(label || "menu")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "") || "menu";

  const existingIds = new Set(
    existingLinks.map((link) => String(link.id || "").trim())
  );

  if (!existingIds.has(base)) return base;

  let counter = 2;
  let nextId = `${base}-${counter}`;

  while (existingIds.has(nextId)) {
    counter += 1;
    nextId = `${base}-${counter}`;
  }

  return nextId;
}

export default function AdminNavbar() {
  const [form, setForm] = useState(defaultNavbarContent);
  const [loading, setLoading] = useState(true);
  const [editingTarget, setEditingTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalNotice, setModalNotice] = useState("");

  function getAdminToken() {
    return (
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("admin_token") ||
      ""
    );
  }

  function getAuthHeaders() {
    const token = getAdminToken();

    if (!token) return null;

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  useEffect(() => {
    let alive = true;

    const loadNavbarContent = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${API_BASE}/api/site-content/navbar`,
          { timeout: 20000 }
        );

        if (!alive) return;

        const savedContent = response.data?.data?.content || {};
        setForm(mergeNavbarContent(savedContent));
      } catch (requestError) {
        console.error("Load navbar content error:", requestError);

        if (alive) {
          setError(
            "Could not load saved navbar content. Default content is shown."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadNavbarContent();

    return () => {
      alive = false;
    };
  }, []);

  const openEditor = (target) => {
    setSuccess("");
    setError("");
    setModalError("");
    setModalNotice("");
    setEditingTarget(target);

    if (target.type === "branding") {
      setModalForm({
        logoUrl: form.logoUrl || "",
        schoolName: form.schoolName || "",
        schoolSubtitle: form.schoolSubtitle || "",
        logoTouched: false,
      });
      return;
    }

    if (target.type === "menu") {
      setModalForm({
        links: form.links.map((link) => ({ ...link })),
      });
      return;
    }

    if (target.type === "admission") {
      setModalForm({
        admissionButtonText: form.admissionButtonText || "",
        admissionButtonLink: form.admissionButtonLink || "/admissions",
        showAdmissionButton: form.showAdmissionButton !== false,
      });
    }
  };

  const closeEditor = () => {
    if (saving || uploadingLogo) return;

    setEditingTarget(null);
    setModalForm({});
    setModalError("");
    setModalNotice("");
  };

  const updateModalField = (name, value) => {
    setModalForm((previous) => ({
      ...previous,
      [name]: value,
    }));
    setModalError("");
  };

  const updateBrandingLogo = (value) => {
    setModalForm((previous) => ({
      ...previous,
      logoUrl: value,
      logoTouched: true,
    }));
    setModalError("");
  };

  const updateMenuLink = (id, field, value) => {
    setModalForm((previous) => ({
      ...previous,
      links: (previous.links || []).map((link) =>
        link.id === id
          ? {
              ...link,
              [field]: value,
            }
          : link
      ),
    }));
    setModalError("");
  };

  const addMenuLink = () => {
    setModalForm((previous) => {
      const currentLinks = previous.links || [];
      const id = createMenuId("new-menu", currentLinks);

      return {
        ...previous,
        links: [
          ...currentLinks,
          {
            id,
            label: "",
            href: "/",
            visible: true,
          },
        ],
      };
    });

    setModalError("");
    setModalNotice("New menu item added. Complete its label and link.");
  };

  const removeMenuLink = (id) => {
    setModalForm((previous) => ({
      ...previous,
      links: (previous.links || []).filter((link) => link.id !== id),
    }));

    setModalError("");
    setModalNotice(
      "Menu item removed from this draft. Click Save Menu to publish."
    );
  };

  const moveMenuLink = (index, direction) => {
    setModalForm((previous) => {
      const links = [...(previous.links || [])];
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= links.length) {
        return previous;
      }

      [links[index], links[nextIndex]] = [links[nextIndex], links[index]];

      return {
        ...previous,
        links,
      };
    });

    setModalError("");
  };

  const uploadLogoImage = async (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 6 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setModalError("Please upload only PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > maxSize) {
      setModalError("Logo image must be less than 6 MB.");
      return;
    }

    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setModalError("Admin login expired. Please log out and log in again.");
      return;
    }

    setModalError("");
    setModalNotice("");
    setUploadingLogo(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const response = await axios.post(
        `${API_BASE}/api/upload`,
        uploadData,
        {
          headers: {
            ...authHeaders,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedUrl = getUploadUrl(response.data);

      if (!uploadedUrl) {
        setModalError(
          "Image uploaded, but the backend did not return an image URL."
        );
        return;
      }

      setModalForm((previous) => ({
        ...previous,
        logoUrl: uploadedUrl,
        logoTouched: true,
      }));
      setModalNotice("Logo uploaded. Click Save Branding to publish it.");
    } catch (requestError) {
      console.error("Logo upload error:", requestError);
      setModalError(
        requestError.response?.data?.message || "Logo upload failed."
      );
    } finally {
      setUploadingLogo(false);
    }
  };

  const validateBranding = () => {
    const schoolName = String(modalForm.schoolName || "").trim();
    const schoolSubtitle = String(modalForm.schoolSubtitle || "").trim();
    const logoUrl = String(modalForm.logoUrl || "").trim();

    if (!schoolName) {
      return "Please write the school name before saving.";
    }

    if (!schoolSubtitle) {
      return "Please write the school subtitle before saving.";
    }

    if (modalForm.logoTouched && !logoUrl) {
      return "Please upload or enter a school logo before saving.";
    }

    return "";
  };

  const validateMenu = () => {
    const links = Array.isArray(modalForm.links) ? modalForm.links : [];
    const seenIds = new Set();

    for (let index = 0; index < links.length; index += 1) {
      const link = links[index];
      const position = index + 1;
      const label = String(link.label || "").trim();
      const href = String(link.href || "").trim();
      const id = String(link.id || "").trim();

      if (!label) {
        return `Please write the menu label for item ${position}.`;
      }

      if (!href) {
        return `Please write the menu link for "${label}".`;
      }

      if (!id) {
        return `Menu item ${position} has no ID. Remove it and add it again.`;
      }

      if (seenIds.has(id)) {
        return `The menu ID "${id}" is duplicated. Remove one duplicate item.`;
      }

      seenIds.add(id);
    }

    return "";
  };

  const validateAdmission = () => {
    if (!String(modalForm.admissionButtonText || "").trim()) {
      return "Please write the admission button text before saving.";
    }

    if (!String(modalForm.admissionButtonLink || "").trim()) {
      return "Please write the admission button link before saving.";
    }

    return "";
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    let validationMessage = "";

    if (editingTarget.type === "branding") {
      validationMessage = validateBranding();
    }

    if (editingTarget.type === "menu") {
      validationMessage = validateMenu();
    }

    if (editingTarget.type === "admission") {
      validationMessage = validateAdmission();
    }

    if (validationMessage) {
      setModalError(validationMessage);
      return;
    }

    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setModalError("Admin login expired. Please log out and log in again.");
      return;
    }

    setSaving(true);
    setModalError("");
    setModalNotice("");

    try {
      let nextForm = mergeNavbarContent(form);

      if (editingTarget.type === "branding") {
        nextForm = {
          ...nextForm,
          logoUrl: String(modalForm.logoUrl || "").trim(),
          schoolName: String(modalForm.schoolName || "").trim(),
          schoolSubtitle: String(modalForm.schoolSubtitle || "").trim(),
        };
      }

      if (editingTarget.type === "menu") {
        nextForm = {
          ...nextForm,
          links: (modalForm.links || []).map((link) => ({
            id: String(link.id || "").trim(),
            label: String(link.label || "").trim(),
            href: String(link.href || "").trim(),
            visible: link.visible !== false,
          })),
        };
      }

      if (editingTarget.type === "admission") {
        nextForm = {
          ...nextForm,
          admissionButtonText: String(
            modalForm.admissionButtonText || ""
          ).trim(),
          admissionButtonLink: String(
            modalForm.admissionButtonLink || ""
          ).trim(),
          showAdmissionButton: modalForm.showAdmissionButton !== false,
        };
      }

      const cleanContent = mergeNavbarContent(nextForm);

      await axios.put(
        `${API_BASE}/api/site-content/navbar`,
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
      setSuccess(
        editingTarget.type === "branding"
          ? "School logo and name saved successfully."
          : editingTarget.type === "menu"
            ? "Navbar menu saved successfully."
            : "Admission button saved successfully."
      );
    } catch (requestError) {
      console.error("Save navbar section error:", requestError);

      if (requestError.response?.status === 401) {
        setModalError(
          "Admin login expired or the token is invalid. Please log out and log in again."
        );
      } else {
        setModalError(
          requestError.response?.data?.message ||
            "Could not save the selected navbar section."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";

    if (editingTarget.type === "branding") {
      return "Edit School Logo and Name";
    }

    if (editingTarget.type === "menu") {
      return "Manage Navbar Menu";
    }

    if (editingTarget.type === "admission") {
      return "Edit Admission Button";
    }

    return "Edit Navbar";
  }, [editingTarget]);

  const ModalIcon = useMemo(() => {
    if (editingTarget?.type === "branding") return ImageIcon;
    if (editingTarget?.type === "menu") return ListTree;
    if (editingTarget?.type === "admission") return LinkIcon;
    return Pencil;
  }, [editingTarget]);

  const saveButtonText = useMemo(() => {
    if (editingTarget?.type === "branding") return "Save Branding";
    if (editingTarget?.type === "menu") return "Save Menu";
    if (editingTarget?.type === "admission") return "Save Admission Button";
    return "Save";
  }, [editingTarget]);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-slate-600 font-semibold">
          Loading navbar editor...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style>
        {`
          @media (max-width: 1279px) {
            .admin-navbar-preview-frame {
              position: relative !important;
              min-height: 660px !important;
              overflow: hidden !important;
              isolation: isolate !important;
            }

            .admin-navbar-preview-frame .admin-navbar-edit-indicator {
              opacity: 1 !important;
              transform: scale(1) !important;
            }

            .admin-navbar-preview-frame [class*="fixed"] {
              position: absolute !important;
            }
          }

          @media (min-width: 1280px) {
            .admin-navbar-preview-frame {
              min-height: 170px !important;
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-sky-50 text-sky-700 border border-sky-100">
              <Eye className="w-3.5 h-3.5" />
              Visual Navbar Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Edit Navbar Sections
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Use one editor for school branding, one for the complete menu,
              and one for the admission button.
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-green-50 text-green-700 border border-green-100">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-red-50 text-red-700 border border-red-100">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div
          className="admin-navbar-preview-frame rounded-[2rem] p-3 sm:p-4 md:p-6 overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div className="w-full min-w-0">
            <Navbar
              editMode
              contentOverride={form}
              onEditTarget={openEditor}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => openEditor({ type: "branding" })}
          className="text-left rounded-2xl p-4 bg-white border border-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-950">School Branding</div>
          <div className="text-sm text-slate-500 mt-1">
            Edit logo, school name, and subtitle together.
          </div>
        </button>

        <button
          type="button"
          onClick={() => openEditor({ type: "menu" })}
          className="text-left rounded-2xl p-4 bg-white border border-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <ListTree className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-950">Complete Menu</div>
          <div className="text-sm text-slate-500 mt-1">
            Add, remove, hide, restore, and arrange all menu items.
          </div>
        </button>

        <button
          type="button"
          onClick={() => openEditor({ type: "admission" })}
          className="text-left rounded-2xl p-4 bg-white border border-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <LinkIcon className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-950">Admission Button</div>
          <div className="text-sm text-slate-500 mt-1">
            Edit or restore the button even when it is hidden.
          </div>
        </button>
      </div>

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
              className={`w-full rounded-[28px] overflow-hidden ${
                editingTarget.type === "menu"
                  ? "max-w-4xl"
                  : "max-w-xl"
              }`}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 42px 110px rgba(0,0,0,0.28)",
                maxHeight: "92vh",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan}, ${colors.green})`,
                }}
              />

              <div className="flex flex-col max-h-[calc(92vh-4px)]">
                <div className="p-5 sm:p-6 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(56,189,248,0.18))",
                          color: colors.dark,
                        }}
                      >
                        <ModalIcon className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-xl font-black text-slate-950">
                          {modalTitle}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Changes are published only after you click save.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={closeEditor}
                      disabled={saving || uploadingLogo}
                      className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-600 flex-shrink-0 disabled:opacity-60"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto p-5 sm:p-6">
                  {modalError && (
                    <div className="mb-5 rounded-2xl px-4 py-3 flex items-start gap-2 font-semibold bg-red-50 text-red-700 border border-red-100">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{modalError}</span>
                    </div>
                  )}

                  {modalNotice && (
                    <div className="mb-5 rounded-2xl px-4 py-3 flex items-start gap-2 font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{modalNotice}</span>
                    </div>
                  )}

                  <div className="space-y-5">
                    {editingTarget.type === "branding" && (
                      <>
                        <div
                          className="rounded-3xl p-5"
                          style={{
                            background:
                              "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,41,59,0.92))",
                            border: "1px solid rgba(255,255,255,0.12)",
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="w-24 h-24 rounded-2xl bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
                              <img
                                src={
                                  modalForm.logoUrl || defaultSchoolLogo
                                }
                                alt="Logo preview"
                                className="w-full h-full object-contain p-1"
                              />
                            </div>

                            <div>
                              <div className="text-white font-black">
                                School Logo
                              </div>
                              <div className="text-white/55 text-sm mt-1 leading-relaxed">
                                Recommended: 512×512 square, PNG/JPG/WebP,
                                maximum 6 MB.
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
                            {uploadingLogo
                              ? "Uploading..."
                              : "Upload New Logo"}
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              disabled={uploadingLogo}
                              onChange={(event) => {
                                uploadLogoImage(event.target.files?.[0]);
                                event.target.value = "";
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <Field
                          label="Logo Image URL"
                          value={modalForm.logoUrl}
                          onChange={updateBrandingLogo}
                          placeholder="Upload a logo or paste its image URL"
                        />

                        <Field
                          label="School Name"
                          value={modalForm.schoolName}
                          onChange={(value) =>
                            updateModalField("schoolName", value)
                          }
                          placeholder="Baljagriti"
                        />

                        <Field
                          label="School Subtitle"
                          value={modalForm.schoolSubtitle}
                          onChange={(value) =>
                            updateModalField("schoolSubtitle", value)
                          }
                          placeholder="Secondary English School"
                        />
                      </>
                    )}

                    {editingTarget.type === "menu" && (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="font-black text-slate-950">
                              Menu Items
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              Use arrows to arrange the order. Hidden items
                              remain here so they can be restored later.
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={addMenuLink}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black"
                            style={{
                              background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                              color: colors.dark,
                            }}
                          >
                            <Plus className="w-4 h-4" />
                            Add Menu Item
                          </button>
                        </div>

                        {(modalForm.links || []).length === 0 ? (
                          <div className="rounded-3xl p-8 text-center bg-slate-50 border border-dashed border-slate-300">
                            <ListTree className="w-8 h-8 mx-auto text-slate-400" />
                            <div className="font-black text-slate-800 mt-3">
                              No menu items
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              Add a menu item to show navigation links again.
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {(modalForm.links || []).map((link, index) => (
                              <div
                                key={link.id}
                                className="rounded-3xl p-4 sm:p-5 bg-slate-50 border border-slate-200"
                              >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black">
                                      {index + 1}
                                    </div>

                                    <div>
                                      <div className="font-black text-slate-950">
                                        {link.label || "New Menu Item"}
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        ID: {link.id}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        moveMenuLink(index, -1)
                                      }
                                      disabled={index === 0}
                                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 disabled:opacity-35"
                                      title="Move up"
                                    >
                                      <ArrowUp className="w-4 h-4" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        moveMenuLink(index, 1)
                                      }
                                      disabled={
                                        index ===
                                        (modalForm.links || []).length - 1
                                      }
                                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 disabled:opacity-35"
                                      title="Move down"
                                    >
                                      <ArrowDown className="w-4 h-4" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeMenuLink(link.id)
                                      }
                                      className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600"
                                      title="Remove menu item"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-4">
                                  <Field
                                    label="Menu Label"
                                    value={link.label}
                                    onChange={(value) =>
                                      updateMenuLink(
                                        link.id,
                                        "label",
                                        value
                                      )
                                    }
                                    placeholder="Academics"
                                  />

                                  <Field
                                    label="Menu Link"
                                    value={link.href}
                                    onChange={(value) =>
                                      updateMenuLink(
                                        link.id,
                                        "href",
                                        value
                                      )
                                    }
                                    placeholder="/academics"
                                  />
                                </div>

                                <div className="mt-4">
                                  <Toggle
                                    checked={link.visible !== false}
                                    onChange={(value) =>
                                      updateMenuLink(
                                        link.id,
                                        "visible",
                                        value
                                      )
                                    }
                                    label="Show this item in the navbar"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {editingTarget.type === "admission" && (
                      <>
                        <Toggle
                          checked={
                            modalForm.showAdmissionButton !== false
                          }
                          onChange={(value) =>
                            updateModalField(
                              "showAdmissionButton",
                              value
                            )
                          }
                          label="Show admission button"
                        />

                        <Field
                          label="Button Text"
                          value={modalForm.admissionButtonText}
                          onChange={(value) =>
                            updateModalField(
                              "admissionButtonText",
                              value
                            )
                          }
                          placeholder="Admission Open"
                        />

                        <Field
                          label="Button Link"
                          value={modalForm.admissionButtonLink}
                          onChange={(value) =>
                            updateModalField(
                              "admissionButtonLink",
                              value
                            )
                          }
                          placeholder="/admissions"
                        />

                        {modalForm.showAdmissionButton === false && (
                          <div className="rounded-2xl p-4 bg-amber-50 border border-amber-100 text-amber-800 text-sm font-semibold">
                            The button will be hidden on the public website,
                            but this editor will remain available in the admin
                            panel so you can restore it later.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6 border-t border-slate-100 bg-white">
                  <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={closeEditor}
                      disabled={saving || uploadingLogo}
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
                      disabled={saving || uploadingLogo}
                      className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                        color: colors.dark,
                        boxShadow:
                          "0 16px 38px rgba(56,189,248,0.24)",
                      }}
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : saveButtonText}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}