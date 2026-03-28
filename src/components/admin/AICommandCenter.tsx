import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Linkedin, Mail, FileText, Instagram, Pen, FileDown,
  Calendar, Brain, Megaphone, MessageSquare, Send, Loader2,
  Copy, RotateCcw, Sparkles, Save, History, BookOpen,
  Plus, Trash2, Pin, Zap
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
  { id: 'general_chat', name: 'General Chat', description: 'Ask anything — your AI knows it all', icon: MessageSquare, category: 'general', placeholder: 'Ask me anything about your business, marketing, operations...' },
  { id: 'linkedin_post', name: 'LinkedIn Post', description: 'Viral LinkedIn content in your voice', icon: Linkedin, category: 'content', placeholder: 'Write a LinkedIn post about...' },
  { id: 'email_composer', name: 'Email Composer', description: 'Professional emails that get results', icon: Mail, category: 'content', placeholder: 'Write an email to...' },
  { id: 'blog_outline', name: 'Blog Outline', description: 'SEO-optimized blog structures', icon: FileText, category: 'content', placeholder: 'Create a blog outline about...' },
  { id: 'social_caption', name: 'Social Caption', description: 'Instagram, TikTok, Twitter/X captions', icon: Instagram, category: 'content', placeholder: 'Write a caption for...' },
  { id: 'writing_voice', name: 'Writing Voice', description: 'Analyze & replicate your voice', icon: Pen, category: 'content', placeholder: 'Here is a sample of my writing: ...' },
  { id: 'summarize', name: 'Summarize', description: 'Condense anything into key points', icon: FileDown, category: 'general', placeholder: 'Summarize this: ...' },
  { id: 'daily_briefing', name: 'Daily Briefing', description: 'Your personalized daily action plan', icon: Calendar, category: 'general', placeholder: 'Generate my daily briefing' },
  { id: 'decision_analyzer', name: 'Decision Analyzer', description: 'McKinsey-level strategic analysis', icon: Brain, category: 'general', placeholder: 'Should I...' },
  { id: 'marketing_autopilot', name: 'Marketing', description: 'Campaigns, reels, promos', icon: Megaphone, category: 'marketing', placeholder: 'Create a marketing campaign for...' },
];

type Message = { role: 'user' | 'assistant'; content: string };
type Conversation = { id: string; skill: string; title: string; created_at: string; updated_at: string; is_pinned: boolean };
type KnowledgeItem = { id: string; title: string; content: string; category: string; tags: string[]; created_at: string };
type MemoryItem = { id: string; memory: string; category: string; importance: number; created_at: string };

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;
const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
};

async function apiCall(body: Record<string, unknown>) {
  const resp = await fetch(API_URL, { method: 'POST', headers: AUTH_HEADERS, body: JSON.stringify(body) });
  if (!resp.ok) throw new Error((await resp.json().catch(() => ({}))).error || `Error ${resp.status}`);
  return resp.json();
}

export function AICommandCenter() {
  const [activeSkill, setActiveSkill] = useState<Skill>(SKILLS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [includeBusinessData, setIncludeBusinessData] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [sidePanel, setSidePanel] = useState<'skills' | 'history' | 'brain' | 'memory'>('skills');
  const [newKnowledge, setNewKnowledge] = useState({ title: '', content: '', category: 'general' });
  const [newMemory, setNewMemory] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const loadConversations = useCallback(async () => {
    try {
      const data = await apiCall({ action: 'list_conversations' });
      setConversations(data.conversations || []);
    } catch { /* silent */ }
  }, []);

  const loadKnowledge = useCallback(async () => {
    try {
      const data = await apiCall({ action: 'list_knowledge' });
      setKnowledge(data.knowledge || []);
    } catch { /* silent */ }
  }, []);

  const loadMemories = useCallback(async () => {
    try {
      const data = await apiCall({ action: 'list_memories' });
      setMemories(data.memories || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadConversations(); loadKnowledge(); loadMemories(); }, [loadConversations, loadKnowledge, loadMemories]);

  const handleSkillChange = (skill: Skill) => {
    setActiveSkill(skill);
    setMessages([]);
    setCurrentConvoId(null);
  };

  const saveConversation = async () => {
    if (messages.length === 0) return;
    try {
      const data = await apiCall({
        action: 'save_conversation', skill: activeSkill.id,
        messages, conversationId: currentConvoId,
      });
      if (data.id) { setCurrentConvoId(data.id); loadConversations(); }
      toast({ title: '💾 Saved!', description: 'Conversation saved to memory' });
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    }
  };

  const loadConversation = async (convo: Conversation) => {
    try {
      const data = await apiCall({ action: 'load_conversation', conversationId: convo.id });
      if (data?.messages) {
        setMessages(data.messages);
        setCurrentConvoId(convo.id);
        setActiveSkill(SKILLS.find(s => s.id === convo.skill) || SKILLS[0]);
        setSidePanel('skills');
      }
    } catch (e: any) {
      toast({ title: 'Load failed', description: e.message, variant: 'destructive' });
    }
  };

  const addKnowledge = async () => {
    if (!newKnowledge.title || !newKnowledge.content) return;
    try {
      await apiCall({ action: 'save_knowledge', messages: newKnowledge });
      setNewKnowledge({ title: '', content: '', category: 'general' });
      loadKnowledge();
      toast({ title: '📚 Added!', description: 'Knowledge added to the brain' });
    } catch (e: any) {
      toast({ title: 'Failed', description: e.message, variant: 'destructive' });
    }
  };

  const deleteKnowledge = async (id: string) => {
    try {
      await apiCall({ action: 'delete_knowledge', conversationId: id });
      loadKnowledge();
    } catch { /* silent */ }
  };

  const addMemory = async () => {
    if (!newMemory.trim()) return;
    try {
      await apiCall({ action: 'save_memory', messages: { memory: newMemory, category: 'fact', importance: 5 } });
      setNewMemory('');
      loadMemories();
      toast({ title: '🧠 Remembered!', description: 'Memory saved' });
    } catch (e: any) {
      toast({ title: 'Failed', description: e.message, variant: 'destructive' });
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      await apiCall({ action: 'delete_memory', conversationId: id });
      loadMemories();
    } catch { /* silent */ }
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
      const resp = await fetch(API_URL, {
        method: 'POST', headers: AUTH_HEADERS,
        body: JSON.stringify({ skill: activeSkill.id, messages: [...messages, userMsg], includeBusinessData }),
      });

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
      toast({ title: 'AI Error', description: err.message, variant: 'destructive' });
      if (!assistantSoFar) setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const copyLastResponse = () => {
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
    if (lastAssistant) {
      navigator.clipboard.writeText(lastAssistant.content);
      toast({ title: '📋 Copied!' });
    }
  };

  const categoryColors: Record<string, string> = {
    content: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    general: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    marketing: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            AI Command Center
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">GPT-5 Powered</Badge>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Memory: {memories.length} facts • Brain: {knowledge.length} docs • History: {conversations.length} convos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={includeBusinessData ? 'default' : 'outline'} size="sm"
            onClick={() => setIncludeBusinessData(!includeBusinessData)}>
            📊 Live Data {includeBusinessData ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Side Panel */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-3">
              <Tabs value={sidePanel} onValueChange={(v) => setSidePanel(v as any)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="skills"><Sparkles className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="history"><History className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="brain"><BookOpen className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="memory"><Brain className="h-4 w-4" /></TabsTrigger>
                </TabsList>

                <TabsContent value="skills" className="mt-3">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {SKILLS.map((skill) => {
                        const Icon = skill.icon;
                        const isActive = activeSkill.id === skill.id;
                        return (
                          <button key={skill.id} onClick={() => handleSkillChange(skill)}
                            className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                              isActive ? 'border-primary bg-primary/5 shadow-sm' : 'border-transparent hover:bg-accent/50'}`}>
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className="text-sm font-medium">{skill.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 ml-6">{skill.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="history" className="mt-3">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {conversations.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No saved conversations yet</p>
                      ) : conversations.map((convo) => (
                        <button key={convo.id} onClick={() => loadConversation(convo)}
                          className="w-full p-2.5 rounded-lg border border-transparent hover:bg-accent/50 text-left transition-all">
                          <div className="flex items-center gap-2">
                            {convo.is_pinned && <Pin className="h-3 w-3 text-primary" />}
                            <span className="text-sm font-medium truncate">{convo.title || 'Untitled'}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px]">{convo.skill}</Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(convo.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="brain" className="mt-3">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Input placeholder="Title" value={newKnowledge.title}
                          onChange={(e) => setNewKnowledge(p => ({ ...p, title: e.target.value }))} className="text-sm" />
                        <Textarea placeholder="Content (business info, processes, preferences...)"
                          value={newKnowledge.content} rows={3}
                          onChange={(e) => setNewKnowledge(p => ({ ...p, content: e.target.value }))} className="text-sm" />
                        <Select value={newKnowledge.category} onValueChange={(v) => setNewKnowledge(p => ({ ...p, category: v }))}>
                          <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="process">Process</SelectItem>
                            <SelectItem value="pricing">Pricing</SelectItem>
                            <SelectItem value="customer">Customer Info</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={addKnowledge} size="sm" className="w-full">
                          <Plus className="h-3 w-3 mr-1" /> Add to Brain
                        </Button>
                      </div>
                      <div className="border-t pt-2 space-y-2">
                        {knowledge.map((k) => (
                          <div key={k.id} className="p-2 rounded-lg bg-accent/30 group">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-sm font-medium">{k.title}</span>
                                <Badge variant="outline" className="text-[10px] ml-2">{k.category}</Badge>
                              </div>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                onClick={() => deleteKnowledge(k.id)}>
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{k.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="memory" className="mt-3">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input placeholder="Add a fact for AI to remember..." value={newMemory}
                          onChange={(e) => setNewMemory(e.target.value)} className="text-sm"
                          onKeyDown={(e) => { if (e.key === 'Enter') addMemory(); }} />
                        <Button onClick={addMemory} size="sm"><Plus className="h-4 w-4" /></Button>
                      </div>
                      <div className="space-y-1.5">
                        {memories.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">No memories yet. Add facts about your business!</p>
                        ) : memories.map((m) => (
                          <div key={m.id} className="flex items-start gap-2 p-2 rounded-lg bg-accent/30 group">
                            <Brain className="h-3 w-3 mt-1 text-primary shrink-0" />
                            <p className="text-xs flex-1">{m.memory}</p>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-5 w-5 p-0 shrink-0"
                              onClick={() => deleteMemory(m.id)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <activeSkill.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{activeSkill.name}</CardTitle>
                    <CardDescription className="text-xs">{activeSkill.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {messages.length > 0 && (
                    <>
                      <Button variant="outline" size="sm" onClick={saveConversation}>
                        <Save className="h-3 w-3 mr-1" /> Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyLastResponse}>
                        <Copy className="h-3 w-3 mr-1" /> Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setMessages([]); setCurrentConvoId(null); }}>
                        <RotateCcw className="h-3 w-3 mr-1" /> New
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScrollArea className="h-[420px] rounded-lg border bg-muted/10 p-4" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-center">
                    <div>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                        <Zap className="h-8 w-8 text-purple-500/50" />
                      </div>
                      <p className="text-lg font-semibold">GPT-5 Ready</p>
                      <p className="text-sm max-w-md mt-1">
                        {activeSkill.placeholder}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                        <Badge variant="outline" className="text-xs">🧠 {memories.length} memories loaded</Badge>
                        <Badge variant="outline" className="text-xs">📚 {knowledge.length} docs in brain</Badge>
                        {includeBusinessData && <Badge variant="outline" className="text-xs">📊 Live data active</Badge>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-card border shadow-sm'
                        }`}>
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
                        <div className="bg-card border shadow-sm rounded-2xl px-4 py-3 flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                          <span className="text-xs text-muted-foreground">GPT-5 thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              <div className="flex gap-2">
                <Textarea value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder={activeSkill.placeholder}
                  className="min-h-[70px] resize-none"
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
                <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="lg"
                  className="h-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
