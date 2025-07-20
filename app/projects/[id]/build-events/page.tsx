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

export default function BuildEventsPage() {
  const [events, setEvents] = useState<BuildEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const eventsEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams ? searchParams.get('id') : null;

  useEffect(() => {
    console.log('BuildEventsPage mounted with projectId:', projectId);
    if (!projectId) {
      setError('No project ID provided.');
      setLoading(false);
      return;
    }
    let ws: WebSocket | null = null;
    try {
      const wsUrl = `ws://localhost:8000/api/v1/projects/${projectId}/ws/build_process`;
      console.log('Connecting to WebSocket endpoint for project:', wsUrl);
      ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        console.log('WebSocket connection opened');
        setLoading(false);
      };
      ws.onmessage = (event) => {
        console.log('Received WebSocket message:', event.data);
        try {
          const eventData = JSON.parse(event.data);
          setEvents(prev => [...prev, eventData]);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          setEvents(prev => [...prev, { message: event.data }]);
        }
      };
      ws.onerror = (err) => {
        console.error('WebSocket connection error', err);
        setError('Error occurred with WebSocket connection.');
        setFinished(true);
        ws?.close();
      };
      ws.onclose = (event) => {
        console.log('WebSocket connection closed', event);
        setFinished(true);
      };
    } catch (err) {
      console.error('Failed to establish WebSocket connection:', err);
      setError('Failed to connect to WebSocket.');
      setLoading(false);
      setFinished(true);
    }
    return () => {
      console.log('Cleaning up WebSocket connection');
      ws?.close();
    };
    // eslint-disable-next-line
  }, [projectId]);

  useEffect(() => {
    console.log('Scrolling to bottom after new events, count:', events.length);
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Build Events</h1>
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