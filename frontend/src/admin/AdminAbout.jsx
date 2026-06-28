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
  Eye as EyeIcon,
  EyeOff,
  Image as ImageIcon,
  Type,
  BookOpen,
  Target,
  CalendarDays,
  Award,
  X,
  MessageSquareText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
  lightGreen: "#EAF7EF",
  lightPurple: "#F1ECFF",
  cyan: "#38BDF8",
  gold: "#FACC15",
  orange: "#F97316",
};

const defaultAboutContent = {
  pageTitle: "About Us",
  pageSubtitle:
    "Learn about Baljagriti Secondary English School, our values, and our commitment to quality education.",
  
  pillars: [
    {
      id: 1,
      icon: "award",
      label: "Academic Excellence",
      desc: "Focused classroom learning that helps students build a strong academic foundation from early years to Grade 10.",
      color: "#D71920",
      visible: true,
    },
    {
      id: 2,
      icon: "heart",
      label: "Holistic Development",
      desc: "A nurturing and child-friendly environment where students grow academically, personally, socially, and morally.",
      color: "#168A3A",
      visible: true,
    },
    {
      id: 3,
      icon: "lightbulb",
      label: "Creative & Practical Learning",
      desc: "Extra-curricular activities, competitions, sports, arts, and school programs help students explore their talents.",
      color: "#4B2E83",
      visible: true,
    },
  ],
  
  storyBadge: "Our Story",
  storyTitle: "Building Tomorrow's Leaders Today",
  storyParagraphs: [
    "Baljagriti Secondary English School, located in the heart of Makwanpur, Nepal, has been a beacon of quality education for many years. What began as a small school with a strong vision has grown into a thriving institution serving students from Play Group to Grade 10.",
    "We take pride in our dedicated team of experienced educators who work tirelessly to ensure every child receives the attention, guidance, and learning environment they need to grow academically and personally.",
  ],
  storyImageUrl:
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&h=700&fit=crop&auto=format",
  storyImageAlt: "School campus",
  storyImageTitle: "School Campus",
  storyImageSubtitle: "Image can later be managed from admin dashboard",

  // Section Headings
  pillarBadge: "Our Core Values",
  pillarTitle: "What Makes Us Different",
  timelineBadge: "Timeline",

  // Leadership Messages
  messages: [
    {
      id: 1,
      name: "Principal",
      role: "Principal",
      title: "Principal's Message",
      message: "Welcome to Baljagriti Secondary English School. We are committed to nurturing every child into a confident, capable, disciplined, and compassionate individual. Our goal is to provide quality education with strong values, creativity, and academic excellence.",
      image: "",
      visible: true,
    },
    {
      id: 2,
      name: "Vice Principal",
      role: "Vice Principal",
      title: "Vice Principal's Message",
      message: "Our team works tirelessly to provide a safe, inspiring, and academically rigorous environment for every student. We believe every child deserves care, guidance, and opportunities to grow academically, socially, and personally.",
      image: "",
      visible: true,
    },
  ],

  missionVision: [
    {
      id: 1,
      icon: "target",
      title: "Our Mission",
      desc: "To provide a safe, nurturing, and academically rigorous learning environment that empowers students to become confident, creative, and responsible citizens equipped for the challenges of the modern world.",
      color: "#4B2E83",
      visible: true,
    },
    {
      id: 2,
      icon: "eye",
      title: "Our Vision",
      desc: "To be a leading educational institution in Makwanpur, recognized for academic excellence, holistic development, and producing leaders who contribute positively to society and the nation.",
      color: "#168A3A",
      visible: true,
    },
  ],
  
  journeyTitle: "Our Journey",
  journey: [
    {
      id: 1,
      year: "2046 BS",
      title: "School Founded",
      desc: "Baljagriti Secondary English School was established in Makwanpur with a vision to provide quality English-medium education.",
      visible: true,
    },
    {
      id: 2,
      year: "Secondary Level",
      title: "Expanded to Grade 10",
      desc: "The school expanded its academic structure to support students from early learning levels up to Grade 10.",
      visible: true,
    },
    {
      id: 3,
      year: "Academic Growth",
      title: "Strong SEE Foundation",
      desc: "Students continued building strong academic results through focused classroom teaching, discipline, and guided learning.",
      visible: true,
    },
    {
      id: 4,
      year: "Today",
      title: "Growing Learning Community",
      desc: "The school community continues to grow with dedicated educators, modern facilities, and a focus on holistic student development.",
      visible: true,
    },
  ],
};

function mergeAboutContent(saved = {}) {
  return {
    ...defaultAboutContent,
    ...saved,
    pillars: Array.isArray(saved.pillars)
      ? saved.pillars
      : defaultAboutContent.pillars,
    storyParagraphs: Array.isArray(saved.storyParagraphs)
      ? saved.storyParagraphs
      : defaultAboutContent.storyParagraphs,
    missionVision: Array.isArray(saved.missionVision)
      ? saved.missionVision
      : defaultAboutContent.missionVision,
    journey: Array.isArray(saved.journey)
      ? saved.journey
      : defaultAboutContent.journey,
    pillarBadge: saved.pillarBadge || defaultAboutContent.pillarBadge,
    pillarTitle: saved.pillarTitle || defaultAboutContent.pillarTitle,
    timelineBadge: saved.timelineBadge || defaultAboutContent.timelineBadge,
    messages: Array.isArray(saved.messages)
      ? saved.messages
      : defaultAboutContent.messages,
  };
}

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
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
    </div>
  );
}

// Accordion Section Component - Matching Home page design
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
      {/* Header */}
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

      {/* Divider when open */}
      {isExpanded && (
        <div style={{ height: "1px", background: `${color}18`, margin: "0 20px" }} />
      )}

      {/* Content */}
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

function VisibilityDeleteControls({ visible, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className="p-3 rounded-xl"
        style={{
          background:
            visible !== false
              ? "rgba(22,138,58,0.1)"
              : "rgba(100,116,139,0.12)",
          color: visible !== false ? colors.green : "#64748B",
          border:
            visible !== false
              ? "1px solid rgba(22,138,58,0.2)"
              : "1px solid rgba(100,116,139,0.16)",
        }}
        title={visible !== false ? "Visible" : "Hidden"}
      >
        {visible !== false ? (
          <EyeIcon className="w-4 h-4" />
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
          border: "1px solid rgba(215,25,32,0.18)",
        }}
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function ImageUploadBox({
  label,
  imageUrl,
  onUpload,
  onRemove,
  uploading,
  instruction,
}) {
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
            <img src={imageUrl} alt={label} className="w-full h-56 object-cover" />
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
            <ImageIcon className="w-16 h-16 text-slate-300" />
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
          {instruction}
        </span>

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            onUpload(e.target.files?.[0]);
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>
    </div>
  );
}

function AboutPreview({ form }) {
  const visiblePillars = (form.pillars || []).filter(
    (item) => item.visible !== false
  );
  const visibleMessages = (form.messages || []).filter(
    (item) => item.visible !== false
  );
  const visibleMissionVision = (form.missionVision || []).filter(
    (item) => item.visible !== false
  );
  const visibleJourney = (form.journey || []).filter(
    (item) => item.visible !== false
  );

  return (
    <div
      className="min-h-full p-6"
      style={{
        background:
          "radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%), radial-gradient(circle at bottom left, rgba(22,138,58,0.14), transparent 32%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4"
          style={{
            background: "rgba(215,25,32,0.07)",
            color: colors.red,
            border: "1px solid rgba(215,25,32,0.14)",
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: colors.red }} />
          School Profile
        </div>

        <h3
          className="text-4xl text-slate-950"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 850,
            letterSpacing: "-0.04em",
          }}
        >
          {form.pageTitle || "About Us"}
        </h3>

        <div 
          className="w-20 h-1 rounded-full mx-auto my-4" 
          style={{ background: `linear-gradient(90deg, ${colors.red}, ${colors.gold}, ${colors.green})` }} 
        />

        <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-2xl mx-auto">
          {form.pageSubtitle}
        </p>
      </div>

      {/* Story Section */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              background: "rgba(75,46,131,0.09)",
              color: colors.purple,
              border: "1px solid rgba(75,46,131,0.18)",
            }}
          >
            {form.storyBadge}
          </span>
        </div>

        <div
          className="bg-white rounded-3xl p-5 mb-4"
          style={{
            border: "1px solid rgba(75,46,131,0.08)",
            boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
          }}
        >
          <div className="text-2xl font-black text-slate-950 leading-tight">
            {form.storyTitle}
          </div>

          <div className="space-y-4 mt-4">
            {(form.storyParagraphs || []).map((paragraph, index) => (
              <p key={index} className="text-sm text-slate-500 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div
          className="rounded-3xl overflow-hidden bg-white relative"
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
          }}
        >
          {form.storyImageUrl ? (
            <img
              src={form.storyImageUrl}
              alt={form.storyImageAlt || "Story image"}
              className="w-full h-60 object-cover"
            />
          ) : (
            <div className="w-full h-60 bg-slate-100 flex items-center justify-center">
              <ImageIcon className="w-14 h-14 text-slate-300" />
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 rounded-2xl p-4 bg-black/45 backdrop-blur-md">
            <div
              className="w-14 h-1 rounded-full mb-3"
              style={{
                background:
                  "linear-gradient(90deg, rgba(250,204,21,0.95), rgba(56,189,248,0.95))",
              }}
            />

            <div className="text-white font-bold">{form.storyImageTitle}</div>
            <div className="text-white/70 text-xs">
              {form.storyImageSubtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Pillars - Our Core Values */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              background: "rgba(22,138,58,0.08)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.14)",
            }}
          >
            {form.pillarBadge || "Our Core Values"}
          </span>
          <div className="text-2xl font-black text-slate-950 mt-2">
            {form.pillarTitle || "What Makes Us Different"}
          </div>
        </div>

        <div className="space-y-4">
          {visiblePillars.map((item, index) => {
            const pillarColor = item.color || colors.green;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5"
                style={{
                  border: `2px solid ${pillarColor}22`,
                  boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
                }}
              >
                <div
                  className="text-2xl font-black tracking-widest mb-3"
                  style={{ color: pillarColor }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div
                  className="w-16 h-1 rounded-full mb-4"
                  style={{ background: pillarColor }}
                />

                <div className="font-bold text-xl text-slate-950">{item.label}</div>

                <div className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leadership Messages */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              background: "rgba(75,46,131,0.09)",
              color: colors.purple,
              border: "1px solid rgba(75,46,131,0.18)",
            }}
          >
            Leadership Messages
          </span>
          <div className="text-2xl font-black text-slate-950 mt-2">
            Messages From Leadership
          </div>
        </div>

        <div className="space-y-4">
          {visibleMessages.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5"
              style={{
                border: "1px solid rgba(75,46,131,0.08)",
                boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(75,46,131,0.1)",
                      border: "1px solid rgba(75,46,131,0.2)",
                    }}
                  >
                    <span className="text-lg font-bold" style={{ color: colors.purple }}>
                      {item.name?.charAt(0) || "M"}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-950">{item.name}</div>
                  <div className="text-sm" style={{ color: colors.green }}>
                    {item.role}
                  </div>
                </div>
              </div>

              <div className="text-xl font-black text-slate-950 mb-3">
                {item.title}
              </div>

              <p className="text-sm text-slate-500 leading-relaxed">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="mb-8">
        <div className="space-y-4">
          {visibleMissionVision.map((item, index) => {
            const cardColor = item.color || colors.green;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5"
                style={{
                  border: `2px solid ${cardColor}22`,
                  boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
                }}
              >
                <div
                  className="text-2xl font-black tracking-widest mb-3"
                  style={{ color: cardColor }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div
                  className="w-16 h-1 rounded-full mb-4"
                  style={{ background: cardColor }}
                />

                <div className="text-2xl font-black text-slate-950">
                  {item.title}
                </div>

                <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Journey Timeline */}
      <div>
        <div className="text-center mb-4">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              background: "rgba(215,25,32,0.08)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.14)",
            }}
          >
            {form.timelineBadge || "Timeline"}
          </span>
          <div className="text-2xl font-black text-slate-950 mt-2">
            {form.journeyTitle}
          </div>
        </div>

        <div className="space-y-4">
          {visibleJourney.map((item, index) => {
            const journeyColors = [colors.red, colors.orange, colors.gold, colors.green];
            const journeyColor = journeyColors[index % journeyColors.length];

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5"
                style={{
                  border: `2px solid ${journeyColor}15`,
                  boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-black"
                    style={{
                      background: `linear-gradient(135deg, ${journeyColor}, ${colors.dark})`,
                      boxShadow: `0 8px 20px ${journeyColor}44`,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <div
                      className="text-sm font-black tracking-widest"
                      style={{ color: journeyColor }}
                    >
                      {item.year}
                    </div>

                    <div className="text-xl font-black text-slate-950 mt-1">
                      {item.title}
                    </div>

                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminAbout() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultAboutContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Define sections
  const sectionKeys = ['header', 'story', 'headings', 'pillars', 'messages', 'missionVision', 'journey'];
  const sectionTitles = {
    header: 'Header Section',
    story: 'Story Section',
    headings: 'Section Headings',
    pillars: 'Pillar Cards - Our Core Values',
    messages: 'Leadership Messages',
    missionVision: 'Mission & Vision Cards',
    journey: 'Journey Timeline'
  };
  const sectionIcons = {
    header: Type,
    story: BookOpen,
    headings: Award,
    pillars: Award,
    messages: MessageSquareText,
    missionVision: Target,
    journey: CalendarDays
  };
  const sectionColors = {
    header: colors.purple,
    story: colors.purple,
    headings: colors.green,
    pillars: colors.red,
    messages: colors.purple,
    missionVision: colors.green,
    journey: colors.red
  };

  // State for accordion - all collapsed by default
  const [expandedSections, setExpandedSections] = useState(
    Object.fromEntries(sectionKeys.map(key => [key, false]))
  );

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/about");
        const savedContent = res.data?.data?.content || {};
        setForm(mergeAboutContent(savedContent));
      } catch (err) {
        console.error("Load about content error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAboutContent();
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const expandAll = () => {
    setExpandedSections(
      Object.fromEntries(sectionKeys.map(key => [key, true]))
    );
  };

  const collapseAll = () => {
    setExpandedSections(
      Object.fromEntries(sectionKeys.map(key => [key, false]))
    );
  };

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePillar = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      pillars: prev.pillars.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      ),
    }));
  };

  const addPillar = () => {
    setForm((prev) => ({
      ...prev,
      pillars: [
        ...prev.pillars,
        {
          id: Date.now(),
          icon: "award",
          label: "New Pillar",
          desc: "Short description.",
          color: colors.green,
          visible: true,
        },
      ],
    }));
  };

  const deletePillar = (id) => {
    setForm((prev) => ({
      ...prev,
      pillars: prev.pillars.filter((item) => item.id !== id),
    }));
  };

  const updateMessage = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      messages: prev.messages.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addMessage = () => {
    setForm((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: Date.now(),
          name: "",
          role: "",
          title: "",
          message: "",
          image: "",
          visible: true,
        },
      ],
    }));
  };

  const deleteMessage = (id) => {
    setForm((prev) => ({
      ...prev,
      messages: prev.messages.filter((item) => item.id !== id),
    }));
  };

  const updateMissionVision = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      missionVision: prev.missionVision.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      ),
    }));
  };

  const addMissionVision = () => {
    setForm((prev) => ({
      ...prev,
      missionVision: [
        ...prev.missionVision,
        {
          id: Date.now(),
          icon: "target",
          title: "New Section",
          desc: "Section description.",
          color: colors.purple,
          visible: true,
        },
      ],
    }));
  };

  const deleteMissionVision = (id) => {
    setForm((prev) => ({
      ...prev,
      missionVision: prev.missionVision.filter((item) => item.id !== id),
    }));
  };

  const updateJourney = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      journey: prev.journey.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      ),
    }));
  };

  const addJourney = () => {
    setForm((prev) => ({
      ...prev,
      journey: [
        ...prev.journey,
        {
          id: Date.now(),
          year: "Year",
          title: "Journey Title",
          desc: "Journey description.",
          visible: true,
        },
      ],
    }));
  };

  const deleteJourney = (id) => {
    setForm((prev) => ({
      ...prev,
      journey: prev.journey.filter((item) => item.id !== id),
    }));
  };

  const uploadImage = async (fieldName, file) => {
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

    setSuccess("");
    setError("");
    setUploadingKey(fieldName);

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

      updateField(fieldName, uploadedUrl);
      setSuccess("Image uploaded successfully. Click Save Changes.");
    } catch (err) {
      console.error("About image upload error:", err);
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingKey("");
    }
  };

  async function saveAboutContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/about",
        { content: form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("About page content saved successfully.");
    } catch (err) {
      console.error("Save about content error:", err);
      setError(err.response?.data?.message || "Could not save about content.");
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
          Loading about editor...
        </div>
      </div>
    );
  }

  const expandedCount = Object.values(expandedSections).filter(Boolean).length;
  const totalSections = sectionKeys.length;

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
              href="/about"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white/80 hover:text-white text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <ExternalLink className="w-4 h-4" />
              View About Page
            </a>

            <button
              type="button"
              onClick={saveAboutContent}
              disabled={saving || uploadingKey}
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
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(75,46,131,0.12)", border: "1px solid rgba(75,46,131,0.2)" }}
                >
                  <BookOpen className="w-4 h-4" style={{ color: colors.purple }} />
                </div>
                <span className="text-sm font-bold" style={{ color: colors.purple }}>Manage About Page</span>
              </div>

              <h1
                className="text-3xl md:text-4xl font-black mb-2"
                style={{ color: colors.dark, letterSpacing: "-0.04em" }}
              >
                Edit About Page
              </h1>
              <p className="text-slate-500 text-sm">
                Click on any section below to expand and edit. Only the section you need will be visible.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 font-medium">
                {expandedCount} of {totalSections} sections open
              </span>
              
              {expandedCount < totalSections ? (
                <button
                  onClick={expandAll}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                  style={{
                    background: "rgba(56,189,248,0.1)",
                    color: colors.cyan,
                    border: "1px solid rgba(56,189,248,0.2)",
                  }}
                >
                  Expand All
                </button>
              ) : (
                <button
                  onClick={collapseAll}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                  style={{
                    background: "rgba(15,23,42,0.06)",
                    color: "rgba(15,23,42,0.5)",
                    border: "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  Collapse All
                </button>
              )}
            </div>
          </div>
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

        {/* Main grid - matching Home page layout */}
        <div className="grid xl:grid-cols-[1fr_1.2fr] gap-6 items-start">
          {/* Left: Accordion sections */}
          <div className="space-y-3">
            {/* Header Section */}
            <AccordionSection
              icon={sectionIcons.header}
              title={sectionTitles.header}
              color={sectionColors.header}
              isExpanded={expandedSections.header}
              onToggle={toggleSection}
              sectionId="header"
              index={0}
            >
              <Field
                label="Page Title"
                value={form.pageTitle}
                onChange={(value) => updateField("pageTitle", value)}
              />
              <TextArea
                label="Page Subtitle"
                value={form.pageSubtitle}
                onChange={(value) => updateField("pageSubtitle", value)}
                rows={3}
              />
            </AccordionSection>

            {/* Story Section */}
            <AccordionSection
              icon={sectionIcons.story}
              title={sectionTitles.story}
              color={sectionColors.story}
              isExpanded={expandedSections.story}
              onToggle={toggleSection}
              sectionId="story"
              index={1}
            >
              <Field
                label="Story Badge"
                value={form.storyBadge}
                onChange={(value) => updateField("storyBadge", value)}
              />
              <Field
                label="Story Title"
                value={form.storyTitle}
                onChange={(value) => updateField("storyTitle", value)}
              />
              <TextArea
                label="Story Paragraphs - one paragraph per line"
                value={form.storyParagraphs.join("\n")}
                onChange={(value) =>
                  updateField(
                    "storyParagraphs",
                    value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  )
                }
                rows={7}
              />
              <ImageUploadBox
                label="Story Image"
                imageUrl={form.storyImageUrl}
                uploading={uploadingKey === "storyImageUrl"}
                instruction="Recommended: 1200×900 px landscape, PNG/JPG/WebP, max 3 MB."
                onUpload={(file) => uploadImage("storyImageUrl", file)}
                onRemove={() => updateField("storyImageUrl", "")}
              />
              <Field
                label="Story Image Alt Text"
                value={form.storyImageAlt}
                onChange={(value) => updateField("storyImageAlt", value)}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Story Image Caption Title"
                  value={form.storyImageTitle}
                  onChange={(value) => updateField("storyImageTitle", value)}
                />
                <Field
                  label="Story Image Caption Subtitle"
                  value={form.storyImageSubtitle}
                  onChange={(value) => updateField("storyImageSubtitle", value)}
                />
              </div>
            </AccordionSection>

            {/* Section Headings */}
            <AccordionSection
              icon={sectionIcons.headings}
              title={sectionTitles.headings}
              color={sectionColors.headings}
              isExpanded={expandedSections.headings}
              onToggle={toggleSection}
              sectionId="headings"
              index={2}
            >
              <Field
                label="Pillar Badge"
                value={form.pillarBadge}
                onChange={(value) => updateField("pillarBadge", value)}
                placeholder="Our Core Values"
              />
              <Field
                label="Pillar Title"
                value={form.pillarTitle}
                onChange={(value) => updateField("pillarTitle", value)}
                placeholder="What Makes Us Different"
              />
              <Field
                label="Timeline Badge"
                value={form.timelineBadge}
                onChange={(value) => updateField("timelineBadge", value)}
                placeholder="Timeline"
              />
            </AccordionSection>

            {/* Pillar Cards */}
            <AccordionSection
              icon={sectionIcons.pillars}
              title={sectionTitles.pillars}
              color={sectionColors.pillars}
              isExpanded={expandedSections.pillars}
              onToggle={toggleSection}
              sectionId="pillars"
              index={3}
            >
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={addPillar}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Pillar
                </button>
              </div>

              <div className="space-y-4">
                {form.pillars.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl p-4 space-y-4"
                    style={{
                      background: "rgba(15,23,42,0.03)",
                      border: "1px solid rgba(15,23,42,0.06)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">
                        Pillar {index + 1}
                      </div>
                      <VisibilityDeleteControls
                        visible={item.visible}
                        onToggle={() => updatePillar(item.id, "visible", !item.visible)}
                        onDelete={() => deletePillar(item.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Field
                        label="Label"
                        value={item.label}
                        onChange={(value) => updatePillar(item.id, "label", value)}
                      />
                      <Field
                        label="Accent Color"
                        type="color"
                        value={item.color}
                        onChange={(value) => updatePillar(item.id, "color", value)}
                      />
                    </div>
                    <TextArea
                      label="Description"
                      value={item.desc}
                      onChange={(value) => updatePillar(item.id, "desc", value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* Leadership Messages */}
            <AccordionSection
              icon={sectionIcons.messages}
              title={sectionTitles.messages}
              color={sectionColors.messages}
              isExpanded={expandedSections.messages}
              onToggle={toggleSection}
              sectionId="messages"
              index={4}
            >
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={addMessage}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Message
                </button>
              </div>

              <div className="space-y-4">
                {form.messages?.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl p-4 space-y-4"
                    style={{
                      background: "rgba(15,23,42,0.03)",
                      border: "1px solid rgba(15,23,42,0.06)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">
                        Message {index + 1}
                      </div>
                      <VisibilityDeleteControls
                        visible={item.visible}
                        onToggle={() => updateMessage(item.id, "visible", !item.visible)}
                        onDelete={() => deleteMessage(item.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Field
                        label="Name"
                        value={item.name}
                        onChange={(value) => updateMessage(item.id, "name", value)}
                      />
                      <Field
                        label="Role"
                        value={item.role}
                        onChange={(value) => updateMessage(item.id, "role", value)}
                      />
                    </div>
                    <Field
                      label="Title"
                      value={item.title}
                      onChange={(value) => updateMessage(item.id, "title", value)}
                    />
                    <TextArea
                      label="Message"
                      value={item.message}
                      onChange={(value) => updateMessage(item.id, "message", value)}
                      rows={3}
                    />
                    <ImageUploadBox
                      label="Leadership Photo"
                      imageUrl={item.image}
                      uploading={uploadingKey === `message-${item.id}`}
                      instruction="Upload leadership photo"
                      onUpload={async (file) => {
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        const res = await axios.post("http://localhost:5000/api/upload", formData);
                        const uploadedUrl = res.data?.url || res.data?.imageUrl || res.data?.data?.url;
                        updateMessage(item.id, "image", uploadedUrl);
                      }}
                      onRemove={() => updateMessage(item.id, "image", "")}
                    />
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* Mission & Vision */}
            <AccordionSection
              icon={sectionIcons.missionVision}
              title={sectionTitles.missionVision}
              color={sectionColors.missionVision}
              isExpanded={expandedSections.missionVision}
              onToggle={toggleSection}
              sectionId="missionVision"
              index={5}
            >
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={addMissionVision}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Card
                </button>
              </div>

              <div className="space-y-4">
                {form.missionVision.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl p-4 space-y-4"
                    style={{
                      background: "rgba(15,23,42,0.03)",
                      border: "1px solid rgba(15,23,42,0.06)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">
                        Card {index + 1}
                      </div>
                      <VisibilityDeleteControls
                        visible={item.visible}
                        onToggle={() => updateMissionVision(item.id, "visible", !item.visible)}
                        onDelete={() => deleteMissionVision(item.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Field
                        label="Title"
                        value={item.title}
                        onChange={(value) => updateMissionVision(item.id, "title", value)}
                      />
                      <Field
                        label="Accent Color"
                        type="color"
                        value={item.color}
                        onChange={(value) => updateMissionVision(item.id, "color", value)}
                      />
                    </div>
                    <TextArea
                      label="Description"
                      value={item.desc}
                      onChange={(value) => updateMissionVision(item.id, "desc", value)}
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* Journey Timeline */}
            <AccordionSection
              icon={sectionIcons.journey}
              title={sectionTitles.journey}
              color={sectionColors.journey}
              isExpanded={expandedSections.journey}
              onToggle={toggleSection}
              sectionId="journey"
              index={6}
            >
              <Field
                label="Journey Section Title"
                value={form.journeyTitle}
                onChange={(value) => updateField("journeyTitle", value)}
              />

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={addJourney}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Journey
                </button>
              </div>

              <div className="space-y-4 mt-4">
                {form.journey.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl p-4 space-y-4"
                    style={{
                      background: "rgba(15,23,42,0.03)",
                      border: "1px solid rgba(15,23,42,0.06)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">
                        Journey {index + 1}
                      </div>
                      <VisibilityDeleteControls
                        visible={item.visible}
                        onToggle={() => updateJourney(item.id, "visible", !item.visible)}
                        onDelete={() => deleteJourney(item.id)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Field
                        label="Year / Label"
                        value={item.year}
                        onChange={(value) => updateJourney(item.id, "year", value)}
                      />
                      <Field
                        label="Title"
                        value={item.title}
                        onChange={(value) => updateJourney(item.id, "title", value)}
                      />
                    </div>
                    <TextArea
                      label="Description"
                      value={item.desc}
                      onChange={(value) => updateJourney(item.id, "desc", value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </AccordionSection>
          </div>

          {/* Right: Preview */}
          <aside
            className="xl:sticky xl:top-24 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.94))",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(11,16,32,0.3)",
            }}
          >
            {/* Preview header */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(56,189,248,0.12)" }}
                >
                  <EyeIcon className="w-4 h-4" style={{ color: colors.cyan }} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">About Page Preview</div>
                  <div className="text-white/45 text-xs">Updates live while typing</div>
                </div>
              </div>
              {/* Fake browser dots */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
            </div>

            <div className="bg-white overflow-y-auto" style={{ height: "720px" }}>
              <AboutPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}