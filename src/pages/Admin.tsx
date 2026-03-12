import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Gift, LogOut, ChevronLeft, ChevronRight,
  Star, CheckCircle, Clock, XCircle, TrendingUp, Shield, Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: FileText, label: 'Submissions', id: 'submissions' },
  { icon: Users, label: 'Users', id: 'users' },
  { icon: Gift, label: 'Rewards', id: 'rewards' },
];

const PIE_COLORS = ['hsl(150, 68%, 55%)', 'hsl(45, 90%, 55%)', 'hsl(0, 84%, 60%)'];

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('overview');
  const { signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch submissions
  const { data: submissions = [] } = useQuery({
    queryKey: ['admin-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waste_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      // Fetch profile names for each unique user_id
      const userIds = [...new Set(data.map((s: any) => s.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);
      const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.user_id, p.display_name]));
      return data.map((s: any) => ({ ...s, display_name: profileMap[s.user_id] || 'Unknown' }));
    },
  });

  // Fetch users
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, user_roles(role)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch rewards
  const { data: rewards = [] } = useQuery({
    queryKey: ['admin-rewards'],
    queryFn: async () => {
      const { data, error } = await supabase.from('rewards').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Review submission mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ id, status, points }: { id: string; status: string; points: number }) => {
      const { error } = await supabase
        .from('waste_submissions')
        .update({ status, points_awarded: points })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      toast({ title: 'Submission updated' });
    },
  });

  // Add reward mutation
  const [newReward, setNewReward] = useState({ name: '', description: '', points_cost: '' });
  const addRewardMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('rewards').insert({
        name: newReward.name,
        description: newReward.description,
        points_cost: parseInt(newReward.points_cost),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      setNewReward({ name: '', description: '', points_cost: '' });
      toast({ title: 'Reward added' });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: userId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      toast({ title: 'User permanently deleted' });
    },
    onError: (err: any) => {
      toast({ title: 'Failed to delete user', description: err.message, variant: 'destructive' });
    },
  });

  // Stats
  const totalSubmissions = submissions.length;
  const approved = submissions.filter((s: any) => s.status === 'approved').length;
  const pending = submissions.filter((s: any) => s.status === 'pending').length;
  const rejected = submissions.filter((s: any) => s.status === 'rejected').length;

  const pieData = [
    { name: 'Approved', value: approved },
    { name: 'Pending', value: pending },
    { name: 'Rejected', value: rejected },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-primary text-primary-foreground flex flex-col transition-all duration-300 shrink-0`}>
        <div className="p-4 flex items-center justify-between border-b border-primary-foreground/10">
          {!collapsed && (
            <Link to="/" className="font-heading font-bold text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" /> Admin
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
                active === item.id ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/70 hover:bg-primary-foreground/10'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-foreground/10">
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-primary-foreground/70 hover:bg-primary-foreground/10 transition-colors">
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <h1 className="font-heading font-bold text-lg capitalize flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" /> Admin — {active}
          </h1>
        </header>

        <div className="p-6 space-y-8">
          {/* Overview */}
          {active === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: FileText, label: 'Total Submissions', value: totalSubmissions, color: 'bg-secondary/10 text-secondary' },
                  { icon: CheckCircle, label: 'Approved', value: approved, color: 'bg-accent/10 text-accent' },
                  { icon: Clock, label: 'Pending', value: pending, color: 'bg-secondary/10 text-secondary' },
                  { icon: Users, label: 'Total Users', value: users.length, color: 'bg-accent/10 text-accent' },
                ].map((stat) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl p-6 shadow-card">
                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="text-3xl font-heading font-bold">{stat.value}</div>
                    <div className="text-muted-foreground text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h4 className="font-heading font-semibold mb-4">Submission Status Distribution</h4>
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
            </>
          )}

          {/* Submissions */}
          {active === 'submissions' && (
            <div className="bg-card rounded-2xl p-6 shadow-card overflow-x-auto">
              <h4 className="font-heading font-semibold mb-4">All Submissions</h4>
              {submissions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No submissions yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Image</th>
                      <th className="pb-3 font-medium text-muted-foreground">User</th>
                      <th className="pb-3 font-medium text-muted-foreground">Location</th>
                      <th className="pb-3 font-medium text-muted-foreground">Description</th>
                      <th className="pb-3 font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 font-medium text-muted-foreground">Points</th>
                      <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s: any) => (
                      <tr key={s.id} className="border-b border-border/50 last:border-none">
                        <td className="py-3">
                          {s.image_urls && s.image_urls.length > 0 ? (
                            <img src={s.image_urls[0]} alt="Waste" className="w-12 h-12 rounded-lg object-cover" />
                          ) : '—'}
                        </td>
                        <td className="py-3">{s.display_name}</td>
                        <td className="py-3">{s.location}</td>
                        <td className="py-3">{new Date(s.created_at).toLocaleDateString()}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            s.status === 'approved' ? 'bg-accent/10 text-accent' :
                            s.status === 'pending' ? 'bg-secondary/10 text-secondary' :
                            'bg-destructive/10 text-destructive'
                          }`}>
                            {s.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                            {s.status === 'pending' && <Clock className="h-3 w-3" />}
                            {s.status === 'rejected' && <XCircle className="h-3 w-3" />}
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 font-semibold">{s.points_awarded > 0 ? `+${s.points_awarded}` : '—'}</td>
                        <td className="py-3 space-x-2">
                          {s.status === 'pending' && (
                            <>
                              <Button size="sm" variant="lime" onClick={() => reviewMutation.mutate({ id: s.id, status: 'approved', points: 50 })}>
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => reviewMutation.mutate({ id: s.id, status: 'rejected', points: 0 })}>
                                Reject
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Users */}
          {active === 'users' && (
            <div className="bg-card rounded-2xl p-6 shadow-card overflow-x-auto">
              <h4 className="font-heading font-semibold mb-4">All Users</h4>
              {users.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No users yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                     <tr className="border-b border-border text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Name</th>
                      <th className="pb-3 font-medium text-muted-foreground">Organization</th>
                      <th className="pb-3 font-medium text-muted-foreground">Role</th>
                      <th className="pb-3 font-medium text-muted-foreground">Joined</th>
                      <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => {
                      const isAdmin = u.user_roles?.some((r: any) => r.role === 'admin');
                      return (
                        <tr key={u.id} className="border-b border-border/50 last:border-none">
                          <td className="py-3">{u.display_name || '—'}</td>
                          <td className="py-3">{u.organization || '—'}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              isAdmin ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                            }`}>
                              {isAdmin ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="py-3">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="py-3">
                            {!isAdmin && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive" className="gap-1">
                                    <Trash2 className="h-3.5 w-3.5" /> Remove
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Permanently delete user?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently remove <strong>{u.display_name || 'this user'}</strong> and all their data. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteUserMutation.mutate(u.user_id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete permanently
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Rewards */}
          {active === 'rewards' && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h4 className="font-heading font-semibold mb-4">Add New Reward</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Reward name" value={newReward.name} onChange={(e) => setNewReward({ ...newReward, name: e.target.value })} />
                  <Input placeholder="Description" value={newReward.description} onChange={(e) => setNewReward({ ...newReward, description: e.target.value })} />
                  <Input placeholder="Points cost" type="number" value={newReward.points_cost} onChange={(e) => setNewReward({ ...newReward, points_cost: e.target.value })} />
                </div>
                <Button variant="lime" className="mt-4" onClick={() => addRewardMutation.mutate()} disabled={!newReward.name || !newReward.points_cost}>
                  Add Reward
                </Button>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h4 className="font-heading font-semibold mb-4">Existing Rewards</h4>
                {rewards.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No rewards created yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rewards.map((r: any) => (
                      <div key={r.id} className="border border-border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="h-5 w-5 text-accent" />
                          <h5 className="font-heading font-semibold">{r.name}</h5>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{r.description || 'No description'}</p>
                        <span className="text-sm font-bold text-accent">{r.points_cost} points</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
