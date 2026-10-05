/**
 * Standardized Blood Sugar Normalizer
 * In the mobile app, users log in mmol/L (< 35) or mg/dL (>= 35).
 * 1 mmol/L = 18.018 mg/dL.
 */
export function normalizeBloodSugar(value: number, unit?: string | null): {
  isMmol: boolean;
  raw: number;
  valMgDl: number;
  valMmol: number;
  display: string;
  shortDisplay: string;
  category: 'Normal' | 'Pre-diabetic' | 'High' | 'Critical';
} {
  const numVal = Number(value) || 0;
  const isMmol = unit === 'mmol/L' || (unit == null && numVal > 0 && numVal < 35.0);
  const valMgDl = isMmol ? Math.round(numVal * 18.018) : Math.round(numVal);
  const valMmol = isMmol ? Number(numVal.toFixed(1)) : Number((numVal / 18.018).toFixed(1));

  let category: 'Normal' | 'Pre-diabetic' | 'High' | 'Critical' = 'Normal';
  if (valMgDl < 70 || valMgDl >= 250) {
    category = 'Critical';
  } else if (valMgDl >= 180) {
    category = 'High';
  } else if (valMgDl >= 100) {
    category = 'Pre-diabetic';
  } else {
    category = 'Normal';
  }

  const display = isMmol
    ? `${valMmol} mmol/L (${valMgDl} mg/dL)`
    : `${valMgDl} mg/dL (${valMmol} mmol/L)`;

  const shortDisplay = isMmol ? `${valMmol} mmol/L` : `${valMgDl} mg/dL`;

  return { isMmol, raw: numVal, valMgDl, valMmol, display, shortDisplay, category };
}
