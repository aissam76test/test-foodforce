"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Payment={id:string;mission_id:string;hours:number;candidate_hourly_rate:number;extra_amount:number;status:string;paid_at:string|null;created_at:string};
export default function Paiements(){
 const [items,setItems]=useState<Payment[]>([]);const [message,setMessage]=useState("Chargement…");
 useEffect(()=>{(async()=>{const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){location.href="/connexion";return;}const {data,error}=await s.from("payment_records").select("id,mission_id,hours,candidate_hourly_rate,extra_amount,status,paid_at,created_at").eq("extra_id",user.id).order("created_at",{ascending:false});if(error)setMessage("Aucun paiement disponible pour le moment.");else{setItems(data||[]);setMessage("");}})()},[]);
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span></div><nav><Link href="/extras">Missions</Link><Link href="/extras/profil">Profil</Link></nav></header><section className="hero"><p className="eyebrow">FOODFORCE EXTRAS</p><h1>Mes paiements</h1><p>Retrouvez les montants générés après validation de vos heures.</p></section><section className="grid">{items.map(p=><article className="mission" key={p.id}><span className="tag">{p.status}</span><h2>{Number(p.extra_amount).toFixed(2)} MAD</h2><p>{p.hours} h × {Number(p.candidate_hourly_rate).toFixed(2)} MAD/h</p><small>{p.paid_at?"Payé le "+new Date(p.paid_at).toLocaleDateString("fr-FR"):"En attente de paiement"}</small></article>)}</section>{message&&<p>{message}</p>}</main>}
