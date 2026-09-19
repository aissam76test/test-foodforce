"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

export default function ProfilExtra(){
 const [name,setName]=useState("");const [phone,setPhone]=useState("");const [city,setCity]=useState("");const [message,setMessage]=useState("");
 useEffect(()=>{(async()=>{const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){location.href="/connexion";return;}const {data}=await s.from("profiles").select("full_name,phone,city,role").eq("id",user.id).single();if(data?.role!=="extra"){location.href="/";return;}setName(data.full_name||"");setPhone(data.phone||"");setCity(data.city||"");})()},[]);
 async function save(e:React.FormEvent){e.preventDefault();const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user)return;const {error}=await s.from("profiles").update({full_name:name,phone,city}).eq("id",user.id);setMessage(error?error.message:"Profil enregistré ✅");}
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span></div><nav><Link href="/extras">Missions</Link></nav></header><section className="hero"><p className="eyebrow">FOODFORCE EXTRAS</p><h1>Mon profil</h1><p>Gardez vos informations à jour.</p></section><form className="panel" onSubmit={save}><label>Nom complet<input value={name} onChange={e=>setName(e.target.value)} required/></label><label>Téléphone<input value={phone} onChange={e=>setPhone(e.target.value)}/></label><label>Ville<input value={city} onChange={e=>setCity(e.target.value)} required/></label><button>Enregistrer</button>{message&&<p>{message}</p>}</form></main>}
