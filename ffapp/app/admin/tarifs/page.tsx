"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Tariff={id:number;job:string;avg_rate:number;candidate_rate:number;employer_ht:number;vat:number;employer_ttc:number;active:boolean};
export default function Tarifs(){
 const [items,setItems]=useState<Tariff[]>([]);const [message,setMessage]=useState("Chargement…");
 useEffect(()=>{(async()=>{const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){location.href="/connexion";return;}const {data:p}=await s.from("profiles").select("role").eq("id",user.id).single();if(p?.role!=="admin"){location.href="/";return;}const {data,error}=await s.from("tariff_grid").select("id,job,avg_rate,candidate_rate,employer_ht,vat,employer_ttc,active").order("job");if(error)setMessage(error.message);else{setItems(data||[]);setMessage("");}})()},[]);
 return <main className="appShell"><header className="appHeader"><Link className="brand" href="/">FOOD<span>FORCE</span></Link><div className="appName">ADMIN</div><nav><Link href="/admin">Dashboard</Link></nav></header><section className="pageIntro"><span className="eyebrow">GRILLE OFFICIELLE</span><h1>Tarifs FoodForce.</h1><p>59 métiers · lecture seule · tarifs verrouillés côté serveur.</p></section><section className="panel">{items.map(t=><div className="row" key={t.id}><span><b>{t.job}</b><small style={{display:"block",color:"#7a848b"}}>Base {Number(t.avg_rate).toFixed(2)} · Extra {Number(t.candidate_rate).toFixed(2)}</small></span><b>{Number(t.employer_ttc).toFixed(2)} MAD/h TTC</b></div>)}</section>{message&&<p className="statusMessage">{message}</p>}</main>}
