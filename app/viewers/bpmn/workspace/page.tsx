'use client';

import { useState, useEffect, useCallback } from 'react';
import BpmnModeler from '@/components/BpmnModeler';
import BpmnViewer from '@/components/BpmnViewer';

// Sample BPMN XML to use as initial diagram
const INITIAL_BPMN = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_1" name="Task">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="Event_1" name="End">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_1" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_1" targetRef="Event_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="155" y="145" width="31" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1_di" bpmnElement="Activity_1">
        <dc:Bounds x="240" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1_di" bpmnElement="Event_1">
        <dc:Bounds x="392" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="400" y="145" width="20" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="392" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

export default function BpmnWorkspacePage() {
  const [bpmnXml, setBpmnXml] = useState<string | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState<'modeler' | 'viewer'>('modeler');
  
  // Update the BPMN XML from modeler
  const handleBpmnXmlChange = useCallback((xml: string) => {
    if (xml) {
      setBpmnXml(xml);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">BPMN Workspace</h1>
      
      {/* Mobile Tab Navigation - Show only on small screens */}
      <div className="md:hidden border border-gray-200 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-3 px-6 text-sm font-medium flex-1 ${
              selectedTab === 'modeler'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('modeler')}
          >
            Modeler
          </button>
          <button
            className={`py-3 px-6 text-sm font-medium flex-1 ${
              selectedTab === 'viewer'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('viewer')}
          >
            Viewer
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="md:flex md:gap-4">
        <div className={`md:w-1/2 border border-gray-200 rounded-lg shadow-md overflow-hidden ${selectedTab === 'modeler' ? 'block' : 'hidden md:block'} mb-6 md:mb-0`}>
          <div className="bg-gray-50 py-2 px-4 border-b border-gray-200">
            <h2 className="font-medium">Modeler - Edit Your Diagram</h2>
          </div>
          <BpmnModeler onXmlChange={handleBpmnXmlChange} />
        </div>
        
        <div className={`md:w-1/2 border border-gray-200 rounded-lg shadow-md overflow-hidden ${selectedTab === 'viewer' ? 'block' : 'hidden md:block'}`}>
          <div className="bg-gray-50 py-2 px-4 border-b border-gray-200">
            <h2 className="font-medium">Viewer - Preview Your Diagram</h2>
          </div>
          <BpmnViewer bpmnXml={bpmnXml} />
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-md text-sm text-blue-700">
        <h3 className="font-medium mb-2">Workspace Features:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Create and edit BPMN diagrams in the Modeler panel</li>
          <li>Changes are automatically reflected in the Viewer panel</li>
          <li>On mobile, switch between Modeler and Viewer using the tabs</li>
          <li>On desktop, both views are displayed side by side</li>
          <li>Download your diagram using the Download button in the Modeler</li>
        </ul>
      </div>
    </div>
  );
} 