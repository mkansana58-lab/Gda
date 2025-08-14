
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, { message: 'नाम कम से कम 2 अक्षरों का होना चाहिए।' }),
  mobile: z.string().regex(/^\d{10}$/, { message: 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' }),
  email: z.string().email({ message: 'कृपया एक वैध ईमेल पता दर्ज करें।' }),
  village: z.string().min(3, { message: 'गाँव/शहर का नाम आवश्यक है।' }),
  district: z.string().min(3, { message: 'ज़िले का नाम आवश्यक है।' }),
  pincode: z.string().regex(/^\d{6}$/, { message: 'कृपया एक वैध 6-अंकीय पिनकोड दर्ज करें।' }),
  state: z.string().min(2, { message: 'राज्य का नाम आवश्यक है।' }),
  class: z.string().min(1, { message: 'कृपया अपनी कक्षा दर्ज करें।' }),
  exam: z.string().min(1, { message: 'कृपया एक परीक्षा चुनें।' }),
  profilePhoto: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `अधिकतम फ़ाइल आकार 1MB है।`)
    .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), '.jpg, .png और .webp फ़ाइलें ही स्वीकार की जाती हैं।'),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = getAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '', mobile: '', email: '', village: '', district: '', pincode: '', state: '', class: '', exam: '',
    },
  });

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Step 1: Sign in the user anonymously with Firebase Auth
      const userCredential = await signInAnonymously(auth);
      const firebaseUser = userCredential.user;

      // Step 2: Handle photo upload if present
      let profilePhotoUrl = '';
      const photoFile = values.profilePhoto?.[0];
      if (photoFile) {
        try {
            profilePhotoUrl = await readFileAsDataURL(photoFile);
        } catch (photoError) {
             toast({
                variant: 'destructive',
                title: 'फोटो अपलोड विफल',
                description: 'चयनित फोटो को पढ़ा नहीं जा सका।',
            });
        }
      }

      // Step 3: Prepare user data for Firestore
      const { profilePhoto, ...userData } = values;
      const userForDb = { 
          ...userData, 
          profilePhotoUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
      };
      
      // Step 4: Save user data to Firestore with UID as document ID
      await setDoc(doc(db, "students", firebaseUser.uid), userForDb);
      
      // Step 5: Save user data to localStorage for quick access
      localStorage.setItem('user', JSON.stringify({ ...userData, profilePhotoUrl }));

      toast({
        title: 'लॉगिन सफल',
        description: `स्वागत है, ${values.name}!`,
      });
      router.push('/dashboard');

    } catch (error) {
      console.error("Error during login or saving data: ", error);
      toast({
        variant: 'destructive',
        title: 'लॉगिन विफल',
        description: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const profilePhotoRef = form.register('profilePhoto');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>नाम</FormLabel>
              <FormControl><Input placeholder="अपना नाम दर्ज करें" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="mobile" render={({ field }) => (
                <FormItem><FormLabel>मोबाइल</FormLabel><FormControl><Input type="tel" placeholder="10-अंकीय मोबाइल" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>ईमेल</FormLabel><FormControl><Input type="email" placeholder="आपका ईमेल" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
        </div>
        
        <FormField control={form.control} name="village" render={({ field }) => (
            <FormItem><FormLabel>गाँव / कस्बा</FormLabel><FormControl><Input placeholder="आपके गाँव/कस्बे का नाम" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="district" render={({ field }) => (
                <FormItem><FormLabel>ज़िला</FormLabel><FormControl><Input placeholder="आपके ज़िले का नाम" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="pincode" render={({ field }) => (
                <FormItem><FormLabel>पिनकोड</FormLabel><FormControl><Input type="tel" placeholder="आपका पिनकोड" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        <FormField control={form.control} name="state" render={({ field }) => (
            <FormItem><FormLabel>राज्य</FormLabel><FormControl><Input placeholder="आपके राज्य का नाम" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="class" render={({ field }) => (
                <FormItem><FormLabel>कक्षा</FormLabel><FormControl><Input placeholder="जैसे 10वीं, NDA" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
             <FormField control={form.control} name="exam" render={({ field }) => (
                <FormItem><FormLabel>परीक्षा</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="एक परीक्षा चुनें" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Sainik School">सैनिक स्कूल</SelectItem>
                            <SelectItem value="Military School">मिलिट्री स्कूल</SelectItem>
                            <SelectItem value="RMS">आरएमएस</SelectItem>
                            <SelectItem value="RIMC">आरआईएमसी</SelectItem>
                            <SelectItem value="JNV">जेएनवी</SelectItem>
                            <SelectItem value="NDA">NDA</SelectItem>
                            <SelectItem value="CDS">CDS</SelectItem>
                            <SelectItem value="Other">अन्य</SelectItem>
                        </SelectContent>
                    </Select>
                <FormMessage /></FormItem>
              )}
            />
        </div>
        
        <FormField control={form.control} name="profilePhoto" render={() => (
            <FormItem><FormLabel>प्रोफ़ाइल फ़ोटो (वैकल्पिक)</FormLabel><FormControl><Input type="file" accept="image/*" {...profilePhotoRef} /></FormControl><FormMessage /></FormItem>
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
