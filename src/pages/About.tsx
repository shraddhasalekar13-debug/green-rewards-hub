import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Target, Lightbulb, Users, Globe, AlertTriangle, CheckCircle, School, Building, Heart } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl md:text-5xl font-black mb-4">
            About <span className="text-accent">Waste to Reward</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Technology meets civic engagement for a cleaner world.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-heading text-3xl font-bold mb-6 text-center">🌱 Our Story</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg leading-relaxed text-center">
              Waste to Reward was created to solve a persistent problem: environmental awareness alone is not enough. Traditional waste reporting systems are manual, inefficient, and lack motivation mechanisms. We envisioned a solution where technology meets civic engagement—turning everyday cleanup into a rewarding experience.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-2xl p-8 shadow-card">
              <h3 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" /> The Problem
              </h3>
              <ul className="space-y-4">
                {[
                  "Lack of structured waste reporting systems",
                  "Minimal incentives for environmental responsibility",
                  "Limited participation in cleanliness initiatives",
                  "Administrative inefficiencies in tracking contributions",
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeUp} custom={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-destructive mt-2 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-2xl p-8 shadow-card">
              <h3 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-accent" /> Our Solution
              </h3>
              <ul className="space-y-4">
                {[
                  "Digital waste reporting with image & location",
                  "Verification workflow via admin dashboard",
                  "Automated reward points system",
                  "Institutional scalability for any organization",
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeUp} custom={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Globe className="h-12 w-12 text-accent mx-auto mb-6" />
          <h2 className="font-heading text-3xl font-bold mb-4">🌍 Our Vision</h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            To build cleaner, smarter, and more responsible communities by transforming environmental action into a recognized and rewarded civic behavior.
          </p>
        </div>
      </section>

      {/* Inclusivity */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">🤝 Who We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Users, label: "Individuals" },
              { icon: School, label: "Schools & Colleges" },
              { icon: Heart, label: "NGOs" },
              { icon: Building, label: "Municipalities" },
              { icon: Target, label: "Community Groups" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <item.icon className="h-7 w-7 text-accent" />
                </div>
                <span className="font-heading font-semibold text-sm text-center">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
