'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <div>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">हमसे संपर्क करें</h1>
        <p className="text-muted-foreground">
          कोई सवाल है? हमें हमारे पते पर आकर मिलें।
        </p>
      </div>

      <Card className="bg-card w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><MapPin/> हमारा पता</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">गो स्वामी डिफेंस एकेडमी, खड़गपुर, धौलपुर (राज.) - 328023</p>
          <div className="mt-4 h-64 w-full overflow-hidden rounded-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3574.8016147426177!2d77.88600181503387!3d26.36531548336683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3973a5629aaaaaab%3A0xe2f49a647867d312!2sGo%20Swami%20Defence%20Academy!5e0!3m2!1sen!2sin!4v1678886400000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
