import { useState } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { User, Mail, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const displayName = profile?.display_name || user?.user_metadata?.display_name || "User";
  const email = user?.email || "";

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setChangingPassword(true);

    // Verify current password by re-signing in
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
    if (signInError) {
      toast({ title: "Current password is incorrect", variant: "destructive" });
      setChangingPassword(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Failed to update password", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPassword(false);
  };

  const handleForgotPassword = async () => {
    setSendingReset(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Failed to send reset email", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Reset email sent!", description: "Check your inbox for a password reset link." });
    }
    setSendingReset(false);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-6 max-w-3xl mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center">
              <User className="h-12 w-12 text-accent" />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-black">{displayName}</h1>
              <p className="text-primary-foreground/70 text-lg flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" /> {email}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl space-y-8">

          {/* User Info Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" /> Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Display Name</Label>
                  <p className="font-medium text-lg">{displayName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Email Address</Label>
                  <p className="font-medium text-lg">{email}</p>
                </div>
                {profile?.organization && (
                  <div>
                    <Label className="text-muted-foreground text-sm">Organization</Label>
                    <p className="font-medium text-lg">{profile.organization}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Change Password Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading text-xl flex items-center gap-2">
                  <Lock className="h-5 w-5 text-accent" /> Change Password
                </CardTitle>
                <CardDescription>Update your password by providing your current one.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="current-pw">Current Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="current-pw"
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowCurrent(!showCurrent)}>
                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-pw">New Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="new-pw"
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="••••••••"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowNew(!showNew)}>
                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirm-pw">Confirm New Password</Label>
                    <Input
                      id="confirm-pw"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" variant="lime" disabled={changingPassword} className="w-full">
                    {changingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Forgot Password Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading text-xl flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-accent" /> Forgot Password?
                </CardTitle>
                <CardDescription>
                  We'll send a password reset link to <span className="font-medium text-foreground">{email}</span>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={handleForgotPassword} disabled={sendingReset} className="w-full">
                  {sendingReset ? "Sending..." : "Send Password Reset Email"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
