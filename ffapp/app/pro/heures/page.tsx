"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type App={id:string;extra_id:string;mission_id:string;status:string;missions:{city:string;starts_at:string;tariff_grid:{job:string}|null}|null};
export default function Heures(){
 const [apps,setApps]=useState<App[]>([]);const [hours,setHours]=useState<Record<string,string>>({});const [message,setMessage]=useState("Chargement…");
 async function load(){const s=createClient();const {data,error}=await s.from("applications").select("id,extra_id,mission_id,status,missions(city,starts_at,tariff_grid(job))").eq("status","accepted").order("created_at",{ascending:false});if(error)setMessage("Connexion Supabase à configurer.");else{setApps((data||[]) as unknown as App[]);setMessage("");}}
 useEffect(()=>{load()},[]);
 async function validate(a:App){const s=createClient();const {error}=await s.rpc("validate_worked_hours",{p_mission_id:a.mission_id,p_extra_id:a.extra_id,p_hours:Number(hours[a.id])});setMessage(error?"Erreur : "+error.message:"Heures validées ✅");if(!error)load();}
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span> PRO</div><nav><Link href="/pro">Retour</Link></nav></header><section className="hero"><p className="eyebrow">FOODFORCE PRO</p><h1>Heures travaillées</h1><p>Validez les heures réellement effectuées par les extras.</p></section><section className="grid">{apps.map(a=><article className="mission" key={a.id}><h2>{a.missions?.tariff_grid?.job||"Mission"}</h2><p>{a.missions?.city} · Extra {a.extra_id}</p><input type="number" min="0.5" step="0.5" placeholder="Heures" value={hours[a.id]||""} onChange={e=>setHours({...hours,[a.id]:e.target.value})}/><button onClick={()=>validate(a)}>Valider les heures</button></article>)}</section>{message&&<p>{message}</p>}</main>}
