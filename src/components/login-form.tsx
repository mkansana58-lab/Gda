'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'नाम कम से कम 2 अक्षरों का होना चाहिए।' }),
  mobile: z.string().regex(/^\d{10}$/, { message: 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' }),
  email: z.string().email({ message: 'कृपया एक वैध ईमेल पता दर्ज करें।' }),
  address: z.string().min(5, { message: 'पता कम से कम 5 अक्षरों का होना चाहिए।' }),
  profilePhoto: z.any().optional(),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      mobile: '',
      email: '',
      address: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const handleLogin = (profilePhotoUrl: string) => {
      try {
        // Create user object without the file list
        const { profilePhoto, ...userData } = values;
        const user = { ...userData, profilePhotoUrl };
        localStorage.setItem('user', JSON.stringify(user));
        toast({
          title: 'लॉगिन सफल',
          description: `स्वागत है, ${values.name}!`,
        });
        router.push('/dashboard');
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'लॉगिन विफल',
          description: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
        });
      } finally {
        setIsLoading(false);
      }
    };

    const photoFile = values.profilePhoto?.[0];

    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleLogin(reader.result as string);
      };
      reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'फोटो अपलोड विफल',
          description: 'चयनित फोटो को पढ़ा नहीं जा सका। कृपया पुनः प्रयास करें या बिना फोटो के जारी रखें।',
        });
        handleLogin('https://placehold.co/100x100.png');
      };
      reader.readAsDataURL(photoFile);
    } else {
      setTimeout(() => {
        handleLogin('https://placehold.co/100x100.png');
      }, 500);
    }
  }

  // Use a different name for the form field to avoid conflict with the native `name` property
  const { register, ...restOfForm } = form;
  const profilePhotoRef = register('profilePhoto');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>नाम</FormLabel>
              <FormControl>
                <Input placeholder="अपना नाम दर्ज करें" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>मोबाइल नंबर</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="अपना मोबाइल नंबर दर्ज करें" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ईमेल</FormLabel>
              <FormControl>
                <Input type="email" placeholder="अपना ईमेल दर्ज करें" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>पता</FormLabel>
              <FormControl>
                <Input placeholder="अपना पता दर्ज करें" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profilePhoto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>प्रोफ़ाइल फ़ोटो</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" {...profilePhotoRef} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          लॉगिन करें
        </Button>
      </form>
    </Form>
  );
}
