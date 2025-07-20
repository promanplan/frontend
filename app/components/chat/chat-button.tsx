"use client";

import * as React from "react";
import { MessageSquareText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  hasUnreadMessages?: boolean;
  unreadCount?: number;
  onClick?: () => void;
}

export function ChatButton({
  hasUnreadMessages = false,
  unreadCount = 0,
  onClick,
  className,
  ...props
}: ChatButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "relative rounded-full",
        hasUnreadMessages ? "animate-pulse" : "",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <MessageSquareText className="h-5 w-5" />
      {hasUnreadMessages && unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  );
} 