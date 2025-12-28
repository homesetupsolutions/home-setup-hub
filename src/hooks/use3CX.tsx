import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CallLogEntry {
  id: string;
  user_id: string;
  customer_id?: string;
  customer_name?: string;
  phone_number: string;
  direction: 'inbound' | 'outbound';
  status: 'initiated' | 'ringing' | 'answered' | 'completed' | 'missed' | 'failed';
  duration_seconds?: number;
  notes?: string;
  created_at: string;
  ended_at?: string;
}

interface Use3CXReturn {
  isCallActive: boolean;
  currentCall: CallLogEntry | null;
  callLogs: CallLogEntry[];
  loadingLogs: boolean;
  initiateCall: (phoneNumber: string, customerId?: string, customerName?: string) => Promise<void>;
  endCall: (notes?: string) => Promise<void>;
  fetchCallLogs: () => Promise<void>;
  formatPhoneFor3CX: (phone: string) => string;
}

export function use3CX(): Use3CXReturn {
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentCall, setCurrentCall] = useState<CallLogEntry | null>(null);
  const [callLogs, setCallLogs] = useState<CallLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const { toast } = useToast();

  // Format phone number for 3CX click-to-call
  const formatPhoneFor3CX = useCallback((phone: string): string => {
    // Remove all non-numeric characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned;
  }, []);

  // Initiate a call and log it
  const initiateCall = useCallback(async (
    phoneNumber: string, 
    customerId?: string, 
    customerName?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create call log entry
      const { data, error } = await supabase
        .from('call_logs')
        .insert({
          user_id: user.id,
          phone_number: phoneNumber,
          customer_id: customerId,
          customer_name: customerName,
          direction: 'outbound',
          status: 'initiated'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentCall(data as CallLogEntry);
      setIsCallActive(true);

      // Open 3CX click-to-call URL
      const formattedPhone = formatPhoneFor3CX(phoneNumber);
      window.open(`tel:${formattedPhone}`, '_self');
      
      // Also try 3CX protocol (if 3CX app is installed)
      // This works with 3CX desktop/mobile app
      setTimeout(() => {
        window.open(`3cx:${formattedPhone}`, '_self');
      }, 100);

      toast({
        title: 'Call Initiated',
        description: `Calling ${customerName || phoneNumber}...`,
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to initiate call',
        variant: 'destructive',
      });
    }
  }, [formatPhoneFor3CX, toast]);

  // End call and update log
  const endCall = useCallback(async (notes?: string) => {
    if (!currentCall) return;

    try {
      const startTime = new Date(currentCall.created_at).getTime();
      const endTime = Date.now();
      const durationSeconds = Math.round((endTime - startTime) / 1000);

      const { error } = await supabase
        .from('call_logs')
        .update({
          status: 'completed',
          duration_seconds: durationSeconds,
          ended_at: new Date().toISOString(),
          notes
        })
        .eq('id', currentCall.id);

      if (error) throw error;

      setIsCallActive(false);
      setCurrentCall(null);
      
      toast({
        title: 'Call Ended',
        description: `Duration: ${Math.floor(durationSeconds / 60)}:${(durationSeconds % 60).toString().padStart(2, '0')}`,
      });

      // Refresh logs
      fetchCallLogs();

    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to end call',
        variant: 'destructive',
      });
    }
  }, [currentCall, toast]);

  // Fetch call logs
  const fetchCallLogs = useCallback(async () => {
    setLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setCallLogs((data || []) as CallLogEntry[]);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load call logs',
        variant: 'destructive',
      });
    } finally {
      setLoadingLogs(false);
    }
  }, [toast]);

  return {
    isCallActive,
    currentCall,
    callLogs,
    loadingLogs,
    initiateCall,
    endCall,
    fetchCallLogs,
    formatPhoneFor3CX
  };
}
