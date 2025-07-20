'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';
import React, { ReactNode } from 'react';
import type { ComponentProps } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DocumentPageProps {
  params: {
    id: string;
    document_id: string;
  };
}


function MermaidChart({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      try {
        mermaid.initialize({ 
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#1e2228',
            primaryTextColor: '#fff',
            primaryBorderColor: '#6c7280',
            lineColor: '#6c7280',
            secondaryColor: '#252a33',
            tertiaryColor: '#1e2228',
            background: '#1e2228',
            mainBkg: '#252a33',
            nodeBorder: '#6c7280',
            clusterBkg: '#1e2228',
            clusterBorder: '#6c7280',
            titleColor: '#fff',
            edgeLabelBackground: '#1e2228',
            textColor: '#fff'
          }
        });
        const id = 'mermaid-svg-' + Math.random().toString(36).substr(2, 9);
        mermaid.render(id, chart).then((res) => {
          if (ref.current) {
            ref.current.innerHTML = res.svg;
          }
        }).catch(() => {
          if (ref.current) {
            ref.current.innerHTML = '<pre style="color: red">Invalid mermaid diagram</pre>';
          }
        });
      } catch (e) {
        if (ref.current) {
          ref.current.innerHTML = '<pre style="color: red">Invalid mermaid diagram</pre>';
        }
      }
    }
  }, [chart]);
  return <div ref={ref} className="mermaid" />;
} 

export default function DocumentPage({ params }: DocumentPageProps) {
  const { id: projectId, document_id: documentId } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const filename = searchParams?.get('filename') || documentId;
  
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocumentContent() {
      try {
        setLoading(true);
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        };
        
        const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/documents/${documentId}`;
        const response = await fetch(backendUrl, { headers });
        
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status}`);
        }
        
        const documentText = await response.text();
        setContent(documentText);
        setError(null);
      } catch (err) {
        setError('Failed to load document content. Please try again later.');
        console.error('Error loading document content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDocumentContent();
  }, [projectId, documentId, router]);

  if (error) {
    return (
      <div className="p-6">
        <Link href={`/projects/${projectId}`}>
          <Button variant="outline" size="sm" className="mb-4">
            <IconArrowLeft className="mr-2 h-4 w-4" /> Back to Project
          </Button>
        </Link>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6">Loading document...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Link href={`/projects/${projectId}`}>
        <Button variant="outline" size="sm" className="mb-4">
          <IconArrowLeft className="mr-2 h-4 w-4" /> Back to Project
        </Button>
      </Link>
      
      <Card style={{ backgroundColor: '#1e2228' }}>
        <CardHeader>
          <CardTitle>{filename || 'Document'}</CardTitle>
        </CardHeader>
        <CardContent>
          {content ? (
            <div className="prose max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  code({inline, className, children, ...props}: ComponentProps<'code'> & {inline?: boolean}) {
                    const match = /language-(\w+)/.exec(className || '');
                    if (match && match[1] === 'mermaid') {
                      // Mermaid diagram rendering
                      return (
                        <div className="p-4 bg-gray-800 rounded-md my-4 overflow-auto">
                          <MermaidChart chart={String(children)} />
                        </div>
                      );
                    }
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={dark}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-muted-foreground">This document is empty.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}