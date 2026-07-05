import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Pencil,
  Save,
  Trash2,
  UploadCloud,
  X,
  Plus,
  MapPin,
  Bus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Facilities,
  defaultFacilitiesContent,
  mergeFacilitiesContent,
} from "../pages/Facilities";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const facilityColors = [
  "#D71920",
  "#4B2E83",
  "#168A3A",
  "#F59E0B",
  "#38BDF8",
  "#8B5CF6",
  "#14B8A6",
];

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
  if (target.type === "facilityCard") return "this facility";
  return "this item";
}

function BusRouteEditor({ 
  routes, 
  onAddRoute, 
  onEditRoute, 
  onDeleteRoute,
  editingRouteId,
  setEditingRouteId 
}) {
  const [routeForm, setRouteForm] = useState({ name: "", from: "", to: "", stops: [] });
  const [stopInput, setStopInput] = useState("");

  // Find the route being edited
  const editingRoute = editingRouteId ? routes.find(r => r.id === editingRouteId) : null;

  // When editing route changes, update the form
  useEffect(() => {
    if (editingRoute) {
      setRouteForm({ ...editingRoute });
    } else {
      setRouteForm({ name: "", from: "", to: "", stops: [] });
    }
  }, [editingRouteId, routes]);

  const handleAddStop = () => {
    if (stopInput.trim()) {
      setRouteForm(prev => ({
        ...prev,
        stops: [...prev.stops, stopInput.trim()]
      }));
      setStopInput("");
    }
  };

  const handleRemoveStop = (index) => {
    setRouteForm(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  const handleSaveRoute = () => {
    if (editingRoute) {
      // Update existing route
      onEditRoute(editingRoute.id, routeForm);
      // Keep editing mode active
      setEditingRouteId(editingRoute.id);
    } else {
      // Add new route with the form data
      const newRoute = {
        ...routeForm,
        id: Date.now()
      };
      onAddRoute(newRoute);
      // Enter edit mode for the new route
      setEditingRouteId(newRoute.id);
    }
  };

  const handleEditClick = (route) => {
    setEditingRouteId(route.id);
  };

  const handleCancelEdit = () => {
    setEditingRouteId(null);
    setRouteForm({ name: "", from: "", to: "", stops: [] });
    setStopInput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-700 flex items-center gap-2">
          <Bus className="w-4 h-4" />
          Bus Routes
        </h4>
        <span className="text-sm text-slate-500">{routes.length} routes</span>
      </div>

      {routes.map((route) => (
        <div
          key={route.id}
          className={`rounded-2xl p-4 border transition-all ${
            editingRouteId === route.id ? 'ring-2 ring-blue-400' : ''
          }`}
          style={{
            background: editingRouteId === route.id ? "rgba(56,189,248,0.05)" : "rgba(255,255,255,0.92)",
            borderColor: editingRouteId === route.id ? "rgba(56,189,248,0.5)" : "rgba(75,46,131,0.12)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-bold text-slate-800">{route.name}</div>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                <MapPin className="w-3 h-3" />
                <span>{route.from || "Not set"}</span>
                <span className="text-slate-400">→</span>
                <MapPin className="w-3 h-3" />
                <span>{route.to || "Not set"}</span>
              </div>
              {route.stops && route.stops.length > 0 && (
                <div className="mt-2 space-y-1">
                  {route.stops.map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      {stop}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <button
                type="button"
                onClick={() => handleEditClick(route)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                style={{ color: colors.purple }}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteRoute(route.id);
                  if (editingRouteId === route.id) setEditingRouteId(null);
                }}
                className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                style={{ color: colors.red }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="rounded-2xl p-4 border" style={{ borderColor: "rgba(75,46,131,0.12)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Plus className="w-4 h-4" style={{ color: colors.green }} />
          <span className="font-bold text-sm text-slate-700">
            {editingRoute ? "Edit Route" : "Add New Route"}
          </span>
        </div>
        <div className="space-y-3">
          <Field
            label="Route Name"
            value={routeForm.name}
            onChange={(val) => setRouteForm(prev => ({ ...prev, name: val }))}
            placeholder="e.g., Route 1"
          />
          <Field
            label="Starting Point"
            value={routeForm.from}
            onChange={(val) => setRouteForm(prev => ({ ...prev, from: val }))}
            placeholder="e.g., Hetauda - New Bus Park"
          />
          <Field
            label="Destination"
            value={routeForm.to}
            onChange={(val) => setRouteForm(prev => ({ ...prev, to: val }))}
            placeholder="e.g., School Campus"
          />
          <div>
            <label className="block text-sm font-black mb-2 text-slate-700">Stops</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={stopInput}
                onChange={(e) => setStopInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddStop()}
                placeholder="Add a stop"
                className="flex-1 px-4 py-3 rounded-2xl outline-none text-sm"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(75,46,131,0.16)",
                  color: colors.dark,
                }}
              />
              <button
                type="button"
                onClick={handleAddStop}
                className="px-4 py-3 rounded-2xl font-black text-sm"
                style={{
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                  color: "#020617",
                }}
              >
                Add
              </button>
            </div>
            {routeForm.stops.length > 0 && (
              <div className="mt-2 space-y-1">
                {routeForm.stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/50 rounded-xl px-3 py-2">
                    <span className="text-sm text-slate-700">{stop}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {editingRoute && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 py-3 rounded-2xl font-black text-sm"
                style={{
                  background: "rgba(100,116,139,0.1)",
                  color: "#475569",
                  border: "1px solid rgba(100,116,139,0.2)",
                }}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveRoute}
              className="flex-1 py-3 rounded-2xl font-black text-sm"
              style={{
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                color: "#020617",
              }}
            >
              {editingRoute ? "Update Route" : "Add Route"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminFacilities() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultFacilitiesContent);
  const [loading, setLoading] = useState(true);
  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editingRouteId, setEditingRouteId] = useState(null);

  useEffect(() => {
    const loadFacilitiesContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/facilities"
        );

        const savedContent = res.data?.data?.content || {};
        setForm(mergeFacilitiesContent(savedContent));
      } catch (err) {
        console.error("Load facilities content error:", err);
        setError("Could not load saved facilities content. Default content shown.");
      } finally {
        setLoading(false);
      }
    };

    loadFacilitiesContent();
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
    setEditingRouteId(null);

    if (target.type === "pageHeader") {
      setModalForm({
        badgeText: form.badgeText || "",
        title: form.title || "",
        highlightedText: form.highlightedText || "",
        subtitle: form.subtitle || "",
        learnMoreText: form.learnMoreText || "",
        highlightsTitle: form.highlightsTitle || "",
      });
      return;
    }

    if (target.type === "facilityCard" || target.type === "facilityImage") {
      const item = form.facilities?.[target.index] || {};

      setModalForm({
        title: item.title || "",
        category: item.category || "",
        description: item.description || "",
        details: item.details || "",
        imageUrl: item.imageUrl || "",
        color: item.color || colors.green,
        visible: item.visible !== false,
        busRoutes: item.busRoutes || [],
      });
    }
  };

  const closeEditor = () => {
    if (saving || uploadingImage) return;
    setEditingTarget(null);
    setModalForm({});
    setEditingRouteId(null);
  };

  const saveContentToBackend = async (nextForm, message) => {
    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return false;
    }

    await axios.put(
      "http://localhost:5000/api/site-content/facilities",
      {
        content: nextForm,
      },
      {
        headers: authHeaders,
      }
    );

    setForm(nextForm);
    setSuccess(message || "Facilities page updated successfully.");
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

      updateModalField("imageUrl", uploadedUrl);
      setSuccess("Image uploaded. Click Save This Item to publish it.");
    } catch (err) {
      console.error("Facility image upload error:", err);
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  // FIXED: Now accepts the route data from the editor instead of creating an empty route
  const handleAddBusRoute = (newRoute) => {
    const currentRoutes = modalForm.busRoutes || [];
    updateModalField("busRoutes", [...currentRoutes, newRoute]);
  };

  const handleEditBusRoute = (routeId, updatedRoute) => {
    const currentRoutes = modalForm.busRoutes || [];
    const updatedRoutes = currentRoutes.map(route =>
      route.id === routeId ? { ...route, ...updatedRoute } : route
    );
    updateModalField("busRoutes", updatedRoutes);
  };

  const handleDeleteBusRoute = (routeId) => {
    const currentRoutes = modalForm.busRoutes || [];
    const updatedRoutes = currentRoutes.filter(route => route.id !== routeId);
    updateModalField("busRoutes", updatedRoutes);
    if (editingRouteId === routeId) {
      setEditingRouteId(null);
    }
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeFacilitiesContent(form);

      if (editingTarget.type === "pageHeader") {
        nextForm = {
          ...nextForm,
          badgeText: modalForm.badgeText || "",
          title: modalForm.title || "",
          highlightedText: modalForm.highlightedText || "",
          subtitle: modalForm.subtitle || "",
          learnMoreText: modalForm.learnMoreText || "",
          highlightsTitle: modalForm.highlightsTitle || "",
        };
      }

      if (
        editingTarget.type === "facilityCard" ||
        editingTarget.type === "facilityImage"
      ) {
        nextForm = {
          ...nextForm,
          facilities: nextForm.facilities.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  title: modalForm.title || "",
                  category: modalForm.category || "",
                  description: modalForm.description || "",
                  details: modalForm.details || "",
                  imageUrl: modalForm.imageUrl || "",
                  color: modalForm.color || colors.green,
                  visible: modalForm.visible !== false,
                  busRoutes: modalForm.busRoutes || [],
                }
              : item
          ),
        };
      }

      const cleanContent = mergeFacilitiesContent(nextForm);
      await saveContentToBackend(
        cleanContent,
        "Selected facilities item saved successfully."
      );

      setEditingTarget(null);
      setModalForm({});
      setEditingRouteId(null);
    } catch (err) {
      console.error("Save selected facilities item error:", err);

      if (err.response?.status === 401) {
        setError("Admin login expired or token is invalid. Please login again.");
      } else {
        setError(err.response?.data?.message || "Could not save selected item.");
      }
    } finally {
      setSaving(false);
    }
  };

  const addFacility = async () => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const nextColor = facilityColors[form.facilities.length % facilityColors.length];

      const newFacility = {
        id: Date.now(),
        emoji: "🏫",
        title: "New Facility",
        category: "School Facility",
        description: "Short facility description.",
        details: "Detailed facility highlights.",
        imageUrl: "",
        color: nextColor,
        visible: true,
        busRoutes: [],
      };

      const nextForm = mergeFacilitiesContent({
        ...form,
        facilities: [...form.facilities, newFacility],
      });

      await saveContentToBackend(nextForm, "New facility added successfully.");
    } catch (err) {
      console.error("Add facility error:", err);
      setError(err.response?.data?.message || "Could not add facility.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTargetItem = async (target) => {
    if (!target || target.type !== "facilityCard") return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const nextForm = mergeFacilitiesContent({
        ...form,
        facilities: form.facilities.filter((_, index) => index !== target.index),
      });

      await saveContentToBackend(nextForm, "Facility deleted successfully.");
      setDeleteTarget(null);
      setEditingTarget(null);
      setModalForm({});
      setEditingRouteId(null);
    } catch (err) {
      console.error("Delete facility error:", err);
      setError(err.response?.data?.message || "Could not delete facility.");
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";

    if (editingTarget.type === "pageHeader") return "Edit Facilities Heading";
    if (editingTarget.type === "facilityImage") return "Change Facility Image";
    if (editingTarget.type === "facilityCard") return "Edit Facility Card";

    return "Edit Facilities Page";
  }, [editingTarget]);

  const needsImageUpload = useMemo(() => {
    if (!editingTarget) return false;
    return editingTarget.type === "facilityCard" || editingTarget.type === "facilityImage";
  }, [editingTarget]);

  const ModalIcon = useMemo(() => {
    if (!editingTarget) return Pencil;
    if (editingTarget.type === "facilityImage") return Camera;
    if (editingTarget.type === "facilityCard") return Building2;
    return Pencil;
  }, [editingTarget]);

  const isBusFacility = useMemo(() => {
    if (!editingTarget) return false;
    if (editingTarget.type !== "facilityCard") return false;
    return modalForm.title === "Bus Facility";
  }, [editingTarget, modalForm.title]);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-slate-600 font-semibold">
          Loading visual facilities editor...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <style>
        {`
          @media (max-width: 767px) {
            .admin-facilities-preview-frame .group .opacity-0,
            .admin-facilities-preview-frame .group [class*="opacity-0"],
            .admin-facilities-preview-frame .group .md\\:opacity-0,
            .admin-facilities-preview-frame .group [class*="md:opacity-0"],
            .admin-facilities-preview-frame .group [class*="group-hover:opacity"],
            .admin-facilities-preview-frame [class*="group-hover:opacity"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-facilities-preview-frame .group .pointer-events-none,
            .admin-facilities-preview-frame .group [class*="pointer-events-none"] {
              pointer-events: auto !important;
            }

            .admin-facilities-preview-frame .group button[class*="opacity-0"],
            .admin-facilities-preview-frame button[class*="group-hover:opacity"],
            .admin-facilities-preview-frame button[class*="opacity-0"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-facilities-preview-frame .group .hidden,
            .admin-facilities-preview-frame .group [class*="hidden"] {
              display: inline-flex !important;
            }

            .admin-facilities-preview-frame [class*="absolute"] button,
            .admin-facilities-preview-frame button[class*="rounded-full"] {
              min-width: 2.25rem !important;
              min-height: 2.25rem !important;
              max-width: calc(100vw - 2rem) !important;
              white-space: nowrap !important;
              z-index: 30 !important;
              pointer-events: auto !important;
            }

            .admin-facilities-preview-frame [class*="absolute"][class*="z-50"],
            .admin-facilities-preview-frame [class*="absolute"][class*="z-[50]"],
            .admin-facilities-preview-frame [class*="absolute"][class*="z-[60]"],
            .admin-facilities-preview-frame [class*="absolute"][class*="z-[70]"],
            .admin-facilities-preview-frame [class*="absolute"][class*="z-[80]"],
            .admin-facilities-preview-frame [class*="absolute"][class*="z-[90]"],
            .admin-facilities-preview-frame [class*="absolute"][class*="z-[999]"] {
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
              <Building2 className="w-3.5 h-3.5" />
              Visual Facilities Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit Facilities Page
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Hover the heading or facility cards. Click pencil/camera to edit and trash to delete a facility.
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
              href="/facilities"
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
          className="admin-facilities-preview-frame rounded-[2rem] overflow-x-auto"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div className="w-full min-w-0 bg-white">
            <Facilities
              editMode
              contentOverride={form}
              onEditTarget={openEditor}
              onDeleteTarget={(target) => setDeleteTarget(target)}
              onAddTarget={addFacility}
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
                        Save only this selected Facilities page item.
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
                        label="Red Highlight Text"
                        value={modalForm.highlightedText}
                        onChange={(value) => updateModalField("highlightedText", value)}
                      />

                      <TextArea
                        label="Subtitle"
                        value={modalForm.subtitle}
                        onChange={(value) => updateModalField("subtitle", value)}
                      />

                      <Field
                        label="Card Button Text"
                        value={modalForm.learnMoreText}
                        onChange={(value) => updateModalField("learnMoreText", value)}
                      />

                      <Field
                        label="Modal Details Title"
                        value={modalForm.highlightsTitle}
                        onChange={(value) => updateModalField("highlightsTitle", value)}
                      />
                    </>
                  )}

                  {(editingTarget.type === "facilityCard" ||
                    editingTarget.type === "facilityImage") && (
                    <>
                      <Field
                        label="Facility Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Category"
                        value={modalForm.category}
                        onChange={(value) => updateModalField("category", value)}
                      />

                      <Field
                        label="Accent Color"
                        type="color"
                        value={modalForm.color}
                        onChange={(value) => updateModalField("color", value)}
                      />

                      <TextArea
                        label="Short Description"
                        value={modalForm.description}
                        onChange={(value) =>
                          updateModalField("description", value)
                        }
                        rows={3}
                      />

                      <TextArea
                        label="Popup Details"
                        value={modalForm.details}
                        onChange={(value) => updateModalField("details", value)}
                        rows={5}
                      />

                      {isBusFacility && (
                        <BusRouteEditor
                          routes={modalForm.busRoutes || []}
                          onAddRoute={handleAddBusRoute}
                          onEditRoute={handleEditBusRoute}
                          onDeleteRoute={handleDeleteBusRoute}
                          editingRouteId={editingRouteId}
                          setEditingRouteId={setEditingRouteId}
                        />
                      )}

                      <Toggle
                        label="Show this facility on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  {editingTarget.type === "facilityCard" && (
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
                  This will permanently delete {getDeleteName(deleteTarget)} from the Facilities page.
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