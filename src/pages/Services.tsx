import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  User, Gift, Camera, BarChart3, Award, Trophy, School,
  Heart, Building, Target, ArrowRight, MapPin, Shield, FileText, TrendingUp,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const services = [
  {
    title: "For Individuals",
    icon: User,
    features: [
      "Reward-based waste reporting",
      "Personal impact tracking",
      "Recognition & certification",
      "Gamified environmental engagement",
    ],
  },
  {
    title: "For Schools & Colleges",
    icon: School,
    features: [
      "Campus cleanup campaigns",
      "Inter-class competitions",
      "Environmental awareness drives",
      "Performance analytics dashboards",
    ],
  },
  {
    title: "For NGOs",
    icon: Heart,
    features: [
      "Volunteer activity tracking",
      "Digital reporting system",
      "Impact documentation",
      "Fundraising support metrics",
    ],
  },
  {
    title: "For Municipal Corporations",
    icon: Building,
    features: [
      "Verified waste reporting",
      "Public engagement tool",
      "Location-based data insights",
      "Performance analytics",
    ],
  },
];

const Services = () => {
  return (
    <Layout>
      <section className="gradient-hero text-primary-foreground py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl md:text-5xl font-black mb-4">
            Our <span className="text-accent">Services</span>
          </motion.h1>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">Programs tailored for every stakeholder in the ecosystem.</p>
        </div>
      </section>

      {/* Service cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl gradient-lime flex items-center justify-center mb-5">
                  <service.icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-4">{service.title}</h3>
                <ul className="space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-12">🌐 Built With Modern Tech</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Frontend", tech: "HTML · CSS · JS" },
              { label: "Backend", tech: "Django (Python)" },
              { label: "Database", tech: "MySQL" },
              { label: "Features", tech: "Auth · Admin · API" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="bg-background rounded-2xl p-6 shadow-card"
              >
                <div className="text-accent font-heading font-bold text-sm mb-1">{item.label}</div>
                <div className="text-muted-foreground text-sm">{item.tech}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="gradient-hero rounded-3xl p-12 md:p-16 text-primary-foreground max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-4">Partner With Us</h2>
            <p className="text-primary-foreground/70 mb-8">Whether you're an individual, school, NGO, or municipality—we have a program for you.</p>
            <Button variant="lime" size="xl" asChild>
              <Link to="/contact">Get Started <ArrowRight className="ml-1 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
