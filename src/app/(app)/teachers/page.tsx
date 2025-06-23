import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const teachers = [
  {
    name: 'श्री लोकेश गोस्वामी',
    subject: 'गणित और संस्थापक',
    experience: 'एक दशक से अधिक के अनुभव के साथ एक दूरदर्शी शिक्षक, श्री गोस्वामी ने शीर्ष स्तरीय रक्षा कोचिंग प्रदान करने के लिए अकादमी की स्थापना की।',
    photo: 'https://placehold.co/100x100.png',
    hint: 'male founder'
  },
  {
    name: 'श्री दिनेश त्यागी (डी.सी. त्यागी)',
    subject: 'अंग्रेजी',
    experience: 'गहन ज्ञान और नवीन शिक्षण विधियों के साथ, श्री त्यागी अंग्रेजी व्याकरण और साहित्य सीखने को एक आकर्षक अनुभव बनाते हैं।',
    photo: 'https://placehold.co/100x100.png',
    hint: 'man portrait'
  },
]

export default function TeachersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">हमारे शिक्षक</h1>
        <p className="text-muted-foreground">हमारी सफलता के पीछे के विशेषज्ञों से मिलें।</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {teachers.map((teacher) => (
          <Card key={teacher.name} className="flex flex-col">
             <CardContent className="pt-6 flex flex-col items-center text-center flex-grow">
                <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20">
                    <AvatarImage src={teacher.photo} alt={teacher.name} data-ai-hint={teacher.hint}/>
                    <AvatarFallback>{teacher.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold font-headline">{teacher.name}</h3>
                <p className="font-semibold text-primary">{teacher.subject}</p>
                <p className="text-sm text-muted-foreground mt-2 flex-grow">{teacher.experience}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
