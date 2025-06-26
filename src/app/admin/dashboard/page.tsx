
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bell, BookOpen, Trash2, Download, Video, Newspaper, Users, ClipboardCheck, BookMarked, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ScholarshipRegistrations } from '../components/ScholarshipRegistrations';
import { StudentList } from '../components/StudentList';
import { AiTestEnrollees } from '../components/AiTestEnrollees';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Interfaces for Firestore data
interface LiveClass { id: string; title: string; }
interface AdminNotification { id: string; title: string; }
interface Download { id: string; title: string; }
interface Video { id: string; title: string; }
interface CurrentAffair { id: string; title: string; }
interface Course { id: string; title: string; }


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
    const [affairImageUrl, setAffairImageUrl] = useState('');
    
    const [courses, setCourses] = useState<Course[]>([]);
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDesc, setCourseDesc] = useState('');
    const [courseImageUrl, setCourseImageUrl] = useState('');
    const [courseLink, setCourseLink] = useState('');

    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

    useEffect(() => {
        const collections: { name: string, setter: Function }[] = [
            { name: "liveClasses", setter: setLiveClasses },
            { name: "notifications", setter: setNotifications },
            { name: "downloads", setter: setDownloads },
            { name: "videos", setter: setVideos },
            { name: "currentAffairs", setter: setCurrentAffairs },
            { name: "courses", setter: setCourses },
        ];

        const unsubscribes = collections.map(({ name, setter }) => {
            const q = query(collection(db, name), orderBy("createdAt", "desc"));
            return onSnapshot(q, (snapshot) => {
                setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }, (e) => console.error(`Error fetching ${name}:`, e));
        });

        return () => unsubscribes.forEach(unsub => unsub());
    }, []);

    const handleAddItem = async (formId: string, collectionName: string, data: object, successMsg: string, resetter: () => void) => {
        setIsSubmitting(formId);
        try {
            await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() });
            toast({ title: successMsg });
            resetter();
        } catch (error) {
            console.error(`Error adding to ${collectionName}:`, error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: `जोड़ने में विफल: ${error}` });
        } finally {
            setIsSubmitting(null);
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

    const renderList = (items: {id: string, title: string}[], collectionName: string) => (
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {items.map(item => (
                <li key={item.id} className="flex items-center justify-between text-sm bg-secondary p-2 rounded-md">
                    <span className="truncate pr-2">{item.title}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteItem(collectionName, item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">एडमिन डैशबोर्ड</h1>
            <p className="text-muted-foreground">यहां से ऐप की सभी सामग्री को प्रबंधित करें।</p>
            
            <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">सामग्री प्रबंधन</TabsTrigger>
                    <TabsTrigger value="users">उपयोगकर्ता प्रबंधन</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="mt-6">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {/* Course Management */}
                        <AccordionItem value="courses">
                            <AccordionTrigger className="font-headline text-lg bg-card p-4 rounded-t-lg">कोर्स प्रबंधन</AccordionTrigger>
                            <AccordionContent className="bg-card p-4 rounded-b-lg">
                                <form onSubmit={(e) => { e.preventDefault(); handleAddItem('courses', { title: courseTitle, description: courseDesc, imageUrl: courseImageUrl, link: courseLink }, 'कोर्स जोड़ा गया!', () => { setCourseTitle(''); setCourseDesc(''); setCourseImageUrl(''); setCourseLink(''); }); }}>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div><Label htmlFor="course-title">कोर्स का शीर्षक</Label><Input id="course-title" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} required /></div>
                                            <div><Label htmlFor="course-desc">विवरण</Label><Textarea id="course-desc" value={courseDesc} onChange={e => setCourseDesc(e.target.value)} required /></div>
                                            <div><Label htmlFor="course-image-url">इमेज URL</Label><Input id="course-image-url" type="url" value={courseImageUrl} onChange={e => setCourseImageUrl(e.target.value)} placeholder="https://..." required /></div>
                                            <div><Label htmlFor="course-link">और जानें लिंक (वैकल्पिक)</Label><Input id="course-link" type="url" value={courseLink} onChange={e => setCourseLink(e.target.value)} placeholder="https://..." /></div>
                                            <Button type="submit" disabled={isSubmitting === 'courses'}>{isSubmitting === 'courses' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} कोर्स जोड़ें</Button>
                                        </div>
                                        <div><h4 className="font-semibold mb-2">वर्तमान कोर्स</h4>{renderList(courses, 'courses')}</div>
                                    </div>
                                </form>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Current Affairs Management */}
                        <AccordionItem value="current-affairs">
                            <AccordionTrigger className="font-headline text-lg bg-card p-4 rounded-t-lg">करेंट अफेयर्स प्रबंधन</AccordionTrigger>
                            <AccordionContent className="bg-card p-4 rounded-b-lg">
                                <form onSubmit={(e) => { e.preventDefault(); handleAddItem('currentAffairs', { title: affairTitle, description: affairDesc, category: affairCategory, imageUrl: affairImageUrl }, 'करेंट अफेयर जोड़ा गया!', () => { setAffairTitle(''); setAffairDesc(''); setAffairCategory(''); setAffairImageUrl(''); }); }}>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div><Label htmlFor="affair-title">शीर्षक</Label><Input id="affair-title" value={affairTitle} onChange={e => setAffairTitle(e.target.value)} required/></div>
                                            <div><Label htmlFor="affair-category">श्रेणी</Label><Input id="affair-category" value={affairCategory} onChange={e => setAffairCategory(e.target.value)} placeholder="जैसे राष्ट्रीय, खेल" required/></div>
                                            <div><Label htmlFor="affair-image-url">इमेज URL (वैकल्पिक)</Label><Input id="affair-image-url" type="url" value={affairImageUrl} onChange={e => setAffairImageUrl(e.target.value)} placeholder="https://..."/></div>
                                            <div><Label htmlFor="affair-desc">विवरण</Label><Textarea id="affair-desc" value={affairDesc} onChange={e => setAffairDesc(e.target.value)} required/></div>
                                            <Button type="submit" disabled={isSubmitting === 'currentAffairs'}>{isSubmitting === 'currentAffairs' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} करेंट अफेयर जोड़ें</Button>
                                        </div>
                                        <div><h4 className="font-semibold mb-2">वर्तमान करेंट अफेयर्स</h4>{renderList(currentAffairs, 'currentAffairs')}</div>
                                    </div>
                                </form>
                            </AccordionContent>
                        </AccordionItem>
                        
                        {/* Other sections */}
                        <AccordionItem value="notifications"><AccordionTrigger className="font-headline text-lg bg-card p-4 rounded-t-lg">सूचना प्रबंधन</AccordionTrigger><AccordionContent className="bg-card p-4 rounded-b-lg"> ... </AccordionContent></AccordionItem>
                        <AccordionItem value="live-classes"><AccordionTrigger className="font-headline text-lg bg-card p-4 rounded-t-lg">लाइव क्लास प्रबंधन</AccordionTrigger><AccordionContent className="bg-card p-4 rounded-b-lg"> ... </AccordionContent></AccordionItem>
                        <AccordionItem value="downloads"><AccordionTrigger className="font-headline text-lg bg-card p-4 rounded-t-lg">स्टडी मटेरियल प्रबंधन</AccordionTrigger><AccordionContent className="bg-card p-4 rounded-b-lg"> ... </AccordionContent></AccordionItem>
                        <AccordionItem value="videos"><AccordionTrigger className="font-headline text-lg bg-card p-4 rounded-t-lg">वीडियो लेक्चर प्रबंधन</AccordionTrigger><AccordionContent className="bg-card p-4 rounded-b-lg"> ... </AccordionContent></AccordionItem>

                    </Accordion>
                </TabsContent>
                <TabsContent value="users" className="mt-6">
                    <div className="grid grid-cols-1 gap-6">
                       <StudentList />
                       <ScholarshipRegistrations />
                       <AiTestEnrollees />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
