import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Contact,
  Type,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  Eye,
  MessageSquare,
  Map,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
  lightPurple: "#F1ECFF",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultContactContent = {
  badgeText: "Get In Touch",
  title: "We'd Love to Hear From You",
  highlightedText: "Hear From You",
  subtitle:
    "Questions about admissions, curriculum, or school life? Our team is here to help.",
  contactInfo: [
    {
      id: "address",
      icon: "map",
      label: "Address",
      value: "Basudev Marga, Hetauda Sub-Metropolitan City, Ward No. 2",
      color: "#D71920",
    },
    {
      id: "phone",
      icon: "phone",
      label: "Phone",
      value: "057-590144, 057-590145, 057-590146",
      color: "#168A3A",
    },
    {
      id: "email",
      icon: "mail",
      label: "Email",
      value: "infobjess2046@gmail.com",
      color: "#4B2E83",
    },
    {
      id: "school",
      icon: "clock",
      label: "School",
      value: "Baljagriti Secondary English Boarding School",
      color: "#7C5CC4",
    },
  ],
  mapCard: {
    title: "Baljagriti Campus",
    address: "Basudev Marga, Hetauda, Makawanpur",
    buttonText: "Open in Maps",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Basudev+Marga+Hetauda+Makwanpur+Nepal",
  },
  form: {
    title: "Send a Message",
    nameLabel: "Your Name",
    namePlaceholder: "Your full name",
    emailLabel: "Email Address",
    emailPlaceholder: "your@email.com",
    subjectLabel: "Subject",
    subjectPlaceholder: "Admissions inquiry",
    messageLabel: "Message",
    messagePlaceholder: "Tell us how we can help you...",
    buttonText: "Send Message",
    sendingText: "Sending...",
    successMessage: "Message sent successfully!",
    errorMessage: "Message could not be sent. Please try again.",
  },
};

function mergeContactContent(saved = {}) {
  return {
    ...defaultContactContent,
    ...saved,
    contactInfo:
      Array.isArray(saved.contactInfo) && saved.contactInfo.length
        ? saved.contactInfo
        : defaultContactContent.contactInfo,
    mapCard: {
      ...defaultContactContent.mapCard,
      ...(saved.mapCard || {}),
    },
    form: {
      ...defaultContactContent.form,
      ...(saved.form || {}),
    },
  };
}

function getContactIcon(icon) {
  if (icon === "phone") return Phone;
  if (icon === "mail") return Mail;
  if (icon === "clock") return Clock;
  return MapPin;
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

function ContactPreview({ form }) {
  return (
    <div
      className="min-h-full p-6"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(75,46,131,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
      }}
    >
      <div className="text-center mb-8">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
          style={{
            background: "rgba(215,25,32,0.09)",
            color: colors.red,
            border: "1px solid rgba(215,25,32,0.22)",
          }}
        >
          {form.badgeText}
        </span>

        <h3
          className="text-4xl leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            color: colors.dark,
          }}
        >
          {form.title}
        </h3>

        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          {form.subtitle}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {form.contactInfo.map((info) => {
          const Icon = getContactIcon(info.icon);

          return (
            <div
              key={info.id}
              className="flex gap-4 p-4 rounded-2xl bg-white"
              style={{
                border: `1px solid ${info.color}22`,
                boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `${info.color}14`,
                  color: info.color,
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <div className="text-xs font-bold uppercase text-slate-400">
                  {info.label}
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {info.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="rounded-3xl p-6 text-center"
        style={{
          background: "linear-gradient(135deg, #020617, #1E1B4B)",
          boxShadow: "0 18px 42px rgba(15,23,42,0.22)",
        }}
      >
        <MapPin className="w-8 h-8 mx-auto mb-3" style={{ color: colors.gold }} />
        <div className="text-white font-bold">{form.mapCard.title}</div>
        <div className="text-white/60 text-xs mt-1">{form.mapCard.address}</div>
      </div>

      <div
        className="mt-6 rounded-3xl p-6 bg-white"
        style={{
          border: "1px solid rgba(75,46,131,0.14)",
          boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
        }}
      >
        <div className="font-bold text-slate-950 mb-4">{form.form.title}</div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-400">
            {form.form.namePlaceholder}
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-400">
            {form.form.emailPlaceholder}
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-400 mb-3">
          {form.form.subjectPlaceholder}
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-400 mb-4">
          {form.form.messagePlaceholder}
        </div>
        <div
          className="rounded-2xl py-3 text-center font-bold text-sm"
          style={{
            color: "#020617",
            background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
          }}
        >
          {form.form.buttonText}
        </div>
      </div>
    </div>
  );
}

export default function AdminContact() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultContactContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadContactContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/contact"
        );

        const savedContent = res.data?.data?.content || {};
        setForm(mergeContactContent(savedContent));
      } catch (err) {
        console.error("Load contact content error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContactContent();
  }, []);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateContactInfo = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      contactInfo: prev.contactInfo.map((item) =>
        item.id === id
          ? {
              ...item,
              [name]: value,
            }
          : item
      ),
    }));
  };

  const updateMapCard = (name, value) => {
    setForm((prev) => ({
      ...prev,
      mapCard: {
        ...prev.mapCard,
        [name]: value,
      },
    }));
  };

  const updateForm = (name, value) => {
    setForm((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [name]: value,
      },
    }));
  };

  async function saveContactContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/contact",
        {
          content: form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Contact page content saved successfully.");
    } catch (err) {
      console.error("Save contact content error:", err);
      setError(err.response?.data?.message || "Could not save contact content.");
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
          Loading contact editor...
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
              href="/contact"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Contact Page
            </a>

            <button
              type="button"
              onClick={saveContactContent}
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
              background: "rgba(215,25,32,0.1)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.2)",
            }}
          >
            <Contact className="w-4 h-4" />
            Manage Contact Page
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
            Edit Contact Page
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Edit contact heading, address, phone, email, school details, map
            card, and public message form text.
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
            <EditorCard icon={Type} title="Top Heading Section" color={colors.red}>
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
                    label="Purple Italic Highlight Text"
                    value={form.highlightedText}
                    onChange={(value) => updateField("highlightedText", value)}
                    placeholder="Example: Hear From You"
                  />
                </div>

                <TextArea
                  label="Subtitle"
                  value={form.subtitle}
                  onChange={(value) => updateField("subtitle", value)}
                />
              </div>
            </EditorCard>

            <EditorCard icon={MapPin} title="Contact Information Cards" color={colors.green}>
              <div className="space-y-5">
                {form.contactInfo.map((info, index) => (
                  <div
                    key={info.id}
                    className="rounded-2xl p-5"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="font-black text-slate-950 mb-4">
                      Contact Card {index + 1}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Label"
                        value={info.label}
                        onChange={(value) =>
                          updateContactInfo(info.id, "label", value)
                        }
                      />

                      <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700">
                          Icon
                        </label>

                        <select
                          value={info.icon}
                          onChange={(e) =>
                            updateContactInfo(info.id, "icon", e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                          style={{
                            background: "rgba(255,255,255,0.88)",
                            border: "1px solid rgba(75,46,131,0.16)",
                            color: colors.dark,
                          }}
                        >
                          <option value="map">Map Pin</option>
                          <option value="phone">Phone</option>
                          <option value="mail">Mail</option>
                          <option value="clock">Clock</option>
                        </select>
                      </div>

                      <Field
                        label="Color"
                        type="color"
                        value={info.color}
                        onChange={(value) =>
                          updateContactInfo(info.id, "color", value)
                        }
                      />
                    </div>

                    <div className="mt-4">
                      <TextArea
                        label="Value"
                        value={info.value}
                        onChange={(value) =>
                          updateContactInfo(info.id, "value", value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>

            <EditorCard icon={Map} title="Map Card" color={colors.purple}>
              <div className="grid gap-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="Map Card Title"
                    value={form.mapCard.title}
                    onChange={(value) => updateMapCard("title", value)}
                  />

                  <Field
                    label="Button Text"
                    value={form.mapCard.buttonText}
                    onChange={(value) => updateMapCard("buttonText", value)}
                  />
                </div>

                <Field
                  label="Map Card Address"
                  value={form.mapCard.address}
                  onChange={(value) => updateMapCard("address", value)}
                />

                <Field
                  label="Google Map Link"
                  value={form.mapCard.mapUrl}
                  onChange={(value) => updateMapCard("mapUrl", value)}
                  placeholder="Paste Google Maps link here"
                />
              </div>
            </EditorCard>

            <EditorCard icon={MessageSquare} title="Message Form Text" color={colors.gold}>
              <div className="grid gap-5">
                <Field
                  label="Form Title"
                  value={form.form.title}
                  onChange={(value) => updateForm("title", value)}
                />

                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="Name Label"
                    value={form.form.nameLabel}
                    onChange={(value) => updateForm("nameLabel", value)}
                  />

                  <Field
                    label="Name Placeholder"
                    value={form.form.namePlaceholder}
                    onChange={(value) => updateForm("namePlaceholder", value)}
                  />

                  <Field
                    label="Email Label"
                    value={form.form.emailLabel}
                    onChange={(value) => updateForm("emailLabel", value)}
                  />

                  <Field
                    label="Email Placeholder"
                    value={form.form.emailPlaceholder}
                    onChange={(value) => updateForm("emailPlaceholder", value)}
                  />

                  <Field
                    label="Subject Label"
                    value={form.form.subjectLabel}
                    onChange={(value) => updateForm("subjectLabel", value)}
                  />

                  <Field
                    label="Subject Placeholder"
                    value={form.form.subjectPlaceholder}
                    onChange={(value) => updateForm("subjectPlaceholder", value)}
                  />

                  <Field
                    label="Message Label"
                    value={form.form.messageLabel}
                    onChange={(value) => updateForm("messageLabel", value)}
                  />

                  <Field
                    label="Button Text"
                    value={form.form.buttonText}
                    onChange={(value) => updateForm("buttonText", value)}
                  />
                </div>

                <TextArea
                  label="Message Placeholder"
                  value={form.form.messagePlaceholder}
                  onChange={(value) => updateForm("messagePlaceholder", value)}
                />

                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="Sending Text"
                    value={form.form.sendingText}
                    onChange={(value) => updateForm("sendingText", value)}
                  />

                  <Field
                    label="Success Message"
                    value={form.form.successMessage}
                    onChange={(value) => updateForm("successMessage", value)}
                  />
                </div>

                <Field
                  label="Error Message"
                  value={form.form.errorMessage}
                  onChange={(value) => updateForm("errorMessage", value)}
                />
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
                Contact Page Preview
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
              <ContactPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}