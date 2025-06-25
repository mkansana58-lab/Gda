
'use client';

import { useUser } from '@/context/user-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User as UserIcon } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'नाम कम से कम 2 अक्षरों का होना चाहिए।' }),
  mobile: z.string().regex(/^\d{10}$/, { message: 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' }),
  email: z.string().email({ message: 'कृपया एक वैध ईमेल पता दर्ज करें।' }),
  village: z.string().min(3, { message: 'गाँव/शहर का नाम आवश्यक है।' }),
  district: z.string().min(3, { message: 'ज़िले का नाम आवश्यक है।' }),
  pincode: z.string().regex(/^\d{6}$/, { message: 'कृपया एक वैध 6-अंकीय पिनकोड दर्ज करें।' }),
  state: z.string().min(2, { message: 'राज्य का नाम आवश्यक है।' }),
  class: z.string().min(1, { message: 'कृपया अपनी कक्षा दर्ज करें।' }),
  exam: z.string().min(1, { message: 'कृपया एक परीक्षा चुनें।' }),
  profilePhoto: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const defaultFormValues: ProfileFormValues = {
  name: '', mobile: '', email: '', village: '', district: '', pincode: '', state: '', class: '', exam: '',
};

export function ProfileEditDialog() {
  const { user, updateUser, isProfileDialogOpen, setProfileDialogOpen } = useUser();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: user || defaultFormValues,
  });

  useEffect(() => {
    if (isProfileDialogOpen) {
        if (user) {
          form.reset({ ...user, profilePhoto: undefined });
          setPhotoPreview(user.profilePhotoUrl || null);
        } else {
          form.reset(defaultFormValues);
          setPhotoPreview(null);
        }
    }
  }, [user, isProfileDialogOpen, form]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    const { profilePhoto, ...userData } = values;
    let updatedUserData = { ...user, ...userData };

    if (photoPreview && photoPreview !== user?.profilePhotoUrl) {
       Object.assign(updatedUserData, { profilePhotoUrl: photoPreview });
    }

    updateUser(updatedUserData);
    toast({ title: 'प्रोफ़ाइल अपडेट की गई', description: 'आपकी जानकारी सफलतापूर्वक सहेज ली गई है।' });
    setProfileDialogOpen(false);
  };

  const photoInputRef = form.register('profilePhoto');

  return (
    <Dialog open={isProfileDialogOpen} onOpenChange={setProfileDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>प्रोफ़ाइल संपादित करें</DialogTitle>
          <DialogDescription>अपनी व्यक्तिगत जानकारी में बदलाव करें।</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={photoPreview || undefined} alt={user?.name} />
                  <AvatarFallback><UserIcon className="w-12 h-12" /></AvatarFallback>
                </Avatar>
                 <FormField control={form.control} name="profilePhoto" render={() => (
                    <FormItem>
                        <FormLabel htmlFor="photo-upload" className="cursor-pointer text-sm text-primary hover:underline">
                            फोटो बदलें
                        </FormLabel>
                        <FormControl>
                            <Input 
                              id="photo-upload"
                              type="file"
                              accept="image/*" 
                              className="hidden"
                              {...photoInputRef}
                              onChange={handlePhotoChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
             <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>नाम</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="mobile" render={({ field }) => (
                    <FormItem><FormLabel>मोबाइल</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>ईमेल</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
             <FormField control={form.control} name="village" render={({ field }) => (
                <FormItem><FormLabel>गाँव / कस्बा</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="district" render={({ field }) => (
                    <FormItem><FormLabel>ज़िला</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="pincode" render={({ field }) => (
                    <FormItem><FormLabel>पिनकोड</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            <FormField control={form.control} name="state" render={({ field }) => (
                <FormItem><FormLabel>राज्य</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="class" render={({ field }) => (
                    <FormItem><FormLabel>कक्षा</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
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
                )}/>
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setProfileDialogOpen(false)}>रद्द करें</Button>
                <Button type="submit">बदलाव सहेजें</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
