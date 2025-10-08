"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TtyModal, TtyComponent } from '@/components/tty-modal';
import { Terminal, Bot } from 'lucide-react';

export default function TtyDemoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('frontend');
  const [selectedComponent, setSelectedComponent] = useState<string>('app:webapp');

  const agents = [
    { id: 'frontend', name: 'FrontendBot', avatar: '⚛️' },
    { id: 'backend', name: 'BackendBot', avatar: '🔧' },
    { id: 'security', name: 'SecurityBot', avatar: '🔒' },
    { id: 'devops', name: 'DevOpsBot', avatar: '⚙️' },
  ];

  const components = [
    'app:webapp',
    'app:dashboard', 
    'service:api',
    'service:auth'
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-[--background]">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">TTY Terminal Integration Demo</h1>
          <p className="text-muted-foreground">
            Test the TTY modal integration with coding agents
          </p>
        </div>

        {/* Embedded TTY Component */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Embedded TTY Terminal
            </CardTitle>
            <CardDescription>
              Direct embedded terminal view (like the original implementation)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-[50vh] rounded-b-xl overflow-hidden">
              <TtyComponent 
                ttyUrl="http://localhost:7681/"
                agentName="DemoAgent"
                component="app:demo"
              />
            </div>
          </CardContent>
        </Card>

        {/* Agent Selection Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Agent Terminal Modal Demo
            </CardTitle>
            <CardDescription>
              Click on agents to open their terminal in a modal/sheet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {agents.map((agent) => (
                <Button
                  key={agent.id}
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2"
                  onClick={() => {
                    setSelectedAgent(agent.id);
                    setModalOpen(true);
                  }}
                >
                  <span className="text-2xl">{agent.avatar}</span>
                  <span className="text-sm">{agent.name}</span>
                </Button>
              ))}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Component Selection:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {components.map((component) => (
                    <Button
                      key={component}
                      variant={selectedComponent === component ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedComponent(component)}
                    >
                      {component}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={() => setModalOpen(true)}
                className="w-full flex items-center gap-2"
              >
                <Terminal className="h-4 w-4" />
                Open {agents.find(a => a.id === selectedAgent)?.name} Terminal for {selectedComponent}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. <strong>Embedded Terminal:</strong> Shows the terminal directly embedded in the page</p>
            <p>2. <strong>Modal Terminal:</strong> Click any agent or the main button to open terminal in a sheet/modal</p>
            <p>3. <strong>Fullscreen Mode:</strong> Use the maximize button in the terminal header to go fullscreen</p>
            <p>4. <strong>Different URLs:</strong> The component supports different TTY URLs for different agents/components</p>
            <p className="text-muted-foreground mt-4">
              <strong>Note:</strong> Make sure ttyd is running on localhost:7681 for the terminal to work properly.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TTY Modal */}
      <TtyModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        agentName={agents.find(a => a.id === selectedAgent)?.name}
        component={selectedComponent}
        ttyUrl="http://localhost:7681/"
        mode="sheet"
      />
    </div>
  );
}
