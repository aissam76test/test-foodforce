"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function Connexion(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [message,setMessage]=useState("");
 async function login(e:React.FormEvent){e.preventDefault();setMessage("Connexion…");const s=createClient();const {data,error}=await s.auth.signInWithPassword({email,password});if(error){setMessage(error.message);return;}const {data:p}=await s.from("profiles").select("role").eq("id",data.user.id).single();window.location.href=p?.role==="pro"?"/pro":p?.role==="extra"?"/extras":"/";}
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span></div><nav><Link href="/">Accueil</Link></nav></header><section className="hero"><p className="eyebrow">FOODFORCE</p><h1>Connexion</h1><p>Accédez à votre espace Extra ou Pro.</p></section><form className="panel" onSubmit={login}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Mot de passe<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button type="submit">Se connecter</button>{message&&<p>{message}</p>}</form></main>}
