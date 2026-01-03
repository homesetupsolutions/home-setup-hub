import { supabase } from '@/integrations/supabase/client';

export interface SquareCustomer {
  id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SquareBooking {
  id: string;
  status: string;
  start_at: string;
  customer_id?: string;
  location_id?: string;
  appointment_segments?: Array<{
    duration_minutes: number;
    team_member_id?: string;
    service_variation_id?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface SquarePayment {
  id: string;
  status: string;
  amount_money?: {
    amount: number;
    currency: string;
  };
  source_type?: string;
  customer_id?: string;
  created_at?: string;
  updated_at?: string;
  receipt_url?: string;
}

async function callSquareCRM<T>(action: string, params: Record<string, unknown> = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase.functions.invoke('square-crm', {
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

export async function listCustomers(limit = 50, cursor?: string) {
  return callSquareCRM<{ customers: SquareCustomer[]; cursor?: string }>('list_customers', { limit, cursor });
}

export async function getCustomer(customerId: string) {
  return callSquareCRM<{ customer: SquareCustomer }>('get_customer', { customerId });
}

export async function searchCustomers(query: string, limit = 50) {
  return callSquareCRM<{ customers: SquareCustomer[]; cursor?: string }>('search_customers', { query, limit });
}

export async function listBookings(limit = 50, cursor?: string, customerId?: string) {
  return callSquareCRM<{ bookings: SquareBooking[]; cursor?: string }>('list_bookings', { limit, cursor, customerId });
}

export async function getBooking(bookingId: string) {
  return callSquareCRM<{ booking: SquareBooking }>('get_booking', { bookingId });
}

export async function listPayments(limit = 50, cursor?: string) {
  return callSquareCRM<{ payments: SquarePayment[]; cursor?: string }>('list_payments', { limit, cursor });
}

export interface SquareCatalogItem {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  variations: Array<{
    id: string;
    name?: string;
    price?: number;
    currency?: string;
  }>;
  updated_at?: string;
}

export async function listCatalogItems(cursor?: string) {
  return callSquareCRM<{ items: SquareCatalogItem[]; cursor?: string }>('list_catalog_items', { cursor });
}
