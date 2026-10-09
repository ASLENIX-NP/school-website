import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  BusFront,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Copy,
  GraduationCap,
  MessageCircle,
  Phone,
  School,
  Wallet,
  X,
} from "lucide-react";

const schoolPhone = "057-590144";

const topics = [
  {
    id: "admissions",
    label: "Admissions",
    detail: "Joining Baljagriti",
    icon: GraduationCap,
    answer:
      "Thinking about joining Baljagriti? Explore the admissions page for information about applying. For grade availability or required documents, our school team can help.",
    links: [{ label: "Explore admissions", to: "/admissions" }],
  },
  {
    id: "fees",
    label: "Fees & payments",
    detail: "Fee details and payment help",
    icon: Wallet,
    answer:
      "For the current fee structure, payment schedule, and applicable charges, please contact the school office so you receive the latest information.",
    links: [{ label: "Contact the office", to: "/contact" }],
    phone: true,
  },
  {
    id: "academics",
    label: "Academics",
    detail: "Learning and examinations",
    icon: BookOpen,
    answer:
      "Find out about our learning approach, academic strengths, and examination system on the academics page.",
    links: [{ label: "Explore academics", to: "/academics" }],
  },
  {
    id: "facilities",
    label: "Facilities & transport",
    detail: "Campus, labs, and bus facility",
    icon: BusFront,
    answer:
      "Explore the facilities page for information about campus spaces, learning resources, activities, and the bus facility.",
    links: [{ label: "Explore facilities", to: "/facilities" }],
  },
  {
    id: "calendar",
    label: "School dates & notices",
    detail: "Events, holidays, and updates",
    icon: CalendarDays,
    answer:
      "Check the calendar for upcoming dates and the notices page for the latest school announcements.",
    links: [
      { label: "View calendar", to: "/calendar" },
      { label: "View notices", to: "/notices" },
    ],
  },
  {
    id: "contact",
    label: "Talk to the school",
    detail: "Ask us something else",
    icon: CircleHelp,
    answer:
      "We’re happy to help. Send your question through the contact page or call the school office.",
    links: [{ label: "Open contact page", to: "/contact" }],
    phone: true,
  },
];

export default function SchoolInquiryChat() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [phoneCopied, setPhoneCopied] = useState(false);

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
    window.setTimeout(() => setPhoneCopied(false), 1800);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[120] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-label="Baljagriti school inquiry guide"
          className="flex max-h-[590px] w-[min(390px,calc(100vw-28px))] flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(10,18,45,0.28)]"
          role="dialog"
          aria-modal="false"
          style={{ maxHeight: "min(590px, calc(100dvh - 112px))" }}
        >
          <header className="relative overflow-hidden bg-[#38BDF8] px-5 pb-5 pt-5 text-[#082F49]">
            <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border border-white/10" />
            <div className="absolute -right-1 -top-5 h-24 w-24 rounded-full border border-white/10" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/55 text-[#075985] ring-1 ring-white/60">
                  <School className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#075985]">
                    Baljagriti School
                  </p>
                  <h2 className="mt-0.5 text-lg font-extrabold">School Guide</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-[#082F49]/75 transition hover:bg-white/40 hover:text-[#082F49] focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="Minimize school guide"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative mt-4 flex items-center gap-2 text-xs text-[#082F49]/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              Quick answers from the school website
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#F7F8FC] px-4 py-4">
            <div className="mb-4 flex gap-2.5">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#38BDF8] text-[#082F49]">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="max-w-[290px] rounded-2xl rounded-tl-md border border-slate-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-sm font-bold text-slate-900">Hi there! 👋</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  Welcome to Baljagriti. Is there an inquiry I can help with?
                </p>
              </div>
            </div>

            {selectedTopic ? (
              <div className="ml-10 space-y-3">
                <div className="rounded-2xl rounded-tr-md bg-[#38BDF8] px-4 py-2.5 text-sm font-semibold text-[#082F49] shadow-sm">
                  {selectedTopic.label}
                </div>
                <div className="rounded-2xl rounded-tl-md border border-slate-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm leading-6 text-slate-700">
                    {selectedTopic.answer}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedTopic.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        style={{ color: "#082F49" }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#38BDF8] px-3 py-2 text-xs font-bold transition hover:bg-[#7DD3FC] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/40"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    ))}
                    {selectedTopic.phone && (
                      <>
                        <a
                          href={`tel:${schoolPhone}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        >
                          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                          Call the office
                        </a>
                        <button
                          type="button"
                          onClick={copySchoolPhone}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-sky-300 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        >
                          {phoneCopied ? (
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          {phoneCopied ? "Number copied" : "Copy number"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTopic(null)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#075985] hover:text-emerald-700"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Browse all topics
                </button>
              </div>
            ) : (
              <div className="ml-10">
                <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
                  Choose a topic
                </p>
                <div className="space-y-2">
                  {topics.map((topic) => {
                    const Icon = topic.icon;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setSelectedTopic(topic)}
                        className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#075985] transition group-hover:bg-emerald-50 group-hover:text-emerald-700">
                          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-slate-800">
                            {topic.label}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-slate-500">
                            {topic.detail}
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-700" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-3">
            <span className="text-[11px] font-medium text-slate-400">
              Need a person? Call {schoolPhone}
            </span>
            <a
              href={`tel:${schoolPhone}`}
              aria-label="Call Baljagriti School"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
            </a>
          </footer>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close school guide" : "Open school guide"}
        aria-expanded={isOpen}
        className="group flex items-center gap-3 rounded-full bg-[#38BDF8] p-2 pr-5 text-[#082F49] shadow-[0_12px_30px_rgba(2,132,199,0.3)] ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:bg-[#7DD3FC] focus:outline-none focus:ring-4 focus:ring-[#0284C7]/25"
      >
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/75 text-[#075985]">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          {!isOpen && (
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#38BDF8] bg-[#FACC15]" />
          )}
        </span>
        <span className="text-left">
          <span className="block text-sm font-extrabold leading-4">School Guide</span>
          <span className="mt-1 block text-[10px] font-medium text-[#082F49]/75">
            Ask us a question
          </span>
        </span>
      </button>
    </div>
  );
}
