import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Linkedin, Mail, FileText, Instagram, Pen, FileDown,
  Calendar, Brain, Megaphone, MessageSquare, Send, Loader2,
  Copy, RotateCcw, Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Skill = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'content' | 'general' | 'marketing';
  placeholder: string;
};

const SKILLS: Skill[] = [
  {
    id: 'linkedin_post',
    name: 'LinkedIn Post',
    description: 'Write authentic LinkedIn posts in your voice',
    icon: Linkedin,
    category: 'content',
    placeholder: 'Write a LinkedIn post about how smart home technology is changing how families interact with their living spaces...',
  },
  {
    id: 'email_composer',
    name: 'Email Composer',
    description: 'Professional emails with the right tone',
    icon: Mail,
    category: 'content',
    placeholder: 'Write a follow-up email to a customer after we completed their TV mounting service...',
  },
  {
    id: 'blog_outline',
    name: 'Blog Outline',
    description: 'SEO-optimized blog structures',
    icon: FileText,
    category: 'content',
    placeholder: 'Create a blog outline about "5 Things to Know Before Mounting Your TV"...',
  },
  {
    id: 'social_caption',
    name: 'Social Caption',
    description: 'Instagram, Twitter/X, TikTok captions',
    icon: Instagram,
    category: 'content',
    placeholder: 'Write an Instagram caption for a before/after photo of a home theater installation...',
  },
  {
    id: 'writing_voice',
    name: 'Writing Voice',
    description: 'Analyze and replicate your unique voice',
    icon: Pen,
    category: 'content',
    placeholder: 'Here is a sample of my writing: [paste your text]. Now write a customer thank-you note in this same voice...',
  },
  {
    id: 'summarize',
    name: 'Summarize',
    description: 'Condense long text into key points',
    icon: FileDown,
    category: 'general',
    placeholder: 'Summarize this article about smart home trends: [paste text]...',
  },
  {
    id: 'daily_briefing',
    name: 'Daily Briefing',
    description: 'Personalized daily priorities & schedule',
    icon: Calendar,
    category: 'general',
    placeholder: 'Generate my daily briefing with today\'s priorities, upcoming appointments, and action items...',
  },
  {
    id: 'decision_analyzer',
    name: 'Decision Analyzer',
    description: 'Analyze decisions with frameworks',
    icon: Brain,
    category: 'general',
    placeholder: 'Should I expand into commercial office installations? My current focus is residential...',
  },
  {
    id: 'marketing_autopilot',
    name: 'Marketing Autopilot',
    description: 'Campaigns, reel scripts, promos',
    icon: Megaphone,
    category: 'marketing',
    placeholder: 'Create an Instagram reel script promoting our spring home setup special...',
  },
  {
    id: 'general_chat',
    name: 'General Chat',
    description: 'Ask anything about your business',
    icon: MessageSquare,
    category: 'general',
    placeholder: 'What are some ways I can increase repeat customers?',
  },
];

type Message = { role: 'user' | 'assistant'; content: string };

export function AICommandCenter() {
  const [activeSkill, setActiveSkill] = useState<Skill>(SKILLS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [includeBusinessData, setIncludeBusinessData] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSkillChange = (skill: Skill) => {
    setActiveSkill(skill);
    setMessages([]);
    setInput('');
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    let assistantSoFar = '';

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            skill: activeSkill.id,
            messages: [...messages, userMsg],
            includeBusinessData,
          }),
        }
      );

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: 'AI request failed' }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error('No response stream');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (err: any) {
      toast({
        title: 'AI Error',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
      // Remove the user message if no response
      if (!assistantSoFar) {
        setMessages(prev => prev.slice(0, -1));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyLastResponse = () => {
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
    if (lastAssistant) {
      navigator.clipboard.writeText(lastAssistant.content);
      toast({ title: 'Copied!', description: 'Response copied to clipboard' });
    }
  };

  const categoryColors: Record<string, string> = {
    content: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    general: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    marketing: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Command Center
        </h2>
        <p className="text-muted-foreground mt-1">
          Your AI-powered business assistant — content, briefings, decisions & marketing
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {SKILLS.map((skill) => {
          const Icon = skill.icon;
          const isActive = activeSkill.id === skill.id;
          return (
            <button
              key={skill.id}
              onClick={() => handleSkillChange(skill)}
              className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                isActive
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/30 hover:bg-accent/50'
              }`}
            >
              <Icon className={`h-5 w-5 mb-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="text-sm font-medium truncate">{skill.name}</div>
              <Badge variant="outline" className={`text-[10px] mt-1 ${categoryColors[skill.category]}`}>
                {skill.category}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Chat Area */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <activeSkill.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{activeSkill.name}</CardTitle>
                <CardDescription>{activeSkill.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={includeBusinessData ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIncludeBusinessData(!includeBusinessData)}
                className="text-xs"
              >
                📊 Live Data {includeBusinessData ? 'ON' : 'OFF'}
              </Button>
              {messages.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={copyLastResponse}>
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setMessages([])}>
                    <RotateCcw className="h-3 w-3 mr-1" /> Clear
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <ScrollArea className="h-[400px] rounded-lg border bg-muted/20 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-center">
                <div>
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Ready to create</p>
                  <p className="text-sm max-w-md mt-1">
                    Use the {activeSkill.name} skill to generate content for your business.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border shadow-sm'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex justify-start">
                    <div className="bg-card border shadow-sm rounded-2xl px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeSkill.placeholder}
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="lg"
              className="h-auto"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
