
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ClipboardCheck } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface Enrollee {
    id: string;
    name: string;
    mobile: string;
    email: string;
    class: string;
    profilePhotoUrl?: string;
    enrolledAt: Timestamp;
}

export function AiTestEnrollees() {
    const { toast } = useToast();
    const [enrollees, setEnrollees] = useState<Enrollee[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "aiTestEnrollees"), orderBy("enrolledAt", "desc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const enrolleeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollee));
            setEnrollees(enrolleeData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching AI test enrollees:", error);
            toast({ variant: 'destructive', title: 'त्रुटि', description: 'AI टेस्ट नामांकन लोड करने में विफल।' });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ClipboardCheck /> AI टेस्ट नामांकन</CardTitle>
                <CardDescription>AI टेस्ट के लिए नामांकित सभी छात्रों की सूची।</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-x-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : enrollees.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">अभी तक कोई नामांकन नहीं हुआ है।</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>फोटो</TableHead>
                                <TableHead>नाम</TableHead>
                                <TableHead className="hidden sm:table-cell">मोबाइल</TableHead>
                                <TableHead className="hidden md:table-cell">कक्षा</TableHead>
                                <TableHead className="text-right">नामांकन तिथि</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enrollees.map(enrollee => (
                                <TableRow key={enrollee.id}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={enrollee.profilePhotoUrl} />
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">{enrollee.name}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{enrollee.mobile}</TableCell>
                                    <TableCell className="hidden md:table-cell">{enrollee.class}</TableCell>
                                    <TableCell className="text-right text-xs">{enrollee.enrolledAt?.toDate().toLocaleDateString('hi-IN')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">कुल नामांकन: {enrollees.length}</p>
            </CardFooter>
        </Card>
    );
}
