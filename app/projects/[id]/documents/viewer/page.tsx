"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar, SidebarNavItem } from "@/components/app-sidebar";
import { RequireAuth } from "@/components/require-auth";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

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

export default function DocumentViewerPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id ? String(params.id) : "";
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [docContent, setDocContent] = useState<string>("");
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const firstDoc = project?.documents?.[0];

  useEffect(() => {
    const fetchProjectAndMembers = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        };

        // Fetch all projects for versions
        const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects`, { headers });
        if (projectsRes.status === 401 || projectsRes.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
        }


        // fetch details of the project using path ID
        const projectDetailsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}`, { headers });
        if (projectDetailsRes.status === 401 || projectDetailsRes.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }
        if (projectDetailsRes.ok) {
          const projectDetailsData = await projectDetailsRes.json();
          setProject(projectDetailsData);
        }

        // Fetch members
        const membersRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/members/info`, { headers });
        if (membersRes.status === 401 || membersRes.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }
        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData);
        }
      } catch (error) {
        console.error("Error fetching project or members:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndMembers();
  }, [projectId, router]);

  useEffect(() => {
    if (!projectId || !firstDoc?.name) return;
    setDocLoading(true);
    setDocError(null);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/documents/${encodeURIComponent(firstDoc.name)}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch document");
        return res.text();
      })
      .then(setDocContent)
      .catch((err) => setDocError(err.message))
      .finally(() => setDocLoading(false));
  }, [projectId, firstDoc?.name]);

  // Construct versions and navMain for the sidebar
  const versions = projects.map(p => p.name);
  const currentProject = project;
  const navMain: SidebarNavItem[] = currentProject ? [
    {
      title: "Project Overview",
      url: `/projects/${currentProject._id}`,
      items: [],
    },
    {
      title: "Apps",
      url: `/projects/${projectId}/apps`,
      items: currentProject.apps?.map(app => ({
        title: app.name,
        url: `/projects/${projectId}/apps/${app._id || ''}`,
        isActive: false,
      })) || [],
    },
    {
      title: "Integrations",
      url: `/projects/${projectId}/integrations`,
      items: currentProject.integrations?.map(integration => ({
        title: integration.name,
        url: `/projects/${projectId}/integrations/${integration._id || ''}`,
        isActive: false,
      })) || [],
    },
    {
      title: "Services",
      url: `/projects/${projectId}/services`,
      items: currentProject.services?.map(service => ({
        title: service.name,
        url: `/projects/${projectId}/services/${service._id || ''}`,
        isActive: false,
      })) || [],
    },
    {
      title: "Members",
      url: `/projects/${projectId}/members`,
      items: members.map(member => ({
        title: member.name,
        url: `/projects/${projectId}/members/${member.id}`,
        isActive: false,
      })) || [],
    },
    {
      title: "Settings",
      url: `/projects/${projectId}/settings`,
      items: [],
    },
    {
      title: "Documents",
      url: `/projects/${projectId}/documents`,
      items: currentProject.documents?.map(doc => ({
        title: doc.name,
        url: `/projects/${projectId}/documents/${doc.name}`,
        isActive: true, // Set the current document as active
      })) || [],
    },
  ] : [];

  const handleOpenViewer = () => {
    const url = "http://localhost:8080";
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <RequireAuth>
      <SidebarProvider>
        <AppSidebar versions={versions} navMain={navMain} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            {/* You can add a separator and breadcrumb here if desired */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/projects/${projectId}`}>{currentProject?.name || "Project"}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/projects/${projectId}/documents`}>Documents</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage>Viewer</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="mt-6">
            {firstDoc && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">{firstDoc.name}</h2>
                {docLoading && <div>Loading document...</div>}
                {docError && <div className="text-red-500">{docError}</div>}
                {!docLoading && !docError && (
                  <pre className="bg-muted p-4 rounded overflow-x-auto whitespace-pre-wrap max-h-[60vh]">{docContent}</pre>
                )}
              </div>
            )}
            {!firstDoc && <div className="text-muted-foreground">No documents found in this project.</div>}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  );
}
