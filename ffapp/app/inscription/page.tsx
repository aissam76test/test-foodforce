"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function Inscription(){
 const [role,setRole]=useState<"extra"|"pro">("extra");const [name,setName]=useState("");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [city,setCity]=useState("");const [message,setMessage]=useState("");
 async function signup(e:FormEvent){e.preventDefault();setMessage("Création du compte…");const s=createClient();const {data,error}=await s.auth.signUp({email,password});if(error){setMessage(error.message);return;}if(data.user){const {error:pError}=await s.from("profiles").insert({id:data.user.id,role,full_name:name,city});if(pError){setMessage(pError.message);return;}}setMessage("Compte créé. Vérifiez votre email si une confirmation est demandée.");}
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span></div><nav><Link href="/">Accueil</Link><Link href="/connexion">Connexion</Link></nav></header><section className="hero"><p className="eyebrow">FOODFORCE</p><h1>Créer un compte</h1><p>Choisissez votre espace.</p></section><form className="panel" onSubmit={signup}><label>Je suis<select value={role} onChange={e=>setRole(e.target.value as "extra"|"pro")}><option value="extra">Extra</option><option value="pro">Établissement / Pro</option></select></label><label>Nom / établissement<input value={name} onChange={e=>setName(e.target.value)} required/></label><label>Ville<input value={city} onChange={e=>setCity(e.target.value)} required/></label><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Mot de passe<input type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required/></label><button type="submit">Créer mon compte</button>{message&&<p>{message}</p>}</form></main>}
