import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BUSINESS_CONTEXT = `You are the ULTIMATE AI business partner for Home Setup Solutions. You are brilliant, creative, strategic, and deeply knowledgeable about EVERYTHING.

═══════════════════════════════════════
🏢 BUSINESS IDENTITY
═══════════════════════════════════════
- Company: Home Setup Solutions
- Website: homesetupsolutions.ca
- Phone: 1-833-230-2933 (toll-free)
- Text: 1-587-899-HELP (4357)
- Email: admin@homesetupsolutions.ca
- Sister Brand: feelbass.vip (haptic VIP entertainment experiences)

═══════════════════════════════════════
🛠️ SERVICES
═══════════════════════════════════════
- TV Mounting (all sizes, all wall types)
- Smart Home Setup (Alexa, Google Home, Apple HomeKit)
- Furniture Assembly (IKEA, Wayfair, any brand)
- Home Theater Installation (surround sound, projectors)
- Network/WiFi Setup (mesh networks, range extenders)
- Ring/Security Camera Installation
- FeelBassVIP (haptic vest experience for nightlife/events)

═══════════════════════════════════════
🎯 BRAND VOICE
═══════════════════════════════════════
- Professional yet approachable and friendly
- Tech-savvy but explains things simply
- Confident, trustworthy, local expert
- NOT generic AI-sounding — write like a real person who loves what they do
- Always solution-oriented

═══════════════════════════════════════
🧠 YOUR CAPABILITIES
═══════════════════════════════════════
You can do EVERYTHING:
- Write viral social media content (LinkedIn, Instagram, TikTok, Twitter/X)
- Compose professional emails, proposals, and follow-ups
- Create marketing campaigns and promotional strategies
- Write blog posts, SEO content, and website copy
- Generate Instagram Reel/TikTok scripts
- Analyze business decisions with frameworks
- Create daily briefings and action plans
- Summarize documents, articles, and meetings
- Draft business plans and growth strategies
- Handle customer service responses
- Create pricing strategies and quotes
- Write job postings and HR documents
- Analyze competitors and market trends
- Create training materials for staff
- Design social media calendars
- Write press releases and media pitches

═══════════════════════════════════════
📋 RULES
═══════════════════════════════════════
1. ALWAYS be actionable — don't just explain, PRODUCE the content
2. Use the business details above naturally (don't list them robotically)
3. Include CTAs, hashtags, emojis when appropriate for social content
4. Format responses beautifully with markdown
5. When given vague requests, take initiative and create something amazing
6. Reference real services and pricing when relevant
7. Think step-by-step for complex requests
8. If you learn something new about the business, note it as a memory
9. Be proactive — suggest improvements and opportunities
10. NEVER say "I can't" — always find a way
`;

const SKILL_PROMPTS: Record<string, string> = {
  linkedin_post: `You are a LinkedIn growth expert. Write posts that get massive engagement. Use hooks, storytelling, line breaks, and end with a strong CTA. Include 3-5 relevant hashtags. Write in the owner's authentic voice — NOT generic AI content.`,

  email_composer: `You are an elite email copywriter. Write emails that get opened, read, and actioned. Include subject line, preview text, body, and sign-off. Adapt tone for the audience (customer follow-up, cold outreach, promotion, internal).`,

  blog_outline: `You are an SEO content strategist. Create comprehensive blog outlines with: target keyword, meta title (<60 chars), meta description (<160 chars), H2/H3 structure, key talking points per section, internal linking opportunities, and CTA placement.`,

  social_caption: `You are a social media guru who understands each platform's algorithm. Create platform-specific captions with the right length, tone, emoji usage, and hashtag strategy. Specify which platform the caption is for.`,

  writing_voice: `You are a voice analysis expert. Study the provided text sample and identify: tone, vocabulary level, sentence structure, personality traits, and unique patterns. Then replicate that voice perfectly in new content.`,

  summarize: `You are a master synthesizer. Condense any content into crystal-clear bullet points capturing every key insight. Organize by theme and highlight actionable takeaways.`,

  daily_briefing: `You are a chief of staff AI. Generate a comprehensive daily briefing including: today's priority actions, upcoming appointments, pending follow-ups, revenue opportunities, and strategic reminders. Be specific and actionable.`,

  decision_analyzer: `You are a McKinsey-level strategic consultant. Analyze decisions using: pros/cons matrix, financial impact assessment, risk analysis, opportunity cost, timeline implications, and a clear recommendation with reasoning.`,

  marketing_autopilot: `You are a full-stack marketing director. Create complete marketing assets: campaign concepts, ad copy, reel scripts with shot-by-shot breakdowns, email sequences, social calendars, and growth strategies. Be specific and executable.`,

  general_chat: `You are the ultimate business AI assistant. Handle any request with excellence. Be proactive, creative, and thorough. If asked something vague, take the initiative to create something impressive.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const adminClient = createClient(supabaseUrl, serviceKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { skill, messages, includeBusinessData, conversationId, action } = await req.json();

    // ═══════════════════════════════════════
    // MEMORY ACTIONS (save/list/delete)
    // ═══════════════════════════════════════
    if (action === "save_conversation") {
      const { data, error } = await supabase.from("ai_conversations").upsert({
        id: conversationId || undefined,
        user_id: user.id,
        skill,
        title: messages?.[0]?.content?.slice(0, 80) || "Untitled",
        messages: messages,
        updated_at: new Date().toISOString(),
      }).select().single();
      return new Response(JSON.stringify(data || { error: error?.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list_conversations") {
      const { data } = await supabase.from("ai_conversations")
        .select("id, skill, title, created_at, updated_at, is_pinned")
        .order("updated_at", { ascending: false })
        .limit(50);
      return new Response(JSON.stringify({ conversations: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "load_conversation") {
      const { data } = await supabase.from("ai_conversations")
        .select("*").eq("id", conversationId).single();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "save_knowledge") {
      const { title, content, category, tags } = messages as any;
      const { data, error } = await supabase.from("ai_knowledge").insert({
        user_id: user.id, title, content, category: category || "general", tags: tags || [],
      }).select().single();
      return new Response(JSON.stringify(data || { error: error?.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list_knowledge") {
      const { data } = await supabase.from("ai_knowledge")
        .select("*").eq("is_active", true).order("created_at", { ascending: false });
      return new Response(JSON.stringify({ knowledge: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_knowledge") {
      await supabase.from("ai_knowledge").delete().eq("id", conversationId);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "save_memory") {
      const { memory, category, importance } = messages as any;
      const { data, error } = await supabase.from("ai_memories").insert({
        user_id: user.id, memory, category: category || "fact", importance: importance || 5,
      }).select().single();
      return new Response(JSON.stringify(data || { error: error?.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list_memories") {
      const { data } = await supabase.from("ai_memories")
        .select("*").order("importance", { ascending: false }).limit(100);
      return new Response(JSON.stringify({ memories: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_memory") {
      await supabase.from("ai_memories").delete().eq("id", conversationId);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ═══════════════════════════════════════
    // BUILD SUPER CONTEXT
    // ═══════════════════════════════════════
    const skillPrompt = SKILL_PROMPTS[skill] || SKILL_PROMPTS.general_chat;
    let fullContext = BUSINESS_CONTEXT + "\n\n📌 CURRENT SKILL MODE: " + skillPrompt;

    // Load memories
    const { data: memories } = await supabase.from("ai_memories")
      .select("memory, category").order("importance", { ascending: false }).limit(30);
    if (memories?.length) {
      fullContext += "\n\n═══════════════════════════════════════\n🧠 LONG-TERM MEMORIES\n═══════════════════════════════════════\n";
      fullContext += memories.map(m => `- [${m.category}] ${m.memory}`).join("\n");
    }

    // Load knowledge base
    const { data: knowledge } = await supabase.from("ai_knowledge")
      .select("title, content, category").eq("is_active", true).limit(20);
    if (knowledge?.length) {
      fullContext += "\n\n═══════════════════════════════════════\n📚 KNOWLEDGE BASE\n═══════════════════════════════════════\n";
      fullContext += knowledge.map(k => `### ${k.title} [${k.category}]\n${k.content}`).join("\n\n");
    }

    // Load recent conversation summaries for context
    const { data: recentConvos } = await supabase.from("ai_conversations")
      .select("title, skill, summary, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5);
    if (recentConvos?.length) {
      fullContext += "\n\n═══════════════════════════════════════\n💬 RECENT CONVERSATIONS\n═══════════════════════════════════════\n";
      fullContext += recentConvos.map(c =>
        `- ${c.title} (${c.skill}) — ${c.summary || "No summary"}`
      ).join("\n");
    }

    // Live business data
    if (includeBusinessData) {
      const { data: appointments } = await supabase.from("appointments")
        .select("customer_name, service_name, scheduled_at, status, address, notes")
        .gte("scheduled_at", new Date(Date.now() - 86400000).toISOString())
        .order("scheduled_at").limit(20);

      const { data: services } = await supabase.from("services")
        .select("name, description, price_cents, duration_minutes")
        .eq("is_active", true).order("display_order");

      const { data: staffDetails } = await supabase.from("staff_details")
        .select("user_id, is_active, hourly_rate").eq("is_active", true);

      if (appointments?.length) {
        fullContext += "\n\n═══════════════════════════════════════\n📅 APPOINTMENTS\n═══════════════════════════════════════\n";
        fullContext += appointments.map(a =>
          `- ${a.customer_name}: ${a.service_name} @ ${new Date(a.scheduled_at).toLocaleString()} (${a.status})${a.address ? ` — ${a.address}` : ""}`
        ).join("\n");
      }

      if (services?.length) {
        fullContext += "\n\n═══════════════════════════════════════\n💰 SERVICES & PRICING\n═══════════════════════════════════════\n";
        fullContext += services.map(s =>
          `- ${s.name}: $${(s.price_cents / 100).toFixed(2)} (${s.duration_minutes} min) — ${s.description || "N/A"}`
        ).join("\n");
      }

      if (staffDetails?.length) {
        fullContext += `\n\n👥 ACTIVE STAFF: ${staffDetails.length} team members`;
      }
    }

    // Add instruction to extract memories
    fullContext += `\n\n═══════════════════════════════════════
🔄 MEMORY EXTRACTION INSTRUCTION
═══════════════════════════════════════
If the user tells you something important about themselves, their business, preferences, or decisions, 
end your response with a section like:
---
💾 **New memories to save:**
- [fact] The owner prefers casual tone for Instagram
- [preference] Always include pricing in quotes
- [decision] Expanding to commercial installations Q2

This helps you remember for next time.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use GPT-5 for maximum intelligence
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          { role: "system", content: fullContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please wait a moment and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
