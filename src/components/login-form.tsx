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
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  mobile: z.string().regex(/^\d{10}$/, { message: 'Please enter a valid 10-digit mobile number.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
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
          title: 'Login Successful',
          description: `Welcome, ${values.name}!`,
        });
        router.push('/dashboard');
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'An error occurred. Please try again.',
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
          title: 'Photo Upload Failed',
          description: 'Could not read the selected photo. Please try again or continue without one.',
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
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
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Enter your mobile number" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} />
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
              <FormLabel>Profile Photo</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" {...profilePhotoRef} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </form>
    </Form>
  );
}
