
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bell, BookOpen, Trash2, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ScholarshipRegistrations } from '../components/ScholarshipRegistrations';

interface LiveClass {
    id: string;
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

interface Download {
    id: string;
    title: string;
    description: string;
    fileUrl: string;
    createdAt?: any;
}

export default function AdminDashboardPage() {
    const { toast } = useToast();

    // State for various sections
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [notifTitle, setNotifTitle] = useState('');
    const [notifDesc, setNotifDesc] = useState('');

    const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
    const [classTitle, setClassTitle] = useState('');
    const [classDesc, setClassDesc] = useState('');
    const [classPlatform, setClassPlatform] = useState('');
    const [classLink, setClassLink] = useState('');
    
    const [downloads, setDownloads] = useState<Download[]>([]);
    const [downloadTitle, setDownloadTitle] = useState('');
    const [downloadDesc, setDownloadDesc] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');

    useEffect(() => {
        const liveClassesQuery = query(collection(db, "liveClasses"), orderBy("createdAt", "desc"));
        const notificationsQuery = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
        const downloadsQuery = query(collection(db, "downloads"), orderBy("createdAt", "desc"));

        const unsubscribes = [
            onSnapshot(liveClassesQuery, (snapshot) => setLiveClasses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LiveClass))), (e) => console.error("Live Classes Error:", e)),
            onSnapshot(notificationsQuery, (snapshot) => setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminNotification))), (e) => console.error("Notifications Error:", e)),
            onSnapshot(downloadsQuery, (snapshot) => setDownloads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Download))), (e) => console.error("Downloads Error:", e)),
        ];

        return () => unsubscribes.forEach(unsub => unsub());
    }, []);

    const handleAddItem = async (collectionName: string, data: object, successMsg: string, errorMsg: string, resetter: () => void) => {
        try {
            await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() });
            toast({ title: successMsg });
            resetter();
        } catch (error) {
            console.error(`Error adding to ${collectionName}:`, error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: errorMsg });
        }
    };
    
    const handleDeleteItem = async (collectionName: string, id: string, successMsg: string, errorMsg: string) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
            toast({ title: successMsg, variant: 'destructive' });
        } catch (error) {
            console.error(`Error deleting from ${collectionName}:`, error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: errorMsg });
        }
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">एडमिन डैशबोर्ड</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Column 1: Notifications & Live Classes */}
                <div className="space-y-6 xl:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bell/> सूचनाएं मैनेज करें</CardTitle>
                            <CardDescription>सभी ऐप उपयोगकर्ताओं को एक सूचना भेजें।</CardDescription>
                        </CardHeader>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddItem('notifications', { title: notifTitle, description: notifDesc, icon: 'Bell' }, 'सूचना भेजी गई!', 'सूचना भेजने में विफल।', () => { setNotifTitle(''); setNotifDesc(''); }); }}>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="notif-title">शीर्षक</Label><Input id="notif-title" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} required/></div>
                                <div><Label htmlFor="notif-desc">विवरण</Label><Textarea id="notif-desc" value={notifDesc} onChange={e => setNotifDesc(e.target.value)} required/></div>
                            </CardContent>
                            <CardFooter><Button type="submit">सूचना भेजें</Button></CardFooter>
                        </form>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BookOpen/> लाइव क्लास मैनेज करें</CardTitle>
                        </CardHeader>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddItem('liveClasses', { title: classTitle, description: classDesc, platform: classPlatform, link: classLink }, 'लाइव क्लास जोड़ी गई!', 'क्लास जोड़ने में विफल।', () => { setClassTitle(''); setClassDesc(''); setClassPlatform(''); setClassLink(''); }); }}>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="class-title">शीर्षक</Label><Input id="class-title" value={classTitle} onChange={e => setClassTitle(e.target.value)} required /></div>
                                <div><Label htmlFor="class-desc">विवरण</Label><Input id="class-desc" value={classDesc} onChange={e => setClassDesc(e.target.value)} /></div>
                                <div><Label htmlFor="class-platform">प्लेटफॉर्म</Label><Select onValueChange={setClassPlatform} value={classPlatform} required><SelectTrigger id="class-platform"><SelectValue placeholder="एक प्लेटफॉर्म चुनें" /></SelectTrigger><SelectContent><SelectItem value="YouTube">YouTube</SelectItem><SelectItem value="WhatsApp">WhatsApp</SelectItem><SelectItem value="Telegram">Telegram</SelectItem><SelectItem value="Google Site">Google Site</SelectItem><SelectItem value="Other">अन्य</SelectItem></SelectContent></Select></div>
                                <div><Label htmlFor="class-link">लिंक</Label><Input id="class-link" type="url" value={classLink} onChange={e => setClassLink(e.target.value)} required /></div>
                            </CardContent>
                            <CardFooter><Button type="submit">क्लास जोड़ें</Button></CardFooter>
                        </form>
                    </Card>
                </div>

                {/* Column 2: Downloads & Lists */}
                <div className="space-y-6 xl:col-span-1">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Download/> स्टडी मटेरियल मैनेज करें</CardTitle>
                        </CardHeader>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddItem('downloads', { title: downloadTitle, description: downloadDesc, fileUrl: downloadUrl }, 'फाइल जोड़ी गई!', 'फाइल जोड़ने में विफल।', () => { setDownloadTitle(''); setDownloadDesc(''); setDownloadUrl(''); }); }}>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="download-title">फाइल का शीर्षक</Label><Input id="download-title" value={downloadTitle} onChange={e => setDownloadTitle(e.target.value)} required/></div>
                                <div><Label htmlFor="download-desc">विवरण</Label><Input id="download-desc" value={downloadDesc} onChange={e => setDownloadDesc(e.target.value)}/></div>
                                <div><Label htmlFor="download-url">फाइल का URL</Label><Input id="download-url" type="url" value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} placeholder="https://..." required/></div>
                            </CardContent>
                            <CardFooter><Button type="submit">फाइल जोड़ें</Button></CardFooter>
                        </form>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>वर्तमान सूचनाएं</CardTitle></CardHeader>
                        <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                            {notifications.map(n => (
                                <div key={n.id} className="flex items-start justify-between p-2 rounded-md bg-secondary gap-2">
                                    <div className='flex-1 min-w-0'><p className="font-semibold break-words">{n.title}</p><p className="text-xs text-muted-foreground break-words">{n.description}</p></div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteItem('notifications', n.id, 'सूचना हटाई गई!', 'सूचना हटाने में विफल।')} className="flex-shrink-0"><Trash2 className="w-4 h-4 text-destructive"/></Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                
                 {/* Column 3: Lists */}
                <div className="space-y-6 xl:col-span-1">
                    <Card>
                        <CardHeader><CardTitle>वर्तमान लाइव कक्षाएं</CardTitle></CardHeader>
                        <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                            {liveClasses.map(c => (
                                <div key={c.id} className="flex items-start justify-between p-2 rounded-md bg-secondary gap-2">
                                    <div className='flex-1 min-w-0'><p className="font-semibold break-words">{c.title} <span className="text-xs text-muted-foreground">({c.platform})</span></p><a href={c.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{c.link}</a></div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteItem('liveClasses', c.id, 'लाइव क्लास हटाई गई!', 'क्लास हटाने में विफल।')} className="flex-shrink-0"><Trash2 className="w-4 h-4 text-destructive"/></Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>वर्तमान फाइलें</CardTitle></CardHeader>
                        <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                            {downloads.map(d => (
                                <div key={d.id} className="flex items-start justify-between p-2 rounded-md bg-secondary gap-2">
                                    <div className='flex-1 min-w-0'><p className="font-semibold break-words">{d.title}</p><a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{d.fileUrl}</a></div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteItem('downloads', d.id, 'फाइल हटाई गई!', 'फाइल हटाने में विफल।')} className="flex-shrink-0"><Trash2 className="w-4 h-4 text-destructive"/></Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="xl:col-span-3">
                    <ScholarshipRegistrations />
                </div>
            </div>
        </div>
    );
}
