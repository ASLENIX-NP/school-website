import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useForm } from "react-hook-form";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
  lightPurple: "#F1ECFF",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultContactContent = {
  badgeText: "Get In Touch",
  title: "We'd Love to Hear From You",
  highlightedText: "Hear From You",
  subtitle:
    "Questions about admissions, curriculum, or school life? Our team is here to help.",
  contactInfo: [
    {
      id: "address",
      icon: "map",
      label: "Address",
      value: "Basudev Marga, Hetauda Sub-Metropolitan City, Ward No. 2",
      color: "#D71920",
    },
    {
      id: "phone",
      icon: "phone",
      label: "Phone",
      value: "057-590144, 057-590145, 057-590146",
      color: "#168A3A",
    },
    {
      id: "email",
      icon: "mail",
      label: "Email",
      value: "infobjess2046@gmail.com",
      color: "#4B2E83",
    },
    {
      id: "school",
      icon: "clock",
      label: "School",
      value: "Baljagriti Secondary English Boarding School",
      color: "#7C5CC4",
    },
  ],
  mapCard: {
    title: "Baljagriti Campus",
    address: "Basudev Marga, Hetauda, Makawanpur",
    buttonText: "Open in Maps",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Basudev+Marga+Hetauda+Makwanpur+Nepal",
  },
  form: {
    title: "Send a Message",
    nameLabel: "Your Name",
    namePlaceholder: "Your full name",
    emailLabel: "Email Address",
    emailPlaceholder: "your@email.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "98XXXXXXXX or +97798XXXXXXXX",
    subjectLabel: "Subject",
    subjectPlaceholder: "Admissions inquiry",
    messageLabel: "Message",
    messagePlaceholder: "Tell us how we can help you...",
    buttonText: "Send Message",
    sendingText: "Sending...",
    successMessage: "Message sent successfully!",
    errorMessage: "Message could not be sent. Please try again.",
  },
};

function mergeContactContent(saved = {}) {
  return {
    ...defaultContactContent,
    ...saved,
    contactInfo:
      Array.isArray(saved.contactInfo) && saved.contactInfo.length
        ? saved.contactInfo
        : defaultContactContent.contactInfo,
    mapCard: {
      ...defaultContactContent.mapCard,
      ...(saved.mapCard || {}),
    },
    form: {
      ...defaultContactContent.form,
      ...(saved.form || {}),
    },
  };
}

function getContactIcon(icon) {
  if (icon === "phone") return Phone;
  if (icon === "mail") return Mail;
  if (icon === "clock") return Clock;
  return MapPin;
}

function normalizePhone(phone = "") {
  return String(phone).replace(/[^\d+]/g, "").trim();
}

function isValidPhone(phone = "") {
  const cleaned = normalizePhone(phone);
  const digitsOnly = cleaned.replace(/\D/g, "");

  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) {
    return <>{title}</>;
  }

  const [before, after] = title.split(highlightedText);

  return (
    <>
      {before}
      <span className="italic" style={{ color: colors.purple }}>
        {highlightedText}
      </span>
      {after}
    </>
  );
}

function ErrorText({ children }) {
  if (!children) return null;

  return (
    <p className="text-xs font-semibold mt-2" style={{ color: colors.red }}>
      {children}
    </p>
  );
}

function Contact() {
  const [content, setContent] = useState(defaultContactContent);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm();

  useEffect(() => {
    const loadContactContent = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/site-content/contact"
        );

        const savedContent = res.data?.data?.content || {};
        setContent(mergeContactContent(savedContent));
      } catch (error) {
        console.error("Contact content load error:", error);
        setContent(defaultContactContent);
      }
    };

    loadContactContent();
  }, []);

  const onSubmit = async (data) => {
    setSubmitMessage("");
    setSubmitError("");

    const payload = {
      ...data,
      phone: normalizePhone(data.phone),
      source: "contact",
    };

    try {
      await axios.post("http://localhost:5000/api/contact", payload);

      setSubmitMessage(content.form.successMessage);
      reset();
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitError(
        error.response?.data?.message || content.form.errorMessage
      );
    }
  };

  return (
    <section
      id="contact"
      className="pt-36 pb-28 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(75,46,131,0.14), transparent 34%),
          radial-gradient(circle at bottom right, rgba(22,138,58,0.14), transparent 34%),
          radial-gradient(circle at bottom left, rgba(215,25,32,0.08), transparent 30%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div
        className="absolute -bottom-32 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.13), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute top-0 left-0 w-[440px] h-[440px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "rgba(215,25,32,0.09)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.22)",
              boxShadow: "0 10px 28px rgba(215,25,32,0.08)",
            }}
          >
            {content.badgeText}
          </span>

          <h2
            className="text-4xl md:text-5xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: colors.dark,
            }}
          >
            <HighlightedTitle
              title={content.title}
              highlightedText={content.highlightedText}
            />
          </h2>

          <p className="max-w-xl mx-auto text-lg" style={{ color: "#64748b" }}>
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 space-y-5"
          >
            {content.contactInfo.map((info) => {
              const Icon = getContactIcon(info.icon);

              return (
                <div
                  key={info.id || info.label}
                  className="flex gap-4 p-5 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.74))",
                    border: `1px solid ${info.color}22`,
                    boxShadow:
                      "0 18px 46px rgba(11,16,32,0.09), 0 0 0 1px rgba(255,255,255,0.55)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${info.color}14`,
                      border: `1px solid ${info.color}24`,
                      boxShadow: `0 10px 24px ${info.color}18`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: info.color }} />
                  </div>

                  <div>
                    <div
                      className="text-xs font-semibold mb-0.5 uppercase tracking-wide"
                      style={{ color: "#94a3b8" }}
                    >
                      {info.label}
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: colors.dark }}
                    >
                      {info.value}
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              className="rounded-3xl overflow-hidden h-48 relative flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.07)), linear-gradient(135deg, #020617, #1E1B4B)",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow:
                  "0 24px 64px rgba(11,16,32,0.28), 0 0 44px rgba(56,189,248,0.12)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />

              <div
                className="absolute -top-20 -right-20 w-52 h-52 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(56,189,248,0.32), transparent 70%)",
                }}
              />

              <div
                className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(250,204,21,0.24), transparent 70%)",
                }}
              />

              <div className="text-center relative z-10 px-6">
                <div
                  className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    boxShadow: "0 16px 38px rgba(0,0,0,0.22)",
                  }}
                >
                  <MapPin className="w-7 h-7" style={{ color: colors.gold }} />
                </div>

                <div className="text-white font-bold text-base">
                  {content.mapCard.title}
                </div>

                <div
                  className="text-xs mt-1 mb-4"
                  style={{ color: "rgba(255,255,255,0.64)" }}
                >
                  {content.mapCard.address}
                </div>

                <a
                  href={content.mapCard.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105"
                  style={{
                    color: "#020617",
                    background:
                      "linear-gradient(135deg, #FACC15 0%, #38BDF8 100%)",
                    boxShadow:
                      "0 16px 38px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
                  }}
                >
                  {content.mapCard.buttonText}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div
              className="p-8 md:p-10 rounded-3xl h-full"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.74))",
                border: "1px solid rgba(75,46,131,0.14)",
                boxShadow:
                  "0 24px 70px rgba(11,16,32,0.12), 0 0 0 1px rgba(255,255,255,0.55)",
                backdropFilter: "blur(16px)",
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <h3
                  className="text-xl font-semibold mb-6"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: colors.dark,
                  }}
                >
                  {content.form.title}
                </h3>

                {submitMessage && (
                  <div
                    className="p-4 rounded-xl text-sm font-medium"
                    style={{
                      background: "rgba(22,138,58,0.1)",
                      color: colors.green,
                      border: "1px solid rgba(22,138,58,0.24)",
                    }}
                  >
                    {submitMessage}
                  </div>
                )}

                {submitError && (
                  <div
                    className="p-4 rounded-xl text-sm font-medium"
                    style={{
                      background: "rgba(215,25,32,0.1)",
                      color: colors.red,
                      border: "1px solid rgba(215,25,32,0.24)",
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#475569" }}
                    >
                      {content.form.nameLabel}
                    </label>
                    <input
                      {...register("name", {
                        required: "Name is required.",
                      })}
                      placeholder={content.form.namePlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.82)",
                        border: "1px solid rgba(75,46,131,0.16)",
                        color: colors.dark,
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                      }}
                    />
                    <ErrorText>{errors.name?.message}</ErrorText>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#475569" }}
                    >
                      {content.form.emailLabel}
                    </label>
                    <input
                      {...register("email", {
                        required: "Email is required.",
                      })}
                      type="email"
                      placeholder={content.form.emailPlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.82)",
                        border: "1px solid rgba(75,46,131,0.16)",
                        color: colors.dark,
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                      }}
                    />
                    <ErrorText>{errors.email?.message}</ErrorText>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#475569" }}
                    >
                      {content.form.phoneLabel}
                    </label>
                    <input
                      {...register("phone", {
                        required: "Phone number is required.",
                        validate: (value) =>
                          isValidPhone(value) ||
                          "Please enter a valid phone number.",
                      })}
                      type="tel"
                      placeholder={content.form.phonePlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.82)",
                        border: "1px solid rgba(75,46,131,0.16)",
                        color: colors.dark,
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                      }}
                    />
                    <ErrorText>{errors.phone?.message}</ErrorText>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#475569" }}
                    >
                      {content.form.subjectLabel}
                    </label>
                    <input
                      {...register("subject", {
                        required: "Subject is required.",
                      })}
                      placeholder={content.form.subjectPlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.82)",
                        border: "1px solid rgba(75,46,131,0.16)",
                        color: colors.dark,
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                      }}
                    />
                    <ErrorText>{errors.subject?.message}</ErrorText>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#475569" }}
                  >
                    {content.form.messageLabel}
                  </label>
                  <textarea
                    {...register("message", {
                      required: "Message is required.",
                    })}
                    rows={5}
                    placeholder={content.form.messagePlaceholder}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                    style={{
                      background: "rgba(255,255,255,0.82)",
                      border: "1px solid rgba(75,46,131,0.16)",
                      color: colors.dark,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                    }}
                  />
                  <ErrorText>{errors.message?.message}</ErrorText>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.01] disabled:opacity-60"
                  style={{
                    color: "#020617",
                    background:
                      "linear-gradient(135deg, #FACC15 0%, #38BDF8 100%)",
                    boxShadow:
                      "0 22px 52px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
                  }}
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting
                    ? content.form.sendingText
                    : content.form.buttonText}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { Contact };
export default Contact;