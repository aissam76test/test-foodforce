import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const { error: profileError } = await supabase
      .from('etablissements')
      .insert([{
        nom: body.nom,
        email: body.email,
        telephone: body.telephone,
        type: body.type,
        adresse: body.adresse,
        ville: body.ville,
        user_id: authData.user?.id
      }]);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}