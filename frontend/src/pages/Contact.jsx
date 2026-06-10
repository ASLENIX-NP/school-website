import { useState } from "react";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/contact", formData);

      setStatus("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>Send us a message and we will get back to you soon.</p>

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}

export default Contact;