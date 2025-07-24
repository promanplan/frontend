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
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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

const APP_TYPES = [
  "Web Application",
  "Mobile Application",
  "Desktop Application",
  "Progressive Web App",
  "Single Page Application",
  "Dashboard",
  "Admin Panel",
  "User Portal",
  "E-commerce App",
  "Content Management System",
  "Analytics Dashboard",
  "Communication App",
  "Social Media App",
  "Other"
];

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
    type: "",
    url: "",
    version: "v1.0.0",
    secured: false,
    status: "Active",
    info: {
      url: "",
      type: "",
      version: "v1.0.0",
      secured: "false",
      status: "Active",
      framework: "",
      platform: "Web",
      build_tool: "",
      repository_url: "",
      deployment_url: "",
      staging_url: "",
      technology_stack: "",
      responsive: "true",
      pwa_enabled: "false",
      offline_support: "false",
      environment: "development"
    } as { [key: string]: string },
  });

  // Dynamic info fields
  const [infoFields, setInfoFields] = useState<Array<{ key: string; value: string }>>([
    { key: "url", value: "" },
    { key: "type", value: "" },
    { key: "version", value: "v1.0.0" },
    { key: "secured", value: "false" },
    { key: "status", value: "Active" },
    { key: "framework", value: "" },
    { key: "platform", value: "Web" },
    { key: "build_tool", value: "" },
    { key: "repository_url", value: "" },
    { key: "deployment_url", value: "" },
    { key: "staging_url", value: "" },
    { key: "technology_stack", value: "" },
    { key: "responsive", value: "true" },
    { key: "pwa_enabled", value: "false" },
    { key: "offline_support", value: "false" },
    { key: "environment", value: "development" }
  ]);

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Update corresponding info field if it exists
    if (field in formData.info) {
      const newInfoFields = [...infoFields];
      const fieldIndex = newInfoFields.findIndex(f => f.key === field);
      if (fieldIndex !== -1) {
        newInfoFields[fieldIndex].value = String(value);
        setInfoFields(newInfoFields);
      }
      
      setFormData(prev => ({
        ...prev,
        info: {
          ...prev.info,
          [field]: String(value)
        }
      }));
    }
  };

  const handleInfoFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    const newInfoFields = [...infoFields];
    newInfoFields[index][field] = value;
    setInfoFields(newInfoFields);
    
    // Update formData.info
    const newInfo: { [key: string]: string } = {};
    newInfoFields.forEach(field => {
      if (field.key && field.value) {
        newInfo[field.key] = field.value;
      }
    });
    setFormData(prev => ({ ...prev, info: newInfo }));
  };

  const addInfoField = () => {
    setInfoFields([...infoFields, { key: "", value: "" }]);
  };

  const removeInfoField = (index: number) => {
    if (infoFields.length > 1) {
      const newInfoFields = infoFields.filter((_, i) => i !== index);
      setInfoFields(newInfoFields);
      
      // Update formData.info
      const newInfo: { [key: string]: string } = {};
      newInfoFields.forEach(field => {
        if (field.key && field.value) {
          newInfo[field.key] = field.value;
        }
      });
      setFormData(prev => ({ ...prev, info: newInfo }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      };
      
      const appData = {
        name: formData.name,
        description: formData.description,
        info: formData.info,
        icon: "app", // Default icon
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/apps`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          apps: [appData]
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
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Describe what this app does"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">App Type *</Label>
                        <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select app type" />
                          </SelectTrigger>
                          <SelectContent>
                            {APP_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="url">App URL</Label>
                        <Input
                          id="url"
                          value={formData.url}
                          onChange={(e) => handleInputChange("url", e.target.value)}
                          placeholder="https://app.example.com"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="version">Version</Label>
                          <Input
                            id="version"
                            value={formData.version}
                            onChange={(e) => handleInputChange("version", e.target.value)}
                            placeholder="v1.0.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                              <SelectItem value="Development">Development</SelectItem>
                              <SelectItem value="Testing">Testing</SelectItem>
                              <SelectItem value="Maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="secured"
                          checked={formData.secured}
                          onCheckedChange={(checked: boolean) => handleInputChange("secured", checked)}
                        />
                        <Label htmlFor="secured">Secured (requires authentication)</Label>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Additional App Information</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addInfoField}
                          >
                            Add Field
                          </Button>
                        </div>
                        {infoFields.map((field, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <Input
                              placeholder="Key (e.g., framework, platform)"
                              value={field.key}
                              onChange={(e) => handleInfoFieldChange(index, 'key', e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Value"
                              value={field.value}
                              onChange={(e) => handleInfoFieldChange(index, 'value', e.target.value)}
                              className="flex-1"
                            />
                            {index >= 16 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeInfoField(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
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