"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/Shadcn/dialog";
import Button from "@/Components/Shadcn/button";

interface iDeleteConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  confirmText?: string;
  confirmLoadingText?: string;
  cancelText?: string;
}

export default function DeleteConfirmation({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading = false,
  confirmText = "Delete",
  confirmLoadingText,
  cancelText = "Cancel",
}: iDeleteConfirmationProps) {
  const handleConfirm = async () => {
    try {
      await Promise.resolve(onConfirm())
      onOpenChange(false)
    } catch {
      // Keep dialog open on error so user can retry or cancel
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && confirmLoadingText ? confirmLoadingText : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
