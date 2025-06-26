
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bell, BookOpen, Trash2, Download, Video, Newspaper, Users, ClipboardCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ScholarshipRegistrations } from '../components/ScholarshipRegistrations';
import { StudentList } from '../components/StudentList';
import { AiTestEnrollees } from '../components/AiTestEnrollees';

interface LiveClass {
    id: string;
    title: string;
    description: string;
    platform: string;
    link: string;
}
interface AdminNotification {
    id: string;
    title: string;
    description: string;
    icon: 'Bell';
}
interface Download {
    id: string;
    title: string;
    description: string;
    fileUrl: string;
}
interface Video {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
}
interface CurrentAffair {
    id: string;
    title: string;
    description: string;
    category: string;
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

    const [videos, setVideos] = useState<Video[]>([]);
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDesc, setVideoDesc] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const [currentAffairs, setCurrentAffairs] = useState<CurrentAffair[]>([]);
    const [affairTitle, setAffairTitle] = useState('');
    const [affairDesc, setAffairDesc] = useState('');
    const [affairCategory, setAffairCategory] = useState('');

    useEffect(() => {
        const collections: { name: string, setter: Function }[] = [
            { name: "liveClasses", setter: setLiveClasses },
            { name: "notifications", setter: setNotifications },
            { name: "downloads", setter: setDownloads },
            { name: "videos", setter: setVideos },
            { name: "currentAffairs", setter: setCurrentAffairs },
        ];

        const unsubscribes = collections.map(({ name, setter }) => {
            const q = query(collection(db, name), orderBy("createdAt", "desc"));
            return onSnapshot(q, (snapshot) => {
                setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }, (e) => console.error(`Error fetching ${name}:`, e));
        });

        return () => unsubscribes.forEach(unsub => unsub());
    }, []);

    const handleAddItem = async (collectionName: string, data: object, successMsg: string, resetter: () => void) => {
        try {
            await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() });
            toast({ title: successMsg });
            resetter();
        } catch (error) {
            console.error(`Error adding to ${collectionName}:`, error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: `जोड़ने में विफल: ${error}` });
        }
    };
    
    const handleDeleteItem = async (collectionName: string, id: string) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
            toast({ title: `${collectionName} आइटम हटाया गया`, variant: 'destructive' });
        } catch (error) {
            console.error(`Error deleting from ${collectionName}:`, error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: `हटाने में विफल: ${error}` });
        }
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">एडमिन डैशबोर्ड</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Column 1: Management Forms */}
                <div className="space-y-6 xl:col-span-1">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Bell/> सूचनाएं</CardTitle></CardHeader>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddItem('notifications', { title: notifTitle, description: notifDesc, icon: 'Bell' }, 'सूचना भेजी गई!', () => { setNotifTitle(''); setNotifDesc(''); }); }}>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="notif-title">शीर्षक</Label><Input id="notif-title" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} required/></div>
                                <div><Label htmlFor="notif-desc">विवरण</Label><Textarea id="notif-desc" value={notifDesc} onChange={e => setNotifDesc(e.target.value)} required/></div>
                            </CardContent>
                            <CardFooter><Button type="submit">भेजें</Button></CardFooter>
                        </form>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen/> लाइव क्लास</CardTitle></CardHeader>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddItem('liveClasses', { title: classTitle, description: classDesc, platform: classPlatform, link: classLink }, 'लाइव क्लास जोड़ी गई!', () => { setClassTitle(''); setClassDesc(''); setClassPlatform(''); setClassLink(''); }); }}>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="class-title">शीर्षक</Label><Input id="class-title" value={classTitle} onChange={e => setClassTitle(e.target.value)} required /></div>
                                <div><Label htmlFor="class-desc">विवरण</Label><Input id="class-desc" value={classDesc} onChange={e => setClassDesc(e.target.value)} /></div>
                                <div><Label htmlFor="class-platform">प्लेटफॉर्म</Label><Select onValueChange={setClassPlatform} value={classPlatform} required><SelectTrigger id="class-platform"><SelectValue placeholder="एक प्लेटफॉर्म चुनें" /></SelectTrigger><SelectContent><SelectItem value="YouTube">YouTube</SelectItem><SelectItem value="WhatsApp">WhatsApp</SelectItem><SelectItem value="Telegram">Telegram</SelectItem><SelectItem value="Google Site">Google Site</SelectItem><SelectItem value="Other">अन्य</SelectItem></SelectContent></Select></div>
                                <div><Label htmlFor="class-link">लिंक</Label><Input id="class-link" type="url" value={classLink} onChange={e => setClassLink(e.target.value)} required /></div>
                            </CardContent>
                            <CardFooter><Button type="submit">जोड़ें</Button></CardFooter>
                        </form>
                    </Card>
                </div>

                {/* Column 2: Management Forms */}
                <div className="space-y-6 xl:col-span-1">
                     <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Download/> स्टडी मटेरियल</CardTitle></CardHeader>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddItem('downloads', { title: downloadTitle, description: downloadDesc, fileUrl: downloadUrl }, 'फाइल जोड़ी गई!', () => { setDownloadTitle(''); setDownloadDesc(''); setDownloadUrl(''); }); }}>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="download-title">फाइल का शीर्षक</Label><Input id="download-title" value={downloadTitle} onChange={e => setDownloadTitle(e.target.value)} required/></div>
                                <div><Label htmlFor="download-desc">विवरण</Label><Input id="download-desc" value={downloadDesc} onChange={e => setDownloadDesc(e.target.value)}/></div>
                                <div><Label htmlFor="download-url">फाइल का URL</Label><Input id="download-url" type="url" value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} placeholder="https://..." required/></div>
                            </CardContent>
                            <CardFooter><Button type="submit">जोड़ें</Button></CardFooter>
                        </form>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Video/> वीडियो लेक्चर</CardTitle></CardHeader>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddItem('videos', { title: videoTitle, description: videoDesc, videoUrl: videoUrl }, 'वीडियो जोड़ा गया!', () => { setVideoTitle(''); setVideoDesc(''); setVideoUrl(''); }); }}>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="video-title">वीडियो का शीर्षक</Label><Input id="video-title" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} required/></div>
                                <div><Label htmlFor="video-desc">विवरण</Label><Input id="video-desc" value={videoDesc} onChange={e => setVideoDesc(e.target.value)}/></div>
                                <div><Label htmlFor="video-url">YouTube वीडियो URL</Label><Input id="video-url" type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required/></div>
                            </CardContent>
                            <CardFooter><Button type="submit">जोड़ें</Button></CardFooter>
                        </form>
                    </Card>
                </div>
                
                 {/* Column 3: Management Forms & Lists */}
                <div className="space-y-6 xl:col-span-1">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Newspaper/> करेंट अफेयर्स</CardTitle></CardHeader>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddItem('currentAffairs', { title: affairTitle, description: affairDesc, category: affairCategory }, 'करेंट अफेयर जोड़ा गया!', () => { setAffairTitle(''); setAffairDesc(''); setAffairCategory(''); }); }}>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="affair-title">शीर्षक</Label><Input id="affair-title" value={affairTitle} onChange={e => setAffairTitle(e.target.value)} required/></div>
                                <div><Label htmlFor="affair-desc">विवरण</Label><Textarea id="affair-desc" value={affairDesc} onChange={e => setAffairDesc(e.target.value)} required/></div>
                                <div><Label htmlFor="affair-category">श्रेणी</Label><Input id="affair-category" value={affairCategory} onChange={e => setAffairCategory(e.target.value)} placeholder="जैसे राष्ट्रीय, खेल" required/></div>
                            </CardContent>
                            <CardFooter><Button type="submit">जोड़ें</Button></CardFooter>
                        </form>
                    </Card>
                </div>

                {/* Lists spanning full width */}
                <div className="xl:col-span-3 space-y-6">
                    <StudentList />
                    <ScholarshipRegistrations />
                    <AiTestEnrollees />
                </div>
            </div>
        </div>
    );
}
