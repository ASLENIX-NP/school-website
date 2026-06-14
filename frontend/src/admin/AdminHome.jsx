import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Home,
  Image,
  Type,
  Link as LinkIcon,
  CheckCircle2,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultHomeContent = {
  hero: {
    badge: "Admissions Open for New Academic Session",
    titleLine1: "Baljagriti Secondary",
    titleLine2: "English School",
    titleLine3: "Hetauda-2, Makwanpur",
    description:
      "Baljagriti Secondary English School blends academic discipline, digital learning, creativity, sports, and values for students from Play Group to Grade 10.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1100&h=900&fit=crop&auto=format",

    primaryButtonText: "Start Admission",
    primaryButtonLink: "/admissions",
    secondaryButtonText: "Explore Facilities",
    secondaryButtonLink: "/facilities",

    stat1Value: "2046 BS",
    stat1Label: "Established",
    stat2Value: "PG-10",
    stat2Label: "Classes",
    stat3Value: "Hetauda",
    stat3Label: "Makwanpur",

    imageLocation: "Hetauda-2, Makwanpur",
    imageBottomTitle: "Basudev Marga, Hetauda-2",
    imageBottomDescription:
      "A learning environment built for academics, values, creativity, and student growth.",

    floating1Title: "Quality Education",
    floating1Subtitle: "Academics + Values",
    floating2Title: "Computer Lab",
    floating2Subtitle: "Digital Facility",
    floating3Title: "Science Lab",
    floating3Subtitle: "Practical Learning",
    floating4Title: "E-Library",
    floating4Subtitle: "Learning Resources",
  },
};

function Field({ label, name, value, onChange, textarea = false }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
          style={{
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
          }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
          style={{
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
          }}
        />
      )}
    </div>
  );
}

export default function AdminHome() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultHomeContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/home");

        const savedContent = res.data?.data?.content || {};

        setForm({
          ...defaultHomeContent,
          ...savedContent,
          hero: {
            ...defaultHomeContent.hero,
            ...(savedContent.hero || {}),
          },
        });
      } catch (err) {
        console.error("Load home content error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeContent();
  }, []);

  const updateHeroField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [name]: value,
      },
    }));
  };

  const saveHomeContent = async () => {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/home",
        {
          content: form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Home hero content saved successfully.");
    } catch (err) {
      console.error("Save home content error:", err);
      setError(err.response?.data?.message || "Could not save home content.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFF8EE" }}
      >
        <div className="text-slate-600 font-semibold">Loading home editor...</div>
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

          <button
            type="button"
            onClick={saveHomeContent}
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
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(56,189,248,0.1)",
              color: "#0284C7",
              border: "1px solid rgba(56,189,248,0.2)",
            }}
          >
            <Home className="w-4 h-4" />
            Manage Home
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
            Edit Homepage Hero
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            These fields control the public homepage hero section. After saving,
            refresh the home page to see the updated content.
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

        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
          <div className="space-y-8">
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
                <Type className="w-5 h-5" style={{ color: colors.purple }} />
                <h2 className="text-2xl font-bold text-slate-900">
                  Hero Text
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Field
                  label="Badge Text"
                  name="badge"
                  value={form.hero.badge}
                  onChange={updateHeroField}
                />
                <Field
                  label="Title Line 1"
                  name="titleLine1"
                  value={form.hero.titleLine1}
                  onChange={updateHeroField}
                />
                <Field
                  label="Title Line 2"
                  name="titleLine2"
                  value={form.hero.titleLine2}
                  onChange={updateHeroField}
                />
                <Field
                  label="Title Line 3"
                  name="titleLine3"
                  value={form.hero.titleLine3}
                  onChange={updateHeroField}
                />
              </div>

              <div className="mt-5">
                <Field
                  label="Description"
                  name="description"
                  value={form.hero.description}
                  onChange={updateHeroField}
                  textarea
                />
              </div>
            </div>

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
                <Image className="w-5 h-5" style={{ color: colors.green }} />
                <h2 className="text-2xl font-bold text-slate-900">
                  Hero Image and Image Text
                </h2>
              </div>

              <div className="grid gap-5">
                <Field
                  label="Hero Image URL"
                  name="image"
                  value={form.hero.image}
                  onChange={updateHeroField}
                />
                <Field
                  label="Image Location"
                  name="imageLocation"
                  value={form.hero.imageLocation}
                  onChange={updateHeroField}
                />
                <Field
                  label="Image Bottom Title"
                  name="imageBottomTitle"
                  value={form.hero.imageBottomTitle}
                  onChange={updateHeroField}
                />
                <Field
                  label="Image Bottom Description"
                  name="imageBottomDescription"
                  value={form.hero.imageBottomDescription}
                  onChange={updateHeroField}
                  textarea
                />
              </div>
            </div>

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
                <LinkIcon className="w-5 h-5" style={{ color: colors.red }} />
                <h2 className="text-2xl font-bold text-slate-900">
                  Buttons and Stats
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Field
                  label="Primary Button Text"
                  name="primaryButtonText"
                  value={form.hero.primaryButtonText}
                  onChange={updateHeroField}
                />
                <Field
                  label="Primary Button Link"
                  name="primaryButtonLink"
                  value={form.hero.primaryButtonLink}
                  onChange={updateHeroField}
                />
                <Field
                  label="Secondary Button Text"
                  name="secondaryButtonText"
                  value={form.hero.secondaryButtonText}
                  onChange={updateHeroField}
                />
                <Field
                  label="Secondary Button Link"
                  name="secondaryButtonLink"
                  value={form.hero.secondaryButtonLink}
                  onChange={updateHeroField}
                />

                <Field
                  label="Stat 1 Value"
                  name="stat1Value"
                  value={form.hero.stat1Value}
                  onChange={updateHeroField}
                />
                <Field
                  label="Stat 1 Label"
                  name="stat1Label"
                  value={form.hero.stat1Label}
                  onChange={updateHeroField}
                />
                <Field
                  label="Stat 2 Value"
                  name="stat2Value"
                  value={form.hero.stat2Value}
                  onChange={updateHeroField}
                />
                <Field
                  label="Stat 2 Label"
                  name="stat2Label"
                  value={form.hero.stat2Label}
                  onChange={updateHeroField}
                />
                <Field
                  label="Stat 3 Value"
                  name="stat3Value"
                  value={form.hero.stat3Value}
                  onChange={updateHeroField}
                />
                <Field
                  label="Stat 3 Label"
                  name="stat3Label"
                  value={form.hero.stat3Label}
                  onChange={updateHeroField}
                />
              </div>
            </div>
          </div>

          <aside
            className="lg:sticky lg:top-28 rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.94))",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 22px 58px rgba(11,16,32,0.25)",
            }}
          >
            <div className="p-6">
              <div className="text-white font-bold text-lg mb-4">
                Live Text Preview
              </div>

              <img
                src={form.hero.image}
                alt="Hero preview"
                className="w-full h-48 object-cover rounded-2xl mb-5"
              />

              <div
                className="inline-flex px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{
                  background: "rgba(250,204,21,0.16)",
                  color: colors.gold,
                }}
              >
                {form.hero.badge}
              </div>

              <h3
                className="text-3xl leading-tight mb-4 text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 850,
                  letterSpacing: "-0.04em",
                }}
              >
                {form.hero.titleLine1}
                <br />
                <span style={{ color: colors.gold }}>
                  {form.hero.titleLine2}
                </span>
                <br />
                {form.hero.titleLine3}
              </h3>

              <p className="text-sm leading-relaxed text-white/62 mb-5">
                {form.hero.description}
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl p-3 bg-white/8 text-center">
                  <div className="text-white font-bold text-sm">
                    {form.hero.stat1Value}
                  </div>
                  <div className="text-white/50 text-xs">
                    {form.hero.stat1Label}
                  </div>
                </div>

                <div className="rounded-2xl p-3 bg-white/8 text-center">
                  <div className="text-white font-bold text-sm">
                    {form.hero.stat2Value}
                  </div>
                  <div className="text-white/50 text-xs">
                    {form.hero.stat2Label}
                  </div>
                </div>

                <div className="rounded-2xl p-3 bg-white/8 text-center">
                  <div className="text-white font-bold text-sm">
                    {form.hero.stat3Value}
                  </div>
                  <div className="text-white/50 text-xs">
                    {form.hero.stat3Label}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}