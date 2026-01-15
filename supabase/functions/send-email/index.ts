import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  type?: 'booking_confirmation' | 'booking_reminder' | 'receipt' | 'custom';
  data?: {
    customerName?: string;
    serviceName?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    address?: string;
    price?: number;
    receiptUrl?: string;
  };
}

// HTML escape function to prevent XSS/injection attacks
function escapeHtml(unsafe: string | undefined | null): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Validate URL to prevent javascript: and other malicious protocols
function isValidHttpUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Safely format price
function formatPrice(price: number | undefined | null): string {
  if (typeof price !== 'number' || isNaN(price) || price < 0) return '0.00';
  return price.toFixed(2);
}

function getEmailTemplate(type: string, data: EmailRequest['data']): { subject: string; html: string } {
  // Escape all user-supplied data
  const safeCustomerName = escapeHtml(data?.customerName) || 'Valued Customer';
  const safeServiceName = escapeHtml(data?.serviceName) || 'N/A';
  const safeAppointmentDate = escapeHtml(data?.appointmentDate) || 'N/A';
  const safeAppointmentTime = escapeHtml(data?.appointmentTime) || 'N/A';
  const safeAddress = escapeHtml(data?.address);
  const safePrice = formatPrice(data?.price);
  const safeReceiptUrl = isValidHttpUrl(data?.receiptUrl) ? escapeHtml(data?.receiptUrl) : '';

  switch (type) {
    case 'booking_confirmation':
      return {
        subject: `Booking Confirmed - ${safeServiceName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed!</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                  Hi ${safeCustomerName},
                </p>
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                  Your appointment has been confirmed. Here are the details:
                </p>
                <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0;"><strong>Service:</strong> ${safeServiceName}</p>
                  <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${safeAppointmentDate}</p>
                  <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${safeAppointmentTime}</p>
                  ${safeAddress ? `<p style="margin: 0 0 10px 0;"><strong>Address:</strong> ${safeAddress}</p>` : ''}
                  ${data?.price ? `<p style="margin: 0;"><strong>Price:</strong> $${safePrice}</p>` : ''}
                </div>
                <p style="font-size: 14px; color: #666;">
                  If you need to reschedule or cancel, please call us at <a href="tel:8332302933" style="color: #f97316;">833-230-2933</a>.
                </p>
              </div>
              <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                <p style="margin: 0; color: #666; font-size: 14px;">Home Setup Solutions</p>
                <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">Professional Home Technology Installation</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
    
    case 'booking_reminder':
      return {
        subject: `Reminder: Your Appointment Tomorrow - ${safeServiceName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Appointment Reminder</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                  Hi ${safeCustomerName},
                </p>
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                  This is a friendly reminder about your upcoming appointment:
                </p>
                <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0;"><strong>Service:</strong> ${safeServiceName}</p>
                  <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${safeAppointmentDate}</p>
                  <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${safeAppointmentTime}</p>
                  ${safeAddress ? `<p style="margin: 0;"><strong>Address:</strong> ${safeAddress}</p>` : ''}
                </div>
                <p style="font-size: 14px; color: #666;">
                  Need to reschedule? Call us at <a href="tel:8332302933" style="color: #3b82f6;">833-230-2933</a>.
                </p>
              </div>
              <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                <p style="margin: 0; color: #666; font-size: 14px;">Home Setup Solutions</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

    case 'receipt':
      return {
        subject: `Your Receipt from Home Setup Solutions`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Payment Receipt</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                  Hi ${safeCustomerName},
                </p>
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                  Thank you for your payment. Here's your receipt:
                </p>
                <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0;"><strong>Service:</strong> ${safeServiceName}</p>
                  <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${safeAppointmentDate}</p>
                  ${data?.price ? `<p style="margin: 0;"><strong>Amount Paid:</strong> $${safePrice}</p>` : ''}
                </div>
                ${safeReceiptUrl ? `<p style="text-align: center;"><a href="${safeReceiptUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">View Full Receipt</a></p>` : ''}
              </div>
              <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                <p style="margin: 0; color: #666; font-size: 14px;">Home Setup Solutions</p>
                <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">Thank you for your business!</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

    default:
      return { subject: '', html: '' };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check - require admin or staff role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized: Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User authentication failed:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid authentication" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if user has admin or staff role
    const { data: isAdmin } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });
    
    const { data: isStaff } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'staff'
    });

    if (!isAdmin && !isStaff) {
      console.error("User lacks required role:", user.id);
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin or staff access required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailRequest: EmailRequest = await req.json();
    
    console.log("Received email request from user:", user.id, { 
      to: emailRequest.to, 
      type: emailRequest.type,
      subject: emailRequest.subject 
    });

    let subject = emailRequest.subject;
    let html = emailRequest.html;

    if (emailRequest.type && emailRequest.type !== 'custom') {
      const template = getEmailTemplate(emailRequest.type, emailRequest.data);
      subject = subject || template.subject;
      html = html || template.html;
    }

    // For custom emails, escape the HTML content if it contains user data
    if (emailRequest.type === 'custom' && emailRequest.html) {
      // Custom emails should already be sanitized by the caller
      // Log a warning if custom HTML is used
      console.warn("Custom HTML email being sent - ensure content is sanitized");
    }

    if (!subject || (!html && !emailRequest.text)) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: subject and html/text" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailRequest.from || "Home Setup Solutions <noreply@homesetupsolutions.ca>",
        to: Array.isArray(emailRequest.to) ? emailRequest.to : [emailRequest.to],
        subject: subject,
        html: html,
        text: emailRequest.text,
        reply_to: emailRequest.replyTo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      return new Response(
        JSON.stringify({ error: data.message || "Failed to send email" }),
        { status: response.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email sent successfully by user:", user.id, data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
