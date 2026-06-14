import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  MessageSquareText,
  UserRound,
  Image,
  Type,
  CheckCircle2,
  Eye,
  ExternalLink,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultMessagesContent = {
  badge: "Leadership Messages",
  title: "Messages From Leadership",
  description:
    "Words from school leadership guiding students toward academic excellence, discipline, values, and lifelong learning.",
  people: [
    {
      id: crypto.randomUUID(),
      name: "Principal",
      role: "Principal",
      title: "Principal’s Message",
      message:
        "Welcome to Baljagriti Secondary English School. We are committed to nurturing every child into a confident, capable, disciplined, and compassionate individual. Our goal is to provide quality education with strong values, creativity, and academic excellence.",
      image: "",
    },
    {
      id: crypto.randomUUID(),
      name: "Vice Principal",
      role: "Vice Principal",
      title: "Vice Principal’s Message",
      message:
        "Our team works tirelessly to provide a safe, inspiring, and academically rigorous environment for every student. We believe every child deserves care, guidance, and opportunities to grow academically, socially, and personally.",
      image: "",
    },
  ],
};

function mergeMessagesContent(saved = {}) {
  return {
    ...defaultMessagesContent,
    ...saved,
    people:
      Array.isArray(saved.people) && saved.people.length > 0
        ? saved.people.map((person) => ({
            id: person.id || crypto.randomUUID(),
            name: person.name || "",
            role: person.role || "",
            title: person.title || "",
            message: person.message || "",
            image: person.image || "",
          }))
        : defaultMessagesContent.people,
  };
}

function Field({ label, value, onChange, textarea = false, placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          placeholder={placeholder}
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
          placeholder={placeholder}
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

function MessagesPreview({ form }) {
  return (
    <div
      className="min-h-full p-6"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(124,92,196,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.13), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div className="text-center mb-10">
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
          style={{
            background: "rgba(215,25,32,0.08)",
            color: colors.red,
            border: "1px solid rgba(215,25,32,0.16)",
          }}
        >
          {form.badge}
        </span>

        <h1
          className="text-4xl mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 850,
            color: colors.dark,
            letterSpacing: "-0.045em",
          }}
        >
          {form.title}
        </h1>

        <p className="max-w-2xl mx-auto text-base text-slate-500 leading-relaxed">
          {form.description}
        </p>
      </div>

      <div className="space-y-6">
        {form.people.map((person) => (
          <div
            key={person.id}
            className="rounded-3xl overflow-hidden flex flex-col md:flex-row"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
              border: "1px solid rgba(11,16,32,0.08)",
              boxShadow:
                "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
          >
            <div
              className="w-full md:w-[220px] flex-shrink-0 flex flex-col items-center justify-center text-center p-7"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,248,238,0.96), rgba(241,236,255,0.8))",
                borderRight: "1px solid rgba(11,16,32,0.08)",
              }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden mb-5"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(11,16,32,0.08)",
                  boxShadow: "0 16px 38px rgba(11,16,32,0.1)",
                }}
              >
                {person.image ? (
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserRound className="w-12 h-12 text-slate-400" />
                )}
              </div>

              <h3
                className="text-xl mb-1"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 850,
                  color: colors.dark,
                  letterSpacing: "-0.025em",
                }}
              >
                {person.name || "Name"}
              </h3>

              <p className="text-sm font-semibold" style={{ color: colors.green }}>
                {person.role || "Role"}
              </p>
            </div>

            <div className="relative flex-1 p-7">
              <div
                className="absolute right-7 top-5 text-6xl leading-none"
                style={{ color: "rgba(75,46,131,0.1)" }}
              >
                ”
              </div>

              <h2
                className="text-3xl mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 850,
                  color: colors.dark,
                  letterSpacing: "-0.035em",
                }}
              >
                {person.title || "Message Title"}
              </h2>

              <p className="text-base leading-relaxed text-slate-500">
                {person.message || "Message text..."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultMessagesContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadMessagesContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/messages"
        );

        const savedContent = res.data?.data?.content || {};
        setForm(mergeMessagesContent(savedContent));
      } catch (err) {
        console.error("Load messages content error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessagesContent();
  }, []);

  const updatePageField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePerson = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      people: prev.people.map((person) =>
        person.id === id
          ? {
              ...person,
              [name]: value,
            }
          : person
      ),
    }));
  };

  const addPerson = () => {
    setForm((prev) => ({
      ...prev,
      people: [
        ...prev.people,
        {
          id: crypto.randomUUID(),
          name: "New Leader",
          role: "Designation",
          title: "New Message",
          message: "Write leadership message here.",
          image: "",
        },
      ],
    }));
  };

  const deletePerson = (id) => {
    setForm((prev) => ({
      ...prev,
      people: prev.people.filter((person) => person.id !== id),
    }));
  };

  const saveMessagesContent = async () => {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/site-content/messages",
        {
          content: form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Leadership messages saved successfully.");
    } catch (err) {
      console.error("Save messages content error:", err);
      setError(
        err.response?.data?.message || "Could not save leadership messages."
      );
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
        <div className="text-slate-600 font-semibold">
          Loading messages editor...
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
              href="/messages"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Page
            </a>

            <button
              type="button"
              onClick={addPerson}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <Plus className="w-4 h-4" />
              Add Block
            </button>

            <button
              type="button"
              onClick={saveMessagesContent}
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
              background: "rgba(75,46,131,0.1)",
              color: colors.purple,
              border: "1px solid rgba(75,46,131,0.2)",
            }}
          >
            <MessageSquareText className="w-4 h-4" />
            Manage Messages
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
            Edit Leadership Messages
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Edit the page heading, description, leadership photos, messages, and
            add or delete leadership blocks.
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
            <EditorCard icon={Type} title="Page Header" color={colors.purple}>
              <div className="grid gap-5">
                <Field
                  label="Badge Text"
                  value={form.badge}
                  onChange={(value) => updatePageField("badge", value)}
                />
                <Field
                  label="Page Title"
                  value={form.title}
                  onChange={(value) => updatePageField("title", value)}
                />
                <Field
                  label="Page Description"
                  value={form.description}
                  onChange={(value) => updatePageField("description", value)}
                  textarea
                />
              </div>
            </EditorCard>

            {form.people.map((person, index) => (
              <EditorCard
                key={person.id}
                icon={UserRound}
                title={`Leadership Block ${index + 1}`}
                color={colors.green}
              >
                <div className="flex justify-end mb-5">
                  <button
                    type="button"
                    onClick={() => deletePerson(person.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                    style={{
                      background: "rgba(215,25,32,0.09)",
                      color: colors.red,
                      border: "1px solid rgba(215,25,32,0.2)",
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Block
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="Name"
                    value={person.name}
                    onChange={(value) => updatePerson(person.id, "name", value)}
                  />
                  <Field
                    label="Role"
                    value={person.role}
                    onChange={(value) => updatePerson(person.id, "role", value)}
                  />
                </div>

                <div className="mt-5">
                  <Field
                    label="Message Title"
                    value={person.title}
                    onChange={(value) => updatePerson(person.id, "title", value)}
                  />
                </div>

                <div className="mt-5">
                  <Field
                    label="Message"
                    value={person.message}
                    onChange={(value) =>
                      updatePerson(person.id, "message", value)
                    }
                    textarea
                  />
                </div>

                <div className="mt-5">
                  <Field
                    label="Photo URL"
                    value={person.image}
                    onChange={(value) => updatePerson(person.id, "image", value)}
                    placeholder="Paste image URL here"
                  />
                </div>

                {person.image && (
                  <div
                    className="mt-5 rounded-2xl overflow-hidden"
                    style={{
                      border: "1px solid rgba(11,16,32,0.08)",
                    }}
                  >
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
              </EditorCard>
            ))}

            <button
              type="button"
              onClick={addPerson}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-3xl font-bold transition-all hover:scale-[1.01]"
              style={{
                color: colors.dark,
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.76))",
                border: "1px dashed rgba(75,46,131,0.35)",
                boxShadow: "0 18px 48px rgba(11,16,32,0.06)",
              }}
            >
              <Plus className="w-5 h-5" />
              Add New Leadership Block
            </button>
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
                Messages Preview
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
              <MessagesPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}