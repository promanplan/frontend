'use client';

import React from 'react';
import Link from 'next/link';
import { IconFileText, IconMarkdown } from '@tabler/icons-react';

import { ProjectFile } from '@/lib/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectFilesListProps {
  files: ProjectFile[];
  projectId: string;
}

const getFileIcon = (filetype: string) => {
  switch (filetype) {
    case 'md':
      return <IconMarkdown className="mr-2 h-5 w-5" />;
    default:
      return <IconFileText className="mr-2 h-5 w-5" />;
  }
};

export default function ProjectFilesList({ files, projectId }: ProjectFilesListProps) {
  if (!files || files.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">No files found for this project.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Files</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file.filename}>
              <Link 
                href={`/document/${projectId}?url=${encodeURIComponent(file.url)}&filename=${encodeURIComponent(file.filename)}`}
                className="flex items-center p-2 hover:bg-muted rounded-md transition-colors"
              >
                {getFileIcon(file.filetype)}
                <span>{file.filename}</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 