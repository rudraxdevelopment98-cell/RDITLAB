import { create } from 'zustand';
import type {
  Medication,
  MedicationLog,
  Vital,
  Appointment,
  HealthCondition,
  MedicationLogStatus,
} from '@/types/models';
import { medicationsService, type NewMedicationInput } from '@/services/medications.service';
import { vitalsService, type NewVitalInput } from '@/services/vitals.service';
import { appointmentsService, type NewAppointmentInput } from '@/services/appointments.service';
import { conditionsService, type NewConditionInput } from '@/services/conditions.service';
import {
  scheduleMedicationReminders,
  requestNotificationPermission,
} from '@/lib/notifications';

type HealthState = {
  medications: Medication[];
  logs: MedicationLog[];
  vitals: Vital[];
  appointments: Appointment[];
  conditions: HealthCondition[];
  loading: boolean;
  error: string | null;

  loadAll: (userId: string) => Promise<void>;

  addMedication: (userId: string, input: NewMedicationInput) => Promise<void>;
  removeMedication: (id: string) => Promise<void>;
  logDose: (
    userId: string,
    medicationId: string,
    scheduledTime: string,
    status: MedicationLogStatus,
    scheduleId?: string,
  ) => Promise<void>;

  addVital: (userId: string, input: NewVitalInput) => Promise<void>;
  addAppointment: (userId: string, input: NewAppointmentInput) => Promise<void>;
  addCondition: (userId: string, input: NewConditionInput) => Promise<void>;
};

export const useHealthStore = create<HealthState>((set, get) => ({
  medications: [],
  logs: [],
  vitals: [],
  appointments: [],
  conditions: [],
  loading: false,
  error: null,

  loadAll: async (userId) => {
    set({ loading: true, error: null });
    try {
      const [medications, logs, vitals, appointments, conditions] = await Promise.all([
        medicationsService.list(userId),
        medicationsService.listLogs(userId),
        vitalsService.list(userId),
        appointmentsService.list(userId),
        conditionsService.list(userId),
      ]);
      set({ medications, logs, vitals, appointments, conditions, loading: false });
    } catch (e: any) {
      set({ loading: false, error: e?.message ?? 'Failed to load data' });
    }
  },

  addMedication: async (userId, input) => {
    const med = await medicationsService.create(userId, input);
    set({ medications: [med, ...get().medications] });
    // Schedule offline reminders right away.
    const granted = await requestNotificationPermission();
    if (granted) await scheduleMedicationReminders(med);
  },

  removeMedication: async (id) => {
    await medicationsService.remove(id);
    set({ medications: get().medications.filter((m) => m.id !== id) });
  },

  logDose: async (userId, medicationId, scheduledTime, status, scheduleId) => {
    const log = await medicationsService.logDose(
      userId,
      medicationId,
      scheduledTime,
      status,
      scheduleId,
    );
    set({ logs: [log, ...get().logs] });
  },

  addVital: async (userId, input) => {
    const vital = await vitalsService.create(userId, input);
    set({ vitals: [vital, ...get().vitals] });
  },

  addAppointment: async (userId, input) => {
    const appt = await appointmentsService.create(userId, input);
    set({
      appointments: [...get().appointments, appt].sort((a, b) =>
        a.scheduledAt.localeCompare(b.scheduledAt),
      ),
    });
  },

  addCondition: async (userId, input) => {
    const condition = await conditionsService.create(userId, input);
    set({ conditions: [condition, ...get().conditions] });
  },
}));
