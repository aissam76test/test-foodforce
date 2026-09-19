export type FoodForceTariff = {
  job: string;
  avgRate: number;
  candidateRate: number;
  employerHt: number;
  vat: number;
  employerTtc: number;
};

export const CANDIDATE_MULTIPLIER = 1.45;
export const FOODFORCE_COMMISSION = 0.25;
export const VAT_RATE = 0.20;

/** Server-side calculation rule. Never trust prices sent by a Pro browser. */
export function calculateTariff(avgRate: number) {
  const candidateRate = avgRate * CANDIDATE_MULTIPLIER;
  const employerHt = candidateRate * (1 + FOODFORCE_COMMISSION);
  const vat = employerHt * VAT_RATE;
  const employerTtc = employerHt + vat;
  return { avgRate, candidateRate, employerHt, vat, employerTtc };
}

export function assertOfficialTariff(
  official: FoodForceTariff,
  requestedCandidateRate?: number,
  requestedEmployerTtc?: number,
) {
  if (requestedCandidateRate !== undefined && Math.abs(requestedCandidateRate - official.candidateRate) > 0.000001) throw new Error("OFFICIAL_TARIFF_MISMATCH");
  if (requestedEmployerTtc !== undefined && Math.abs(requestedEmployerTtc - official.employerTtc) > 0.000001) throw new Error("OFFICIAL_TARIFF_MISMATCH");
  return official;
}