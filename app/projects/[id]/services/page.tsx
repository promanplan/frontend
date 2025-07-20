"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar, SidebarNavItem } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
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
  
// Service type based on expected API response
interface Service {
  _id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  endpoint: string;
  type: string;
  secured: boolean;
  comments: any[];
  created_at: string | Date;
  updated_at: string | Date;
}

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export default function ServicesPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id ? String(params.id) : "1";
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  const headers = useMemo(() => ({
    "Content-Type": "application/json",
    // Add Authorization if needed
    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
  }), []);
  useEffect(() => {
    const fetchProjectAndData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all projects
        const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/`, { headers: headers });
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
        }else if (projectsRes.status === 401 || projectsRes.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        } else {
          console.error('Failed to fetch projects');
        } 
        
        // Fetch current project details
        const projectRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}`, { headers: headers });
        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject(projectData);
        } else if (projectRes.status === 401 || projectRes.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        } else {
          console.error('Failed to fetch project details');
        }


        // Fetch services
        const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/services`, { headers: headers });
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData);
        } else if (servicesRes.status === 401 || servicesRes.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        } else {
          console.error('Failed to fetch services');
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectAndData();
  }, [projectId, headers, router]);

  // Construct versions and navMain for the sidebar
  const versions = projects.map(project => project.name) || [];
  const navMain: SidebarNavItem[] = project ? [
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
        url: `/projects/${projectId}/apps/${app._id}`,
        isActive: false,
      })) || [],
    },
    {
      title: "Integrations",
      url: `/projects/${projectId}/integrations`,
      items: project.integrations?.map(integration => ({
        title: integration.name,
        url: `/projects/${projectId}/integrations/${integration._id}`,
        isActive: false,
      })) || [],
    },
    {
      title: "Services",
      url: `/projects/${projectId}/services`,
      items: project.services?.map(service => ({
        title: service.name,
        url: `/projects/${projectId}/services/${service._id}`,
        isActive: false,
      })) || [],
    },
    {
      title: "Settings",
      url: `/projects/${projectId}/settings`,
      items: [],
    },
  ] : [];

  return (
    <RequireAuth>
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
                <BreadcrumbLink href={`/projects/${projectId}`}>{project?.name || "Project"}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center space-x-2">
            {project && (
              <Badge className={project.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
            )}
            <Button size="sm">Add Service</Button>
          </div>
        </header>
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Services</h1>
              <p className="text-muted-foreground">Overview of all backend services connected to this project</p>
            </div>
            <Button asChild>
              <a href={`/projects/${projectId}/services/add`}>Add Service</a>
            </Button>
          </div>
          {loading ? (
            <div className="p-8 text-center">Loading services...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card key={service._id}>
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    {/* Icon by service name/type */}
                    <span className="p-2 rounded-lg bg-muted">
                      {getServiceIcon(service.name)}
                    </span>
                    <div>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={service.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"}>
                        {service.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Status</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">Endpoint: </span>
                      <span className="text-muted-foreground">{service.endpoint}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">Type: </span>
                      <span className="text-muted-foreground">{service.type}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">Secured: </span>
                      <span className="text-muted-foreground">{service.secured ? "Yes" : "No"}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button size="sm" variant="outline">View Logs</Button>
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Docs</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
    </RequireAuth>
  );
}

// Helper to get icon by service name/type
function getServiceIcon(name: string) {
  if (/integration/i.test(name)) return <Icons.react className="h-6 w-6 text-primary" />;
  if (/auth/i.test(name)) return <Icons.gitHub className="h-6 w-6 text-primary" />;
  if (/analytic/i.test(name)) return <Icons.google className="h-6 w-6 text-primary" />;
  if (/storage/i.test(name)) return <Icons.radix className="h-6 w-6 text-primary" />;
  return <Icons.logo className="h-6 w-6 text-primary" />;
}
