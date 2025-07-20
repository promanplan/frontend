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
import { Icons } from "@/components/icons";
import { RequireAuth } from "@/components/require-auth";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  verified?: boolean;
  type: "App" | "Service" | "Tool";
}

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

const integrations: Integration[] = [
  // 🛠️ DevOps & CI/CD
  {
    id: "github",
    name: "GitHub",
    description: "Connect your GitHub repositories for seamless code management and CI/CD workflows",
    category: "DevOps & CI/CD",
    icon: "github",
    verified: true,
    type: "App"
  },
  {
    id: "gitlab",
    name: "GitLab",
    description: "Integrate GitLab for source code management and continuous integration",
    category: "DevOps & CI/CD",
    icon: "gitlab",
    verified: true,
    type: "App"
  },
  {
    id: "jenkins",
    name: "Jenkins",
    description: "Automate your build, test, and deployment processes with Jenkins",
    category: "DevOps & CI/CD",
    icon: "jenkins",
    verified: true,
    type: "App"
  },
  {
    id: "github-actions",
    name: "GitHub Actions",
    description: "Automate your workflow with GitHub Actions for CI/CD pipelines",
    category: "DevOps & CI/CD",
    icon: "github-actions",
    verified: true,
    type: "App"
  },
  {
    id: "circleci",
    name: "CircleCI",
    description: "Automatically build, test, and deploy your project in minutes",
    category: "DevOps & CI/CD",
    icon: "circleci",
    verified: true,
    type: "App"
  },
  {
    id: "travis-ci",
    name: "Travis CI",
    description: "Continuous integration platform for building and testing software",
    category: "DevOps & CI/CD",
    icon: "travis-ci",
    verified: true,
    type: "App"
  },
  {
    id: "argocd",
    name: "ArgoCD",
    description: "Declarative continuous deployment for Kubernetes",
    category: "DevOps & CI/CD",
    icon: "argocd",
    verified: true,
    type: "App"
  },
  {
    id: "azure-devops",
    name: "Azure DevOps",
    description: "Azure DevOps services for planning, developing, and delivering software",
    category: "DevOps & CI/CD",
    icon: "azure-devops",
    verified: true,
    type: "App"
  },

  // ☁️ Cloud Providers
  {
    id: "aws",
    name: "AWS",
    description: "Connect to Amazon Web Services for cloud infrastructure and services",
    category: "Cloud Providers",
    icon: "aws",
    verified: true,
    type: "App"
  },
  {
    id: "google-cloud",
    name: "Google Cloud",
    description: "Integrate with Google Cloud Platform for scalable cloud solutions",
    category: "Cloud Providers",
    icon: "google-cloud",
    verified: true,
    type: "App"
  },
  {
    id: "microsoft-azure",
    name: "Microsoft Azure",
    description: "Connect to Microsoft Azure for cloud computing services",
    category: "Cloud Providers",
    icon: "azure",
    verified: true,
    type: "App"
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    description: "Web performance and security services for your applications",
    category: "Cloud Providers",
    icon: "cloudflare",
    verified: true,
    type: "App"
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    description: "Cloud infrastructure provider for developers and businesses",
    category: "Cloud Providers",
    icon: "digitalocean",
    verified: true,
    type: "App"
  },

  // 💬 Communication
  {
    id: "slack",
    name: "Slack",
    description: "Send alerts and deployment notifications to your Slack channels",
    category: "Communication",
    icon: "slack",
    verified: true,
    type: "App"
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Integrate with Microsoft Teams for team collaboration and notifications",
    category: "Communication",
    icon: "teams",
    verified: true,
    type: "App"
  },
  {
    id: "discord",
    name: "Discord",
    description: "Connect Discord for bot interactions and status alerts",
    category: "Communication",
    icon: "discord",
    verified: true,
    type: "App"
  },
  {
    id: "email",
    name: "Email",
    description: "Configure SMTP, SendGrid, or Mailgun for email notifications",
    category: "Communication",
    icon: "email",
    verified: true,
    type: "App"
  },

  // 📦 Monitoring & Logging
  {
    id: "datadog",
    name: "Datadog",
    description: "Monitoring and analytics platform for cloud-scale applications",
    category: "Monitoring & Logging",
    icon: "datadog",
    verified: true,
    type: "App"
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Error monitoring and performance tracking for your applications",
    category: "Monitoring & Logging",
    icon: "sentry",
    verified: true,
    type: "App"
  },
  {
    id: "new-relic",
    name: "New Relic",
    description: "Application performance monitoring and observability platform",
    category: "Monitoring & Logging",
    icon: "new-relic",
    verified: true,
    type: "App"
  },
  {
    id: "grafana",
    name: "Grafana",
    description: "Open source analytics and monitoring solution",
    category: "Monitoring & Logging",
    icon: "grafana",
    verified: true,
    type: "App"
  },
  {
    id: "prometheus",
    name: "Prometheus",
    description: "Open source monitoring system with time series database",
    category: "Monitoring & Logging",
    icon: "prometheus",
    verified: true,
    type: "App"
  },

  // 🔐 Authentication & Identity
  {
    id: "auth0",
    name: "Auth0",
    description: "Identity platform for web, mobile, and legacy applications",
    category: "Authentication & Identity",
    icon: "auth0",
    verified: true,
    type: "App"
  },
  {
    id: "okta",
    name: "Okta",
    description: "Identity and access management platform for enterprises",
    category: "Authentication & Identity",
    icon: "okta",
    verified: true,
    type: "App"
  },
  {
    id: "firebase-auth",
    name: "Firebase Auth",
    description: "Authentication service for web and mobile applications",
    category: "Authentication & Identity",
    icon: "firebase",
    verified: true,
    type: "App"
  },
  {
    id: "aws-cognito",
    name: "AWS Cognito",
    description: "User identity and data synchronization service",
    category: "Authentication & Identity",
    icon: "aws-cognito",
    verified: true,
    type: "App"
  },

  // 💳 Payments
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing platform for internet businesses",
    category: "Payments",
    icon: "stripe",
    verified: true,
    type: "App"
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Online payment system for secure transactions",
    category: "Payments",
    icon: "paypal",
    verified: true,
    type: "App"
  },
  {
    id: "square",
    name: "Square",
    description: "Payment and point-of-sale solutions for businesses",
    category: "Payments",
    icon: "square",
    verified: true,
    type: "App"
  },
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Payment gateway for online businesses in India",
    category: "Payments",
    icon: "razorpay",
    verified: true,
    type: "App"
  },

  // 🧠 AI/ML
  {
    id: "openai",
    name: "OpenAI",
    description: "Artificial intelligence research and deployment platform",
    category: "AI/ML",
    icon: "openai",
    verified: true,
    type: "App"
  },
  {
    id: "hugging-face",
    name: "Hugging Face",
    description: "Machine learning platform for natural language processing",
    category: "AI/ML",
    icon: "hugging-face",
    verified: true,
    type: "App"
  },
  {
    id: "pinecone",
    name: "Pinecone",
    description: "Vector database for machine learning applications",
    category: "AI/ML",
    icon: "pinecone",
    verified: true,
    type: "App"
  },
  {
    id: "weaviate",
    name: "Weaviate",
    description: "Vector search engine for AI applications",
    category: "AI/ML",
    icon: "weaviate",
    verified: true,
    type: "App"
  },
  {
    id: "langchain",
    name: "LangChain",
    description: "Framework for developing applications with large language models",
    category: "AI/ML",
    icon: "langchain",
    verified: true,
    type: "App"
  },
  {
    id: "replicate",
    name: "Replicate",
    description: "Platform for running machine learning models in the cloud",
    category: "AI/ML",
    icon: "replicate",
    verified: true,
    type: "App"
  },

  // 🧰 Developer Tools & APIs
  {
    id: "postman",
    name: "Postman",
    description: "API development and testing platform for developers",
    category: "Developer Tools & APIs",
    icon: "postman",
    verified: true,
    type: "App"
  },
  {
    id: "swaggerhub",
    name: "SwaggerHub",
    description: "API design and documentation platform",
    category: "Developer Tools & APIs",
    icon: "swagger",
    verified: true,
    type: "App"
  },
  {
    id: "algolia",
    name: "Algolia",
    description: "Search-as-a-service platform for web and mobile applications",
    category: "Developer Tools & APIs",
    icon: "algolia",
    verified: true,
    type: "App"
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "Cloud communications platform for SMS, voice, and video",
    category: "Developer Tools & APIs",
    icon: "twilio",
    verified: true,
    type: "App"
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Open source Firebase alternative with PostgreSQL",
    category: "Developer Tools & APIs",
    icon: "supabase",
    verified: true,
    type: "App"
  },
  {
    id: "hasura",
    name: "Hasura",
    description: "GraphQL API for your data with real-time subscriptions",
    category: "Developer Tools & APIs",
    icon: "hasura",
    verified: true,
    type: "App"
  },
  {
    id: "plaid",
    name: "Plaid",
    description: "Financial data API for connecting bank accounts",
    category: "Developer Tools & APIs",
    icon: "plaid",
    verified: true,
    type: "App"
  },

  // 📦 Database / Storage
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Advanced open source relational database system",
    category: "Database / Storage",
    icon: "postgresql",
    verified: true,
    type: "App"
  },
  {
    id: "mysql",
    name: "MySQL",
    description: "Open source relational database management system",
    category: "Database / Storage",
    icon: "mysql",
    verified: true,
    type: "App"
  },
  {
    id: "mongodb",
    name: "MongoDB Atlas",
    description: "Cloud-hosted MongoDB service for modern applications",
    category: "Database / Storage",
    icon: "mongodb",
    verified: true,
    type: "App"
  },
  {
    id: "redis",
    name: "Redis",
    description: "In-memory data structure store for caching and messaging",
    category: "Database / Storage",
    icon: "redis",
    verified: true,
    type: "App"
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    description: "Serverless MySQL platform for developers",
    category: "Database / Storage",
    icon: "planetscale",
    verified: true,
    type: "App"
  }
];

export default function AddIntegrationsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id ? String(params.id) : "1";
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"recommended" | "recently-added">("recommended");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

  const categories = [
    { id: "all", name: "All Categories", emoji: "📦" },
    { id: "DevOps & CI/CD", name: "DevOps & CI/CD", emoji: "🛠️" },
    { id: "Cloud Providers", name: "Cloud Providers", emoji: "☁️" },
    { id: "Communication", name: "Communication", emoji: "💬" },
    { id: "Monitoring & Logging", name: "Monitoring & Logging", emoji: "📦" },
    { id: "Authentication & Identity", name: "Authentication & Identity", emoji: "🔐" },
    { id: "Payments", name: "Payments", emoji: "💳" },
    { id: "AI/ML", name: "AI/ML", emoji: "🧠" },
    { id: "Developer Tools & APIs", name: "Developer Tools & APIs", emoji: "🧰" },
    { id: "Database / Storage", name: "Database / Storage", emoji: "📦" },
  ];

  const filteredIntegrations = integrations.filter(integration => 
    selectedCategory === "all" || integration.category === selectedCategory
  );

  const getIntegrationIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      github: <Icons.gitHub className="h-6 w-6 text-primary" />,
      gitlab: <Icons.gitHub className="h-6 w-6 text-orange-500" />,
      jenkins: <Icons.logo className="h-6 w-6 text-red-500" />,
      "github-actions": <Icons.gitHub className="h-6 w-6 text-purple-500" />,
      circleci: <Icons.logo className="h-6 w-6 text-green-500" />,
      "travis-ci": <Icons.logo className="h-6 w-6 text-blue-500" />,
      argocd: <Icons.logo className="h-6 w-6 text-blue-600" />,
      "azure-devops": <Icons.logo className="h-6 w-6 text-blue-700" />,
      aws: <Icons.logo className="h-6 w-6 text-orange-500" />,
      "google-cloud": <Icons.google className="h-6 w-6 text-blue-500" />,
      azure: <Icons.logo className="h-6 w-6 text-blue-600" />,
      cloudflare: <Icons.logo className="h-6 w-6 text-orange-500" />,
      digitalocean: <Icons.logo className="h-6 w-6 text-blue-500" />,
      slack: <Icons.twitter className="h-6 w-6 text-purple-500" />,
      teams: <Icons.logo className="h-6 w-6 text-blue-600" />,
      discord: <Icons.twitter className="h-6 w-6 text-indigo-500" />,
      email: <Icons.logo className="h-6 w-6 text-gray-500" />,
      datadog: <Icons.logo className="h-6 w-6 text-purple-600" />,
      sentry: <Icons.logo className="h-6 w-6 text-orange-500" />,
      "new-relic": <Icons.logo className="h-6 w-6 text-green-600" />,
      grafana: <Icons.logo className="h-6 w-6 text-orange-500" />,
      prometheus: <Icons.logo className="h-6 w-6 text-red-500" />,
      auth0: <Icons.logo className="h-6 w-6 text-red-600" />,
      okta: <Icons.logo className="h-6 w-6 text-blue-500" />,
      firebase: <Icons.logo className="h-6 w-6 text-orange-500" />,
      "aws-cognito": <Icons.logo className="h-6 w-6 text-blue-600" />,
      stripe: <Icons.logo className="h-6 w-6 text-purple-500" />,
      paypal: <Icons.paypal className="h-6 w-6 text-blue-500" />,
      square: <Icons.logo className="h-6 w-6 text-green-500" />,
      razorpay: <Icons.logo className="h-6 w-6 text-blue-600" />,
      openai: <Icons.logo className="h-6 w-6 text-green-500" />,
      "hugging-face": <Icons.logo className="h-6 w-6 text-yellow-500" />,
      pinecone: <Icons.logo className="h-6 w-6 text-blue-500" />,
      weaviate: <Icons.logo className="h-6 w-6 text-purple-500" />,
      langchain: <Icons.logo className="h-6 w-6 text-red-500" />,
      replicate: <Icons.logo className="h-6 w-6 text-blue-500" />,
      postman: <Icons.logo className="h-6 w-6 text-orange-500" />,
      swagger: <Icons.logo className="h-6 w-6 text-green-500" />,
      algolia: <Icons.logo className="h-6 w-6 text-blue-500" />,
      twilio: <Icons.logo className="h-6 w-6 text-red-500" />,
      supabase: <Icons.logo className="h-6 w-6 text-green-500" />,
      hasura: <Icons.logo className="h-6 w-6 text-purple-500" />,
      plaid: <Icons.logo className="h-6 w-6 text-blue-500" />,
      postgresql: <Icons.logo className="h-6 w-6 text-blue-600" />,
      mysql: <Icons.logo className="h-6 w-6 text-blue-500" />,
      mongodb: <Icons.logo className="h-6 w-6 text-green-500" />,
      redis: <Icons.logo className="h-6 w-6 text-red-500" />,
      planetscale: <Icons.logo className="h-6 w-6 text-purple-500" />,
    };

    return iconMap[iconName] || <Icons.logo className="h-6 w-6 text-primary" />;
  };

  const handleAddIntegration = async (integration: Integration) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/integrations`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: integration.name,
          description: integration.description,
          type: integration.type,
          icon: integration.icon,
        }),
      });

      if (response.ok) {
        router.push(`/projects/${projectId}/integrations`);
      } else {
        throw new Error("Failed to add integration");
      }
    } catch (error) {
      console.error("Error adding integration:", error);
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
                  <BreadcrumbLink href={`/projects/${projectId}/integrations`}>Integrations</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add Integration</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Add Integration</h1>
              <p className="text-muted-foreground">Connect your project with external services and tools</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-8 mb-6">
              <button
                onClick={() => setActiveTab("recommended")}
                className={cn(
                  "text-lg font-medium pb-2 border-b-2 transition-colors",
                  activeTab === "recommended"
                    ? "text-orange-500 border-orange-500"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                Recommended
              </button>
              <button
                onClick={() => setActiveTab("recently-added")}
                className={cn(
                  "text-lg font-medium pb-2 border-b-2 transition-colors",
                  activeTab === "recently-added"
                    ? "text-orange-500 border-orange-500"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                Recently added
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {category.emoji} {category.name}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">Loading integrations...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredIntegrations.map((integration) => (
                  <Card key={integration.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                      <div className="p-2 rounded-lg bg-muted">
                        {getIntegrationIcon(integration.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          {integration.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <CardDescription className="text-sm mt-1">
                          {integration.description}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {integration.type}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        onClick={() => handleAddIntegration(integration)}
                        className="w-full"
                        size="sm"
                      >
                        Add Integration
                      </Button>
                    </CardContent>
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
