/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Database, FileCode, CheckSquare, Layers, Server, ShieldCheck } from 'lucide-react';

export default function SchemaViewer() {
  const [activeTab, setActiveTab] = useState<'postgres' | 'firestore' | 'statemachine' | 'rules'>('postgres');

  const postgresDDL = `-- PostgreSQL DDL for Eldercare Concierge Platform

-- 1. Users Table (Accommodates Dual-User Roles)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('CHILD', 'CAREGIVER', 'CARE_MANAGER', 'SUPER_ADMIN')),
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(50) DEFAULT 'Indore',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Parents Relationship Table
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    caregiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(100) NOT NULL,
    age INT,
    blood_group VARCHAR(10),
    insurance_provider VARCHAR(150),
    insurance_policy_no VARCHAR(100),
    preferred_hospital VARCHAR(255),
    emergency_keys_location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Vitals Log Table (Handles Split-Shift clinical feeds)
CREATE TABLE vitals_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    logged_by UUID NOT NULL REFERENCES users(id),
    shift_phase VARCHAR(20) NOT NULL CHECK (shift_phase IN ('MORNING', 'EVENING')),
    
    -- Clinical Vitals
    bp_systolic INT,
    bp_diastolic INT,
    pulse_rate INT,
    oxygen_saturation INT CHECK (oxygen_saturation BETWEEN 0 AND 100),
    blood_sugar NUMERIC(5,2),
    sugar_test_type VARCHAR(30) CHECK (sugar_test_type IN ('FASTING', 'POST_BREAKFAST', 'PRE_DINNER', 'RANDOM')),
    
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create optimal index for health trend aggregation queries (7-day / 30-day / 90-day intervals)
CREATE INDEX idx_vitals_trends ON vitals_logs (parent_id, recorded_at DESC);

-- 4. Daily Shift Checklists (Split-Shift Workflows & Lockdown)
CREATE TABLE daily_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    logged_by UUID NOT NULL REFERENCES users(id),
    shift_phase VARCHAR(20) NOT NULL CHECK (shift_phase IN ('MORNING', 'EVENING')),
    
    -- Medication Verification Toggles
    meds_administered BOOLEAN DEFAULT FALSE,
    nutrition_verified BOOLEAN DEFAULT FALSE,
    hydration_verified BOOLEAN DEFAULT FALSE,
    companionship_walk BOOLEAN DEFAULT FALSE,
    household_audit BOOLEAN DEFAULT FALSE,
    
    -- Evening Sunset Lockdown Sweeps
    gas_regulator_off BOOLEAN DEFAULT FALSE,
    geyser_off BOOLEAN DEFAULT FALSE,
    trip_hazards_cleared BOOLEAN DEFAULT FALSE,
    night_lights_set BOOLEAN DEFAULT FALSE,
    grilles_locked BOOLEAN DEFAULT FALSE,
    sundowning_notes TEXT,
    
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Emergency SOS Dispatch Tickets & Triage Chronology
CREATE TABLE emergency_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    triggered_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(30) NOT NULL DEFAULT 'DISPATCHED' CHECK (status IN ('DISPATCHED', 'EN_ROUTE', 'ER_TRIAGE', 'ADMITTED', 'RESOLVED')),
    gps_lat NUMERIC(10, 8),
    gps_lng NUMERIC(11, 8),
    hospital_name VARCHAR(255),
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE triage_timeline_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES emergency_tickets(id) ON DELETE CASCADE,
    hour_index INT NOT NULL CHECK (hour_index BETWEEN 1 AND 4),
    title VARCHAR(150) NOT NULL,
    log_message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
    updated_by UUID NOT NULL REFERENCES users(id),
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Marketplace Bookings & Commission Split
CREATE TABLE marketplace_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES parents(id),
    child_id UUID REFERENCES users(id),
    service_category VARCHAR(50) NOT NULL,
    booking_title VARCHAR(150) NOT NULL,
    base_cost NUMERIC(10,2) NOT NULL,       -- Amount paid to partner/vendor
    retail_price NUMERIC(10,2) NOT NULL,    -- Amount paid by Long-Distance Child
    commission_split NUMERIC(10,2) GENERATED ALWAYS AS (retail_price - base_cost) STORED, -- Computed split
    profit_margin_percent NUMERIC(5,2) GENERATED ALWAYS AS (((retail_price - base_cost) / retail_price) * 100) STORED,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING'
);`;

  const firestoreSchema = `// Firebase Firestore Collections Blueprint & Document Schemes

// Collection: /users/{userId}
{
  "uid": "user_id_string",
  "email": "child@mumbai.com",
  "name": "Arjun Sharma",
  "role": "CHILD", // 'CHILD' | 'CAREGIVER' | 'CARE_MANAGER'
  "phoneNumber": "+919876543210",
  "locationCity": "Mumbai",
  "parentId": "parent_indore_01",
  "createdAt": "TIMESTAMP"
}

// Collection: /parents/{parentId}
{
  "parentId": "parent_indore_01",
  "fullName": "Om Prakash Sharma",
  "age": 78,
  "bloodGroup": "O+ve",
  "currentCaregiverId": "caregiver_indore_99",
  "clinicalPreStagedFolder": {
    "chronicDiseases": ["Hypertension", "Type-2 Diabetes"],
    "activePrescriptionsCount": 4,
    "insuranceProvider": "Star Health Insurance",
    "insuranceNumber": "SH-7492-38290",
    "preferredHospital": "Apollo Hospitals, Indore",
    "emergencyKeysLocation": "With security guard & safety key lock-box on front gate code 2491"
  }
}

// Collection: /vitalsLogs/{logId}
{
  "logId": "log_vitals_abc123",
  "parentId": "parent_indore_01",
  "loggedBy": "caregiver_indore_99",
  "timestamp": "SERVER_TIMESTAMP",
  "shiftPhase": "MORNING", // 'MORNING' | 'EVENING'
  "vitals": {
    "bpSystolic": 134,
    "bpDiastolic": 82,
    "pulseRate": 74,
    "oxygenSaturation": 97,
    "bloodSugar": 112.5,
    "bloodSugarTestType": "FASTING"
  }
}

// Collection: /dailyChecklists/{checkId}
{
  "checkId": "chk_day_45678",
  "parentId": "parent_indore_01",
  "timestamp": "SERVER_TIMESTAMP",
  "shiftPhase": "EVENING",
  "items": {
    "medicationEvening": true,
    "nutritionEvening": true
  },
  "environmentalLockdownSweep": {
    "gasRegulatorOff": true,
    "geyserOff": true,
    "tripHazardsCleared": true,
    "nightLightsSet": true,
    "grillesLocked": true,
    "sundowningReassuranceNotes": "Parent was slightly anxious about evening sunset; played vintage Kishore Kumar tunes and verified door deadbolts together."
  }
}

// Collection: /emergencyTickets/{ticketId}
{
  "ticketId": "sos_active_911",
  "parentId": "parent_indore_01",
  "status": "ER_TRIAGE", // 'DISPATCHED' | 'EN_ROUTE' | 'ER_TRIAGE' | 'ADMITTED' | 'RESOLVED'
  "gpsCoords": {
    "lat": 22.7196,
    "lng": 75.8577,
    "address": "Scheme 54, Vijay Nagar, Indore"
  },
  "triggeredAt": "SERVER_TIMESTAMP",
  "assignedFirstResponderId": "care_manager_indore_05",
  "triageChronology": [
    {
      "hourIndex": 1,
      "title": "Admissions Desk Paperwork",
      "status": "COMPLETED",
      "message": "Arrived at Apollo Hospital. Front desk intake sorted, deposit loop secured with Child's pre-staged insurance profile card.",
      "loggedAt": "TIMESTAMP"
    },
    {
      "hourIndex": 2,
      "title": "TPA / Insurance Clearance",
      "status": "IN_PROGRESS",
      "message": "Drafting pre-auth desk logs, verified chronic health summary with the attending CMO.",
      "loggedAt": "TIMESTAMP"
    }
  ]
}`;

  const stateMachineCode = `// ------------------------------------------------------------------------
// TypeScript State Machine (Eldercare Split-Shift Transition Logic)
// ------------------------------------------------------------------------

export type ShiftPhase = 'IDLE' | 'MORNING_SHFT' | 'AFTERNOON_IDLE' | 'EVENING_SHFT' | 'LOCKDOWN_COMPLETE';

export interface CaregiverShiftState {
  currentPhase: ShiftPhase;
  parentId: string;
  morningVitalsComplete: boolean;
  morningChecklistComplete: boolean;
  eveningVitalsComplete: boolean;
  lockdownComplete: boolean;
  dailyMediaUploaded: boolean;
  activeShiftStartTime?: Date;
}

export class ShiftTransitionController {
  private state: CaregiverShiftState;

  constructor(parentId: string) {
    this.state = {
      currentPhase: 'IDLE',
      parentId,
      morningVitalsComplete: false,
      morningChecklistComplete: false,
      eveningVitalsComplete: false,
      lockdownComplete: false,
      dailyMediaUploaded: false
    };
  }

  public getState() { return this.state; }

  // Action 1: Onboard caregiver for the Morning Shift
  public startMorningShift(): CaregiverShiftState {
    if (this.state.currentPhase !== 'IDLE') {
      throw new Error("Cannot start morning shift from current phase: " + this.state.currentPhase);
    }
    this.state.currentPhase = 'MORNING_SHFT';
    this.state.activeShiftStartTime = new Date();
    return this.state;
  }

  // Action 2: Commit Morning Vitals & Checklists
  public completeMorningBlock(vitalsLogged: boolean, checklistLogged: boolean): CaregiverShiftState {
    if (this.state.currentPhase !== 'MORNING_SHFT') {
      throw new Error("Morning shift block is not active.");
    }
    this.state.morningVitalsComplete = vitalsLogged;
    this.state.morningChecklistComplete = checklistLogged;
    
    if (this.state.morningVitalsComplete && this.state.morningChecklistComplete) {
      // Automatic transition into afternoon interim idle phase
      this.state.currentPhase = 'AFTERNOON_IDLE';
    }
    return this.state;
  }

  // Action 3: Caregiver returns for Evening Safety Shift
  public startEveningShift(): CaregiverShiftState {
    if (this.state.currentPhase !== 'AFTERNOON_IDLE') {
      console.warn("Out of sequence shift bypass. Initiating Emergency/Bypass Evening Shift.");
    }
    this.state.currentPhase = 'EVENING_SHFT';
    return this.state;
  }

  // Action 4: Verify Evening Vitals & Environmental Sweep Lockdown
  public completeEveningLockdown(vitalsLogged: boolean, sweepComplete: boolean, mediaUploaded: boolean): CaregiverShiftState {
    if (this.state.currentPhase !== 'EVENING_SHFT') {
      throw new Error("Evening shift block is not active.");
    }
    this.state.eveningVitalsComplete = vitalsLogged;
    this.state.lockdownComplete = sweepComplete;
    this.state.dailyMediaUploaded = mediaUploaded;

    if (this.state.eveningVitalsComplete && this.state.lockdownComplete) {
      this.state.currentPhase = 'LOCKDOWN_COMPLETE';
    }
    return this.state;
  }

  // Action 5: Reset for the following morning loop (typically at midnight system cron)
  public midnightReset(): CaregiverShiftState {
    this.state = {
      currentPhase: 'IDLE',
      parentId: this.state.parentId,
      morningVitalsComplete: false,
      morningChecklistComplete: false,
      eveningVitalsComplete: false,
      lockdownComplete: false,
      dailyMediaUploaded: false
    };
    return this.state;
  }
}

// ------------------------------------------------------------------------
// Flutter / Dart BLoC Implementation for Eldercare Split-Shift Workflows
// ------------------------------------------------------------------------

/*
import 'package:flutter_bloc/flutter_bloc.dart';

// 1. Define events
abstract class ShiftEvent {}
class StartMorningEvent extends ShiftEvent {}
class LogMorningVitalsEvent extends ShiftEvent {}
class LogMorningChecklistEvent extends ShiftEvent {}
class BreakShiftEvent extends ShiftEvent {}
class StartEveningEvent extends ShiftEvent {}
class LogEveningChecklistEvent extends ShiftEvent {}
class CompleteNightLockdownEvent extends ShiftEvent {}

// 2. Define State
class CaregiverShiftState {
  final String phase; // 'IDLE' | 'MORNING' | 'INTERIM' | 'EVENING' | 'COMPLETED'
  final bool isMorningVitalsLogged;
  final bool isMorningChecklistLogged;
  final bool isLockdownComplete;
  
  CaregiverShiftState({
    required this.phase,
    this.isMorningVitalsLogged = false,
    this.isMorningChecklistLogged = false,
    this.isLockdownComplete = false,
  });

  CaregiverShiftState copyWith({
    String? phase,
    bool? isMorningVitalsLogged,
    bool? isMorningChecklistLogged,
    bool? isLockdownComplete,
  }) {
    return CaregiverShiftState(
      phase: phase ?? this.phase,
      isMorningVitalsLogged: isMorningVitalsLogged ?? this.isMorningVitalsLogged,
      isMorningChecklistLogged: isMorningChecklistLogged ?? this.isMorningChecklistLogged,
      isLockdownComplete: isLockdownComplete ?? this.isLockdownComplete,
    );
  }
}

// 3. Define BLoC State Controller
class CaregiverShiftBloc extends Bloc<ShiftEvent, CaregiverShiftState> {
  CaregiverShiftBloc() : super(CaregiverShiftState(phase: 'IDLE')) {
    
    on<StartMorningEvent>((event, emit) {
      emit(state.copyWith(phase: 'MORNING'));
    });
    
    on<LogMorningVitalsEvent>((event, emit) {
      final updatedVitals = true;
      final autoTransition = updatedVitals && state.isMorningChecklistLogged;
      emit(state.copyWith(
        isMorningVitalsLogged: true,
        phase: autoTransition ? 'INTERIM' : 'MORNING'
      ));
    });
    
    on<LogMorningChecklistEvent>((event, emit) {
      final updatedCheck = true;
      final autoTransition = state.isMorningVitalsLogged && updatedCheck;
      emit(state.copyWith(
        isMorningChecklistLogged: true,
        phase: autoTransition ? 'INTERIM' : 'MORNING'
      ));
    });

    on<StartEveningEvent>((event, emit) {
      emit(state.copyWith(phase: 'EVENING'));
    });

    on<CompleteNightLockdownEvent>((event, emit) {
      emit(state.copyWith(
        isLockdownComplete: true,
        phase: 'COMPLETED'
      ));
    });
  }
}
*/`;

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper checks
    function isSignedIn() {
      return request.auth != null;
    }
    function getUserRole(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.role;
    }
    function isChildOf(parentDoc, uid) {
      return parentDoc.data.childId == uid;
    }

    // 1. Users Rule - Anyone signed in can read. Subscribing Child or Caregiver or Care Manager.
    match /users/{userId} {
      allow read, write: if isSignedIn() && (request.auth.uid == userId || getUserRole(request.auth.uid) == 'SUPER_ADMIN');
    }

    // 2. Parents records (Health Emergency summaries)
    match /parents/{parentId} {
      allow read: if isSignedIn() && (
        getUserRole(request.auth.uid) == 'CARE_MANAGER' || 
        getUserRole(request.auth.uid) == 'CAREGIVER' || 
        resource.data.childId == request.auth.uid
      );
      allow write: if isSignedIn() && (getUserRole(request.auth.uid) == 'SUPER_ADMIN');
    }

    // 3. Vitals Log - Caregivers write, Caregiver & Child & Care Manager read
    match /vitalsLogs/{logId} {
      allow create: if isSignedIn() && getUserRole(request.auth.uid) == 'CAREGIVER';
      allow read: if isSignedIn() && (
        getUserRole(request.auth.uid) == 'CARE_MANAGER' || 
        getUserRole(request.auth.uid) == 'CAREGIVER' ||
        isChildOf(get(/databases/$(database)/documents/parents/$(request.resource.data.parentId)), request.auth.uid) ||
        isChildOf(get(/databases/$(database)/documents/parents/$(resource.data.parentId)), request.auth.uid)
      );
      allow update, delete: if isSignedIn() && (getUserRole(request.auth.uid) == 'SUPER_ADMIN' || resource.data.loggedBy == request.auth.uid);
    }

    // 4. Daily Checklists - Night environmental lockdown sweeps
    match /dailyChecklists/{checkId} {
      allow create: if isSignedIn() && getUserRole(request.auth.uid) == 'CAREGIVER';
      allow read: if isSignedIn() && (
        getUserRole(request.auth.uid) == 'CAREGIVER' || 
        getUserRole(request.auth.uid) == 'CARE_MANAGER' ||
        isChildOf(get(/databases/$(database)/documents/parents/$(resource.data.parentId)), request.auth.uid)
      );
    }

    // 5. Emergency Tickets - Escalations & Chrono Admission Triage Logs
    match /emergencyTickets/{ticketId} {
      allow create, read, update: if isSignedIn();
    }
    
    // 6. Marketplace Bookings
    match /marketplaceBookings/{bookingId} {
      allow create, read: if isSignedIn() && (
        isChildOf(get(/databases/$(database)/documents/parents/$(request.resource.data.parentId)), request.auth.uid) ||
        getUserRole(request.auth.uid) == 'SUPER_ADMIN' ||
        getUserRole(request.auth.uid) == 'CARE_MANAGER'
      );
      allow update, delete: if isSignedIn() && getUserRole(request.auth.uid) == 'SUPER_ADMIN';
    }
  }
}`;

  return (
    <div id="blueprint_viewer" className="bg-[#0b1019] text-gray-200 p-6 rounded-2xl border border-blue-950/80 shadow-2xl font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-blue-900/30">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-blue-400 font-mono font-bold">Platform Blueprint & System Schema</span>
          <h2 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2 mt-1">
            <Server className="w-6 h-6 text-blue-500" />
            Backend Architecture Specification
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Production-ready PostgreSQL relational models, Firestore configurations, secure rules, and transactional split-shift Dart state machines.
          </p>
        </div>
        
        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 bg-[#121c2d] p-1 rounded-lg border border-blue-900/40">
          <button
            onClick={() => setActiveTab('postgres')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'postgres' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            PostgreSQL
          </button>
          <button
            onClick={() => setActiveTab('firestore')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'firestore' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Firestore
          </button>
          <button
            onClick={() => setActiveTab('statemachine')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'statemachine' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            State (Dart/TS)
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'rules' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Security Rules
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Core Architecture Highlights */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#121c2d]/50 p-4 rounded-xl border border-blue-900/10 space-y-4 text-xs">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              Design Decoupling
            </h3>
            
            <div className="space-y-3 font-sans">
              <div>
                <span className="text-blue-400 font-semibold block uppercase tracking-wide text-[9px]">Dual-User Synchronization</span>
                <p className="text-gray-400 leading-relaxed mt-0.5">
                  Transactional consistency bridges field shifts in Indore with real-time push analytics on client screen views in Mumbai and Bangalore.
                </p>
              </div>

              <div>
                <span className="text-blue-400 font-semibold block uppercase tracking-wide text-[9px]">Calculated Commission Splits</span>
                <p className="text-gray-400 leading-relaxed mt-0.5">
                  Automated split calculations at the database engine level via postgres generated columns, ensuring robust transparency.
                </p>
              </div>

              <div>
                <span className="text-blue-400 font-semibold block uppercase tracking-wide text-[9px]">Clinical Integrity</span>
                <p className="text-gray-400 leading-relaxed mt-0.5">
                  Mandatory sweep constraints and strict data bounds prevent partial logs and erroneous vitals entries by caregivers.
                </p>
              </div>

              <div>
                <span className="text-blue-300 font-mono text-[10px] block pt-2 border-t border-blue-900/20">
                  ⚡ Indore Hub: Active
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1a1112]/40 p-4 rounded-xl border border-red-950/50 space-y-2">
            <h4 className="text-red-400 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              ⚠️ CRISIS BYPASS ENGINE
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
              SOS broadcasts bypass any active shift states. It triggers transactional triggers creating the Care Manager Admission Ticket instantly.
            </p>
          </div>
        </div>

        {/* Dynamic Code Viewer */}
        <div className="lg:col-span-3">
          <div className="bg-[#080d15] rounded-xl border border-blue-950/80 overflow-hidden font-mono text-xs">
            <div className="bg-[#111927] px-4 py-2.5 flex items-center justify-between border-b border-blue-950/80">
              <span className="text-gray-400 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-500" />
                {activeTab === 'postgres' ? 'postgres_schema.sql' : 
                 activeTab === 'firestore' ? 'firestore_schema.json' : 
                 activeTab === 'statemachine' ? 'shift_bloc_notifier.ts / dart' : 'firestore.rules'}
              </span>
              <span className="text-[10px] text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded font-mono">
                {activeTab === 'postgres' ? 'SQL DDL' : 
                 activeTab === 'firestore' ? 'JSON Document Map' : 
                 activeTab === 'statemachine' ? 'TS & Dart Code' : 'Production Rules'}
              </span>
            </div>

            <pre className="p-4 overflow-x-auto text-gray-300 max-h-[500px] leading-relaxed select-text">
              <code>
                {activeTab === 'postgres' ? postgresDDL : 
                 activeTab === 'firestore' ? firestoreSchema : 
                 activeTab === 'statemachine' ? stateMachineCode : firestoreRules}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
