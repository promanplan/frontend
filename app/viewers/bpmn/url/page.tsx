'use client';

import { useState, useCallback } from 'react';
import BpmnViewer from '@/components/BpmnViewer';

export default function BpmnUrlPage() {
  const [bpmnXml, setBpmnXml] = useState<string | undefined>(undefined);
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setBpmnXml(undefined);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch BPMN file: ${response.statusText}`);
      }
      
      const content = await response.text();
      
      // Basic validation - check if it contains BPMN content
      if (!content.includes('definitions') && !content.includes('bpmn:definitions')) {
        setError('The fetched file does not appear to be a valid BPMN file');
        return;
      }
      
      setBpmnXml(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch BPMN file');
    } finally {
      setLoading(false);
    }
  }, [url]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">BPMN URL Viewer</h1>
      
      <form onSubmit={handleUrlSubmit} className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="bpmn-url" className="block text-sm font-medium text-gray-700 mb-2">
              BPMN File URL
            </label>
            <input
              id="bpmn-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/diagram.bpmn or /sample.bpmn"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load Diagram'}
            </button>
          </div>
        </div>
      </form>
      
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="border border-gray-200 rounded-lg shadow-md">
        <BpmnViewer bpmnXml={bpmnXml} />
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-700 mb-2">Note:</h3>
        <p className="text-sm text-blue-600">
          If no URL is provided, the default BPMN diagram will be shown. You can also use local files like &quot;/sample.bpmn&quot; or &quot;/default.bpmn&quot;.
        </p>
      </div>
    </div>
  );
} 