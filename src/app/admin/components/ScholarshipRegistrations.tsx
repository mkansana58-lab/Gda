
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users, Trash2, Eye, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';

interface ScholarshipApplication {
    id: string;
    applicationNo: string;
    name: string;
    fatherName: string;
    mobile: string;
    email: string;
    age: number;
    class: string;
    school: string;
    village: string;
    district: string;
    pincode: string;
    state: string;
    photoDataUrl: string;
    signatureDataUrl: string;
    createdAt: Timestamp;
}

export function ScholarshipRegistrations() {
    const { toast } = useToast();
    const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<ScholarshipApplication | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [appToDelete, setAppToDelete] = useState<ScholarshipApplication | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "scholarshipApplications"), orderBy("createdAt", "desc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const appData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScholarshipApplication));
            setApplications(appData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching scholarship applications:", error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'पंजीकरण लोड करने में विफल।' });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleDelete = async () => {
        if (!appToDelete) return;
        try {
            await deleteDoc(doc(db, "scholarshipApplications", appToDelete.id));
            toast({ title: 'पंजीकरण हटाया गया!', variant: 'destructive' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'पंजीकरण हटाने में विफल।' });
        } finally {
            setAppToDelete(null);
        }
    };

    const handleView = (app: ScholarshipApplication) => {
        setSelectedApp(app);
        setIsViewOpen(true);
    }
    
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users /> छात्रवृत्ति पंजीकरण</CardTitle>
                    <CardDescription>छात्रवृत्ति के लिए सभी पंजीकृत छात्रों की सूची देखें।</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : applications.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">अभी तक कोई पंजीकरण नहीं हुआ है।</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>आवेदन क्र.</TableHead>
                                    <TableHead>नाम</TableHead>
                                    <TableHead className="hidden sm:table-cell">पिता का नाम</TableHead>
                                    <TableHead className="hidden md:table-cell">मोबाइल</TableHead>
                                    <TableHead>कक्षा</TableHead>
                                    <TableHead className="text-right">कार्रवाई</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map(app => (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-mono">{app.applicationNo}</TableCell>
                                        <TableCell className="font-medium">{app.name}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{app.fatherName}</TableCell>
                                        <TableCell className="hidden md:table-cell">{app.mobile}</TableCell>
                                        <TableCell>{app.class}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleView(app)}><Eye className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => setAppToDelete(app)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">कुल पंजीकरण: {applications.length}</p>
                </CardFooter>
            </Card>

            {/* View Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>पंजीकरण विवरण - {selectedApp?.name}</DialogTitle>
                        <DialogDescription>आवेदन क्रमांक: {selectedApp?.applicationNo}</DialogDescription>
                    </DialogHeader>
                    {selectedApp && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto p-1 text-sm">
                            <div className="space-y-2">
                                <p><strong>नाम:</strong> {selectedApp.name}</p>
                                <p><strong>पिता का नाम:</strong> {selectedApp.fatherName}</p>
                                <p><strong>मोबाइल:</strong> {selectedApp.mobile}</p>
                                <p><strong>ईमेल:</strong> {selectedApp.email}</p>
                                <p><strong>आयु:</strong> {selectedApp.age}</p>
                                <p><strong>कक्षा:</strong> {selectedApp.class}</p>
                                <p><strong>स्कूल:</strong> {selectedApp.school}</p>
                                <p><strong>पता:</strong> {`${selectedApp.village}, ${selectedApp.district}, ${selectedApp.state} - ${selectedApp.pincode}`}</p>
                                <p><strong>आवेदन तिथि:</strong> {selectedApp.createdAt?.toDate().toLocaleDateString('hi-IN')}</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold mb-1">फोटो:</p>
                                    <Image src={selectedApp.photoDataUrl} alt="Photo" width={150} height={180} className="rounded-md border p-1" />
                                </div>
                                <div>
                                    <p className="font-semibold mb-1">हस्ताक्षर:</p>
                                    <Image src={selectedApp.signatureDataUrl} alt="Signature" width={200} height={80} className="rounded-md border p-1 bg-white" />
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!appToDelete} onOpenChange={(open) => !open && setAppToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>क्या आप निश्चित हैं?</AlertDialogTitle>
                        <AlertDialogDescription>
                            यह "{appToDelete?.name}" के पंजीकरण को स्थायी रूप से हटा देगा। यह क्रिया पूर्ववत नहीं की जा सकती।
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAppToDelete(null)}>रद्द करें</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>हटाएं</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
