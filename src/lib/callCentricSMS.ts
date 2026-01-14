// Call Centric SMS Integration
// This module handles SMS messaging through Call Centric's API

export interface SMSMessage {
  to: string;
  from: string;
  body: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// The texting number for Call Centric
export const CALL_CENTRIC_SMS_NUMBER = '15876045127';

// Format phone number to E.164 format
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add country code if not present
  if (cleaned.length === 10) {
    return `1${cleaned}`;
  }
  
  return cleaned;
}

// Send SMS via Call Centric (will be implemented via edge function)
export async function sendSMS(to: string, message: string): Promise<SMSResponse> {
  const formattedPhone = formatPhoneNumber(to);
  
  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formattedPhone,
        from: CALL_CENTRIC_SMS_NUMBER,
        body: message,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send SMS');
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.messageId,
    };
  } catch (error: any) {
    console.error('SMS send error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send SMS',
    };
  }
}

// Send appointment reminder SMS
export async function sendAppointmentReminder(
  to: string,
  customerName: string,
  appointmentDate: Date,
  serviceName: string
): Promise<SMSResponse> {
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const message = `Hi ${customerName}! This is a reminder of your ${serviceName} appointment on ${formattedDate} at ${formattedTime}. Reply CONFIRM to confirm or call 1-833-230-2933 to reschedule. - Home Setup Solutions`;

  return sendSMS(to, message);
}

// Send booking confirmation SMS
export async function sendBookingConfirmation(
  to: string,
  customerName: string,
  appointmentDate: Date,
  serviceName: string
): Promise<SMSResponse> {
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const message = `Hi ${customerName}! Your ${serviceName} appointment is confirmed for ${formattedDate} at ${formattedTime}. We'll send a reminder before your appointment. Questions? Call 1-833-230-2933. - Home Setup Solutions`;

  return sendSMS(to, message);
}

// Send on-the-way notification
export async function sendOnTheWayNotification(
  to: string,
  customerName: string,
  technicianName: string,
  eta: number // minutes
): Promise<SMSResponse> {
  const message = `Hi ${customerName}! ${technicianName} from Home Setup Solutions is on the way. ETA: ${eta} minutes. Call 1-833-230-2933 if you have any questions.`;

  return sendSMS(to, message);
}
