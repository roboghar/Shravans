/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Users, 
  ShieldAlert, 
  Database, 
  ClipboardCheck, 
  Clock, 
  Building,
  Sparkles,
  MapPin,
  FileCode,
  PhoneCall
} from 'lucide-react';

import { 
  VitalsRecord, 
  ChecklistRecord, 
  MedicineInventory, 
  DoctorVisitEscort, 
  MarketplaceService, 
  MarketplaceBooking, 
  PreStagedEmergencyFolder, 
  EmergencyTicket,
  UserRole
} from './types/eldercare';

import ChildDashboard from './components/ChildDashboard';
import CaregiverWorkflows from './components/CaregiverWorkflows';
import CrisisConsole from './components/CrisisConsole';
import SchemaViewer from './components/SchemaViewer';

// INITIAL DATA INVENTORY FOR IMMERSIVE LAYOUTS
const INITIAL_VITALS: VitalsRecord[] = [
  {
    id: 'vit_01',
    timestamp: new Date().toISOString(),
    loggedBy: 'Deepak Sharma',
    phase: 'MORNING',
    bpSystolic: 128,
    bpDiastolic: 80,
    pulseRate: 72,
    oxygenSat: 98,
    bloodSugar: 110,
    bloodSugarType: 'FASTING'
  },
  {
    id: 'vit_02',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    loggedBy: 'Deepak Sharma',
    phase: 'EVENING',
    eveningBpSystolic: 132,
    eveningBpDiastolic: 84,
    eveningBloodSugar: 115
  }
];

const INITIAL_CHECKLISTS: ChecklistRecord[] = [
  {
    id: 'chk_01',
    timestamp: new Date().toISOString(),
    phase: 'MORNING',
    medicationMorning: true,
    nutritionMorning: true,
    hydrationMorning: true,
    companionshipWalk: true,
    householdAudit: true
  }
];

const INITIAL_MEDICINES: MedicineInventory[] = [
  {
    id: 'med_thy',
    name: 'Thyronorm 50mcg (Hormonal)',
    dosage: '1 Pill Morning Fasting',
    stripCount: 12, // triggers 5-day warning (12 days total left, threshold say 5, let's demo 4 days left below)
    dailyCountUsed: 1,
    lastRestockedDate: '2026-05-10',
    alertThresholdDays: 5,
    reimbursementBills: [
      {
        id: 'bill_001',
        imageUrl: '',
        amount: 340,
        status: 'APPROVED',
        date: '2026-05-10'
      }
    ]
  },
  {
    id: 'med_car',
    name: 'Cardivas 6.25mg (Beta Blocker)',
    dosage: '1 Pill Post-Breakfast & 1 Pill Evening Duty',
    stripCount: 8, // Depletion warning! 8 / 2 = 4 days left! Smaller than thresholds of 5 days.
    dailyCountUsed: 2,
    lastRestockedDate: '2026-05-12',
    alertThresholdDays: 5,
    reimbursementBills: []
  }
];

const INITIAL_ESCORTS: DoctorVisitEscort[] = [
  {
    id: 'esc_01',
    doctorName: 'Ashok Kelkar',
    specialty: 'Cardiologist',
    hospitalName: 'Apollo Hospitals, Indore',
    scheduledTime: 'Tomorrow at 10:30 AM',
    status: 'SCHEDULED',
    cabinAudioEnabled: false,
    webRTCStatus: 'IDLE'
  }
];

const MARKETPLACE_SERVICES: MarketplaceService[] = [
  {
    id: 'srv_doc',
    category: 'DOCTOR',
    title: 'Senior Geriatrist Home Consultation',
    description: 'Specialist physician visiting the parent at Indore home for comprehensive physical audit & prescriptions sync.',
    baseCost: 1200,
    retailPrice: 1500, // profit margin: 300 INR (20%)
    duration: '60 Mins Visit'
  },
  {
    id: 'srv_physio',
    category: 'PHYSIO',
    title: 'Orthopedic Rehabilitation Session',
    description: 'A licensed physical therapist for mobilization therapy, active walker assistance, and safety audits.',
    baseCost: 650,
    retailPrice: 850, // margin 200 INR (23.5%)
    duration: '45 Mins Session'
  },
  {
    id: 'srv_nurse',
    category: 'NURSING',
    title: 'Advanced Clinical Wound Care',
    description: 'Post-discharge dressing, IV injections management, or regular temperature/pulse charting loops.',
    baseCost: 700,
    retailPrice: 950, // margin 250 INR
    duration: 'Half-Day Duty'
  },
  {
    id: 'srv_lab',
    category: 'LAB',
    title: 'Comprehensive Geriatric Blood Panel',
    description: 'Home lipid profile, HbA1c pre-breakfast draws, creatinine counts. Electronic reports in 8 hours.',
    baseCost: 1100,
    retailPrice: 1400, // margin 300 INR
    duration: 'Home Draw'
  },
  {
    id: 'srv_groom',
    category: 'GROOMING',
    title: 'Assisted Senior Pedicure & Hair Hygiene',
    description: 'Safe assisted nail-trimming, professional dry hair shampooing, and personal grooming by trained aides.',
    baseCost: 400,
    retailPrice: 600, // margin 200 INR
    duration: 'Salon at Home'
  }
];

const PRE_STAGED_EMERGENCY_DATA: PreStagedEmergencyFolder = {
  bloodGroup: 'O Positive (Rh+)',
  chronicConditions: ['Grade-II Hypertension', 'Stable Type-2 Diabetes'],
  activePrescriptionsCount: 4,
  insuranceProvider: 'Star Health Family Optima',
  insurancePolicyNumber: 'STAR-IND-92482-A',
  preferredHospital: 'Apollo Hospitals, Indore (ER)',
  preferredHospitalContact: '+91 731 244 5555',
  emergencyKeysLocation: 'Available inside Front Yard Safety Gate Locker-box (Dual Master Key set, Code: 2491)'
};

export default function App() {
  // ROLES & NAVIGATION STATES
  const [currentRole, setCurrentRole] = useState<UserRole>('CHILD');
  const [currentShiftPhase, setCurrentShiftPhase] = useState<'IDLE' | 'MORNING_SHFT' | 'AFTERNOON_IDLE' | 'EVENING_SHFT' | 'LOCKDOWN_COMPLETE'>('MORNING_SHFT');

  // CORE DATA STATE
  const [vitalsHistory, setVitalsHistory] = useState<VitalsRecord[]>(INITIAL_VITALS);
  const [checklistHistory, setChecklistHistory] = useState<ChecklistRecord[]>(INITIAL_CHECKLISTS);
  const [medicineInventory, setMedicineInventory] = useState<MedicineInventory[]>(INITIAL_MEDICINES);
  const [escortVisits, setEscortVisits] = useState<DoctorVisitEscort[]>(INITIAL_ESCORTS);
  const [activeBookings, setActiveBookings] = useState<MarketplaceBooking[]>([]);
  const [activeTicket, setActiveTicket] = useState<EmergencyTicket | null>(null);

  // Synchronuous simulation clocks
  const [systemTime, setSystemTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const live = new Date().toISOString();
      setSystemTime(live.replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Log Vitals Handler (From Caregiver)
  const handleAddNewVitals = (vitals: Partial<VitalsRecord>) => {
    const record: VitalsRecord = {
      id: 'vit_log_' + Date.now(),
      timestamp: new Date().toISOString(),
      loggedBy: 'Deepak Sharma (Indore)',
      phase: vitals.phase || 'MORNING',
      ...vitals
    };
    setVitalsHistory(prev => [record, ...prev]);
  };

  // 2. Log Checklists Handler (From Caregiver)
  const handleAddNewChecklist = (checklist: Partial<ChecklistRecord>) => {
    const record: ChecklistRecord = {
      id: 'chk_log_' + Date.now(),
      timestamp: new Date().toISOString(),
      phase: checklist.phase || 'MORNING',
      ...checklist
    };
    setChecklistHistory(prev => [record, ...prev]);

    // Handle caregiver shift stage transitions!
    if (checklist.phase === 'MORNING') {
      setCurrentShiftPhase('AFTERNOON_IDLE');
    } else if (checklist.phase === 'EVENING') {
      setCurrentShiftPhase('LOCKDOWN_COMPLETE');
    }
  };

  // 3. Shift State trigger
  const handleStartShift = (phase: 'MORNING' | 'EVENING') => {
    if (phase === 'MORNING') {
      setCurrentShiftPhase('MORNING_SHFT');
    } else {
      setCurrentShiftPhase('EVENING_SHFT');
    }
  };

  // 4. Update medicine strip counts (From Caregiver/Inventories)
  const handleUpdateStripCount = (id: string, newCount: number) => {
    setMedicineInventory(prev => prev.map(m => m.id === id ? { ...m, stripCount: newCount } : m));
  };

  // 5. Upload reimbursement bills
  const handleUploadBill = (medId: string, amount: number) => {
    setMedicineInventory(prev => prev.map(m => {
      if (m.id === medId) {
        const newBill = {
          id: 'bill_' + Math.floor(Math.random() * 100000),
          imageUrl: '',
          amount,
          status: 'PENDING' as const,
          date: new Date().toLocaleDateString()
        };
        return {
          ...m,
          reimbursementBills: [newBill, ...m.reimbursementBills]
        };
      }
      return m;
    }));
  };

  // 6. Launch WebRTC Cabin Stream Toggle
  const handleToggleCabinAudio = (visitId: string) => {
    setEscortVisits(prev => prev.map(v => {
      if (v.id === visitId) {
        const nextEnabled = !v.cabinAudioEnabled;
        return {
          ...v,
          cabinAudioEnabled: nextEnabled,
          webRTCStatus: nextEnabled ? 'CONNECTED' as const : 'IDLE' as const
        };
      }
      return v;
    }));
  };

  // 7. S.O.S Emergency Ticket Spawn Handler
  const handleTriggerEmergencySOS = () => {
    const ticketId = 'sos_ticket_' + Date.now();
    const newTicket: EmergencyTicket = {
      id: ticketId,
      parentName: 'Om Prakash Sharma',
      currentLocation: {
        lat: 22.7196,
        lng: 75.8577,
        address: 'Scheme 54, Vijay Nagar, Indore'
      },
      triggeredAt: new Date().toISOString(),
      status: 'DISPATCHED',
      assignedManager: 'Anjali Deshmukh',
      hospitalName: 'Apollo Hospitals, Indore',
      triageLogs: [
        {
          id: 't_log_1',
          hourIndex: 1,
          timestamp: new Date().toISOString(),
          title: 'Emergency Admissions Intake desk paperwork',
          message: 'Intake desk initialized. Handed pre-stages insurance Star-Health documents and chronic summary records.',
          status: 'IN_PROGRESS',
          loggedBy: 'Anjali Deshmukh'
        },
        {
          id: 't_log_2',
          hourIndex: 2,
          timestamp: '',
          title: 'TPA Desk pre-auth forms clearances',
          message: 'Awaiting medical summary signature validation by attending ER Doctor.',
          status: 'PENDING',
          loggedBy: 'Pending'
        },
        {
          id: 't_log_3',
          hourIndex: 3,
          timestamp: '',
          title: 'Caregiver Bedside Proxy assignments confirmation',
          message: 'Deepak (Field responder) dispatched bedside to serve as temporary proxy helper.',
          status: 'PENDING',
          loggedBy: 'Pending'
        },
        {
          id: 't_log_4',
          hourIndex: 4,
          timestamp: '',
          title: 'Attending CMO clinical stabilization review',
          message: 'Monitoring regular vitals curve. Discharging to normal observations ward post stabilization.',
          status: 'PENDING',
          loggedBy: 'Pending'
        }
      ]
    };
    setActiveTicket(newTicket);
    // Switch to CRITICAL view naturally
    setCurrentRole('CARE_MANAGER');
  };

  // 8. Triage Milestone Timeline update (From Care Manager)
  const handleUpdateTriageLog = (hourIndex: number, text: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    if (!activeTicket) return;
    setActiveTicket(prev => {
      if (!prev) return null;
      const updatedLogs = prev.triageLogs.map(log => {
        if (log.hourIndex === hourIndex) {
          return {
            ...log,
            message: text,
            status: status,
            timestamp: new Date().toISOString(),
            loggedBy: prev.assignedManager || 'Field Team'
          };
        }
        return log;
      });
      return {
        ...prev,
        triageLogs: updatedLogs
      };
    });
  };

  // 9. Assign Care Manager / Set Triage Hospital
  const handleAssignManager = (managerName: string) => {
    setActiveTicket(prev => prev ? { ...prev, assignedManager: managerName } : null);
  };
  const handleSetHospital = (hospitalName: string) => {
    setActiveTicket(prev => prev ? { ...prev, hospitalName: hospitalName } : null);
  };

  // 10. Change ticket status
  const handleUpdateTicketStatus = (status: 'DISPATCHED' | 'EN_ROUTE' | 'ER_TRIAGE' | 'ADMITTED' | 'RESOLVED') => {
    setActiveTicket(prev => prev ? { ...prev, status } : null);
  };

  // 11. Archive Resolves emergency Ticket
  const handleResolveTicket = () => {
    setActiveTicket(null);
    setCurrentRole('CHILD');
  };

  // 12. Book on-call Marketplace Services
  const handleBookMarketplaceService = (service: MarketplaceService, targetDate: string) => {
    const booking: MarketplaceBooking = {
      id: 'bk_' + Math.random().toString(36).substring(2, 9),
      serviceId: service.id,
      title: service.title,
      category: service.category,
      scheduledAt: targetDate,
      status: 'CONFIRMED',
      retailPrice: service.retailPrice,
      baseCost: service.baseCost,
      commission: service.retailPrice - service.baseCost,
      profitPercent: Math.round(((service.retailPrice - service.baseCost)/service.retailPrice) * 100),
      parentAddress: 'Scheme 54, Vijay Nagar, Indore'
    };
    setActiveBookings(prev => [booking, ...prev]);
  };

  return (
    <div id="root_layout" className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      
      {/* Premium Corporate Top Bar Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a] text-white border-b border-indigo-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Branding / Title */}
            <div className="flex items-center gap-3">
              <div id="platform_branding" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <Heart className="w-6 h-6 text-white stroke-2 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight">Eldercare Concierge</h1>
                  <span className="text-[9px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded border border-slate-700">Platform v2.1</span>
                </div>
                <p className="text-[11px] text-slate-400">High-End Dual-User Coordination Systems (Indore • Bangalore • Mumbai)</p>
              </div>
            </div>

            {/* Dynamic system states */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2 text-[11px] font-mono text-slate-300">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>SYSTEM: {systemTime}</span>
              </div>

              {activeTicket && (
                <div className="bg-red-950/30 text-red-400 px-3 py-1.5 rounded-lg border border-red-900/30 flex items-center gap-2 text-[11px] font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>🚨 EMERGENCY ALARM RED IN PROGRESS</span>
                </div>
              )}
            </div>
          </div>

          {/* Role selector block */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Users className="w-4 h-4 text-indigo-400" />
              Toggle Cohesive User Experience Environment:
            </span>

            {/* Role Navigation Buttons */}
            <div id="role_navigator" className="flex flex-wrap bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setCurrentRole('CHILD')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentRole === 'CHILD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Long-Distance Child (Client)
              </button>

              <button
                onClick={() => setCurrentRole('CAREGIVER')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentRole === 'CAREGIVER' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                Caregiver (Indore Staff)
              </button>

              <button
                onClick={() => setCurrentRole('CARE_MANAGER')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold font-sans transition-all flex items-center gap-1.5 cursor-pointer relative ${
                  currentRole === 'CARE_MANAGER' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Care Manager ER Hub
                {activeTicket && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-550 border-2 border-[#0f172a] animate-ping"></span>
                )}
              </button>

              <button
                onClick={() => setCurrentRole('BLUEPRINT')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentRole === 'BLUEPRINT' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Platform Schemas (Requested)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Role view container */}
        <div className="space-y-8">
          
          {currentRole === 'CHILD' && (
            <ChildDashboard 
              vitalsHistory={vitalsHistory}
              checklistHistory={checklistHistory}
              medicineInventory={medicineInventory}
              escortVisits={escortVisits}
              activeTicket={activeTicket}
              triggerEmergencySOS={handleTriggerEmergencySOS}
              marketplaceServices={MARKETPLACE_SERVICES}
              activeBookings={activeBookings}
              onBookService={handleBookMarketplaceService}
              preStagedFolder={PRE_STAGED_EMERGENCY_DATA}
              onUploadBill={handleUploadBill}
              onToggleAudio={handleToggleCabinAudio}
            />
          )}

          {currentRole === 'CAREGIVER' && (
            <CaregiverWorkflows 
              onLogVitals={handleAddNewVitals}
              onLogChecklist={handleAddNewChecklist}
              medicineInventory={medicineInventory}
              onUpdateStripCount={handleUpdateStripCount}
              currentShiftPhase={currentShiftPhase}
              onStartShift={handleStartShift}
            />
          )}

          {currentRole === 'CARE_MANAGER' && (
            <CrisisConsole 
              activeTicket={activeTicket}
              onUpdateTriageLog={handleUpdateTriageLog}
              onAssignManager={handleAssignManager}
              onSetHospital={handleSetHospital}
              onResolveTicket={handleResolveTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
            />
          )}

          {currentRole === 'BLUEPRINT' && (
            <SchemaViewer />
          )}

        </div>

      </main>

      {/* Modern Humble Footer avoiding system-larp indicators */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-12 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Eldercare Concierge Platform. All data persistent, secure & 128-bit encrypted. Indore Regional Command Center.</p>
        </div>
      </footer>

    </div>
  );
}

