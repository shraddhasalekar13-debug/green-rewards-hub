import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { User, Award, Trophy, Star, Camera, MapPin, TrendingUp, Calendar, CheckCircle, Medal } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const leaderboard = [
  { rank: 1, name: "Priya S.", points: 4200, badge: "Eco Champion" },
  { rank: 2, name: "Rahul K.", points: 3850, badge: "Community Leader" },
  { rank: 3, name: "Ananya M.", points: 3600, badge: "Top Contributor" },
  { rank: 4, name: "You", points: 2450, badge: "Rising Star" },
  { rank: 5, name: "Amit D.", points: 2100, badge: "Active Member" },
];

const achievements = [
  { icon: Star, title: "First Submission", date: "Jan 2026", earned: true },
  { icon: Trophy, title: "50 Submissions", date: "Feb 2026", earned: true },
  { icon: Award, title: "100 Verified", date: "In Progress", earned: false },
  { icon: Medal, title: "City Champion", date: "Locked", earned: false },
];

const gallery = [
  "Park cleanup — Sector 5",
  "Street sweeping — Block A",
  "River bank — Zone B",
  "School ground — Lane 3",
  "Community park",
  "Market road",
];

const Profile = () => {
  return (
    <Layout>
      <section className="gradient-hero text-primary-foreground py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-28 h-28 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center"
            >
              <User className="h-14 w-14 text-accent" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="font-heading text-3xl md:text-4xl font-black">Eco Volunteer</h1>
              <p className="text-primary-foreground/70 text-lg">Community Contributor · Rising Star</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">2,450 Points</span>
                <span className="px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm">Rank #4</span>
                <span className="px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm">127 Submissions</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-heading text-2xl font-bold mb-8">🌟 Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((a, i) => (
              <motion.div
                key={a.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className={`rounded-2xl p-6 text-center shadow-card ${a.earned ? "bg-background" : "bg-muted/50 opacity-60"}`}
              >
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${a.earned ? "bg-accent/10" : "bg-muted"}`}>
                  <a.icon className={`h-6 w-6 ${a.earned ? "text-accent" : "text-muted-foreground"}`} />
                </div>
                <h4 className="font-heading font-semibold text-sm">{a.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{a.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-heading text-2xl font-bold mb-8">📸 Submission Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((desc, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="aspect-square rounded-2xl bg-muted flex items-center justify-center shadow-card hover:shadow-elevated transition-all"
              >
                <div className="text-center px-4">
                  <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-heading text-2xl font-bold mb-8">🏅 Leaderboard</h2>
          <div className="bg-background rounded-2xl shadow-card overflow-hidden">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-4 px-6 py-4 border-b border-border/50 last:border-none ${
                  entry.name === "You" ? "bg-accent/5" : ""
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm ${
                  entry.rank <= 3 ? "gradient-lime text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {entry.rank}
                </div>
                <div className="flex-1">
                  <span className={`font-heading font-semibold ${entry.name === "You" ? "text-accent" : ""}`}>{entry.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{entry.badge}</span>
                </div>
                <span className="font-heading font-bold">{entry.points.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
