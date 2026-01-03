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

    const raw = await req.json().catch(() => null);
    if (!raw || typeof raw !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const action = typeof raw.action === 'string' ? raw.action : '';
    
    // Customer-only action that doesn't require admin
    const customerActions = new Set(['get_my_transactions']);
    
    // Admin-only actions
    const adminActions = new Set([
      'list_customers',
      'get_customer',
      'search_customers',
      'list_bookings',
      'get_booking',
      'list_payments',
      'list_customer_payments',
      'list_catalog_items',
    ]);

    const allActions = new Set([...customerActions, ...adminActions]);
    
    if (!allActions.has(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role for admin actions
    if (adminActions.has(action)) {
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
    }

    const limitRaw = raw.limit ?? 100;
    const limit = Number.isInteger(limitRaw) ? Number(limitRaw) : 100;
    if (limit < 1 || limit > 1000) {
      return new Response(
        JSON.stringify({ error: 'Invalid limit (1-1000)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const customerId = typeof raw.customerId === 'string' && raw.customerId.length <= 128 ? raw.customerId : undefined;
    const bookingId = typeof raw.bookingId === 'string' && raw.bookingId.length <= 128 ? raw.bookingId : undefined;
    const cursor = typeof raw.cursor === 'string' && raw.cursor.length <= 500 ? raw.cursor : undefined;
    const query = typeof raw.query === 'string' && raw.query.length <= 200 ? raw.query : undefined;

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

      case 'list_customer_payments': {
        if (!customerId) throw new Error('Customer ID required');
        
        // Fetch all payments for a specific customer
        let allPayments: SquarePayment[] = [];
        let nextCursor: string | undefined = cursor;
        
        // Get payments and filter by customer
        do {
          const params = new URLSearchParams({ limit: '100' });
          if (nextCursor) params.append('cursor', nextCursor);
          
          const response = await fetch(`${squareBaseUrl}/payments?${params}`, { headers });
          const data = await response.json();
          
          if (!response.ok) {
            console.error('Square API error:', data);
            throw new Error(data.errors?.[0]?.detail || 'Failed to fetch payments');
          }
          
          // Filter to only this customer's payments
          const customerPayments = (data.payments || []).filter(
            (p: any) => p.customer_id === customerId
          );
          allPayments = [...allPayments, ...customerPayments];
          nextCursor = data.cursor;
          
          // Stop if we have enough or hit max iterations
          if (allPayments.length >= limit) break;
        } while (nextCursor);
        
        result = {
          payments: allPayments.slice(0, limit),
          cursor: nextCursor,
        };
        console.log('Fetched', result.payments.length, 'payments for customer', customerId);
        break;
      }

      case 'search_customers': {
        if (!query) {
          result = { customers: [], cursor: undefined };
          break;
        }
        
        // Normalize the query - remove spaces, dashes, parentheses for phone matching
        const normalizedQuery = query.trim();
        const phoneQuery = normalizedQuery.replace(/[\s\-\(\)\+]/g, '');
        
        // Check if it looks like a phone number (mostly digits)
        const isPhoneSearch = /^\d{7,}$/.test(phoneQuery) || /^\d/.test(phoneQuery.replace(/\D/g, ''));
        
        // Check if it looks like an email
        const isEmailSearch = normalizedQuery.includes('@') || /^[a-zA-Z]/.test(normalizedQuery);
        
        let allCustomers: SquareCustomer[] = [];
        
        // Search by phone if it looks like a phone number
        if (isPhoneSearch || !isEmailSearch) {
          // Try with different phone formats
          const phoneVariants = [
            phoneQuery,
            `+1${phoneQuery}`,
            phoneQuery.slice(-10), // Last 10 digits
          ];
          
          for (const phoneVariant of phoneVariants) {
            if (phoneVariant.length < 3) continue;
            
            const phoneSearchBody = {
              limit: Math.min(limit, 50),
              query: {
                filter: {
                  phone_number: { fuzzy: phoneVariant },
                },
              },
            };
            
            const phoneResponse = await fetch(`${squareBaseUrl}/customers/search`, {
              method: 'POST',
              headers,
              body: JSON.stringify(phoneSearchBody),
            });
            
            if (phoneResponse.ok) {
              const phoneData = await phoneResponse.json();
              const phoneCustomers = phoneData.customers || [];
              // Add unique customers
              for (const c of phoneCustomers) {
                if (!allCustomers.find(existing => existing.id === c.id)) {
                  allCustomers.push(c);
                }
              }
            }
            
            if (allCustomers.length >= limit) break;
          }
        }
        
        // Search by email/name if it looks like text
        if (isEmailSearch || allCustomers.length < limit) {
          const emailSearchBody = {
            limit: Math.min(limit, 50),
            query: {
              filter: {
                email_address: { fuzzy: normalizedQuery },
              },
            },
          };
          
          const emailResponse = await fetch(`${squareBaseUrl}/customers/search`, {
            method: 'POST',
            headers,
            body: JSON.stringify(emailSearchBody),
          });
          
          if (emailResponse.ok) {
            const emailData = await emailResponse.json();
            const emailCustomers = emailData.customers || [];
            // Add unique customers
            for (const c of emailCustomers) {
              if (!allCustomers.find(existing => existing.id === c.id)) {
                allCustomers.push(c);
              }
            }
          }
        }
        
        result = {
          customers: allCustomers.slice(0, limit),
          cursor: undefined, // No pagination for combined search
        };
        console.log('Search for', query, 'returned', result.customers.length, 'customers');
        break;
      }

      case 'list_catalog_items': {
        // List catalog items (services) with their variations and prices
        const params = new URLSearchParams();
        params.append('types', 'ITEM');
        if (cursor) params.append('cursor', cursor);
        
        const response = await fetch(`${squareBaseUrl}/catalog/list?${params}`, { headers });
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Square API error:', data);
          throw new Error(data.errors?.[0]?.detail || 'Failed to fetch catalog items');
        }
        
        // Filter to only include service-type items and extract pricing
        const items = (data.objects || []).map((item: any) => {
          const itemData = item.item_data || {};
          const variations = (itemData.variations || []).map((v: any) => ({
            id: v.id,
            name: v.item_variation_data?.name,
            price: v.item_variation_data?.price_money?.amount,
            currency: v.item_variation_data?.price_money?.currency,
          }));
          
          return {
            id: item.id,
            name: itemData.name,
            description: itemData.description,
            category_id: itemData.category_id,
            variations,
            updated_at: item.updated_at,
          };
        });
        
        result = {
          items,
          cursor: data.cursor,
        };
        console.log('Fetched', items.length, 'catalog items');
        break;
      }

      case 'get_my_transactions': {
        // Get the user's profile to find their email/phone
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email, phone')
          .eq('user_id', user.id)
          .single();

        if (profileError || !profile) {
          console.error('Failed to get user profile:', profileError);
          result = { payments: [], bookings: [], squareCustomer: null };
          break;
        }

        console.log('Looking up Square customer for:', profile.email, profile.phone);

        // Search Square for matching customer by email first, then phone
        let squareCustomerId: string | null = null;
        let squareCustomer: SquareCustomer | null = null;

        // Try email search
        if (profile.email) {
          const emailSearchBody = {
            limit: 1,
            query: {
              filter: {
                email_address: { exact: profile.email },
              },
            },
          };

          const emailResponse = await fetch(`${squareBaseUrl}/customers/search`, {
            method: 'POST',
            headers,
            body: JSON.stringify(emailSearchBody),
          });

          if (emailResponse.ok) {
            const emailData = await emailResponse.json();
            if (emailData.customers && emailData.customers.length > 0) {
              squareCustomer = emailData.customers[0];
              squareCustomerId = squareCustomer!.id;
              console.log('Found Square customer by email:', squareCustomerId);
            }
          }
        }

        // Try phone search if email didn't match
        if (!squareCustomerId && profile.phone) {
          const phoneNormalized = profile.phone.replace(/\D/g, '');
          const phoneVariants = [
            phoneNormalized,
            `+1${phoneNormalized}`,
            phoneNormalized.slice(-10),
          ];

          for (const phoneVariant of phoneVariants) {
            if (phoneVariant.length < 10) continue;

            const phoneSearchBody = {
              limit: 1,
              query: {
                filter: {
                  phone_number: { exact: `+1${phoneVariant.slice(-10)}` },
                },
              },
            };

            const phoneResponse = await fetch(`${squareBaseUrl}/customers/search`, {
              method: 'POST',
              headers,
              body: JSON.stringify(phoneSearchBody),
            });

            if (phoneResponse.ok) {
              const phoneData = await phoneResponse.json();
              if (phoneData.customers && phoneData.customers.length > 0) {
                squareCustomer = phoneData.customers[0];
                squareCustomerId = squareCustomer!.id;
                console.log('Found Square customer by phone:', squareCustomerId);
                break;
              }
            }
          }
        }

        if (!squareCustomerId) {
          console.log('No Square customer found for user');
          result = { payments: [], bookings: [], squareCustomer: null };
          break;
        }

        // Fetch payments for this customer
        const paymentsResponse = await fetch(
          `${squareBaseUrl}/payments?limit=50`,
          { headers }
        );
        
        let payments: SquarePayment[] = [];
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          payments = (paymentsData.payments || []).filter(
            (p: any) => p.customer_id === squareCustomerId
          );
        }

        // Fetch bookings for this customer
        const bookingsResponse = await fetch(
          `${squareBaseUrl}/bookings?customer_id=${squareCustomerId}&limit=50`,
          { headers }
        );
        
        let bookings: SquareBooking[] = [];
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          bookings = bookingsData.bookings || [];
        }

        console.log(`Found ${payments.length} payments and ${bookings.length} bookings for customer`);
        
        result = { 
          payments, 
          bookings, 
          squareCustomer: {
            id: squareCustomer?.id,
            given_name: squareCustomer?.given_name,
            family_name: squareCustomer?.family_name,
          }
        };
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
