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
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { RequireAuth } from "@/components/require-auth";

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

export default function AddAppPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id ? String(params.id) : "1";
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    endpoint: "",
    type: "",
    secured: false,
  });

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        };
        
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
    
    fetchProject();
  }, [projectId]);

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
  ] : [];

  const versions = ["v1"];

  const appTypes = [
    "Web Application",
    "Mobile Application",
    "Desktop Application",
    "API Application",
    "Microservice",
    "Dashboard",
    "Admin Panel",
    "User Portal",
    "E-commerce App",
    "Content Management System",
    "Analytics Dashboard",
    "Communication App",
    "Payment App",
    "Other"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/apps`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          endpoint: formData.endpoint,
          type: formData.type,
          secured: formData.secured,
          icon: "app", // Default icon
        }),
      });

      if (response.ok) {
        router.push(`/projects/${projectId}/apps`);
      } else {
        throw new Error("Failed to add app");
      }
    } catch (error) {
      console.error("Error adding app:", error);
      setError("Failed to add app. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
                  <BreadcrumbLink href={`/projects/${projectId}/apps`}>Apps</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add App</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Add New App</h1>
              <p className="text-muted-foreground">Create a new application for your project</p>
            </div>

            {loading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <div className="max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>App Details</CardTitle>
                    <CardDescription>Fill in the details for your new application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">App Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter app name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Describe what this app does"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endpoint">App URL</Label>
                        <Input
                          id="endpoint"
                          value={formData.endpoint}
                          onChange={(e) => handleInputChange("endpoint", e.target.value)}
                          placeholder="https://app.example.com"
                          type="url"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">App Type</Label>
                        <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select app type" />
                          </SelectTrigger>
                          <SelectContent>
                            {appTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          id="secured"
                          type="checkbox"
                          checked={formData.secured}
                          onChange={(e) => handleInputChange("secured", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="secured">Requires authentication</Label>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.push(`/projects/${projectId}/apps`)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                          {submitting ? (
                            <>
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                              Adding App...
                            </>
                          ) : (
                            "Add App"
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  );
} 