'use client';

import { useState, useRef, useEffect } from 'react';
import { generalChat } from '@/ai/flows/general-chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/user-context';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'नमस्ते! मैं गो स्वामी डिफेंस एकेडमी का AI सहायक हूँ। मैं आपकी क्या मदद कर सकता हूँ?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generalChat({ messages: [...messages, userMessage] });
      const modelMessage: Message = { role: 'model', content: response.answer };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error with AI chat:', error);
      const errorMessage: Message = {
        role: 'model',
        content: 'माफ़ कीजिए, कुछ गड़बड़ हो गई है। कृपया थोड़ी देर बाद फिर प्रयास करें।',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight">AI सहायक</h1>
        <p className="text-muted-foreground">
          अपने सवाल पूछें और तुरंत जवाब पाएं।
        </p>
      </div>

      <Card className="flex flex-col flex-grow">
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn('flex items-start gap-3', {
                  'justify-end flex-row-reverse': message.role === 'user',
                })}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.role === 'user' ? user?.profilePhotoUrl : undefined} />
                  <AvatarFallback>
                    {message.role === 'user' ? <User /> : <Bot />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'max-w-md rounded-lg p-3 text-sm shadow',
                    {
                      'bg-primary text-primary-foreground': message.role === 'user',
                      'bg-muted': message.role === 'model',
                    }
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="w-5 h-5 animate-spin"/>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-background">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="अपना सवाल यहाँ लिखें..."
                    className="flex-grow resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e as any);
                        }
                    }}
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="w-4 h-4" />
                    <span className="sr-only">भेजें</span>
                </Button>
            </form>
        </div>
      </Card>
    </div>
  );
}
