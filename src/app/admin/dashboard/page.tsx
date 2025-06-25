
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bell, BookOpen, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface LiveClass {
    id: number;
    title: string;
    description: string;
    platform: string;
    link: string;
}

export default function AdminDashboardPage() {
    const { toast } = useToast();

    // Notification State
    const [notifTitle, setNotifTitle] = useState('');
    const [notifDesc, setNotifDesc] = useState('');

    // Live Class State
    const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
    const [classTitle, setClassTitle] = useState('');
    const [classDesc, setClassDesc] = useState('');
    const [classPlatform, setClassPlatform] = useState('');
    const [classLink, setClassLink] = useState('');

    useEffect(() => {
        const storedClasses = localStorage.getItem('live-classes-list');
        if (storedClasses) {
            setLiveClasses(JSON.parse(storedClasses));
        }
    }, []);

    const handleSendNotification = (e: React.FormEvent) => {
        e.preventDefault();
        if (!notifTitle || !notifDesc) {
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'शीर्षक और विवरण दोनों आवश्यक हैं।' });
            return;
        }

        const globalNotificationsRaw = localStorage.getItem('global-notifications');
        const globalNotifications = globalNotificationsRaw ? JSON.parse(globalNotificationsRaw) : [];
        
        const newNotification = {
            id: `global-${Date.now()}`,
            icon: 'Bell' as const,
            title: notifTitle,
            description: notifDesc,
            read: false,
            timestamp: new Date().toISOString(),
        };

        const updatedNotifications = [newNotification, ...globalNotifications].slice(0, 50); // Keep last 50 global
        localStorage.setItem('global-notifications', JSON.stringify(updatedNotifications));
        
        toast({ title: 'सूचना भेजी गई!', description: 'सभी उपयोगकर्ताओं को नई सूचना प्राप्त होगी।' });
        setNotifTitle('');
        setNotifDesc('');
    };

    const handleAddLiveClass = (e: React.FormEvent) => {
        e.preventDefault();
        if (!classTitle || !classPlatform || !classLink) {
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'शीर्षक, प्लेटफॉर्म और लिंक आवश्यक हैं।' });
            return;
        }

        const newClass: LiveClass = {
            id: Date.now(),
            title: classTitle,
            description: classDesc,
            platform: classPlatform,
            link: classLink,
        };

        const updatedClasses = [...liveClasses, newClass];
        setLiveClasses(updatedClasses);
        localStorage.setItem('live-classes-list', JSON.stringify(updatedClasses));
        
        toast({ title: 'लाइव क्लास जोड़ी गई!', description: 'नई क्लास सूची में जोड़ दी गई है।' });
        setClassTitle('');
        setClassDesc('');
        setClassPlatform('');
        setClassLink('');
    };

    const handleDeleteLiveClass = (id: number) => {
        const updatedClasses = liveClasses.filter(c => c.id !== id);
        setLiveClasses(updatedClasses);
        localStorage.setItem('live-classes-list', JSON.stringify(updatedClasses));
        toast({ title: 'लाइव क्लास हटाई गई!', variant: 'destructive' });
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">एडमिन डैशबोर्ड</h1>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Manage Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bell/> सूचनाएं भेजें</CardTitle>
                        <CardDescription>सभी ऐप उपयोगकर्ताओं को एक सूचना भेजें।</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSendNotification}>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="notif-title">शीर्षक</Label>
                                <Input id="notif-title" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="सूचना का शीर्षक"/>
                            </div>
                            <div>
                                <Label htmlFor="notif-desc">विवरण</Label>
                                <Textarea id="notif-desc" value={notifDesc} onChange={e => setNotifDesc(e.target.value)} placeholder="सूचना का विवरण"/>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">सूचना भेजें</Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Manage Live Classes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BookOpen/> लाइव क्लास जोड़ें</CardTitle>
                        <CardDescription>लाइव क्लास पेज पर एक नया लिंक जोड़ें।</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleAddLiveClass}>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="class-title">शीर्षक</Label>
                                <Input id="class-title" value={classTitle} onChange={e => setClassTitle(e.target.value)} placeholder="जैसे, गणित कक्षा"/>
                            </div>
                            <div>
                                <Label htmlFor="class-desc">विवरण (वैकल्पिक)</Label>
                                <Input id="class-desc" value={classDesc} onChange={e => setClassDesc(e.target.value)} placeholder="क्लास के बारे में संक्षिप्त जानकारी"/>
                            </div>
                             <div>
                                <Label htmlFor="class-platform">प्लेटफॉर्म</Label>
                                <Select onValueChange={setClassPlatform} value={classPlatform}>
                                    <SelectTrigger id="class-platform"><SelectValue placeholder="एक प्लेटफॉर्म चुनें" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="YouTube">YouTube</SelectItem>
                                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                                        <SelectItem value="Telegram">Telegram</SelectItem>
                                        <SelectItem value="Google Site">Google Site</SelectItem>
                                        <SelectItem value="Other">अन्य</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="class-link">लिंक</Label>
                                <Input id="class-link" type="url" value={classLink} onChange={e => setClassLink(e.target.value)} placeholder="https://..."/>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">क्लास जोड़ें</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
            
            {/* Display Live Classes List */}
            {liveClasses.length > 0 && (
                <Card>
                    <CardHeader><CardTitle>वर्तमान लाइव कक्षाएं</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {liveClasses.map(c => (
                            <div key={c.id} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                                <div>
                                    <p className="font-semibold">{c.title} <span className="text-xs text-muted-foreground">({c.platform})</span></p>
                                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate">{c.link}</a>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteLiveClass(c.id)}>
                                    <Trash2 className="w-4 h-4 text-destructive"/>
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
