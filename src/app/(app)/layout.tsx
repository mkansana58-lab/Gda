
'use client';
import { AppShell } from "@/components/app-shell";
import { ProfileEditDialog } from "@/components/profile-edit-dialog";
import { UserProvider } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.replace('/login');
    }
  }, [router]);
  
  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <UserProvider>
      <AppShell>
        {children}
      </AppShell>
      <ProfileEditDialog />
    </UserProvider>
  );
}

    