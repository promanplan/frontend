"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { ChatButton } from "./chat-button";
import { ChatSheet } from "./chat-sheet";

interface GlobalChatProps {
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export function GlobalChat({ 
  className,
  position = "bottom-right"
}: GlobalChatProps) {
  const [open, setOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Example: Check for unread messages
    // This would be replaced with your actual implementation
    const checkUnreadMessages = async () => {
      // Mock implementation - replace with actual API call
      setTimeout(() => {
        setHasUnreadMessages(true);
        setUnreadCount(1);
      }, 5000);
    };

    checkUnreadMessages();
  }, []);

  // Reset unread count when opening the chat
  useEffect(() => {
    if (open) {
      setHasUnreadMessages(false);
      setUnreadCount(0);
    }
  }, [open]);

  // Position classes
  const positionClasses = {
    "bottom-right": "fixed bottom-4 right-4 z-40",
    "bottom-left": "fixed bottom-4 left-4 z-40",
    "top-right": "fixed top-20 right-4 z-40",
    "top-left": "fixed top-20 left-4 z-40",
  };

  return (
    <>
      <div className={positionClasses[position]}>
        <ChatButton 
          hasUnreadMessages={hasUnreadMessages}
          unreadCount={unreadCount}
          onClick={() => setOpen(true)}
          className={className}
        />
      </div>
      <ChatSheet open={open} onOpenChange={setOpen} />
    </>
  );
} 