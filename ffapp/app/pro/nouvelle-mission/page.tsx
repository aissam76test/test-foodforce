"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Tariff={id:number;job:string;candidate_rate:number;employer_ttc:number};

export default function NouvelleMission() {
  const [tariffs,setTariffs]=useState<Tariff[]>([]);
  const [job,setJob]=useState("");
  const [seats,setSeats]=useState(1);
  const [status,setStatus]=useState("Chargement de la grille tarifaire…");

  useEffect(()=>{(async()=>{
    const s=createClient();
    const {data,error}=await s.from("tariff_grid").select("id,job,candidate_rate,employer_ttc").eq("active",true).order("job");
    if(error){setStatus("Impossible de charger la grille tarifaire.");return;}
    const rows=(data||[]) as Tariff[];
    setTariffs(rows);setJob(rows[0]?.job||"");setStatus("");
  })()},[]);

  const selected=tariffs.find(x=>x.job===job);

  async function publishMission(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setStatus("Publication en cours…");
    if(!selected){setStatus("Sélectionnez un métier.");return;}
    const form=new FormData(e.currentTarget);const s=createClient();
    const {error}=await s.rpc("create_mission",{
      p_tariff_id:selected.id,
      p_city:String(form.get("city")),
      p_address:String(form.get("address")),
      p_starts_at:String(form.get("date"))+"T"+String(form.get("start"))+":00",
      p_ends_at:String(form.get("date"))+"T"+String(form.get("end"))+":00",
      p_seats:seats,
      p_notes:String(form.get("notes")||"")
    });
    setStatus(error?"Erreur : "+error.message:"Mission publiée avec le tarif officiel FoodForce. L'adresse restera masquée pour les Extras.");
  }

  return <main className="appShell">
    <header className="appHeader"><Link className="brand" href="/">FOOD<span>FORCE</span></Link><div className="appName">PRO</div><nav><Link href="/pro">Retour</Link></nav></header>
    <section className="pageIntro"><span className="eyebrow">FOODFORCE PRO</span><h1>Publier une mission</h1><p>Choisissez parmi les 59 métiers. Le tarif est imposé par la grille FoodForce.</p></section>
    <form className="panel formPanel" onSubmit={publishMission}>
      <label>Métier<select value={job} onChange={e=>setJob(e.target.value)} required>{tariffs.map(t=><option key={t.id} value={t.job}>{t.job}</option>)}</select></label>
      {selected&&<div className="lockedNotice"><div><b>Tarif Extra : {Number(selected.candidate_rate).toFixed(2)} MAD/h</b><span>Facturé à l'établissement : {Number(selected.employer_ttc).toFixed(2)} MAD/h TTC · 🔒 tarif verrouillé</span></div></div>}
      <label>Nombre d'extras<input type="number" min="1" value={seats} onChange={e=>setSeats(Math.max(1,Number(e.target.value)))} /></label>
      <label>Date<input name="date" type="date" required /></label>
      <div className="two"><label>Début<input name="start" type="time" required /></label><label>Fin<input name="end" type="time" required /></label></div>
      <label>Ville / quartier visible<input name="city" placeholder="Ex. Casablanca · Maarif" required /></label>
      <label>Adresse exacte<input name="address" placeholder="Visible uniquement après acceptation" required /></label>
      <label>Informations complémentaires<textarea name="notes" placeholder="Tenue, consignes, événement..." rows={4}/></label>
      <button type="submit" disabled={!selected}>Publier la mission</button>
      {status&&<p>{status}</p>}
    </form>
  </main>;
}