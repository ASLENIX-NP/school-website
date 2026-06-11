import { motion } from "motion/react";
import { MessageCircle, MapPin, FileText, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Play Group Admission",
    desc: "Admission opens for Play Group in the month of Magh. Parents can contact the school administration for details.",
    color: "#f97316",
  },
  {
    icon: MapPin,
    step: "02",
    title: "LKG to Class IX",
    desc: "Admission for Lower Kindergarten to Class IX opens from the new academic year in Baishakh.",
    color: "#6b21a8",
  },
  {
    icon: FileText,
    step: "03",
    title: "Written Examination",
    desc: "Interested candidates are selected through a written examination followed by parents or guardians’ interview.",
    color: "#2563eb",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Enrollment",
    desc: "Selected students complete enrollment by submitting required documents to the school administration.",
    color: "#059669",
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
      style={{ background: "#0f1c3f" }}
    >
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(107,33,168,0.15), transparent 70%)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.1), transparent 70%)",
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
              background: "rgba(249,115,22,0.15)",
              color: "#fb923c",
              border: "1px solid rgba(249,115,22,0.3)",
            }}
          >
            Admissions
          </span>

          <h2
            className="text-4xl md:text-5xl mb-5 text-white"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Your Journey{" "}
            <span className="italic" style={{ color: "#f97316" }}>
              Starts Here
            </span>
          </h2>

          <p
            className="max-w-xl mx-auto text-lg"
            style={{ color: "rgba(255,255,255,0.65)" }}
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
                      background: `linear-gradient(90deg, ${s.color}60, transparent)`,
                    }}
                  />
                )}

                <div
                  className="p-6 rounded-3xl h-full transition-all duration-300 group-hover:-translate-y-2"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${s.color}30`,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `${s.color}20`,
                        border: `1px solid ${s.color}40`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: s.color }} />
                    </div>

                    <span
                      className="text-4xl font-bold opacity-20"
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
                    style={{ color: "rgba(255,255,255,0.55)" }}
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
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(20px)",
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
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Fill in the form and the school administration will contact you
              with admission details.
            </p>

            {isSubmitSuccessful ? (
              <div
                className="py-8 text-center rounded-2xl"
                style={{
                  background: "rgba(5,150,105,0.15)",
                  border: "1px solid rgba(5,150,105,0.3)",
                }}
              >
                <div className="text-4xl mb-3">🎉</div>
                <div className="text-white font-semibold text-lg">
                  Inquiry Submitted!
                </div>
                <div
                  className="text-sm mt-1"
                  style={{ color: "rgba(255,255,255,0.6)" }}
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
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      Full Name
                    </label>

                    <input
                      {...register("name", { required: true })}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgba(255,255,255,0.7)" }}
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
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#ffffff",
                      }}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      Phone Number
                    </label>

                    <input
                      {...register("phone")}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      Applying for Grade
                    </label>

                    <select
                      {...register("grade", { required: true })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#ffffff",
                      }}
                    >
                      <option value="" style={{ background: "#0f1c3f" }}>
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
                          style={{ background: "#0f1c3f" }}
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
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                    boxShadow: "0 8px 24px rgba(249,115,22,0.3)",
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