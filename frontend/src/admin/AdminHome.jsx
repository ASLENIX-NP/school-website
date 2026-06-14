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
  BarChart3,
  BookOpen,
  Award,
  ExternalLink,
  Eye,
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

  statsSection: {
    eyebrow: "School Highlights",
    title: "Numbers that reflect our journey.",
    description:
      "These highlights can later be updated directly from the admin dashboard without changing frontend code.",

    stats: [
      {
        value: "3800",
        suffix: "+",
        label: "Students Enrolled",
      },
      {
        value: "240",
        suffix: "+",
        label: "Expert Teachers",
      },
      {
        value: "35",
        suffix: " yrs",
        label: "Years of Excellence",
      },
      {
        value: "98",
        suffix: "%",
        label: "Success Rate",
      },
    ],

    story: {
      badge: "About Baljagriti",
      title: "Building Tomorrow's Leaders Today",
      paragraphs: [
        "Established with a vision to provide quality education in Makawanpur, Baljagriti Secondary English School has grown as one of Hetauda's respected academic institutions.",
        "With students from Play Group to Grade 10, the school focuses on academic discipline, values, creativity, digital learning, and holistic student development.",
      ],
      buttonText: "Read Our Story",
      buttonLink: "/about",
      image:
        "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1000&h=800&fit=crop&auto=format",
      imageTopTitle: "Baljagriti School",
      imageTopSubtitle: "Hetauda-2, Makwanpur",
      imageBottomTitle: "Quality Education Since 2046 BS",
      imageBottomDescription:
        "This image and text can later come from the admin dashboard.",
    },

    excellence: {
      title: "Academic Excellence",
      description:
        "Our students consistently achieve outstanding results in the SEE examinations under NEB.",
      cards: [
        {
          title: "Best SEE Results",
          description:
            "Consistently achieving top results in the Secondary Education Examination under the National Examination Board.",
        },
        {
          title: "GPA 4.00 Achievers",
          description:
            "Our brightest students attain a perfect GPA of 4.00, a testament to our teaching quality and student dedication.",
        },
        {
          title: "Holistic Development",
          description:
            "Beyond academics, we foster creativity, leadership, and sportsmanship through diverse extracurricular programs.",
        },
      ],
    },
  },
};

function mergeHomeContent(saved = {}) {
  const savedStats = saved.statsSection || {};

  return {
    ...defaultHomeContent,
    ...saved,

    hero: {
      ...defaultHomeContent.hero,
      ...(saved.hero || {}),
    },

    statsSection: {
      ...defaultHomeContent.statsSection,
      ...savedStats,

      stats:
        Array.isArray(savedStats.stats) && savedStats.stats.length > 0
          ? defaultHomeContent.statsSection.stats.map((item, index) => ({
              ...item,
              ...(savedStats.stats[index] || {}),
            }))
          : defaultHomeContent.statsSection.stats,

      story: {
        ...defaultHomeContent.statsSection.story,
        ...(savedStats.story || {}),
        paragraphs:
          Array.isArray(savedStats.story?.paragraphs) &&
          savedStats.story.paragraphs.length > 0
            ? [
                savedStats.story.paragraphs[0] || "",
                savedStats.story.paragraphs[1] || "",
              ]
            : defaultHomeContent.statsSection.story.paragraphs,
      },

      excellence: {
        ...defaultHomeContent.statsSection.excellence,
        ...(savedStats.excellence || {}),
        cards:
          Array.isArray(savedStats.excellence?.cards) &&
          savedStats.excellence.cards.length > 0
            ? defaultHomeContent.statsSection.excellence.cards.map(
                (item, index) => ({
                  ...item,
                  ...(savedStats.excellence.cards[index] || {}),
                })
              )
            : defaultHomeContent.statsSection.excellence.cards,
      },
    },
  };
}

function Field({ label, value, onChange, textarea = false }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
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
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
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

function HomeOnlyPreview({ form }) {
  const hero = form.hero;
  const stats = form.statsSection;

  return (
    <div className="bg-white">
      <section
        className="relative overflow-hidden p-6"
        style={{
          background:
            "radial-gradient(circle at 10% 18%, rgba(56,189,248,0.28), transparent 32%), radial-gradient(circle at 85% 12%, rgba(250,204,21,0.22), transparent 30%), radial-gradient(circle at 60% 78%, rgba(139,92,246,0.28), transparent 38%), linear-gradient(135deg, #020617 0%, #07111F 45%, #111827 100%)",
        }}
      >
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          <div>
            <div
              className="inline-flex items-center rounded-full px-3 py-1.5 mb-4 text-xs font-semibold"
              style={{
                color: "rgba(255,255,255,0.9)",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.16)",
              }}
            >
              {hero.badge}
            </div>

            <h2
              className="text-4xl leading-tight mb-4"
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                letterSpacing: "-0.05em",
              }}
            >
              {hero.titleLine1}
              <br />
              <span style={{ color: colors.gold }}>{hero.titleLine2}</span>
              <br />
              {hero.titleLine3}
            </h2>

            <p className="text-sm leading-relaxed mb-5 text-white/70">
              {hero.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-5">
              <span
                className="px-4 py-2 rounded-xl text-xs font-bold"
                style={{
                  color: "#020617",
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                }}
              >
                {hero.primaryButtonText}
              </span>

              <span
                className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.16)",
                }}
              >
                {hero.secondaryButtonText}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                [hero.stat1Value, hero.stat1Label],
                [hero.stat2Value, hero.stat2Label],
                [hero.stat3Value, hero.stat3Label],
              ].map(([value, label], index) => (
                <div
                  key={index}
                  className="rounded-2xl p-3"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  <div className="text-white font-bold text-sm">{value}</div>
                  <div className="text-white/55 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden relative h-72">
            <img
              src={hero.image}
              alt="Hero preview"
              className="w-full h-full object-cover"
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(2,6,23,0.65), transparent)",
              }}
            />

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-black/35 p-4 backdrop-blur-md border border-white/15">
              <div className="text-white font-bold text-sm">
                {hero.imageBottomTitle}
              </div>
              <div className="text-white/65 text-xs mt-1">
                {hero.imageBottomDescription}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="p-6"
        style={{
          background:
            "linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 45%, #F7F4EF 100%)",
        }}
      >
        <div className="mb-6">
          <div className="inline-flex rounded-full px-3 py-1.5 mb-3 text-xs font-bold bg-slate-100 text-slate-800">
            {stats.eyebrow}
          </div>

          <h2
            className="text-3xl mb-2 text-slate-950"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              letterSpacing: "-0.04em",
            }}
          >
            {stats.title}
          </h2>

          <p className="text-sm text-slate-500 leading-relaxed">
            {stats.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.stats.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl p-4"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
              }}
            >
              <div className="text-2xl font-bold text-slate-950">
                {item.value}
                {item.suffix}
              </div>
              <div className="text-xs text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5 items-center mb-8">
          <div className="rounded-3xl overflow-hidden h-72 relative">
            <img
              src={stats.story.image}
              alt="Story preview"
              className="w-full h-full object-cover"
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(2,6,23,0.72), rgba(2,6,23,0.15), rgba(15,23,42,0.82))",
              }}
            />

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/15 p-4 backdrop-blur-md border border-white/15">
              <div className="text-white font-bold text-sm">
                {stats.story.imageBottomTitle}
              </div>
              <div className="text-white/65 text-xs mt-1">
                {stats.story.imageBottomDescription}
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex rounded-full px-3 py-1.5 mb-3 text-xs font-bold bg-red-50 text-red-600">
              {stats.story.badge}
            </div>

            <h2
              className="text-3xl mb-3 text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                letterSpacing: "-0.04em",
              }}
            >
              {stats.story.title}
            </h2>

            <p className="text-sm text-slate-500 leading-relaxed mb-3">
              {stats.story.paragraphs?.[0]}
            </p>

            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              {stats.story.paragraphs?.[1]}
            </p>

            <span className="inline-flex px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold border border-slate-200">
              {stats.story.buttonText}
            </span>
          </div>
        </div>

        <div className="mb-5">
          <h2
            className="text-3xl mb-2 text-slate-950"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              letterSpacing: "-0.04em",
            }}
          >
            {stats.excellence.title}
          </h2>

          <p className="text-sm text-slate-500 leading-relaxed">
            {stats.excellence.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {stats.excellence.cards.map((card, index) => (
            <div
              key={index}
              className="rounded-2xl p-5 bg-white border border-slate-200"
            >
              <h3 className="text-lg font-bold text-slate-950 mb-2">
                {card.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-500">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl p-5 bg-slate-950 text-white">
          <div className="font-bold mb-1">Latest Notices</div>
          <div className="text-sm text-white/60">
            Notices are managed separately. Later, this home area will show the
            latest 4 notices from Manage Notices.
          </div>
        </div>
      </section>
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
        setForm(mergeHomeContent(savedContent));
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

  const updateStatsField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      statsSection: {
        ...prev.statsSection,
        [name]: value,
      },
    }));
  };

  const updateStatItem = (index, name, value) => {
    setForm((prev) => {
      const updated = [...prev.statsSection.stats];
      updated[index] = {
        ...updated[index],
        [name]: value,
      };

      return {
        ...prev,
        statsSection: {
          ...prev.statsSection,
          stats: updated,
        },
      };
    });
  };

  const updateStoryField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      statsSection: {
        ...prev.statsSection,
        story: {
          ...prev.statsSection.story,
          [name]: value,
        },
      },
    }));
  };

  const updateStoryParagraph = (index, value) => {
    setForm((prev) => {
      const paragraphs = [...prev.statsSection.story.paragraphs];
      paragraphs[index] = value;

      return {
        ...prev,
        statsSection: {
          ...prev.statsSection,
          story: {
            ...prev.statsSection.story,
            paragraphs,
          },
        },
      };
    });
  };

  const updateExcellenceField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      statsSection: {
        ...prev.statsSection,
        excellence: {
          ...prev.statsSection.excellence,
          [name]: value,
        },
      },
    }));
  };

  const updateExcellenceCard = (index, name, value) => {
    setForm((prev) => {
      const cards = [...prev.statsSection.excellence.cards];
      cards[index] = {
        ...cards[index],
        [name]: value,
      };

      return {
        ...prev,
        statsSection: {
          ...prev.statsSection,
          excellence: {
            ...prev.statsSection.excellence,
            cards,
          },
        },
      };
    });
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

      setSuccess("Home page content saved successfully.");
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
              View Full Home
            </a>

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
            Edit Homepage Content
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            This controls only the home page content: hero, highlights, story,
            and academic excellence. Notices will be managed separately.
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
            <EditorCard icon={Type} title="Hero Text" color={colors.purple}>
              <div className="grid md:grid-cols-2 gap-5">
                <Field
                  label="Badge Text"
                  value={form.hero.badge}
                  onChange={(value) => updateHeroField("badge", value)}
                />
                <Field
                  label="Title Line 1"
                  value={form.hero.titleLine1}
                  onChange={(value) => updateHeroField("titleLine1", value)}
                />
                <Field
                  label="Title Line 2"
                  value={form.hero.titleLine2}
                  onChange={(value) => updateHeroField("titleLine2", value)}
                />
                <Field
                  label="Title Line 3"
                  value={form.hero.titleLine3}
                  onChange={(value) => updateHeroField("titleLine3", value)}
                />
              </div>

              <div className="mt-5">
                <Field
                  label="Hero Description"
                  value={form.hero.description}
                  onChange={(value) => updateHeroField("description", value)}
                  textarea
                />
              </div>
            </EditorCard>

            <EditorCard
              icon={Image}
              title="Hero Image and Buttons"
              color={colors.green}
            >
              <div className="grid gap-5">
                <Field
                  label="Hero Image URL"
                  value={form.hero.image}
                  onChange={(value) => updateHeroField("image", value)}
                />
                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="Primary Button Text"
                    value={form.hero.primaryButtonText}
                    onChange={(value) =>
                      updateHeroField("primaryButtonText", value)
                    }
                  />
                  <Field
                    label="Primary Button Link"
                    value={form.hero.primaryButtonLink}
                    onChange={(value) =>
                      updateHeroField("primaryButtonLink", value)
                    }
                  />
                  <Field
                    label="Secondary Button Text"
                    value={form.hero.secondaryButtonText}
                    onChange={(value) =>
                      updateHeroField("secondaryButtonText", value)
                    }
                  />
                  <Field
                    label="Secondary Button Link"
                    value={form.hero.secondaryButtonLink}
                    onChange={(value) =>
                      updateHeroField("secondaryButtonLink", value)
                    }
                  />
                </div>
              </div>
            </EditorCard>

            <EditorCard
              icon={LinkIcon}
              title="Hero Stats and Image Text"
              color={colors.red}
            >
              <div className="grid md:grid-cols-2 gap-5">
                <Field
                  label="Hero Stat 1 Value"
                  value={form.hero.stat1Value}
                  onChange={(value) => updateHeroField("stat1Value", value)}
                />
                <Field
                  label="Hero Stat 1 Label"
                  value={form.hero.stat1Label}
                  onChange={(value) => updateHeroField("stat1Label", value)}
                />
                <Field
                  label="Hero Stat 2 Value"
                  value={form.hero.stat2Value}
                  onChange={(value) => updateHeroField("stat2Value", value)}
                />
                <Field
                  label="Hero Stat 2 Label"
                  value={form.hero.stat2Label}
                  onChange={(value) => updateHeroField("stat2Label", value)}
                />
                <Field
                  label="Hero Stat 3 Value"
                  value={form.hero.stat3Value}
                  onChange={(value) => updateHeroField("stat3Value", value)}
                />
                <Field
                  label="Hero Stat 3 Label"
                  value={form.hero.stat3Label}
                  onChange={(value) => updateHeroField("stat3Label", value)}
                />
                <Field
                  label="Image Location"
                  value={form.hero.imageLocation}
                  onChange={(value) => updateHeroField("imageLocation", value)}
                />
                <Field
                  label="Image Bottom Title"
                  value={form.hero.imageBottomTitle}
                  onChange={(value) =>
                    updateHeroField("imageBottomTitle", value)
                  }
                />
              </div>

              <div className="mt-5">
                <Field
                  label="Image Bottom Description"
                  value={form.hero.imageBottomDescription}
                  onChange={(value) =>
                    updateHeroField("imageBottomDescription", value)
                  }
                  textarea
                />
              </div>
            </EditorCard>

            <EditorCard
              icon={BarChart3}
              title="School Highlights Numbers"
              color={colors.cyan}
            >
              <div className="grid gap-5">
                <Field
                  label="Section Eyebrow"
                  value={form.statsSection.eyebrow}
                  onChange={(value) => updateStatsField("eyebrow", value)}
                />
                <Field
                  label="Section Title"
                  value={form.statsSection.title}
                  onChange={(value) => updateStatsField("title", value)}
                />
                <Field
                  label="Section Description"
                  value={form.statsSection.description}
                  onChange={(value) => updateStatsField("description", value)}
                  textarea
                />

                {form.statsSection.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-3 gap-4 rounded-2xl p-4"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <Field
                      label={`Stat ${index + 1} Value`}
                      value={stat.value}
                      onChange={(value) =>
                        updateStatItem(index, "value", value)
                      }
                    />
                    <Field
                      label={`Stat ${index + 1} Suffix`}
                      value={stat.suffix}
                      onChange={(value) =>
                        updateStatItem(index, "suffix", value)
                      }
                    />
                    <Field
                      label={`Stat ${index + 1} Label`}
                      value={stat.label}
                      onChange={(value) =>
                        updateStatItem(index, "label", value)
                      }
                    />
                  </div>
                ))}
              </div>
            </EditorCard>

            <EditorCard
              icon={BookOpen}
              title="Home Story Section"
              color={colors.green}
            >
              <div className="grid gap-5">
                <Field
                  label="Story Badge"
                  value={form.statsSection.story.badge}
                  onChange={(value) => updateStoryField("badge", value)}
                />
                <Field
                  label="Story Title"
                  value={form.statsSection.story.title}
                  onChange={(value) => updateStoryField("title", value)}
                />
                <Field
                  label="Story Paragraph 1"
                  value={form.statsSection.story.paragraphs[0]}
                  onChange={(value) => updateStoryParagraph(0, value)}
                  textarea
                />
                <Field
                  label="Story Paragraph 2"
                  value={form.statsSection.story.paragraphs[1]}
                  onChange={(value) => updateStoryParagraph(1, value)}
                  textarea
                />
                <Field
                  label="Story Image URL"
                  value={form.statsSection.story.image}
                  onChange={(value) => updateStoryField("image", value)}
                />

                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="Button Text"
                    value={form.statsSection.story.buttonText}
                    onChange={(value) => updateStoryField("buttonText", value)}
                  />
                  <Field
                    label="Button Link"
                    value={form.statsSection.story.buttonLink}
                    onChange={(value) => updateStoryField("buttonLink", value)}
                  />
                  <Field
                    label="Image Top Title"
                    value={form.statsSection.story.imageTopTitle}
                    onChange={(value) =>
                      updateStoryField("imageTopTitle", value)
                    }
                  />
                  <Field
                    label="Image Top Subtitle"
                    value={form.statsSection.story.imageTopSubtitle}
                    onChange={(value) =>
                      updateStoryField("imageTopSubtitle", value)
                    }
                  />
                  <Field
                    label="Image Bottom Title"
                    value={form.statsSection.story.imageBottomTitle}
                    onChange={(value) =>
                      updateStoryField("imageBottomTitle", value)
                    }
                  />
                </div>

                <Field
                  label="Image Bottom Description"
                  value={form.statsSection.story.imageBottomDescription}
                  onChange={(value) =>
                    updateStoryField("imageBottomDescription", value)
                  }
                  textarea
                />
              </div>
            </EditorCard>

            <EditorCard
              icon={Award}
              title="Academic Excellence"
              color={colors.purple}
            >
              <div className="grid gap-5">
                <Field
                  label="Academic Excellence Title"
                  value={form.statsSection.excellence.title}
                  onChange={(value) => updateExcellenceField("title", value)}
                />
                <Field
                  label="Academic Excellence Description"
                  value={form.statsSection.excellence.description}
                  onChange={(value) =>
                    updateExcellenceField("description", value)
                  }
                  textarea
                />

                {form.statsSection.excellence.cards.map((card, index) => (
                  <div
                    key={index}
                    className="grid gap-4 rounded-2xl p-4"
                    style={{
                      background: "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <Field
                      label={`Card ${index + 1} Title`}
                      value={card.title}
                      onChange={(value) =>
                        updateExcellenceCard(index, "title", value)
                      }
                    />
                    <Field
                      label={`Card ${index + 1} Description`}
                      value={card.description}
                      onChange={(value) =>
                        updateExcellenceCard(index, "description", value)
                      }
                      textarea
                    />
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
                Home Section Preview
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
              <HomeOnlyPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}