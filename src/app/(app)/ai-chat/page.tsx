'use client';

import { useState, useRef, useEffect } from 'react';
import { generalChat } from '@/ai/flows/general-chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, User, Sparkles, Paperclip, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/user-context';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'model';
  content: string;
  imageUrl?: string;
};

const initialMessage: Message = {
  role: 'model',
  content: 'नमस्ते! मैं गो स्वामी डिफेंस एकेडमी का AI सहायक हूँ। अब आप मुझसे छवियों के बारे में भी सवाल पूछ सकते हैं। मैं आपकी क्या मदद कर सकता हूँ?',
};

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const { toast } = useToast();

  const displayedMessages = [initialMessage, ...messages];

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [displayedMessages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
            variant: 'destructive',
            title: 'छवि बहुत बड़ी है',
            description: 'कृपया 4MB से छोटी छवि चुनें।',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(URL.createObjectURL(file));
        setImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageDataUri(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!input.trim() && !imageDataUri) || isLoading) return;

    const userMessageForUi: Message = { 
        role: 'user', 
        content: input, 
        imageUrl: imagePreview || undefined 
    };

    const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));
    
    // Create a new array for the API call to ensure it's not referencing the state array
    const messagesForApi = [...historyForApi];

    // Add the new user message to the API array
    const userMessageForApi = { role: 'user' as const, content: input };
    messagesForApi.push(userMessageForApi);
    
    const dataUriToSend = imageDataUri;
    
    setMessages(prev => [...prev, userMessageForUi]);
    setInput('');
    removeImage();
    setIsLoading(true);

    try {
      const response = await generalChat({ 
          messages: messagesForApi,
          photoDataUri: dataUriToSend || undefined
      });
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
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">AI सहायक</h1>
        <p className="text-muted-foreground">
          अपने सवाल पूछें, छवियां अपलोड करें और तुरंत जवाब पाएं।
        </p>
      </div>

      <Card className="flex flex-col flex-grow">
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {displayedMessages.map((message, index) => (
              <div
                key={index}
                className={cn('flex items-start gap-3', {
                  'justify-end flex-row-reverse': message.role === 'user',
                })}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.role === 'user' ? user?.profilePhotoUrl : undefined} />
                  <AvatarFallback>
                    {message.role === 'user' ? <User /> : <Sparkles />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'max-w-[85%] rounded-lg p-3 text-sm shadow',
                    {
                      'bg-primary text-primary-foreground': message.role === 'user',
                      'bg-muted': message.role === 'model',
                    }
                  )}
                >
                  {message.imageUrl && (
                    <div className="mb-2">
                        <Image src={message.imageUrl} alt="User upload" width={250} height={250} className="rounded-lg max-w-full h-auto" />
                    </div>
                  )}
                  {message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback><Sparkles /></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="w-5 h-5 animate-spin"/>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-background">
            {imagePreview && (
                <div className="relative w-24 h-24 mb-2">
                    <Image src={imagePreview} alt="Preview" fill style={{objectFit: 'cover'}} className="rounded-md" />
                    <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full z-10" onClick={removeImage}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-start gap-2">
                <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading || !!imagePreview}>
                    <Paperclip className="w-4 h-4" />
                    <span className="sr-only">छवि संलग्न करें</span>
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="छवि के साथ या उसके बिना अपना सवाल यहाँ लिखें..."
                    className="flex-grow resize-none max-h-40"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e as any);
                        }
                    }}
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imageDataUri)}>
                    <Send className="w-4 h-4" />
                    <span className="sr-only">भेजें</span>
                </Button>
            </form>
        </div>
      </Card>
    </div>
  );
}
