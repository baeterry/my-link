"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LinkItem } from "@/types/profile";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeleteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: LinkItem | null;
  onConfirmDelete: (id: string) => Promise<void>;
}

export function DeleteLinkDialog({
  open,
  onOpenChange,
  link,
  onConfirmDelete,
}: DeleteLinkDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!link) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirmDelete(link.id);
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("삭제 실패:", err);
      setError((err as Error)?.message || "삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isDeleting && onOpenChange(val)}>
      <DialogContent className="max-w-[400px] rounded-3xl p-6 sm:max-w-[420px]">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0F0] text-[#F04452]">
            <Trash2 className="h-6 w-6 stroke-[2.2]" />
          </div>
          <DialogTitle className="text-[19px] font-bold text-[#191F28]">
            정말 삭제하시겠습니까?
          </DialogTitle>
          <DialogDescription className="sr-only">
            링크 삭제 확인 대화상자입니다.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 space-y-3">
          {/* 링크 이름 표시 영역 */}
          <div className="rounded-2xl border border-[#F2F4F6] bg-[#F9FAFB] p-3.5 text-left">
            <span className="block text-[11px] font-semibold text-[#8B95A1]">
              삭제할 링크 이름
            </span>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="truncate text-[15px] font-bold text-[#191F28]">
                {link.title}
              </span>
              {link.badge && (
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    link.badgeColor || "bg-[#E8F3FF] text-[#3182F6]"
                  }`}
                >
                  {link.badge}
                </span>
              )}
            </div>
            {link.url && (
              <p className="mt-1 truncate text-[12px] text-[#8B95A1]">
                {link.url}
              </p>
            )}
          </div>

          {/* 경고 문구: 빨간색 */}
          <div className="flex items-center justify-center gap-1.5 text-center">
            <AlertTriangle className="h-4 w-4 text-[#F04452]" />
            <span className="text-[13px] font-semibold text-[#F04452]">
              이 작업은 되돌릴 수 없습니다
            </span>
          </div>

          {error && (
            <div className="rounded-xl bg-[#FFF0F0] p-2.5 text-center text-[12px] font-medium text-[#F04452]">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2 flex flex-row gap-2 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="flex-1 rounded-2xl bg-[#F2F4F6] py-3 text-[14px] font-semibold text-[#4E5968] hover:bg-[#E5E8EB] active:scale-95"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 rounded-2xl bg-[#F04452] py-3 text-[14px] font-semibold text-white hover:bg-[#dc3545] active:scale-95 shadow-none"
          >
            {isDeleting ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>삭제 중...</span>
              </span>
            ) : (
              "삭제하기"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
