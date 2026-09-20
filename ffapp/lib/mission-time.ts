/** Shared helpers for mission schedules, including overnight services. */
const MS_PER_HOUR = 3600000;
export const MAX_MISSION_HOURS = 16;

export function buildMissionRange(date: string, start: string, end: string) {
  const startsAt = new Date(date + "T" + start + ":00");
  const endsAt = new Date(date + "T" + end + ":00");
  if (endsAt <= startsAt) endsAt.setDate(endsAt.getDate() + 1);
  return { startsAt, endsAt, hours: (endsAt.getTime() - startsAt.getTime()) / MS_PER_HOUR };
}
export function missionHours(startsAt?: string | null, endsAt?: string | null): number {
  if (!startsAt || !endsAt) return 0;
  const a = new Date(startsAt).getTime(), b = new Date(endsAt).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return 0;
  return (b-a)/MS_PER_HOUR;
}
export function formatHours(hours:number):string {
  if (!hours) return "—"; const h=Math.floor(hours), m=Math.round((hours-h)*60);
  return m ? h+" h "+String(m).padStart(2,"0") : h+" h";
}
const DATE_FMT:Intl.DateTimeFormatOptions={weekday:"short",day:"2-digit",month:"short"};
const TIME_FMT:Intl.DateTimeFormatOptions={hour:"2-digit",minute:"2-digit"};
export function isOvernight(startsAt:string,endsAt:string){return new Date(startsAt).toDateString()!==new Date(endsAt).toDateString();}
export function formatMissionSlot(startsAt?:string|null,endsAt?:string|null):string {
 if(!startsAt||!endsAt)return ""; const a=new Date(startsAt),b=new Date(endsAt);
 return [a.toLocaleDateString("fr-FR",DATE_FMT),a.toLocaleTimeString("fr-FR",TIME_FMT)+" → "+b.toLocaleTimeString("fr-FR",TIME_FMT)+(isOvernight(startsAt,endsAt)?" +1":""),formatHours(missionHours(startsAt,endsAt))].join(" · ");
}