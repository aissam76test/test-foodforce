"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Payment={id:string;mission_id:string;extra_id:string;hours:number;employer_hourly_ttc:number;employer_amount_ttc:number;status:string;provider:string|null;provider_reference:string|null;created_at:string};
export default function PaiementsPro(){
 const [items,setItems]=useState<Payment[]>([]);const [message,setMessage]=useState("Chargement…");
 async function load(){const s=createClient();const {data,error}=await s.from("payment_records").select("id,mission_id,extra_id,hours,employer_hourly_ttc,employer_amount_ttc,status,provider,provider_reference,created_at").order("created_at",{ascending:false});if(error)setMessage("Connexion Supabase à configurer.");else{setItems(data||[]);setMessage("");}}
 useEffect(()=>{load()},[]);
 async function create(id:string){const s=createClient();const {error}=await s.rpc("create_payment_record",{p_worked_hours_id:id});setMessage(error?"Erreur : "+error.message:"Paiement préparé avec le montant officiel.");if(!error)load();}
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span> PRO</div><nav><Link href="/pro">Retour</Link></nav></header><section className="hero"><p className="eyebrow">FOODFORCE PRO</p><h1>Paiements</h1><p>Montants calculés automatiquement à partir des heures validées.</p></section><section className="grid">{items.map(p=><article className="mission" key={p.id}><span className="tag">{p.status}</span><h2>{Number(p.employer_amount_ttc).toFixed(2)} MAD TTC</h2><p>{p.hours} h × {Number(p.employer_hourly_ttc).toFixed(2)} MAD/h</p><small>Extra : {p.extra_id}</small></article>)}</section>{message&&<p>{message}</p>}</main>}
