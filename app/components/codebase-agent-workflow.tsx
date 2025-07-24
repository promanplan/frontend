'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Cpu, 
  FileCode, 
  GitCommit, 
  Terminal,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'completed' | 'error';
  currentTask: string;
  progress: number;
  avatar: string;
}

interface BuildLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  agent?: string;
}

interface CodebaseAgentWorkflowProps {
  projectName: string;
}

export function CodebaseAgentWorkflow({ projectName }: CodebaseAgentWorkflowProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'frontend',
      name: 'FrontendBot',
      role: 'Frontend Developer',
      status: 'idle',
      currentTask: 'Ready to build UI components',
      progress: 0,
      avatar: '⚛️'
    },
    {
      id: 'backend',
      name: 'BackendBot',
      role: 'Backend Developer',
      status: 'idle',
      currentTask: 'Standing by for API development',
      progress: 0,
      avatar: '🔧'
    },
    {
      id: 'security',
      name: 'SecurityBot',
      role: 'Security Engineer',
      status: 'idle',
      currentTask: 'Preparing security audits',
      progress: 0,
      avatar: '🔒'
    },
    {
      id: 'devops',
      name: 'DevOpsBot',
      role: 'DevOps Engineer',
      status: 'idle',
      currentTask: 'Setting up CI/CD pipelines',
      progress: 0,
      avatar: '⚙️'
    },
    {
      id: 'tester',
      name: 'TesterBot',
      role: 'QA Engineer',
      status: 'idle',
      currentTask: 'Preparing test suites',
      progress: 0,
      avatar: '🧪'
    },
    {
      id: 'cloud',
      name: 'CloudBot',
      role: 'Cloud Engineer',
      status: 'idle',
      currentTask: 'Configuring cloud infrastructure',
      progress: 0,
      avatar: '☁️'
    }
  ]);

  const [buildLogs, setBuildLogs] = useState<BuildLog[]>([]);
  const [currentPhase, setCurrentPhase] = useState('idle');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const phases = [
    { name: 'Frontend Development', duration: 5000, agent: 'frontend' },
    { name: 'Backend Development', duration: 4000, agent: 'backend' },
    { name: 'Security Implementation', duration: 3500, agent: 'security' },
    { name: 'DevOps Setup', duration: 3000, agent: 'devops' },
    { name: 'Testing', duration: 3000, agent: 'tester' },
    { name: 'Cloud Deployment', duration: 4000, agent: 'cloud' }
  ];

  const addLog = (level: BuildLog['level'], message: string, agent?: string) => {
    const newLog: BuildLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      agent
    };
    setBuildLogs(prev => [...prev, newLog]);
  };

  const simulateAgentWork = async () => {
    setIsRunning(true);
    setBuildLogs([]);
    
    addLog('info', `🚀 Starting codebase generation for ${projectName}...`);
    
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      setCurrentPhase(phase.name);
      
      // Update agent status
      setAgents(prev => prev.map(agent => 
        agent.id === phase.agent 
          ? { ...agent, status: 'working', currentTask: `Working on ${phase.name}`, progress: 0 }
          : agent
      ));

      addLog('info', `📋 Phase ${i + 1}/6: ${phase.name} started`, phase.agent);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setAgents(prev => prev.map(agent => 
          agent.id === phase.agent 
            ? { ...agent, progress: Math.min(agent.progress + Math.random() * 15, 95) }
            : agent
        ));
      }, 200);

      // Add realistic build logs during the phase
      const logMessages = getPhaseMessages(phase.name, projectName);
      for (let j = 0; j < logMessages.length; j++) {
        await new Promise(resolve => setTimeout(resolve, phase.duration / logMessages.length));
        addLog(logMessages[j].level, logMessages[j].message, phase.agent);
      }

      clearInterval(progressInterval);
      
      // Complete the phase
      setAgents(prev => prev.map(agent => 
        agent.id === phase.agent 
          ? { ...agent, status: 'completed', progress: 100, currentTask: `${phase.name} completed` }
          : agent
      ));

      addLog('success', `✅ ${phase.name} completed successfully`, phase.agent);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    addLog('success', `🎉 Codebase generation completed! All agents finished their tasks.`);
    setCurrentPhase('completed');
    setIsRunning(false);
  };

  const getPhaseMessages = (phaseName: string, projectName: string) => {
    const messages: { level: BuildLog['level'], message: string }[] = [];
    
    switch (phaseName) {
      case 'Frontend Development':
        messages.push(
          { level: 'info', message: '⚛️ Initializing React application...' },
          { level: 'info', message: '🎨 Creating UI components...' },
          { level: 'info', message: '📱 Implementing responsive design...' },
          { level: 'info', message: '🔗 Setting up routing...' },
          { level: 'success', message: '✨ Frontend components generated!' }
        );
        break;
      case 'Backend Development':
        messages.push(
          { level: 'info', message: '🔧 Setting up Express server...' },
          { level: 'info', message: '🗄️ Configuring database connections...' },
          { level: 'info', message: '🛡️ Implementing authentication...' },
          { level: 'info', message: '📡 Creating API endpoints...' },
          { level: 'success', message: '🚀 Backend services ready!' }
        );
        break;
      case 'Security Implementation':
        messages.push(
          { level: 'info', message: '🔒 Implementing security headers...' },
          { level: 'info', message: '🛡️ Setting up input validation...' },
          { level: 'info', message: '🔐 Configuring encryption...' },
          { level: 'info', message: '🚨 Running security scans...' },
          { level: 'success', message: '🔒 Security measures implemented!' }
        );
        break;
      case 'DevOps Setup':
        messages.push(
          { level: 'info', message: '⚙️ Creating CI/CD pipelines...' },
          { level: 'info', message: '🐳 Setting up Docker containers...' },
          { level: 'info', message: '📊 Configuring monitoring...' },
          { level: 'success', message: '⚙️ DevOps infrastructure ready!' }
        );
        break;
      case 'Testing':
        messages.push(
          { level: 'info', message: '🧪 Writing unit tests...' },
          { level: 'info', message: '🔍 Running integration tests...' },
          { level: 'warning', message: '⚠️ Minor test failures found, fixing...' },
          { level: 'success', message: '✅ All tests passing!' }
        );
        break;
      case 'Cloud Deployment':
        messages.push(
          { level: 'info', message: '☁️ Provisioning cloud resources...' },
          { level: 'info', message: '📦 Building production bundle...' },
          { level: 'info', message: '🌐 Deploying to cloud services...' },
          { level: 'info', message: '🔧 Configuring load balancers...' },
          { level: 'success', message: '🌐 Application deployed successfully!' }
        );
        break;
    }
    
    return messages;
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentPhase('idle');
    setBuildLogs([]);
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'idle',
      progress: 0,
      currentTask: agent.id === 'frontend' ? 'Ready to build UI components' : 
                   agent.id === 'backend' ? 'Standing by for API development' :
                   agent.id === 'security' ? 'Preparing security audits' :
                   agent.id === 'devops' ? 'Setting up CI/CD pipelines' :
                   agent.id === 'tester' ? 'Preparing test suites' :
                   'Configuring cloud infrastructure'
    })));
  };

  useEffect(() => {
    if (scrollAreaRef.current && isRunning && buildLogs.length > 0) {
      // Scroll to bottom of the scroll area, not the entire page
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [buildLogs, isRunning]);

  const getLogIcon = (level: BuildLog['level']) => {
    switch (level) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'working': return 'bg-blue-500/10 text-blue-500';
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'error': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Agent Status Panel */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Agents Workflow
            </CardTitle>
            <CardDescription>
              Autonomous agents generating your codebase
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={simulateAgentWork}
              disabled={isRunning}
              size="sm"
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Build
                </>
              )}
            </Button>
            <Button
              onClick={resetSimulation}
              disabled={isRunning}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentPhase !== 'idle' && currentPhase !== 'completed' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Current Phase: {currentPhase}</span>
                  <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
                </div>
              </div>
            )}
            
            {agents.map((agent) => (
              <div key={agent.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{agent.avatar}</div>
                    <div>
                      <h4 className="font-medium">{agent.name}</h4>
                      <p className="text-sm text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm">{agent.currentTask}</p>
                </div>
                
                {agent.status === 'working' && (
                  <div className="space-y-2">
                    <Progress value={agent.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(agent.progress)}% complete
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Build Logs Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Build Logs
          </CardTitle>
          <CardDescription>
            Real-time logs from the agent workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] w-full" ref={scrollAreaRef}>
            <div className="space-y-2">
              {buildLogs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No build logs yet. Start the workflow to see agent activity.</p>
                </div>
              ) : (
                buildLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 text-sm"
                  >
                    <div className="mt-0.5">
                      {getLogIcon(log.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp}
                        </span>
                        {log.agent && (
                          <Badge variant="outline" className="text-xs">
                            {log.agent}
                          </Badge>
                        )}
                      </div>
                      <p className="break-words">{log.message}</p>
                    </div>
                  </div>
                ))
              )}

            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 