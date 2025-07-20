'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BpmnViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/viewers/bpmn/viewer', label: 'Simple Viewer', exact: true },
    { href: '/viewers/bpmn/upload', label: 'Upload BPMN' },
    { href: '/viewers/bpmn/url', label: 'URL Viewer' },
    { href: '/viewers/bpmn/modeler', label: 'BPMN Modeler' },
    { href: '/viewers/bpmn/workspace', label: 'Workspace' },
    { href: '/viewers/bpmn/editor', label: 'Editor' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">BPMN Viewer</h1>
          <nav className="mt-4">
            <ul className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const isActive = item.exact 
                  ? pathname === item.href
                  : pathname?.startsWith(item.href) ?? false;

                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
      <main className="py-6">
        {children}
      </main>
    </div>
  );
} 