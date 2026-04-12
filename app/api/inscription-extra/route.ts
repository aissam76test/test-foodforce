import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Créer le compte auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true
    });

    if (authError) {
      console.log('Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // 2. Sauvegarder le profil
    const { error: profileError } = await supabase
      .from('extras')
      .insert([{
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        telephone: body.telephone,
        secteur: body.secteur,
        metier: body.metier,
        experience: body.experience,
        ville: 'Casablanca',
        user_id: authData.user?.id
      }]);

    if (profileError) {
      console.log('Profile error:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log('Catch error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}