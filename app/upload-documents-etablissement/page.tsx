'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function UploadDocumentsEtablissement() {
  const [user, setUser] = useState<any>(null);
  const [etablissement, setEtablissement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState({
    kbis: null as File | null,
    patente: null as File | null,
    cin_gerant: null as File | null,
    rib: null as File | null
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const { data: etabData } = await supabase.from('etablissements').select('*').eq('email', user.email).single();
      if (etabData) {
        setEtablissement(etabData);
        
        if (etabData.kbis_statut === 'validé' && etabData.patente_statut === 'validé') {
          window.location.href = '/dashboard-etablissement';
        }
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleFileChange = (docType: string, file: File | null) => {
    setDocuments({ ...documents, [docType]: file });
  };

  const uploadDocument = async (file: File, docType: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${etablissement.id}/${docType}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('Document')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Erreur upload:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('Document').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const updates: any = {};

      if (documents.kbis) {
        const url = await uploadDocument(documents.kbis, 'kbis');
        if (url) updates.kbis_url = url;
      }

      if (documents.patente) {
        const url = await uploadDocument(documents.patente, 'patente');
        if (url) updates.patente_url = url;
      }

      if (documents.cin_gerant) {
        const url = await uploadDocument(documents.cin_gerant, 'cin_gerant');
        if (url) updates.cin_gerant_url = url;
      }

      if (documents.rib) {
        const url = await uploadDocument(documents.rib, 'rib');
        if (url) updates.rib_url = url;
      }

      updates.kbis_statut = 'en_attente';
      updates.patente_statut = 'en_attente';
      updates.cin_gerant_statut = 'en_attente';
      updates.rib_statut = 'en_attente';

      await supabase
        .from('etablissements')
        .update(updates)
        .eq('id', etablissement.id);

      alert('✅ Documents envoyés ! Votre profil sera validé sous 24-48h.');
      window.location.href = '/dashboard-etablissement';
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de l\'upload');
      setUploading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins, sans-serif' }}>Chargement...</div>;

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      <nav style={{ background: 'white', padding: '16px 40px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>Food</span>
        <span style={{ fontWeight: 800, fontSize: '20px', color: '#F47C20' }}>Force</span>
      </nav>

      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: '#FDF0E8', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>📋 Validation de votre établissement</h1>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
            Pour pouvoir publier des missions, nous devons vérifier votre établissement. Veuillez uploader les documents suivants :
          </p>
          <ul style={{ color: '#666', fontSize: '14px', paddingLeft: '20px' }}>
            <li>✅ KBIS</li>
            <li>✅ Patente (taxe professionnelle)</li>
            <li>✅ CIN du gérant</li>
            <li>✅ RIB professionnel</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Documents requis</h2>

            {[
              { key: 'kbis', label: 'KBIS', required: true },
              { key: 'patente', label: 'Patente', required: true },
              { key: 'cin_gerant', label: 'CIN du gérant', required: true },
              { key: 'rib', label: 'RIB professionnel', required: true }
            ].map(doc => (
              <div key={doc.key} style={{ marginBottom: '20px', border: '2px dashed #e0e0e0', borderRadius: '12px', padding: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                  {doc.label} {doc.required && <span style={{ color: '#F47C20' }}>*</span>}
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  required={doc.required}
                  onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] || null)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                />
                {(documents as any)[doc.key] && (
                  <div style={{ marginTop: '8px', color: '#22c55e', fontSize: '13px' }}>
                    ✅ {(documents as any)[doc.key].name}
                  </div>
                )}
              </div>
            ))}

            <div style={{ background: '#FFF9E6', borderRadius: '8px', padding: '16px', marginTop: '20px' }}>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                💡 <strong>Format acceptés :</strong> PDF, JPG, PNG<br/>
                📝 <strong>Délai de validation :</strong> 24-48h<br/>
                📧 <strong>Notification :</strong> Vous recevrez un email une fois votre profil validé
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            style={{ width: '100%', background: '#F47C20', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
            {uploading ? '⏳ Envoi en cours...' : '🚀 Soumettre les documents'}
          </button>
        </form>
      </div>
    </main>
  );
}