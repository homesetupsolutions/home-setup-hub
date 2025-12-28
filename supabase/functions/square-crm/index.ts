import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SquareCustomer {
  id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}

interface SquareBooking {
  id: string;
  status: string;
  start_at: string;
  customer_id?: string;
  location_id?: string;
  appointment_segments?: Array<{
    duration_minutes: number;
    team_member_id?: string;
    service_variation_id?: string;
    service_variation_version?: number;
  }>;
  created_at?: string;
  updated_at?: string;
}

interface SquarePayment {
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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN');

    if (!squareAccessToken) {
      console.error('SQUARE_ACCESS_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Square API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get current user and check admin role
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Failed to get user:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: hasAdminRole } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!hasAdminRole) {
      console.error('User is not admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, customerId, limit = 50, cursor } = await req.json();
    console.log('Processing action:', action, 'customerId:', customerId);

    const squareBaseUrl = 'https://connect.squareup.com/v2';
    const headers = {
      'Authorization': `Bearer ${squareAccessToken}`,
      'Content-Type': 'application/json',
      'Square-Version': '2024-01-18',
    };

    let result;

    switch (action) {
      case 'list_customers': {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (cursor) params.append('cursor', cursor);
        
        const response = await fetch(`${squareBaseUrl}/customers?${params}`, { headers });
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Square API error:', data);
          throw new Error(data.errors?.[0]?.detail || 'Failed to fetch customers');
        }
        
        result = {
          customers: data.customers || [],
          cursor: data.cursor,
        };
        console.log('Fetched', result.customers.length, 'customers');
        break;
      }

      case 'get_customer': {
        if (!customerId) throw new Error('Customer ID required');
        
        const response = await fetch(`${squareBaseUrl}/customers/${customerId}`, { headers });
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Square API error:', data);
          throw new Error(data.errors?.[0]?.detail || 'Failed to fetch customer');
        }
        
        result = { customer: data.customer };
        console.log('Fetched customer:', customerId);
        break;
      }

      case 'list_bookings': {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (cursor) params.append('cursor', cursor);
        if (customerId) params.append('customer_id', customerId);
        
        const response = await fetch(`${squareBaseUrl}/bookings?${params}`, { headers });
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Square API error:', data);
          throw new Error(data.errors?.[0]?.detail || 'Failed to fetch bookings');
        }
        
        result = {
          bookings: data.bookings || [],
          cursor: data.cursor,
        };
        console.log('Fetched', result.bookings.length, 'bookings');
        break;
      }

      case 'get_booking': {
        const { bookingId } = await req.json();
        if (!bookingId) throw new Error('Booking ID required');
        
        const response = await fetch(`${squareBaseUrl}/bookings/${bookingId}`, { headers });
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Square API error:', data);
          throw new Error(data.errors?.[0]?.detail || 'Failed to fetch booking');
        }
        
        result = { booking: data.booking };
        console.log('Fetched booking:', bookingId);
        break;
      }

      case 'list_payments': {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (cursor) params.append('cursor', cursor);
        
        const response = await fetch(`${squareBaseUrl}/payments?${params}`, { headers });
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Square API error:', data);
          throw new Error(data.errors?.[0]?.detail || 'Failed to fetch payments');
        }
        
        result = {
          payments: data.payments || [],
          cursor: data.cursor,
        };
        console.log('Fetched', result.payments.length, 'payments');
        break;
      }

      case 'search_customers': {
        const { query } = await req.json();
        
        const searchBody = {
          limit,
          query: {
            filter: {
              email_address: query ? { fuzzy: query } : undefined,
              phone_number: query ? { fuzzy: query } : undefined,
            },
          },
        };
        
        const response = await fetch(`${squareBaseUrl}/customers/search`, {
          method: 'POST',
          headers,
          body: JSON.stringify(searchBody),
        });
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Square API error:', data);
          throw new Error(data.errors?.[0]?.detail || 'Failed to search customers');
        }
        
        result = {
          customers: data.customers || [],
          cursor: data.cursor,
        };
        console.log('Search returned', result.customers.length, 'customers');
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Square CRM error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
