"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function Admin(){
 const [stats,setStats]=useState({profiles:0,missions:0,applications:0,tariffs:0});const [message,setMessage]=useState("Chargement…");
 useEffect(()=>{(async()=>{const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){location.href="/connexion";return;}const {data:p}=await s.from("profiles").select("role").eq("id",user.id).single();if(p?.role!=="admin"){location.href="/";return;}const [a,b,c,d]=await Promise.all([s.from("profiles").select("*",{count:"exact",head:true}),s.from("missions").select("*",{count:"exact",head:true}),s.from("applications").select("*",{count:"exact",head:true}),s.from("tariff_grid").select("*",{count:"exact",head:true})]);setStats({profiles:a.count||0,missions:b.count||0,applications:c.count||0,tariffs:d.count||0});setMessage("");})()},[]);
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span> ADMIN</div><nav><Link href="/">Accueil</Link><Link href="/admin/tarifs">Grille tarifaire</Link></nav></header><section className="hero"><p className="eyebrow">ADMIN</p><h1>Pilotage FoodForce</h1><p>Vue de contrôle de la plateforme.</p></section><section className="grid"><article className="mission"><h2>{stats.profiles}</h2><p>Profils</p></article><article className="mission"><h2>{stats.missions}</h2><p>Missions</p></article><article className="mission"><h2>{stats.applications}</h2><p>Candidatures</p></article><article className="mission"><h2>{stats.tariffs}</h2><p>Métiers tarifés</p></article></section>{message&&<p>{message}</p>}<footer>🔒 Accès réservé aux comptes administrateur.</footer></main>}
