import { supabase } from "@/integrations/supabase/client";

export interface EmailData {
  customerName?: string;
  serviceName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  address?: string;
  price?: number;
  receiptUrl?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject?: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  type?: 'booking_confirmation' | 'booking_reminder' | 'receipt' | 'custom';
  data?: EmailData;
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: options
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Error invoking send-email function:', err);
    return { success: false, error: err.message };
  }
}

export async function sendBookingConfirmation(
  email: string,
  customerName: string,
  serviceName: string,
  appointmentDate: string,
  appointmentTime: string,
  address?: string,
  price?: number
): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to: email,
    type: 'booking_confirmation',
    data: {
      customerName,
      serviceName,
      appointmentDate,
      appointmentTime,
      address,
      price
    }
  });
}

export async function sendBookingReminder(
  email: string,
  customerName: string,
  serviceName: string,
  appointmentDate: string,
  appointmentTime: string,
  address?: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to: email,
    type: 'booking_reminder',
    data: {
      customerName,
      serviceName,
      appointmentDate,
      appointmentTime,
      address
    }
  });
}

export async function sendReceipt(
  email: string,
  customerName: string,
  serviceName: string,
  appointmentDate: string,
  price: number,
  receiptUrl?: string
): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to: email,
    type: 'receipt',
    data: {
      customerName,
      serviceName,
      appointmentDate,
      price,
      receiptUrl
    }
  });
}
