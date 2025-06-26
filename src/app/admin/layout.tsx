'use client';
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, LogOut, LayoutDashboard } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState('');

  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
        setIsAdminAuthenticated(true);
        setAdminUser(storedAdmin);
    } else if (pathname !== '/admin/login') {
        router.replace('/admin/login');
    }
    setIsLoading(false);
  }, [router, pathname]);

  const handleLogout = () => {
      localStorage.removeItem('adminUser');
      localStorage.removeItem('user'); // Also clear the user session
      router.replace('/admin/login');
  }

  // If on the login page, don't show the main admin layout to avoid redirect loops
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-secondary">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
        </div>
    );
  }

  if (!isAdminAuthenticated) {
      return null; // Return null or a loader while redirecting
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary text-foreground">
       <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4 sm:px-6">
            <div className="flex items-center gap-2">
                <Logo className="h-10 w-10"/>
                <h1 className="text-lg font-bold font-headline shrink-0">एडमिन पैनल</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-sm hidden sm:inline">नमस्ते, {adminUser}</span>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">छात्र डैशबोर्ड</span>
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">लॉग आउट</span>
                </Button>
            </div>
       </header>
       <main className="flex-1 p-4">
        {children}
       </main>
    </div>
  );
}
