// Microsoft 365 Booking Integration
// This module handles calendar and booking integration with M365

export interface M365Event {
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName: string;
  };
  body?: {
    contentType: 'HTML' | 'Text';
    content: string;
  };
  attendees?: Array<{
    emailAddress: {
      address: string;
      name: string;
    };
    type: 'Required' | 'Optional';
  }>;
}

export interface M365BookingResponse {
  success: boolean;
  eventId?: string;
  webLink?: string;
  error?: string;
}

// Available staff for M365 calendar
export const M365_STAFF = [
  { email: 'evan@homesetupsolutions.ca', name: 'Evan' }
];

// Create a calendar event in M365
export async function createCalendarEvent(event: M365Event): Promise<M365BookingResponse> {
  try {
    // This will be handled by an edge function that uses Microsoft Graph API
    const response = await fetch('/api/m365/create-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }

    const data = await response.json();
    return {
      success: true,
      eventId: data.id,
      webLink: data.webLink,
    };
  } catch (error: any) {
    console.error('M365 create event error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create event',
    };
  }
}

// Create appointment event from booking data
export async function createAppointmentEvent(
  customerName: string,
  customerEmail: string,
  serviceName: string,
  startTime: Date,
  durationMinutes: number,
  address: string,
  notes?: string
): Promise<M365BookingResponse> {
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
  
  const event: M365Event = {
    subject: `${serviceName} - ${customerName}`,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'America/Edmonton',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'America/Edmonton',
    },
    location: {
      displayName: address,
    },
    body: {
      contentType: 'HTML',
      content: `
        <h3>Service: ${serviceName}</h3>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Address:</strong> ${address}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
      `,
    },
    attendees: [
      {
        emailAddress: {
          address: customerEmail,
          name: customerName,
        },
        type: 'Required',
      },
    ],
  };

  return createCalendarEvent(event);
}

// Create photo documentation event
export async function createPhotoDocumentationEvent(
  photoUrl: string,
  description: string,
  staffEmail: string,
  appointmentData?: {
    customerName: string;
    serviceName: string;
    address: string;
  }
): Promise<M365BookingResponse> {
  const now = new Date();
  const endTime = new Date(now.getTime() + 15 * 60000); // 15 minute event
  
  const subject = appointmentData 
    ? `Photo: ${appointmentData.serviceName} - ${appointmentData.customerName}`
    : 'Work Photo Documentation';

  const event: M365Event = {
    subject,
    start: {
      dateTime: now.toISOString(),
      timeZone: 'America/Edmonton',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'America/Edmonton',
    },
    location: appointmentData ? { displayName: appointmentData.address } : undefined,
    body: {
      contentType: 'HTML',
      content: `
        <h3>Work Photo Documentation</h3>
        <p><strong>Description:</strong> ${description || 'No description'}</p>
        <p><strong>Photo:</strong> <a href="${photoUrl}">${photoUrl}</a></p>
        ${appointmentData ? `
          <p><strong>Customer:</strong> ${appointmentData.customerName}</p>
          <p><strong>Service:</strong> ${appointmentData.serviceName}</p>
        ` : ''}
        <p><img src="${photoUrl}" style="max-width: 500px;" /></p>
      `,
    },
  };

  return createCalendarEvent(event);
}

// Fetch available time slots from M365
export async function getAvailableSlots(
  staffEmail: string,
  date: Date
): Promise<{ start: Date; end: Date }[]> {
  try {
    const response = await fetch('/api/m365/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: staffEmail,
        date: date.toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch availability');
    }

    const data = await response.json();
    return data.slots.map((slot: any) => ({
      start: new Date(slot.start),
      end: new Date(slot.end),
    }));
  } catch (error) {
    console.error('M365 availability error:', error);
    return [];
  }
}
