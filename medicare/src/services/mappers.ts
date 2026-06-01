/**
 * Row <-> model mappers. The database uses snake_case; the app uses camelCase.
 * Keeping the translation in one place avoids leaking DB shapes into the UI.
 */
import type {
  Medication,
  MedicationSchedule,
  MedicationLog,
  Vital,
  Appointment,
  HealthCondition,
  Profile,
} from '@/types/models';

export const mapMedication = (r: any): Medication => ({
  id: r.id,
  userId: r.user_id,
  conditionId: r.condition_id,
  name: r.name,
  dosage: r.dosage,
  form: r.form,
  instruction: r.instruction,
  startDate: r.start_date,
  endDate: r.end_date,
  stockCount: r.stock_count,
  refillThreshold: r.refill_threshold,
  isActive: r.is_active,
  createdAt: r.created_at,
  schedules: r.medication_schedules?.map(mapSchedule),
});

export const mapSchedule = (r: any): MedicationSchedule => ({
  id: r.id,
  medicationId: r.medication_id,
  time: r.time?.slice(0, 5) ?? r.time,
  daysOfWeek: r.days_of_week,
  createdAt: r.created_at,
});

export const mapLog = (r: any): MedicationLog => ({
  id: r.id,
  userId: r.user_id,
  medicationId: r.medication_id,
  scheduleId: r.schedule_id,
  scheduledTime: r.scheduled_time,
  actualTime: r.actual_time,
  status: r.status,
  notes: r.notes,
  createdAt: r.created_at,
});

export const mapVital = (r: any): Vital => ({
  id: r.id,
  userId: r.user_id,
  type: r.type,
  value1: Number(r.value_1),
  value2: r.value_2 != null ? Number(r.value_2) : null,
  unit: r.unit,
  context: r.context,
  notes: r.notes,
  recordedAt: r.recorded_at,
  createdAt: r.created_at,
});

export const mapAppointment = (r: any): Appointment => ({
  id: r.id,
  userId: r.user_id,
  doctorName: r.doctor_name,
  specialty: r.specialty,
  location: r.location,
  phone: r.phone,
  scheduledAt: r.scheduled_at,
  purpose: r.purpose,
  notesBefore: r.notes_before,
  notesAfter: r.notes_after,
  status: r.status,
  createdAt: r.created_at,
});

export const mapCondition = (r: any): HealthCondition => ({
  id: r.id,
  userId: r.user_id,
  name: r.name,
  severity: r.severity,
  diagnosedDate: r.diagnosed_date,
  notes: r.notes,
  isActive: r.is_active,
  createdAt: r.created_at,
});

export const mapProfile = (r: any): Profile => ({
  id: r.id,
  fullName: r.full_name,
  dateOfBirth: r.date_of_birth,
  gender: r.gender,
  bloodGroup: r.blood_group,
  heightCm: r.height_cm,
  weightKg: r.weight_kg != null ? Number(r.weight_kg) : null,
  emergencyContactName: r.emergency_contact_name,
  emergencyContactPhone: r.emergency_contact_phone,
  primaryDoctor: r.primary_doctor,
  allergies: r.allergies,
  photoUrl: r.photo_url,
  language: r.language ?? 'en',
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});
