'use client';

import { useEffect, useRef, useState } from 'react';
import BpmnJS from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
interface BpmnViewerProps {
  bpmnXml?: string;
}

export default function BpmnViewer({ bpmnXml }: BpmnViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [diagramName, setDiagramName] = useState<string>('diagram.bpmn');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [defaultBpmn, setDefaultBpmn] = useState<string | null>(null);

  // Load default BPMN from public directory
  useEffect(() => {
    fetch('/default.bpmn')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch default BPMN: ${response.statusText}`);
        }
        return response.text();
      })
      .then(text => {
        setDefaultBpmn(text);
      })
      .catch(err => {
        console.error('Error loading default BPMN:', err);
        setError(`Error loading default BPMN: ${err.message}`);
      });
  }, []);

  // Initialize and render BPMN diagram
  useEffect(() => {
    // Don't proceed if container is not ready or if we don't have bpmn diagram data
    if (!containerRef.current) return;
    
    // If explicit bpmnXml is provided, use it. Otherwise, use default diagram (if loaded).
    const diagramToRender = bpmnXml || defaultBpmn;
    
    // Wait until we have a diagram to render
    if (!diagramToRender) return;

    // Reset error state
    setError(null);
    setIsLoading(true);

    // Initialize the BPMN viewer
    const viewer = new BpmnJS({ container: containerRef.current });
    viewerRef.current = viewer;

    // Import the BPMN diagram
    viewer.importXML(diagramToRender)
      .then(({ warnings }: any) => {
        if (warnings && warnings.length) {
          console.warn('Warnings during BPMN import:', warnings);
        }
        
        // Adjust the view
        (viewer.get('canvas') as any).zoom('fit-viewport');
        setIsLoading(false);
      })
      .catch((err: Error) => {
        console.error('Error importing BPMN XML:', err);
        setError(`Could not import BPMN diagram: ${err.message}`);
        setIsLoading(false);
        
        // If provided diagram fails and we have a default diagram loaded, try that
        if (diagramToRender !== defaultBpmn && defaultBpmn) {
          viewer.importXML(defaultBpmn)
            .then(() => {
              console.log('Loaded default diagram instead');
              setError('Original diagram could not be loaded. Using default diagram instead.');
              (viewer.get('canvas') as any).zoom('fit-viewport');
              setIsLoading(false);
            })
            .catch((defaultErr: Error) => {
              console.error('Failed to load default diagram:', defaultErr);
            });
        }
      });

    return () => {
      viewer.destroy();
    };
  }, [bpmnXml, defaultBpmn]);

  const handleDownload = () => {
    const diagramToDownload = bpmnXml || defaultBpmn;
    if (!diagramToDownload) return;
    
    const blob = new Blob([diagramToDownload], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = diagramName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
        <div className="flex-grow">
          <input
            type="text"
            value={diagramName}
            onChange={(e) => setDiagramName(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded"
            placeholder="Filename"
          />
        </div>
        <button
          onClick={handleDownload}
          className="ml-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={!!error || isLoading || (!bpmnXml && !defaultBpmn)}
        >
          Download
        </button>
        <button
          onClick={() => {
            if (viewerRef.current) {
              viewerRef.current.get('canvas').zoom('fit-viewport');
            }
          }}
          className="ml-2 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
          disabled={!!error || isLoading}
        >
          Fit View
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      {isLoading && (
        <div className="p-4 flex justify-center items-center">
          <span className="text-sm text-gray-500">Loading diagram...</span>
        </div>
      )}
      
      <div
        ref={containerRef}
        className="bpmn-viewer"
        style={{ height: '500px', width: '100%' }}
      />
    </div>
  );
} 