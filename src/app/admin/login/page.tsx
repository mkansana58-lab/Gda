
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield } from 'lucide-react';

const ALLOWED_USERS = ['AcademyDirector77'];
const ADMIN_PASSWORD = 'Goswami@Admin#2024';

export default function AdminLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            const isUserAllowed = ALLOWED_USERS.map(u => u.toLowerCase()).includes(username.trim().toLowerCase());
            const isPasswordCorrect = password === ADMIN_PASSWORD;

            if (isUserAllowed && isPasswordCorrect) {
                localStorage.removeItem('user'); // Clear any existing student session
                localStorage.setItem('adminUser', username.trim());
                
                // Create a mock user object for the admin to browse the app
                const adminAsUser = {
                    name: username.trim(),
                    email: 'admin@goswami.com',
                    mobile: '0000000000',
                    village: 'Admin',
                    district: 'Admin',
                    pincode: '000000',
                    state: 'Admin',
                    class: 'Admin',
                    exam: 'Admin',
                    profilePhotoUrl: ''
                };
                localStorage.setItem('user', JSON.stringify(adminAsUser));

                toast({ title: 'लॉगिन सफल!', description: `एडमिन ${username.trim()} के रूप में आपका स्वागत है।` });
                router.push('/dashboard'); // Redirect to main app dashboard
            } else {
                setError('आपने गलत डिटेल डालिए। कृपया पुनः प्रयास करें।');
                toast({ variant: 'destructive', title: 'लॉगिन विफल', description: 'उपयोगकर्ता नाम या पासवर्ड गलत है।' });
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-secondary">
            <Card className="w-full max-w-sm shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full">
                        <Shield className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                        एडमिन पैनल लॉगिन
                    </CardTitle>
                    <CardDescription className="text-muted-foreground pt-2 font-semibold">
                        कृपया अपनी पहचान प्रमाणित करें।
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">उपयोगकर्ता नाम</Label>
                            <Input 
                                id="username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                placeholder="अपना उपयोगकर्ता नाम दर्ज करें"
                                required 
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="password">पासवर्ड</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="अपना पासवर्ड दर्ज करें"
                                required 
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            लॉगिन करें
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
