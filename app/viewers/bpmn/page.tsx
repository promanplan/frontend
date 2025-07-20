'use client';

import BpmnViewer from '@/components/BpmnViewer';

export default function BpmnViewerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">BPMN Viewer</h1>
      <div className="border border-gray-200 rounded-lg shadow-md">
        <BpmnViewer />
      </div>
    </div>
  );
} 