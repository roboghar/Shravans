/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  ClipboardCheck, 
  Activity, 
  ShieldAlert, 
  Eye, 
  ChevronRight, 
  Navigation,
  Pill,
  Camera,
  Moon,
  Sun,
  Lock,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { VitalsRecord, ChecklistRecord, MedicineInventory } from '../types/eldercare';

interface CaregiverWorkflowsProps {
  onLogVitals: (vitals: Partial<VitalsRecord>) => void;
  onLogChecklist: (checklist: Partial<ChecklistRecord>) => void;
  medicineInventory: MedicineInventory[];
  onUpdateStripCount: (id: string, newCount: number) => void;
  currentShiftPhase: 'IDLE' | 'MORNING_SHFT' | 'AFTERNOON_IDLE' | 'EVENING_SHFT' | 'LOCKDOWN_COMPLETE';
  onStartShift: (phase: 'MORNING' | 'EVENING') => void;
}

export default function CaregiverWorkflows({
  onLogVitals,
  onLogChecklist,
  medicineInventory,
  onUpdateStripCount,
  currentShiftPhase,
  onStartShift
}: CaregiverWorkflowsProps) {
  
  // Tab selectors
  const [activeShiftTab, setActiveShiftTab] = useState<'morning' | 'evening' | 'inventory'>('morning');

  // Input States for Morning Vitals DDL Form
  const [bpSystolic, setBpSystolic] = useState('128');
  const [bpDiastolic, setBpDiastolic] = useState('80');
  const [pulseRate, setPulseRate] = useState('72');
  const [oxygenSat, setOxygenSat] = useState('98');
  const [bloodSugar, setBloodSugar] = useState('110');
  const [sugarType, setSugarType] = useState<'FASTING' | 'POST_BREAKFAST' | 'PRE_DINNER' | 'RANDOM'>('FASTING');

  // Checklist items for Morning
  const [medsMorning, setMedsMorning] = useState(true);
  const [nutritionMorning, setNutritionMorning] = useState(true);
  const [hydrationMorning, setHydrationMorning] = useState(true);
  const [companionshipWalk, setCompanionshipWalk] = useState(true);
  const [householdAudit, setHouseholdAudit] = useState(false);

  // Checklist items for Evening & Night lockdown
  const [medsEvening, setMedsEvening] = useState(true);
  const [nutritionEvening, setNutritionEvening] = useState(true);
  
  // Mandatory Lockdown Sweep Switches
  const [gasRegulatorOff, setGasRegulatorOff] = useState(false);
  const [geysersOff, setGeysersOff] = useState(false);
  const [tripHazardsCleared, setTripHazardsCleared] = useState(false);
  const [nightLightsSet, setNightLightsSet] = useState(false);
  const [grillesDoorsLocked, setGrillesDoorsLocked] = useState(false);
  const [sundowningNotes, setSundowningNotes] = useState('');

  // Evening vitals
  const [eveBpSystolic, setEveBpSystolic] = useState('130');
  const [eveBpDiastolic, setEveBpDiastolic] = useState('82');
  const [eveBloodSugar, setEveBloodSugar] = useState('115');

  // Photo simulation state
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Success Feedbacks
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Handle Morning Vitals Save
  const handleSaveMorningVitals = () => {
    onLogVitals({
      phase: 'MORNING',
      bpSystolic: parseInt(bpSystolic),
      bpDiastolic: parseInt(bpDiastolic),
      pulseRate: parseInt(pulseRate),
      oxygenSat: parseInt(oxygenSat),
      bloodSugar: parseFloat(bloodSugar),
      bloodSugarType: sugarType,
    });

    onLogChecklist({
      phase: 'MORNING',
      medicationMorning: medsMorning,
      nutritionMorning: nutritionMorning,
      hydrationMorning: hydrationMorning,
      companionshipWalk: companionshipWalk,
      householdAudit: householdAudit,
    });

    setFeedbackMsg("☀️ Morning shift vitals logs and medication checklist verified. Sent alerts to Child Client successfully!");
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  // Handle Evening Sunset Lockdown Sweeps Save
  const handleSaveEveningLockdown = () => {
    // Vitals
    onLogVitals({
      phase: 'EVENING',
      eveningBpSystolic: parseInt(eveBpSystolic),
      eveningBpDiastolic: parseInt(eveBpDiastolic),
      eveningBloodSugar: parseFloat(eveBloodSugar),
    });

    // Checklist & environmental sweep
    onLogChecklist({
      id: Math.random().toString(),
      timestamp: new Date().toISOString(),
      phase: 'EVENING',
      medicationEvening: medsEvening,
      nutritionEvening: nutritionEvening,
      gasRegulatorOff,
      geysersOff,
      tripHazardsCleared,
      nightLightsSet,
      grillesDoorsLocked,
      sundowningReassurance: sundowningNotes,
    });

    setFeedbackMsg("🌙 Evening Sunset Safety checklist, nocturnal vitals, and Night environmental sweep committed. Sync Completed!");
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const simulatePhotoUpload = () => {
    setUploadProgress(true);
    setTimeout(() => {
      setPhotoUploaded(true);
      setUploadProgress(false);
    }, 1500);
  };

  // Check if lockdown block is compliant
  const isLockdownCompliant = gasRegulatorOff && geysersOff && tripHazardsCleared && nightLightsSet && grillesDoorsLocked;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Caregiver Welcome Banner */}
      <div className="bg-[#0f172a] text-white p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/10 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest font-bold">
              Indore Hub Field App
            </span>
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-[11px] text-slate-400 font-mono">Deepak Sharma (Zone A Responder)</span>
          </div>
          <h2 className="text-xl font-bold mt-1.5 flex items-center gap-2 text-white">
            <ClipboardCheck className="w-5 h-5 text-amber-400" />
            Checklists & Shift Controls
          </h2>
          <p className="text-xs text-slate-400 mt-1">Execute daily medical schedules and verify sunset environmental sweeps at parent's home in Indore.</p>
        </div>

        {/* Dynamic Shift State Action */}
        <div className="flex flex-col items-end gap-1.5 min-w-[200px] text-right">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Current Shift Phase</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${
              currentShiftPhase === 'MORNING_SHFT' ? 'bg-amber-400 animate-pulse' :
              currentShiftPhase === 'EVENING_SHFT' ? 'bg-indigo-400 animate-pulse' :
              currentShiftPhase === 'LOCKDOWN_COMPLETE' ? 'bg-emerald-500' : 'bg-gray-500'
            }`}></span>
            <span className="text-sm font-semibold font-mono text-white tracking-tight">
              {currentShiftPhase}
            </span>
          </div>

          {currentShiftPhase === 'IDLE' && (
            <button 
              onClick={() => onStartShift('MORNING')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1 rounded text-xs mt-2 transition-all cursor-pointer"
            >
              Start Morning Block (2 Hrs)
            </button>
          )}
          {currentShiftPhase === 'AFTERNOON_IDLE' && (
            <button 
              onClick={() => onStartShift('EVENING')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1 rounded text-xs mt-2 transition-all cursor-pointer"
            >
              Start Evening Block (45 Min)
            </button>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-slide-up">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Shifts View Tabs */}
      <div className="flex border-b border-gray-200 text-xs">
        <button
          onClick={() => setActiveShiftTab('morning')}
          className={`flex-1 py-3 text-center font-bold relative transition-all cursor-pointer ${
            activeShiftTab === 'morning' ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50/10' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            Morning Wellness Block
          </div>
        </button>

        <button
          onClick={() => setActiveShiftTab('evening')}
          className={`flex-1 py-3 text-center font-bold relative transition-all cursor-pointer ${
            activeShiftTab === 'evening' ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/10' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            Evening Sunset Safety Loop
          </div>
        </button>

        <button
          onClick={() => setActiveShiftTab('inventory')}
          className={`flex-1 py-3 text-center font-bold relative transition-all cursor-pointer ${
            activeShiftTab === 'inventory' ? 'text-slate-800 border-b-2 border-slate-700 bg-slate-50/15' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Pill className="w-4 h-4 text-slate-500" />
            Pharmacy Inventory Audit
          </div>
        </button>
      </div>

      {currentShiftPhase === 'IDLE' && activeShiftTab !== 'inventory' ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center text-sm text-gray-500 space-y-3 font-sans">
          <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
          <p className="font-semibold text-gray-800">Your Shift Status is Active but Idle</p>
          <p className="text-xs max-w-md mx-auto">Please check-in or start your transition block using the control banner above to populate the interactive workflows.</p>
        </div>
      ) : (
        <>
          {/* TAB 1: MORNING WELLNESS BLOCK (2 Hrs) */}
          {activeShiftTab === 'morning' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Vitals Form Column */}
              <div id="morning_vitals_card" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-500" />
                    Clinical Vitals Logging Form
                  </h3>
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Input Fields</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 font-mono">BP Systolic (mmHg)</label>
                    <input 
                      type="number" 
                      value={bpSystolic} 
                      onChange={(e) => setBpSystolic(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-950 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 font-mono">BP Diastolic (mmHg)</label>
                    <input 
                      type="number" 
                      value={bpDiastolic} 
                      onChange={(e) => setBpDiastolic(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-950 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 font-mono">Pulse Rate (BPM)</label>
                    <input 
                      type="number" 
                      value={pulseRate} 
                      onChange={(e) => setPulseRate(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-950 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 font-mono">Oxygen Saturation (SpO2 %)</label>
                    <input 
                      type="number" 
                      value={oxygenSat} 
                      onChange={(e) => setOxygenSat(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-950 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 font-mono">Blood Sugar (mg/dL)</label>
                    <input 
                      type="number" 
                      value={bloodSugar} 
                      onChange={(e) => setBloodSugar(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-950 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 font-mono">Sugar Level Timing</label>
                    <select 
                      value={sugarType} 
                      onChange={(e: any) => setSugarType(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-950 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="FASTING">Fasting Sugar (Pre-meal)</option>
                      <option value="POST_BREAKFAST">Post-Breakfast (+2 Hrs)</option>
                      <option value="RANDOM">Random / Periodic</option>
                    </select>
                  </div>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex items-start gap-3 mt-4 text-[11px] font-sans text-amber-900">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Clinical Threshold Reference</span>
                    <p className="text-gray-700 mt-0.5 leading-relaxed">
                      Blood pressure over 140 systolic or blood sugar values over 145 mg/dL triggers a caution flags in the long-distance child's dashboard view.
                    </p>
                  </div>
                </div>
              </div>

              {/* Checklist Column */}
              <div id="medication_checklist_card" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">Workflow Items</h3>
                  <span className="text-[10px] text-gray-400 font-mono">Morning Shifts</span>
                </div>

                {/* Checklist toggles */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-950">Medication Verified</span>
                      <p className="text-[10px] text-gray-500">Thyronorm & Cardivas doses given.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={medsMorning} 
                      onChange={(e) => setMedsMorning(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 focus:outline-none rounded cursor-pointer" 
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-950">Nutrition & Breakfast</span>
                      <p className="text-[10px] text-gray-500">Poha & boiled eggs served.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={nutritionMorning} 
                      onChange={(e) => setNutritionMorning(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 focus:outline-none rounded cursor-pointer" 
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-950">Hydration Audit (1L)</span>
                      <p className="text-[10px] text-gray-500">Verified fresh filter water container.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={hydrationMorning} 
                      onChange={(e) => setHydrationMorning(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 focus:outline-none rounded cursor-pointer" 
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-950">Walk / Companion loop</span>
                      <p className="text-[10px] text-gray-500">20 minute walk in garden executed.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={companionshipWalk} 
                      onChange={(e) => setCompanionshipWalk(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 focus:outline-none rounded cursor-pointer" 
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-950">Household Stock Audit</span>
                      <p className="text-[10px] text-gray-500">Lactose free milk & groceries check.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={householdAudit} 
                      onChange={(e) => setHouseholdAudit(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 focus:outline-none rounded" 
                    />
                  </div>
                </div>

                {/* Dynamic Auto-compiled Share Preview Panel */}
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-amber-500" />
                      Smiling Photo Handshake
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-mono">Mandatory loop</span>
                  </div>

                  {photoUploaded ? (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3 text-xs text-emerald-800">
                      <span className="p-1 px-2.5 rounded bg-emerald-500 text-white font-mono text-[10px] font-bold">✓ AUTO COMPILED</span>
                      <span>Smiling media loop pre-attached.</span>
                    </div>
                  ) : (
                    <button 
                      onClick={simulatePhotoUpload}
                      disabled={uploadProgress}
                      className="w-full bg-slate-50 border border-gray-300 border-dashed rounded-xl py-4 hover:bg-slate-100 text-xs text-gray-500 font-medium transition-all flex flex-col items-center justify-center gap-1 pointer hover:text-black cursor-pointer"
                    >
                      {uploadProgress ? (
                        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent animate-spin rounded-full"></div>
                      ) : (
                        <>
                          <Camera className="w-6 h-6 text-gray-400" />
                          <span>Simulate Capture Smiling Parent Photo</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <button 
                  onClick={handleSaveMorningVitals}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  Commit Morning Block Log
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: EVENING SUNSET SAFETY LOOP (45 Min) WITH ENVIRONMENTAL NIGHT LOCKDOWN */}
          {activeShiftTab === 'evening' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Vitals Form Column */}
              <div id="evening_vitals_card" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 lg:col-span-1">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-indigo-500" />
                    Nocturnal Vitals Entry
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Evening Inputs</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 font-mono">Eve BP Systolic (mmHg)</label>
                    <input 
                      type="number" 
                      value={eveBpSystolic} 
                      onChange={(e) => setEveBpSystolic(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-950 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 font-mono">Eve BP Diastolic (mmHg)</label>
                    <input 
                      type="number" 
                      value={eveBpDiastolic} 
                      onChange={(e) => setEveBpDiastolic(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-950 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 font-mono">Pre-Dinner Blood Sugar (mg/dL)</label>
                    <input 
                      type="number" 
                      value={eveBloodSugar} 
                      onChange={(e) => setEveBloodSugar(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-950 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/50 rounded-xl text-[10px] text-indigo-900 space-y-2 border border-indigo-100">
                  <span className="font-bold uppercase tracking-wider block">SUNSET CLINICAL TIP:</span>
                  <p className="text-gray-700 leading-relaxed">
                    Nocturnal blood pressure drops are common in elders. Vitals checks before bedtime assist doctors in identifying hypertension regressions.
                  </p>
                </div>
              </div>

              {/* Lockdown Sweep & Checklist Column */}
              <div id="lockdown_checklist" className="bg-slate-900 text-gray-200 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-6 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-indigo-400" />
                        Night Lockdown Environmental Sweep
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-0.5">All 5 safety audits are absolute mandatory conditions prior to safety loop submission.</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                      isLockdownCompliant ? 'bg-emerald-500 text-black' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {isLockdownCompliant ? 'Compliant' : 'Awaiting Swipes'}
                    </span>
                  </div>

                  {/* Vitals items \& lockdown sweeps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between">
                      <div className="space-y-0.5 pr-2">
                        <span className="text-xs font-bold text-white block">Gas Regulator OFF</span>
                        <p className="text-[10px] text-zinc-500">Gas cylinder safety valve disabled.</p>
                      </div>
                      <button 
                        onClick={() => setGasRegulatorOff(!gasRegulatorOff)}
                        className={`w-10 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${
                          gasRegulatorOff ? 'bg-emerald-500' : 'bg-zinc-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          gasRegulatorOff ? 'translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between">
                      <div className="space-y-0.5 pr-2">
                        <span className="text-xs font-bold text-white block">Water Geyser OFF</span>
                        <p className="text-[10px] text-zinc-500">Bathroom geysers validated.</p>
                      </div>
                      <button 
                        onClick={() => setGeysersOff(!geysersOff)}
                        className={`w-10 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${
                          geysersOff ? 'bg-emerald-500' : 'bg-zinc-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          geysersOff ? 'translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between">
                      <div className="space-y-0.5 pr-2">
                        <span className="text-xs font-bold text-white block">Trip Hazards Cleared</span>
                        <p className="text-[10px] text-zinc-500">Carpets, wires, toys removed from aisles.</p>
                      </div>
                      <button 
                        onClick={() => setTripHazardsCleared(!tripHazardsCleared)}
                        className={`w-10 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${
                          tripHazardsCleared ? 'bg-emerald-500' : 'bg-zinc-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          tripHazardsCleared ? 'translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between">
                      <div className="space-y-0.5 pr-2">
                        <span className="text-xs font-bold text-white block">Night-lights Set ON</span>
                        <p className="text-[10px] text-zinc-500">Passage & toilet safety lights turned on.</p>
                      </div>
                      <button 
                        onClick={() => setNightLightsSet(!nightLightsSet)}
                        className={`w-10 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${
                          nightLightsSet ? 'bg-emerald-500' : 'bg-zinc-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          nightLightsSet ? 'translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between md:col-span-2">
                      <div className="space-y-0.5 pr-2">
                        <span className="text-xs font-bold text-white block font-mono">Grilles, Windows & Main Doors deadbolts LOCKED</span>
                        <p className="text-[10px] text-zinc-500">Verified front gates, balcony grilles and lock-box set.</p>
                      </div>
                      <button 
                        onClick={() => setGrillesDoorsLocked(!grillesDoorsLocked)}
                        className={`w-10 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${
                          grillesDoorsLocked ? 'bg-emerald-500' : 'bg-zinc-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          grillesDoorsLocked ? 'translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>

                  </div>

                  {/* Sundowning Notes Field */}
                  <div className="mt-5 space-y-1.5">
                    <label className="block text-xs font-bold text-zinc-400 uppercase font-mono flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      Sundowning Reassurance Logs & Notes:
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Input notes on behavioral observations, twilight anxieties, or companion routines..."
                      value={sundowningNotes}
                      onChange={(e) => setSundowningNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                    />
                  </div>
                </div>

                {/* Submit Block Button */}
                <div className="pt-6 border-t border-slate-800 mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <AlertTriangle className={`w-5 h-5 ${isLockdownCompliant ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`} />
                    <span className={isLockdownCompliant ? 'text-zinc-400 font-medium' : 'text-amber-400'}>
                      {isLockdownCompliant ? '🔒 Emergency Lockdown Compliant: Checks OK' : '⚠️ Lock down compliance check pending before save.'}
                    </span>
                  </div>

                  <button
                    disabled={!isLockdownCompliant}
                    onClick={handleSaveEveningLockdown}
                    className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition-all ${
                      isLockdownCompliant 
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white cursor-pointer shadow-md' 
                        : 'bg-zinc-850 text-zinc-500 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    Commit Sunset Safety Loop
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PHARMACY INVENTORY AUDIT */}
          {activeShiftTab === 'inventory' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Pill className="w-5 h-5 text-indigo-600" />
                    Strip Count and Pill Inventory Tracker
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Maintain count of remaining prescription strips to prevent unannounced stock depleting scenarios.</p>
                </div>
                
                <span className="text-[10px] font-mono bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded">5-Day Stock Buffer alerts.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medicineInventory.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">PRESCRIPTION STRIP</span>
                      <h4 className="text-xs font-bold text-gray-950 mt-1">{item.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 font-mono">{item.dosage} • {item.dailyCountUsed} pill/day</p>
                      
                      <div className="flex gap-2 mt-3 items-center">
                        <button 
                          onClick={() => onUpdateStripCount(item.id, Math.max(item.stripCount - 5, 0))}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg p-1 text-xs cursor-pointer font-bold font-mono px-2"
                        >
                          -5 Pills
                        </button>
                        <button 
                          onClick={() => onUpdateStripCount(item.id, item.stripCount + 10)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1 text-xs cursor-pointer font-bold font-mono px-2"
                        >
                          +10 Pills
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 block font-mono">CURRENT STOCK:</span>
                      <span className="text-3xl font-bold font-mono tracking-tight text-gray-950">{item.stripCount}</span>
                      <span className="text-xs text-gray-400 block">Pills remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
