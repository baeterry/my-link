"use client";

import React from "react";
import {
  ChevronRight,
  Copy,
  Video,
  ShoppingBag,
  Globe,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";
import { LinkItem } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LinkCardItemProps {
  link: LinkItem;
  onCopy?: (url: string, title: string) => void;
  className?: string;
  showUrl?: boolean;
}

export function getLinkItemIcon(iconType?: string) {
  switch (iconType) {
    case "video":
      return <Video className="h-5 w-5 text-[#3182F6]" />;
    case "shopping":
      return <ShoppingBag className="h-5 w-5 text-[#F04452]" />;
    case "message":
      return <MessageCircle className="h-5 w-5 text-[#FF9E00]" />;
    case "globe":
      return <Globe className="h-5 w-5 text-[#04C056]" />;
    default:
      return <LinkIcon className="h-5 w-5 text-[#4E5968]" />;
  }
}

export function LinkCardItem({
  link,
  onCopy,
  className,
  showUrl = true,
}: LinkCardItemProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center justify-between px-5 py-4 transition-colors hover:bg-neutral-50 active:bg-neutral-100",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        {/* Icon Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F2F4F6] transition-transform duration-150 group-hover:scale-105 group-hover:bg-white group-hover:shadow-xs">
          {getLinkItemIcon(link.iconType)}
        </div>

        {/* Text Stack */}
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-2">
            <span className="truncate text-[15px] font-semibold text-[#191F28] transition-colors group-hover:text-[#3182F6]">
              {link.title}
            </span>
            {link.badge && (
              <Badge
                variant="secondary"
                className={cn(
                  "h-5 shrink-0 px-2 text-[10px] font-semibold",
                  link.badgeColor || "bg-[#E8F3FF] text-[#3182F6]"
                )}
              >
                {link.badge}
              </Badge>
            )}
          </div>

          {link.subtitle && (
            <p className="mt-0.5 truncate text-[13px] text-[#8B95A1]">
              {link.subtitle}
            </p>
          )}

          {showUrl && (
            <p className="mt-1 truncate text-[11px] text-[#B0B8C1]">
              {link.url}
            </p>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {onCopy && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCopy(link.url, link.title);
            }}
            title="URL 복사"
            className="h-8 w-8 rounded-full text-[#8B95A1] opacity-60 hover:opacity-100 hover:bg-[#E5E8EB] active:scale-90 transition-all"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
        <ChevronRight className="h-5 w-5 text-[#B0B8C1] transition duration-150 group-hover:translate-x-0.5 group-hover:text-[#3182F6]" />
      </div>
    </a>
  );
}
