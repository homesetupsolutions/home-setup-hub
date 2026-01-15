import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const QUICK_REPLIES = [
  "I'd like to book a service",
  "What services do you offer?",
  "What are your prices?",
  "I need to reschedule",
  "Speak with a person"
];

const BOT_RESPONSES: Record<string, string> = {
  "book": "Great! I can help you book a service. Click the button below to schedule an appointment, or call us at 1-833-230-2933.",
  "services": "We offer TV mounting, smart home setup, network installation, furniture assembly, and more! Would you like to book a service?",
  "prices": "Our pricing varies by service. Call for a quote at 1-833-230-2933 or text us at 1-587-604-5127.",
  "reschedule": "No problem! Please call us at 1-833-230-2933 or text 1-587-604-5127 to reschedule your appointment.",
  "person": "Of course! You can reach us at:\n📞 Call: 1-833-230-2933\n💬 Text: 1-587-604-5127\n\nWe're available Mon-Sat, 9AM-9PM.",
  "default": "Thanks for reaching out! For the fastest response, please call us at 1-833-230-2933 or text 1-587-604-5127. How can I help you today?"
};

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! 👋 Welcome to Home Setup Solutions. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
      return BOT_RESPONSES.book;
    }
    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('what do you do')) {
      return BOT_RESPONSES.services;
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      return BOT_RESPONSES.prices;
    }
    if (lowerMessage.includes('reschedule') || lowerMessage.includes('cancel') || lowerMessage.includes('change')) {
      return BOT_RESPONSES.reschedule;
    }
    if (lowerMessage.includes('person') || lowerMessage.includes('human') || lowerMessage.includes('speak') || lowerMessage.includes('talk')) {
      return BOT_RESPONSES.person;
    }
    return BOT_RESPONSES.default;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: getBotResponse(content),
      sender: 'bot',
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botResponse]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)]"
          >
            <Card className="shadow-2xl border-primary/20">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-lg py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Home Setup Solutions</CardTitle>
                      <p className="text-xs opacity-80">We typically reply instantly</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {QUICK_REPLIES.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => sendMessage(reply)}
                        className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Options */}
                <div className="px-4 pb-3 pt-1">
                  <div className="flex gap-2">
                    <a href="tel:18332302933" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Phone className="w-3 h-3" />
                        Call
                      </Button>
                    </a>
                    <a href="sms:15876045127" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <MessageSquare className="w-3 h-3" />
                        Text
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
