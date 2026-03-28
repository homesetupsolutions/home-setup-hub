import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BUSINESS_CONTEXT = `You are the AI assistant for Home Setup Solutions, a professional home services company.

BUSINESS INFO:
- Company: Home Setup Solutions
- Services: TV Mounting, Smart Home Setup, Furniture Assembly, Home Theater Installation, Network/WiFi Setup, Ring/Security Camera Installation, FeelBassVIP (Haptic VIP Experience for events)
- Service Area: Local home service provider
- Brand Voice: Professional, friendly, trustworthy, knowledgeable about home technology
- Website: homesetupsolutions.lovable.app
- Sister Brand: feelbass.vip (haptic entertainment experiences)

IMPORTANT RULES:
- Always maintain the brand voice: professional yet approachable
- Reference actual services when creating content
- Focus on value propositions: convenience, expertise, reliability
- Include calls-to-action when appropriate
- Use relevant hashtags for social media content
- Keep content authentic, not generic AI-sounding
`;

const SKILL_PROMPTS: Record<string, string> = {
  linkedin_post: `${BUSINESS_CONTEXT}
You are a LinkedIn content specialist. Write LinkedIn posts in the business owner's authentic voice — not generic AI content. Posts should be professional, insightful, and drive engagement. Include relevant hashtags. Format with line breaks for readability.`,

  email_composer: `${BUSINESS_CONTEXT}
You are a professional email composer. Write emails with appropriate tone and structure for a home services business. Include subject line, greeting, body, and sign-off. Adapt tone based on whether it's a customer follow-up, promotion, or business communication.`,

  blog_outline: `${BUSINESS_CONTEXT}
You are an SEO-savvy blog content strategist. Create structured blog post outlines with SEO considerations including target keywords, meta description, H2/H3 structure, and key points for each section. Focus on topics relevant to home technology and setup services.`,

  social_caption: `${BUSINESS_CONTEXT}
You are a social media expert. Create captions for Instagram, Twitter/X, TikTok, and other social platforms. Include relevant emojis, hashtags, and calls-to-action. Keep captions platform-appropriate in length and tone.`,

  writing_voice: `${BUSINESS_CONTEXT}
You are a writing voice analyst. Analyze the provided text and replicate the user's unique writing voice, tone, and style. Help them maintain consistency across all communications.`,

  summarize: `${BUSINESS_CONTEXT}
You are a summarization expert. Summarize long text, articles, or conversations into key points. Be concise but comprehensive. Use bullet points for clarity.`,

  daily_briefing: `${BUSINESS_CONTEXT}
You are a business operations assistant. Generate a personalized daily briefing with priorities and actionable items. Consider appointments, pending tasks, and business goals.`,

  decision_analyzer: `${BUSINESS_CONTEXT}
You are a business decision analyst. Help analyze decisions with pros/cons, frameworks, and clear recommendations. Consider financial impact, time investment, and strategic alignment.`,

  marketing_autopilot: `${BUSINESS_CONTEXT}
You are a marketing strategist for a home services business. Create comprehensive marketing content including Instagram reel scripts, promotional campaigns, seasonal offers, and growth strategies. Focus on local marketing that drives bookings.`,

  general_chat: `${BUSINESS_CONTEXT}
You are a helpful AI assistant for the business. Answer questions, provide advice, and help with any business-related tasks. Be concise and actionable.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user is admin
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: roleData } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { skill, messages, includeBusinessData } = await req.json();

    const systemPrompt = SKILL_PROMPTS[skill] || SKILL_PROMPTS.general_chat;

    // Optionally fetch live business data
    let liveContext = "";
    if (includeBusinessData) {
      const { data: appointments } = await supabase
        .from("appointments")
        .select("customer_name, service_name, scheduled_at, status")
        .gte("scheduled_at", new Date().toISOString().split("T")[0])
        .order("scheduled_at")
        .limit(10);

      const { data: services } = await supabase
        .from("services")
        .select("name, description, price_cents, duration_minutes")
        .eq("is_active", true)
        .order("display_order");

      if (appointments?.length) {
        liveContext += `\n\nTODAY'S/UPCOMING APPOINTMENTS:\n${appointments.map(a =>
          `- ${a.customer_name}: ${a.service_name} at ${new Date(a.scheduled_at).toLocaleString()} (${a.status})`
        ).join("\n")}`;
      }

      if (services?.length) {
        liveContext += `\n\nACTIVE SERVICES & PRICING:\n${services.map(s =>
          `- ${s.name}: $${(s.price_cents / 100).toFixed(2)} (${s.duration_minutes} min) — ${s.description || "No description"}`
        ).join("\n")}`;
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt + liveContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
