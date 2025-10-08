"use client";

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Terminal, Maximize2, Minimize2, X } from 'lucide-react';

interface TtyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentName?: string;
  component?: string;
  ttyUrl?: string;
  mode?: 'sheet' | 'dialog';
}

interface TtyComponentProps {
  ttyUrl: string;
  agentName?: string;
  component?: string;
  onClose?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

function TtyComponent({ 
  ttyUrl, 
  agentName, 
  component, 
  onClose, 
  isFullscreen = false, 
  onToggleFullscreen 
}: TtyComponentProps) {
  return (
    <div className={`flex flex-col ${isFullscreen ? 'h-screen' : 'h-[70vh] sm:h-[80vh]'}`}>
      {/* Terminal Header */}
      <div className="h-10 flex items-center px-4 gap-3 bg-[#1b1b1b] border-b border-black/20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3.5 w-3.5 rounded-full bg-[#ff5f56]" />
          <span className="inline-block h-3.5 w-3.5 rounded-full bg-[#ffbd2e]" />
          <span className="inline-block h-3.5 w-3.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="ml-3 text-xs text-neutral-400 truncate flex-1">
          {agentName && component 
            ? `${agentName} — ${component} — ${ttyUrl}` 
            : `ttyd — ${ttyUrl}`
          }
        </div>
        <div className="flex items-center gap-2">
          {onToggleFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullscreen}
              className="h-6 w-6 p-0 text-neutral-400 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-neutral-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className="relative flex-1 bg-black">
        <iframe
          title={`TTY - ${agentName || 'Terminal'}`}
          src={ttyUrl}
          className="absolute inset-0 w-full h-full"
          style={{ border: "none", backgroundColor: "#000" }}
          allow="clipboard-read; clipboard-write; fullscreen; autoplay"
          referrerPolicy="no-referrer"
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-downloads"
        />
      </div>
    </div>
  );
}

export function TtyModal({ 
  open, 
  onOpenChange, 
  agentName, 
  component, 
  ttyUrl = "http://localhost:7681/", 
  mode = 'sheet' 
}: TtyModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const title = agentName && component 
    ? `${agentName} Terminal - ${component}`
    : 'Agent Terminal';

  if (mode === 'dialog' || isFullscreen) {
    return (
      <Drawer open={open && isFullscreen} onOpenChange={(open: boolean) => {
        if (!open) {
          setIsFullscreen(false);
          onOpenChange(false);
        }
      }}>
        <DrawerContent className="max-w-[95vw] max-h-[95vh] p-0 gap-0">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <TtyComponent 
            ttyUrl={ttyUrl}
            agentName={agentName}
            component={component}
            isFullscreen={true}
            onToggleFullscreen={handleToggleFullscreen}
            onClose={() => {
              setIsFullscreen(false);
              onOpenChange(false);
            }}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <>
      <Sheet open={open && !isFullscreen} onOpenChange={onOpenChange}>
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-4xl p-0 flex flex-col gap-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <TtyComponent 
            ttyUrl={ttyUrl}
            agentName={agentName}
            component={component}
            isFullscreen={false}
            onToggleFullscreen={handleToggleFullscreen}
            onClose={() => onOpenChange(false)}
          />
        </SheetContent>
      </Sheet>
      
      {/* Fullscreen Drawer */}
      <Drawer open={isFullscreen} onOpenChange={(open: boolean) => {
        if (!open) {
          setIsFullscreen(false);
        }
      }}>
        <DrawerContent className="max-w-[95vw] max-h-[95vh] p-0 gap-0">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <TtyComponent 
            ttyUrl={ttyUrl}
            agentName={agentName}
            component={component}
            isFullscreen={true}
            onToggleFullscreen={handleToggleFullscreen}
            onClose={() => {
              setIsFullscreen(false);
            }}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}

// Export individual components for flexibility
export { TtyComponent };
