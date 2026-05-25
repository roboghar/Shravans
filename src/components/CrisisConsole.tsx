/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  AlertTriangle, 
  Map, 
  MapPin, 
  Activity, 
  Check, 
  FileText, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  Compass, 
  ChevronRight,
  ShieldClose,
  Zap,
  Building
} from 'lucide-react';
import { EmergencyTicket } from '../types/eldercare';

interface CrisisConsoleProps {
  activeTicket: EmergencyTicket | null;
  onUpdateTriageLog: (hourIndex: number, text: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => void;
  onAssignManager: (managerName: string) => void;
  onSetHospital: (hospitalName: string) => void;
  onResolveTicket: () => void;
  onUpdateTicketStatus: (status: 'DISPATCHED' | 'EN_ROUTE' | 'ER_TRIAGE' | 'ADMITTED' | 'RESOLVED') => void;
}

export default function CrisisConsole({
  activeTicket,
  onUpdateTriageLog,
  onAssignManager,
  onSetHospital,
  onResolveTicket,
  onUpdateTicketStatus
}: CrisisConsoleProps) {

  const [managerInput, setManagerInput] = useState('Anjali Deshmukh (Indore Command)');
  const [hospitalInput, setHospitalInput] = useState('Apollo Hospitals, Indore');

  // Input States for the Triage Logs Editing
  const [inputLogs, setInputLogs] = useState<{ [key: number]: string }>({
    1: 'Intake initiated at Apollo Hospitals ER. Deposit requirement waived using Pre-Staged Insurance Policy: SH-7492-38290.',
    2: 'TPA Desk pre-auth forms verified and signed by dispatch manager. Chronic summary (MD, Diabetes) uploaded to ER desk docs.',
    3: 'Caregiver bedside proxy confirmed. Assigned legal proxy authorization signed by child in Bangalore digitally.',
    4: 'Patient condition completely stabilized. Transferred to ICU Room 204 for regular 24h vitals observation.',
  });

  const handleApplyLog = (hourIndex: number, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    onUpdateTriageLog(hourIndex, inputLogs[hourIndex] || '', status);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header & Live Alert Bar */}
      <div className="bg-[#1e1112] text-[#fca5a5] p-5 rounded-2xl border border-red-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-red-400 font-bold block uppercase">
            24/7 CRISIS RESPONSE PANEL
          </span>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white mt-1">
            <Zap className="w-5 h-5 text-red-400 animate-pulse" />
            Ambulatory Geofenced Dispatch Dashboard
          </h2>
          <p className="text-xs text-[#fca5a5]/70 mt-1">Indore Emergency Control Center: Active telemetry routing, ER admission checklist execution & hospital triage logs.</p>
        </div>

        {activeTicket ? (
          <div className="flex bg-rose-955/20 border border-red-800 p-1.5 rounded-xl font-mono text-xs items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="text-white font-bold uppercase tracking-wider">PANIC TELEMETRY BROADCAST LIVE</span>
          </div>
        ) : (
          <span className="bg-[#121c2d] text-blue-400 font-mono text-[10px] px-3 py-1.5 rounded-lg border border-blue-900/40 uppercase tracking-widest font-bold">
            🛡️ ALL SYSTEMS NOMINAL
          </span>
        )}
      </div>

      {!activeTicket ? (
        <div className="bg-[#0b1019] border border-blue-950/85 rounded-xl p-10 text-center text-sm text-gray-400 space-y-4">
          <ShieldCheck className="w-14 h-14 text-indigo-400/80 mx-auto stroke-1 animate-pulse" />
          <p className="font-bold text-white text-base">Ambulance Dispatch Dispatcher in Standby</p>
          <p className="text-xs max-w-lg mx-auto leading-relaxed text-gray-400">
            No active SOS panic triggers in Indore hubs. If a long-distance child or field caregiver launches an S.O.S alert, this dashboard instantly unlocks with live geofenced audio patches, hospital admissions tracking interfaces, and route maps.
          </p>
          <span className="text-[10px] text-indigo-400 block font-mono">STANDBY POOLING • ZONE A-E INDORE CONNECTIVITY: OK</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Ticket Detail & GPS routing (5cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Ticket Management Controls */}
            <div className="bg-[#080d14] p-5 rounded-2xl border border-blue-950/80 space-y-4 text-xs">
              <h3 className="text-white font-bold text-sm tracking-tight border-b border-blue-900/10 pb-2">Active Emergency Incident Details</h3>
              
              <div className="space-y-3 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Parent Name:</span>
                  <span className="text-white font-bold">{activeTicket.parentName} (78)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Incident Latitude/Longitude:</span>
                  <span className="text-white">{activeTicket.currentLocation.lat}, {activeTicket.currentLocation.lng}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Hub Address:</span>
                  <span className="text-yellow-400 font-semibold">{activeTicket.currentLocation.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Triggered At:</span>
                  <span className="text-white">{new Date(activeTicket.triggeredAt).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Set Hospital and Manager */}
              <div className="space-y-3 pt-3 border-t border-blue-900/10">
                <div>
                  <label className="block text-gray-500 mb-1 font-mono uppercase text-[10px]">Assigned Dispatch Care Manager</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={managerInput}
                      onChange={(e) => setManagerInput(e.target.value)}
                      className="bg-slate-900 border border-blue-950 rounded p-1.5 text-xs text-white uppercase focus:outline-none flex-1 font-mono"
                    />
                    <button 
                      onClick={() => onAssignManager(managerInput)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2 text-xs font-bold"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 mb-1 font-mono uppercase text-[10px]">Triage Target Hospital (ER)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={hospitalInput}
                      onChange={(e) => setHospitalInput(e.target.value)}
                      className="bg-slate-900 border border-blue-950 rounded p-1.5 text-xs text-white uppercase focus:outline-none flex-1 font-mono"
                    />
                    <button 
                      onClick={() => onSetHospital(hospitalInput)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2 text-xs font-bold"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-2 pt-3 border-t border-blue-900/10">
                <span className="block text-gray-500 font-mono uppercase text-[10px]">Modify Escalation Pipeline Status</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['DISPATCHED', 'EN_ROUTE', 'ER_TRIAGE', 'ADMITTED'] as any[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateTicketStatus(st)}
                      className={`py-1.5 rounded font-mono font-bold text-[10px] ${
                        activeTicket.status === st ? 'bg-red-650 text-white border border-red-600' : 'bg-slate-900 text-gray-400 border border-blue-950'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={onResolveTicket}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Mark Emergency Resolved & Archives Ticket
              </button>
            </div>

            {/* Simulated Live GPS Map View */}
            <div className="bg-[#05080e] p-5 rounded-2xl border border-blue-950/80 text-xs">
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold block uppercase mb-3">
                Live इंदौर GPS Routing Dispatch Map
              </span>

              {/* Visual SVG Map Simulation */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-blue-950 flex items-center justify-center">
                <svg viewBox="0 0 400 200" className="w-full h-full text-slate-700 opacity-90">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#0f172a" strokeWidth="1" strokeDasharray="5" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#0f172a" strokeWidth="1" strokeDasharray="5" />
                  <line x1="0" y1="150" x2="400" y2="150" stroke="#0f172a" strokeWidth="1" strokeDasharray="5" />
                  <line x1="100" y1="0" x2="100" y2="200" stroke="#0f172a" strokeWidth="1" strokeDasharray="5" />
                  <line x1="200" y1="0" x2="200" y2="200" stroke="#0f172a" strokeWidth="1" strokeDasharray="5" />
                  <line x1="300" y1="0" x2="300" y2="200" stroke="#0f172a" strokeWidth="1" strokeDasharray="5" />

                  {/* Route Line from Parent Home to Apollo Hospital */}
                  <path d="M 120,130 L 180,130 L 180,70 L 290,70" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" className="stroke-dash" strokeDasharray="10 4" />

                  {/* Nodes and Icons */}
                  {/* Parent Home Address */}
                  <circle cx="120" cy="130" r="10" fill="#2563eb" fillOpacity="0.2" />
                  <circle cx="120" cy="130" r="5" fill="#2563eb" />
                  <text x="120" y="152" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">SCHEME 54 (HOME)</text>

                  {/* Apollo Hospital Target */}
                  <circle cx="290" cy="70" r="12" fill="#a855f7" fillOpacity="0.2" />
                  <circle cx="290" cy="70" r="6" fill="#a855f7" />
                  <text x="290" y="52" fill="#d8b4fe" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">APOLLO HOSPITAL (ER)</text>

                  {/* Moving Ambulance dot */}
                  <circle cx="210" cy="70" r="6" fill="#ef4444" className="animate-pulse" />
                  <text x="220" y="82" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">AMBULANCE EN ROUTE</text>

                  {/* Indore landmarks */}
                  <text x="50" y="40" fill="#475569" fontSize="8" fontFamily="monospace">VIJAY NAGAR SQUARE</text>
                  <text x="320" y="160" fill="#475569" fontSize="8" fontFamily="monospace">A.B. ROAD STRETCH</text>
                </svg>

                {/* Info Layer Overlay */}
                <div className="absolute top-2 left-2 bg-slate-900/95 border border-blue-950 p-2 rounded text-[10px] font-mono leading-tight space-y-1">
                  <div className="text-white font-bold">ETA: 6 mins</div>
                  <div className="text-gray-400">Distance: 2.8 km • AB Road Traffic Normal</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel: Hospitalization Admissions Triage Timeline (7cols) */}
          <div className="lg:col-span-7 bg-[#080d15] p-6 rounded-2xl border border-blue-950/80 space-y-6">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold block uppercase">
                CRISIS INTAKE LOG
              </span>
              <h3 className="text-lg font-bold text-white mt-1">First-4-Hours Admissions Triage Log</h3>
              <p className="text-xs text-gray-400 mt-1">Document critical intake milestones during the first 4 hours of emergency admission to keep client family informed.</p>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-6 relative border-l-2 border-slate-800 ml-4 pl-6 pt-2">
              {activeTicket.triageLogs.map((log) => {
                const stepIndex = log.hourIndex;

                return (
                  <div key={log.id} className="relative space-y-3 font-sans">
                    {/* Circle checklist badge indicator */}
                    <div className={`absolute -left-[35px] w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs ${
                      log.status === 'COMPLETED' ? 'bg-emerald-600 border-emerald-500 text-white' :
                      log.status === 'IN_PROGRESS' ? 'bg-indigo-600 border-indigo-500 text-white animate-pulse' :
                      'bg-slate-900 border-slate-800 text-zinc-500'
                    }`}>
                      {log.status === 'COMPLETED' ? '✓' : stepIndex}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">
                          HOUR {stepIndex} CRITICAL TIMELINE
                        </span>
                        <h4 className="text-sm font-semibold text-white mt-0.5">{log.title}</h4>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        log.status === 'COMPLETED' ? 'bg-emerald-950/80 text-emerald-400' :
                        log.status === 'IN_PROGRESS' ? 'bg-indigo-950/80 text-indigo-400' :
                        'bg-slate-950 text-zinc-500'
                      }`}>
                        {log.status}
                      </span>
                    </div>

                    {/* Editor Panel for State Logger */}
                    <div className="bg-slate-950 border border-blue-950 p-3 rounded-xl space-y-3">
                      <textarea
                        rows={2}
                        value={inputLogs[stepIndex] || ''}
                        onChange={(e) => {
                          setInputLogs({
                            ...inputLogs,
                            [stepIndex]: e.target.value
                          });
                        }}
                        className="w-full bg-slate-900 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-550 border border-blue-950 rounded p-2"
                        placeholder="Log status notes here..."
                      />

                      <div className="flex justify-end gap-2 font-mono">
                        <button 
                          onClick={() => handleApplyLog(stepIndex, 'IN_PROGRESS')}
                          className="px-2.5 py-1 text-[10px] rounded bg-indigo-950 hover:bg-indigo-900 text-indigo-400 font-bold border border-indigo-900"
                        >
                          Mark Active
                        </button>
                        <button 
                          onClick={() => handleApplyLog(stepIndex, 'COMPLETED')}
                          className="px-2.5 py-1 text-[10px] rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-400 font-bold border border-emerald-900"
                        >
                           ✓ Verify Milestone Complete
                        </button>
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-500 font-mono flex justify-between pr-2">
                      <span>Ref Log: CM-INTAKE-{stepIndex}</span>
                      <span>Last Stamp: {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Awaiting'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-blue-950/20 text-xs text-blue-300 border border-blue-900/30 leading-relaxed font-sans">
              <strong>Triage Log Transparency Standard:</strong> All admissions log updates immediately emit webhook pushes visible to child clients in Bangalore/Mumbai to maintain complete digital visibility of the elder's stabilization loop.
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
