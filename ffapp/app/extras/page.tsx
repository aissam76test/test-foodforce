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
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span></div><nav><Link href="/">Accueil</Link><Link href="/pro">FoodForce Pro</Link></nav></header><section className="hero"><p className="eyebrow">FOODFORCE EXTRAS</p><h1>Missions disponibles</h1><p>Les tarifs affichés sont ceux de la grille officielle FoodForce.</p></section><section className="grid">{missions.map(m=><article className="mission" key={m.id}><span className="tag">Mission disponible</span><h2>{m.tariff_grid?.job}</h2><p>{m.city} · {new Date(m.starts_at).toLocaleString("fr-FR")}</p><strong>{Number(m.candidate_rate).toFixed(2)} MAD/h</strong><small>{m.seats} extra(s) demandé(s)</small><button onClick={()=>apply(m.id)}>Postuler</button></article>)}</section>{message&&<p>{message}</p>}<footer><b>59 métiers</b> · Tarifs centralisés · Aucun tarif modifiable par l'établissement</footer></main>}
