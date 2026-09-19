"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

export default function ProfilPro(){
 const [name,setName]=useState("");const [phone,setPhone]=useState("");const [city,setCity]=useState("");const [email,setEmail]=useState("");const [message,setMessage]=useState("");
 useEffect(()=>{(async()=>{const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){location.href="/connexion";return;}setEmail(user.email||"");const {data}=await s.from("profiles").select("full_name,phone,city,role").eq("id",user.id).single();if(data?.role!=="pro"){location.href="/";return;}setName(data.full_name||"");setPhone(data.phone||"");setCity(data.city||"");})()},[]);
 async function save(e:React.FormEvent){e.preventDefault();const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user)return;const {error}=await s.from("profiles").update({full_name:name,phone,city}).eq("id",user.id);setMessage(error?error.message:"Profil enregistré ✅");}
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span> PRO</div><nav><Link href="/pro">Retour</Link></nav></header><section className="hero"><p className="eyebrow">MON PROFIL</p><h1>Profil établissement</h1><p>{email}</p></section><form className="panel" onSubmit={save}><label>Nom / établissement<input value={name} onChange={e=>setName(e.target.value)} required/></label><label>Téléphone<input value={phone} onChange={e=>setPhone(e.target.value)}/></label><label>Ville<input value={city} onChange={e=>setCity(e.target.value)} required/></label><button>Enregistrer</button>{message&&<p>{message}</p>}</form></main>}
