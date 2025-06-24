import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck } from "lucide-react";

interface CertificateProps {
  data: {
    name: string;
    class: string;
    school: string;
    village: string;
    district: string;
  };
}

export function Certificate({ data }: CertificateProps) {
  const currentDate = new Date().toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="w-full max-w-2xl border-2 border-primary/50 shadow-xl bg-gradient-to-br from-background to-secondary/30">
        <CardContent className="p-8 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-5"></div>
            <div className="text-center mb-6">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-2">
                    <ShieldCheck className="h-16 w-16 text-primary" />
                </div>
                <h1 className="font-headline text-4xl font-bold text-primary">गो स्वामी डिफेंस एकेडमी</h1>
                <p className="text-muted-foreground font-semibold">"राष्ट्र प्रथम, शिक्षा सर्वोपरि"</p>
            </div>
            
            <div className="text-center my-8">
                <h2 className="text-3xl font-headline font-semibold tracking-wider uppercase">छात्रवृत्ति आवेदन का प्रमाण पत्र</h2>
                <p className="mt-2 text-muted-foreground">यह प्रमाण पत्र दिया जाता है</p>
                <p className="text-4xl font-headline font-bold text-primary my-4">{data.name}</p>
            </div>

            <p className="text-center text-lg text-foreground/80 leading-relaxed">
                **छात्रवृत्ति** योजना के लिए सफलतापूर्वक आवेदन करने हेतु।
                हम **{data.school}** के कक्षा **{data.class}** से आपके पंजीकरण को स्वीकार करते हैं।
                आप **{data.village}, {data.district}** के निवासी हैं।
            </p>

            <div className="mt-12 flex justify-between items-end">
                <div className="text-center">
                    <p className="font-semibold text-lg">{currentDate}</p>
                    <Separator className="my-1 bg-foreground/50"/>
                    <p className="text-sm text-muted-foreground">दिनांक</p>
                </div>
                <div className="text-center">
                    <p className="font-headline font-bold text-2xl italic text-primary/80">गो स्वामी</p>
                    <Separator className="my-1 bg-foreground/50"/>
                    <p className="text-sm text-muted-foreground">निदेशक के हस्ताक्षर</p>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
