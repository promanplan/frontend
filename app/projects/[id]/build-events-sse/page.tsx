'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface BuildEvent {
  message: string;
  file?: string;
  build_id?: string;
  project_id?: string;
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Build Events (SSE)</h1>
      {loading && <div className="mb-4">Connecting to build event stream...</div>}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="bg-black text-green-400 rounded p-4 h-96 overflow-y-auto font-mono text-sm shadow-inner">
        {events.length === 0 && !loading && <div>No events yet.</div>}
        {events.map((event, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-bold">{event.message}</span>
            {event.file && (
              <div className="text-xs text-blue-300">File: {event.file}</div>
            )}
          </div>
        ))}
        <div ref={eventsEndRef} />
        {finished && <div className="mt-4 text-green-300 font-bold">Build finished.</div>}
      </div>
      <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => router.push(`/projects/${projectId}`)}>
        Go to Project
      </button>
    </div>
  );
} 