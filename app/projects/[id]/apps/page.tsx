"use client";

import { useEffect, useState } from "react";
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
import { Icons } from "@/components/icons";
import { RequireAuth } from "@/components/require-auth";
interface App {
  _id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  endpoint: string;
  type: string;
  secured: boolean;
}

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


export default function AppsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id ? String(params.id) : "1";
  const [apps, setApps] = useState<App[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/apps`, { headers: headers });
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch apps");
        const data = await res.json();
        setApps(data);


        // Fetch project details
        const projectRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}`, { headers });
        if (projectRes.status === 401 || projectRes.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }
        if (!projectRes.ok) throw new Error("Failed to fetch project details");
        const projectData = await projectRes.json();
        setProject(projectData);
      
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
      
    };

    
    fetchApps();
  }, [projectId, router]);

  
  // Create default navigation items if project is null
  const defaultNavItems: SidebarNavItem[] = [
    {
      title: "Project Overview",
      url: `/projects/${projectId}`,
      items: [],
    },
    {
      title: "Apps",
      url: `/projects/${projectId}/apps`,
      items: [],
    },
    {
      title: "Integrations",
      url: `/projects/${projectId}/integrations`,
      items: [],
    },
    {
      title: "Services",
      url: `/projects/${projectId}/services`,
      items: [],
    },
    {
      title: "Settings",
      url: `/projects/${projectId}/settings`,
      items: [],
    },
  ];

  // Create navigation items based on project data if available
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
  ] : defaultNavItems;
  
  const versions = ["v1"];

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
                <BreadcrumbPage>Apps</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Apps</h1>
              <p className="text-muted-foreground">Overview of all apps connected to this project</p>
            </div>
            <Button asChild>
              <a href={`/projects/${projectId}/apps/add`}>Add App</a>
            </Button>
          </div>
          {loading ? (
            <div className="p-8 text-center">Loading apps...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {apps.map((app) => (
                <Card key={app._id}>
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <span className="p-2 rounded-lg bg-muted">
                      {getAppIcon(app.name)}
                    </span>
                    <div>
                      <CardTitle>{app.name}</CardTitle>
                      <CardDescription>{app.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={app.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"}>
                        {app.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Status</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">Endpoint: </span>
                      <span className="text-muted-foreground">{app.endpoint}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">Type: </span>
                      <span className="text-muted-foreground">{app.type}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">Secured: </span>
                      <span className="text-muted-foreground">{app.secured ? "Yes" : "No"}</span>
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

function getAppIcon(name: string) {
  if (/payment|checkout/i.test(name)) return <Icons.paypal className="h-6 w-6 text-primary" />;
  if (/user|profile/i.test(name)) return <Icons.gitHub className="h-6 w-6 text-primary" />;
  if (/content|cms/i.test(name)) return <Icons.google className="h-6 w-6 text-primary" />;
  if (/inventory/i.test(name)) return <Icons.radix className="h-6 w-6 text-primary" />;
  return <Icons.logo className="h-6 w-6 text-primary" />;
}
