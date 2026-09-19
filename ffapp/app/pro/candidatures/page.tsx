"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Application={id:string;status:string;created_at:string;extra_id:string;mission_id:string;missions:{id:string;city:string;starts_at:string;tariff_grid:{job:string}|null}|null};

export default function Candidatures(){
 const [apps,setApps]=useState<Application[]>([]);
 const [message,setMessage]=useState("Chargement…");
 async function load(){const s=createClient();const {data,error}=await s.from("applications").select("id,status,created_at,extra_id,mission_id,missions(id,city,starts_at,tariff_grid(job))").order("created_at",{ascending:false});if(error)setMessage("Connexion Supabase à configurer.");else{setApps((data||[]) as unknown as Application[]);setMessage("");}}
 useEffect(()=>{load()},[]);
 async function decide(id:string,status:"accepted"|"rejected"){const s=createClient();const {error}=await s.from("applications").update({status}).eq("id",id);if(error)setMessage("Erreur : "+error.message);else{setMessage(status==="accepted"?"Extra accepté ✅":"Candidature refusée");load();}}
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span> PRO</div><nav><Link href="/pro">Retour</Link></nav></header><section className="hero"><p className="eyebrow">FOODFORCE PRO</p><h1>Candidatures</h1><p>Gérez les extras qui postulent à vos missions.</p></section><section className="grid">{apps.map(a=><article className="mission" key={a.id}><span className="tag">{a.status}</span><h2>{a.missions?.tariff_grid?.job||"Mission"}</h2><p>{a.missions?.city} · {a.missions?.starts_at ? new Date(a.missions.starts_at).toLocaleString("fr-FR"):""}</p><p>Extra : {a.extra_id}</p>{a.status==="pending"&&<div className="two"><button onClick={()=>decide(a.id,"accepted")}>Accepter</button><button onClick={()=>decide(a.id,"rejected")}>Refuser</button></div>}</article>)}</section>{message&&<p>{message}</p>}</main>}
