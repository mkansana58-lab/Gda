import { ShieldCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("bg-primary text-primary-foreground rounded-full p-3 w-fit", className)}>
      <ShieldCheck className="h-10 w-10" />
    </div>
  );
}
