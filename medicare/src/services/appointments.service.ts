import { supabase } from '@/lib/supabase';
import { mapAppointment } from './mappers';
import type { Appointment } from '@/types/models';

export type NewAppointmentInput = Omit<
  Appointment,
  'id' | 'userId' | 'createdAt' | 'status'
> & { status?: Appointment['status'] };

export const appointmentsService = {
  async list(userId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapAppointment);
  },

  async create(userId: string, input: NewAppointmentInput): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: userId,
        doctor_name: input.doctorName,
        specialty: input.specialty,
        location: input.location,
        phone: input.phone,
        scheduled_at: input.scheduledAt,
        purpose: input.purpose,
        notes_before: input.notesBefore,
        notes_after: input.notesAfter,
        status: input.status ?? 'upcoming',
      })
      .select()
      .single();
    if (error) throw error;
    return mapAppointment(data);
  },

  async updateStatus(id: string, status: Appointment['status']): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
  },
};
