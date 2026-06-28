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
  ChevronDown,
  ChevronRight,
  UploadCloud,
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
      { value: "3800", suffix: "+", label: "Students Enrolled" },
      { value: "240", suffix: "+", label: "Expert Teachers" },
      { value: "35", suffix: " yrs", label: "Years of Excellence" },
      { value: "98", suffix: "%", label: "Success Rate" },
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
    hero: { ...defaultHomeContent.hero, ...(saved.hero || {}) },
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
      <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none transition-all duration-150"
          style={{
            background: "#F8FAFC",
            border: "1.5px solid rgba(75,46,131,0.12)",
            color: colors.dark,
          }}
          onFocus={(e) => {
            e.target.style.border = "1.5px solid rgba(75,46,131,0.4)";
            e.target.style.background = "#fff";
            e.target.style.boxShadow = "0 0 0 3px rgba(75,46,131,0.06)";
          }}
          onBlur={(e) => {
            e.target.style.border = "1.5px solid rgba(75,46,131,0.12)";
            e.target.style.background = "#F8FAFC";
            e.target.style.boxShadow = "none";
          }}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all duration-150"
          style={{
            background: "#F8FAFC",
            border: "1.5px solid rgba(75,46,131,0.12)",
            color: colors.dark,
          }}
          onFocus={(e) => {
            e.target.style.border = "1.5px solid rgba(75,46,131,0.4)";
            e.target.style.background = "#fff";
            e.target.style.boxShadow = "0 0 0 3px rgba(75,46,131,0.06)";
          }}
          onBlur={(e) => {
            e.target.style.border = "1.5px solid rgba(75,46,131,0.12)";
            e.target.style.background = "#F8FAFC";
            e.target.style.boxShadow = "none";
          }}
        />
      )}
    </div>
  );
}

function ImageUploadBox({ label, imageUrl, onUpload, onRemove, uploading }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">
        {label}
      </label>

      <div
        className="rounded-xl overflow-hidden bg-white mb-4 relative"
        style={{ border: "1.5px solid rgba(15,23,42,0.08)" }}
      >
        {imageUrl ? (
          <>
            <img src={imageUrl} alt={label} className="w-full h-64 object-cover" />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full h-56 bg-slate-50 flex items-center justify-center">
            <Image className="w-16 h-16 text-slate-300" />
          </div>
        )}
      </div>

      <label
        className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl p-4 text-center transition-all duration-150 hover:bg-white/90"
        style={{
          background: "rgba(255,255,255,0.6)",
          border: "1.5px dashed rgba(75,46,131,0.2)",
        }}
      >
        <UploadCloud className="w-5 h-5" style={{ color: colors.purple }} />

        <span className="text-sm font-bold text-slate-800">
          {uploading ? "Uploading..." : "Upload Image"}
        </span>

        <span className="text-xs text-slate-400 leading-relaxed">
          Recommended: 1100×900 px • PNG, JPG, WebP • Max 3 MB
        </span>

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onUpload(file);
            }
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>
    </div>
  );
}

function AccordionSection({
  icon: Icon,
  title,
  color,
  children,
  isExpanded,
  onToggle,
  sectionId,
  index,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: isExpanded
          ? `1.5px solid ${color}30`
          : "1.5px solid rgba(15,23,42,0.07)",
        boxShadow: isExpanded
          ? `0 8px 32px ${color}12, 0 2px 8px rgba(0,0,0,0.04)`
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <button
        onClick={() => onToggle(sectionId)}
        className="w-full flex items-center justify-between px-5 py-4 transition-all duration-200"
        style={{
          background: isExpanded ? `${color}06` : "transparent",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}12` }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="text-left">
            <div className="font-bold text-slate-900 text-sm">{title}</div>
            {!isExpanded && (
              <div className="text-xs text-slate-400 mt-0.5">Click to expand and edit</div>
            )}
          </div>
        </div>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background: isExpanded ? `${color}15` : "rgba(15,23,42,0.05)",
          }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" style={{ color }} />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div style={{ height: "1px", background: `${color}18`, margin: "0 20px" }} />
      )}

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pt-5 pb-6 space-y-4">{children}</div>
      </div>
    </motion.div>
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
                background: "linear-gradient(to top, rgba(2,6,23,0.65), transparent)",
              }}
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-black/35 p-4 backdrop-blur-md border border-white/15">
              <div className="text-white font-bold text-sm">{hero.imageBottomTitle}</div>
              <div className="text-white/65 text-xs mt-1">{hero.imageBottomDescription}</div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="p-6"
        style={{
          background: "linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 45%, #F7F4EF 100%)",
        }}
      >
        <div className="mb-6">
          <div className="inline-flex rounded-full px-3 py-1.5 mb-3 text-xs font-bold bg-slate-100 text-slate-800">
            {stats.eyebrow}
          </div>
          <h2
            className="text-3xl mb-2 text-slate-950"
            style={{ fontFamily: "var(--font-display)", fontWeight: 850, letterSpacing: "-0.04em" }}
          >
            {stats.title}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">{stats.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.stats.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl p-4"
              style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)", boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}
            >
              <div className="text-2xl font-bold text-slate-950">{item.value}{item.suffix}</div>
              <div className="text-xs text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-5 items-center mb-8">
          <div className="rounded-3xl overflow-hidden h-72 relative">
            <img src={stats.story.image} alt="Story preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(2,6,23,0.72), rgba(2,6,23,0.15), rgba(15,23,42,0.82))" }} />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/15 p-4 backdrop-blur-md border border-white/15">
              <div className="text-white font-bold text-sm">{stats.story.imageBottomTitle}</div>
              <div className="text-white/65 text-xs mt-1">{stats.story.imageBottomDescription}</div>
            </div>
          </div>
          <div>
            <div className="inline-flex rounded-full px-3 py-1.5 mb-3 text-xs font-bold bg-red-50 text-red-600">{stats.story.badge}</div>
            <h2 className="text-3xl mb-3 text-slate-950" style={{ fontFamily: "var(--font-display)", fontWeight: 850, letterSpacing: "-0.04em" }}>{stats.story.title}</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-3">{stats.story.paragraphs?.[0]}</p>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">{stats.story.paragraphs?.[1]}</p>
            <span className="inline-flex px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold border border-slate-200">{stats.story.buttonText}</span>
          </div>
        </div>
        <div className="mb-5">
          <h2 className="text-3xl mb-2 text-slate-950" style={{ fontFamily: "var(--font-display)", fontWeight: 850, letterSpacing: "-0.04em" }}>{stats.excellence.title}</h2>
          <p className="text-sm text-slate-500 leading-relaxed">{stats.excellence.description}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {stats.excellence.cards.map((card, index) => (
            <div key={index} className="rounded-2xl p-5 bg-white border border-slate-200">
              <h3 className="text-lg font-bold text-slate-950 mb-2">{card.title}</h3>
              <p className="text-xs leading-relaxed text-slate-500">{card.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl p-5 bg-slate-950 text-white">
          <div className="font-bold mb-1">Latest Notices</div>
          <div className="text-sm text-white/60">Notices are managed separately. Later, this home area will show the latest 4 notices from Manage Notices.</div>
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
  const [uploading, setUploading] = useState(false);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    hero: false,
    heroImage: false,
    heroStats: false,
    highlights: false,
    story: false,
    excellence: false,
  });

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

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const updateHeroField = (name, value) =>
    setForm((prev) => ({ ...prev, hero: { ...prev.hero, [name]: value } }));

  const updateStatsField = (name, value) =>
    setForm((prev) => ({ ...prev, statsSection: { ...prev.statsSection, [name]: value } }));

  const updateStatItem = (index, name, value) =>
    setForm((prev) => {
      const updated = [...prev.statsSection.stats];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, statsSection: { ...prev.statsSection, stats: updated } };
    });

  const updateStoryField = (name, value) =>
    setForm((prev) => ({
      ...prev,
      statsSection: { ...prev.statsSection, story: { ...prev.statsSection.story, [name]: value } },
    }));

  const updateStoryParagraph = (index, value) =>
    setForm((prev) => {
      const paragraphs = [...prev.statsSection.story.paragraphs];
      paragraphs[index] = value;
      return { ...prev, statsSection: { ...prev.statsSection, story: { ...prev.statsSection.story, paragraphs } } };
    });

  const updateExcellenceField = (name, value) =>
    setForm((prev) => ({
      ...prev,
      statsSection: { ...prev.statsSection, excellence: { ...prev.statsSection.excellence, [name]: value } },
    }));

  const updateExcellenceCard = (index, name, value) =>
    setForm((prev) => {
      const cards = [...prev.statsSection.excellence.cards];
      cards[index] = { ...cards[index], [name]: value };
      return { ...prev, statsSection: { ...prev.statsSection, excellence: { ...prev.statsSection.excellence, cards } } };
    });

  const uploadImage = async (file, fieldName, setUploadingState) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 3 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > maxSize) {
      setError("Image must be less than 3 MB.");
      return;
    }

    setError("");
    setUploadingState(true);

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
        setError("Image uploaded but URL not returned.");
        return;
      }

      // Check if we're updating the story image or hero image
      if (fieldName === "storyImage") {
        updateStoryField("image", uploadedUrl);
      } else {
        updateHeroField(fieldName, uploadedUrl);
      }
      setSuccess("Image uploaded successfully.");
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingState(false);
    }
  };

  const saveHomeContent = async () => {
    setSuccess("");
    setError("");
    setSaving(true);
    try {
      await axios.put(
        "http://localhost:5000/api/site-content/home",
        { content: form },
        { headers: { Authorization: `Bearer ${token}` } }
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8EE" }}>
        <div className="text-slate-600 font-semibold">Loading home editor...</div>
      </div>
    );
  }

  const sections = [
    { id: "hero",       icon: Type,      title: "Hero Text",                  color: colors.purple },
    { id: "heroImage",  icon: Image,     title: "Hero Image & Buttons",       color: colors.green  },
    { id: "heroStats",  icon: LinkIcon,  title: "Hero Stats & Image Text",    color: colors.red    },
    { id: "highlights", icon: BarChart3, title: "School Highlights Numbers",  color: colors.cyan   },
    { id: "story",      icon: BookOpen,  title: "Home Story Section",         color: colors.green  },
    { id: "excellence", icon: Award,     title: "Academic Excellence",        color: colors.purple },
  ];

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
          background: "linear-gradient(145deg, rgba(2,6,23,0.96), rgba(15,23,42,0.88))",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 18px 52px rgba(0,0,0,0.22)",
          backdropFilter: "blur(22px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white/80 hover:text-white text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <ExternalLink className="w-4 h-4" />
              View Full Home
            </a>

            <button
              type="button"
              onClick={saveHomeContent}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-60"
              style={{
                color: "#020617",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                boxShadow: "0 8px 24px rgba(56,189,248,0.28)",
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-7"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.2)" }}
            >
              <Home className="w-4 h-4" style={{ color: colors.cyan }} />
            </div>
            <span className="text-sm font-bold" style={{ color: colors.cyan }}>Manage Home</span>
          </div>

          <h1
            className="text-3xl md:text-4xl font-black mb-2"
            style={{ color: colors.dark, letterSpacing: "-0.04em" }}
          >
            Edit Homepage Content
          </h1>
          <p className="text-slate-500 text-sm">
            Click on any section below to expand and edit. Only the section you need will be visible.
          </p>
        </motion.div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-xl px-4 py-3 flex items-center gap-3 font-semibold text-sm"
            style={{ background: "rgba(22,138,58,0.08)", color: colors.green, border: "1px solid rgba(22,138,58,0.18)" }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-xl px-4 py-3 font-semibold text-sm"
            style={{ background: "rgba(215,25,32,0.08)", color: colors.red, border: "1px solid rgba(215,25,32,0.18)" }}
          >
            {error}
          </motion.div>
        )}

        <div className="grid xl:grid-cols-[1fr_1.2fr] gap-6 items-start">
          <div className="space-y-3">
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between mb-1"
              style={{ background: "rgba(75,46,131,0.06)", border: "1px solid rgba(75,46,131,0.1)" }}
            >
              <span className="text-xs font-semibold text-slate-500">
                {Object.values(expandedSections).filter(Boolean).length} of {sections.length} sections open
              </span>
              <button
                onClick={() =>
                  setExpandedSections(
                    Object.fromEntries(
                      sections.map((s) => [s.id, Object.values(expandedSections).some((v) => v) ? false : true])
                    )
                  )
                }
                className="text-xs font-bold transition-colors"
                style={{ color: colors.purple }}
              >
                {Object.values(expandedSections).some((v) => v) ? "Collapse All" : "Expand All"}
              </button>
            </div>

            {/* Hero Text */}
            <AccordionSection
              icon={sections[0].icon} title={sections[0].title} color={sections[0].color}
              isExpanded={expandedSections.hero} onToggle={toggleSection} sectionId="hero" index={0}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Badge Text" value={form.hero.badge} onChange={(v) => updateHeroField("badge", v)} />
                <Field label="Title Line 1" value={form.hero.titleLine1} onChange={(v) => updateHeroField("titleLine1", v)} />
                <Field label="Title Line 2" value={form.hero.titleLine2} onChange={(v) => updateHeroField("titleLine2", v)} />
                <Field label="Title Line 3" value={form.hero.titleLine3} onChange={(v) => updateHeroField("titleLine3", v)} />
              </div>
              <Field label="Hero Description" value={form.hero.description} onChange={(v) => updateHeroField("description", v)} textarea />
            </AccordionSection>

            {/* Hero Image & Buttons */}
            <AccordionSection
              icon={sections[1].icon} title={sections[1].title} color={sections[1].color}
              isExpanded={expandedSections.heroImage} onToggle={toggleSection} sectionId="heroImage" index={1}
            >
              <ImageUploadBox
                label="Hero Image"
                imageUrl={form.hero.image}
                uploading={uploading}
                onUpload={(file) => uploadImage(file, "image", setUploading)}
                onRemove={() => updateHeroField("image", "")}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Primary Button Text" value={form.hero.primaryButtonText} onChange={(v) => updateHeroField("primaryButtonText", v)} />
                <Field label="Primary Button Link" value={form.hero.primaryButtonLink} onChange={(v) => updateHeroField("primaryButtonLink", v)} />
                <Field label="Secondary Button Text" value={form.hero.secondaryButtonText} onChange={(v) => updateHeroField("secondaryButtonText", v)} />
                <Field label="Secondary Button Link" value={form.hero.secondaryButtonLink} onChange={(v) => updateHeroField("secondaryButtonLink", v)} />
              </div>
            </AccordionSection>

            {/* Hero Stats */}
            <AccordionSection
              icon={sections[2].icon} title={sections[2].title} color={sections[2].color}
              isExpanded={expandedSections.heroStats} onToggle={toggleSection} sectionId="heroStats" index={2}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Hero Stat 1 Value" value={form.hero.stat1Value} onChange={(v) => updateHeroField("stat1Value", v)} />
                <Field label="Hero Stat 1 Label" value={form.hero.stat1Label} onChange={(v) => updateHeroField("stat1Label", v)} />
                <Field label="Hero Stat 2 Value" value={form.hero.stat2Value} onChange={(v) => updateHeroField("stat2Value", v)} />
                <Field label="Hero Stat 2 Label" value={form.hero.stat2Label} onChange={(v) => updateHeroField("stat2Label", v)} />
                <Field label="Hero Stat 3 Value" value={form.hero.stat3Value} onChange={(v) => updateHeroField("stat3Value", v)} />
                <Field label="Hero Stat 3 Label" value={form.hero.stat3Label} onChange={(v) => updateHeroField("stat3Label", v)} />
                <Field label="Image Location" value={form.hero.imageLocation} onChange={(v) => updateHeroField("imageLocation", v)} />
                <Field label="Image Bottom Title" value={form.hero.imageBottomTitle} onChange={(v) => updateHeroField("imageBottomTitle", v)} />
              </div>
              <Field label="Image Bottom Description" value={form.hero.imageBottomDescription} onChange={(v) => updateHeroField("imageBottomDescription", v)} textarea />
            </AccordionSection>

            {/* School Highlights */}
            <AccordionSection
              icon={sections[3].icon} title={sections[3].title} color={sections[3].color}
              isExpanded={expandedSections.highlights} onToggle={toggleSection} sectionId="highlights" index={3}
            >
              <Field label="Section Eyebrow" value={form.statsSection.eyebrow} onChange={(v) => updateStatsField("eyebrow", v)} />
              <Field label="Section Title" value={form.statsSection.title} onChange={(v) => updateStatsField("title", v)} />
              <Field label="Section Description" value={form.statsSection.description} onChange={(v) => updateStatsField("description", v)} textarea />
              <div className="space-y-3 pt-1">
                {form.statsSection.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-3 gap-3 rounded-xl p-4"
                    style={{ background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.12)" }}
                  >
                    <Field label={`Stat ${index + 1} Value`} value={stat.value} onChange={(v) => updateStatItem(index, "value", v)} />
                    <Field label={`Stat ${index + 1} Suffix`} value={stat.suffix} onChange={(v) => updateStatItem(index, "suffix", v)} />
                    <Field label={`Stat ${index + 1} Label`} value={stat.label} onChange={(v) => updateStatItem(index, "label", v)} />
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* Story Section - Updated with Image Upload */}
            <AccordionSection
              icon={sections[4].icon} title={sections[4].title} color={sections[4].color}
              isExpanded={expandedSections.story} onToggle={toggleSection} sectionId="story" index={4}
            >
              <Field label="Story Badge" value={form.statsSection.story.badge} onChange={(v) => updateStoryField("badge", v)} />
              <Field label="Story Title" value={form.statsSection.story.title} onChange={(v) => updateStoryField("title", v)} />
              <Field label="Story Paragraph 1" value={form.statsSection.story.paragraphs[0]} onChange={(v) => updateStoryParagraph(0, v)} textarea />
              <Field label="Story Paragraph 2" value={form.statsSection.story.paragraphs[1]} onChange={(v) => updateStoryParagraph(1, v)} textarea />
              
              <ImageUploadBox
                label="Story Image"
                imageUrl={form.statsSection.story.image}
                uploading={uploadingStory}
                onUpload={(file) => uploadImage(file, "storyImage", setUploadingStory)}
                onRemove={() => updateStoryField("image", "")}
              />
              
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Button Text" value={form.statsSection.story.buttonText} onChange={(v) => updateStoryField("buttonText", v)} />
                <Field label="Button Link" value={form.statsSection.story.buttonLink} onChange={(v) => updateStoryField("buttonLink", v)} />
                <Field label="Image Top Title" value={form.statsSection.story.imageTopTitle} onChange={(v) => updateStoryField("imageTopTitle", v)} />
                <Field label="Image Top Subtitle" value={form.statsSection.story.imageTopSubtitle} onChange={(v) => updateStoryField("imageTopSubtitle", v)} />
                <Field label="Image Bottom Title" value={form.statsSection.story.imageBottomTitle} onChange={(v) => updateStoryField("imageBottomTitle", v)} />
              </div>
              <Field label="Image Bottom Description" value={form.statsSection.story.imageBottomDescription} onChange={(v) => updateStoryField("imageBottomDescription", v)} textarea />
            </AccordionSection>

            {/* Academic Excellence */}
            <AccordionSection
              icon={sections[5].icon} title={sections[5].title} color={sections[5].color}
              isExpanded={expandedSections.excellence} onToggle={toggleSection} sectionId="excellence" index={5}
            >
              <Field label="Academic Excellence Title" value={form.statsSection.excellence.title} onChange={(v) => updateExcellenceField("title", v)} />
              <Field label="Academic Excellence Description" value={form.statsSection.excellence.description} onChange={(v) => updateExcellenceField("description", v)} textarea />
              <div className="space-y-3 pt-1">
                {form.statsSection.excellence.cards.map((card, index) => (
                  <div
                    key={index}
                    className="rounded-xl p-4 space-y-3"
                    style={{ background: "rgba(75,46,131,0.04)", border: "1px solid rgba(75,46,131,0.1)" }}
                  >
                    <Field label={`Card ${index + 1} Title`} value={card.title} onChange={(v) => updateExcellenceCard(index, "title", v)} />
                    <Field label={`Card ${index + 1} Description`} value={card.description} onChange={(v) => updateExcellenceCard(index, "description", v)} textarea />
                  </div>
                ))}
              </div>
            </AccordionSection>
          </div>

          <aside
            className="xl:sticky xl:top-24 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.94))",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(11,16,32,0.3)",
            }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(56,189,248,0.12)" }}
                >
                  <Eye className="w-4 h-4" style={{ color: colors.cyan }} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Home Section Preview</div>
                  <div className="text-white/45 text-xs">Updates live while typing</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
            </div>

            <div className="bg-white overflow-y-auto" style={{ height: "720px" }}>
              <HomeOnlyPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}