import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import PageTemplate from "@/src/components/PageTemplate";
import api from "@/src/api";

const topics = [
  { value: "general_enquiry", label: "General Enquiry" },
  { value: "bug_report", label: "Bug Report" },
  { value: "feature_request", label: "Feature Request" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "other", label: "Other" },
];

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "general_enquiry",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact/", form);
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", topic: "general_enquiry", subject: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center">
          Contact Us
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
          Have questions or feedback? We'd love to hear from you!
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Topic</label>
            <select
              name="topic"
              value={form.topic}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
            >
              {topics.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
            ></textarea>
          </div>

          <div className="text-center">
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-base"
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </div>
    </PageTemplate>
  );
};

export default Contact;
