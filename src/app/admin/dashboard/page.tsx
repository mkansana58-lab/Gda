
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bell, BookOpen, Trash2, Download, Video, Newspaper, Users, ClipboardCheck, BookMarked, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ScholarshipRegistrations } from '../components/ScholarshipRegistrations';
import { StudentList } from '../components/StudentList';
import { AiTestEnrollees } from '../components/AiTestEnrollees';
import Image from 'next/image';

interface ListItem { id: string; title: string; }

const MAX_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const MAX_UPLOAD_SIZE_MB = 2;


export default function AdminDashboardPage() {
    const { toast } = useToast();

    // State for various lists
    const [notifications, setNotifications] = useState<ListItem[]>([]);
    const [liveClasses, setLiveClasses] = useState<ListItem[]>([]);
    const [downloads, setDownloads] = useState<ListItem[]>([]);
    const [videos, setVideos] = useState<ListItem[]>([]);
    const [currentAffairs, setCurrentAffairs] = useState<ListItem[]>([]);
    const [courses, setCourses] = useState<ListItem[]>([]);
    
    // Form States
    const [notifTitle, setNotifTitle] = useState('');
    const [notifDesc, setNotifDesc] = useState('');
    const [notifIcon, setNotifIcon] = useState('Bell');
    const [classTitle, setClassTitle] = useState('');
    const [classDesc, setClassDesc] = useState('');
    const [classPlatform, setClassPlatform] = useState('');
    const [classLink, setClassLink] = useState('');
    const [downloadTitle, setDownloadTitle] = useState('');
    const [downloadDesc, setDownloadDesc] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDesc, setVideoDesc] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [affairTitle, setAffairTitle] = useState('');
    const [affairDesc, setAffairDesc] = useState('');
    const [affairCategory, setAffairCategory] = useState('');
    const [affairImageFile, setAffairImageFile] = useState<File | null>(null);
    const [affairImagePreview, setAffairImagePreview] = useState<string | null>(null);
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDesc, setCourseDesc] = useState('');
    const [courseLink, setCourseLink] = useState('');
    const [courseImageFile, setCourseImageFile] = useState<File | null>(null);
    const [courseImagePreview, setCourseImagePreview] = useState<string | null>(null);

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
                setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ListItem)));
            }, (e) => console.error(`Error fetching ${name}:`, e));
        });
        return () => unsubscribes.forEach(unsub => unsub());
    }, []);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFile: (file: File | null) => void,
        setPreview: (url: string | null) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_UPLOAD_SIZE_BYTES) {
                toast({
                    variant: 'destructive',
                    title: 'इमेज बहुत बड़ी है',
                    description: `कृपया ${MAX_UPLOAD_SIZE_MB}MB से छोटी इमेज चुनें। बड़ी फाइलों के लिए, उसे पहले कंप्रेस करें।`,
                    duration: 5000,
                });
                e.target.value = ''; // Clear the input
                return;
            }
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleDeleteItem = async (collectionName: string, id: string) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
            toast({ title: `${collectionName} आइटम हटाया गया`, variant: 'destructive' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'हटाने में विफल।' });
        }
    };

    const handleGenericSubmit = async (formId: string, collectionName: string, data: object, successMsg: string, resetter: () => void) => {
        setIsSubmitting(formId);
        try {
            await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() });
            toast({ title: successMsg });
            resetter();
        } catch (error) {
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'जोड़ने में विफल।' });
        } finally {
            setIsSubmitting(null);
        }
    };
    
    const handleCourseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!courseImageFile) {
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'कृपया एक कोर्स इमेज चुनें।' });
            return;
        }
        setIsSubmitting('courses');
        try {
            const imageUrl = await readFileAsDataURL(courseImageFile);
            await addDoc(collection(db, 'courses'), { title: courseTitle, description: courseDesc, imageUrl, link: courseLink, createdAt: serverTimestamp() });
            toast({ title: 'कोर्स जोड़ा गया!' });
            setCourseTitle(''); setCourseDesc(''); setCourseLink(''); setCourseImageFile(null); setCourseImagePreview(null);
            (document.getElementById('course-image') as HTMLInputElement).value = '';
        } catch (error) { toast({ variant: 'destructive', title: 'त्रुटि', description: 'कोर्स जोड़ने में विफल।' }); }
        finally { setIsSubmitting(null); }
    };
    
    const handleAffairSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting('currentAffairs');
        try {
            let imageUrl = '';
            if (affairImageFile) {
                imageUrl = await readFileAsDataURL(affairImageFile);
            }
            await addDoc(collection(db, 'currentAffairs'), { title: affairTitle, description: affairDesc, category: affairCategory, imageUrl, createdAt: serverTimestamp() });
            toast({ title: 'करेंट अफेयर जोड़ा गया!' });
            setAffairTitle(''); setAffairDesc(''); setAffairCategory(''); setAffairImageFile(null); setAffairImagePreview(null);
            (document.getElementById('affair-image') as HTMLInputElement).value = '';
        } catch (error) { toast({ variant: 'destructive', title: 'त्रुटि', description: 'करेंट अफेयर जोड़ने में विफल।' }); }
        finally { setIsSubmitting(null); }
    };

    const renderList = (items: ListItem[], collectionName: string) => (
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {items.map(item => (
                <li key={item.id} className="flex items-center justify-between text-sm bg-secondary p-2 rounded-md">
                    <span className="truncate pr-2">{item.title}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteItem(collectionName, item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </li>
            ))}
            {items.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">कोई आइटम नहीं।</p>}
        </ul>
    );

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">एडमिन डैशबोर्ड</h1>
            <p className="text-muted-foreground">यहां से ऐप की सभी सामग्री को प्रबंधित करें।</p>
            
            <div className="space-y-6">
                <h2 className="text-xl font-headline font-bold border-b pb-2">सामग्री प्रबंधन</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><BookMarked /> कोर्स प्रबंधन</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleCourseSubmit}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4 min-w-0">
                                        <div><Label htmlFor="course-title">कोर्स का शीर्षक</Label><Input id="course-title" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} required /></div>
                                        <div><Label htmlFor="course-desc">विवरण</Label><Textarea id="course-desc" value={courseDesc} onChange={e => setCourseDesc(e.target.value)} required /></div>
                                        <div><Label htmlFor="course-link">और जानें लिंक (वैकल्पिक)</Label><Input id="course-link" type="url" value={courseLink} onChange={e => setCourseLink(e.target.value)} placeholder="https://..." /></div>
                                        <div>
                                            <Label htmlFor="course-image">कोर्स इमेज</Label>
                                            <Input id="course-image" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setCourseImageFile, setCourseImagePreview)} required />
                                            {courseImagePreview && <Image src={courseImagePreview} alt="कोर्स प्रीव्यू" width={100} height={100} className="mt-2 rounded-md border" />}
                                        </div>
                                        <Button type="submit" disabled={isSubmitting === 'courses'}>{isSubmitting === 'courses' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} कोर्स जोड़ें</Button>
                                    </div>
                                    <div className="min-w-0"><h4 className="font-semibold mb-2">वर्तमान कोर्स</h4>{renderList(courses, 'courses')}</div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Newspaper /> करेंट अफेयर्स प्रबंधन</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleAffairSubmit}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4 min-w-0">
                                        <div><Label htmlFor="affair-title">शीर्षक</Label><Input id="affair-title" value={affairTitle} onChange={e => setAffairTitle(e.target.value)} required/></div>
                                        <div><Label htmlFor="affair-category">श्रेणी</Label><Input id="affair-category" value={affairCategory} onChange={e => setAffairCategory(e.target.value)} placeholder="जैसे राष्ट्रीय, खेल" required/></div>
                                        <div><Label htmlFor="affair-desc">विवरण</Label><Textarea id="affair-desc" value={affairDesc} onChange={e => setAffairDesc(e.target.value)} required/></div>
                                        <div>
                                            <Label htmlFor="affair-image">इमेज (वैकल्पिक)</Label>
                                            <Input id="affair-image" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setAffairImageFile, setAffairImagePreview)} />
                                            {affairImagePreview && <Image src={affairImagePreview} alt="करेंट अफेयर प्रीव्यू" width={100} height={100} className="mt-2 rounded-md border" />}
                                        </div>
                                        <Button type="submit" disabled={isSubmitting === 'currentAffairs'}>{isSubmitting === 'currentAffairs' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} करेंट अफेयर जोड़ें</Button>
                                    </div>
                                    <div className="min-w-0"><h4 className="font-semibold mb-2">वर्तमान करेंट अफेयर्स</h4>{renderList(currentAffairs, 'currentAffairs')}</div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Bell /> सूचना प्रबंधन</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleGenericSubmit('notifications', 'notifications', { title: notifTitle, description: notifDesc, icon: notifIcon }, 'सूचना भेजी गई!', () => { setNotifTitle(''); setNotifDesc(''); setNotifIcon('Bell'); }); }}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4 min-w-0">
                                        <div><Label htmlFor="notif-title">शीर्षक</Label><Input id="notif-title" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} required/></div>
                                        <div><Label htmlFor="notif-desc">विवरण</Label><Textarea id="notif-desc" value={notifDesc} onChange={e => setNotifDesc(e.target.value)} required/></div>
                                        <div><Label htmlFor="notif-icon">आइकन</Label><Select value={notifIcon} onValueChange={setNotifIcon}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Bell">घंटी (Bell)</SelectItem><SelectItem value="FilePen">फ़ाइल (FilePen)</SelectItem><SelectItem value="Sparkles">स्पार्कल्स (Sparkles)</SelectItem><SelectItem value="CheckCircle">चेक (CheckCircle)</SelectItem><SelectItem value="Newspaper">अखबार (Newspaper)</SelectItem></SelectContent></Select></div>
                                        <Button type="submit" disabled={isSubmitting === 'notifications'}>{isSubmitting === 'notifications' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} सूचना भेजें</Button>
                                    </div>
                                    <div className="min-w-0"><h4 className="font-semibold mb-2">हाल की सूचनाएं</h4>{renderList(notifications, 'notifications')}</div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen /> लाइव क्लास प्रबंधन</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleGenericSubmit('liveClasses', 'liveClasses', { title: classTitle, description: classDesc, platform: classPlatform, link: classLink }, 'लाइव क्लास जोड़ी गई!', () => { setClassTitle(''); setClassDesc(''); setClassPlatform(''); setClassLink(''); }); }}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4 min-w-0">
                                        <div><Label htmlFor="class-title">शीर्षक</Label><Input id="class-title" value={classTitle} onChange={e => setClassTitle(e.target.value)} required/></div>
                                        <div><Label htmlFor="class-desc">विवरण</Label><Textarea id="class-desc" value={classDesc} onChange={e => setClassDesc(e.target.value)} required/></div>
                                        <div><Label htmlFor="class-platform">प्लेटफ़ॉर्म</Label><Select value={classPlatform} onValueChange={setClassPlatform} required><SelectTrigger><SelectValue placeholder="एक प्लेटफ़ॉर्म चुनें"/></SelectTrigger><SelectContent><SelectItem value="YouTube">YouTube</SelectItem><SelectItem value="Telegram">Telegram</SelectItem><SelectItem value="WhatsApp">WhatsApp</SelectItem><SelectItem value="Google Site">Google Site</SelectItem><SelectItem value="Other">अन्य</SelectItem></SelectContent></Select></div>
                                        <div><Label htmlFor="class-link">लिंक</Label><Input id="class-link" type="url" value={classLink} onChange={e => setClassLink(e.target.value)} placeholder="https://..." required/></div>
                                        <Button type="submit" disabled={isSubmitting === 'liveClasses'}>{isSubmitting === 'liveClasses' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} क्लास जोड़ें</Button>
                                    </div>
                                    <div className="min-w-0"><h4 className="font-semibold mb-2">वर्तमान लाइव कक्षाएं</h4>{renderList(liveClasses, 'liveClasses')}</div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Download /> स्टडी मटेरियल प्रबंधन</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleGenericSubmit('downloads', 'downloads', { title: downloadTitle, description: downloadDesc, fileUrl: downloadUrl }, 'फ़ाइल जोड़ी गई!', () => { setDownloadTitle(''); setDownloadDesc(''); setDownloadUrl(''); }); }}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4 min-w-0">
                                        <div><Label htmlFor="download-title">फ़ाइल का शीर्षक</Label><Input id="download-title" value={downloadTitle} onChange={e => setDownloadTitle(e.target.value)} required/></div>
                                        <div><Label htmlFor="download-desc">विवरण</Label><Textarea id="download-desc" value={downloadDesc} onChange={e => setDownloadDesc(e.target.value)} required/></div>
                                        <div><Label htmlFor="download-url">फ़ाइल URL</Label><Input id="download-url" type="url" value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} placeholder="https://..." required/></div>
                                        <Button type="submit" disabled={isSubmitting === 'downloads'}>{isSubmitting === 'downloads' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} फ़ाइल जोड़ें</Button>
                                    </div>
                                    <div className="min-w-0"><h4 className="font-semibold mb-2">अपलोड की गई फ़ाइलें</h4>{renderList(downloads, 'downloads')}</div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Video /> वीडियो लेक्चर प्रबंधन</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleGenericSubmit('videos', 'videos', { title: videoTitle, description: videoDesc, videoUrl: videoUrl }, 'वीडियो जोड़ा गया!', () => { setVideoTitle(''); setVideoDesc(''); setVideoUrl(''); }); }}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4 min-w-0">
                                        <div><Label htmlFor="video-title">वीडियो का शीर्षक</Label><Input id="video-title" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} required/></div>
                                        <div><Label htmlFor="video-desc">विवरण</Label><Textarea id="video-desc" value={videoDesc} onChange={e => setVideoDesc(e.target.value)} required/></div>
                                        <div><Label htmlFor="video-url">YouTube वीडियो URL</Label><Input id="video-url" type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." required/></div>
                                        <Button type="submit" disabled={isSubmitting === 'videos'}>{isSubmitting === 'videos' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} वीडियो जोड़ें</Button>
                                    </div>
                                    <div className="min-w-0"><h4 className="font-semibold mb-2">अपलोड किए गए वीडियो</h4>{renderList(videos, 'videos')}</div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-xl font-headline font-bold border-b pb-2 pt-6">उपयोगकर्ता प्रबंधन</h2>
                <div className="grid grid-cols-1 gap-6">
                   <StudentList />
                   <ScholarshipRegistrations />
                   <AiTestEnrollees />
                </div>
            </div>
        </div>
    );
}
