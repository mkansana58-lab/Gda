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
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LiveClass {
    id: string; // Firestore document ID
    title: string;
    description: string;
    platform: string;
    link: string;
    createdAt?: any;
}

interface AdminNotification {
    id: string;
    title: string;
    description: string;
    icon: 'Bell';
    createdAt?: any;
}

export default function AdminDashboardPage() {
    const { toast } = useToast();

    // Notification State
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [notifTitle, setNotifTitle] = useState('');
    const [notifDesc, setNotifDesc] = useState('');

    // Live Class State
    const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
    const [classTitle, setClassTitle] = useState('');
    const [classDesc, setClassDesc] = useState('');
    const [classPlatform, setClassPlatform] = useState('');
    const [classLink, setClassLink] = useState('');

    useEffect(() => {
        const liveClassesQuery = query(collection(db, "liveClasses"), orderBy("createdAt", "desc"));
        const notificationsQuery = query(collection(db, "notifications"), orderBy("createdAt", "desc"));

        const liveClassesUnsubscribe = onSnapshot(liveClassesQuery, (querySnapshot) => {
            const classesData: LiveClass[] = [];
            querySnapshot.forEach((doc) => {
                classesData.push({ id: doc.id, ...doc.data() } as LiveClass);
            });
            setLiveClasses(classesData);
        }, (error) => {
            console.error("Error fetching live classes:", error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'लाइव क्लास लोड करने में विफल।' });
        });

        const notificationsUnsubscribe = onSnapshot(notificationsQuery, (querySnapshot) => {
            const notifsData: AdminNotification[] = [];
            querySnapshot.forEach((doc) => {
                notifsData.push({ id: doc.id, ...doc.data() } as AdminNotification);
            });
            setNotifications(notifsData);
        }, (error) => {
            console.error("Error fetching notifications:", error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'सूचनाएं लोड करने में विफल।' });
        });

        return () => {
            liveClassesUnsubscribe();
            notificationsUnsubscribe();
        };
    }, [toast]);

    const handleAddNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!notifTitle || !notifDesc) {
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'शीर्षक और विवरण दोनों आवश्यक हैं।' });
            return;
        }

        try {
            await addDoc(collection(db, 'notifications'), {
                title: notifTitle,
                description: notifDesc,
                icon: 'Bell',
                createdAt: serverTimestamp(),
            });
            
            toast({ title: 'सूचना भेजी गई!', description: 'सभी उपयोगकर्ताओं को नई सूचना प्राप्त होगी।' });
            setNotifTitle('');
            setNotifDesc('');
        } catch (error) {
            console.error("Error adding notification: ", error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'सूचना भेजने में विफल। कृपया पुनः प्रयास करें।' });
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'notifications', id));
            toast({ title: 'सूचना हटाई गई!', variant: 'destructive' });
        } catch (error) {
            console.error("Error deleting notification: ", error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'सूचना हटाने में विफल। कृपया पुनः प्रयास करें।' });
        }
    };

    const handleAddLiveClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!classTitle || !classPlatform || !classLink) {
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'शीर्षक, प्लेटफॉर्म और लिंक आवश्यक हैं।' });
            return;
        }

        try {
            await addDoc(collection(db, 'liveClasses'), {
                title: classTitle,
                description: classDesc,
                platform: classPlatform,
                link: classLink,
                createdAt: serverTimestamp(),
            });
            
            toast({ title: 'लाइव क्लास जोड़ी गई!', description: 'नई क्लास अब सभी को दिखेगी।' });
            setClassTitle('');
            setClassDesc('');
            setClassPlatform('');
            setClassLink('');
        } catch (error) {
            console.error("Error adding document: ", error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'क्लास जोड़ने में विफल। कृपया पुनः प्रयास करें।' });
        }
    };

    const handleDeleteLiveClass = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'liveClasses', id));
            toast({ title: 'लाइव क्लास हटाई गई!', variant: 'destructive' });
        } catch (error) {
            console.error("Error deleting document: ", error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'क्लास हटाने में विफल। कृपया पुनः प्रयास करें।' });
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">एडमिन डैशबोर्ड</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manage Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bell/> सूचनाएं भेजें</CardTitle>
                        <CardDescription>सभी ऐप उपयोगकर्ताओं को एक सूचना भेजें।</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleAddNotification}>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Display Notifications List */}
                <Card>
                    <CardHeader><CardTitle>वर्तमान सूचनाएं</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {notifications.length > 0 ? notifications.map(n => (
                            <div key={n.id} className="flex items-center justify-between p-2 rounded-md bg-secondary gap-2">
                                <div className='flex-1 min-w-0'>
                                    <p className="font-semibold break-words">{n.title}</p>
                                    <p className="text-xs text-muted-foreground break-words">{n.description}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteNotification(n.id)} className="flex-shrink-0">
                                    <Trash2 className="w-4 h-4 text-destructive"/>
                                </Button>
                            </div>
                        )) : <p className="text-sm text-muted-foreground">कोई सूचना नहीं है।</p>}
                    </CardContent>
                </Card>

                {/* Display Live Classes List */}
                <Card>
                    <CardHeader><CardTitle>वर्तमान लाइव कक्षाएं</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {liveClasses.length > 0 ? liveClasses.map(c => (
                            <div key={c.id} className="flex items-center justify-between p-2 rounded-md bg-secondary gap-2">
                                <div className='flex-1 min-w-0'>
                                    <p className="font-semibold break-words">{c.title} <span className="text-xs text-muted-foreground">({c.platform})</span></p>
                                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{c.link}</a>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteLiveClass(c.id)} className="flex-shrink-0">
                                    <Trash2 className="w-4 h-4 text-destructive"/>
                                </Button>
                            </div>
                        )) : <p className="text-sm text-muted-foreground">कोई लाइव क्लास नहीं है।</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
