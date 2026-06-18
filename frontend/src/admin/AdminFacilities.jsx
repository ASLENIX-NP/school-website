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
  ExternalLink,
  Eye,
  EyeOff,
  Type,
  Building2,
  X,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultFacilitiesContent = {
  badgeText: "School Facilities",
  title: "Learning Beyond Classrooms",
  highlightedText: "Classrooms",
  subtitle:
    "Baljagriti provides modern facilities that create an engaging, practical, and technology-driven learning environment for every student.",
  learnMoreText: "Learn More",
  highlightsTitle: "Facility Highlights",
  facilities: [
    {
      id: 1,
      emoji: "📚",
      title: "E-Library",
      category: "Digital Learning",
      description:
        "Access thousands of digital books, journals, educational resources and online learning platforms.",
      details:
        "Students can access e-books, research journals, academic databases, digital resources, and online learning platforms from school.",
      imageUrl: "",
      color: colors.red,
      visible: true,
    },
    {
      id: 2,
      emoji: "💻",
      title: "Computer Lab",
      category: "Technology",
      description:
        "Modern computer laboratory equipped with internet access and updated software for practical learning.",
      details:
        "40+ modern computers with internet access, programming tools, office applications, and multimedia software.",
      imageUrl: "",
      color: colors.purple,
      visible: true,
    },
    {
      id: 3,
      emoji: "🔬",
      title: "Science Laboratory",
      category: "Practical Education",
      description:
        "Physics, Chemistry and Biology practical experiments with modern laboratory equipment and safety measures.",
      details:
        "Fully equipped separate labs for Physics, Chemistry, and Biology, providing hands-on experimental learning and top-tier safety gear.",
      imageUrl: "",
      color: colors.green,
      visible: true,
    },
    {
      id: 4,
      emoji: "🚌",
      title: "Bus Facility",
      category: "Transportation",
      description:
        "Safe and reliable transportation service covering multiple routes.",
      details:
        "Baljagriti provides safe transportation with experienced drivers, route management, student safety monitoring, and comfortable buses for daily travel.",
      imageUrl: "",
      color: "#F59E0B",
      visible: true,
    },
    {
      id: 5,
      emoji: "🎭",
      title: "Auditorium",
      category: "Events & Activities",
      description:
        "Spacious auditorium for seminars, cultural events, presentations, and school programs.",
      details:
        "A state-of-the-art auditorium with advanced audio-visual technology, comfortable seating, and staging for hosting all major school events and presentations.",
      imageUrl: "",
      color: colors.red,
      visible: true,
    },
    {
      id: 6,
      emoji: "⚽",
      title: "Sports Ground",
      category: "Physical Development",
      description:
        "Indoor and outdoor sports facilities encouraging fitness, teamwork, and healthy competition.",
      details:
        "Expansive playgrounds and courts facilitating football, basketball, cricket, and various indoor games under expert physical guidance.",
      imageUrl: "",
      color: colors.green,
      visible: true,
    },
  ],
};

function mergeFacilitiesContent(saved = {}) {
  return {
    ...defaultFacilitiesContent,
    ...saved,
    facilities: Array.isArray(saved.facilities)
      ? saved.facilities
      : defaultFacilitiesContent.facilities,
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

function FacilityPreviewVisual({ facility }) {
  const facilityColor = facility.color || colors.green;

  if (facility.imageUrl) {
    return (
      <img
        src={facility.imageUrl}
        alt={facility.title}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: `
          radial-gradient(circle at top right, ${facilityColor}24, transparent 36%),
          linear-gradient(145deg, rgba(11,16,32,0.96), rgba(75,46,131,0.9))
        `,
      }}
    >
      <div className="text-center px-6">
        <div
          className="w-16 h-1 rounded-full mx-auto mb-4"
          style={{
            background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
          }}
        />

        <div
          className="text-xs font-bold uppercase tracking-[0.18em] mb-2"
          style={{ color: "rgba(255,255,255,0.58)" }}
        >
          {facility.category}
        </div>

        <div
          className="text-2xl font-black text-white leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.04em",
          }}
        >
          {facility.title}
        </div>
      </div>
    </div>
  );
}

function FacilityPreview({ form }) {
  const visibleFacilities = form.facilities.filter(
    (facility) => facility.visible !== false
  );

  return (
    <div
      className="min-h-full p-6"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(75,46,131,0.12), transparent 34%), linear-gradient(180deg,#FFF8EE 0%,#F8FAFC 100%)",
      }}
    >
      <div className="text-center mb-8">
        <span
          className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          style={{
            background: "rgba(22,138,58,0.08)",
            color: colors.green,
            border: "1px solid rgba(22,138,58,0.18)",
          }}
        >
          {form.badgeText}
        </span>

        <h3
          className="text-4xl text-slate-950 leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 850,
            letterSpacing: "-0.04em",
          }}
        >
          {form.title}
        </h3>

        <p className="mt-3 text-slate-500 text-sm leading-relaxed">
          {form.subtitle}
        </p>
      </div>

      <div className="grid gap-4">
        {visibleFacilities.slice(0, 4).map((facility) => {
          const facilityColor = facility.color || colors.green;

          return (
            <div
              key={facility.id}
              className="bg-white rounded-2xl overflow-hidden"
              style={{
                border: `1px solid ${facilityColor}22`,
                boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
              }}
            >
              <div className="h-36 relative overflow-hidden">
                <FacilityPreviewVisual facility={facility} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <div
                    className="w-14 h-1 rounded-full mb-3"
                    style={{ background: facilityColor }}
                  />

                  <div
                    className="inline-flex px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      color: facilityColor,
                      border: `1px solid ${facilityColor}22`,
                    }}
                  >
                    {facility.category}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="font-black text-slate-950">
                  {facility.title}
                </div>

                <div className="mt-2 text-sm text-slate-500 line-clamp-2">
                  {facility.description}
                </div>

                <div
                  className="mt-3 text-sm font-bold"
                  style={{ color: facilityColor }}
                >
                  {form.learnMoreText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminFacilities() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultFacilitiesContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

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
      } finally {
        setLoading(false);
      }
    };

    loadFacilitiesContent();
  }, []);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateFacility = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.map((facility) =>
        facility.id === id
          ? {
              ...facility,
              [name]: value,
            }
          : facility
      ),
    }));
  };

  const addFacility = () => {
    const newFacility = {
      id: Date.now(),
      emoji: "🏫",
      title: "New Facility",
      category: "School Facility",
      description: "Short facility description.",
      details: "Detailed facility highlights.",
      imageUrl: "",
      color: colors.green,
      visible: true,
    };

    setForm((prev) => ({
      ...prev,
      facilities: [...prev.facilities, newFacility],
    }));
  };

  const deleteFacility = (id) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((facility) => facility.id !== id),
    }));
  };

  const uploadFacilityImage = async (facilityId, file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 3 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > maxSize) {
      setError("Facility image must be less than 3 MB.");
      return;
    }

    setSuccess("");
    setError("");
    setUploadingId(facilityId);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedUrl =
        res.data?.url ||
        res.data?.imageUrl ||
        res.data?.fileUrl ||
        res.data?.data?.url ||
        res.data?.data?.imageUrl ||
        res.data?.data?.fileUrl;

      if (!uploadedUrl) {
        setError("Image uploaded but backend did not return image URL.");
        return;
      }

      updateFacility(facilityId, "imageUrl", uploadedUrl);
      setSuccess("Facility image uploaded successfully. Click Save Changes.");
    } catch (err) {
      console.error("Facility image upload error:", err);
      setError(err.response?.data?.message || "Facility image upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  async function saveFacilitiesContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/facilities",
        {
          content: form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Facilities page content saved successfully.");
    } catch (err) {
      console.error("Save facilities content error:", err);
      setError(
        err.response?.data?.message || "Could not save facilities content."
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
          Loading facilities editor...
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
              href="/facilities"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Facilities Page
            </a>

            <button
              type="button"
              onClick={saveFacilitiesContent}
              disabled={saving || uploadingId}
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
              background: "rgba(22,138,58,0.1)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.2)",
            }}
          >
            <Building2 className="w-4 h-4" />
            Manage Facilities Page
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
            Edit Facilities Page
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Edit the facilities page heading, cards, images, accent colors,
            categories, descriptions, and modal details. Emoji editing is no
            longer shown because the public page now uses a cleaner premium
            visual style.
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
              title="Top Heading Section"
              color={colors.green}
            >
              <div className="grid gap-5">
                <Field
                  label="Small Badge Text"
                  value={form.badgeText}
                  onChange={(value) => updateField("badgeText", value)}
                />

                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="Main Title"
                    value={form.title}
                    onChange={(value) => updateField("title", value)}
                  />

                  <Field
                    label="Red Highlight Text"
                    value={form.highlightedText}
                    onChange={(value) => updateField("highlightedText", value)}
                    placeholder="Example: Classrooms"
                  />
                </div>

                <TextArea
                  label="Subtitle"
                  value={form.subtitle}
                  onChange={(value) => updateField("subtitle", value)}
                />

                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="Card Button Text"
                    value={form.learnMoreText}
                    onChange={(value) => updateField("learnMoreText", value)}
                  />

                  <Field
                    label="Modal Details Title"
                    value={form.highlightsTitle}
                    onChange={(value) => updateField("highlightsTitle", value)}
                  />
                </div>
              </div>
            </EditorCard>

            <EditorCard
              icon={Building2}
              title="Facility Cards"
              color={colors.purple}
            >
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={addFacility}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                    boxShadow: "0 14px 34px rgba(75,46,131,0.22)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Facility
                </button>
              </div>

              <div className="space-y-6">
                {form.facilities.map((facility, index) => (
                  <div
                    key={facility.id}
                    className="rounded-3xl p-5"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div>
                        <div className="font-black text-slate-950">
                          Facility {index + 1}
                        </div>
                        <div className="text-sm text-slate-500">
                          {facility.title || "Untitled facility"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateFacility(
                              facility.id,
                              "visible",
                              !facility.visible
                            )
                          }
                          className="p-3 rounded-xl"
                          style={{
                            background:
                              facility.visible !== false
                                ? "rgba(22,138,58,0.1)"
                                : "rgba(100,116,139,0.12)",
                            color:
                              facility.visible !== false
                                ? colors.green
                                : "#64748B",
                            border:
                              facility.visible !== false
                                ? "1px solid rgba(22,138,58,0.2)"
                                : "1px solid rgba(100,116,139,0.16)",
                          }}
                          title={
                            facility.visible !== false ? "Visible" : "Hidden"
                          }
                        >
                          {facility.visible !== false ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteFacility(facility.id)}
                          className="p-3 rounded-xl"
                          style={{
                            background: "rgba(215,25,32,0.09)",
                            color: colors.red,
                            border: "1px solid rgba(215,25,32,0.18)",
                          }}
                          title="Delete facility"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-[220px_1fr] gap-5">
                      <div>
                        <div
                          className="rounded-2xl overflow-hidden bg-white mb-4 relative"
                          style={{
                            border: "1px solid rgba(15,23,42,0.08)",
                          }}
                        >
                          {facility.imageUrl ? (
                            <>
                              <img
                                src={facility.imageUrl}
                                alt={facility.title}
                                className="w-full h-44 object-cover"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  updateFacility(facility.id, "imageUrl", "")
                                }
                                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                title="Remove image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <FacilityPreviewVisual facility={facility} />
                          )}
                        </div>

                        <label
                          className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-2xl p-4 text-center"
                          style={{
                            background: "rgba(255,255,255,0.72)",
                            border: "1px dashed rgba(75,46,131,0.28)",
                          }}
                        >
                          <UploadCloud
                            className="w-6 h-6"
                            style={{ color: colors.purple }}
                          />

                          <span className="text-sm font-bold text-slate-800">
                            {uploadingId === facility.id
                              ? "Uploading..."
                              : "Upload Image"}
                          </span>

                          <span className="text-xs text-slate-500 leading-relaxed">
                            Recommended: 1200×800 px landscape, PNG/JPG/WebP,
                            max 3 MB.
                          </span>

                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingId === facility.id}
                            onChange={(e) => {
                              uploadFacilityImage(
                                facility.id,
                                e.target.files?.[0]
                              );
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Field
                            label="Facility Title"
                            value={facility.title}
                            onChange={(value) =>
                              updateFacility(facility.id, "title", value)
                            }
                          />

                          <Field
                            label="Category"
                            value={facility.category}
                            onChange={(value) =>
                              updateFacility(facility.id, "category", value)
                            }
                          />
                        </div>

                        <Field
                          label="Accent Color"
                          type="color"
                          value={facility.color}
                          onChange={(value) =>
                            updateFacility(facility.id, "color", value)
                          }
                        />

                        <TextArea
                          label="Short Description"
                          value={facility.description}
                          onChange={(value) =>
                            updateFacility(facility.id, "description", value)
                          }
                          rows={3}
                        />

                        <TextArea
                          label="Modal Facility Details"
                          value={facility.details}
                          onChange={(value) =>
                            updateFacility(facility.id, "details", value)
                          }
                          rows={4}
                        />

                        <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={facility.visible !== false}
                            onChange={(e) =>
                              updateFacility(
                                facility.id,
                                "visible",
                                e.target.checked
                              )
                            }
                            className="w-5 h-5"
                          />
                          Show this facility on website
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>
          </div>

          <aside
            className="xl:sticky xl:top-28 rounded-3xl overflow-hidden"
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
                Facilities Page Preview
              </div>

              <div className="text-sm text-white/55">
                Preview updates while editing.
              </div>
            </div>

            <div
              className="bg-white overflow-y-auto"
              style={{
                height: "760px",
              }}
            >
              <FacilityPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}