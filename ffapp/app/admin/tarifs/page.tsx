"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Tariff={id:number;job:string;avg_rate:number;candidate_rate:number;employer_ht:number;vat:number;employer_ttc:number;active:boolean};
export default function Tarifs(){
 const [items,setItems]=useState<Tariff[]>([]);const [message,setMessage]=useState("Chargement…");
 useEffect(()=>{(async()=>{const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){location.href="/connexion";return;}const {data:p}=await s.from("profiles").select("role").eq("id",user.id).single();if(p?.role!=="admin"){location.href="/";return;}const {data,error}=await s.from("tariff_grid").select("id,job,avg_rate,candidate_rate,employer_ht,vat,employer_ttc,active").order("job");if(error)setMessage(error.message);else{setItems(data||[]);setMessage("");}})()},[]);
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span> ADMIN</div><nav><Link href="/admin">Dashboard</Link></nav></header><section className="hero"><p className="eyebrow">GRILLE OFFICIELLE</p><h1>Tarifs FoodForce</h1><p>Lecture seule. Les établissements ne peuvent pas modifier les tarifs.</p></section><section className="panel">{items.map(t=><div className="row" key={t.id}><span>{t.job}</span><b>{Number(t.candidate_rate).toFixed(2)} MAD/h → {Number(t.employer_ttc).toFixed(2)} MAD/h TTC</b></div>)}</section>{message&&<p>{message}</p>}</main>}
