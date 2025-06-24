import { AppShell } from "@/components/app-shell";
import { ProfileEditDialog } from "@/components/profile-edit-dialog";
import { UserProvider } from "@/context/user-context";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <AppShell>
        {children}
      </AppShell>
      <ProfileEditDialog />
    </UserProvider>
  );
}
