"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type N={id:string;title:string;body:string|null;read_at:string|null;created_at:string};
export default function Notifications(){
 const [items,setItems]=useState<N[]>([]);
 useEffect(()=>{(async()=>{const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){location.href="/connexion";return;}const {data}=await s.from("notifications").select("id,title,body,read_at,created_at").eq("user_id",user.id).order("created_at",{ascending:false});setItems(data||[]);})()},[]);
 async function read(id:string){const s=createClient();await s.from("notifications").update({read_at:new Date().toISOString()}).eq("id",id);setItems(items.map(n=>n.id===id?{...n,read_at:new Date().toISOString()}:n));}
 return <main className="dashboard"><header><div className="brand">FOOD<span>FORCE</span></div><nav><Link href="/extras">Missions</Link><Link href="/extras/profil">Profil</Link></nav></header><section className="hero"><p className="eyebrow">FOODFORCE EXTRAS</p><h1>Notifications</h1><p>Suivez les changements sur vos candidatures.</p></section><section className="grid">{items.map(n=><article className="mission" key={n.id}><span className="tag">{n.read_at?"Lue":"Nouvelle"}</span><h2>{n.title}</h2><p>{n.body}</p><small>{new Date(n.created_at).toLocaleString("fr-FR")}</small>{!n.read_at&&<button onClick={()=>read(n.id)}>Marquer comme lue</button>}</article>)}</section></main>}
