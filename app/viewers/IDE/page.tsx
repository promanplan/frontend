'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { AppSidebar, SidebarNavItem } from '@/components/app-sidebar';
import { RequireAuth } from '@/components/require-auth';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import DocumentGrid from '@/components/document-grid';
import { Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Project {
  _id: string;
  name: string;
  status?: string;
  description?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  apps?: Array<{
    _id?: string;
    name: string;
    description?: string;
    icon?: string;
    created_at?: string | Date;
    updated_at?: string | Date;
    comments?: any[];
  }>;
  integrations?: Array<{
    _id?: string;
    name: string;
    description?: string;
    icon?: string;
    created_at?: string | Date;
    updated_at?: string | Date;
    comments?: any[];
  }>;
  services?: Array<{
    _id?: string;
    name: string;
    description?: string;
    usage?: string;
    comments?: any[];
    created_at?: string | Date;
    updated_at?: string | Date;
  }>;
  documents: Array<{
    name: string;
    updatedAt: string | Date;
    createdAt: string | Date;
    file: string;
  }>;
  members?: string[];
}

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export default function DocumentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams?.get('projectId') || '';
  const filename = searchParams?.get('filename') || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectAndMembers = async () => {
      console.log(projectId, filename, "projectId, filename");
      console.log(window.location.href, "window.location.href");


      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        };

        // Fetch all projects for versions
        const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects`, { headers });
        if (projectsRes.status === 401 || projectsRes.status === 403) {
          localStorage.removeItem('access_token');
          router.push('/login');
          return;
        }
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
        }

        // Fetch project details
        const projectDetailsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}`, { headers });
        if (projectDetailsRes.status === 401 || projectDetailsRes.status === 403) {
          localStorage.removeItem('access_token');
          router.push('/login');
          return;
        }
        if (projectDetailsRes.ok) {
          const projectDetailsData = await projectDetailsRes.json();
          console.log(projectDetailsData);
          setProject(projectDetailsData);
        }

        // Fetch members
        const membersRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/members/info`, { headers });
        if (membersRes.status === 401 || membersRes.status === 403) {
          localStorage.removeItem('access_token');
          router.push('/login');
          return;
        }
        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData);
        }
      } catch (error) {
        console.error('Error fetching project or members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndMembers();
  }, [projectId, filename, router]);

  const versions = projects.map(p => p.name);
  const currentProject = project;
  const navMain: SidebarNavItem[] = currentProject ? [
    {
      title: 'Project Overview',
      url: `/projects/${currentProject._id}`,
      items: [],
    },
    {
      title: 'Apps',
      url: `/projects/${projectId}/apps`,
      items: currentProject.apps?.map(app => ({
        title: app.name,
        url: `/projects/${projectId}/apps/${app._id || ''}`,
        isActive: false,
      })) || [],
    },
    {
      title: 'Integrations',
      url: `/projects/${projectId}/integrations`,
      items: currentProject.integrations?.map(integration => ({
        title: integration.name,
        url: `/projects/${projectId}/integrations/${integration._id || ''}`,
        isActive: false,
      })) || [],
    },
    {
      title: 'Services',
      url: `/projects/${projectId}/services`,
      items: currentProject.services?.map(service => ({
        title: service.name,
        url: `/projects/${projectId}/services/${service._id || ''}`,
        isActive: false,
      })) || [],
    },
    {
      title: 'Members',
      url: `/projects/${projectId}/members`,
      items: members.map(member => ({
        title: member.name,
        url: `/projects/${projectId}/members/${member.id}`,
        isActive: false,
      })) || [],
    },
    {
      title: 'Settings',
      url: `/projects/${projectId}/settings`,
      items: [],
    },
    {
      title: 'Documents',
      url: `/projects/${projectId}/documents`,
      items: currentProject.documents?.map(doc => ({
        title: doc.name,
        url: `/projects/${projectId}/documents/${doc.name}`,
        isActive: true,
      })) || [],
    },
  ] : [];


  const handleOpenViewer = () => {
    const url = "http://localhost:8080";
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };
  // Filter documents by search query
  const filteredDocuments = (currentProject?.documents || [])
    .filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(doc => ({
      id: doc.name || doc.file, // Use name or file as unique id
      name: doc.name,
      modifiedAt: doc.updatedAt ? new Date(doc.updatedAt) : (doc.createdAt ? new Date(doc.createdAt) : new Date()),
    }));

  return (
    <RequireAuth>
      <SidebarProvider>
        <AppSidebar versions={versions} navMain={navMain} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/projects/${projectId}`}>{currentProject?.name || 'Project'}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage>Documents</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center space-x-2">
              <ModeToggle />
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="sr-only">Notifications</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </Button>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
          </header>
          <main className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="w-full max-w-md relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Filter by date <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Today</DropdownMenuItem>
                    <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                    <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                    <DropdownMenuItem>This year</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      Sort <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                    <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                    <DropdownMenuItem>Date (Newest)</DropdownMenuItem>
                    <DropdownMenuItem>Date (Oldest)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {filteredDocuments.length > 0 && (
              <div className="mb-4">
                <Button
                  className="bg-primary text-white"
                  onClick={() => {
                    handleOpenViewer();
                  }}
                >
                  Open in IDE
                </Button>
              </div>
            )}
            <DocumentGrid documents={filteredDocuments} projectId={projectId} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  );
} 