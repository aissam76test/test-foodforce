/** Billing display helpers. */
export const PAYMENT_STATUS:Record<string,string>={pending:"En attente",paid:"Payé",failed:"Échec",cancelled:"Annulé"};
export function paymentStatusLabel(status:string){return PAYMENT_STATUS[status]||status;}
export function sumBy<T>(rows:T[],pick:(row:T)=>number){return rows.reduce((total,row)=>total+(Number(pick(row))||0),0);}
export function formatMad(amount:number){return new Intl.NumberFormat("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2}).format(amount)+" MAD";}
