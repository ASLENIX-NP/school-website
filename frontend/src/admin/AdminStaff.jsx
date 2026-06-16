import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Users,
  Plus,
  Trash2,
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  Image,
  Type,
  BarChart3,
  Eye,
  EyeOff,
  Phone,
  UserRound,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultStaffContent = {
  badgeText: "Our Faculty Team",
  title: "Our Staff & Members",
  highlightedWord: "Members",
  subtitle:
    "Meet the dedicated educators, mentors, and leaders who inspire excellence, character, and lifelong learning at Baljagriti Secondary English Boarding School.",
  stats: [
    {
      id: "teachingStaff",
      value: "50+",
      label: "Teaching Staff",
      icon: "users",
      color: colors.green,
    },
    {
      id: "expertFaculty",
      value: "240+",
      label: "Expert Faculty",
      icon: "graduation",
      color: colors.purple,
    },
    {
      id: "yearsExcellence",
      value: "35+",
      label: "Years Excellence",
      icon: "award",
      color: colors.red,
    },
  ],
  staff: [
    {
      id: 1,
      name: "Binod Subedi",
      position: "Principal",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      qualification: "M.Ed",
      phone: "+977-9800000000",
      visible: true,
    },
    {
      id: 2,
      name: "Amul Shrestha",
      position: "Vice Principal",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      qualification: "M.Ed",
      phone: "+977-9800000000",
      visible: true,
    },
    {
      id: 3,
      name: "Prem Hamal",
      position: "Science Teacher",
      imageUrl: "https://images.unsplash.com/photo-1504593811423-6dd665756598",
      qualification: "B.Sc, B.Ed",
      phone: "+977-9800000000",
      visible: true,
    },
  ],
};

function mergeStaffContent(saved = {}) {
  return {
    ...defaultStaffContent,
    ...saved,
    stats:
      Array.isArray(saved.stats) && saved.stats.length
        ? saved.stats
        : defaultStaffContent.stats,
    staff:
      Array.isArray(saved.staff) && saved.staff.length
        ? saved.staff
        : defaultStaffContent.staff,
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

function TextArea({ label, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
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

function StaffPreview({ form }) {
  const visibleStaff = form.staff.filter((staff) => staff.visible !== false);

  return (
    <div
      className="min-h-full p-6"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(75,46,131,0.12), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 100%)",
      }}
    >
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
          style={{
            background: "rgba(22,138,58,0.08)",
            color: colors.green,
            border: "1px solid rgba(22,138,58,0.18)",
          }}
        >
          <Users className="w-4 h-4" />
          {form.badgeText}
        </div>

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

      <div className="grid grid-cols-3 gap-3 mb-8">
        {form.stats.map((stat, index) => (
          <div
            key={stat.id || index}
            className="bg-white rounded-2xl p-4 text-center"
            style={{
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
            }}
          >
            <div className="text-2xl font-black text-slate-950">
              {stat.value}
            </div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {visibleStaff.slice(0, 3).map((staff) => (
          <div
            key={staff.id}
            className="bg-white rounded-2xl overflow-hidden flex gap-4"
            style={{
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
            }}
          >
            {staff.imageUrl ? (
              <img
                src={staff.imageUrl}
                alt={staff.name}
                className="w-28 h-32 object-cover"
              />
            ) : (
              <div className="w-28 h-32 bg-slate-100 flex items-center justify-center">
                <UserRound className="w-10 h-10 text-slate-300" />
              </div>
            )}

            <div className="py-4 pr-4">
              <div className="font-black text-slate-950">{staff.name}</div>
              <div className="text-green-700 font-bold text-sm">
                {staff.position}
              </div>
              <div className="text-slate-500 text-sm mt-2">
                {staff.qualification}
              </div>
              <div className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                <Phone className="w-3 h-3" />
                {staff.phone}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminStaff() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultStaffContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadStaffContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/staff");
        const savedContent = res.data?.data?.content || {};
        setForm(mergeStaffContent(savedContent));
      } catch (err) {
        console.error("Load staff content error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStaffContent();
  }, []);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateStat = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.map((stat) =>
        stat.id === id
          ? {
              ...stat,
              [name]: value,
            }
          : stat
      ),
    }));
  };

  const updateStaff = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      staff: prev.staff.map((member) =>
        member.id === id
          ? {
              ...member,
              [name]: value,
            }
          : member
      ),
    }));
  };

  const addStaffMember = () => {
    const newMember = {
      id: Date.now(),
      name: "New Staff Member",
      position: "Teacher",
      imageUrl: "",
      qualification: "",
      phone: "",
      visible: true,
    };

    setForm((prev) => ({
      ...prev,
      staff: [...prev.staff, newMember],
    }));
  };

  const deleteStaffMember = (id) => {
    setForm((prev) => ({
      ...prev,
      staff: prev.staff.filter((member) => member.id !== id),
    }));
  };

  const uploadStaffImage = async (staffId, file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > maxSize) {
      setError("Staff photo must be less than 2 MB.");
      return;
    }

    setSuccess("");
    setError("");
    setUploadingId(staffId);

    try {
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
        setError("Image uploaded but backend did not return image URL.");
        return;
      }

      updateStaff(staffId, "imageUrl", uploadedUrl);
      setSuccess("Staff photo uploaded successfully. Click Save Changes.");
    } catch (err) {
      console.error("Staff photo upload error:", err);
      setError(err.response?.data?.message || "Staff photo upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  async function saveStaffContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/staff",
        {
          content: form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Staff page content saved successfully.");
    } catch (err) {
      console.error("Save staff content error:", err);
      setError(err.response?.data?.message || "Could not save staff content.");
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
          Loading staff editor...
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
              href="/staff"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Staff Page
            </a>

            <button
              type="button"
              onClick={saveStaffContent}
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
            <Users className="w-4 h-4" />
            Manage Staff Page
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
            Edit Staff Page
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Edit top section, staff numbers, staff members, phone numbers, and
            staff photos. Images upload directly to ImageKit.
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
            <EditorCard icon={Type} title="Top Heading Section" color={colors.green}>
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
                    label="Green Highlight Word"
                    value={form.highlightedWord}
                    onChange={(value) => updateField("highlightedWord", value)}
                    placeholder="Example: Members"
                  />
                </div>

                <TextArea
                  label="Subtitle"
                  value={form.subtitle}
                  onChange={(value) => updateField("subtitle", value)}
                />
              </div>
            </EditorCard>

            <EditorCard icon={BarChart3} title="Top Staff Number Cards" color={colors.purple}>
              <div className="space-y-4">
                {form.stats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className="rounded-2xl p-4"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="font-bold text-slate-900 mb-4">
                      Number Card {index + 1}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Number"
                        value={stat.value}
                        onChange={(value) => updateStat(stat.id, "value", value)}
                      />

                      <Field
                        label="Label"
                        value={stat.label}
                        onChange={(value) => updateStat(stat.id, "label", value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>

            <EditorCard icon={Image} title="Staff Members" color={colors.red}>
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={addStaffMember}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                    boxShadow: "0 14px 34px rgba(75,46,131,0.22)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Staff
                </button>
              </div>

              <div className="space-y-6">
                {form.staff.map((member, index) => (
                  <div
                    key={member.id}
                    className="rounded-3xl p-5"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div>
                        <div className="font-black text-slate-950">
                          Staff Member {index + 1}
                        </div>
                        <div className="text-sm text-slate-500">
                          {member.name || "Unnamed staff member"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateStaff(member.id, "visible", !member.visible)
                          }
                          className="p-3 rounded-xl"
                          style={{
                            background: member.visible
                              ? "rgba(22,138,58,0.1)"
                              : "rgba(100,116,139,0.12)",
                            color: member.visible ? colors.green : "#64748B",
                            border: member.visible
                              ? "1px solid rgba(22,138,58,0.2)"
                              : "1px solid rgba(100,116,139,0.16)",
                          }}
                          title={member.visible ? "Visible" : "Hidden"}
                        >
                          {member.visible ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteStaffMember(member.id)}
                          className="p-3 rounded-xl"
                          style={{
                            background: "rgba(215,25,32,0.09)",
                            color: colors.red,
                            border: "1px solid rgba(215,25,32,0.18)",
                          }}
                          title="Delete staff"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-[180px_1fr] gap-5">
                      <div>
                        <div
                          className="rounded-2xl overflow-hidden bg-white mb-4"
                          style={{
                            border: "1px solid rgba(15,23,42,0.08)",
                          }}
                        >
                          {member.imageUrl ? (
                            <img
                              src={member.imageUrl}
                              alt={member.name}
                              className="w-full h-52 object-cover"
                            />
                          ) : (
                            <div className="w-full h-52 bg-slate-100 flex items-center justify-center">
                              <UserRound className="w-16 h-16 text-slate-300" />
                            </div>
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
                            {uploadingId === member.id
                              ? "Uploading..."
                              : "Upload Photo"}
                          </span>

                          <span className="text-xs text-slate-500 leading-relaxed">
                            Recommended: 800×1000 px portrait, PNG/JPG/WebP,
                            max 2 MB.
                          </span>

                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingId === member.id}
                            onChange={(e) => {
                              uploadStaffImage(member.id, e.target.files?.[0]);
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Field
                            label="Name"
                            value={member.name}
                            onChange={(value) =>
                              updateStaff(member.id, "name", value)
                            }
                          />

                          <Field
                            label="Position"
                            value={member.position}
                            onChange={(value) =>
                              updateStaff(member.id, "position", value)
                            }
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <Field
                            label="Qualification"
                            value={member.qualification}
                            onChange={(value) =>
                              updateStaff(member.id, "qualification", value)
                            }
                          />

                          <Field
                            label="Phone Number"
                            value={member.phone}
                            onChange={(value) =>
                              updateStaff(member.id, "phone", value)
                            }
                            placeholder="+977-98XXXXXXXX"
                          />
                        </div>

                        <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={member.visible !== false}
                            onChange={(e) =>
                              updateStaff(member.id, "visible", e.target.checked)
                            }
                            className="w-5 h-5"
                          />
                          Show this staff member on website
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
                Staff Page Preview
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
              <StaffPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}