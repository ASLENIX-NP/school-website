import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import {
  MessageCircle,
  MapPin,
  FileText,
  CheckCircle,
  Phone,
  User,
  Mail,
  GraduationCap,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
};

const defaultAdmissionsContent = {
  badgeText: "Admissions",
  title: "Your Journey Starts Here",
  highlightedText: "Starts Here",
  subtitle:
    "Baljagriti Secondary English Boarding School welcomes students through a clear admission process for Play Group, LKG, and classes up to Class IX.",
  steps: [
    {
      id: 1,
      icon: "message",
      step: "01",
      title: "Play Group Admission",
      desc: "Admission opens for Play Group in the month of Magh. Parents can contact the school administration for details.",
      color: "#D71920",
      visible: true,
    },
    {
      id: 2,
      icon: "map",
      step: "02",
      title: "LKG to Class IX",
      desc: "Admission for Lower Kindergarten to Class IX opens from the new academic year in Baishakh.",
      color: "#168A3A",
      visible: true,
    },
    {
      id: 3,
      icon: "file",
      step: "03",
      title: "Written Examination",
      desc: "Interested candidates are selected through a written examination followed by parents or guardians’ interview.",
      color: "#7C5CC4",
      visible: true,
    },
    {
      id: 4,
      icon: "check",
      step: "04",
      title: "Enrollment",
      desc: "Selected students complete enrollment by submitting required documents to the school administration.",
      color: "#168A3A",
      visible: true,
    },
  ],
  formTitle: "Admission Inquiry",
  formDescription:
    "Fill in the form and the school administration will contact you with admission details.",
  nameLabel: "Full Name",
  namePlaceholder: "Student or parent name",
  emailLabel: "Email Address",
  emailPlaceholder: "example@email.com",
  phoneLabel: "Phone Number",
  phonePlaceholder: "+977 98XXXXXXXX",
  gradeLabel: "Applying for Grade",
  gradePlaceholder: "Select grade",
  grades: [
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
  ],
  submitButtonText: "Submit Inquiry",
  submittingText: "Submitting...",
  successTitle: "Inquiry Submitted!",
  successMessage: "We will contact you soon with admission details.",
};

function mergeAdmissionsContent(saved = {}) {
  return {
    ...defaultAdmissionsContent,
    ...saved,
    steps: Array.isArray(saved.steps)
      ? saved.steps
      : defaultAdmissionsContent.steps,
    grades: Array.isArray(saved.grades)
      ? saved.grades
      : defaultAdmissionsContent.grades,
  };
}

function getStepIcon(icon) {
  if (icon === "map") return MapPin;
  if (icon === "file") return FileText;
  if (icon === "check") return CheckCircle;
  return MessageCircle;
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) {
    return <>{title}</>;
  }

  const [before, after] = title.split(highlightedText);

  return (
    <>
      {before}
      <span style={{ color: colors.red }}>{highlightedText}</span>
      {after}
    </>
  );
}

function Admissions() {
  const [content, setContent] = useState(defaultAdmissionsContent);
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm();

  useEffect(() => {
    const loadAdmissionsContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/admissions"
        );

        const savedContent = res.data?.data?.content || {};
        setContent(mergeAdmissionsContent(savedContent));
      } catch (error) {
        console.error("Admissions content load error:", error);
        setContent(defaultAdmissionsContent);
      }
    };

    loadAdmissionsContent();
  }, []);

  const onSubmit = async (data) => {
    setSubmitMessage("");

    try {
      await axios.post("http://localhost:5000/api/contact", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: `Admission Inquiry - ${data.grade}`,
        message: `Admission inquiry for ${data.grade}.`,
      });

      setSubmitMessage(content.successMessage);
      reset();
    } catch (error) {
      console.error("Admission inquiry submit error:", error);
      setSubmitMessage(
        "Inquiry could not be submitted. Please contact the school office directly."
      );
    }
  };

  const visibleSteps = content.steps.filter((step) => step.visible !== false);

  return (
    <section
      id="admissions"
      className="pt-32 pb-28 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.14), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.11), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="text-center mb-16"
        >
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(215,25,32,0.08)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.16)",
            }}
          >
            <GraduationCap className="w-4 h-4" />
            {content.badgeText}
          </span>

          <h1
            className="text-5xl md:text-7xl leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            <HighlightedTitle
              title={content.title}
              highlightedText={content.highlightedText}
            />
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {visibleSteps.map((step, index) => {
            const Icon = getStepIcon(step.icon);

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative group"
              >
                {index < visibleSteps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-12 left-full w-6 h-0.5 z-10"
                    style={{
                      background: `linear-gradient(90deg, ${
                        step.color || colors.green
                      }80, transparent)`,
                    }}
                  />
                )}

                <div
                  className="p-6 rounded-3xl h-full transition-all duration-300 group-hover:-translate-y-2"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
                    border: `1px solid ${step.color || colors.green}22`,
                    boxShadow:
                      "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `${step.color || colors.green}12`,
                        border: `1px solid ${step.color || colors.green}24`,
                        boxShadow: `0 12px 28px ${
                          step.color || colors.green
                        }18`,
                      }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: step.color || colors.green }}
                      />
                    </div>

                    <span
                      className="text-4xl font-black opacity-30"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: step.color || colors.green,
                      }}
                    >
                      {step.step}
                    </span>
                  </div>

                  <h3 className="font-black text-xl mb-3 text-slate-950">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-500">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 38 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="max-w-3xl mx-auto"
        >
          <div
            className="p-8 md:p-10 rounded-3xl"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
              border: "1px solid rgba(11,16,32,0.08)",
              backdropFilter: "blur(18px)",
              boxShadow:
                "0 24px 70px rgba(11,16,32,0.12), inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
          >
            <h3
              className="text-3xl mb-2 text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                letterSpacing: "-0.03em",
              }}
            >
              {content.formTitle}
            </h3>

            <p className="text-sm mb-8 text-slate-500 leading-relaxed">
              {content.formDescription}
            </p>

            {isSubmitSuccessful ? (
              <div
                className="py-8 text-center rounded-2xl"
                style={{
                  background: "rgba(22,138,58,0.1)",
                  border: "1px solid rgba(22,138,58,0.2)",
                  boxShadow: "0 16px 42px rgba(22,138,58,0.1)",
                }}
              >
                <div className="text-4xl mb-3">🎉</div>
                <div className="text-slate-950 font-black text-xl">
                  {content.successTitle}
                </div>
                <div className="text-sm mt-1 text-slate-500">
                  {submitMessage || content.successMessage}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold mb-2 text-slate-700">
                      <User className="w-4 h-4" />
                      {content.nameLabel}
                    </label>

                    <input
                      {...register("name", { required: true })}
                      placeholder={content.namePlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold mb-2 text-slate-700">
                      <Mail className="w-4 h-4" />
                      {content.emailLabel}
                    </label>

                    <input
                      {...register("email", { required: true })}
                      type="email"
                      placeholder={content.emailPlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold mb-2 text-slate-700">
                      <Phone className="w-4 h-4" />
                      {content.phoneLabel}
                    </label>

                    <input
                      {...register("phone")}
                      placeholder={content.phonePlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold mb-2 text-slate-700">
                      <GraduationCap className="w-4 h-4" />
                      {content.gradeLabel}
                    </label>

                    <select
                      {...register("grade", { required: true })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900"
                    >
                      <option value="">{content.gradePlaceholder}</option>

                      {(content.grades || []).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-white mt-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors.red}, ${colors.green})`,
                    boxShadow: "0 16px 38px rgba(215,25,32,0.22)",
                  }}
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting
                    ? content.submittingText
                    : content.submitButtonText}
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