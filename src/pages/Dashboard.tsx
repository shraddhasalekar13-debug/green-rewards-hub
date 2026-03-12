import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Upload, FileText, Gift, Bell, User, LogOut,
  ChevronLeft, ChevronRight, MapPin, Camera, TrendingUp, CheckCircle, Clock, XCircle, Award, Star, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Upload, label: "Upload Waste", id: "upload" },
  { icon: FileText, label: "My Submissions", id: "submissions" },
  { icon: Gift, label: "Reward Points", id: "rewards" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: User, label: "Profile", id: "profile" },
];

const barData = [
  { month: "Jan", submissions: 12 }, { month: "Feb", submissions: 19 },
  { month: "Mar", submissions: 8 }, { month: "Apr", submissions: 25 },
  { month: "May", submissions: 16 }, { month: "Jun", submissions: 30 },
];

const pieData = [
  { name: "Verified", value: 68 },
  { name: "Pending", value: 32 },
];
const PIE_COLORS = ["hsl(150, 68%, 55%)", "hsl(215, 90%, 44%)"];

const submissions = [
  { date: "2026-02-25", location: "Park Road, Sector 5", status: "Approved", points: 50 },
  { date: "2026-02-22", location: "Main Market, Block A", status: "Pending", points: 0 },
  { date: "2026-02-18", location: "School Ground, Lane 3", status: "Approved", points: 40 },
  { date: "2026-02-15", location: "River Bank, Zone B", status: "Rejected", points: 0 },
  { date: "2026-02-10", location: "Community Park", status: "Approved", points: 60 },
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("overview");
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's submissions
  const { data: userSubmissions = [], refetch: refetchSubmissions } = useQuery({
    queryKey: ['my-submissions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('waste_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles) return;
    const fileArr = Array.from(newFiles);
    setFiles((prev) => [...prev, ...fileArr]);
    const urls = fileArr.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const handleRemovePreview = (index: number) => {
    setPreviews((p) => p.filter((_, i) => i !== index));
    setFiles((f) => f.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (files.length === 0) {
      toast({ title: "Please upload at least one image", variant: "destructive" });
      return;
    }
    if (!location.trim()) {
      toast({ title: "Please enter a location", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Upload images to storage
      const imageUrls: string[] = [];
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('waste-images')
          .upload(path, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from('waste-images')
          .getPublicUrl(path);
        imageUrls.push(urlData.publicUrl);
      }

      // Insert submission
      const { error } = await supabase.from('waste_submissions').insert({
        user_id: user.id,
        image_urls: imageUrls,
        location: location.trim(),
        description: description.trim() || null,
      });
      if (error) throw error;

      toast({ title: "Submission sent successfully!" });
      setPreviews([]);
      setFiles([]);
      setLocation("");
      setDescription("");
      refetchSubmissions();
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Computed stats from real data
  const totalSubmissions = userSubmissions.length;
  const verified = userSubmissions.filter((s: any) => s.status === 'approved').length;
  const pendingCount = userSubmissions.filter((s: any) => s.status === 'pending').length;
  const totalPoints = userSubmissions.reduce((sum: number, s: any) => sum + (s.points_awarded || 0), 0);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-64"} bg-primary text-primary-foreground flex flex-col transition-all duration-300 shrink-0`}>
        <div className="p-4 flex items-center justify-between border-b border-primary-foreground/10">
          {!collapsed && (
            <Link to="/" className="font-heading font-bold text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" /> W2R
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-primary-foreground/10 rounded-lg transition-colors">
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active === item.id ? "bg-accent text-accent-foreground" : "text-primary-foreground/70 hover:bg-primary-foreground/10"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-foreground/10">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-primary-foreground/70 hover:bg-primary-foreground/10 transition-colors">
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <h1 className="font-heading font-bold text-lg capitalize">{active}</h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="h-4 w-4 text-accent" />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, label: "Total Submissions", value: String(totalSubmissions), color: "bg-secondary/10 text-secondary" },
              { icon: CheckCircle, label: "Verified", value: String(verified), color: "bg-accent/10 text-accent" },
              { icon: Gift, label: "Reward Points", value: totalPoints.toLocaleString(), color: "bg-accent/10 text-accent" },
              { icon: Clock, label: "Pending Reviews", value: String(pendingCount), color: "bg-secondary/10 text-secondary" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl p-6 shadow-card"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl font-heading font-bold">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Upload section */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <h3 className="font-heading font-bold text-lg mb-6">📸 Upload Waste Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="waste-upload" className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-accent transition-colors cursor-pointer flex flex-col items-center justify-center">
                  <Camera className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-sm">Click to upload from your device</p>
                   <input id="waste-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                </label>
                {previews.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {previews.map((src, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-border">
                        <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleRemovePreview(i)}
                          className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-bl-lg p-0.5 text-xs leading-none"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                     <input
                      className="w-full pl-10 px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none"
                      placeholder="Enter location or use auto-detect"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:outline-none resize-none"
                    placeholder="Describe the waste collected..."
                  />
                </div>
                <Button variant="lime" size="lg" className="w-full">
                  <Upload className="h-4 w-4 mr-1" /> Submit
                </Button>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h4 className="font-heading font-semibold mb-4">📊 Monthly Submissions</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                  <YAxis axisLine={false} tickLine={false} className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="submissions" fill="hsl(150, 68%, 55%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h4 className="font-heading font-semibold mb-4">🔄 Verification Status</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Submissions table */}
          <div className="bg-card rounded-2xl p-6 shadow-card overflow-x-auto">
            <h4 className="font-heading font-semibold mb-4">📋 Recent Submissions</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 font-medium text-muted-foreground">Location</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Points</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-none">
                    <td className="py-3">{s.date}</td>
                    <td className="py-3">{s.location}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        s.status === "Approved" ? "bg-accent/10 text-accent" :
                        s.status === "Pending" ? "bg-secondary/10 text-secondary" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {s.status === "Approved" && <CheckCircle className="h-3 w-3" />}
                        {s.status === "Pending" && <Clock className="h-3 w-3" />}
                        {s.status === "Rejected" && <XCircle className="h-3 w-3" />}
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 font-semibold">{s.points > 0 ? `+${s.points}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Badges */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h4 className="font-heading font-semibold mb-4">🏅 Your Badges</h4>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Award, label: "Eco Champion", earned: true },
                { icon: Trophy, label: "Community Leader", earned: true },
                { icon: Star, label: "Top Contributor", earned: false },
                { icon: TrendingUp, label: "Rising Star", earned: true },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    badge.earned ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <badge.icon className="h-4 w-4" />
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
