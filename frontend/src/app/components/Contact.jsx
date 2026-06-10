import { useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useForm } from "react-hook-form";

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    value: "42 Apex Boulevard, Education Quarter, Springfield, IL 62701",
    color: "#f97316"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 842-0011",
    color: "#6b21a8"
  },
  {
    icon: Mail,
    label: "Email",
    value: "admissions@apexacademy.edu",
    color: "#f97316"
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon–Fri: 8 AM – 5 PM · Sat: 9 AM – 1 PM",
    color: "#6b21a8"
  }
];

function Contact() {
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitMessage("");
    setSubmitError("");

    try {
      await axios.post("http://localhost:5000/api/contact", data);

      setSubmitMessage("Message sent successfully!");
      reset();
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitError("Message could not be sent. Please try again.");
    }
  };

  return (
    <section
      id="contact"
      className="py-28 relative overflow-hidden"
      style={{ background: "#fdf8f3" }}
    >
      <div
        className="absolute -bottom-32 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.06), transparent 70%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: "rgba(249,115,22,0.1)",
              color: "#ea580c",
              border: "1px solid rgba(249,115,22,0.2)"
            }}
          >
            Get In Touch
          </span>

          <h2
            className="text-4xl md:text-5xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "#0f1c3f"
            }}
          >
            We'd Love to{" "}
            <span className="italic" style={{ color: "#6b21a8" }}>
              Hear From You
            </span>
          </h2>

          <p className="max-w-xl mx-auto text-lg" style={{ color: "#64748b" }}>
            Questions about admissions, curriculum, or campus life? Our team is
            here to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-5"
          >
            {contactInfo.map((info) => {
              const Icon = info.icon;

              return (
                <div
                  key={info.label}
                  className="flex gap-4 p-5 rounded-2xl"
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(15,28,63,0.08)",
                    boxShadow: "0 4px 16px rgba(15,28,63,0.06)"
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${info.color}15` }}
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
                      style={{ color: "#0f1c3f" }}
                    >
                      {info.value}
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              className="rounded-2xl overflow-hidden h-48 relative flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0f1c3f, #1a0a3c)",
                border: "1px solid rgba(107,33,168,0.2)"
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <div className="text-white font-semibold text-sm">
                  Apex Academy Campus
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  42 Apex Blvd, Springfield, IL
                </div>
                <a
                  href="#"
                  className="mt-3 inline-block px-4 py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ background: "rgba(249,115,22,0.8)" }}
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div
              className="p-8 md:p-10 rounded-3xl h-full"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(15,28,63,0.08)",
                boxShadow: "0 8px 40px rgba(15,28,63,0.08)"
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <h3
                  className="text-xl font-semibold mb-6"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#0f1c3f"
                  }}
                >
                  Send a Message
                </h3>

                {submitMessage && (
                  <div
                    className="p-4 rounded-xl text-sm font-medium"
                    style={{
                      background: "rgba(5,150,105,0.1)",
                      color: "#047857",
                      border: "1px solid rgba(5,150,105,0.2)"
                    }}
                  >
                    {submitMessage}
                  </div>
                )}

                {submitError && (
                  <div
                    className="p-4 rounded-xl text-sm font-medium"
                    style={{
                      background: "rgba(220,38,38,0.1)",
                      color: "#dc2626",
                      border: "1px solid rgba(220,38,38,0.2)"
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
                      Your Name
                    </label>
                    <input
                      {...register("name", { required: true })}
                      placeholder="Maria Johnson"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "#f8f8fc",
                        border: "1px solid rgba(15,28,63,0.12)",
                        color: "#0f1c3f"
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#475569" }}
                    >
                      Email Address
                    </label>
                    <input
                      {...register("email", { required: true })}
                      type="email"
                      placeholder="maria@example.com"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "#f8f8fc",
                        border: "1px solid rgba(15,28,63,0.12)",
                        color: "#0f1c3f"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#475569" }}
                  >
                    Subject
                  </label>
                  <input
                    {...register("subject", { required: true })}
                    placeholder="Admissions inquiry for Grade 9"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "#f8f8fc",
                      border: "1px solid rgba(15,28,63,0.12)",
                      color: "#0f1c3f"
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#475569" }}
                  >
                    Message
                  </label>
                  <textarea
                    {...register("message", { required: true })}
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                    style={{
                      background: "#f8f8fc",
                      border: "1px solid rgba(15,28,63,0.12)",
                      color: "#0f1c3f"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #0f1c3f, #1a0a3c)",
                    boxShadow: "0 8px 24px rgba(15,28,63,0.25)"
                  }}
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
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