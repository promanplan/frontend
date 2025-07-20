'use client';

import Link from 'next/link';
import { FolderKanban, Calendar, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Project {
  id: string;
  name: string;
  description: string;
  updatedAt: Date;
  status: 'active' | 'archived' | 'draft';
  appsCount: number;
  integrationsCount: number;
}

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'archived':
        return 'bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20';
      case 'draft':
        return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link href={`/projects/${project.id}`} key={project.id}>
          <Card className="h-full cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FolderKanban className="h-5 w-5 text-primary" />
                </div>
                <Badge className={`${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
              <h3 className="font-medium text-lg mb-2">{project.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  Updated {formatDate(project.updatedAt)}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Badge variant="outline" className="text-xs">
                  {project.appsCount} Apps
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {project.integrationsCount} Integrations
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-0 border-t flex justify-end">
              <div className="text-xs flex items-center text-primary hover:underline">
                View details <ArrowUpRight className="ml-1 h-3 w-3" />
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
} 