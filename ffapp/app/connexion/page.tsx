"use client";
import { FormEvent,useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function Connexion(){
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [message,setMessage]=useState("");
 async function login(e:FormEvent){e.preventDefault();setMessage("Connexion…");const s=createClient();const {data,error}=await s.auth.signInWithPassword({email,password});if(error){setMessage("Email ou mot de passe incorrect.");return;}const {data:p}=await s.from("profiles").select("role").eq("id",data.user.id).single();window.location.href=p?.role==="pro"?"/pro":p?.role==="extra"?"/extras":"/admin";}
 return <main className="appShell"><header className="appHeader"><Link className="brand" href="/">FOOD<span>FORCE</span></Link><div className="appName">ACCÈS</div><nav><Link href="/">Accueil</Link><Link href="/inscription">Créer un compte</Link></nav></header><section className="pageIntro"><span className="eyebrow">FOODFORCE</span><h1>Bienvenue.</h1><p>Connectez-vous à votre espace Extra ou Pro.</p></section><form className="panel formPanel" onSubmit={login}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Mot de passe<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button>Se connecter</button>{message&&<p className="statusMessage">{message}</p>}</form></main>}