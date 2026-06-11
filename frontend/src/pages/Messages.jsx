import { motion } from "framer-motion";

const founderImage =
"https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80";

const principalImage =
"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80";

export default function Messages() {
return (
<section
className="min-h-screen py-28"
style={{
background: `
radial-gradient(circle at top left,
rgba(139,92,246,0.12),
transparent 35%),

      radial-gradient(circle at bottom right,
      rgba(22,163,74,0.12),
      transparent 35%),

      #faf7f5
    `,
  }}
>
  <div className="max-w-7xl mx-auto px-6">

    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span
        className="inline-block px-5 py-2 rounded-full text-sm font-semibold mb-6"
        style={{
          background: "rgba(215,25,32,.08)",
          color: "#D71920",
          border: "1px solid rgba(215,25,32,.15)",
        }}
      >
        Leadership Messages
      </span>

      <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
        Messages From
        <span className="text-green-700"> Leadership</span>
      </h1>

      <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg">
        Inspiring words from our Founder and Principal,
        guiding students towards academic excellence,
        leadership, and lifelong learning.
      </p>
    </motion.div>

    {/* Founder Section */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-xl p-8 lg:p-12 mb-16"
    >
      <h2 className="text-4xl font-bold mb-10 text-slate-900">
        Founder’s Message
      </h2>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-slate-700 leading-9 text-lg">
            After crossing a silver jubilee of the school,
            Baljagriti has successfully established itself as
            one of the leading educational institutions in the
            region. Our commitment to academic excellence,
            discipline, innovation, and character-building has
            enabled thousands of students to achieve success
            in their personal and professional lives.
          </p>

          <p className="text-slate-700 leading-9 text-lg mt-6">
            We strive to create an environment where students
            can discover their talents, develop confidence,
            and become responsible global citizens capable of
            contributing positively to society.
          </p>

          <div className="mt-10">
            <h3 className="text-3xl font-bold text-slate-900">
              Dinesh Prasad Bhandari
            </h3>

            <p className="text-green-700 font-semibold text-lg">
              Founder / Director
            </p>
          </div>
        </div>

        <div>
          <img
            src={founderImage}
            alt="Founder"
            className="w-full h-[550px] object-cover rounded-[28px] shadow-lg"
          />
        </div>
      </div>
    </motion.div>

    {/* Principal Section */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-xl p-8 lg:p-12"
    >
      <h2 className="text-4xl font-bold mb-10 text-slate-900">
        Principal’s Message
      </h2>

      <div className="grid lg:grid-cols-2 gap-12 items-center">

        <div>
          <img
            src={principalImage}
            alt="Principal"
            className="w-full h-[550px] object-cover rounded-[28px] shadow-lg"
          />
        </div>

        <div>
          <p className="text-slate-700 leading-9 text-lg">
            Education is the strongest foundation for a
            successful future. At Baljagriti Secondary English
            Boarding School, we focus on nurturing not only
            academic excellence but also creativity,
            leadership, integrity, and critical thinking.
          </p>

          <p className="text-slate-700 leading-9 text-lg mt-6">
            Our dedicated team of educators works tirelessly
            to ensure that every student receives individual
            attention and opportunities to grow intellectually,
            socially, and emotionally in a supportive
            environment.
          </p>

          <div className="mt-10">
            <h3 className="text-3xl font-bold text-slate-900">
              Binod Subedi
            </h3>

            <p className="text-green-700 font-semibold text-lg">
              Principal
            </p>
          </div>
        </div>

      </div>
    </motion.div>

  </div>
</section>
);
}
