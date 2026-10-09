import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Bot,
  Check,
  Copy,
  MessageCircle,
  Phone,
  RotateCcw,
  Send,
  X,
} from "lucide-react";

const schoolPhone = "057-590144";

// Your backend endpoint (see server/chat-server.js). If it is missing or
// fails, the bot automatically falls back to the built-in answers below.
const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || "/api/chat";

/* ------------------------------------------------------------------ */
/* Built-in knowledge base (used when the AI backend is unavailable).   */
/* Add or edit topics here. `keywords` drive matching.                  */
/* ------------------------------------------------------------------ */
const topics = [
  {
    id: "admissions",
    chip: "Admissions",
    keywords: [
      "admission", "admit", "join", "enroll", "enrol", "apply", "application",
      "new student", "seat", "document", "form", "session", "2027", "2026",
      "next year", "vacancy",
    ],
    answer:
      "Baljagriti teaches students from Play Group to Grade 10. The admissions page explains how to apply. Seat availability for a specific year or grade, and the documents needed, are confirmed by the school office. You can call 057-590144.",
    links: [{ label: "Admissions", to: "/admissions" }],
    phone: true,
  },
  {
    id: "fees",
    chip: "Fees",
    keywords: [
      "fee", "fees", "payment", "pay", "cost", "charge", "price", "tuition",
      "scholarship", "discount", "installment", "how much",
    ],
    answer:
      "Fees and payment schedules can change, so please contact the school office to get the latest and correct information.",
    links: [{ label: "Contact", to: "/contact" }],
    phone: true,
  },
  {
    id: "academics",
    chip: "Academics",
    keywords: [
      "academic", "study", "subject", "curriculum", "exam", "examination",
      "result", "teacher", "learning", "syllabus", "test",
    ],
    answer:
      "You can read about our learning approach, academic strengths, and examination system on the academics page.",
    links: [{ label: "Academics", to: "/academics" }],
  },
  {
    id: "facilities",
    chip: "Facilities",
    keywords: [
      "facility", "facilities", "campus", "lab", "library", "sport", "play ground",
      "playground", "activity", "activities", "computer",
    ],
    answer:
      "The facilities page covers our campus spaces, learning resources, and activities.",
    links: [{ label: "Facilities", to: "/facilities" }],
  },
  {
    id: "transport",
    chip: "Bus & transport",
    keywords: ["bus", "transport", "transportation", "van", "route", "pickup", "pick up", "drop"],
    answer:
      "Baljagriti has a bus facility. Check the facilities page for an overview, or call the office to ask about routes and availability.",
    links: [{ label: "Facilities", to: "/facilities" }],
    phone: true,
  },
  {
    id: "calendar",
    chip: "Dates & notices",
    keywords: [
      "calendar", "date", "holiday", "event", "notice", "announcement",
      "schedule", "vacation", "break", "when", "news", "update",
    ],
    answer:
      "Upcoming dates are on the calendar page, and the latest announcements are on the notices page.",
    links: [
      { label: "Calendar", to: "/calendar" },
      { label: "Notices", to: "/notices" },
    ],
  },
  {
    id: "about",
    chip: "About the school",
    keywords: [
      "about", "history", "established", "founded", "since", "who are you",
      "play group", "nursery", "grade 10", "which grades", "what grades", "levels",
    ],
    answer:
      "Baljagriti English Secondary School is in Basudev Marga, Hetauda-2. It was established in 2046 BS and teaches students from Play Group to Grade 10.",
    links: [{ label: "Contact", to: "/contact" }],
  },
  {
    id: "contact",
    chip: "Talk to the school",
    keywords: [
      "contact", "call", "phone", "number", "reach", "office", "person",
      "human", "staff", "principal", "address", "location", "where", "email",
    ],
    answer:
      "The school is at Basudev Marga, Hetauda-2. You can call the office on 057-590144, 057-590145, or 057-590146, or send a question through the contact page.",
    links: [{ label: "Contact", to: "/contact" }],
    phone: true,
  },
];

const greetingWords = ["hi", "hello", "hey", "namaste", "good morning", "good afternoon", "good evening"];
const thanksWords = ["thanks", "thank you", "thank u", "dhanyabad"];

const quickReplies = topics.map((t) => t.chip);

const welcomeMessage = () => ({
  id: "welcome",
  from: "bot",
  text: "Hi, I'm the Baljagriti assistant. Ask me about admissions, fees, academics, the bus, or school dates.",
});

/* ------------------------- local matching ---------------------------- */
function getReply(input) {
  const text = input.toLowerCase().trim();

  const chipMatch = topics.find((t) => t.chip.toLowerCase() === text);
  if (chipMatch) return chipMatch;

  if (thanksWords.some((w) => text.includes(w))) {
    return { answer: "You're welcome! Is there anything else I can help with?" };
  }

  let best = null;
  let bestScore = 0;
  for (const topic of topics) {
    const score = topic.keywords.reduce(
      (sum, kw) => (text.includes(kw) ? sum + kw.length : sum),
      0
    );
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  if (best) return best;

  const isGreeting = greetingWords.some(
    (w) => text === w || text.startsWith(w + " ") || text.startsWith(w + "!")
  );
  if (isGreeting) {
    return { answer: "Hello! What would you like to know about Baljagriti?" };
  }

  return {
    answer:
      "I'm not sure about that one. Try one of the topics below, or ask the school office directly and they'll help.",
    links: [{ label: "Contact", to: "/contact" }],
    phone: true,
  };
}

/* --------------------------- AI backend ------------------------------ */
async function askAssistant(history) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.reply === "string" && data.reply.trim()
      ? data.reply.trim()
      : null;
  } catch {
    return null; // no backend, offline, or timeout: use built-in answers
  } finally {
    window.clearTimeout(timeout);
  }
}

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

/* ----------------------------- component ----------------------------- */
export default function SchoolInquiryChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage()]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const copyTimer = useRef(null);
  const idCounter = useRef(0);
  const sessionRef = useRef(0); // bumps on reset so stale replies are ignored
  const mountedRef = useRef(true);

  const nextId = () => {
    idCounter.current += 1;
    return `m${idCounter.current}`;
  };

  // Greeting bubble: shows on every page load or reload.
  useEffect(() => {
    const showTimer = window.setTimeout(() => setShowTeaser(true), 1200);
    const hideTimer = window.setTimeout(() => setShowTeaser(false), 16000);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  // Focus the input when the chat opens.
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      window.clearTimeout(copyTimer.current);
    };
  }, []);

  const sendMessage = async (raw) => {
    const text = raw.trim();
    if (!text || isTyping) return;

    const session = sessionRef.current;
    const history = [
      ...messages.filter((m) => m.id !== "welcome"),
      { from: "user", text },
    ]
      .slice(-10)
      .map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      }));

    setMessages((prev) => [...prev, { id: nextId(), from: "user", text }]);
    setDraft("");
    setIsTyping(true);

    const started = Date.now();
    const local = getReply(text);
    const aiAnswer = await askAssistant(history);
    await wait(Math.max(0, 600 - (Date.now() - started)));

    if (!mountedRef.current || session !== sessionRef.current) return;

    // AI answer: attach buttons only if a topic really matched the question.
    const reply = aiAnswer
      ? {
          answer: aiAnswer,
          links: local.id ? local.links : undefined,
          phone: local.id ? local.phone : undefined,
        }
      : local;

    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        from: "bot",
        text: reply.answer,
        links: reply.links,
        phone: reply.phone,
      },
    ]);
    setIsTyping(false);
  };

  const resetChat = () => {
    sessionRef.current += 1;
    setIsTyping(false);
    setDraft("");
    setMessages([welcomeMessage()]);
  };

  const copySchoolPhone = async () => {
    try {
      await navigator.clipboard.writeText(schoolPhone);
    } catch {
      const input = document.createElement("textarea");
      input.value = schoolPhone;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setPhoneCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setPhoneCopied(false), 1800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(draft);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[120] flex flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      {isOpen && (
        <section
          aria-label="Baljagriti school assistant"
          role="dialog"
          aria-modal="false"
          className="flex w-[min(330px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-[#E2E5EF] bg-white shadow-[0_18px_50px_rgba(20,27,61,0.22)]"
          style={{ height: "min(470px, calc(100dvh - 96px))" }}
        >
          {/* Header */}
          <header className="flex items-center gap-2.5 bg-[#1B2559] px-3.5 py-3 text-white">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5B335] text-[#1B2559]">
              <Bot className="h-[18px] w-[18px]" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold leading-4">
                Baljagriti Assistant
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Replies instantly
              </p>
            </div>
            <button
              type="button"
              onClick={resetChat}
              className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#F5B335]"
              aria-label="Start a new chat"
              title="Start over"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#F5B335]"
              aria-label="Minimize assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#F4F6FB] px-3 py-3"
            aria-live="polite"
          >
            {messages.map((msg) =>
              msg.from === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <p className="max-w-[80%] break-words rounded-2xl rounded-br-sm bg-[#1B2559] px-3 py-2 text-[13px] leading-5 text-white">
                    {msg.text}
                  </p>
                </div>
              ) : (
                <div key={msg.id} className="flex items-end gap-2">
                  <div className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5B335] text-[#1B2559]">
                    <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                  <div className="max-w-[82%] rounded-2xl rounded-bl-sm border border-[#E2E5EF] bg-white px-3 py-2 shadow-sm">
                    <p className="whitespace-pre-line text-[13px] leading-5 text-[#2B3252]">
                      {msg.text}
                    </p>
                    {(msg.links?.length > 0 || msg.phone) && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.links?.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 rounded-full bg-[#F5B335] px-2.5 py-1.5 text-[11px] font-bold text-[#1B2559] transition hover:bg-[#FFC857] focus:outline-none focus:ring-2 focus:ring-[#1B2559]/40"
                            style={{ color: "#1B2559" }}
                          >
                            {link.label}
                            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                          </Link>
                        ))}
                        {msg.phone && (
                          <>
                            <a
                              href={`tel:${schoolPhone}`}
                              className="inline-flex items-center gap-1 rounded-full border border-[#D5D9E8] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#2B3252] transition hover:border-[#1B2559] focus:outline-none focus:ring-2 focus:ring-[#1B2559]/30"
                            >
                              <Phone className="h-3 w-3" aria-hidden="true" />
                              Call
                            </a>
                            <button
                              type="button"
                              onClick={copySchoolPhone}
                              className="inline-flex items-center gap-1 rounded-full border border-[#D5D9E8] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#2B3252] transition hover:border-[#1B2559] focus:outline-none focus:ring-2 focus:ring-[#1B2559]/30"
                            >
                              {phoneCopied ? (
                                <Check className="h-3 w-3" aria-hidden="true" />
                              ) : (
                                <Copy className="h-3 w-3" aria-hidden="true" />
                              )}
                              {phoneCopied ? "Copied" : schoolPhone}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5B335] text-[#1B2559]">
                  <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <div
                  className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-[#E2E5EF] bg-white px-3 py-2.5 shadow-sm"
                  role="status"
                  aria-label="Assistant is typing"
                >
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9AA1BD] motion-reduce:animate-none"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="border-t border-[#E2E5EF] bg-white px-3 pt-2">
            <div className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quickReplies.map((label) => (
                <button
                  key={label}
                  type="button"
                  disabled={isTyping}
                  onClick={() => sendMessage(label)}
                  className="shrink-0 rounded-full border border-[#D5D9E8] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#2B3252] transition hover:border-[#1B2559] hover:bg-[#F4F6FB] focus:outline-none focus:ring-2 focus:ring-[#1B2559]/30 disabled:opacity-50"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-[#E2E5EF] bg-white px-3 py-2.5"
          >
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your question…"
              maxLength={200}
              aria-label="Type your question"
              className="min-w-0 flex-1 rounded-full border border-[#D5D9E8] bg-[#F4F6FB] px-3.5 py-2 text-[13px] text-[#2B3252] placeholder:text-[#8A91AE] focus:border-[#1B2559] focus:outline-none focus:ring-2 focus:ring-[#1B2559]/20"
            />
            <button
              type="submit"
              disabled={!draft.trim() || isTyping}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B2559] text-white transition hover:bg-[#2A3680] focus:outline-none focus:ring-2 focus:ring-[#F5B335] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      {/* Greeting bubble */}
      {showTeaser && !isOpen && (
        <div
          role="status"
          className="relative w-[min(290px,calc(100vw-32px))] rounded-2xl rounded-br-sm border border-[#E2E5EF] bg-white px-3.5 py-3 pr-8 shadow-[0_12px_32px_rgba(20,27,61,0.2)]"
        >
          <button
            type="button"
            onClick={() => setShowTeaser(false)}
            aria-label="Dismiss greeting"
            className="absolute right-1.5 top-1.5 rounded-full p-1 text-[#8A91AE] transition hover:bg-[#F4F6FB] hover:text-[#2B3252] focus:outline-none focus:ring-2 focus:ring-[#1B2559]/30"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setShowTeaser(false);
              setIsOpen(true);
            }}
            className="block w-full text-left focus:outline-none"
          >
            <p className="text-[13px] font-bold text-[#1B2559]">Hi there! 👋</p>
            <p className="mt-1 text-[12.5px] leading-5 text-[#2B3252]">
              Hi, I'm the Baljagriti assistant. Ask me about admissions, fees,
              academics, the bus, or school dates.
            </p>
          </button>
        </div>
      )}

      {/* Launcher */}
      <button
        type="button"
        onClick={() => {
          setShowTeaser(false);
          setIsOpen((open) => !open);
        }}
        aria-label={isOpen ? "Close school assistant" : "Open school assistant"}
        aria-expanded={isOpen}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2559] text-white shadow-[0_8px_22px_rgba(27,37,89,0.35)] transition hover:bg-[#2A3680] focus:outline-none focus:ring-4 focus:ring-[#F5B335]/50"
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        )}
        {!isOpen && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#F5B335]" />
        )}
      </button>
    </div>
  );
}