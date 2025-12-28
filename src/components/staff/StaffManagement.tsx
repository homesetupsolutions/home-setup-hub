import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Shield, Users, Loader2, Trash2 } from "lucide-react";

interface StaffMember {
  id: string;
  user_id: string;
  role: 'admin' | 'staff' | 'customer';
  email: string;
  full_name: string | null;
  created_at: string;
}

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<'admin' | 'staff'>('staff');
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchStaffMembers = async () => {
    setLoading(true);
    try {
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('id, user_id, role, created_at')
        .in('role', ['admin', 'staff']);

      if (rolesError) throw rolesError;

      if (!roles || roles.length === 0) {
        setStaffMembers([]);
        setLoading(false);
        return;
      }

      const userIds = roles.map(r => r.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      const combined: StaffMember[] = roles.map(role => {
        const profile = profiles?.find(p => p.user_id === role.user_id);
        return {
          id: role.id,
          user_id: role.user_id,
          role: role.role as 'admin' | 'staff' | 'customer',
          email: profile?.email || 'Unknown',
          full_name: profile?.full_name || null,
          created_at: role.created_at,
        };
      });

      setStaffMembers(combined);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        title: "Error",
        description: "Failed to load staff members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const updateRole = async (userId: string, newRole: 'admin' | 'staff') => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role updated successfully",
      });
      fetchStaffMembers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const promoteToStaff = async () => {
    if (!newStaffEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);
    try {
      // Find user by email in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', newStaffEmail.trim())
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        toast({
          title: "User not found",
          description: "No user found with that email address. They must register first.",
          variant: "destructive",
        });
        setUpdating(false);
        return;
      }

      // Update their role
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ role: newStaffRole })
        .eq('user_id', profile.user_id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `User promoted to ${newStaffRole}`,
      });
      setDialogOpen(false);
      setNewStaffEmail("");
      fetchStaffMembers();
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({
        title: "Error",
        description: "Failed to promote user",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const demoteToCustomer = async (userId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'customer' })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User demoted to customer",
      });
      fetchStaffMembers();
    } catch (error) {
      console.error('Error demoting user:', error);
      toast({
        title: "Error",
        description: "Failed to demote user",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Management
            </CardTitle>
            <CardDescription>
              Manage staff members and their roles
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Promote User to Staff</DialogTitle>
                <DialogDescription>
                  Enter the email of a registered user to give them staff access.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">User Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newStaffRole} onValueChange={(v) => setNewStaffRole(v as 'admin' | 'staff')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={promoteToStaff} disabled={updating}>
                  {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Promote User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {staffMembers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No staff members found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.full_name || 'Not set'}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                      <Shield className="h-3 w-3 mr-1" />
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Select
                        value={member.role}
                        onValueChange={(v) => updateRole(member.user_id, v as 'admin' | 'staff')}
                        disabled={updating}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => demoteToCustomer(member.user_id)}
                        disabled={updating}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffManagement;
