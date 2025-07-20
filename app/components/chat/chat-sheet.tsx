"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChatDemo } from "@/app/chat/chat";
import { cn } from "@/lib/utils";
// import window

interface ChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatSheet({ open, onOpenChange }: ChatSheetProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const chatIdRef = useRef<string | null>(null);
  const [width, setWidth] = useState(400); // Default width instead of window.innerWidth
  const minWidth = 320;
  const maxWidth = 800;
  const resizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  
  // Set initial width on client side
  useEffect(() => {
    setWidth(window.innerWidth / 2);
  }, []);
  
  // If we need to load previous messages, we can add that here
  useEffect(() => {
    // Reset or load messages when sheet opens
    if (open) {
      // You could fetch chat history here if needed
    }
  }, [open]);

  const handleResize = useCallback((e: MouseEvent) => {
    if (!resizingRef.current) return;
    
    // For right side sheet, dragging left decreases width
    const delta = startXRef.current - e.clientX;
    const newWidth = Math.min(Math.max(startWidthRef.current + delta, minWidth), maxWidth);
    setWidth(newWidth);
  }, []);

  const handleResizeEnd = useCallback(() => {
    resizingRef.current = false;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", handleResizeEnd);
  }, [handleResize]);

  const handleResizeStart = (e: React.MouseEvent) => {
    resizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", handleResizeEnd);
    e.preventDefault();
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [handleResize, handleResizeEnd]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        className="p-0 flex flex-col"
        style={{ width: `${width}px`, maxWidth: `${width}px` }}
      >
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/10 z-50"
          onMouseDown={handleResizeStart}
        />
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Chat Support</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden h-[calc(100vh-80px)]">
          <ChatDemo containerStyle={{ height: "100%", display: "flex", flexDirection: "column" }} />
        </div>
      </SheetContent>
    </Sheet>
  );
} 