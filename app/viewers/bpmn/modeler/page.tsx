'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import BpmnModeler from '@/components/BpmnModeler';

export default function BpmnModelerPage() {
  const searchParams = useSearchParams();
  const documentPath = searchParams?.get('path');
  const [bpmnXml, setBpmnXml] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setBpmnXml(content);
    };
    reader.readAsText(file);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">BPMN Modeler</h1>
      
      {documentPath && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-700">Editing document: <span className="font-medium">{documentPath}</span></p>
        </div>
      )}
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload BPMN File (optional)
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
      </div>
      
      <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <BpmnModeler initialBpmn={bpmnXml || undefined} />
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-md text-sm text-blue-700">
        <h3 className="font-medium mb-2">Usage Tips:</h3>
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
    </div>
  );
} 