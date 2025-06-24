import { ShieldCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card text-primary-foreground rounded-full p-3 w-fit border-2 border-primary", className)}>
      <ShieldCheck className="h-10 w-10 text-primary" />
    </div>
  );
}
