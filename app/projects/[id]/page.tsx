'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  FileText, 
  Layers, 
  Info, 
  AppWindow, 
  Cable,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { AppSidebar, SidebarNavItem } from "@/components/app-sidebar";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { RequireAuth } from "@/components/require-auth";



// Types for project and member
interface Project {
  _id: string;
  name: string;
  status: string;
  description: string;
  createdAt: string | Date;
  qa: any;  
  updatedAt: string | Date;
  apps: Array<{
    _id?: string;
    name: string;
    description: string;
    icon: string;
    created_at: string | Date;
    updated_at: string | Date;
    comments: any[];
  }>;
  integrations: Array<{
    _id?: string;
    name: string;
    description: string;
    icon: string;
    created_at: string | Date;
    updated_at: string | Date;
    comments: any[];
  }>;
  services: Array<{
    _id?: string;
    name: string;
    description: string;
    usage: string;
    comments: any[];
    created_at: string | Date;
    updated_at: string | Date;
  }>;
  documents: Array<{
    name: string;
    updatedAt: string | Date;
    createdAt: string | Date;
    file: string;
  }>;
  members: string[];
}
// # list of project
interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id ? String(params.id) : '1'; // Default to '1' if id is null
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjectAndMembers = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`
        };

        const ProjectsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/`, { headers: headers});
        if (ProjectsRes.status === 401 || ProjectsRes.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }
        if (ProjectsRes.ok) {
          const ProjectsData = await ProjectsRes.json();
          setProjects(ProjectsData);
        } else {
          console.error('Failed to fetch projects');
        }
        
        
        // Fetch project details
         // Fetch members
       
        const projectRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId} `, {
          headers: headers
        });
        if (projectRes.status === 401 || projectRes.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }
        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject(projectData);
        } else {
          console.error('Failed to fetch project details');
        }
       
        const membersRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/members/info`, { headers: headers});
        if (membersRes.status === 401 || membersRes.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }
        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData);
        } else {
          console.error('Failed to fetch members info');
        }
      } catch (error) {
        console.error('Error fetching project or members:', error);
      }
    };
    fetchProjectAndMembers();
  }, [projectId, router]);

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  };

  if (!project) {
    return <div className="p-8 text-center">Loading project...</div>;
  }

  // Construct versions and navMain for the sidebar
  // For demo, versions could be a list of project names or ids
  // navMain can be constructed from project data
  const versions = projects.map(project => project.name); // You can fetch all projects for a real list
  const navMain: SidebarNavItem[] = [
    {
      title: "Project Overview",
      url: `/projects/${project._id}`,
      items: [],
    },
    {
      title: "Apps",
      url: `/projects/${projectId}/apps`,
      items: project.apps?.map(app => ({
        title: app.name,
        url: `/projects/${projectId}/apps/${app._id}`, // You can link to a real app page if available
        isActive: false,
      })) || [],
    },
    {
      title: "Integrations",
      url: `/projects/${projectId}/integrations`,
      items: project.integrations?.map(integration => ({
        title: integration.name,
        url: `/projects/${projectId}/integrations/${integration._id}`, // You can link to a real integration page if available
        isActive: false,
      })) || [],
    },
    {
      title: "Services",
      url: `/projects/${projectId}/services`,
      items: project.services?.map(service => ({
        title: service.name,
        url: `/projects/${projectId}/services/${service._id}`, // You can link to a real service page if available
        isActive: false,
      })) || [],
    },
    {
      title: "Members",
      url: `/projects/${projectId}/members`,
      items: members.map(member => ({
        title: member.name,
        url: `/projects/${projectId}/members/${member.id}`, // You can link to a real member page if available
        isActive: false,
      })) || [],
    },
    {
      title: "Settings",
      url: `/projects/${projectId}/settings`,
      items: [],
    },
  ];

  return (
    <RequireAuth>
    <TooltipProvider>
    <SidebarProvider>
      <AppSidebar versions={versions} navMain={navMain} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{project.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center space-x-2">
            <Badge className={project.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
            <Button size="sm">Edit Project</Button>
          </div>
        </header>

        <main className="p-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Info className="h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="apps-services" className="flex items-center gap-2">
                <AppWindow className="h-4 w-4" /> Apps & Services
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1 cursor-help">
                      <svg className="h-3 w-3 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-blue-500">🔹 App (Application)</h4>
                        <p className="text-sm mt-1">A complete piece of software that users interact with directly:</p>
                        <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
                          <li>Web app (e.g., Gmail, Trello)</li>
                          <li>Mobile app (e.g., WhatsApp, Instagram)</li>
                          <li>Desktop app (e.g., Slack, VS Code)</li>
                        </ul>
                        <p className="text-xs mt-2"><strong>Key:</strong> Has UI, addresses full user-facing use cases</p>
                      </div>
                      <div className="border-t pt-3">
                        <h4 className="font-semibold text-green-500">🔹 Service</h4>
                        <p className="text-sm mt-1">Backend component that performs specific tasks:</p>
                        <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
                          <li>Authentication Service</li>
                          <li>Notification Service</li>
                          <li>Search Service</li>
                        </ul>
                        <p className="text-xs mt-2"><strong>Key:</strong> Exposes APIs, no UI, reusable across apps</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Cable className="h-4 w-4" /> Integrations
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1 cursor-help">
                      <svg className="h-3 w-3 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-purple-500">🔹 Integrations</h4>
                      <p className="text-sm">External services and tools that connect to your project:</p>
                      <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
                        <li>Third-party APIs (Stripe, SendGrid)</li>
                        <li>Cloud services (AWS, Google Cloud)</li>
                        <li>Communication tools (Slack, Discord)</li>
                        <li>Monitoring services (Datadog, Sentry)</li>
                      </ul>
                      <p className="text-xs mt-2"><strong>Purpose:</strong> Extend functionality without building everything from scratch</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Documents
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1 cursor-help">
                      <svg className="h-3 w-3 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-orange-500">🔹 Documents</h4>
                      <p className="text-sm">Project files, documentation, and resources:</p>
                      <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
                        <li><strong>API Documentation</strong> - OpenAPI/Swagger specs</li>
                        <li><strong>Architecture Diagrams</strong> - BPMN, Mermaid charts</li>
                        <li><strong>Technical Docs</strong> - README, setup guides</li>
                        <li><strong>Design Files</strong> - Mockups, wireframes</li>
                        <li><strong>Contracts</strong> - Legal documents, agreements</li>
                      </ul>
                      <p className="text-xs mt-2"><strong>Purpose:</strong> Centralized storage for all project-related files</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Members
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1 cursor-help">
                      <svg className="h-3 w-3 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-indigo-500">🔹 Team Members</h4>
                      <p className="text-sm">People with access to this project:</p>
                      <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
                        <li><strong>Project Owner</strong> - Full control and management</li>
                        <li><strong>Developers</strong> - Code, deploy, configure</li>
                        <li><strong>QA Engineers</strong> - Testing and quality assurance</li>
                        <li><strong>DevOps Engineers</strong> - Infrastructure and deployment</li>
                        <li><strong>Stakeholders</strong> - View-only access</li>
                      </ul>
                      <p className="text-xs mt-2"><strong>Purpose:</strong> Manage team access and collaboration</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>Overview of {project.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-1">Created</h4>
                      <p className="font-semibold">{formatDate(project.createdAt)}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-1">Apps</h4>
                      <p className="font-semibold">{project.apps?.length ?? 0}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-1">Integrations</h4>
                      <p className="font-semibold">{project.integrations?.length ?? 0}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-1">Team</h4>
                      <p className="font-semibold">{members.length || project.members?.length || 0} Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mr-4">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Document Updated</p>
                          <p className="text-sm text-muted-foreground">API Documentation.md was updated by Alex Johnson</p>
                          <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mr-4">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">New Member Added</p>
                          <p className="text-sm text-muted-foreground">Casey Williams joined as QA Engineer</p>
                          <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mr-4">
                          <AppWindow className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">App Added</p>
                          <p className="text-sm text-muted-foreground">Added Communication Hub app to the project</p>
                          <p className="text-xs text-muted-foreground mt-1">5 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {members.slice(0, 3).map(member => (
                        <div key={member.id} className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      ))}
                      {members.length > 3 && (
                        <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setActiveTab('members')}>
                          View all {members.length} members
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Apps & Services Tab */}
            <TabsContent value="apps-services" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Apps
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm p-3">
                          <div>
                            <h4 className="font-semibold text-blue-500 mb-2">🔹 What is an App?</h4>
                            <p className="text-sm">Complete software that users interact with directly. Examples:</p>
                            <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
                              <li><strong>Instagram</strong> - includes image upload, notifications, auth services</li>
                              <li><strong>Gmail</strong> - email client with multiple backend services</li>
                              <li><strong>VS Code</strong> - desktop editor with extensions</li>
                            </ul>
                            <p className="text-xs mt-2"><strong>Key:</strong> Has user interface, addresses complete use cases</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>Applications running in this project</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.apps?.map(app => (
                      <Card key={app._id || app.name} className="cursor-pointer hover:border-primary/50 transition-colors">
                        <CardContent className="pt-6">
                          <div className="flex items-center mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 mr-3">
                              <AppWindow className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-medium">{app.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{app.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Services
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm p-3">
                          <div>
                            <h4 className="font-semibold text-green-500 mb-2">🔹 What is a Service?</h4>
                            <p className="text-sm">Backend component that performs specific tasks. Examples:</p>
                            <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
                              <li><strong>Auth0</strong> - handles login/signup/identity</li>
                              <li><strong>SendGrid</strong> - sends emails and notifications</li>
                              <li><strong>Elasticsearch</strong> - handles search and indexing</li>
                            </ul>
                            <p className="text-xs mt-2"><strong>Key:</strong> Exposes APIs, no UI, reusable across multiple apps</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>Active services in this project</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                        <tr>
                          <th scope="col" className="px-6 py-3">Service Name</th>
                          <th scope="col" className="px-6 py-3">Status</th>
                          <th scope="col" className="px-6 py-3">Usage</th>
                          <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.services?.map(service => (
                          <tr key={service._id || service.name} className="bg-background border-b">
                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                              {service.name}
                            </th>
                            <td className="px-6 py-4">
                              <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-full bg-muted rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full" 
                                    style={{ width: service.usage }}
                                  ></div>
                                </div>
                                <span>{service.usage}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Button variant="ghost" size="sm">Configure</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Integrations
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm p-3">
                          <div>
                            <h4 className="font-semibold text-purple-500 mb-2">🔹 What are Integrations?</h4>
                            <p className="text-sm">External services and tools that connect to your project:</p>
                            <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
                              <li><strong>Payment:</strong> Stripe, PayPal</li>
                              <li><strong>Cloud:</strong> AWS, Google Cloud, Azure</li>
                              <li><strong>Communication:</strong> Slack, Discord, Email</li>
                              <li><strong>Monitoring:</strong> Datadog, Sentry, New Relic</li>
                            </ul>
                            <p className="text-xs mt-2"><strong>Purpose:</strong> Extend functionality without building everything from scratch</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>External services connected to this project</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.integrations?.map(integration => (
                      <Card key={integration._id || integration.name} className="cursor-pointer hover:border-primary/50 transition-colors">
                        <CardContent className="pt-6">
                          <div className="flex items-center mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 mr-3">
                              <Cable className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-medium">{integration.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Documents
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm p-3">
                          <div>
                            <h4 className="font-semibold text-orange-500 mb-2">🔹 Project Documents</h4>
                            <p className="text-sm">Centralized storage for all project files:</p>
                            <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
                              <li><strong>API Docs</strong> - OpenAPI/Swagger specifications</li>
                              <li><strong>Architecture</strong> - BPMN workflows, Mermaid diagrams</li>
                              <li><strong>Technical</strong> - README, setup guides, deployment docs</li>
                              <li><strong>Design</strong> - Mockups, wireframes, UI/UX specs</li>
                              <li><strong>Legal</strong> - Contracts, agreements, compliance docs</li>
                            </ul>
                            <p className="text-xs mt-2"><strong>Features:</strong> Version control, collaboration, easy sharing</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>Project documents and files</CardDescription>
                  </div>
                  <Button size="sm">Upload Document</Button>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                        <tr>
                          <th scope="col" className="px-6 py-3">Name</th>
                          <th scope="col" className="px-6 py-3">Last Updated</th>
                          <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.documents?.map(doc => (
                          <tr key={doc.name} className="bg-background border-b">
                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              {doc.name}
                            </th>
                            <td className="px-6 py-4">
                              {formatDate(doc.updatedAt)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <Button asChild variant="ghost" size="sm">
                                  <Link href={`/projects/${projectId}/documents/${doc.name}`}>View</Link>
                                </Button>
                                {doc.name.endsWith('.bpmn') ? (
                                  <Button asChild variant="ghost" size="sm">
                                    <Link href={`/viewers/bpmn/editor?projectId=${projectId}&filename=${doc.name}`}>Edit</Link>
                                  </Button>
                                ) : doc.name.endsWith('.mermaid') ? (
                                  <Button asChild variant="ghost" size="sm">
                                    <Link href={`/viewers/mermaid/editor?projectId=${projectId}&filename=${doc.name}`}>Edit</Link>
                                  </Button>
                                ) : (
                                  <Button asChild variant="ghost" size="sm">
                                    <Link href={"http://localhost:8080"}>Edit</Link>
                                  </Button>
                                )} 
                                
                                <Button asChild variant="ghost" size="sm">
                                  <Link href={`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/documents/${doc.name}`}>Download</Link>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Project Members
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm p-3">
                          <div>
                            <h4 className="font-semibold text-indigo-500 mb-2">🔹 Team Management</h4>
                            <p className="text-sm">Manage who has access to this project:</p>
                            <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
                              <li><strong>Project Owner</strong> - Full control, can manage team</li>
                              <li><strong>Developers</strong> - Code, deploy, configure services</li>
                              <li><strong>QA Engineers</strong> - Testing, bug reports, quality</li>
                              <li><strong>DevOps Engineers</strong> - Infrastructure, deployment, monitoring</li>
                              <li><strong>Stakeholders</strong> - View-only access, reports</li>
                            </ul>
                            <p className="text-xs mt-2"><strong>Features:</strong> Role-based permissions, activity tracking</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>Team members with access to this project</CardDescription>
                  </div>
                  <Button size="sm">Add Member</Button>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                        <tr>
                          <th scope="col" className="px-6 py-3">Name</th>
                          <th scope="col" className="px-6 py-3">Role</th>
                          <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map(member => (
                          <tr key={member.id} className="bg-background border-b">
                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {member.name}
                              </div>
                            </th>
                            <td className="px-6 py-4">
                              {member.role}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">Edit Role</Button> 
                                <Button variant="ghost" size="sm">Remove</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
    </RequireAuth>
  );
}