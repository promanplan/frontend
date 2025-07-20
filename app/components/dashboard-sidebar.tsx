'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FolderKanban, 
  Settings, 
  User, 
  BarChart,
  Clock,
  AppWindow,
  Cable,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { AiFillRobot } from 'react-icons/ai';

// Mock projects - in a real app, these would come from an API or state
const projects = [
  { id: '1', name: 'Project 1' },
  { id: '2', name: 'Project 2' },
  { id: '3', name: 'Project 3' },
];

const navItems = [
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderKanban,
    hasProjects: true
  },
  {
    name:"Agents",
    href:"/agents",
    icon: AiFillRobot, 
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    name: 'Account',
    href: '/account',
    icon: User,
  },
  {
    name: 'Usage',
    href: '/usage',
    icon: BarChart,
  },
  {
    name: 'History',
    href: '/history',
    icon: Clock,
  },
];

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname() || '';
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  
  const toggleSubmenu = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };
  
  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <aside className="w-60 bg-zinc-900 text-white h-screen flex flex-col py-4">
      <div className="px-6 py-3 mb-4">
        <h2 className="text-xl font-semibold">
          <Link href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
        </h2>
      </div>
      <div className="flex-1 overflow-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isExpanded = expandedMenu === item.name;
          
          return (
            <div key={item.name}>
              <button
                onClick={() => toggleSubmenu(item.name)}
                className={`w-full flex items-center justify-between px-6 py-3 text-sm ${
                  isActive ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </div>
                {item.hasProjects && (
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                )}
              </button>
              
              {/* Projects Submenu */}
              {item.hasProjects && isExpanded && (
                <div className="bg-zinc-950/30">
                  {projects.map(project => {
                    const isProjectExpanded = expandedProjects[project.id];
                    const projectPath = `/projects/${project.id}`;
                    const isProjectActive = pathname.startsWith(projectPath);
                    
                    return (
                      <div key={project.id}>
                        <button
                          onClick={() => toggleProject(project.id)}
                          className={`w-full flex items-center justify-between px-6 py-2 pl-10 text-sm ${
                            isProjectActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                          } transition-colors`}
                        >
                          <span>{project.name}</span>
                          {isProjectExpanded ? 
                            <ChevronDown className="h-3 w-3" /> : 
                            <ChevronRight className="h-3 w-3" />
                          }
                        </button>
                        
                        {/* Project Subitems */}
                        {isProjectExpanded && (
                          <div className="pl-14 bg-zinc-950/50">
                            <Link
                              href={`/projects/${project.id}/apps`}
                              className={`flex items-center px-4 py-2 text-xs ${
                                pathname === `/projects/${project.id}/apps` ? 'text-white' : 'text-zinc-400 hover:text-white'
                              } transition-colors`}
                            >
                              <AppWindow className="h-3 w-3 mr-2" />
                              Apps
                            </Link>
                            <Link
                              href={`/projects/${project.id}/integrations`}
                              className={`flex items-center px-4 py-2 text-xs ${
                                pathname === `/projects/${project.id}/integrations` ? 'text-white' : 'text-zinc-400 hover:text-white'
                              } transition-colors`}
                            >
                              <Cable className="h-3 w-3 mr-2" />
                              Integrations
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Regular items without projects */}
              {!item.hasProjects && isExpanded && (
                <div className="pl-8 bg-zinc-950/50">
                  <Link
                    href={item.href}
                    className={`flex items-center px-6 py-2 text-sm ${
                      pathname === item.href ? 'text-white' : 'text-zinc-400 hover:text-white'
                    } transition-colors`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
} 