import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Clock, User, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface InstallerLocation {
  staffName: string;
  lat: number;
  lng: number;
  updatedAt: string;
  serviceName: string;
  scheduledAt: string;
}

export function InstallerTracker() {
  const { user } = useAuth();
  const [locations, setLocations] = useState<InstallerLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchInstallerLocations();

    // Refresh every 30 seconds
    const interval = setInterval(fetchInstallerLocations, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchInstallerLocations = async () => {
    if (!user) return;

    try {
      // Get today's appointments for this customer
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

      const { data: appointments } = await supabase
        .from("appointments")
        .select("id, staff_id, service_name, scheduled_at, status")
        .eq("customer_id", user.id)
        .gte("scheduled_at", startOfDay)
        .lt("scheduled_at", endOfDay)
        .in("status", ["scheduled", "in_progress"]);

      if (!appointments || appointments.length === 0) {
        setLocations([]);
        setLoading(false);
        return;
      }

      // Get staff locations for assigned staff
      const staffIds = appointments.map((a) => a.staff_id).filter(Boolean) as string[];
      if (staffIds.length === 0) {
        setLocations([]);
        setLoading(false);
        return;
      }

      const { data: staffDetails } = await supabase
        .from("staff_details")
        .select("user_id, current_location, location_updated_at")
        .in("user_id", staffIds)
        .not("current_location", "is", null);

      const { data: staffProfiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", staffIds);

      const profileMap = new Map(staffProfiles?.map((p) => [p.user_id, p.full_name]) || []);

      const results: InstallerLocation[] = [];
      for (const staff of staffDetails || []) {
        const loc = staff.current_location as { lat: number; lng: number } | null;
        if (!loc) continue;

        const appointment = appointments.find((a) => a.staff_id === staff.user_id);
        if (!appointment) continue;

        results.push({
          staffName: profileMap.get(staff.user_id) || "Your Installer",
          lat: loc.lat,
          lng: loc.lng,
          updatedAt: staff.location_updated_at || "",
          serviceName: appointment.service_name,
          scheduledAt: appointment.scheduled_at,
        });
      }

      setLocations(results);
    } catch (error) {
      console.error("Error fetching installer locations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (locations.length === 0) return null;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Installer Location
        </CardTitle>
        <CardDescription>
          Track your assigned installer for today's appointment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {locations.map((loc, index) => (
          <div key={index} className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span className="font-semibold">{loc.staffName}</span>
              </div>
              <Badge variant="default" className="gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Service: {loc.serviceName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Scheduled: {format(new Date(loc.scheduledAt), "h:mm a")}</span>
              </div>
            </div>

            {/* Map link */}
            <a
              href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center text-sm font-medium text-primary"
            >
              <MapPin className="w-4 h-4 inline mr-1" />
              View on Google Maps
            </a>

            {loc.updatedAt && (
              <p className="text-xs text-muted-foreground text-center">
                Location updated: {format(new Date(loc.updatedAt), "h:mm:ss a")}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
