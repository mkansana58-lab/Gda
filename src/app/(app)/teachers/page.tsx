import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const teachers = [
  {
    name: 'Mr. Lokesh Goswami',
    subject: 'Mathematics & Founder',
    experience: 'A visionary educator with over a decade of experience, Mr. Goswami founded the academy to provide top-tier defence coaching.',
    photo: 'https://placehold.co/100x100.png',
    hint: 'male teacher'
  },
  {
    name: 'Mr. Dinesh Tyagi (D.C. Tyagi)',
    subject: 'English',
    experience: 'With profound knowledge and innovative teaching methods, Mr. Tyagi makes learning English grammar and literature an engaging experience.',
    photo: 'https://placehold.co/100x100.png',
    hint: 'man portrait'
  },
]

export default function TeachersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Our Faculty</h1>
        <p className="text-muted-foreground">Meet the experts behind our success.</p>
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
