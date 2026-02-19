import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Loader2, WifiOff, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function GPSTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch existing tracking status on mount
  useEffect(() => {
    if (!user) return;
    const fetchStatus = async () => {
      const { data } = await supabase
        .from("staff_details")
        .select("current_location, location_updated_at")
        .eq("user_id", user.id)
        .single();

      if (data?.current_location) {
        const loc = data.current_location as { lat: number; lng: number };
        setCurrentPosition(loc);
        if (data.location_updated_at) {
          setLastUpdated(new Date(data.location_updated_at));
        }
      }
    };
    fetchStatus();
  }, [user]);

  const updateLocation = useCallback(
    async (position: GeolocationPosition) => {
      if (!user) return;
      const loc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setCurrentPosition(loc);
      setLastUpdated(new Date());
      setError(null);

      const { error: dbError } = await supabase
        .from("staff_details")
        .update({
          current_location: loc as any,
          location_updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (dbError) {
        console.error("Error updating location:", dbError);
      }
    },
    [user]
  );

  const handleError = useCallback((err: GeolocationPositionError) => {
    let message = "Unable to get your location.";
    if (err.code === 1) message = "Location permission denied. Please enable it in your browser settings.";
    if (err.code === 2) message = "Location unavailable. Check your device settings.";
    if (err.code === 3) message = "Location request timed out.";
    setError(message);
    toast({ title: "GPS Error", description: message, variant: "destructive" });
  }, [toast]);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsTracking(true);
    setError(null);

    // Get initial position
    navigator.geolocation.getCurrentPosition(updateLocation, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
    });

    // Watch for changes
    const watchId = navigator.geolocation.watchPosition(updateLocation, handleError, {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 15000,
    });
    watchIdRef.current = watchId;

    // Also update every 60 seconds as a fallback
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(updateLocation, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    }, 60000);
    intervalRef.current = interval;

    toast({ title: "GPS Tracking Started", description: "Your location is now being shared with dispatch." });
  }, [updateLocation, handleError, toast]);

  const stopTracking = useCallback(async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);

    // Clear location from DB
    if (user) {
      await supabase
        .from("staff_details")
        .update({
          current_location: null,
          location_updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    }

    toast({ title: "GPS Tracking Stopped", description: "Your location is no longer being shared." });
  }, [user, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          GPS Location Tracking
        </CardTitle>
        <CardDescription>
          Share your live location with customers and dispatch while on the job
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isTracking ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
            <span className="font-medium">
              {isTracking ? "Tracking Active" : "Tracking Off"}
            </span>
            <Badge variant={isTracking ? "default" : "secondary"}>
              {isTracking ? <><Wifi className="w-3 h-3 mr-1" /> Live</> : <><WifiOff className="w-3 h-3 mr-1" /> Offline</>}
            </Badge>
          </div>
          <Button
            variant={isTracking ? "destructive" : "default"}
            onClick={isTracking ? stopTracking : startTracking}
            className="gap-2"
          >
            {isTracking ? (
              <>Stop Tracking</>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Start Tracking
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {currentPosition && (
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs">
                {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
              </span>
            </div>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Your location is only visible to customers with active appointments assigned to you.
          Tracking stops automatically when you toggle it off or close the app.
        </p>
      </CardContent>
    </Card>
  );
}
