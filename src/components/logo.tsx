import { ShieldCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card rounded-full border-2 border-primary flex items-center justify-center p-2.5 h-16 w-16", className)}>
      <ShieldCheck className="h-full w-full text-primary" />
    </div>
  );
}
