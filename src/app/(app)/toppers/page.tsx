import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const toppers = [
  { name: 'Aarav Sharma', rank: 1, exam: 'RMS 2023', photo: 'https://placehold.co/100x100.png', hint: 'student portrait' },
  { name: 'Priya Singh', rank: 2, exam: 'RIMC 2023', photo: 'https://placehold.co/100x100.png', hint: 'student smiling' },
  { name: 'Rohan Verma', rank: 3, exam: 'Military School 2023', photo: 'https://placehold.co/100x100.png', hint: 'teenager portrait' },
]

export default function ToppersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Hall of Fame</h1>
        <p className="text-muted-foreground">Celebrating our top achievers.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {toppers.map((topper) => (
          <Card key={topper.name}>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20">
                <AvatarImage src={topper.photo} alt={topper.name} data-ai-hint={topper.hint} />
                <AvatarFallback>{topper.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold font-headline">{topper.name}</h3>
              <p className="text-muted-foreground">{topper.exam}</p>
              <p className="text-2xl font-bold text-primary mt-2">Rank #{topper.rank}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
