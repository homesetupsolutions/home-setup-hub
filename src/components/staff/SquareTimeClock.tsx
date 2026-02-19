import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Play, Square, Coffee, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Timecard {
  id: string;
  clock_in: string;
  clock_out: string | null;
  break_minutes: number | null;
  notes: string | null;
  square_timecard_id: string | null;
}

export function SquareTimeClock() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTimecard, setActiveTimecard] = useState<Timecard | null>(null);
  const [recentTimecards, setRecentTimecards] = useState<Timecard[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    if (user) fetchTimecards();
  }, [user]);

  // Update elapsed time every second
  useEffect(() => {
    if (!activeTimecard) {
      setElapsed("");
      return;
    }
    const updateElapsed = () => {
      const start = new Date(activeTimecard.clock_in).getTime();
      const now = Date.now();
      const diff = now - start;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsed(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [activeTimecard]);

  const fetchTimecards = async () => {
    if (!user) return;
    setLoading(true);

    // Get active timecard (clocked in but not out)
    const { data: active } = await supabase
      .from("timecards")
      .select("*")
      .eq("staff_id", user.id)
      .is("clock_out", null)
      .order("clock_in", { ascending: false })
      .limit(1)
      .maybeSingle();

    setActiveTimecard(active);

    // Get recent completed timecards
    const { data: recent } = await supabase
      .from("timecards")
      .select("*")
      .eq("staff_id", user.id)
      .not("clock_out", "is", null)
      .order("clock_in", { ascending: false })
      .limit(10);

    setRecentTimecards(recent || []);
    setLoading(false);
  };

  const clockIn = async () => {
    if (!user) return;
    setActionLoading(true);

    try {
      // Create local timecard
      const { data, error } = await supabase
        .from("timecards")
        .insert({
          staff_id: user.id,
          clock_in: new Date().toISOString(),
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Sync with Square via edge function
      try {
        await supabase.functions.invoke("square-booking", {
          body: {
            action: "clock_in",
            timecard_id: data.id,
            staff_id: user.id,
          },
        });
      } catch (squareErr) {
        console.warn("Square sync failed (non-critical):", squareErr);
      }

      setActiveTimecard(data);
      setNotes("");
      toast({ title: "Clocked In", description: `Started at ${format(new Date(), "h:mm a")}` });
    } catch (error) {
      console.error("Clock in error:", error);
      toast({ title: "Error", description: "Failed to clock in. Please try again.", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const clockOut = async () => {
    if (!user || !activeTimecard) return;
    setActionLoading(true);

    try {
      const { error } = await supabase
        .from("timecards")
        .update({
          clock_out: new Date().toISOString(),
          notes: notes || activeTimecard.notes,
        })
        .eq("id", activeTimecard.id);

      if (error) throw error;

      // Sync with Square
      try {
        await supabase.functions.invoke("square-booking", {
          body: {
            action: "clock_out",
            timecard_id: activeTimecard.id,
            staff_id: user.id,
          },
        });
      } catch (squareErr) {
        console.warn("Square sync failed (non-critical):", squareErr);
      }

      toast({ title: "Clocked Out", description: `Ended at ${format(new Date(), "h:mm a")}` });
      setActiveTimecard(null);
      setNotes("");
      fetchTimecards();
    } catch (error) {
      console.error("Clock out error:", error);
      toast({ title: "Error", description: "Failed to clock out. Please try again.", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDuration = (clockIn: string, clockOut: string) => {
    const diff = new Date(clockOut).getTime() - new Date(clockIn).getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clock In/Out Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Time Clock
            {activeTimecard && (
              <Badge variant="default" className="ml-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-1.5" />
                Clocked In
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Clock in/out syncs with Square Team Management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeTimecard && (
            <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Time Elapsed</p>
              <p className="text-4xl font-mono font-bold text-primary">{elapsed}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Started: {format(new Date(activeTimecard.clock_in), "h:mm a, MMM d")}
              </p>
            </div>
          )}

          <Textarea
            placeholder={activeTimecard ? "Add notes before clocking out..." : "Add notes for your shift..."}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />

          <div className="flex gap-3">
            {!activeTimecard ? (
              <Button onClick={clockIn} disabled={actionLoading} className="flex-1 gap-2" size="lg">
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Clock In
              </Button>
            ) : (
              <Button onClick={clockOut} disabled={actionLoading} variant="destructive" className="flex-1 gap-2" size="lg">
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Square className="h-4 w-4" />}
                Clock Out
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Timecards */}
      {recentTimecards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Timecards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTimecards.map((tc) => (
                <div
                  key={tc.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {format(new Date(tc.clock_in), "EEE, MMM d")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(tc.clock_in), "h:mm a")} — {tc.clock_out ? format(new Date(tc.clock_out), "h:mm a") : "—"}
                    </p>
                    {tc.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{tc.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {tc.clock_out ? formatDuration(tc.clock_in, tc.clock_out) : "—"}
                    </p>
                    {tc.break_minutes ? (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Coffee className="w-3 h-3" /> {tc.break_minutes}m break
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
