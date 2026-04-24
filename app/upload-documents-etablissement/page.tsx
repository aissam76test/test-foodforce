'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function UploadDocumentsEtablissement() {
  const [user, setUser] = useState<any>(null);
  const [etablissement, setEtablissement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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

  const bg = darkMode ? '#0a0a0a' : 'linear-gradient(135deg, #FDF0E8 0%, #fff 100%)';
  const cardBg = darkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff';
  const textPrimary = darkMode ? '#fff' : '#1a1a1a';
  const textSecondary = darkMode ? '#999' : '#666';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.08)';

  if (loading) return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e3e8ee', borderTop: '4px solid #F47C20', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: bg, minHeight: '100vh', padding: '40px 20px', transition: 'background 0.3s ease', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Animated Background */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: darkMode ? 'rgba(244, 124, 32, 0.05)' : 'rgba(244, 124, 32, 0.1)', borderRadius: '50%', filter: 'blur(100px)', animation: 'float 6s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '400px', height: '400px', background: darkMode ? 'rgba(255, 154, 86, 0.05)' : 'rgba(255, 154, 86, 0.1)', borderRadius: '50%', filter: 'blur(120px)', animation: 'float 8s ease-in-out infinite' }} />

      {/* Dark Mode Toggle */}
      <button onClick={() => setDarkMode(!darkMode)} style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        backdropFilter: 'blur(10px)',
        border: 'none',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        transition: 'all 0.3s ease',
        zIndex: 10,
        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ 
          background: cardBg,
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '24px', 
          padding: '32px', 
          marginBottom: '32px',
          boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)',
          border: `1px solid ${borderColor}`,
          animation: 'slideIn 0.6s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px 0', color: textPrimary }}>
                Validation de votre établissement
              </h1>
              <p style={{ color: textSecondary, fontSize: '15px', margin: 0 }}>
                Uploadez vos documents pour commencer à recruter
              </p>
            </div>
          </div>

          <div style={{ 
            background: darkMode ? 'rgba(244, 124, 32, 0.1)' : 'rgba(244, 124, 32, 0.05)', 
            borderRadius: '16px', 
            padding: '20px',
            border: `1px solid ${darkMode ? 'rgba(244, 124, 32, 0.2)' : 'rgba(244, 124, 32, 0.15)'}`
          }}>
            <p style={{ color: textSecondary, fontSize: '14px', margin: '0 0 12px 0', lineHeight: '1.6' }}>
              <strong style={{ color: textPrimary }}>Documents requis :</strong>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {['KBIS', 'Patente', 'CIN du gérant', 'RIB professionnel'].map((doc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#F47C20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01l-3-3" stroke="#F47C20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: '14px', color: textPrimary, fontWeight: 500 }}>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ 
            background: cardBg,
            backdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '24px', 
            padding: '32px',
            boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)',
            border: `1px solid ${borderColor}`,
            marginBottom: '24px',
            animation: 'slideIn 0.7s ease'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: textPrimary, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke={textPrimary} strokeWidth="2"/>
                <path d="M13 2v7h7" stroke={textPrimary} strokeWidth="2"/>
              </svg>
              Vos documents
            </h2>

            {[
              { key: 'kbis', label: 'KBIS', icon: '📄' },
              { key: 'patente', label: 'Patente', icon: '📋' },
              { key: 'cin_gerant', label: 'CIN du gérant', icon: '🪪' },
              { key: 'rib', label: 'RIB professionnel', icon: '🏦' }
            ].map((doc, idx) => (
              <div key={doc.key} style={{ 
                marginBottom: '20px', 
                background: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa',
                borderRadius: '16px', 
                padding: '24px',
                border: `2px dashed ${(documents as any)[doc.key] ? '#F47C20' : borderColor}`,
                transition: 'all 0.3s ease',
                animation: `slideIn ${0.5 + idx * 0.1}s ease`
              }}>
                <label style={{ fontWeight: 600, marginBottom: '12px', fontSize: '15px', color: textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{doc.icon}</span>
                  {doc.label}
                  <span style={{ color: '#F47C20' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] || null)}
                    style={{ 
                      width: '100%', 
                      padding: '14px', 
                      borderRadius: '12px', 
                      border: `2px solid ${borderColor}`,
                      fontSize: '14px',
                      outline: 'none',
                      background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                      color: textPrimary,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F47C20'}
                    onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
                  />
                </div>
                {(documents as any)[doc.key] && (
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(74, 222, 128, 0.1) 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid rgba(34, 197, 94, 0.2)'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 4L12 14.01l-3-3" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 600 }}>
                      {(documents as any)[doc.key].name}
                    </span>
                  </div>
                )}
              </div>
            ))}

            <div style={{ 
              background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              borderRadius: '12px', 
              padding: '20px',
              border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'}`,
              marginTop: '24px'
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2"/>
                  <path d="M12 16v-4M12 8h.01" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div>
                  <p style={{ fontSize: '13px', color: textSecondary, margin: '0 0 8px 0', lineHeight: '1.6' }}>
                    <strong style={{ color: textPrimary }}>Formats acceptés :</strong> PDF, JPG, PNG (max 5 MB)
                  </p>
                  <p style={{ fontSize: '13px', color: textSecondary, margin: '0 0 8px 0', lineHeight: '1.6' }}>
                    <strong style={{ color: textPrimary }}>Délai de validation :</strong> 24-48h ouvrées
                  </p>
                  <p style={{ fontSize: '13px', color: textSecondary, margin: 0, lineHeight: '1.6' }}>
                    <strong style={{ color: textPrimary }}>Notification :</strong> Vous recevrez un email une fois validé
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', animation: 'slideIn 0.8s ease' }}>
            <a href="/login" style={{
              flex: 1,
              background: darkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
              color: textPrimary,
              padding: '18px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 600,
              textAlign: 'center',
              transition: 'all 0.2s ease',
              border: `2px solid ${borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke={textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retour
            </a>
            <button
              type="submit"
              disabled={uploading}
              style={{ 
                flex: 2,
                background: 'linear-gradient(135deg, #F47C20 0%, #FF9A56 100%)', 
                color: '#fff', 
                padding: '18px', 
                borderRadius: '12px', 
                border: 'none', 
                fontSize: '16px', 
                fontWeight: 700,
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.7 : 1,
                boxShadow: '0 8px 24px rgba(244, 124, 32, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {uploading ? (
                <>
                  <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Soumettre les documents
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}