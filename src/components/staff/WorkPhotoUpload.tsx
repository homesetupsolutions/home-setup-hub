import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera, Upload, Calendar, X, Check, Image } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  customer_name: string | null;
  service_name: string;
  scheduled_at: string;
  address: string | null;
}

interface UploadedPhoto {
  id: string;
  photo_url: string;
  description: string | null;
  created_at: string;
  appointment_id: string | null;
}

export function WorkPhotoUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<UploadedPhoto[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createCalendarEvent, setCreateCalendarEvent] = useState(true);

  // Fetch today's appointments on mount
  useState(() => {
    fetchAppointments();
    fetchRecentPhotos();
  });

  const fetchAppointments = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('appointments')
      .select('id, customer_name, service_name, scheduled_at, address')
      .gte('scheduled_at', today.toISOString())
      .lt('scheduled_at', tomorrow.toISOString())
      .order('scheduled_at', { ascending: true });

    if (!error && data) {
      setAppointments(data);
    }
  };

  const fetchRecentPhotos = async () => {
    const { data, error } = await supabase
      .from('work_photos')
      .select('id, photo_url, description, created_at, appointment_id')
      .eq('staff_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(6);

    if (!error && data) {
      setRecentPhotos(data);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 10MB.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('work-photos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('work-photos')
        .getPublicUrl(fileName);

      // Save to work_photos table
      const { error: insertError } = await supabase
        .from('work_photos')
        .insert({
          staff_id: user.id,
          photo_url: urlData.publicUrl,
          description: description || null,
          appointment_id: selectedAppointment || null,
        });

      if (insertError) throw insertError;

      // If calendar event should be created and appointment is selected
      if (createCalendarEvent && selectedAppointment) {
        await createCalendarEventForPhoto(selectedAppointment, urlData.publicUrl);
      }

      toast({
        title: 'Photo Uploaded',
        description: createCalendarEvent && selectedAppointment 
          ? 'Photo uploaded and calendar event created!' 
          : 'Work photo uploaded successfully.',
      });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setDescription('');
      setSelectedAppointment('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh photos
      fetchRecentPhotos();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload photo.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const createCalendarEventForPhoto = async (appointmentId: string, photoUrl: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    // Create an event in the appointments table as a follow-up/photo record
    try {
      await supabase.from('appointments').insert({
        customer_name: appointment.customer_name,
        service_name: `Photo Documentation - ${appointment.service_name}`,
        scheduled_at: new Date().toISOString(),
        status: 'completed',
        notes: `Work photo uploaded: ${photoUrl}\n${description || 'No description provided'}`,
        address: appointment.address,
        staff_id: user?.id,
        duration_minutes: 0,
      });
    } catch (error) {
      console.error('Failed to create calendar event:', error);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Upload Work Photo
          </CardTitle>
          <CardDescription>
            Document your completed work with photos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div className="space-y-2">
            <Label>Select Photo</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={clearSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Click to take a photo or select from gallery
                </p>
              </div>
            )}
          </div>

          {/* Appointment Selection */}
          <div className="space-y-2">
            <Label htmlFor="appointment">Link to Appointment (Optional)</Label>
            <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
              <SelectTrigger>
                <SelectValue placeholder="Select an appointment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No appointment</SelectItem>
                {appointments.map((apt) => (
                  <SelectItem key={apt.id} value={apt.id}>
                    {format(new Date(apt.scheduled_at), 'h:mm a')} - {apt.customer_name || apt.service_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the work completed..."
              rows={3}
            />
          </div>

          {/* Calendar Event Option */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="create-event"
              checked={createCalendarEvent}
              onChange={(e) => setCreateCalendarEvent(e.target.checked)}
              className="rounded border-muted-foreground"
            />
            <Label htmlFor="create-event" className="flex items-center gap-2 cursor-pointer">
              <Calendar className="h-4 w-4" />
              Create calendar event for this photo
            </Label>
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Photos */}
      {recentPhotos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              Recent Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recentPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.photo_url}
                    alt={photo.description || 'Work photo'}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end p-2">
                    <div className="text-white text-xs">
                      <p className="font-medium">{format(new Date(photo.created_at), 'MMM d, h:mm a')}</p>
                      {photo.description && <p className="truncate">{photo.description}</p>}
                    </div>
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
