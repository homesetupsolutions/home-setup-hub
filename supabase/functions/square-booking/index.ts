import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN');
    const locationId = Deno.env.get('SQUARE_LOCATION_ID') || 'LBJ4C01HMM5JH';

    if (!squareAccessToken) {
      return new Response(
        JSON.stringify({ error: 'Square API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
    const squareBaseUrl = 'https://connect.squareup.com/v2';
    const headers = {
      'Authorization': `Bearer ${squareAccessToken}`,
      'Content-Type': 'application/json',
      'Square-Version': '2024-01-18',
    };

    let result;

    switch (action) {
      case 'get_services': {
        // Get catalog items that are bookable services
        const response = await fetch(`${squareBaseUrl}/catalog/list?types=ITEM`, { headers });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.errors?.[0]?.detail || 'Failed to fetch services');
        }

        // Filter for service items and format
        const services = (data.objects || [])
          .filter((item: any) => item.item_data?.product_type === 'APPOINTMENTS_SERVICE' || item.item_data)
          .map((item: any) => {
            const itemData = item.item_data || {};
            const variations = (itemData.variations || []).map((v: any) => ({
              id: v.id,
              name: v.item_variation_data?.name || itemData.name,
              price: v.item_variation_data?.price_money?.amount || 0,
              currency: v.item_variation_data?.price_money?.currency || 'CAD',
              duration_minutes: v.item_variation_data?.service_duration ? 
                Math.round(v.item_variation_data.service_duration / 60000) : 60,
            }));

            return {
              id: item.id,
              name: itemData.name,
              description: itemData.description || '',
              variations,
            };
          });

        result = { services };
        break;
      }

      case 'get_availability': {
        const { startDate, endDate, serviceVariationId } = raw;
        
        if (!startDate || !serviceVariationId) {
          throw new Error('startDate and serviceVariationId required');
        }

        // Get team members first
        const teamResponse = await fetch(`${squareBaseUrl}/team-members/search`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query: {
              filter: {
                location_ids: [locationId],
                status: 'ACTIVE',
              },
            },
          }),
        });

        const teamData = await teamResponse.json();
        const teamMemberIds = (teamData.team_members || []).map((tm: any) => tm.id);

        if (teamMemberIds.length === 0) {
          result = { availabilities: [] };
          break;
        }

        // Search for available time slots
        const searchBody = {
          query: {
            filter: {
              start_at_range: {
                start_at: startDate,
                end_at: endDate || new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              },
              location_id: locationId,
              segment_filters: [{
                service_variation_id: serviceVariationId,
                team_member_id_filter: {
                  any: teamMemberIds,
                },
              }],
            },
          },
        };

        const availResponse = await fetch(`${squareBaseUrl}/bookings/availability/search`, {
          method: 'POST',
          headers,
          body: JSON.stringify(searchBody),
        });

        const availData = await availResponse.json();

        if (!availResponse.ok) {
          console.error('Availability error:', availData);
          throw new Error(availData.errors?.[0]?.detail || 'Failed to fetch availability');
        }

        const availabilities = (availData.availabilities || []).map((a: any) => ({
          start_at: a.start_at,
          location_id: a.location_id,
          appointment_segments: a.appointment_segments,
        }));

        result = { availabilities };
        break;
      }

      case 'create_booking': {
        const { 
          startAt, 
          serviceVariationId, 
          serviceVersion,
          teamMemberId,
          customerNote,
          customerFirstName,
          customerLastName,
          customerEmail,
          customerPhone,
        } = raw;

        if (!startAt || !serviceVariationId) {
          throw new Error('startAt and serviceVariationId required');
        }

        // First, create or find customer
        let customerId: string | undefined;

        if (customerEmail || customerPhone) {
          // Search for existing customer
          const searchBody: any = {
            limit: 1,
            query: { filter: {} },
          };

          if (customerEmail) {
            searchBody.query.filter.email_address = { exact: customerEmail };
          } else if (customerPhone) {
            searchBody.query.filter.phone_number = { exact: customerPhone };
          }

          const searchResponse = await fetch(`${squareBaseUrl}/customers/search`, {
            method: 'POST',
            headers,
            body: JSON.stringify(searchBody),
          });

          const searchData = await searchResponse.json();

          if (searchData.customers && searchData.customers.length > 0) {
            customerId = searchData.customers[0].id;
          } else {
            // Create new customer
            const createCustomerBody: any = {
              given_name: customerFirstName || '',
              family_name: customerLastName || '',
              email_address: customerEmail,
              phone_number: customerPhone,
            };

            const createResponse = await fetch(`${squareBaseUrl}/customers`, {
              method: 'POST',
              headers,
              body: JSON.stringify(createCustomerBody),
            });

            const createData = await createResponse.json();
            if (createData.customer) {
              customerId = createData.customer.id;
            }
          }
        }

        // Create the booking
        const bookingBody: any = {
          booking: {
            start_at: startAt,
            location_id: locationId,
            customer_id: customerId,
            customer_note: customerNote || '',
            appointment_segments: [{
              duration_minutes: raw.durationMinutes || 60,
              service_variation_id: serviceVariationId,
              service_variation_version: serviceVersion,
              team_member_id: teamMemberId || 'anyone',
            }],
          },
          idempotency_key: crypto.randomUUID(),
        };

        const bookingResponse = await fetch(`${squareBaseUrl}/bookings`, {
          method: 'POST',
          headers,
          body: JSON.stringify(bookingBody),
        });

        const bookingData = await bookingResponse.json();

        if (!bookingResponse.ok) {
          console.error('Booking error:', bookingData);
          throw new Error(bookingData.errors?.[0]?.detail || 'Failed to create booking');
        }

        result = { booking: bookingData.booking };
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
    console.error('Square Booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
