"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

type Job = { id:number; job:string };

const CITIES = ["Casablanca","Rabat","Marrakech","Agadir","Tanger","Fès","Autre"];

export default function Inscription() {
  const [role,setRole]=useState<"extra"|"pro">("extra");
  const [name,setName]=useState(""); const [photo,setPhoto]=useState<File|null>(null);
  const [phone,setPhone]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [city,setCity]=useState("Casablanca"); const [jobId,setJobId]=useState("");
  const [autoNumber,setAutoNumber]=useState(""); const [experience,setExperience]=useState(""); const [experienceYears,setExperienceYears]=useState("0");
  const [jobs,setJobs]=useState<Job[]>([]); const [message,setMessage]=useState("");

  useEffect(()=>{(async()=>{const s=createClient();const {data}=await s.from("tariff_grid").select("id,job").eq("active",true).order("job");setJobs((data||[]) as Job[]);})()},[]);

  async function signup(e:FormEvent){
    e.preventDefault();
    if(role==="extra" && !jobId){setMessage("Choisissez votre métier principal.");return;}
    if(password.length<8){setMessage("Le mot de passe doit contenir au moins 8 caractères.");return;}
    setMessage("Création du compte…");
    const s=createClient();
    const {data,error}=await s.auth.signUp({email,password,options:{data:{
      role,full_name:name,city,phone,primary_job_id:role==="extra"?Number(jobId):null,
      auto_entrepreneur_number:role==="extra"?autoNumber:null,experience:role==="extra"?experience:null,experience_years:role==="extra"?Number(experienceYears):0
    }}});

    if(error){setMessage(error.message);return;}

    // The database trigger creates profiles/extra_profiles/extra_skills from
    // auth metadata. This also works when email confirmation is enabled and
    // Supabase returns a user without a session.
    if(role==="extra" && data.user && data.session && photo){
      const ext=photo.name.split(".").pop()?.toLowerCase()||"jpg";
      const path=data.user.id+"/profile."+ext;
      const {error:uploadError}=await s.storage.from("avatars").upload(path,photo,{contentType:photo.type,upsert:true});
      if(!uploadError) await s.from("profiles").update({avatar_url:path}).eq("id",data.user.id);
    }

    if(data.user && !data.session){
      setMessage("Compte créé. Vérifiez votre email pour activer votre compte. Vos informations Extra sont déjà enregistrées.");
    } else {
      setMessage("Compte créé. Votre profil est enregistré.");
    }
  }

  return <main className="signupPage">
    <div className="signupShell">
      <header className="signupHeader"><Link className="brand" href="/">FOOD<span>FORCE</span></Link><nav><Link href="/">Accueil</Link><Link href="/connexion">Connexion</Link></nav></header>
      <section className="signupHero"><span className="eyebrow">FOODFORCE EXTRAS</span><h1>Les bonnes missions,<br/><span>au bon moment.</span></h1><p>Créez votre profil en quelques minutes et recevez des missions adaptées à vos métiers et disponibilités.</p></section>
      <div className="signupTabs"><button type="button" className={role==="extra"?"selected":""} onClick={()=>setRole("extra")}>Je suis un Extra</button><button type="button" className={role==="pro"?"selected":""} onClick={()=>setRole("pro")}>Je suis un établissement</button></div>
      <form className="signupForm" onSubmit={signup}>
        <div className="formSection"><div className="formSectionTitle"><span>01</span><div><h2>Votre identité</h2><p>Les informations de base de votre profil.</p></div></div>
          <div className="signupGrid"><label>Prénom et nom<input value={name} onChange={e=>setName(e.target.value)} required placeholder="Ex. Yassine El Amrani"/></label><label>Téléphone<input value={phone} onChange={e=>setPhone(e.target.value)} required placeholder="+212 6 12 34 56 78"/></label><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="vous@email.com"/></label><label>Ville<select value={city} onChange={e=>setCity(e.target.value)}>{CITIES.map(x=><option key={x}>{x}</option>)}</select></label></div>
        </div>
        {role==="extra"&&<><div className="formSection"><div className="formSectionTitle"><span>02</span><div><h2>Votre métier</h2><p>Choisissez votre métier principal dans la grille FoodForce.</p></div></div><label>Métier principal<select value={jobId} onChange={e=>setJobId(e.target.value)} required><option value="">Choisir dans la grille FoodForce</option>{jobs.map(j=><option key={j.id} value={j.id}>{j.job}</option>)}</select></label></div>
        <div className="formSection"><div className="formSectionTitle"><span>03</span><div><h2>Votre expérience</h2><p>Quelques lignes suffisent pour présenter votre parcours.</p></div></div><label>Années d'expérience<select value={experienceYears} onChange={e=>setExperienceYears(e.target.value)}>{Array.from({length:21},(_,i)=><option key={i} value={i}>{i===0?"Débutant":i+" an"+(i>1?"s":"")}</option>)}</select></label><label>Présentation / expérience<textarea value={experience} onChange={e=>setExperience(e.target.value)} rows={4} maxLength={500} placeholder="Ex. 5 ans en restauration, service en salle et événementiel. Français, arabe et anglais."/></label><label>Numéro d'auto-entrepreneur <small>(facultatif)</small><input value={autoNumber} onChange={e=>setAutoNumber(e.target.value)} placeholder="Ex. AE-2026-000000"/></label></div>
        <div className="formSection"><div className="formSectionTitle"><span>04</span><div><h2>Votre photo</h2><p>Une photo claire et professionnelle inspire confiance.</p></div></div><label className="photoUpload">📸 Ajouter ma photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setPhoto(e.target.files?.[0]||null)}/><small>JPG, PNG ou WebP · 1 Mo maximum</small></label></div></>}
        <div className="formSection"><div className="formSectionTitle"><span>{role==="extra"?"05":"02"}</span><div><h2>Sécurisez votre compte</h2><p>Utilisez au moins 8 caractères.</p></div></div><label>Mot de passe<input type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"/></label></div>
        <button className="signupSubmit">{role==="extra"?"Créer mon compte Extra":"Créer mon compte Pro"}</button>
        {message&&<p className="statusMessage">{message}</p>}
      </form>
      <footer className="signupFooter"><span>FOODFORCE</span><span>59 métiers · Tarifs centralisés · Missions anonymisées</span></footer>
    </div>
  </main>;
}