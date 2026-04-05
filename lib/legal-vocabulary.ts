import { LATIN_LEGAL_PHRASES, COURT_LITIGATION_TERMS, CONTRACT_LAW_TERMS, CORPORATE_LAW_TERMS, CRIMINAL_LAW_TERMS, PROPERTY_REAL_ESTATE_TERMS } from './legal-vocabulary-data';
import { TAX_IRC_TERMS, GAAP_IFRS_TERMS, AUDITING_TERMS, FINANCIAL_TERMS } from './legal-vocabulary-finance';
import { LEGAL_CITATIONS, COURT_NAMES, REGULATORY_BODIES, STATUTE_NAMES, MEDICAL_LEGAL_TERMS } from './legal-vocabulary-reference';

export const LEGAL_VOCABULARY_BY_CATEGORY = {
  latinPhrases: LATIN_LEGAL_PHRASES,
  courtLitigation: COURT_LITIGATION_TERMS,
  contractLaw: CONTRACT_LAW_TERMS,
  corporateLaw: CORPORATE_LAW_TERMS,
  criminalLaw: CRIMINAL_LAW_TERMS,
  propertyRealEstate: PROPERTY_REAL_ESTATE_TERMS,
  taxIRC: TAX_IRC_TERMS,
  gaapIfrs: GAAP_IFRS_TERMS,
  auditing: AUDITING_TERMS,
  financial: FINANCIAL_TERMS,
  citations: LEGAL_CITATIONS,
  courtNames: COURT_NAMES,
  regulatoryBodies: REGULATORY_BODIES,
  statutes: STATUTE_NAMES,
  medicalLegal: MEDICAL_LEGAL_TERMS,
};

export const LEGAL_VOCABULARY: string[] = Object.values(LEGAL_VOCABULARY_BY_CATEGORY).flat();

export function getVocabularyForMode(mode: string): string[] {
  const common = [...LATIN_LEGAL_PHRASES.slice(0, 30), ...COURT_LITIGATION_TERMS.slice(0, 30)];

  switch (mode) {
    case 'legal-letter':
    case 'demand-letter':
      return [...common, ...CONTRACT_LAW_TERMS, ...STATUTE_NAMES, ...LEGAL_CITATIONS.slice(0, 30)];
    case 'legal-memo':
      return [...common, ...CONTRACT_LAW_TERMS, ...LEGAL_CITATIONS, ...COURT_NAMES, ...STATUTE_NAMES];
    case 'court-filing':
      return [...common, ...COURT_LITIGATION_TERMS, ...LEGAL_CITATIONS, ...COURT_NAMES, ...STATUTE_NAMES, ...CRIMINAL_LAW_TERMS];
    case 'deposition-summary':
      return [...common, ...COURT_LITIGATION_TERMS, ...MEDICAL_LEGAL_TERMS];
    case 'engagement-letter':
      return [...common, ...CONTRACT_LAW_TERMS, ...CORPORATE_LAW_TERMS, ...REGULATORY_BODIES];
    case 'tax-advisory':
      return [...TAX_IRC_TERMS, ...FINANCIAL_TERMS, ...GAAP_IFRS_TERMS.slice(0, 30), ...REGULATORY_BODIES, ...STATUTE_NAMES];
    case 'audit-opinion':
      return [...AUDITING_TERMS, ...GAAP_IFRS_TERMS, ...FINANCIAL_TERMS, ...REGULATORY_BODIES];
    case 'accounting-report':
      return [...GAAP_IFRS_TERMS, ...FINANCIAL_TERMS, ...AUDITING_TERMS.slice(0, 30), ...TAX_IRC_TERMS.slice(0, 30)];
    case 'client-email':
    case 'meeting-notes':
    case 'general':
    default:
      return [...common.slice(0, 20), ...FINANCIAL_TERMS.slice(0, 20)];
  }
}

export { LATIN_LEGAL_PHRASES, COURT_LITIGATION_TERMS, CONTRACT_LAW_TERMS, CORPORATE_LAW_TERMS, CRIMINAL_LAW_TERMS, PROPERTY_REAL_ESTATE_TERMS } from './legal-vocabulary-data';
export { TAX_IRC_TERMS, GAAP_IFRS_TERMS, AUDITING_TERMS, FINANCIAL_TERMS } from './legal-vocabulary-finance';
export { LEGAL_CITATIONS, COURT_NAMES, REGULATORY_BODIES, STATUTE_NAMES, MEDICAL_LEGAL_TERMS } from './legal-vocabulary-reference';
