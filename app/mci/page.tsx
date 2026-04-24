'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function MCI() {
  const [missions, setMissions] = useState<any[]>([]);
  const [extra, setExtra] = useState<any>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Récupérer le profil extra
    const { data: extraData } = await supabase
      .from('extras')
      .select('*')
      .eq('user_id', user.id)
      .single();
    setExtra(extraData);

    // Récupérer les missions acceptées
    const { data: candidatures } = await supabase
      .from('candidatures')
      .select('mission_id, statut, missions(*)')
      .eq('extra_id', extraData?.id)
      .eq('statut', 'accepté');

    if (candidatures) {
      setMissions(candidatures.map((c: any) => c.missions));
    }
    setLoading(false);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const calculerDuree = (debut: string, fin: string) => {
    const [h1, m1] = debut.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    return ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
  };

  const genererPDF = () => {
    const missionsFact = missions.filter(m => selected.includes(m.id));
    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(244, 124, 32);
    doc.text('FoodForce', 14, 20);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Moroccan Contractor Invoice (MCI)', 14, 28);

    // Infos extra
    doc.setFontSize(12);
    doc.text('Prestataire :', 14, 45);
    doc.setFontSize(10);
    doc.text(`${extra?.prenom} ${extra?.nom}`, 14, 52);
    doc.text(`Email : ${extra?.email}`, 14, 58);
    doc.text(`Téléphone : ${extra?.telephone || '-'}`, 14, 64);
    doc.text(`N° Patente : ${extra?.numero_patente || '-'}`, 14, 70);

    // Date
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 150, 45);

    // Ligne séparatrice
    doc.setDrawColor(244, 124, 32);
    doc.line(14, 78, 196, 78);

    // Tableau missions
    const rows = missionsFact.map(m => {
      const duree = calculerDuree(m.heure_debut, m.heure_fin);
      const total = (duree * m.taux_horaire).toFixed(2);
      return [
        m.titre,
        new Date(m.date_mission).toLocaleDateString('fr-FR'),
        `${m.heure_debut} - ${m.heure_fin}`,
        `${duree}h`,
        `${m.taux_horaire} MAD/h`,
        `${total} MAD`
      ];
    });

    autoTable(doc, {
      startY: 85,
      head: [['Mission', 'Date', 'Horaires', 'Durée', 'Taux', 'Total']],
      body: rows,
      headStyles: { fillColor: [244, 124, 32] },
      styles: { fontSize: 9 }
    });

    // Total général
    const totalGeneral = missionsFact.reduce((acc, m) => {
      const duree = calculerDuree(m.heure_debut, m.heure_fin);
      return acc + duree * m.taux_horaire;
    }, 0);

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(244, 124, 32);
    doc.text(`Total général : ${totalGeneral.toFixed(2)} MAD`, 140, finalY);

    doc.save(`MCI_${extra?.nom}_${new Date().toLocaleDateString('fr-FR')}.pdf`);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Chargement...</div>;

  return (
    <main style={{ fontFamily: 'Poppins, sans-serif', background: '#FDF0E8', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            <span style={{ color: '#1a1a1a' }}>Food</span>
            <span style={{ color: '#F47C20' }}>Force</span>
            <span style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 400, marginLeft: '12px' }}>— Moroccan Contractor Invoice</span>
          </h1>
          <p style={{ color: '#666', marginTop: '8px' }}>Sélectionnez les missions à facturer</p>
        </div>

        {missions.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#666' }}>
            Aucune mission acceptée pour le moment.
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {missions.map(m => {
                const duree = calculerDuree(m.heure_debut, m.heure_fin);
                const total = (duree * m.taux_horaire).toFixed(2);
                const isSelected = selected.includes(m.id);
                return (
                  <div key={m.id} onClick={() => toggleSelect(m.id)}
                    style={{ background: 'white', borderRadius: '12px', padding: '20px', cursor: 'pointer', border: `2px solid ${isSelected ? '#F47C20' : '#f0f0f0'}`, transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '16px' }}>{m.titre}</div>
                        <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
                          {new Date(m.date_mission).toLocaleDateString('fr-FR')} • {m.heure_debut} - {m.heure_fin} • {duree}h
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '18px', color: '#F47C20' }}>{total} MAD</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>{m.taux_horaire} MAD/h</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selected.length > 0 && (
              <button onClick={genererPDF}
                style={{ width: '100%', background: '#F47C20', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '16px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                Générer la facture PDF ({selected.length} mission{selected.length > 1 ? 's' : ''})
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
}