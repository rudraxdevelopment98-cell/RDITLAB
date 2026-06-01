import { supabase } from '@/lib/supabase';
import { mapVital } from './mappers';
import type { Vital, VitalType } from '@/types/models';

export type NewVitalInput = Omit<Vital, 'id' | 'userId' | 'createdAt'>;

export const vitalsService = {
  async list(userId: string, type?: VitalType): Promise<Vital[]> {
    let query = supabase
      .from('vitals')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false });
    if (type) query = query.eq('type', type);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapVital);
  },

  async create(userId: string, input: NewVitalInput): Promise<Vital> {
    const { data, error } = await supabase
      .from('vitals')
      .insert({
        user_id: userId,
        type: input.type,
        value_1: input.value1,
        value_2: input.value2,
        unit: input.unit,
        context: input.context,
        notes: input.notes,
        recorded_at: input.recordedAt,
      })
      .select()
      .single();
    if (error) throw error;
    return mapVital(data);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('vitals').delete().eq('id', id);
    if (error) throw error;
  },
};
