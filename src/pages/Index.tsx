import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera, Shield, Gift, BarChart3, School, MapPin, Lock,
  ArrowRight, Trash2, Upload, CheckCircle, Star, Users, Globe, Heart,
} from "lucide-react";
import heroImage from "@/assets/hero-community.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Community cleanup" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-85" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6 backdrop-blur-sm border border-accent/20">
              <Star className="h-4 w-4" /> Smart. Sustainable. Rewarding.
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-black text-primary-foreground leading-tight mb-6">
              Turn Waste into Rewards—
              <span className="text-accent">Empowering Communities</span> for a Cleaner Tomorrow.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl leading-relaxed">
              A smart digital platform that encourages environmental responsibility by rewarding individuals and communities for proper waste collection and disposal.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="lime" size="xl" asChild>
                <Link to="/dashboard"><Upload className="h-5 w-5 mr-1" /> Upload Waste & Earn</Link>
              </Button>
              <Button variant="outline-light" size="xl" asChild>
                <Link to="/contact">Register as Organization</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is Waste to Reward */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2 variants={fadeUp} custom={0} className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              🌿 What is <span className="text-gradient">Waste to Reward</span>?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg leading-relaxed">
              Waste to Reward is a web-based platform that combines civic responsibility with smart technology. Users upload images of collected waste along with location details. Submissions are reviewed and verified by administrators, and reward points are issued for valid contributions. It transforms waste disposal into an engaging, gamified, and rewarding experience.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl font-bold text-center mb-16"
          >
            ⚙️ How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Trash2, title: "Collect Waste", desc: "Clean your surroundings responsibly.", step: "01" },
              { icon: Upload, title: "Upload Evidence", desc: "Submit images and location details.", step: "02" },
              { icon: Shield, title: "Admin Verification", desc: "Our review system validates submissions.", step: "03" },
              { icon: Gift, title: "Earn Rewards", desc: "Redeem for tangible benefits and recognition.", step: "04" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="relative bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 group text-center"
              >
                <span className="absolute top-4 right-4 text-5xl font-heading font-black text-muted/60">{item.step}</span>
                <div className="w-16 h-16 rounded-2xl gradient-lime flex items-center justify-center mx-auto mb-5 group-hover:shadow-glow transition-shadow">
                  <item.icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl font-bold text-center mb-16"
          >
            ⭐ Key Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Camera, title: "Smart Waste Reporting", desc: "Upload images with location data for verified reporting." },
              { icon: Shield, title: "Admin Verification", desc: "Robust review system ensures data accuracy." },
              { icon: Gift, title: "Reward Points & Redemption", desc: "Earn and redeem points for tangible benefits." },
              { icon: BarChart3, title: "Activity Dashboard", desc: "Track your contributions and impact in real time." },
              { icon: School, title: "Institutional Integration", desc: "Built for schools, NGOs, and municipalities." },
              { icon: MapPin, title: "Location-Based Submissions", desc: "Geo-tagged submissions for regional tracking." },
              { icon: Lock, title: "Secure & Scalable", desc: "Enterprise-grade backend for reliability." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="flex items-start gap-4 p-6 rounded-2xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-24 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="font-heading text-3xl md:text-4xl font-bold mb-4">
              🌍 Community Impact
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
              Waste to Reward promotes active citizen participation and sustainable behavioral change.
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "Active Participation", value: "10K+" },
              { icon: Globe, label: "Communities Served", value: "50+" },
              { icon: Trash2, label: "Tons Collected", value: "500+" },
              { icon: Heart, label: "Rewards Given", value: "25K+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="text-center p-8 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10"
              >
                <stat.icon className="h-8 w-8 text-accent mx-auto mb-3" />
                <div className="text-4xl font-heading font-black mb-1">{stat.value}</div>
                <div className="text-primary-foreground/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-16">💬 What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { quote: "Waste to Reward transformed our campus cleanliness campaign. Students are more engaged than ever.", author: "School Administrator" },
              { quote: "I never thought cleaning my neighborhood could be this rewarding. The points system keeps me motivated!", author: "Community Volunteer" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="bg-background p-8 rounded-2xl shadow-card"
              >
                <p className="text-foreground text-lg italic mb-4 leading-relaxed">"{t.quote}"</p>
                <p className="text-accent font-heading font-semibold">— {t.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="gradient-hero rounded-3xl p-12 md:p-20 text-center text-primary-foreground"
          >
            <motion.h2 variants={fadeUp} custom={0} className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of individuals and organizations already making their communities cleaner.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-wrap justify-center gap-4">
              <Button variant="lime" size="xl" asChild>
                <Link to="/dashboard">Get Started <ArrowRight className="ml-1 h-5 w-5" /></Link>
              </Button>
              <Button variant="outline-light" size="xl" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
