import defaultSchoolLogo from "../assets/school-logo.jpeg";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Navigation,
  Image,
  Type,
  Link as LinkIcon,
  Eye,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultNavbarContent = {
  logoUrl: "",
  schoolName: "Baljagriti",
  schoolSubtitle: "Secondary English School",
  admissionButtonText: "Admission Open",
  admissionButtonLink: "/admissions",
  showAdmissionButton: true,
  links: [
    { id: "home", label: "Home", href: "/", visible: true },
    { id: "about", label: "About", href: "/about", visible: true },
    { id: "messages", label: "Messages", href: "/messages", visible: true },
    { id: "academics", label: "Academics", href: "/academics", visible: true },
    { id: "notices", label: "Notices", href: "/notices", visible: true },
    { id: "facilities", label: "Facilities", href: "/facilities", visible: true },
    { id: "staff", label: "Staff", href: "/staff", visible: true },
    { id: "gallery", label: "Gallery", href: "/gallery", visible: true },
    { id: "contact", label: "Contact", href: "/contact", visible: true },
  ],
};

function mergeNavbarContent(saved = {}) {
  const savedLinks = Array.isArray(saved.links) ? saved.links : [];

  return {
    ...defaultNavbarContent,
    ...saved,
    links: defaultNavbarContent.links.map((defaultLink) => {
      const savedLink = savedLinks.find((link) => link.id === defaultLink.id);

      return {
        ...defaultLink,
        ...(savedLink || {}),
        visible: savedLink?.visible !== false,
      };
    }),
  };
}

function Field({ label, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <input
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

function EditorCard({ icon: Icon, title, color, children }) {
  return (
    <div
      className="rounded-3xl p-6 md:p-8"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.76))",
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

function NavbarPreview({ form }) {
  const visibleLinks = form.links.filter((link) => link.visible);
  const previewLogo = form.logoUrl || defaultSchoolLogo;

  return (
    <div
      className="min-h-full p-6 flex items-start justify-center"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(56,189,248,0.16), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
      }}
    >
      <div
        className="w-full rounded-[1.7rem] px-5 py-4"
        style={{
          background:
            "linear-gradient(145deg, rgba(2,6,23,0.94), rgba(15,23,42,0.86))",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 22px 62px rgba(0,0,0,0.32)",
          backdropFilter: "blur(22px)",
        }}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl bg-white overflow-hidden flex items-center justify-center"
              style={{
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow:
                  "0 0 0 3px rgba(34,197,94,0.2), 0 14px 34px rgba(34,197,94,0.22)",
              }}
            >
              <img
                src={previewLogo}
                alt={form.schoolName || "School logo"}
                className="w-full h-full object-contain p-1"
              />
            </div>

            <div>
              <div
                className="font-bold text-xl leading-tight text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {form.schoolName || "School Name"}
              </div>

              <div
                className="text-sm leading-tight"
                style={{ color: colors.green }}
              >
                {form.schoolSubtitle || "School Subtitle"}
              </div>
            </div>
          </div>

          <div
            className="flex flex-wrap gap-2 rounded-2xl p-2"
            style={{
              background: "rgba(255,255,255,0.055)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {visibleLinks.map((link, index) => (
              <div
                key={link.id}
                className="px-3 py-2 rounded-xl text-sm font-medium"
                style={{
                  color: index === 0 ? "#020617" : "rgba(255,255,255,0.84)",
                  background:
                    index === 0
                      ? `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`
                      : "transparent",
                }}
              >
                {link.label}
              </div>
            ))}
          </div>

          {form.showAdmissionButton && (
            <div>
              <div
                className="inline-flex px-6 py-3 rounded-2xl text-sm font-bold text-slate-950"
                style={{
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                  boxShadow:
                    "0 18px 42px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.42)",
                }}
              >
                {form.admissionButtonText || "Admission Open"} →
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminNavbar() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultNavbarContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadNavbarContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/navbar"
        );

        const savedContent = res.data?.data?.content || {};
        setForm(mergeNavbarContent(savedContent));
      } catch (err) {
        console.error("Load navbar content error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNavbarContent();
  }, []);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateLink = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      links: prev.links.map((link) =>
        link.id === id
          ? {
              ...link,
              [name]: value,
            }
          : link
      ),
    }));
  };

  const uploadLogoImage = async (file) => {
  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 2 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    setError("Please upload only PNG, JPG, or WebP image.");
    return;
  }

  if (file.size > maxSize) {
    setError("Logo image must be less than 2 MB.");
    return;
  }

    setSuccess("");
    setError("");
    setUploadingLogo(true);

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

      updateField("logoUrl", uploadedUrl);
      setSuccess("Logo uploaded successfully. Click Save Changes to store it.");
    } catch (err) {
      console.error("Logo upload error:", err);
      setError(err.response?.data?.message || "Logo upload failed.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeCustomLogo = () => {
    updateField("logoUrl", "");
    setSuccess("Custom logo removed. Click Save Changes to keep default logo.");
    setError("");
  };

  async function saveNavbarContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/navbar",
        {
          content: form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Navbar content saved successfully.");
    } catch (err) {
      console.error("Save navbar content error:", err);
      setError(err.response?.data?.message || "Could not save navbar content.");
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
          Loading navbar editor...
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
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Site
            </a>

            <button
              type="button"
              onClick={saveNavbarContent}
              disabled={saving || uploadingLogo}
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
              background: "rgba(56,189,248,0.1)",
              color: "#0284C7",
              border: "1px solid rgba(56,189,248,0.2)",
            }}
          >
            <Navigation className="w-4 h-4" />
            Manage Navbar
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
            Edit Navbar Content
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Edit school logo, school name, existing menu labels, existing menu
            links, visibility, and admission button.
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

        <div className="grid xl:grid-cols-[760px_1fr] gap-8 items-start">
          <div className="space-y-8">
            <EditorCard
              icon={Image}
              title="Logo and School Name"
              color={colors.green}
            >
              <div className="grid gap-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">
                    Upload Logo Image
                  </label>

                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: "rgba(255,255,255,0.72)",
                      border: "1px dashed rgba(75,46,131,0.28)",
                    }}
                  >
                    <label
                      className="flex flex-col items-center justify-center gap-3 cursor-pointer text-center"
                      style={{ color: colors.dark }}
                    >
                      <UploadCloud
                        className="w-8 h-8"
                        style={{ color: colors.purple }}
                      />

                      <span className="font-bold">
                        {uploadingLogo
                          ? "Uploading logo..."
                          : "Choose logo image"}
                      </span>

                      <span className="text-sm text-slate-500 leading-relaxed">
  Recommended: 512×512 px square logo, PNG/JPG/WebP, max 2 MB.
  Transparent PNG works best. Image uploads to ImageKit, then click Save Changes.
</span>

                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingLogo}
                        onChange={(e) => {
                          uploadLogoImage(e.target.files?.[0]);
                          e.target.value = "";
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <Field
                  label="Uploaded ImageKit URL"
                  value={form.logoUrl}
                  onChange={(value) => updateField("logoUrl", value)}
                  placeholder="ImageKit URL will appear here after upload."
                />

                <div
                  className="rounded-2xl p-4 bg-white flex items-center justify-between gap-5"
                  style={{ border: "1px solid rgba(11,16,32,0.08)" }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={form.logoUrl || defaultSchoolLogo}
                      alt="Navbar logo preview"
                      className="w-24 h-24 object-contain rounded-xl bg-white"
                    />

                    <div>
                      <div className="font-bold text-slate-900">
                        {form.logoUrl ? "Custom Uploaded Logo" : "Default Logo"}
                      </div>

                      <div className="text-sm text-slate-500">
                        {form.logoUrl
                          ? "This uploaded ImageKit logo will be used."
                          : "Default local logo will be used."}
                      </div>
                    </div>
                  </div>

                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={removeCustomLogo}
                      className="px-4 py-2 rounded-xl text-sm font-bold"
                      style={{
                        background: "rgba(215,25,32,0.08)",
                        color: colors.red,
                        border: "1px solid rgba(215,25,32,0.18)",
                      }}
                    >
                      Use Default
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="School Name"
                    value={form.schoolName}
                    onChange={(value) => updateField("schoolName", value)}
                  />

                  <Field
                    label="School Subtitle"
                    value={form.schoolSubtitle}
                    onChange={(value) => updateField("schoolSubtitle", value)}
                  />
                </div>
              </div>
            </EditorCard>

            <EditorCard
              icon={LinkIcon}
              title="Admission Button"
              color={colors.gold}
            >
              <div className="grid md:grid-cols-2 gap-5">
                <Field
                  label="Admission Button Text"
                  value={form.admissionButtonText}
                  onChange={(value) =>
                    updateField("admissionButtonText", value)
                  }
                />

                <Field
                  label="Admission Button Link"
                  value={form.admissionButtonLink}
                  onChange={(value) =>
                    updateField("admissionButtonLink", value)
                  }
                />
              </div>

              <label className="mt-5 flex items-center gap-3 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.showAdmissionButton}
                  onChange={(e) =>
                    updateField("showAdmissionButton", e.target.checked)
                  }
                  className="w-5 h-5"
                />
                Show admission button
              </label>
            </EditorCard>

            <EditorCard icon={Type} title="Menu Links" color={colors.purple}>
              <div className="space-y-4">
                {form.links.map((link, index) => (
                  <div
                    key={link.id}
                    className="rounded-2xl p-4"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="font-bold text-slate-900">
                        Menu Item {index + 1}
                      </div>

                      <div
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: "rgba(75,46,131,0.08)",
                          color: colors.purple,
                          border: "1px solid rgba(75,46,131,0.14)",
                        }}
                      >
                        Fixed Route
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Label"
                        value={link.label}
                        onChange={(value) =>
                          updateLink(link.id, "label", value)
                        }
                      />

                      <Field
                        label="Link"
                        value={link.href}
                        onChange={(value) => updateLink(link.id, "href", value)}
                      />
                    </div>

                    <label className="mt-4 flex items-center gap-3 text-sm font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={link.visible}
                        onChange={(e) =>
                          updateLink(link.id, "visible", e.target.checked)
                        }
                        className="w-5 h-5"
                      />
                      Show this menu item
                    </label>
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
                Navbar Preview
              </div>

              <div className="text-sm text-white/55">
                This preview updates live while typing.
              </div>
            </div>

            <div
              className="bg-white overflow-y-auto"
              style={{
                height: "760px",
              }}
            >
              <NavbarPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}