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
import { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  SelectValue 
} from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

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
  projectId: string;
  apps: string[];
  services: string[];
}

interface CoderBuildMessage {
  timestamp: string | Date;
  component: string;
  component_type: string;
  message: string;
  agent_name: string;
}

interface AgentComponentStatus {
  agent_name: string;
  // Backend may return either `component` or `component_type` + `component_name`
  component?: string; // e.g., app:Name or service:Name
  component_type?: 'app' | 'service' | string;
  component_name?: string;
  status?: 'idle' | 'running' | 'completed' | 'error' | string;
  has_logs?: boolean;
  has_codebase?: boolean;
  codebase_url?: string;
  error?: string | null;
}

interface DevcontainerLaunchResponse {
  status: 'already_exists' | 'created' | string;
  container_id?: string;
  port?: number;
  url?: string;
}

export function CodebaseAgentWorkflow({ projectName, projectId, apps, services }: CodebaseAgentWorkflowProps) {
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
  const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
  const [selectedComponentsByAgent, setSelectedComponentsByAgent] = useState<Record<string, string | null>>({});
  const [selectedAgentByComponent, setSelectedAgentByComponent] = useState<Record<string, string>>({});
  const [statusMap, setStatusMap] = useState<Record<string, AgentComponentStatus>>({});
  const [logsOpen, setLogsOpen] = useState(false);
  const [logsAgent, setLogsAgent] = useState<string | null>(null);
  const [logsComponent, setLogsComponent] = useState<string | null>(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsMessages, setLogsMessages] = useState<CoderBuildMessage[]>([]);

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

  const fetchStatuses = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const url = new URL(`${serverBaseUrl}/api/v1/coders/status`);
      url.searchParams.set('project_id', projectId);
      const res = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) return;
      const raw = (await res.json()) as any[];
      const next: Record<string, AgentComponentStatus> = {};
      (raw || []).forEach((item: any) => {
        const s: AgentComponentStatus = item || {};
        const normalizedComponent = s.component
          || (s.component_type && s.component_name ? `${s.component_type}:${s.component_name}` : undefined);
        if (!s.agent_name || !normalizedComponent) return;
        const key = `${s.agent_name}|${normalizedComponent}`;
        next[key] = { ...s, component: normalizedComponent } as AgentComponentStatus;
      });
      setStatusMap(next);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    const id = setInterval(() => {
      fetchStatuses();
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allowedComponentsForAgent = (agentId: Agent['id']): string[] => {
    if (agentId === 'frontend') {
      return (apps || []).map((n) => `app:${n}`);
    }
    if (agentId === 'backend') {
      return (services || []).map((n) => `service:${n}`);
    }
    // other agents can handle both
    return [
      ...(apps || []).map((n) => `app:${n}`),
      ...(services || []).map((n) => `service:${n}`),
    ];
  };

  const chooseComponentForAgent = (agentId: Agent['id']): string | null => {
    // component must be one of: app:<name> or service:<name>
    if (agentId === 'frontend') {
      return apps && apps.length > 0 ? `app:${apps[0]}` : null;
    }
    if (agentId === 'backend') {
      return services && services.length > 0 ? `service:${services[0]}` : null;
    }
    // other agents can have both; prefer app then service
    if (apps && apps.length > 0) return `app:${apps[0]}`;
    if (services && services.length > 0) return `service:${services[0]}`;
    return null;
  };

  const fetchMessagesOnce = async (
    component: string,
    agentName?: string,
  ): Promise<CoderBuildMessage[]> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const url = new URL(`${serverBaseUrl}/api/v1/coders/messages`);
    url.searchParams.set('project_id', projectId);
    url.searchParams.set('component', component);
    if (agentName) url.searchParams.set('agent_name', agentName);
    const res = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as CoderBuildMessage[];
    return Array.isArray(data) ? data : [];
  };

  const runSingleAgentBuild = async (agentId: Agent['id'], component: string) => {
    // Update agent status
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'working', currentTask: `Building ${component}`, progress: 0 }
        : agent
    ));

    const progressInterval = setInterval(() => {
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, progress: Math.min(agent.progress + Math.random() * 15, 95) }
          : agent
      ));
    }, 200);

    addLog('info', `🔨 Build started for ${component}`, agentId);

    const abortController = new AbortController();
    launchAgent(agentId, component, 'gpt-5', abortController.signal);

    const seen = new Set<string>();
    let stableCycles = 0;
    const maxCycles = 30;
    for (let cycle = 0; cycle < maxCycles; cycle++) {
      try {
        const msgs = await fetchMessagesOnce(component, agentId);
        let newCount = 0;
        msgs.forEach((m) => {
          const key = `${new Date(m.timestamp).toISOString()}|${m.agent_name}|${m.component}|${m.message}`;
          if (!seen.has(key)) {
            seen.add(key);
            newCount += 1;
            addLog('info', m.message, m.agent_name);
          }
        });
        if (newCount === 0) {
          stableCycles += 1;
        } else {
          stableCycles = 0;
        }
        if (stableCycles >= 3) break;
      } catch (e) {
        // ignore polling error on this cycle
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
    abortController.abort();

    clearInterval(progressInterval);
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'completed', progress: 100, currentTask: `Build completed: ${component}` }
        : agent
    ));
    addLog('success', `✅ Build completed for ${component}`, agentId);
    fetchStatuses();
  };

  const openLogs = async (agentId: Agent['id'], component: string) => {
    setLogsAgent(agentId);
    setLogsComponent(component);
    setLogsLoading(true);
    setLogsMessages([]);
    setLogsOpen(true);
    try {
      const msgs = await fetchMessagesOnce(component, agentId);
      setLogsMessages(msgs || []);
    } finally {
      setLogsLoading(false);
    }
  };

  const openCodebase = async (agentId: Agent['id'], component: string) => {
    try {
      addLog('info', `Launching devcontainer for ${component}...`, agentId);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const urlObj = new URL(`${serverBaseUrl}/api/v1/devcontainers/launch`);
      urlObj.searchParams.set('project_id', projectId);
      urlObj.searchParams.set('agent_name', agentId);
      urlObj.searchParams.set('component', component);
      const res = await fetch(urlObj.toString(), {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        addLog('error', `Failed to launch devcontainer for ${component}`, agentId);
        return;
      }
      const data = (await res.json()) as DevcontainerLaunchResponse;
      if (data?.url) {
        window.open(data.url, '_blank');
        addLog('success', `Devcontainer ${data.status || 'ready'} for ${component}`, agentId);
      } else {
        addLog('warning', `Devcontainer launched but no URL returned for ${component}`, agentId);
      }
    } catch (e) {
      addLog('error', `Error launching devcontainer for ${component}`, agentId);
    }
  };

  const launchAgent = async (
    agentName: Agent['id'],
    component: string,
    modelName = 'gpt-5',
    abortSignal?: AbortSignal,
  ): Promise<Response | null> => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const url = new URL(`${serverBaseUrl}/api/v1/coders/launch`);
      url.searchParams.set('project_id', projectId);
      url.searchParams.set('agent_name', agentName);
      url.searchParams.set('component', component);
      url.searchParams.set('model_name', modelName);
      // Use GET with query params; backend expects Query params
      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: abortSignal,
      });
      return res;
    } catch (e) {
      return null;
    }
  };

  const simulateAgentWork = async () => {
    setIsRunning(true);
    setBuildLogs([]);
    
    addLog('info', `🚀 Starting codebase generation for ${projectName}...`);
    
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      setCurrentPhase(phase.name);
      
      // Determine component for this agent
      const component = chooseComponentForAgent(phase.agent as Agent['id']);
      if (!component) {
        addLog('warning', `No component available for agent ${phase.agent}. Skipping.`, phase.agent);
        continue;
      }

      // Update agent status
      setAgents(prev => prev.map(agent => 
        agent.id === phase.agent 
          ? { ...agent, status: 'working', currentTask: `Working on ${phase.name}`, progress: 0 }
          : agent
      ));

      addLog('info', `📋 Phase ${i + 1}/6: ${phase.name} started for ${component}`, phase.agent);

      // Progress simulation while real work happens
      const progressInterval = setInterval(() => {
        setAgents(prev => prev.map(agent => 
          agent.id === phase.agent 
            ? { ...agent, progress: Math.min(agent.progress + Math.random() * 15, 95) }
            : agent
        ));
      }, 200);

      // Launch agent work and poll messages
      const abortController = new AbortController();
      // Fire and let it stream server-side; we poll messages instead of parsing stream
      launchAgent(phase.agent as Agent['id'], component, 'gpt-5', abortController.signal);

      const seen = new Set<string>();
      let stableCycles = 0;
      const maxCycles = 30; // ~30s at 1s interval
      for (let cycle = 0; cycle < maxCycles; cycle++) {
        // poll
        try {
          const msgs = await fetchMessagesOnce(component, phase.agent);
          let newCount = 0;
          msgs.forEach((m) => {
            const key = `${new Date(m.timestamp).toISOString()}|${m.agent_name}|${m.component}|${m.message}`;
            if (!seen.has(key)) {
              seen.add(key);
              newCount += 1;
              addLog('info', m.message, m.agent_name);
            }
          });
          if (newCount === 0) {
            stableCycles += 1;
          } else {
            stableCycles = 0;
          }
          // consider done after a few stable cycles without new messages
          if (stableCycles >= 3) break;
        } catch (e) {
          // ignore polling errors in this cycle
        }
        await new Promise((r) => setTimeout(r, 1000));
      }

      // Stop the launch request if still open
      abortController.abort();

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
      <Card className="lg:col-span-1">
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
            
            <Accordion type="single" collapsible className="w-full">
            {agents.map((agent) => {
              const options = allowedComponentsForAgent(agent.id as Agent['id']);
              const selected = selectedComponentsByAgent[agent.id] || options[0] || null;
              return (
                <AccordionItem key={agent.id} value={agent.id} className="border rounded-lg p-0">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{agent.avatar}</div>
                        <div>
                          <h4 className="font-medium">{agent.name}</h4>
                          <p className="text-sm text-muted-foreground">{agent.role}</p>
                        </div>
                      </div>
                      <AccordionTrigger className="hover:no-underline p-0">
                        <Badge className={getStatusColor(agent.status)}>
                          {agent.status}
                        </Badge>
                      </AccordionTrigger>
                    </div>
                  </div>

                  <AccordionContent>
                    <div className="px-4 pb-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <Select
                            value={selected || undefined}
                            onValueChange={(val) =>
                              setSelectedComponentsByAgent((prev) => ({ ...prev, [agent.id]: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select component" />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center">
                          <Button
                            size="sm"
                            className="w-full"
                            disabled={!selected || agent.status === 'working'}
                            onClick={() => selected && runSingleAgentBuild(agent.id as Agent['id'], selected)}
                          >
                            Build
                          </Button>
                        </div>
                      </div>

                      {/* Agent's components list with action buttons */}
                      <div className="space-y-2">
                        {(options || []).map((comp) => {
                          const statusKey = `${agent.id}|${comp}`;
                          const s = statusMap[statusKey];
                          const hasLogs = !!s?.has_logs;
                          const hasCode = !!s?.has_codebase;
                          const codeUrl = s?.codebase_url;
                          return (
                            <div key={comp} className="flex items-center gap-2">
                              <div className="flex-1 text-sm">{comp}</div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => runSingleAgentBuild(agent.id as Agent['id'], comp)}
                              >
                                Build
                              </Button>
                              {hasLogs && (
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                    const msgs = await fetchMessagesOnce(comp, agent.id);
                                    msgs.forEach((m) => addLog('info', m.message, m.agent_name));
                                  }}
                                >
                                  See Logs
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={() => openCodebase(agent.id as Agent['id'], comp)}
                              >
                                Open Codebase
                              </Button>
                            </div>
                          );
                        })}
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
                  </AccordionContent>
                </AccordionItem>
              );
            })}
            </Accordion>
          </div>
        </CardContent>
      </Card>

      {/* Components Panel removed per request */}

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

      {/* Logs Modal/Sheet */}
      <Sheet open={logsOpen} onOpenChange={setLogsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Logs for {logsComponent} {logsAgent ? `(${logsAgent})` : ''}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {logsLoading ? (
              <div className="text-sm text-muted-foreground">Loading logs...</div>
            ) : logsMessages.length === 0 ? (
              <div className="text-sm text-muted-foreground">No logs available.</div>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-auto pr-2">
                {logsMessages.map((m, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="text-xs text-muted-foreground mr-2">{new Date(m.timestamp).toLocaleTimeString()}</span>
                    <span>{m.message || ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 