import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Bell, Phone, Mail, Save, Eye, EyeOff } from 'lucide-react';

interface NotificationPreferences {
  sms_enabled: boolean;
  sms_reminders: boolean;
  sms_promotions: boolean;
  email_enabled: boolean;
  email_reminders: boolean;
  email_promotions: boolean;
  preferred_phone: string | null;
}

export function AccountSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Notification preferences
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    sms_enabled: true,
    sms_reminders: true,
    sms_promotions: false,
    email_enabled: true,
    email_reminders: true,
    email_promotions: false,
    preferred_phone: null,
  });

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
      } else if (data) {
        setPreferences({
          sms_enabled: data.sms_enabled ?? true,
          sms_reminders: data.sms_reminders ?? true,
          sms_promotions: data.sms_promotions ?? false,
          email_enabled: data.email_enabled ?? true,
          email_reminders: data.email_reminders ?? true,
          email_promotions: data.email_promotions ?? false,
          preferred_phone: data.preferred_phone,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure your new passwords match.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password.',
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user?.id,
          ...preferences,
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: 'Preferences Saved',
        description: 'Your notification preferences have been updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save preferences.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your account password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <Button 
            onClick={handlePasswordChange} 
            disabled={changingPassword || !newPassword || !confirmPassword}
          >
            {changingPassword ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Manage how we contact you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preferred Phone */}
          <div className="space-y-2">
            <Label htmlFor="preferred-phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Preferred Phone Number for Texts
            </Label>
            <Input
              id="preferred-phone"
              type="tel"
              value={preferences.preferred_phone || ''}
              onChange={(e) => setPreferences({ ...preferences, preferred_phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
          </div>

          <Separator />

          {/* SMS Settings */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              SMS / Text Messages
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-enabled">Enable SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive text messages from us</p>
                </div>
                <Switch
                  id="sms-enabled"
                  checked={preferences.sms_enabled}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, sms_enabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between pl-4">
                <div>
                  <Label htmlFor="sms-reminders">Appointment Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminded before your appointments</p>
                </div>
                <Switch
                  id="sms-reminders"
                  checked={preferences.sms_reminders}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, sms_reminders: checked })}
                  disabled={!preferences.sms_enabled}
                />
              </div>
              <div className="flex items-center justify-between pl-4">
                <div>
                  <Label htmlFor="sms-promotions">Promotions & Offers</Label>
                  <p className="text-sm text-muted-foreground">Receive special deals and promotions</p>
                </div>
                <Switch
                  id="sms-promotions"
                  checked={preferences.sms_promotions}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, sms_promotions: checked })}
                  disabled={!preferences.sms_enabled}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Email Settings */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Notifications
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-enabled">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive emails from us</p>
                </div>
                <Switch
                  id="email-enabled"
                  checked={preferences.email_enabled}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, email_enabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between pl-4">
                <div>
                  <Label htmlFor="email-reminders">Appointment Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminded before your appointments</p>
                </div>
                <Switch
                  id="email-reminders"
                  checked={preferences.email_reminders}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, email_reminders: checked })}
                  disabled={!preferences.email_enabled}
                />
              </div>
              <div className="flex items-center justify-between pl-4">
                <div>
                  <Label htmlFor="email-promotions">Promotions & Offers</Label>
                  <p className="text-sm text-muted-foreground">Receive special deals and promotions</p>
                </div>
                <Switch
                  id="email-promotions"
                  checked={preferences.email_promotions}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, email_promotions: checked })}
                  disabled={!preferences.email_enabled}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSavePreferences} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
