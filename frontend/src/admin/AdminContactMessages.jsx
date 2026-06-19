import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Inbox,
  Mail,
  Phone,
  MessageCircle,
  Trash2,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  RefreshCcw,
  User,
  Clock,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

function formatDate(value) {
  if (!value) return "Recently";

  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Recently";
  }
}

function getSourceLabel(source) {
  if (source === "admission") return "Admissions";
  return "Contact";
}

function cleanPhone(phone = "") {
  return String(phone).replace(/[^\d+]/g, "");
}

function whatsappPhone(phone = "") {
  return cleanPhone(phone).replace(/^\+/, "");
}

function buildEmailLink(message) {
  const email = message.email || "";
  const subject = encodeURIComponent(
    `Re: ${message.subject || getSourceLabel(message.source) + " Message"}`
  );
  const body = encodeURIComponent(
    `Hello ${message.name || ""},\n\nThank you for contacting Baljagriti Secondary English School.\n\n`
  );

  return `mailto:${email}?subject=${subject}&body=${body}`;
}

function buildWhatsAppLink(message) {
  const phone = whatsappPhone(message.phone);
  const text = encodeURIComponent(
    `Hello ${message.name || ""}, thank you for contacting Baljagriti Secondary English School.`
  );

  return `https://wa.me/${phone}?text=${text}`;
}

function MessageCard({
  message,
  expanded,
  onToggleExpand,
  onToggleRead,
  onDelete,
}) {
  const sourceLabel = getSourceLabel(message.source);
  const phone = cleanPhone(message.phone);
  const canEmail = Boolean(message.email);
  const canPhone = Boolean(phone);
  const canWhatsapp = Boolean(phone);

  return (
    <motion.div
      layout
      className="rounded-[28px] p-5"
      style={{
        background: message.is_read
          ? "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.76))"
          : "linear-gradient(145deg, rgba(22,138,58,0.12), rgba(255,255,255,0.86))",
        border: message.is_read
          ? "1px solid rgba(11,16,32,0.08)"
          : "1px solid rgba(22,138,58,0.28)",
        boxShadow:
          "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black"
              style={{
                background:
                  message.source === "admission"
                    ? "rgba(75,46,131,0.1)"
                    : "rgba(215,25,32,0.09)",
                color: message.source === "admission" ? colors.purple : colors.red,
                border:
                  message.source === "admission"
                    ? "1px solid rgba(75,46,131,0.18)"
                    : "1px solid rgba(215,25,32,0.18)",
              }}
            >
              {sourceLabel}
            </span>

            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black"
              style={{
                background: message.is_read
                  ? "rgba(100,116,139,0.1)"
                  : "rgba(22,138,58,0.1)",
                color: message.is_read ? "#64748B" : colors.green,
                border: message.is_read
                  ? "1px solid rgba(100,116,139,0.16)"
                  : "1px solid rgba(22,138,58,0.18)",
              }}
            >
              {message.is_read ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Circle className="w-3.5 h-3.5" />
              )}
              {message.is_read ? "Read" : "Unread"}
            </span>

            <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(message.created_at)}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(15,23,42,0.06)",
                border: "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <User className="w-5 h-5 text-slate-500" />
            </div>

            <div>
              <h3
                className="text-2xl"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 850,
                  color: colors.dark,
                  letterSpacing: "-0.035em",
                }}
              >
                {message.name || "Unknown Sender"}
              </h3>

              <div className="text-sm text-slate-500">
                {message.email || "No email"} · {message.phone || "No phone"}
              </div>
            </div>
          </div>

          {message.subject && (
            <div className="font-bold text-slate-800 mt-4">
              {message.subject}
            </div>
          )}

          <p
            className={`text-slate-600 leading-relaxed mt-2 ${
              expanded ? "" : "line-clamp-2"
            }`}
          >
            {message.message || "No message text."}
          </p>

          <button
            type="button"
            onClick={onToggleExpand}
            className="mt-3 text-sm font-black"
            style={{ color: colors.purple }}
          >
            {expanded ? "Show Less" : "View More"}
          </button>
        </div>

        <div className="lg:w-[230px] flex lg:flex-col flex-wrap gap-3">
          <a
            href={canEmail ? buildEmailLink(message) : undefined}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black ${
              canEmail ? "" : "pointer-events-none opacity-45"
            }`}
            style={{
              background: "rgba(56,189,248,0.12)",
              color: "#0284C7",
              border: "1px solid rgba(56,189,248,0.22)",
            }}
          >
            <Mail className="w-4 h-4" />
            Reply Email
          </a>

          <a
            href={canPhone ? `tel:${phone}` : undefined}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black ${
              canPhone ? "" : "pointer-events-none opacity-45"
            }`}
            style={{
              background: "rgba(22,138,58,0.1)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.2)",
            }}
          >
            <Phone className="w-4 h-4" />
            Call
          </a>

          <a
            href={canWhatsapp ? buildWhatsAppLink(message) : undefined}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black ${
              canWhatsapp ? "" : "pointer-events-none opacity-45"
            }`}
            style={{
              background: "rgba(75,46,131,0.1)",
              color: colors.purple,
              border: "1px solid rgba(75,46,131,0.2)",
            }}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={onToggleRead}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black"
            style={{
              background: message.is_read
                ? "rgba(100,116,139,0.1)"
                : "rgba(22,138,58,0.1)",
              color: message.is_read ? "#64748B" : colors.green,
              border: message.is_read
                ? "1px solid rgba(100,116,139,0.16)"
                : "1px solid rgba(22,138,58,0.2)",
            }}
          >
            {message.is_read ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {message.is_read ? "Mark Unread" : "Mark Read"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black"
            style={{
              background: "rgba(215,25,32,0.09)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.2)",
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminContactMessages() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadMessages = async () => {
    setError("");

    try {
      const res = await axios.get("http://localhost:5000/api/contact-messages");
      setMessages(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Load contact messages error:", err);
      setError(
        err.response?.data?.message ||
          "Could not load contact/admission messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    if (filter === "unread") {
      return messages.filter((item) => !item.is_read);
    }

    if (filter === "read") {
      return messages.filter((item) => item.is_read);
    }

    if (filter === "contact") {
      return messages.filter((item) => item.source !== "admission");
    }

    if (filter === "admission") {
      return messages.filter((item) => item.source === "admission");
    }

    return messages;
  }, [filter, messages]);

  const unreadCount = messages.filter((item) => !item.is_read).length;
  const admissionCount = messages.filter(
    (item) => item.source === "admission"
  ).length;
  const contactCount = messages.filter(
    (item) => item.source !== "admission"
  ).length;

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleRead = async (message) => {
    setSuccess("");
    setError("");

    try {
      const nextReadStatus = !message.is_read;

      await axios.patch(
        `http://localhost:5000/api/contact-messages/${message.id}/read`,
        {
          is_read: nextReadStatus,
        }
      );

      setMessages((prev) =>
        prev.map((item) =>
          item.id === message.id
            ? {
                ...item,
                is_read: nextReadStatus,
              }
            : item
        )
      );

      setSuccess(nextReadStatus ? "Marked as read." : "Marked as unread.");
    } catch (err) {
      console.error("Update read status error:", err);
      setError(err.response?.data?.message || "Could not update message.");
    }
  };

  const deleteMessage = async (message) => {
    const ok = window.confirm("Delete this message?");
    if (!ok) return;

    setSuccess("");
    setError("");

    try {
      await axios.delete(
        `http://localhost:5000/api/contact-messages/${message.id}`
      );

      setMessages((prev) => prev.filter((item) => item.id !== message.id));
      setExpandedIds((prev) => prev.filter((item) => item !== message.id));
      setSuccess("Message deleted successfully.");
    } catch (err) {
      console.error("Delete message error:", err);
      setError(err.response?.data?.message || "Could not delete message.");
    }
  };

  const filters = [
    { key: "all", label: `All (${messages.length})` },
    { key: "unread", label: `Unread (${unreadCount})` },
    { key: "admission", label: `Admissions (${admissionCount})` },
    { key: "contact", label: `Contact (${contactCount})` },
    { key: "read", label: "Read" },
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
            onClick={loadMessages}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
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
            <Inbox className="w-4 h-4" />
            Message Inbox
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
            Contact & Admission Messages
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            View messages submitted from the public Contact and Admissions
            forms. Reply by email, phone, or WhatsApp.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-3xl p-5 bg-white/80 border border-slate-200">
            <div className="text-sm text-slate-500 font-bold">Total</div>
            <div className="text-3xl font-black text-slate-950">
              {messages.length}
            </div>
          </div>

          <div className="rounded-3xl p-5 bg-white/80 border border-slate-200">
            <div className="text-sm text-slate-500 font-bold">Unread</div>
            <div className="text-3xl font-black" style={{ color: colors.green }}>
              {unreadCount}
            </div>
          </div>

          <div className="rounded-3xl p-5 bg-white/80 border border-slate-200">
            <div className="text-sm text-slate-500 font-bold">Admissions</div>
            <div className="text-3xl font-black" style={{ color: colors.purple }}>
              {admissionCount}
            </div>
          </div>

          <div className="rounded-3xl p-5 bg-white/80 border border-slate-200">
            <div className="text-sm text-slate-500 font-bold">Contact</div>
            <div className="text-3xl font-black" style={{ color: colors.red }}>
              {contactCount}
            </div>
          </div>
        </div>

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

        <div className="flex flex-wrap gap-3 mb-6">
          {filters.map((item) => {
            const active = filter === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className="px-5 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5"
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${colors.purple}, ${colors.green})`
                    : "rgba(255,255,255,0.82)",
                  color: active ? "#FFFFFF" : colors.dark,
                  border: active
                    ? "1px solid rgba(255,255,255,0.18)"
                    : "1px solid rgba(15,23,42,0.08)",
                  boxShadow: active
                    ? "0 16px 36px rgba(22,138,58,0.2)"
                    : "0 10px 24px rgba(15,23,42,0.05)",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="rounded-3xl p-10 bg-white/80 border border-slate-200 text-center font-bold text-slate-500">
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="rounded-3xl p-10 bg-white/80 border border-slate-200 text-center">
            <Inbox className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <div className="font-black text-slate-900">No messages found.</div>
            <div className="text-sm text-slate-500 mt-1">
              Messages from Contact and Admissions forms will appear here.
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                expanded={expandedIds.includes(message.id)}
                onToggleExpand={() => toggleExpand(message.id)}
                onToggleRead={() => toggleRead(message)}
                onDelete={() => deleteMessage(message)}
              />
            ))}
          </div>
        )}
      </main>
    </section>
  );
}