import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const docType = formData.get('docType') as string;
    const userType = formData.get('userType') as string;

    console.log('Upload request:', { userId, docType, userType, fileName: file?.name });

    if (!file || !userId || !docType) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userType}/${userId}/${docType}.${fileExt}`;

    console.log('Uploading to:', fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabase.storage
      .from('Document')
      .upload(fileName, buffer, { upsert: true, contentType: file.type });

    if (uploadError) {
      console.log('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from('Document').getPublicUrl(fileName);
    
    const table = userType === 'extras' ? 'extras' : 'etablissements';
    const updateData: any = {};
    updateData[`${docType}_url`] = data.publicUrl;
    updateData[`${docType}_statut`] = 'en_attente';

    const { error: updateError } = await supabase.from(table).update(updateData).eq('user_id', userId);
    
    if (updateError) {
      console.log('Update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (err) {
    console.log('Catch error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}