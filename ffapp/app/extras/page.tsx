"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

type Mission={id:string;city:string;starts_at:string;ends_at:string;seats:number;notes:string|null;candidate_rate:number;tariff_grid:{job:string}|null};

export default function Extras(){
 const [missions,setMissions]=useState<Mission[]>([]);
 const [message,setMessage]=useState("Chargement des missions…");
 useEffect(()=>{(async()=>{const s=createClient(); const {data,error}=await s.from("missions").select("id,city,starts_at,ends_at,seats,notes,candidate_rate,tariff_grid(job)").eq("status","published").order("starts_at"); if(error)setMessage("Connexion Supabase à configurer."); else {setMissions((data||[]) as unknown as Mission[]);setMessage("");}})()},[]);
 async function apply(id:string){const s=createClient();const {error}=await s.rpc("apply_to_mission",{p_mission_id:id});setMessage(error?"Impossible de postuler : "+error.message:"Candidature envoyée ✅");}
 return <main className="appShell">
  <header className="appHeader"><Link className="brand" href="/">FOOD<span>FORCE</span></Link><div className="appName">EXTRAS</div><nav><Link href="/extras">Missions</Link><Link href="/extras/mes-missions">Mes missions</Link><Link href="/extras/profil">Mon profil</Link><button className="secondaryBtn" onClick={async()=>{const s=createClient();await s.auth.signOut();location.href="/connexion";}}>Déconnexion</button></nav></header>
  <section className="appHero extraHero"><div><p className="eyebrow">FOODFORCE EXTRAS</p><h1>Les bonnes missions,<br/><span>au bon moment.</span></h1><p>Découvrez les missions proches de vous. L'établissement reste anonyme jusqu'à votre sélection.</p></div><div className="privacyCard">🔒 <b>Votre confidentialité</b><span>Nom, adresse et contact de l'établissement sont masqués avant acceptation.</span></div></section>
  <div className="sectionHead"><div><span className="eyebrow">MISSIONS</span><h2>Missions disponibles</h2></div><span className="count">{missions.length} disponible(s)</span></div>
  <section className="missionGrid">{missions.map(m=><article className="missionCard" key={m.id}><div className="missionTop"><span className="tag">DISPONIBLE</span><span>📍 {m.city}</span></div><h3>{m.tariff_grid?.job}</h3><p className="missionTime">{new Date(m.starts_at).toLocaleDateString("fr-FR",{weekday:"short",day:"2-digit",month:"short"})} · {new Date(m.starts_at).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}–{new Date(m.ends_at).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</p><div className="anonymous"><span>🏨</span><div><b>Établissement partenaire</b><small>Identité révélée après sélection</small></div></div><div className="missionBottom"><strong>{Number(m.candidate_rate).toFixed(2)} <small>MAD/h</small></strong><span>{m.seats} poste(s)</span></div><button onClick={()=>apply(m.id)}>Postuler à cette mission</button></article>)}</section>
  {message&&<p className="statusMessage">{message}</p>}
  <footer><b>FOODFORCE EXTRAS</b><span>59 métiers · Tarifs centralisés · Missions anonymisées</span></footer>
 </main>
}