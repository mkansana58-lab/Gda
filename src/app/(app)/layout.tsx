import { AppShell } from "@/components/app-shell";
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
    </UserProvider>
  );
}
