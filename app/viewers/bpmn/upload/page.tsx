'use client';

import { useState, useCallback } from 'react';
import BpmnViewer from '@/components/BpmnViewer';

export default function BpmnUploadPage() {
  const [bpmnXml, setBpmnXml] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        // Basic validation - check if it contains BPMN content
        if (!content.includes('definitions') && !content.includes('bpmn:definitions')) {
          setError('The uploaded file does not appear to be a valid BPMN file');
          return;
        }
        
        setBpmnXml(content);
      } catch (err) {
        console.error('Error processing file:', err);
        setError(`Error processing file: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading the file');
    };
    
    reader.readAsText(file);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">BPMN File Uploader</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload BPMN File (.bpmn, .xml)
        </label>
        <input
          type="file"
          accept=".bpmn,.xml"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
          "
        />
        {fileName && (
          <p className="mt-2 text-sm text-gray-600">Selected file: {fileName}</p>
        )}
        
        {error && (
          <div className="mt-2 p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      <div className="border border-gray-200 rounded-lg shadow-md">
        <BpmnViewer bpmnXml={bpmnXml} />
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-700 mb-2">Note:</h3>
        <p className="text-sm text-blue-600">
          If no file is uploaded, the default BPMN diagram will be shown. Upload a BPMN file to view your own diagram.
        </p>
      </div>
    </div>
  );
} 