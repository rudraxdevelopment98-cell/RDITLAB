import { supabase } from '@/lib/supabase';
import { mapProfile } from './mappers';
import type { Profile } from '@/types/models';

export const profileService = {
  async get(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapProfile(data) : null;
  },

  async upsert(userId: string, patch: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: patch.fullName,
        date_of_birth: patch.dateOfBirth,
        gender: patch.gender,
        blood_group: patch.bloodGroup,
        height_cm: patch.heightCm,
        weight_kg: patch.weightKg,
        emergency_contact_name: patch.emergencyContactName,
        emergency_contact_phone: patch.emergencyContactPhone,
        primary_doctor: patch.primaryDoctor,
        allergies: patch.allergies,
        photo_url: patch.photoUrl,
        language: patch.language,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return mapProfile(data);
  },
};
