import { Calendar, Download } from "lucide-react";

const notices = [
  {
    id: 1,
    title: "First Terminal Examination Notice",
    date: "2083-02-15",
    pdf: "#",
  },
  {
    id: 2,
    title: "School Reopening Notice",
    date: "2083-02-08",
    pdf: "#",
  },
  {
    id: 3,
    title: "Parents Meeting Notice",
    date: "2083-02-01",
    pdf: "#",
  },
];

export default function Notices() {
  return (
    <section className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-12">
          <h1 className="text-5xl font-bold">
            School Notices
          </h1>

          <div className="w-24 h-1 bg-green-600 mt-4 rounded-full" />
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-6">

            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white p-6 rounded-2xl shadow"
              >
                <h3 className="text-xl font-bold mb-3">
                  {notice.title}
                </h3>

                <div className="flex items-center gap-2 text-slate-500 mb-4">
                  <Calendar size={18} />
                  {notice.date}
                </div>

                <a
                  href={notice.pdf}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  <Download size={18} />
                  Download Notice
                </a>
              </div>
            ))}

          </div>

          <div>
            <div className="bg-white rounded-2xl shadow p-6 sticky top-28">
              <h3 className="text-2xl font-bold mb-4">
                Nepali Calendar
              </h3>

              <div className="bg-slate-100 rounded-xl h-80 flex items-center justify-center">
                Nepali Calendar Here
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}