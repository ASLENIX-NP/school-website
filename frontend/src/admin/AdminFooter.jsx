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
  Footprints,
  Type,
  Link as LinkIcon,
  Phone,
  Share2,
  Image as ImageIcon,
  X,
} from "lucide-react";

const colors = {
  green: "#168A3A",
  purple: "#4B2E83",
  red: "#D71920",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultFooterContent = {
  logoUrl: "",
  schoolName: "Baljagriti",
  schoolSubtitle: "Secondary English Boarding School",
  admissionBadgeText: "Admissions Open 2026",
  showAdmissionBadge: true,

  navLinks: [
    { id: 1, label: "About", href: "/about", visible: true },
    { id: 2, label: "Academics", href: "/academics", visible: true },
    { id: 3, label: "Facilities", href: "/facilities", visible: true },
    { id: 4, label: "Gallery", href: "/gallery", visible: true },
    { id: 5, label: "Contact", href: "/contact", visible: true },
  ],

  socials: [
    {
      id: 1,
      type: "facebook",
      href: "https://www.facebook.com/baljagritiesschool",
      label: "Facebook",
      visible: true,
    },
    {
      id: 2,
      type: "website",
      href: "https://baljagriti.edu.np/",
      label: "Website",
      visible: true,
    },
    {
      id: 3,
      type: "youtube",
      href: "https://www.youtube.com/@BaljagritiEngSecondarySchool",
      label: "YouTube",
      visible: true,
    },
  ],

  contact: {
    address: "Basudev Marga, Hetauda-2, Makawanpur, Nepal",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Baljagriti+English+Secondary+School+Hetauda",
    phones: ["057-590144", "057-590145", "057-590146"],
    email: "infobjess2046@gmail.com",
  },

  modalTitle: "Contact Baljagriti School",
  modalHint: "Click any number to copy it.",
  copiedText: "Copied",
  closeButtonText: "Close",

  copyrightText:
    "© 2026 Baljagriti Secondary English Boarding School. All rights reserved.",
};

function mergeFooterContent(saved = {}) {
  return {
    ...defaultFooterContent,
    ...saved,
    navLinks: Array.isArray(saved.navLinks)
      ? saved.navLinks
      : defaultFooterContent.navLinks,
    socials: Array.isArray(saved.socials)
      ? saved.socials
      : defaultFooterContent.socials,
    contact: {
      ...defaultFooterContent.contact,
      ...(saved.contact || {}),
      phones: Array.isArray(saved.contact?.phones)
        ? saved.contact.phones
        : defaultFooterContent.contact.phones,
    },
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

function VisibilityDeleteControls({ visible, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className="p-3 rounded-xl"
        style={{
          background:
            visible !== false ? "rgba(22,138,58,0.1)" : "rgba(100,116,139,0.12)",
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

function FooterPreview({ form }) {
  const visibleLinks = form.navLinks.filter((link) => link.visible !== false);
  const visibleSocials = form.socials.filter((social) => social.visible !== false);

  return (
    <div
      className="p-6"
      style={{
        background:
          "linear-gradient(135deg, #020617 0%, #07111F 55%, #0F172A 100%)",
      }}
    >
      <div
        className="rounded-[32px] p-6 border border-white/10"
        style={{
          background:
            "linear-gradient(145deg, rgba(4,12,30,0.92), rgba(9,20,45,0.95))",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden">
            {form.logoUrl ? (
              <img
                src={form.logoUrl}
                alt={form.schoolName}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <ImageIcon className="w-7 h-7 text-slate-900" />
            )}
          </div>

          <div>
            <div className="text-white text-xl font-black">{form.schoolName}</div>
            <div className="text-green-400 text-sm">{form.schoolSubtitle}</div>
            {form.showAdmissionBadge && (
              <div className="text-green-400 text-xs mt-1">
                ● {form.admissionBadgeText}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {visibleLinks.map((link) => (
            <span
              key={link.id}
              className="px-4 py-2 rounded-xl text-sm"
              style={{
                color: "rgba(226,232,240,0.72)",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              {link.label}
            </span>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {visibleSocials.map((social) => (
            <span
              key={social.id}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {social.label.slice(0, 1)}
            </span>
          ))}
        </div>

        <div
          className="pt-5 border-t space-y-3 text-sm"
          style={{
            borderColor: "rgba(255,255,255,0.09)",
            color: "rgba(226,232,240,0.58)",
          }}
        >
          <div>📍 {form.contact.address}</div>
          <div>📞 {form.contact.phones.join(", ")}</div>
          <div>✉️ {form.contact.email}</div>
        </div>

        <div className="mt-6 text-xs text-center text-slate-500">
          {form.copyrightText}
        </div>
      </div>
    </div>
  );
}

export default function AdminFooter() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultFooterContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadFooterContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/footer");
        const savedContent = res.data?.data?.content || {};
        setForm(mergeFooterContent(savedContent));
      } catch (err) {
        console.error("Load footer content error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFooterContent();
  }, []);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateContact = (name, value) => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value,
      },
    }));
  };

  const updatePhone = (index, value) => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        phones: prev.contact.phones.map((phone, i) =>
          i === index ? value : phone
        ),
      },
    }));
  };

  const addPhone = () => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        phones: [...prev.contact.phones, ""],
      },
    }));
  };

  const deletePhone = (index) => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        phones: prev.contact.phones.filter((_, i) => i !== index),
      },
    }));
  };

  const updateNavLink = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      navLinks: prev.navLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addNavLink = () => {
    setForm((prev) => ({
      ...prev,
      navLinks: [
        ...prev.navLinks,
        {
          id: Date.now(),
          label: "New Link",
          href: "/",
          visible: true,
        },
      ],
    }));
  };

  const deleteNavLink = (id) => {
    setForm((prev) => ({
      ...prev,
      navLinks: prev.navLinks.filter((link) => link.id !== id),
    }));
  };

  const updateSocial = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      socials: prev.socials.map((social) =>
        social.id === id ? { ...social, [field]: value } : social
      ),
    }));
  };

  const addSocial = () => {
    setForm((prev) => ({
      ...prev,
      socials: [
        ...prev.socials,
        {
          id: Date.now(),
          type: "website",
          label: "Website",
          href: "",
          visible: true,
        },
      ],
    }));
  };

  const deleteSocial = (id) => {
    setForm((prev) => ({
      ...prev,
      socials: prev.socials.filter((social) => social.id !== id),
    }));
  };

  const uploadLogo = async (file) => {
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
        setError("Logo uploaded but backend did not return image URL.");
        return;
      }

      updateField("logoUrl", uploadedUrl);
      setSuccess("Footer logo uploaded successfully. Click Save Changes.");
    } catch (err) {
      console.error("Footer logo upload error:", err);
      setError(err.response?.data?.message || "Footer logo upload failed.");
    } finally {
      setUploadingLogo(false);
    }
  };

  async function saveFooterContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/footer",
        { content: form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Footer content saved successfully.");
    } catch (err) {
      console.error("Save footer content error:", err);
      setError(err.response?.data?.message || "Could not save footer content.");
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
          Loading footer editor...
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
              View Website
            </a>

            <button
              type="button"
              onClick={saveFooterContent}
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
              background: "rgba(22,138,58,0.1)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.2)",
            }}
          >
            <Footprints className="w-4 h-4" />
            Manage Footer
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
            Edit Footer
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Edit footer logo, school text, quick links, social links, contact
            details, phone popup, and copyright.
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
            <EditorCard icon={Type} title="School Identity" color={colors.green}>
              <div className="grid gap-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">
                    Footer Logo
                  </label>

                  <div
                    className="rounded-2xl overflow-hidden bg-white mb-4 relative"
                    style={{ border: "1px solid rgba(15,23,42,0.08)" }}
                  >
                    {form.logoUrl ? (
                      <>
                        <img
                          src={form.logoUrl}
                          alt={form.schoolName}
                          className="w-full h-44 object-contain p-4"
                        />

                        <button
                          type="button"
                          onClick={() => updateField("logoUrl", "")}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                          title="Remove logo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-44 bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-slate-300" />
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
                      {uploadingLogo ? "Uploading..." : "Upload Logo"}
                    </span>

                    <span className="text-xs text-slate-500 leading-relaxed">
                      Recommended: 512×512 px square PNG/JPG/WebP, max 2 MB.
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingLogo}
                      onChange={(e) => {
                        uploadLogo(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

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

                <Field
                  label="Admission Badge Text"
                  value={form.admissionBadgeText}
                  onChange={(value) => updateField("admissionBadgeText", value)}
                />

                <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.showAdmissionBadge}
                    onChange={(e) =>
                      updateField("showAdmissionBadge", e.target.checked)
                    }
                    className="w-5 h-5"
                  />
                  Show admission badge below school name
                </label>
              </div>
            </EditorCard>

            <EditorCard icon={LinkIcon} title="Footer Navigation Links" color={colors.gold}>
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={addNavLink}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Link
                </button>
              </div>

              <div className="space-y-5">
                {form.navLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="rounded-3xl p-5"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="font-black text-slate-950">
                          Link {index + 1}
                        </div>
                        <div className="text-sm text-slate-500">
                          {link.label}
                        </div>
                      </div>

                      <VisibilityDeleteControls
                        visible={link.visible}
                        onToggle={() =>
                          updateNavLink(link.id, "visible", !link.visible)
                        }
                        onDelete={() => deleteNavLink(link.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Label"
                        value={link.label}
                        onChange={(value) =>
                          updateNavLink(link.id, "label", value)
                        }
                      />

                      <Field
                        label="Link"
                        value={link.href}
                        onChange={(value) =>
                          updateNavLink(link.id, "href", value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>

            <EditorCard icon={Share2} title="Social Links" color={colors.purple}>
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={addSocial}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Social
                </button>
              </div>

              <div className="space-y-5">
                {form.socials.map((social, index) => (
                  <div
                    key={social.id}
                    className="rounded-3xl p-5"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="font-black text-slate-950">
                          Social {index + 1}
                        </div>
                        <div className="text-sm text-slate-500">
                          {social.label}
                        </div>
                      </div>

                      <VisibilityDeleteControls
                        visible={social.visible}
                        onToggle={() =>
                          updateSocial(social.id, "visible", !social.visible)
                        }
                        onDelete={() => deleteSocial(social.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Label"
                        value={social.label}
                        onChange={(value) =>
                          updateSocial(social.id, "label", value)
                        }
                      />

                      <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700">
                          Type
                        </label>

                        <select
                          value={social.type}
                          onChange={(e) =>
                            updateSocial(social.id, "type", e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                          style={{
                            background: "rgba(255,255,255,0.88)",
                            border: "1px solid rgba(75,46,131,0.16)",
                            color: colors.dark,
                          }}
                        >
                          <option value="facebook">Facebook</option>
                          <option value="youtube">YouTube</option>
                          <option value="website">Website</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <Field
                          label="URL"
                          value={social.href}
                          onChange={(value) =>
                            updateSocial(social.id, "href", value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>

            <EditorCard icon={Phone} title="Contact Details" color={colors.green}>
              <div className="grid gap-5">
                <Field
                  label="Address"
                  value={form.contact.address}
                  onChange={(value) => updateContact("address", value)}
                />

                <TextArea
                  label="Google Map URL"
                  value={form.contact.mapUrl}
                  onChange={(value) => updateContact("mapUrl", value)}
                  rows={3}
                />

                <Field
                  label="Email"
                  value={form.contact.email}
                  onChange={(value) => updateContact("email", value)}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-bold text-slate-700">
                      Phone Numbers
                    </label>

                    <button
                      type="button"
                      onClick={addPhone}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Phone
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.contact.phones.map((phone, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          value={phone}
                          onChange={(e) => updatePhone(index, e.target.value)}
                          placeholder="Phone number"
                          className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                          style={{
                            background: "rgba(255,255,255,0.88)",
                            border: "1px solid rgba(75,46,131,0.16)",
                            color: colors.dark,
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => deletePhone(index)}
                          className="px-4 rounded-2xl"
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
                </div>
              </div>
            </EditorCard>

            <EditorCard icon={Phone} title="Phone Popup Text" color={colors.red}>
              <div className="grid gap-5">
                <Field
                  label="Popup Title"
                  value={form.modalTitle}
                  onChange={(value) => updateField("modalTitle", value)}
                />

                <Field
                  label="Popup Hint"
                  value={form.modalHint}
                  onChange={(value) => updateField("modalHint", value)}
                />

                <Field
                  label="Copied Text"
                  value={form.copiedText}
                  onChange={(value) => updateField("copiedText", value)}
                />

                <Field
                  label="Close Button Text"
                  value={form.closeButtonText}
                  onChange={(value) => updateField("closeButtonText", value)}
                />
              </div>
            </EditorCard>

            <EditorCard icon={Footprints} title="Copyright" color={colors.purple}>
              <TextArea
                label="Copyright Text"
                value={form.copyrightText}
                onChange={(value) => updateField("copyrightText", value)}
                rows={3}
              />
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
                Footer Preview
              </div>

              <div className="text-sm text-white/55">
                Full preview updates while editing.
              </div>
            </div>

            <div className="bg-white">
              <FooterPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}