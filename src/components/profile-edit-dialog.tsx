'use client';

import { useUser } from '@/context/user-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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
});

export function ProfileEditDialog() {
  const { user, updateUser, isProfileDialogOpen, setProfileDialogOpen } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      mobile: user?.mobile || '',
      email: user?.email || '',
      village: user?.village || '',
      district: user?.district || '',
      pincode: user?.pincode || '',
      state: user?.state || '',
      class: user?.class || '',
      exam: user?.exam || '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset(user);
    }
  }, [user, form, isProfileDialogOpen]);

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    updateUser(values);
    toast({ title: 'प्रोफ़ाइल अपडेट की गई', description: 'आपकी जानकारी सफलतापूर्वक सहेज ली गई है।' });
    setProfileDialogOpen(false);
  };

  return (
    <Dialog open={isProfileDialogOpen} onOpenChange={setProfileDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>प्रोफ़ाइल संपादित करें</DialogTitle>
          <DialogDescription>अपनी व्यक्तिगत जानकारी में बदलाव करें।</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
