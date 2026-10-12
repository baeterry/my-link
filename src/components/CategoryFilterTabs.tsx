"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CategoryFilterTabsProps<T extends string> {
  tabs: { key: T; label: string }[];
  selected: T;
  counts: Record<T, number>;
  onSelect: (key: T) => void;
  className?: string;
}

export function CategoryFilterTabs<T extends string>({
  tabs,
  selected,
  counts,
  onSelect,
  className,
}: CategoryFilterTabsProps<T>) {
  return (
    <div className={cn("no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 py-1", className)}>
      {tabs.map((tab) => {
        const count = counts[tab.key] ?? 0;
        const isSelected = selected === tab.key;
        if (tab.key !== "all" && count === 0) return null;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelect(tab.key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all active:scale-95 cursor-pointer",
              isSelected
                ? "bg-[#191F28] text-white shadow-xs"
                : "bg-white text-[#6B7684] shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:bg-[#F9FAFB] hover:text-[#191F28]"
            )}
          >
            <span>{tab.label}</span>
            <Badge
              variant="secondary"
              className={cn(
                "h-4 rounded-full px-1.5 text-[11px] font-semibold border-none",
                isSelected
                  ? "bg-white/20 text-white"
                  : "bg-[#F2F4F6] text-[#8B95A1]"
              )}
            >
              {count}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
