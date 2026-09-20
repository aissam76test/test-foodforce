"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

const JOBS: [number,string][] = [[[6,"Assistant maître d'hôtel"],[46,"Bagagiste"],[16,"Barista"],[14,"Barman"],[36,"Boulanger"],[17,"Cafetier"],[47,"Cafetier (hôtel)"],[13,"Chef Barman"],[25,"Chef de cuisine"],[27,"Chef de partie"],[7,"Chef de Rang"],[31,"Chef pâtissier"],[30,"Chocolatier"],[37,"Commis boulanger"],[29,"Commis de cuisine"],[35,"Commis de pâtisserie"],[15,"Commis de salle"],[48,"Concierge"],[38,"Crêpier"],[40,"Cuisinier Collectif"],[28,"Demi-chef de partie"],[2,"Directeur"],[1,"Directeur Food & Beverage"],[41,"Écailler"],[42,"Économe"],[45,"Employé polyvalent cuisine"],[49,"Employé polyvalent d'hôtel"],[22,"Employé polyvalent restauration"],[50,"Esthéticienne"],[51,"Femme / Valet de chambre"],[12,"Garçon de café"],[52,"Gouvernante"],[20,"Hôte / Hôtesse d'accueil"],[19,"Hôte / Hôtesse de caisse"],[11,"Limonadier"],[53,"Linger"],[5,"Maître d'hôtel"],[3,"Manager"],[54,"Manutentionnaire"],[24,"Ménage"],[55,"Night Auditor"],[10,"Officier"],[32,"Pâtissier"],[33,"Pâtissier (nuit)"],[34,"Pâtissier en laboratoire"],[39,"Pizzaiolo"],[43,"Plongeur"],[56,"Premier de réception"],[44,"Préparateur de commandes"],[57,"Réceptionniste"],[4,"Responsable de salle"],[58,"Room service"],[9,"Runner"],[26,"Second de cuisine"],[8,"Serveur"],[18,"Sommelier"],[23,"Vendeur boulangerie"],[21,"Vestiaire"],[59,"Voiturier"]]];
const DAYS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

export default function ProfilExtra() {
  const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [city,setCity]=useState("");
  const [avatarUrl,setAvatarUrl]=useState(""); const [photo,setPhoto]=useState<File|null>(null);
  const [experience,setExperience]=useState("0"); const [bio,setBio]=useState(""); const [languages,setLanguages]=useState("");
  const [skills,setSkills]=useState<number[]>([]); const [availability,setAvailability]=useState<Record<number,{active:boolean;start:string;end:string}>>({});
  const [message,setMessage]=useState("");

  useEffect(()=>{(async()=>{const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){location.href="/connexion";return;}
    const {data:p}=await s.from("profiles").select("full_name,phone,city,avatar_url,role").eq("id",user.id).single();
    if(!p){setMessage("Impossible de charger votre profil.");return;}
    setName(p.full_name||"");setPhone(p.phone||"");setCity(p.city||"");
    if(p.avatar_url)setAvatarUrl(s.storage.from("avatars").getPublicUrl(p.avatar_url).data.publicUrl);
    const {data:ep}=await s.from("extra_profiles").select("experience_years,bio,languages").eq("extra_id",user.id).maybeSingle();
    if(ep){setExperience(String(ep.experience_years||0));setBio(ep.bio||"");setLanguages((ep.languages||[]).join(", "));}
    const {data:sk}=await s.from("extra_skills").select("tariff_id").eq("extra_id",user.id);setSkills((sk||[]).map((x:any)=>Number(x.tariff_id)));
    const {data:av}=await s.from("extra_availability").select("day_of_week,start_time,end_time").eq("extra_id",user.id);
    const next:Record<number,{active:boolean;start:string;end:string}>={};(av||[]).forEach((x:any)=>next[Number(x.day_of_week)]= {active:true,start:x.start_time?.slice(0,5)||"09:00",end:x.end_time?.slice(0,5)||"18:00"});setAvailability(next);
  })()},[]);

  function toggleSkill(id:number){setSkills(x=>x.includes(id)?x.filter(v=>v!==id):[...x,id]);}
  function setDay(day:number,patch:Partial<{active:boolean;start:string;end:string}>){setAvailability(x=>({...x,[day]:{active:x[day]?.active||false,start:x[day]?.start||"09:00",end:x[day]?.end||"18:00",...patch}}));}

  async function save(e:FormEvent){e.preventDefault();setMessage("Enregistrement…");const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){location.href="/connexion";return;}
    let avatarPath="";if(photo){if(photo.size>1024*1024){setMessage("Photo trop lourde : 1 Mo maximum.");return;}if(!["image/jpeg","image/png","image/webp"].includes(photo.type)){setMessage("Format accepté : JPG, PNG ou WebP.");return;}const ext=photo.name.split(".").pop()?.toLowerCase()||"jpg";avatarPath=user.id+"/profile."+ext;const {error}=await s.storage.from("avatars").upload(avatarPath,photo,{contentType:photo.type,upsert:true});if(error){setMessage(error.message);return;}setAvatarUrl(s.storage.from("avatars").getPublicUrl(avatarPath).data.publicUrl);}
    const profileUpdate:any={full_name:name,phone,city};if(avatarPath)profileUpdate.avatar_url=avatarPath;const {error:pErr}=await s.from("profiles").update(profileUpdate).eq("id",user.id);if(pErr){setMessage(pErr.message);return;}
    const {error:eErr}=await s.from("extra_profiles").upsert({extra_id:user.id,experience_years:Number(experience),bio,languages:languages.split(",").map(x=>x.trim()).filter(Boolean),updated_at:new Date().toISOString()});if(eErr){setMessage(eErr.message);return;}
    await s.from("extra_skills").delete().eq("extra_id",user.id);if(skills.length)await s.from("extra_skills").insert(skills.map(id=>({extra_id:user.id,tariff_id:id})));
    await s.from("extra_availability").delete().eq("extra_id",user.id);const rows=Object.entries(availability).filter(([,v])=>v.active).map(([d,v])=>({extra_id:user.id,day_of_week:Number(d),start_time:v.start,end_time:v.end}));if(rows.length)await s.from("extra_availability").insert(rows);
    setMessage("Profil enregistré ✅");
  }

  return <main className="dashboard"><header><Link className="brand" href="/extras">FOOD<span>FORCE</span></Link><nav><Link href="/extras">Missions</Link><Link href="/extras/mes-missions">Mes missions</Link></nav></header>
    <section className="hero profileHero"><p className="eyebrow">FOODFORCE EXTRAS</p><h1>Mon profil</h1><p>Un profil complet pour recevoir les missions qui vous correspondent.</p></section>
    <form className="panel profilePanel" onSubmit={save}>
      <section className="profileSection"><div className="profileTop"><div className="avatarPreview">{avatarUrl?<img src={avatarUrl} alt="Photo de profil"/>:<span>{name?name.charAt(0).toUpperCase():"?"}</span>}</div><div><h2>Votre identité</h2><p>Votre photo aide les établissements à vous reconnaître après sélection.</p><label className="photoLabel">📸 Changer ma photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setPhoto(e.target.files?.[0]||null)}/></label><small>JPG, PNG ou WebP · 1 Mo maximum</small></div></div>
      <div className="profileFields"><label>Nom complet<input value={name} onChange={e=>setName(e.target.value)} required/></label><label>Téléphone<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+212 6 00 00 00 00"/></label><label>Ville<input value={city} onChange={e=>setCity(e.target.value)} required/></label></div></section>
      <section className="profileSection"><div className="sectionTitle"><span>01</span><div><h2>Métiers</h2><p>Choisissez tous les métiers que vous pouvez exercer.</p></div></div><div className="skillGrid">{JOBS.map(([id,label])=><button type="button" key={id} className={skills.includes(id)?"skillChip active":"skillChip"} onClick={()=>toggleSkill(id)}>{skills.includes(id)?"✓ ":""}{label}</button>)}</div></section>
      <section className="profileSection"><div className="sectionTitle"><span>02</span><div><h2>Expérience & présentation</h2><p>Quelques informations pour mieux vous connaître.</p></div></div><div className="profileFields two"><label>Années d'expérience<select value={experience} onChange={e=>setExperience(e.target.value)}>{Array.from({length:21},(_,i)=><option key={i} value={i}>{i===0?"Débutant":i+" an"+(i>1?"s":"")}</option>)}</select></label><label>Langues parlées<input value={languages} onChange={e=>setLanguages(e.target.value)} placeholder="Français, arabe, anglais…"/></label></div><label className="bioLabel">Présentation<textarea value={bio} onChange={e=>setBio(e.target.value)} rows={4} maxLength={500} placeholder="Ex. 5 ans en restauration, service en salle et événementiel…"/></label></section>
      <section className="profileSection"><div className="sectionTitle"><span>03</span><div><h2>Mes disponibilités</h2><p>Indiquez quand vous êtes généralement disponible.</p></div></div><div className="availabilityGrid">{DAYS.map((day,i)=>{const v=availability[i]||{active:false,start:"09:00",end:"18:00"};return <div className={v.active?"dayRow active":"dayRow"} key={day}><label><input type="checkbox" checked={v.active} onChange={e=>setDay(i,{active:e.target.checked})}/><b>{day}</b></label>{v.active&&<><input type="time" value={v.start} onChange={e=>setDay(i,{start:e.target.value})}/><span>à</span><input type="time" value={v.end} onChange={e=>setDay(i,{end:e.target.value})}/></>}</div>})}</div></section>
      <button className="profileSave">Enregistrer mon profil</button>{message&&<p className="statusMessage">{message}</p>}
    </form></main>;
}