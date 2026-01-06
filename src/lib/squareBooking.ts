import { supabase } from '@/integrations/supabase/client';

export interface SquareService {
  id: string;
  name: string;
  description: string;
  variations: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
    duration_minutes: number;
  }>;
}

export interface SquareAvailability {
  start_at: string;
  location_id: string;
  appointment_segments: Array<{
    duration_minutes: number;
    team_member_id: string;
    service_variation_id: string;
  }>;
}

export interface SquareBookingResult {
  id: string;
  status: string;
  start_at: string;
  customer_id?: string;
}

async function callSquareBooking<T>(action: string, params: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.functions.invoke('square-booking', {
    body: { action, ...params },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as T;
}

export async function getServices() {
  return callSquareBooking<{ services: SquareService[] }>('get_services');
}

export async function getAvailability(startDate: string, serviceVariationId: string, endDate?: string) {
  return callSquareBooking<{ availabilities: SquareAvailability[] }>('get_availability', {
    startDate,
    endDate,
    serviceVariationId,
  });
}

export interface CreateBookingParams {
  startAt: string;
  serviceVariationId: string;
  serviceVersion?: number;
  teamMemberId?: string;
  durationMinutes?: number;
  customerNote?: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export async function createBooking(params: CreateBookingParams) {
  return callSquareBooking<{ booking: SquareBookingResult }>('create_booking', params as unknown as Record<string, unknown>);
}
