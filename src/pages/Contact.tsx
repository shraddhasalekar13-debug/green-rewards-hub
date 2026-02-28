import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, Send } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", category: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Your message has been received.");
    setForm({ name: "", email: "", subject: "", category: "", message: "" });
  };

  return (
    <Layout>
      <section className="gradient-hero text-primary-foreground py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl md:text-5xl font-black mb-4">
            📬 Get in Touch
          </motion.h1>
          <p className="text-primary-foreground/70 text-lg">We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-card space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input
                      type="text" required value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none transition"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none transition"
                    >
                      <option value="">Select a category</option>
                      <option>Individual User</option>
                      <option>School/College</option>
                      <option>NGO</option>
                      <option>Municipal Authority</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    rows={5} required value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none transition resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                <Button variant="lime" size="lg" type="submit">
                  <Send className="h-4 w-4 mr-1" /> Send Message
                </Button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-6">
              {[
                { icon: Mail, title: "Email", detail: "support@wastetoreward.org" },
                { icon: Phone, title: "Phone", detail: "+91-XXXX-XXXXXX" },
                { icon: Clock, title: "Response Time", detail: "Within 24–48 hours" },
              ].map((item) => (
                <div key={item.title} className="bg-card rounded-2xl p-6 shadow-card flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.detail}</p>
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <div className="aspect-video rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  📍 Map Integration Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
