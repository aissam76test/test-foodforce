"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type App={id:string;status:string;mission_id:string;missions:{city:string;starts_at:string;ends_at:string;candidate_rate:number;tariff_grid:{job:string}|null}|null};
type Hours={mission_id:string;hours:number;validated_at:string|null};

export default function MesMissions(){
 const [apps,setApps]=useState<App[]>([]);const [worked,setWorked]=useState<Hours[]>([]);const [message,setMessage]=useState("Chargement…");
 useEffect(()=>{(async()=>{const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){location.href="/connexion";return;}const a=await s.from("applications").select("id,status,mission_id,missions(city,starts_at,ends_at,candidate_rate,tariff_grid(job))").eq("extra_id",user.id).order("created_at",{ascending:false});const h=await s.from("worked_hours").select("mission_id,hours,validated_at").eq("extra_id",user.id);if(a.error||h.error)setMessage("Connexion Supabase à configurer.");else{setApps((a.data||[]) as unknown as App[]);setWorked((h.data||[]) as Hours[]);setMessage("");}})()},[]);
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span></div><nav><Link href="/extras">Missions</Link><Link href="/extras/profil">Mon profil</Link></nav></header><section className="hero"><p className="eyebrow">FOODFORCE EXTRAS</p><h1>Mes missions</h1><p>Suivez vos candidatures et les heures validées.</p></section><section className="grid">{apps.map(a=>{const h=worked.find(x=>x.mission_id===a.mission_id);return <article className="mission" key={a.id}><span className="tag">{a.status}</span><h2>{a.missions?.tariff_grid?.job||"Mission"}</h2><p>{a.missions?.city} · {a.missions?.starts_at?new Date(a.missions.starts_at).toLocaleString("fr-FR"):""}</p><strong>{Number(a.missions?.candidate_rate||0).toFixed(2)} MAD/h</strong>{h&&<small>{h.hours} h validées {h.validated_at?"✅":"⏳"}</small>}</article>})}</section>{message&&<p>{message}</p>}</main>}
