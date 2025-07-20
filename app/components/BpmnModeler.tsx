'use client';

import { useEffect, useRef, useState } from 'react';
import Modeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-js.css';

interface BpmnModelerProps {
  initialBpmn?: string;
  onXmlChange?: (xml: string) => void;
}

export default function BpmnModeler({ initialBpmn, onXmlChange }: BpmnModelerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('diagram.bpmn');
  const [xml, setXml] = useState<string | null>(null);
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
        if (!initialBpmn) {
          setXml(text);
        }
      })
      .catch(err => {
        console.error('Error loading default BPMN:', err);
        setError(`Error loading default BPMN: ${err.message}`);
      });
  }, [initialBpmn]);
  // Initialize and set up the BPMN modeler
  useEffect(() => {
    if (!containerRef.current) return;
    
    // If explicit initialBpmn is provided, use it. Otherwise, use default diagram (if loaded).
    const diagramToRender = initialBpmn || defaultBpmn;
    
    // Wait until we have a diagram to render
    if (!diagramToRender) return;

    // Reset error state
    setError(null);
    setIsLoading(true);

    // Initialize the BPMN modeler
    const modeler = new Modeler({
      container: containerRef.current,
      keyboard: {
        bindTo: window
      }
    });
    
    modelerRef.current = modeler;

    // Import the BPMN diagram
    modeler.importXML(diagramToRender)
      .then(({ warnings }) => {
        if (warnings.length) {
          console.warn('Warnings during import:', warnings);
        }
        
        // Adjust the view
        (modeler.get('canvas') as any).zoom('fit-viewport');
        setIsLoading(false);
        
        // Save the initial XML
        saveXML();
      })
      .catch((err: Error) => {
        console.error('Error importing BPMN XML:', err);
        setError(`Could not import BPMN diagram: ${err.message}`);
        setIsLoading(false);
        
        // If the provided diagram fails, try loading the default one
        if (diagramToRender !== defaultBpmn && defaultBpmn) {
          modeler.importXML(defaultBpmn)
            .then(() => {
              console.log('Loaded default diagram instead');
              setError('Original diagram could not be loaded. Using default diagram instead.');
              (modeler.get('canvas') as any).zoom('fit-viewport');
              setIsLoading(false);
              
              // Save the default XML
              saveXML();
            })
            .catch((defaultErr: Error) => {
              console.error('Failed to load default diagram:', defaultErr);
            });
        }
      });

    // Add event listeners
    modeler.on('element.changed', () => {
      saveXML();
    });

    return () => {
      modeler.destroy();
    };
  }, [initialBpmn, defaultBpmn, onXmlChange]);

  const saveXML = async () => {
    if (!modelerRef.current) return;

    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      setXml(xml);
      
      // Call the onXmlChange callback if provided
      if (onXmlChange) {
        onXmlChange(xml);
      }
    } catch (err) {
      console.error('Error saving XML', err);
    }
  };

  const handleDownload = async () => {
    if (!modelerRef.current) return;

    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading XML', err);
      setError(`Could not download BPMN diagram: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleResetView = () => {
    if (!modelerRef.current) return;
    modelerRef.current.get('canvas').zoom('fit-viewport');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
        <div className="flex-grow flex items-center space-x-2">
          <label htmlFor="fileName" className="text-sm font-medium text-gray-700">
            File Name:
          </label>
          <input
            id="fileName"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!!error || isLoading}
          >
            Download
          </button>
          <button
            onClick={handleResetView}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            disabled={!!error || isLoading}
          >
            Fit View
          </button>
        </div>
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
        className="bpmn-modeler flex-grow"
        style={{ width: '100%', minHeight: '800px' }}
      />
    </div>
  );
} 