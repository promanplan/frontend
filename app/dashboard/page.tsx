'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Filter, SortDesc } from 'lucide-react';
import { AppSidebar } from "@/components/app-sidebar";
import ProjectList from '@/components/project-list';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
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
import { RequireAuth } from "@/components/require-auth";

type ProjectStatus = 'active' | 'archived' | 'draft';

interface Project {
  id: string;
  name: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
  status: ProjectStatus;
  appsCount: number;
  integrationsCount: number;
  servicesCount: number;
  membersCount: number;
  createdBy: string;
  isPrivate: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        };
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects`, {
          headers: headers
          
        });
        
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        // Convert date strings to Date objects
        const projectsWithDates = data.map((project: any) => ({
          ...project,
          updatedAt: new Date(project.updatedAt),
          createdAt: new Date(project.createdAt),
        }));
        setProjects(projectsWithDates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching projects:', err);
        
        // Fallback to mock data if API fails
        setProjects([
          { 
            id: '1', 
            name: 'E-commerce Platform', 
            description: 'Online shopping platform with integrated payment processing and inventory management.',
            updatedAt: new Date(),
            createdAt: new Date(),
            status: 'active',
            appsCount: 3,
            integrationsCount: 5,
            servicesCount: 7,
            membersCount: 4,
            createdBy: 'user123',
            isPrivate: false
          },
          { 
            id: '2', 
            name: 'CRM System', 
            description: 'Customer relationship management system with sales pipeline and contact management.',
            updatedAt: new Date(),
            createdAt: new Date(),
            status: 'active',
            appsCount: 2,
            integrationsCount: 4,
            servicesCount: 3,
            membersCount: 3,
            createdBy: 'user123',
            isPrivate: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [router]);

  return (
    <RequireAuth>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center space-x-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
              <h1 className="text-2xl font-bold">Projects</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <SortDesc className="h-4 w-4" /> Sort
                </Button>
                <Button size="sm" className="gap-1" onClick={() => router.push('/create-project')}>
                  <Plus className="h-4 w-4" /> New Project
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5 mb-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-lg font-medium mb-1">Total Projects</div>
                <div className="text-3xl font-bold">{projects.length}</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-lg font-medium mb-1">Active Projects</div>
                <div className="text-3xl font-bold">
                  {projects.filter(p => p.status === 'active').length}
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-lg font-medium mb-1">Total Apps</div>
                <div className="text-3xl font-bold">
                  {projects.reduce((sum, project) => sum + project.appsCount, 0)}
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-lg font-medium mb-1">Total Services</div>
                <div className="text-3xl font-bold">
                  {projects.reduce((sum, project) => sum + (project.servicesCount || 0), 0)}
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-lg font-medium mb-1">Total Integrations</div>
                <div className="text-3xl font-bold">
                  {projects.reduce((sum, project) => sum + (project.integrationsCount || 0), 0)}
                </div>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : (
              <ProjectList projects={projects as Project[]} />
            )}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  );
}