import { supabase } from '@/lib/supabase';
import { mapCondition } from './mappers';
import type { HealthCondition } from '@/types/models';

export type NewConditionInput = Omit<
  HealthCondition,
  'id' | 'userId' | 'createdAt' | 'isActive'
>;

export const conditionsService = {
  async list(userId: string): Promise<HealthCondition[]> {
    const { data, error } = await supabase
      .from('conditions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapCondition);
  },

  async create(userId: string, input: NewConditionInput): Promise<HealthCondition> {
    const { data, error } = await supabase
      .from('conditions')
      .insert({
        user_id: userId,
        name: input.name,
        severity: input.severity,
        diagnosed_date: input.diagnosedDate,
        notes: input.notes,
      })
      .select()
      .single();
    if (error) throw error;
    return mapCondition(data);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('conditions')
      .update({ is_active: false })
      .eq('id', id);
    if (error) throw error;
  },
};
