import { supabase } from '@/lib/supabase';
import { mapMedication, mapLog } from './mappers';
import type {
  Medication,
  MedicationLog,
  MedicationLogStatus,
  MedicationSchedule,
} from '@/types/models';

export type NewMedicationInput = Omit<
  Medication,
  'id' | 'userId' | 'createdAt' | 'isActive' | 'schedules'
> & {
  schedules: Array<Pick<MedicationSchedule, 'time' | 'daysOfWeek'>>;
};

export const medicationsService = {
  async list(userId: string): Promise<Medication[]> {
    const { data, error } = await supabase
      .from('medications')
      .select('*, medication_schedules(*)')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapMedication);
  },

  async create(userId: string, input: NewMedicationInput): Promise<Medication> {
    const { schedules, ...med } = input;
    const { data, error } = await supabase
      .from('medications')
      .insert({
        user_id: userId,
        condition_id: med.conditionId,
        name: med.name,
        dosage: med.dosage,
        form: med.form,
        instruction: med.instruction,
        start_date: med.startDate,
        end_date: med.endDate,
        stock_count: med.stockCount,
        refill_threshold: med.refillThreshold,
      })
      .select()
      .single();
    if (error) throw error;

    if (schedules.length > 0) {
      const { error: schedErr } = await supabase.from('medication_schedules').insert(
        schedules.map((s) => ({
          medication_id: data.id,
          time: s.time,
          days_of_week: s.daysOfWeek,
        })),
      );
      if (schedErr) throw schedErr;
    }
    return mapMedication({ ...data, medication_schedules: schedules });
  },

  async remove(id: string): Promise<void> {
    // Soft delete keeps historical logs/adherence intact.
    const { error } = await supabase
      .from('medications')
      .update({ is_active: false })
      .eq('id', id);
    if (error) throw error;
  },

  async logDose(
    userId: string,
    medicationId: string,
    scheduledTime: string,
    status: MedicationLogStatus,
    scheduleId?: string,
  ): Promise<MedicationLog> {
    const { data, error } = await supabase
      .from('medication_logs')
      .insert({
        user_id: userId,
        medication_id: medicationId,
        schedule_id: scheduleId ?? null,
        scheduled_time: scheduledTime,
        actual_time: status === 'taken' ? new Date().toISOString() : null,
        status,
      })
      .select()
      .single();
    if (error) throw error;
    return mapLog(data);
  },

  async listLogs(userId: string, sinceDays = 30): Promise<MedicationLog[]> {
    const since = new Date(Date.now() - sinceDays * 86400000).toISOString();
    const { data, error } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('scheduled_time', since)
      .order('scheduled_time', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapLog);
  },
};
