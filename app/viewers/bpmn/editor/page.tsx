'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BpmnModeler from '@/components/BpmnModeler';

export default function BpmnModelerPage() {
  const searchParams = useSearchParams();
  const documentPath = searchParams?.get('path');
  const filename = searchParams?.get('filename');
  const projectId = searchParams?.get('projectId');
  const [content, setContent] = useState<string | null>(null);
  const [bpmnXml, setBpmnXml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tipsCollapsed, setTipsCollapsed] = useState<boolean>(true);

  useEffect(() => {

    let url = `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/projects/${projectId}/documents/${filename}`;
    console.log(url, "url");
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("access_token")}`
    }

    if (!filename) return;
    setError(null);
    setBpmnXml(null);
    fetch(url, { headers : headers })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch BPMN: ${res.statusText}`);
        return res.text();
      })
      .then((text) => setContent(text))
      .catch((err) => setError(`Error loading BPMN from URL: ${err.message}`));
  }, [filename, projectId]);

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6">BPMN Modeler</h1>
      
      {documentPath && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-700">Editing document: <span className="font-medium">{documentPath}</span></p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden flex-grow">
        <BpmnModeler initialBpmn={content || undefined} />
      </div>
      
      <div className="mt-4">
        <button 
          onClick={() => setTipsCollapsed(!tipsCollapsed)}
          className="flex items-center justify-between w-full p-3 bg-blue-50 rounded-md text-sm text-blue-700 font-medium"
        >
          <span>Usage Tips</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`transition-transform ${tipsCollapsed ? '' : 'transform rotate-180'}`}
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        
        {!tipsCollapsed && (
          <div className="mt-2 p-4 bg-blue-50 rounded-md text-sm text-blue-700">
            <ul className="list-disc list-inside space-y-1">
              <li>Drag elements from the palette on the left to the canvas</li>
              <li>Connect elements by clicking and dragging from one element to another</li>
              <li>Edit element properties by clicking on them</li>
              <li>Use the mouse wheel to zoom in and out</li>
              <li>Click and drag the canvas to pan</li>
              <li>Click &quot;Fit View&quot; to reset the view</li>
              <li>Click &quot;Download&quot; to save your diagram</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 