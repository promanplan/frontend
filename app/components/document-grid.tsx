'use client';

import Link from 'next/link';
import { FileIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { formatDistanceToNow } from 'date-fns';

interface Document {
  id: string;
  name: string;
  modifiedAt: Date;
}

interface DocumentGridProps {
  documents: Document[];
  projectId: string;
}

export default function DocumentGrid({ documents, projectId }: DocumentGridProps) {
  const formatDate = (date: Date) => {
    const distance = formatDistanceToNow(date, { addSuffix: false });
    return distance === 'less than a minute' ? 'just now' : `${distance} ago`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <Link href={`/projects/${projectId}/documents/${encodeURIComponent(doc.name)}`} key={doc.id} passHref legacyBehavior>
          <a className="block h-full">
            <Card className="h-full cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="w-full h-36 flex items-center justify-center mb-4">
                  <FileIcon className="h-24 w-24 text-muted-foreground/60" />
                </div>
                <div className="w-full mb-4">
                  <h3 className="font-medium truncate">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Last modified {formatDate(doc.modifiedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>
        </Link>
      ))}
    </div>
  );
} 