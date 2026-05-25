/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'CHILD' | 'CAREGIVER' | 'CARE_MANAGER' | 'BLUEPRINT';

export interface VitalsRecord {
  id: string;
  timestamp: string;
  loggedBy: string;
  phase: 'MORNING' | 'EVENING';
  
  // Morning Metrics
  bpSystolic?: number;
  bpDiastolic?: number;
  pulseRate?: number;
  oxygenSat?: number;
  bloodSugar?: number; // Fasting / Post-Breakfast
  bloodSugarType?: 'FASTING' | 'POST_BREAKFAST' | 'PRE_DINNER' | 'RANDOM';

  // Evening Metrics
  eveningBpSystolic?: number;
  eveningBpDiastolic?: number;
  eveningBloodSugar?: number;
}

export interface ChecklistRecord {
  id: string;
  timestamp: string;
  phase: 'MORNING' | 'EVENING';
  
  // Morning Checklist
  medicationMorning?: boolean;
  nutritionMorning?: boolean;
  hydrationMorning?: boolean;
  companionshipWalk?: boolean;
  householdAudit?: boolean;

  // Evening Checklist & Lockdown
  medicationEvening?: boolean;
  nutritionEvening?: boolean;
  gasRegulatorOff?: boolean;
  geysersOff?: boolean;
  tripHazardsCleared?: boolean;
  nightLightsSet?: boolean;
  grillesDoorsLocked?: boolean;
  sundowningReassurance?: string;
}

export interface MediaUpload {
  id: string;
  timestamp: string;
  imageUrl: string;
  caption: string;
  caregiverName: string;
}

export interface EmergencyTicket {
  id: string;
  parentName: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  triggeredAt: string;
  status: 'DISPATCHED' | 'EN_ROUTE' | 'ER_TRIAGE' | 'ADMITTED' | 'RESOLVED';
  assignedManager?: string;
  hospitalName?: string;
  triageLogs: {
    id: string;
    hourIndex: number; // 1 to 4 hours
    timestamp: string;
    message: string;
    status: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS';
    title: string;
    loggedBy: string;
  }[];
}

export interface MedicineInventory {
  id: string;
  name: string;
  dosage: string;
  stripCount: number; // current pills left
  dailyCountUsed: number;
  lastRestockedDate: string;
  alertThresholdDays: number; // default is 5 days
  reimbursementBills: {
    id: string;
    imageUrl: string;
    amount: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    date: string;
  }[];
}

export interface DoctorVisitEscort {
  id: string;
  doctorName: string;
  specialty: string;
  hospitalName: string;
  scheduledTime: string;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  cabinAudioEnabled: boolean;
  webRTCStatus: 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';
}

export interface MarketplaceService {
  id: string;
  category: 'DOCTOR' | 'PHYSIO' | 'NURSING' | 'LAB' | 'GROOMING';
  title: string;
  description: string;
  baseCost: number; // In INR
  retailPrice: number; // In INR
  duration: string;
}

export interface MarketplaceBooking {
  id: string;
  serviceId: string;
  title: string;
  category: string;
  scheduledAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'ONGOING' | 'COMPLETED';
  retailPrice: number;
  baseCost: number;
  commission: number; // retailPrice - baseCost
  profitPercent: number;
  parentAddress: string;
}

export interface PreStagedEmergencyFolder {
  bloodGroup: string;
  chronicConditions: string[];
  activePrescriptionsCount: number;
  insurancePolicyNumber: string;
  insuranceProvider: string;
  preferredHospital: string;
  preferredHospitalContact: string;
  emergencyKeysLocation: string;
}
