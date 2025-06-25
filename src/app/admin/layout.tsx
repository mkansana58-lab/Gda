
'use client';
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState('');

  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
        setIsAdminAuthenticated(true);
        setAdminUser(storedAdmin);
    } else {
        router.replace('/admin/login');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
      localStorage.removeItem('adminUser');
      router.replace('/admin/login');
  }
  
  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-secondary">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
        </div>
    );
  }

  if (!isAdminAuthenticated) {
      return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary text-foreground">
       <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4 sm:px-6">
            <div className="flex items-center gap-2">
                <Logo className="h-10 w-10"/>
                <h1 className="text-lg font-bold font-headline">एडमिन पैनल</h1>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm hidden sm:inline">नमस्ते, {adminUser}</span>
                <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2"/>
                    लॉग आउट
                </Button>
            </div>
       </header>
       <main className="flex-1 p-4">
        {children}
       </main>
    </div>
  );
}
