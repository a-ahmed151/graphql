import { cn } from "@/lib/utils";
import React from "react";

interface DigitalCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: "default" | "neon" | "glass";
    className?: string;
}

export function DigitalCard({
    children,
    variant = "default",
    className,
    ...props
}: DigitalCardProps) {
    return (
        <div
            className={cn(
                "relative rounded-xl overflow-hidden transition-all duration-300",
                // Base variants
                variant === "default" && "bg-card border border-border text-card-foreground",
                variant === "glass" && "bg-card/50 backdrop-blur-md border border-white/10 text-foreground",
                variant === "neon" && "bg-background-dark border border-primary/50 shadow-[0_0_10px_rgba(13,185,242,0.15)]",
                className
            )}
            {...props}
        >
            {/* Decorative Corner Clips if needed, or stick to rounded-xl as per Tamer design */}
            {/* For specific 'Clipped Corner' effect from HTML, we can add a child or a utility class */}

            {children}
        </div>
    );
}
