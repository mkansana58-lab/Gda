import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Video, Download } from "lucide-react";
import Link from 'next/link';

const learningSections = [
    {
        title: "Live Classes",
        description: "Join our interactive live sessions with expert instructors.",
        icon: Video,
        actionText: "Join Now",
        href: "#"
    },
    {
        title: "Recorded Videos",
        description: "Catch up on missed classes or revise topics at your own pace.",
        icon: Youtube,
        actionText: "Watch Videos",
        href: "#"
    },
    {
        title: "Downloads",
        description: "Get access to study materials, notes, and practice papers.",
        icon: Download,
        actionText: "Access Files",
        href: "#"
    },
]

export default function LearningHubPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Learning Hub</h1>
                <p className="text-muted-foreground">Your one-stop destination for all learning resources.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {learningSections.map(section => (
                    <Card key={section.title} className="flex flex-col">
                        <CardHeader className="flex-row items-center gap-4">
                           <div className="p-3 bg-primary/10 rounded-lg">
                                <section.icon className="w-8 h-8 text-primary"/>
                           </div>
                           <div>
                                <CardTitle className="font-headline">{section.title}</CardTitle>
                                <CardDescription>{section.description}</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            {/* Placeholder content can go here */}
                        </CardContent>
                        <CardFooter>
                           <Button className="w-full" asChild>
                                <Link href={section.href}>{section.actionText}</Link>
                           </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Card className="mt-4">
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Explore More on YouTube</CardTitle>
                        <CardDescription>Check out our full library of video content on our official channel.</CardDescription>
                    </div>
                    <Button asChild>
                        <a href="https://youtube.com/@mohitkansana-s1h?si=vXGmKt03HwtcG55s" target="_blank" rel="noopener noreferrer">
                            <Youtube className="mr-2 h-4 w-4" />
                            View All Classes
                        </a>
                    </a >
                </Button>
                </CardHeader>
            </Card>
        </div>
    );
}
