'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Terminal, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface BuildEvent {
  message: string;
  info?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export default function BuildEventsSSEPage() {
  const [events, setEvents] = useState<BuildEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const eventsEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams ? searchParams.get('id') : null;

  useEffect(() => {
    if (!projectId) {
      setError('No project ID provided.');
      setLoading(false);
      return;
    }
    let eventSource: EventSource | null = null;
    let events_count = 0;
    try {
      const sseUrl = `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/sse/build_process`;
      eventSource = new EventSource(sseUrl);
      eventSource.onopen = () => {
        setLoading(false);
      };

      eventSource.onmessage = (event) => {
        try {
          const eventData = JSON.parse(event.data);
          setEvents(prev => [...prev, eventData]);
          events_count += 1;
        } catch (err) {
          setEvents(prev => [...prev, { message: event.data }]);
          events_count += 1;
        }
      };
      eventSource.onerror = (err) => {
        if (events_count == 0) {
          setError('Error occurred with SSE connection.');
          
        }
        setFinished(true);
        eventSource?.close();
          
      };
    } catch (err) {
      setError('Failed to connect to SSE.');
      setLoading(false);
      setFinished(true);
    }
    return () => {
      eventSource?.close();
    };
    // eslint-disable-next-line
  }, [projectId]);

  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <div className="container mx-auto py-8 px-6 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push(`/projects/${projectId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Project
          </Button>
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Build Events</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {loading && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Connecting to build stream...
            </Badge>
          )}
          {finished && (
            <Badge variant="default" className="flex items-center gap-2 bg-green-500">
              <CheckCircle className="h-3 w-3" />
              Build Completed
            </Badge>
          )}
          {error && (
            <Badge variant="destructive" className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3" />
              Connection Error
            </Badge>
          )}
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Build Console
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] w-full">
            <div className="bg-slate-950 text-green-400 p-6 font-mono text-sm">
              {events.length === 0 && !loading && (
                <div className="text-slate-400 italic">No events yet. Waiting for build to start...</div>
              )}
              
              {events.map((event, idx) => (
                <div key={idx} className="mb-4 border-l-2 border-slate-700 pl-4">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-blue-300 text-xs font-bold min-w-[60px]">
                      [{String(idx + 1).padStart(3, '0')}]
                    </span>
                    <span className="text-green-300 font-medium flex-1">
                      {event.message}
                    </span>
                  </div>
                  
                  {event.additional && Object.keys(event.additional).length > 0 && (
                    <div className="ml-16 mt-2 space-y-1">
                      <Separator className="bg-slate-700 mb-2" />
                      <div className="text-xs text-slate-300 font-semibold mb-2">Additional Information:</div>
                      {Object.entries(event.additional).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2 text-xs">
                          <span className="text-yellow-400 font-medium min-w-[100px] capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="text-slate-300 break-all">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Legacy support for direct properties */}
                  {Object.entries(event).filter(([key]) => key !== 'message' && key !== 'additional').map(([key, value]) => (
                    <div key={key} className="ml-16 mt-1">
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-yellow-400 font-medium min-w-[100px] capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-slate-300 break-all">
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              
              <div ref={eventsEndRef} />
              
              {finished && (
                <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-green-300 font-bold">
                    <CheckCircle className="h-5 w-5" />
                    Build process completed successfully!
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}