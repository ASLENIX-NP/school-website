import { Users, GraduationCap, Award } from "lucide-react";

const staffs = [
  {
    id: 1,
    name: "Binod Subedi",
    position: "Principal",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    qualification: "M.Ed",
  },
  {
    id: 2,
    name: "Amul Shrestha",
    position: "Vice Principal",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    qualification: "M.Ed",
  },
  {
    id: 3,
    name: "Prem Hamal",
    position: "Science Teacher",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598",
    qualification: "B.Sc, B.Ed",
  },
  {
    id: 4,
    name: "Nirmala Aryal",
    position: "Coordinator",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    qualification: "M.A English",
  },
  {
    id: 5,
    name: "Suman Karki",
    position: "Mathematics Teacher",
    image:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128",
    qualification: "M.Sc Mathematics",
  },
  {
    id: 6,
    name: "Sarita Sharma",
    position: "English Teacher",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
    qualification: "M.A English",
  },
];

export default function Staff() {
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
        {/* Hero */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
            style={{
              background: "rgba(22,138,58,0.08)",
              border: "1px solid rgba(22,138,58,0.18)",
              color: "#168A3A",
            }}
          >
            <Users size={16} />
            Our Faculty Team
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
            Our Staff &{" "}
            <span className="text-green-700">Members</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
            Meet the dedicated educators, mentors, and leaders who
            inspire excellence, character, and lifelong learning at
            Baljagriti Secondary English Boarding School.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <Users className="mx-auto text-green-700 mb-4" size={40} />
            <h3 className="text-4xl font-bold">50+</h3>
            <p className="text-slate-500">Teaching Staff</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <GraduationCap
              className="mx-auto text-purple-700 mb-4"
              size={40}
            />
            <h3 className="text-4xl font-bold">240+</h3>
            <p className="text-slate-500">Expert Faculty</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <Award className="mx-auto text-red-600 mb-4" size={40} />
            <h3 className="text-4xl font-bold">35+</h3>
            <p className="text-slate-500">Years Excellence</p>
          </div>
        </div>

        {/* Staff Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {staffs.map((staff) => (
            <div
              key={staff.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src={staff.image}
                  alt={staff.name}
                  className="w-full h-80 object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  {staff.name}
                </h3>

                <p className="text-green-700 font-semibold mt-1">
                  {staff.position}
                </p>

                <p className="text-slate-500 mt-3">
                  {staff.qualification}
                </p>

                <button
                  className="w-full mt-6 py-3 rounded-xl text-white font-medium transition hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg,#4B2E83,#168A3A)",
                  }}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
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
            Learn From The Best Educators
          </h2>

          <p className="text-lg opacity-90 mb-8">
            Our experienced faculty members are committed to helping
            every student achieve academic excellence and personal growth.
          </p>

          <button className="bg-white text-black px-8 py-3 rounded-2xl font-semibold hover:scale-105 transition">
            Contact Administration
          </button>
        </div>
      </div>
    </section>
  );
}