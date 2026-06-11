import { Calendar, Download, Bell } from "lucide-react";

const notices = [
  {
    id: 1,
    title: "First Terminal Examination Notice",
    date: "2083-02-15",
    description:
      "Important notice regarding First Terminal Examination schedule, routines, and student guidelines.",
    pdf: "#",
  },
  {
    id: 2,
    title: "School Reopening Notice",
    date: "2083-02-08",
    description:
      "School will reopen after the scheduled break. Students are requested to attend regularly.",
    pdf: "#",
  },
  {
    id: 3,
    title: "Parents Meeting Notice",
    date: "2083-02-01",
    description:
      "Parents and guardians are requested to attend the upcoming school meeting.",
    pdf: "#",
  },
];

export default function Notices() {
  return (
    <section
      className="min-h-screen pt-32 pb-24"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(124,92,196,0.12), transparent 35%),
          radial-gradient(circle at bottom right, rgba(22,138,58,0.10), transparent 35%),
          linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 100%)
        `,
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
            style={{
              background: "rgba(215,25,32,0.08)",
              border: "1px solid rgba(215,25,32,0.18)",
              color: "#D71920",
            }}
          >
            <Bell size={16} />
            School Updates
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
            School <span className="text-green-700">Notices</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
            Stay informed with examination schedules, admissions,
            holidays, events, and important announcements from
            Baljagriti Secondary English Boarding School.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Notices */}
          <div className="lg:col-span-2 space-y-8">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {notice.title}
                </h3>

                <div className="flex items-center gap-2 text-slate-500 mb-4">
                  <Calendar size={18} />
                  <span>{notice.date}</span>
                </div>

                <p className="text-slate-600 leading-relaxed mb-6">
                  {notice.description}
                </p>

                <a
                  href={notice.pdf}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium transition hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #168A3A, #0F9D58)",
                  }}
                >
                  <Download size={18} />
                  Download Notice
                </a>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div>
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-28">
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                Nepali Calendar
              </h3>

              <iframe
                title="Nepali Calendar"
                src="https://www.hamropatro.com/widgets/calender-small.php"
                className="w-full h-[430px] rounded-2xl border-0"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-20 rounded-[32px] p-12 text-center text-white"
          style={{
            background:
              "linear-gradient(135deg,#D71920,#4B2E83,#168A3A)",
          }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Never Miss An Important Update
          </h2>

          <p className="text-lg opacity-90 mb-8">
            Stay connected with Baljagriti for notices,
            examination schedules, and school announcements.
          </p>

          <button className="bg-white text-black px-8 py-3 rounded-2xl font-semibold">
            Contact School Office
          </button>
        </div>
      </div>
    </section>
  );
}