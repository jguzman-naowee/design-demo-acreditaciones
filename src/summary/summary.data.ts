// Datos de la planilla de seguimiento (nov-2026). Solo se digitan las cuatro columnas
// de origen: pendientes y totales se calculan, para que no se desincronicen como en la hoja.
export interface SportProgress {
  sport: string;
  quota: number | null;
  generated: number;
  toFix: number;
  printed: number;
}

export const SPORTS: SportProgress[] = [
  { sport: 'Para atletismo', quota: 166, generated: 124, toFix: 31, printed: 115 },
  { sport: 'Para natación', quota: 110, generated: 85, toFix: 11, printed: 83 },
  { sport: 'Bádminton', quota: 65, generated: 50, toFix: 20, printed: 39 },
  { sport: 'Baloncesto 3x3', quota: 171, generated: 133, toFix: 3, printed: 122 },
  { sport: 'Fútbol Prejuvenil', quota: null, generated: 223, toFix: 17, printed: 131 },
  { sport: 'Taekwondo', quota: 257, generated: 190, toFix: 41, printed: 178 },
  { sport: 'Baloncesto Juvenil', quota: null, generated: 157, toFix: 0, printed: 167 },
  { sport: 'Balonmano Juvenil', quota: null, generated: 161, toFix: 0, printed: 145 }
];

export interface SportRow extends SportProgress {
  toPrint: number;
  progress: number;
  overPrinted: boolean;
}

export function toRow(s: SportProgress): SportRow {
  return {
    ...s,
    // Más impresas que generadas es un error del dato, no un pendiente negativo.
    toPrint: Math.max(0, s.generated - s.printed),
    progress: s.generated ? Math.min(100, (s.printed / s.generated) * 100) : 0,
    overPrinted: s.printed > s.generated
  };
}

export function totals(rows: SportRow[]) {
  const sum = (k: 'generated' | 'toFix' | 'printed' | 'toPrint') =>
    rows.reduce((a, r) => a + r[k], 0);
  const withQuota = rows.filter((r) => r.quota !== null);
  const generated = sum('generated');
  const printed = sum('printed');
  return {
    quota: withQuota.reduce((a, r) => a + (r.quota ?? 0), 0),
    sportsWithQuota: withQuota.length,
    generated,
    toFix: sum('toFix'),
    printed,
    toPrint: sum('toPrint'),
    total: generated + sum('toFix'),
    progress: generated ? Math.min(100, (printed / generated) * 100) : 0
  };
}

// Roles por deporte en JIN: deportista + personal de apoyo de catalog-ms (ENT, DAS, ADI).
// Misión y Naowee se acreditan por evento, no por deporte, así que no entran acá.
export const ROLES = [
  { code: 'ATHLETE', label: 'Deportista' },
  { code: 'ENT', label: 'Docente/Entrenador' },
  { code: 'DAS', label: 'Docente/Asistente' },
  { code: 'ADI', label: 'Auxiliar Discapacidad' }
] as const;

export type RoleCode = (typeof ROLES)[number]['code'];

// Reparto ilustrativo: la planilla no trae el desglose por rol. ADI solo existe en para deportes.
const SHARES: Record<'para' | 'regular', Record<RoleCode, number>> = {
  para: { ATHLETE: 0.76, ENT: 0.1, DAS: 0.06, ADI: 0.08 },
  regular: { ATHLETE: 0.86, ENT: 0.09, DAS: 0.05, ADI: 0 }
};

// Largest remainder: las partes suman exactamente el total y ninguna pasa su tope proporcional.
function split(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, w) => a + w, 0);
  if (!sum) return weights.map(() => 0);
  const raw = weights.map((w) => (total * w) / sum);
  const out = raw.map(Math.floor);
  const order = raw.map((v, i) => [v - out[i], i] as const).sort((a, b) => b[0] - a[0]);
  const left = total - out.reduce((a, v) => a + v, 0);
  for (let k = 0; k < left; k++) out[order[k][1]]++;
  return out;
}

export function byRole(role: RoleCode | 'all'): SportProgress[] {
  if (role === 'all') return SPORTS;
  const idx = ROLES.findIndex((r) => r.code === role);
  return SPORTS.map((s) => {
    const shares = ROLES.map((r) => SHARES[s.sport.startsWith('Para ') ? 'para' : 'regular'][r.code]);
    const generated = split(s.generated, shares);
    // Las impresas se reparten como las generadas para no inventar sobreimpresiones por redondeo.
    const printed = split(s.printed, generated);
    return {
      sport: s.sport,
      quota: s.quota === null ? null : split(s.quota, shares)[idx],
      generated: generated[idx],
      toFix: split(s.toFix, shares)[idx],
      printed: printed[idx]
    };
  }).filter((s) => s.generated + s.toFix + s.printed > 0);
}
