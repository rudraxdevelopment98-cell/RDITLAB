/**
 * Domain models for MediCare.
 *
 * These mirror the PostgreSQL schema (see supabase/schema.sql). Fields marked
 * "(encrypted)" are encrypted client-side before they ever leave the device.
 */

export type UUID = string;
export type ISODateString = string; // 'YYYY-MM-DD'
export type ISOTimeString = string; // 'HH:mm'
export type ISODateTimeString = string; // full ISO 8601

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type BloodGroup =
  | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';

export interface Profile {
  id: UUID;
  fullName: string | null;
  dateOfBirth: ISODateString | null;
  gender: Gender | null;
  bloodGroup: BloodGroup | null;
  heightCm: number | null;
  weightKg: number | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null; // (encrypted)
  primaryDoctor: string | null;
  allergies: string | null; // (encrypted)
  photoUrl: string | null;
  language: 'en' | 'hi' | 'gu';
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

export type ConditionSeverity = 'mild' | 'moderate' | 'severe';

export interface HealthCondition {
  id: UUID;
  userId: UUID;
  name: string;
  severity: ConditionSeverity | null;
  diagnosedDate: ISODateString | null;
  notes: string | null; // (encrypted)
  isActive: boolean;
  createdAt: ISODateTimeString;
}

export type MedicationForm =
  | 'tablet' | 'capsule' | 'syrup' | 'injection' | 'drops'
  | 'inhaler' | 'cream' | 'powder' | 'other';

export type FoodInstruction =
  | 'before_food' | 'with_food' | 'after_food' | 'empty_stomach' | 'anytime';

export interface Medication {
  id: UUID;
  userId: UUID;
  conditionId: UUID | null;
  name: string;
  dosage: string; // e.g. "500 mg", "10 units"
  form: MedicationForm;
  instruction: FoodInstruction;
  startDate: ISODateString;
  endDate: ISODateString | null; // null => ongoing
  stockCount: number | null;
  refillThreshold: number | null;
  isActive: boolean;
  createdAt: ISODateTimeString;
  schedules?: MedicationSchedule[];
}

export type Weekday = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

export interface MedicationSchedule {
  id: UUID;
  medicationId: UUID;
  time: ISOTimeString; // local "HH:mm"
  daysOfWeek: Weekday[] | null; // null => every day
  createdAt: ISODateTimeString;
}

export type MedicationLogStatus = 'taken' | 'missed' | 'snoozed' | 'skipped' | 'pending';

export interface MedicationLog {
  id: UUID;
  userId: UUID;
  medicationId: UUID;
  scheduleId: UUID | null;
  scheduledTime: ISODateTimeString;
  actualTime: ISODateTimeString | null;
  status: MedicationLogStatus;
  notes: string | null; // (encrypted)
  createdAt: ISODateTimeString;
}

export type VitalType =
  | 'blood_sugar' | 'blood_pressure' | 'weight' | 'temperature'
  | 'heart_rate' | 'spo2';

export type VitalContext = 'fasting' | 'post_meal' | 'random' | 'pre_meal' | null;

export interface Vital {
  id: UUID;
  userId: UUID;
  type: VitalType;
  value1: number; // sugar level / systolic / weight / etc.
  value2: number | null; // diastolic (BP only)
  unit: string;
  context: VitalContext;
  notes: string | null; // (encrypted)
  recordedAt: ISODateTimeString;
  createdAt: ISODateTimeString;
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: UUID;
  userId: UUID;
  doctorName: string;
  specialty: string | null;
  location: string | null;
  phone: string | null;
  scheduledAt: ISODateTimeString;
  purpose: string | null;
  notesBefore: string | null; // (encrypted)
  notesAfter: string | null; // (encrypted)
  status: AppointmentStatus;
  createdAt: ISODateTimeString;
}

export type ReminderType = 'water' | 'exercise' | 'meal' | 'custom';

export interface Reminder {
  id: UUID;
  userId: UUID;
  title: string;
  description: string | null;
  type: ReminderType;
  scheduleCron: string; // cron expression
  isActive: boolean;
  createdAt: ISODateTimeString;
}
