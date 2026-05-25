/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Heart, 
  Activity, 
  AlertOctagon, 
  FileText, 
  Camera, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight, 
  Video, 
  PhoneCall, 
  Download, 
  Check, 
  ShieldAlert, 
  Plus, 
  Pill, 
  Store,
  Compass,
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';
import { 
  VitalsRecord, 
  ChecklistRecord, 
  MedicineInventory, 
  DoctorVisitEscort, 
  MarketplaceService, 
  MarketplaceBooking, 
  PreStagedEmergencyFolder, 
  EmergencyTicket 
} from '../types/eldercare';

// Generate simulated data for charts
const generateTrendData = (daysCount: number) => {
  const data = [];
  const baseBP = 130;
  const baseSugar = 110;
  
  for (let i = daysCount; i >= 1; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Simulating slight variation
    const systolicNoise = Math.sin(i * 0.5) * 8 + (Math.random() * 4 - 2);
    const diastolicNoise = Math.cos(i * 0.5) * 5 + (Math.random() * 2 - 1);
    const sugarNoise = Math.sin(i * 0.8) * 15 + (Math.random() * 10 - 5);

    // Intentional "regression" anomalies for demo purposes in 30d/90d intervals
    const isAnomaly = daysCount >= 30 && i === 12; 
    
    data.push({
      date: dateStr,
      systolic: Math.round(baseBP + systolicNoise + (isAnomaly ? 15 : 0)),
      diastolic: Math.round(80 + diastolicNoise + (isAnomaly ? 8 : 0)),
      bloodSugar: Math.round(baseSugar + sugarNoise + (isAnomaly ? 35 : 0)),
      isAlert: isAnomaly,
    });
  }
  return data;
};

interface ChildDashboardProps {
  vitalsHistory: VitalsRecord[];
  checklistHistory: ChecklistRecord[];
  medicineInventory: MedicineInventory[];
  escortVisits: DoctorVisitEscort[];
  activeTicket: EmergencyTicket | null;
  triggerEmergencySOS: () => void;
  marketplaceServices: MarketplaceService[];
  activeBookings: MarketplaceBooking[];
  onBookService: (service: MarketplaceService, targetDate: string) => void;
  preStagedFolder: PreStagedEmergencyFolder;
  onUploadBill: (medId: string, amount: number) => void;
  onToggleAudio: (visitId: string) => void;
}

export default function ChildDashboard({
  vitalsHistory,
  checklistHistory,
  medicineInventory,
  escortVisits,
  activeTicket,
  triggerEmergencySOS,
  marketplaceServices,
  activeBookings,
  onBookService,
  preStagedFolder,
  onUploadBill,
  onToggleAudio
}: ChildDashboardProps) {
  const [activeTrendRange, setActiveTrendRange] = useState<7 | 30 | 90>(7);
  const [activeChartType, setActiveChartType] = useState<'BP' | 'SUGAR'>('BP');
  const [selectedService, setSelectedService] = useState<MarketplaceService | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('2026-05-26T10:00');
  const [reimburseAmount, setReimburseAmount] = useState<string>('');
  const [activeMedIdForBill, setActiveMedIdForBill] = useState<string | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // Generate trend line points
  const trendData = generateTrendData(activeTrendRange);
  const maxValue = activeChartType === 'BP' ? 170 : 180;
  const minValue = activeChartType === 'BP' ? 60 : 70;

  // Latest records
  const latestVitals = vitalsHistory[0] || null;
  const latestChecklist = checklistHistory[0] || null;

  // Media compiled preview simulator
  const mediaPhotoUrl = "https://images.unsplash.com/photo-1544120199-ec754ab3dd18?auto=format&fit=crop&q=80&w=400"; // Elegant looking grandparent setup

  const handleDownloadFolder = () => {
    // Simulate real PDF payload extraction & browser download intent
    setDownloadSuccessMessage("🚀 Pre-staged emergency folder compilation generated successfully! Emergency PDF pack (Chronic summaries, keys locator guide, and health policy cards) downloaded to device.");
    setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 6000);
  };

  const submitReimbursement = (medId: string) => {
    const amt = parseFloat(reimburseAmount);
    if (!isNaN(amt) && amt > 0) {
      onUploadBill(medId, amt);
      setReimburseAmount('');
      setActiveMedIdForBill(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Premium Dashboard Frame */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200 uppercase tracking-wider">
              Long-Distance Client Portal
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-gray-500 font-mono">Syncing Indore-Vijay Nagar Hub • Real-time</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mt-1.5">Parent's Care Healthboard</h1>
          <p className="text-sm text-gray-600">Track and manage emergency systems, vitals trends and logistics schedules for Om Prakash Sharma (78).</p>
        </div>

        {/* SOS Panic Launch Pad */}
        <div id="sos_child_trigger" className="w-full md:w-auto">
          {activeTicket ? (
            <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
              </span>
              <div>
                <p className="text-xs font-mono text-red-700 font-bold uppercase tracking-wider">EMERGENCY FIRST RESPONSE ACTIVE</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-semibold text-red-950">Status: {activeTicket.status}</span>
                  <span className="text-xs text-red-600">({activeTicket.hospitalName})</span>
                </div>
              </div>
            </div>
          ) : (
            <button
              id="sos_parent_switch"
              onClick={triggerEmergencySOS}
              className="w-full md:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-red-500/10 hover:shadow-red-500/25 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              <AlertOctagon className="w-5 h-5 animate-pulse text-red-200" />
              <div className="text-left leading-tight">
                <span className="block text-[10px] text-red-200 font-mono font-bold tracking-widest uppercase">CRITICAL SYSTEM</span>
                <span className="block text-sm">LAUNCH PANIC S.O.S SWITCH </span>
              </div>
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all" />
            </button>
          )}
        </div>
      </div>

      {/* Emergency Folder Notification Toast */}
      {downloadSuccessMessage && (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl flex items-start gap-3 border border-slate-800 animate-slide-up">
          <Check className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed text-gray-200 font-medium">{downloadSuccessMessage}</p>
        </div>
      )}

      {/* SECTION 1: TODAY'S TELEMETRY & MEDIA LOOP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card A: Vitals Status Widget */}
        <div id="vitals_telemetry" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Live Clinical Vitals</h3>
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                Shift: {latestVitals?.phase || 'MORNING'}
              </span>
            </div>
            
            {latestVitals ? (
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">BLOOD PRESSURE</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold tracking-tight text-gray-950">
                      {latestVitals.bpSystolic || latestVitals.eveningBpSystolic || '--'}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">/</span>
                    <span className="text-lg font-bold text-gray-700">
                      {latestVitals.bpDiastolic || latestVitals.eveningBpDiastolic || '--'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono ml-1">mmHg</span>
                  </div>
                  <span className={`text-[10px] font-semibold block mt-1.5 ${
                    (latestVitals.bpSystolic || 0) > 135 ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {(latestVitals.bpSystolic || 0) > 135 ? '⚠️ Elevated BP' : '✓ Pre-Hypertensive Normal'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">BLOOD SUGAR</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold tracking-tight text-gray-950">
                      {latestVitals.bloodSugar || latestVitals.eveningBloodSugar || '--'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono ml-1">mg/dL</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500 block mt-1.5">
                    ({latestVitals.bloodSugarType || 'FASTING'})
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">PULSE RATE</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold tracking-tight text-gray-950">{latestVitals.pulseRate || '--'}</span>
                    <span className="text-[10px] text-gray-400 font-mono ml-1">BPM</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 block mt-1.5">✓ Standard Stable</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">O2 SATURATION</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold tracking-tight text-gray-950">{latestVitals.oxygenSat || '--'}</span>
                    <span className="text-[10px] text-gray-400 font-mono ml-1">%</span>
                  </div>
                  <span className={`text-[10px] font-semibold block mt-1.5 ${
                    (latestVitals.oxygenSat || 100) < 95 ? 'text-rose-600 font-bold' : 'text-emerald-700'
                  }`}>
                    {(latestVitals.oxygenSat || 100) < 95 ? '⚠️ SpO2 Deficient' : '✓ Normal Saturation'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 font-sans text-xs flex flex-col items-center justify-center gap-2">
                <Heart className="w-8 h-8 text-rose-200 stroke-1" />
                <span>Waiting for Morning Shift Clinical Logs...</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-mono">
            <span>Last Field Check</span>
            <span>{latestVitals ? new Date(latestVitals.timestamp).toLocaleTimeString() : 'Pending'}</span>
          </div>
        </div>

        {/* Card B: Live WhatsApp/App Smiling Media Card */}
        <div id="smiling_media_loop" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Transparency Photo Loop
              </h3>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold">
                Daily Loop Active
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-video border border-gray-100">
              <img 
                src={mediaPhotoUrl} 
                alt="Parent Smiling Morning" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                <span className="text-[10px] text-emerald-400 font-mono font-bold">✓ AUTO-COMPILED WHATSAPP SUMMARY</span>
                <p className="text-[11px] text-slate-100 font-sans mt-0.5 line-clamp-2 italic">
                  "Om Prakashji sat on the veranda, enjoyed green tea and read the Morning Indore Samachar. Vitals completely normal."
                </p>
                <span className="text-[9px] text-indigo-200 mt-1 font-mono">Compiled by Caregiver: Deepak Sharma</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex gap-2">
            <button className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              Share on Family Slack/WhatsApp
            </button>
          </div>
        </div>

        {/* Card C: Pre-Staged Home Emergency Vault */}
        <div id="emergency_vault" className="bg-slate-900 text-gray-200 p-6 rounded-2xl shadow-md border border-slate-850 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-red-400 font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-red-400" />
                Secure Emergency Folder
              </span>
              <span className="text-[9px] font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">Pre-Staged</span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              A pre-authenticated packet compiled for direct handover to emergency responders or hospital desks in Indore.
            </p>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Blood Group</span>
                <span className="font-mono font-bold text-white">{preStagedFolder.bloodGroup}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Chronic Summary</span>
                <span className="text-zinc-300 font-medium">{preStagedFolder.chronicConditions.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Insurance Provider</span>
                <span className="text-zinc-300">{preStagedFolder.insuranceProvider}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Preferred Hospital (ER)</span>
                <span className="text-yellow-400 font-semibold">{preStagedFolder.preferredHospital}</span>
              </div>
              <div className="py-2 text-[10px] bg-red-950/20 text-red-300 rounded p-2.5 max-w-full font-mono mt-1 border border-red-900/30">
                🔑 Key Box Location: {preStagedFolder.emergencyKeysLocation}
              </div>
            </div>
          </div>

          <button 
            onClick={handleDownloadFolder}
            className="w-full bg-red-650 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 mt-4 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Emergency Folder PDF Pack
          </button>
        </div>

      </div>

      {/* SECTION 2: HEALTHY TRENDS ENGINE ANALYTICS */}
      <div id="health_trends" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Physiological Trend Engine
            </h3>
            <p className="text-xs text-gray-500">Analytical line charts identifying regressions, spikes, and medication consistency loops.</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-4 md:mt-0 font-sans">
            {/* Chart Type Selector */}
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveChartType('BP')}
                className={`px-3 py-1 rounded font-medium transition-all ${
                  activeChartType === 'BP' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Blood Pressure
              </button>
              <button
                onClick={() => setActiveChartType('SUGAR')}
                className={`px-3 py-1 rounded font-medium transition-all ${
                  activeChartType === 'SUGAR' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Pre-dinner sugar
              </button>
            </div>

            {/* Range Selector */}
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveTrendRange(d as any)}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    activeTrendRange === d ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Handcrafted Interactive SVG Chart Engine (guarantees Vite 6 compilation and beautiful styles with absolute compatibility) */}
        <div className="relative bg-slate-50/50 rounded-xl p-4 border border-slate-100">
          <div className="flex justify-between items-center text-[10px] text-gray-400 mb-2 font-mono">
            <span>High Threshold Warning Limit ({activeChartType === 'BP' ? '140 mmHg' : '140 mg/dL'})</span>
            <span className="text-indigo-600 font-semibold">{activeTrendRange} Points Rendered</span>
          </div>

          <div className="h-64 relative flex items-end justify-between gap-1 pt-6 pb-2">
            {/* Horizontal Gridlines */}
            <div className="absolute inset-x-0 top-1/4 border-t border-gray-200/60 border-dashed"></div>
            <div className="absolute inset-x-0 top-1/2 border-t border-gray-200/60 border-dashed"></div>
            <div className="absolute inset-x-0 top-3/4 border-t border-gray-200/60 border-dashed"></div>

            {/* Threshold line alert zone */}
            <div className="absolute inset-x-0 top-[35%] h-0.5 bg-rose-500/20 z-0">
              <span className="absolute right-2 -top-2 bg-rose-50 px-1 py-0.5 text-[8px] text-rose-600 font-bold rounded">AMBULATORY LIMIT Trigger threshold</span>
            </div>

            {/* Render Bars/Trends dynamically */}
            {trendData.map((point, index) => {
              const val = activeChartType === 'BP' ? point.systolic : point.bloodSugar;
              const ratio = (val - minValue) / (maxValue - minValue);
              const heightPercent = Math.min(Math.max(ratio * 100, 10), 100);

              // Sub-value for blood pressure (diastolic)
              const secRatio = ((point.diastolic) - minValue) / (maxValue - minValue);
              const secHeightPercent = Math.min(Math.max(secRatio * 100, 5), heightPercent - 10);

              return (
                <div key={index} className="flex-1 h-full flex flex-col items-center justify-end relative group">
                  
                  {/* Interactive Tooltop */}
                  <div className="absolute bottom-full mb-2 bg-slate-900 text-white rounded p-2 text-[10px] w-28 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg font-mono">
                    <p className="text-gray-400">{point.date}</p>
                    <p className="font-bold text-white mt-0.5">
                      {activeChartType === 'BP' ? `BP: ${point.systolic}/${point.diastolic}` : `Sugar: ${point.bloodSugar} mg/dL`}
                    </p>
                    {point.isAlert && <p className="text-rose-400 text-[8px] font-bold">⚠️ High Deviation Spike</p>}
                  </div>

                  {/* Vitals Column representation */}
                  <div className="w-full max-w-[12px] md:max-w-[18px] bg-slate-200 rounded-lg h-full flex items-end overflow-hidden justify-center relative">
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all ${
                        point.isAlert ? 'bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    ></div>
                    {activeChartType === 'BP' && (
                      <div 
                        style={{ height: `${secHeightPercent}%` }}
                        className="w-full absolute bottom-0 bg-blue-300/85"
                      ></div>
                    )}
                  </div>

                  {/* Subtitle labels */}
                  <span className="text-[9px] text-gray-400 font-mono mt-1 w-full truncate text-center scale-95 md:scale-100 hidden sm:block">
                    {index % Math.ceil(activeTrendRange / 5) === 0 ? point.date : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-start gap-4 mt-2 font-mono text-[10px] text-gray-500">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-indigo-600 rounded"></span>
              <span>{activeChartType === 'BP' ? 'Systolic Value' : 'Blood sugar'}</span>
            </div>
            {activeChartType === 'BP' && (
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-blue-300 rounded"></span>
                <span>Diastolic Value</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded"></span>
              <span>Clinical Anomalous Regression Target Spike</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: PRESCRIPTION INVENTORY LOGISTICS & DOCTOR ESCORTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Prescription Logistics Block */}
        <div id="medicine_logistics" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-indigo-600" />
                Managed Medicine Inventory (5-Day Alert)
              </h3>
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                Strip Count Engine
              </span>
            </div>

            <div className="space-y-4">
              {medicineInventory.map((item) => {
                const depletionDays = Math.floor(item.stripCount / item.dailyCountUsed);
                const isDepletedWarning = depletionDays <= item.alertThresholdDays;

                return (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-950">{item.name}</h4>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">{item.dosage} • Usage: {item.dailyCountUsed} Pill(s)/Day</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          isDepletedWarning ? 'bg-red-550 text-white animate-pulse' : 'bg-emerald-50 text-emerald-800'
                        }`}>
                          {isDepletedWarning ? `${depletionDays} Days Left` : `${item.stripCount} Pills Left`}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${Math.min((item.stripCount / 30) * 100, 100)}%` }}
                        className={`h-full ${isDepletedWarning ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-gray-400 font-mono">Last restocked: {item.lastRestockedDate}</span>
                      
                      {activeMedIdForBill === item.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            placeholder="Amt (INR)" 
                            value={reimburseAmount}
                            onChange={(e) => setReimburseAmount(e.target.value)}
                            className="bg-white border border-gray-300 text-xs px-2 py-1 rounded w-20 text-right focus:outline-none focus:ring-1 focus:ring-indigo-550 font-mono"
                          />
                          <button 
                            onClick={() => submitReimbursement(item.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded p-1 text-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setActiveMedIdForBill(item.id)}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                        >
                          + Upload Reimbursement Loop Receipt
                        </button>
                      )}
                    </div>

                    {/* Pending bills display */}
                    {item.reimbursementBills.length > 0 && (
                      <div className="border-t border-slate-200/50 pt-2 space-y-1.5">
                        <span className="text-[9px] font-mono text-gray-400 block font-bold">REIMBURSEMENT TICKETS</span>
                        {item.reimbursementBills.map((bill) => (
                          <div key={bill.id} className="flex justify-between text-[10px] font-mono p-1 bg-white rounded border border-gray-100">
                            <span className="text-gray-500">Bill Ref #{bill.id.substring(0,6)} ({bill.date})</span>
                            <span className="font-bold text-gray-950">₹{bill.amount}</span>
                            <span className={`px-1.5 rounded font-bold ${
                              bill.status === 'APPROVED' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                            }`}>{bill.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 mt-4">
            <span>Automatic refill orders dispatched 5 days before stripe depletion.</span>
          </div>
        </div>

        {/* Doctor Cabin Escorts Block */}
        <div id="doctor_escorts" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                Doctor Accompaniment Tele-cabin
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase">
                WebRTC Cabin Patch
              </span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Launch dynamic visual cabin monitoring connecting directly with the doctor's table in Indore during scheduled audits.
            </p>

            <div className="space-y-4">
              {escortVisits.map((visit) => (
                <div key={visit.id} className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-gray-950">Dr. {visit.doctorName} ({visit.specialty})</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{visit.hospitalName} • Scheduled: {visit.scheduledTime}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-mono text-[10px] font-semibold">
                      {visit.status}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <span className="text-[10px] text-gray-500 font-mono">
                      Feed protocol: WebRTC 128-bit Audio Patch • Status: <span className="font-bold text-indigo-700 animate-pulse">{visit.webRTCStatus}</span>
                    </span>

                    <button
                      onClick={() => onToggleAudio(visit.id)}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        visit.cabinAudioEnabled 
                          ? 'bg-rose-600 text-white hover:bg-rose-700' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {visit.cabinAudioEnabled ? (
                        <>
                          <PhoneCall className="w-3.5 h-3.5 text-rose-200 animate-ping" />
                          Disconnect Live Stream
                        </>
                      ) : (
                        <>
                          <Video className="w-3.5 h-3.5 text-indigo-200" />
                          Launch Live Audio Cabin Feed
                        </>
                      )}
                    </button>
                  </div>

                  {visit.cabinAudioEnabled && (
                    <div className="bg-slate-900 text-white p-3 rounded-lg flex items-center justify-between text-xs font-mono border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        <span className="text-[11px]">OM PRAKASH CABIN STREAM LIVE</span>
                      </div>
                      <span className="text-[10px] text-emerald-400">01:54 CONNECTED</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] mt-4 text-gray-500">
            <span>Saves long journeys while ensuring you are bedside virtually.</span>
          </div>
        </div>

      </div>

      {/* SECTION 4: MARKETPLACE PLATFORM BOOKING */}
      <div id="marketplace_store" className="bg-[#121824] text-gray-200 p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 block font-bold">EXCLUSIVE PARTNER NETWORK</span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
              <Store className="w-5 h-5 text-indigo-400" />
              On-Call Concierge Marketplace
            </h3>
            <p className="text-xs text-indigo-200">Book trusted field professionals directly. Showing automated split margins and clear pricing structures.</p>
          </div>
          
          <span className="text-[10px] text-zinc-400 font-mono">Commission-Split Tracker v1</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketplaceServices.map((service) => {
            const margin = service.retailPrice - service.baseCost;
            return (
              <div key={service.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold bg-indigo-950/80 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded uppercase">
                      {service.category}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">{service.duration}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2.5">{service.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">{service.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-zinc-500 font-mono">Retail Price</span>
                    <span className="text-lg font-mono font-bold text-emerald-400">₹{service.retailPrice}</span>
                  </div>

                  {/* Pricing Commission Disclosure Panel for Child */}
                  <div className="p-2 bg-slate-950 rounded text-[10px] text-zinc-400 font-mono space-y-1 border border-zinc-800">
                    <div className="flex justify-between">
                      <span>Vendor Allocation Cost:</span>
                      <span>₹{service.baseCost}</span>
                    </div>
                    <div className="flex justify-between font-bold text-indigo-400">
                      <span>Assurance Logistics Fee:</span>
                      <span>₹{margin}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedService(service);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Select & Schedule Appointment
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Booking Modal / Tray Form */}
        {selectedService && (
          <div className="mt-6 p-4 bg-slate-900 border border-indigo-500/30 rounded-xl space-y-4 animate-slide-up">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">SCHEDULE COMPASS BOOKING</h4>
                <p className="text-sm font-bold text-white mt-1">{selectedService.title}</p>
              </div>
              <button 
                onClick={() => setSelectedService(null)}
                className="text-zinc-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                [ Cancel ]
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Target Date / Preferred Time</label>
                <input 
                  type="datetime-local" 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="shrink-0 flex items-end">
                <button
                  onClick={() => {
                    onBookService(selectedService, bookingDate);
                    setSelectedService(null);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-6 py-2 rounded h-10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Confirm & Pay Retail Price ₹{selectedService.retailPrice}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Active Bookings Timeline */}
        {activeBookings.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-850">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-4">ACTIVE DISPATCH BOOKINGS</h4>
            <div className="space-y-3">
              {activeBookings.map((bk) => (
                <div key={bk.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-500">Ref Code: BK-{bk.id.substring(0, 6).toUpperCase()}</span>
                    <h5 className="font-bold text-white text-sm mt-0.5">{bk.title}</h5>
                    <p className="text-zinc-400 text-[11px] mt-1">Date: {new Date(bk.scheduledAt).toLocaleString()} • Payout Split: Retail ₹{bk.retailPrice} (Base: ₹{bk.baseCost} / Logistics Split Margin: ₹{bk.commission})</p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-400 border border-indigo-900 uppercase">
                    {bk.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
