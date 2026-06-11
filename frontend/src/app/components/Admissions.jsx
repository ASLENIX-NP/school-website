import { motion } from "motion/react";
import { MessageCircle, MapPin, FileText, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
};

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Play Group Admission",
    desc: "Admission opens for Play Group in the month of Magh. Parents can contact the school administration for details.",
    color: "#D71920",
  },
  {
    icon: MapPin,
    step: "02",
    title: "LKG to Class IX",
    desc: "Admission for Lower Kindergarten to Class IX opens from the new academic year in Baishakh.",
    color: "#168A3A",
  },
  {
    icon: FileText,
    step: "03",
    title: "Written Examination",
    desc: "Interested candidates are selected through a written examination followed by parents or guardians’ interview.",
    color: "#7C5CC4",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Enrollment",
    desc: "Selected students complete enrollment by submitting required documents to the school administration.",
    color: "#168A3A",
  },
];

function Admissions() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.log("Inquiry submitted:", data);
    reset();
  };

  return (
    <section
      id="admissions"
      className="pt-36 pb-28 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(22,138,58,0.2), transparent 34%),
          radial-gradient(circle at bottom left, rgba(215,25,32,0.18), transparent 34%),
          radial-gradient(circle at 50% 55%, rgba(75,46,131,0.32), transparent 42%),
          linear-gradient(135deg, #0B1020 0%, #1C1538 48%, #4B2E83 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 right-0 w-[620px] h-[620px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.2), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[460px] h-[460px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(215,25,32,0.18), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: colors.cream,
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
              backdropFilter: "blur(16px)",
            }}
          >
            Admissions
          </span>

          <h2
            className="text-4xl md:text-5xl mb-5 text-white"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Your Journey{" "}
            <span
              className="italic"
              style={{
                background: `linear-gradient(135deg, ${colors.red}, ${colors.green})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Starts Here
            </span>
          </h2>

          <p
            className="max-w-xl mx-auto text-lg"
            style={{ color: "rgba(255,248,238,0.7)" }}
          >
            Baljagriti Secondary English Boarding School welcomes students
            through a clear admission process for Play Group, LKG, and classes
            up to Class IX.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((s, i) => {
            const Icon = s.icon;

            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative group"
              >
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-12 left-full w-6 h-0.5 z-10"
                    style={{
                      background: `linear-gradient(90deg, ${s.color}80, transparent)`,
                    }}
                  />
                )}

                <div
                  className="p-6 rounded-3xl h-full transition-all duration-300 group-hover:-translate-y-2"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.045))",
                    border: `1px solid ${s.color}42`,
                    backdropFilter: "blur(18px)",
                    boxShadow:
                      "0 18px 46px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `${s.color}22`,
                        border: `1px solid ${s.color}48`,
                        boxShadow: `0 12px 28px ${s.color}24`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: s.color }} />
                    </div>

                    <span
                      className="text-4xl font-bold opacity-25"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: s.color,
                      }}
                    >
                      {s.step}
                    </span>
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-2">
                    {s.title}
                  </h3>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.58)" }}
                  >
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="max-w-2xl mx-auto"
        >
          <div
            className="p-8 md:p-10 rounded-3xl"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.055))",
              border: "1px solid rgba(255,255,255,0.16)",
              backdropFilter: "blur(22px)",
              boxShadow:
                "0 28px 80px rgba(0,0,0,0.34), 0 0 70px rgba(22,138,58,0.12)",
            }}
          >
            <h3
              className="text-2xl text-white mb-2"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
              }}
            >
              Admission Inquiry
            </h3>

            <p
              className="text-sm mb-8"
              style={{ color: "rgba(255,255,255,0.58)" }}
            >
              Fill in the form and the school administration will contact you
              with admission details.
            </p>

            {isSubmitSuccessful ? (
              <div
                className="py-8 text-center rounded-2xl"
                style={{
                  background: "rgba(22,138,58,0.16)",
                  border: "1px solid rgba(22,138,58,0.34)",
                  boxShadow: "0 16px 42px rgba(22,138,58,0.14)",
                }}
              >
                <div className="text-4xl mb-3">🎉</div>
                <div className="text-white font-semibold text-lg">
                  Inquiry Submitted!
                </div>
                <div
                  className="text-sm mt-1"
                  style={{ color: "rgba(255,255,255,0.66)" }}
                >
                  We'll be in touch within 24 hours.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgba(255,255,255,0.74)" }}
                    >
                      Full Name
                    </label>

                    <input
                      {...register("name", { required: true })}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        color: "#ffffff",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgba(255,255,255,0.74)" }}
                    >
                      Email Address
                    </label>

                    <input
                      {...register("email", { required: true })}
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        color: "#ffffff",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgba(255,255,255,0.74)" }}
                    >
                      Phone Number
                    </label>

                    <input
                      {...register("phone")}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        color: "#ffffff",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgba(255,255,255,0.74)" }}
                    >
                      Applying for Grade
                    </label>

                    <select
                      {...register("grade", { required: true })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        color: "#ffffff",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                      }}
                    >
                      <option value="" style={{ background: colors.dark }}>
                        Select grade
                      </option>

                      {[
                        "Play Group",
                        "LKG",
                        "UKG",
                        "Grade 1",
                        "Grade 2",
                        "Grade 3",
                        "Grade 4",
                        "Grade 5",
                        "Grade 6",
                        "Grade 7",
                        "Grade 8",
                        "Grade 9",
                      ].map((grade) => (
                        <option
                          key={grade}
                          value={grade}
                          style={{ background: colors.dark }}
                        >
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-semibold text-white mt-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, ${colors.red}, ${colors.green})`,
                    boxShadow: "0 16px 38px rgba(215,25,32,0.3)",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Inquiry →"}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export { Admissions };
export default Admissions;