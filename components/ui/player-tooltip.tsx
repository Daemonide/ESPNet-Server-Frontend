"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface PlayerTooltipProps {
    children: ReactNode;
    name?: string;
    identifier?: string;
    className?: string; // Allow passing className to Trigger for flexibility
}

export function PlayerTooltip({ children, name, identifier, className }: PlayerTooltipProps) {
    if (!name) {
        return <>{children}</>;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className={className}>{children}</span>
            </TooltipTrigger>
            <TooltipContent>
                <div className="text-center">
                    <div className="font-bold">{name}</div>
                    {identifier && <div className="text-xs text-muted-foreground">{identifier}</div>}
                </div>
            </TooltipContent>
        </Tooltip>
    );
}
