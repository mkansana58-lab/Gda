
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users, Trash2, Loader2, Eye } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';

interface Student {
    id: string;
    name: string;
    mobile: string;
    email: string;
    class: string;
    exam: string;
    village: string;
    district: string;
    pincode: string;
    state: string;
    profilePhotoUrl?: string;
    createdAt: Timestamp;
}

export function StudentList() {
    const { toast } = useToast();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const studentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
            setStudents(studentData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching students:", error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'छात्रों को लोड करने में विफल।' });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleDelete = async () => {
        if (!studentToDelete) return;
        try {
            await deleteDoc(doc(db, "students", studentToDelete.id));
            toast({ title: 'छात्र हटाया गया!', variant: 'destructive' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'छात्र को हटाने में विफल।' });
        } finally {
            setStudentToDelete(null);
        }
    };

    const handleView = (student: Student) => {
        setSelectedStudent(student);
        setIsViewOpen(true);
    }
    
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users /> पंजीकृत छात्र</CardTitle>
                    <CardDescription>ऐप पर सभी पंजीकृत छात्रों की सूची देखें।</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : students.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">अभी तक कोई छात्र पंजीकृत नहीं हुआ है।</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>नाम</TableHead>
                                    <TableHead className="hidden sm:table-cell">मोबाइल</TableHead>
                                    <TableHead className="hidden md:table-cell">ईमेल</TableHead>
                                    <TableHead>कक्षा</TableHead>
                                    <TableHead className="text-right">कार्रवाई</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{student.mobile}</TableCell>
                                        <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                                        <TableCell>{student.class}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleView(student)}><Eye className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => setStudentToDelete(student)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">कुल छात्र: {students.length}</p>
                </CardFooter>
            </Card>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>छात्र विवरण - {selectedStudent?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="space-y-2 text-sm">
                            {selectedStudent.profilePhotoUrl && <Image src={selectedStudent.profilePhotoUrl} alt="Photo" width={100} height={100} className="rounded-full mx-auto border" />}
                            <p><strong>नाम:</strong> {selectedStudent.name}</p>
                            <p><strong>मोबाइल:</strong> {selectedStudent.mobile}</p>
                            <p><strong>ईमेल:</strong> {selectedStudent.email}</p>
                            <p><strong>कक्षा:</strong> {selectedStudent.class}</p>
                            <p><strong>परीक्षा:</strong> {selectedStudent.exam}</p>
                            <p><strong>पता:</strong> {`${selectedStudent.village}, ${selectedStudent.district}, ${selectedStudent.state} - ${selectedStudent.pincode}`}</p>
                            <p><strong>पंजीकरण तिथि:</strong> {selectedStudent.createdAt?.toDate().toLocaleDateString('hi-IN')}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!studentToDelete} onOpenChange={(open) => !open && setStudentToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>क्या आप निश्चित हैं?</AlertDialogTitle>
                        <AlertDialogDescription>
                            यह "{studentToDelete?.name}" के रिकॉर्ड को स्थायी रूप से हटा देगा। यह क्रिया पूर्ववत नहीं की जा सकती।
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setStudentToDelete(null)}>रद्द करें</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>हटाएं</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
