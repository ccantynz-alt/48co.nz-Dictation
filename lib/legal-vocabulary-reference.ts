// Legal and accounting vocabulary dictionary
// Part 3: Citations, courts, regulators, statutes, medical-legal

export const LEGAL_CITATIONS: string[] = [
  // Federal reporter series
  'F.2d', 'F.3d', 'F.4th', 'S.Ct.', 'U.S.', 'L.Ed.', 'L.Ed.2d',
  // Regional reporter series
  'A.2d', 'A.3d', 'N.E.2d', 'N.E.3d', 'N.W.2d', 'P.2d', 'P.3d',
  'S.E.2d', 'S.W.2d', 'S.W.3d', 'So.2d', 'So.3d',
  // State-specific reporters
  'Cal.Rptr.', 'Cal.Rptr.2d', 'Cal.Rptr.3d', 'N.Y.S.2d', 'N.Y.S.3d',
  'Ill.Dec.', 'Ohio St.3d', 'Wis.2d',
  // Federal supplements and specialty reporters
  'F.Supp.', 'F.Supp.2d', 'F.Supp.3d', 'F.R.D.',
  'B.R.', 'Bankr.', 'T.C.', 'T.C.M.', 'Tax Ct.',
  'Cl.Ct.', 'Fed.Cl.', 'M.J.', 'Vet.App.',
  // Regulatory and statutory sources
  'Fed.Reg.', 'C.F.R.', 'U.S.C.', 'U.S.C.A.', 'U.S.C.S.',
  'Stat.', 'Pub.L.', 'Priv.L.',
  // Federal rules
  'Fed.R.Civ.P.', 'Fed.R.Crim.P.', 'Fed.R.Evid.',
  'Fed.R.App.P.', 'Fed.R.Bankr.P.',
  // Research and citation tools
  'Westlaw', 'LexisNexis', 'Shepardize', 'Shepardizing',
  'KeyCite', 'Bluebook', 'ALWD', 'ALWD Guide',
  // Citation signals
  'Id.', 'Ibid.', 'Supra', 'Infra', 'Cf.', 'See also', 'But see',
  'Compare', 'Accord', 'Contra', 'E.g.', 'See generally',
  'But cf.', 'See e.g.', 'Cert. denied', 'Cert. granted',
  'Aff\'d', 'Affirmed', 'Rev\'d', 'Reversed', 'Vacated',
  'Remanded', 'Overruled', 'Distinguished', 'Modified',
  // Legal encyclopedias and secondary sources
  'Am.Jur.2d', 'C.J.S.', 'A.L.R.', 'A.L.R.2d', 'A.L.R.3d',
  'A.L.R.4th', 'A.L.R.5th', 'A.L.R.6th', 'A.L.R. Fed.',
  'A.L.R. Fed.2d', 'A.L.R. Fed.3d',
  // Restatements
  'Restatement', 'Restatement Second', 'Restatement Third',
  'Restatement of Contracts', 'Restatement of Torts',
  'Restatement of Agency', 'Restatement of Property',
  'Restatement of Trusts', 'Restatement of Restitution',
  // Attorney General and government opinions
  'Op.Atty.Gen.', 'Op.OLC', 'OLC Memo',
  // Uniform laws
  'U.C.C.', 'U.P.A.', 'U.L.P.A.', 'U.P.C.',
];

export const COURT_NAMES: string[] = [
  // Federal — Supreme Court
  'Supreme Court of the United States', 'SCOTUS',
  'United States Supreme Court',
  // Federal — Circuit Courts of Appeals
  'United States Court of Appeals', 'Circuit Court of Appeals',
  'First Circuit', 'Second Circuit', 'Third Circuit',
  'Fourth Circuit', 'Fifth Circuit', 'Sixth Circuit',
  'Seventh Circuit', 'Eighth Circuit', 'Ninth Circuit',
  'Tenth Circuit', 'Eleventh Circuit', 'D.C. Circuit',
  'Federal Circuit',
  // Federal — Specialty Courts
  'United States District Court', 'United States Bankruptcy Court',
  'United States Tax Court', 'Court of Federal Claims',
  'Court of International Trade', 'Court of Appeals for Veterans Claims',
  'United States Court of Appeals for the Armed Forces',
  'Foreign Intelligence Surveillance Court', 'FISA Court',
  'Judicial Panel on Multidistrict Litigation',
  // State Supreme Courts (all 50 states)
  'Supreme Court of Alabama', 'Supreme Court of Alaska',
  'Supreme Court of Arizona', 'Supreme Court of Arkansas',
  'Supreme Court of California', 'Supreme Court of Colorado',
  'Supreme Court of Connecticut', 'Supreme Court of Delaware',
  'Supreme Court of Florida', 'Supreme Court of Georgia',
  'Supreme Court of Hawaii', 'Supreme Court of Idaho',
  'Supreme Court of Illinois', 'Supreme Court of Indiana',
  'Supreme Court of Iowa', 'Supreme Court of Kansas',
  'Supreme Court of Kentucky', 'Supreme Court of Louisiana',
  'Supreme Court of Maine', 'Court of Appeals of Maryland',
  'Supreme Judicial Court of Massachusetts', 'Supreme Court of Michigan',
  'Supreme Court of Minnesota', 'Supreme Court of Mississippi',
  'Supreme Court of Missouri', 'Supreme Court of Montana',
  'Supreme Court of Nebraska', 'Supreme Court of Nevada',
  'Supreme Court of New Hampshire', 'Supreme Court of New Jersey',
  'Supreme Court of New Mexico', 'Court of Appeals of New York',
  'Supreme Court of North Carolina', 'Supreme Court of North Dakota',
  'Supreme Court of Ohio', 'Supreme Court of Oklahoma',
  'Supreme Court of Oregon', 'Supreme Court of Pennsylvania',
  'Supreme Court of Rhode Island', 'Supreme Court of South Carolina',
  'Supreme Court of South Dakota', 'Supreme Court of Tennessee',
  'Supreme Court of Texas', 'Court of Criminal Appeals of Texas',
  'Supreme Court of Utah', 'Supreme Court of Vermont',
  'Supreme Court of Virginia', 'Supreme Court of Washington',
  'Supreme Court of West Virginia', 'Supreme Court of Wisconsin',
  'Supreme Court of Wyoming',
  // District of Columbia
  'District of Columbia Court of Appeals',
  'Superior Court of the District of Columbia',
  // Administrative and tribunal courts
  'Board of Immigration Appeals', 'Immigration Court',
  'Merit Systems Protection Board', 'Court of Appeals for the Federal Circuit',
  'Armed Services Board of Contract Appeals',
];

export const REGULATORY_BODIES: string[] = [
  // Federal financial regulators
  'Securities and Exchange Commission', 'SEC',
  'Financial Industry Regulatory Authority', 'FINRA',
  'Commodity Futures Trading Commission', 'CFTC',
  'Federal Reserve Board', 'Federal Reserve', 'The Fed',
  'Office of the Comptroller of the Currency', 'OCC',
  'Federal Deposit Insurance Corporation', 'FDIC',
  'Consumer Financial Protection Bureau', 'CFPB',
  'National Credit Union Administration', 'NCUA',
  'Municipal Securities Rulemaking Board', 'MSRB',
  'Public Company Accounting Oversight Board', 'PCAOB',
  // Tax and revenue
  'Internal Revenue Service', 'IRS',
  'Treasury Department', 'Department of the Treasury',
  'Tax Analysts', 'Office of Tax Policy',
  'Alcohol and Tobacco Tax and Trade Bureau', 'TTB',
  // Legal and justice
  'Department of Justice', 'DOJ',
  'Federal Bureau of Investigation', 'FBI',
  'Federal Trade Commission', 'FTC',
  'Bureau of Alcohol Tobacco Firearms and Explosives', 'ATF',
  'Drug Enforcement Administration', 'DEA',
  'United States Marshals Service',
  'Office of Inspector General', 'OIG',
  // Accounting and auditing standards
  'Financial Accounting Standards Board', 'FASB',
  'Government Accountability Office', 'GAO',
  'Governmental Accounting Standards Board', 'GASB',
  'American Institute of Certified Public Accountants', 'AICPA',
  'International Accounting Standards Board', 'IASB',
  'International Auditing and Assurance Standards Board', 'IAASB',
  // Legal profession regulators
  'American Bar Association', 'ABA',
  'State Bar Association', 'State Bar',
  'Office of Disciplinary Counsel',
  'Board of Professional Responsibility',
  // Environmental, health, safety
  'Environmental Protection Agency', 'EPA',
  'Occupational Safety and Health Administration', 'OSHA',
  'Food and Drug Administration', 'FDA',
  'Centers for Medicare and Medicaid Services', 'CMS',
  'Department of Health and Human Services', 'HHS',
  // Labor and employment
  'Department of Labor', 'DOL',
  'Equal Employment Opportunity Commission', 'EEOC',
  'National Labor Relations Board', 'NLRB',
  'Office of Federal Contract Compliance Programs', 'OFCCP',
  // Other federal agencies
  'Federal Communications Commission', 'FCC',
  'Federal Energy Regulatory Commission', 'FERC',
  'Nuclear Regulatory Commission', 'NRC',
  'Department of Homeland Security', 'DHS',
  'United States Patent and Trademark Office', 'USPTO',
  'Copyright Office', 'United States Copyright Office',
  'Office of Foreign Assets Control', 'OFAC',
  'Committee on Foreign Investment in the United States', 'CFIUS',
  'Federal Aviation Administration', 'FAA',
  'National Highway Traffic Safety Administration', 'NHTSA',
  'Small Business Administration', 'SBA',
  'Department of Housing and Urban Development', 'HUD',
];

export const STATUTE_NAMES: string[] = [
  // Major federal statutes — employment and labor
  'Employee Retirement Income Security Act', 'ERISA',
  'Fair Labor Standards Act', 'FLSA',
  'Family and Medical Leave Act', 'FMLA',
  'Americans with Disabilities Act', 'ADA',
  'Age Discrimination in Employment Act', 'ADEA',
  'Title VII of the Civil Rights Act', 'Title VII',
  'Civil Rights Act of 1964', 'Civil Rights Act of 1991',
  'National Labor Relations Act', 'NLRA', 'Wagner Act',
  'Worker Adjustment and Retraining Notification Act', 'WARN Act',
  'Occupational Safety and Health Act', 'OSH Act',
  'Equal Pay Act', 'Pregnancy Discrimination Act',
  'Uniformed Services Employment and Reemployment Rights Act', 'USERRA',
  // Securities and financial regulation
  'Securities Act of 1933', 'Securities Exchange Act of 1934',
  'Sarbanes-Oxley Act', 'SOX', 'Sarbanes-Oxley',
  'Dodd-Frank Wall Street Reform and Consumer Protection Act', 'Dodd-Frank',
  'Investment Company Act of 1940', 'Investment Advisers Act of 1940',
  'Gramm-Leach-Bliley Act', 'GLBA',
  'Bank Secrecy Act', 'BSA',
  'Truth in Lending Act', 'TILA',
  'Fair Credit Reporting Act', 'FCRA',
  'Fair Debt Collection Practices Act', 'FDCPA',
  'Equal Credit Opportunity Act', 'ECOA',
  'Real Estate Settlement Procedures Act', 'RESPA',
  'Home Mortgage Disclosure Act', 'HMDA',
  // Criminal law
  'Racketeer Influenced and Corrupt Organizations Act', 'RICO',
  'Computer Fraud and Abuse Act', 'CFAA',
  'Wire Fraud Statute', 'Mail Fraud Statute',
  'Foreign Corrupt Practices Act', 'FCPA',
  'Hobbs Act', 'Mann Act', 'Espionage Act',
  'Controlled Substances Act', 'CSA',
  // Environmental
  'Comprehensive Environmental Response Compensation and Liability Act', 'CERCLA', 'Superfund',
  'Clean Air Act', 'CAA', 'Clean Water Act', 'CWA',
  'Resource Conservation and Recovery Act', 'RCRA',
  'National Environmental Policy Act', 'NEPA',
  'Toxic Substances Control Act', 'TSCA',
  'Endangered Species Act', 'ESA',
  // Tax
  'Internal Revenue Code', 'IRC', 'Tax Code',
  'Tax Cuts and Jobs Act', 'TCJA',
  'Inflation Reduction Act', 'IRA',
  'Tax Reform Act of 1986',
  'SECURE Act', 'SECURE 2.0 Act',
  'Foreign Account Tax Compliance Act', 'FATCA',
  // Privacy and data
  'Health Insurance Portability and Accountability Act', 'HIPAA',
  'General Data Protection Regulation', 'GDPR',
  'California Consumer Privacy Act', 'CCPA',
  'California Privacy Rights Act', 'CPRA',
  'Children\'s Online Privacy Protection Act', 'COPPA',
  'Electronic Communications Privacy Act', 'ECPA',
  'Stored Communications Act', 'SCA',
  // Intellectual property
  'Lanham Act', 'Patent Act', 'Copyright Act',
  'Digital Millennium Copyright Act', 'DMCA',
  'Defend Trade Secrets Act', 'DTSA',
  // Antitrust
  'Sherman Antitrust Act', 'Sherman Act',
  'Clayton Act', 'Federal Trade Commission Act', 'FTC Act',
  'Robinson-Patman Act', 'Hart-Scott-Rodino Act', 'HSR Act',
  // Bankruptcy
  'Bankruptcy Code', 'Chapter 7', 'Chapter 11', 'Chapter 13',
  'Bankruptcy Abuse Prevention and Consumer Protection Act', 'BAPCPA',
  // Real estate and property
  'Fair Housing Act', 'FHA',
  'Interstate Land Sales Full Disclosure Act',
  'Uniform Commercial Code', 'UCC',
  'Uniform Residential Landlord and Tenant Act',
  // Immigration
  'Immigration and Nationality Act', 'INA',
  // Government and administrative
  'Administrative Procedure Act', 'APA',
  'Freedom of Information Act', 'FOIA',
  'Federal Tort Claims Act', 'FTCA',
  'False Claims Act', 'FCA', 'Qui Tam',
  'Whistleblower Protection Act',
  'Government in the Sunshine Act',
  'Paperwork Reduction Act', 'PRA',
  'Regulatory Flexibility Act',
];

export const MEDICAL_LEGAL_TERMS: string[] = [
  // Personal injury and medical malpractice
  'traumatic brain injury', 'TBI', 'closed head injury',
  'cervical radiculopathy', 'lumbar radiculopathy',
  'herniated disc', 'bulging disc', 'disc protrusion',
  'anterior cervical discectomy and fusion', 'ACDF',
  'laminectomy', 'laminotomy', 'foraminotomy',
  'rotator cuff tear', 'meniscus tear', 'ACL tear',
  'fracture', 'compound fracture', 'comminuted fracture',
  'soft tissue injury', 'contusion', 'laceration', 'abrasion',
  'whiplash', 'cervical strain', 'cervical sprain',
  'post-traumatic stress disorder', 'PTSD',
  'post-concussion syndrome', 'post-concussive syndrome',
  'range of motion', 'ROM', 'functional capacity evaluation', 'FCE',
  'maximum medical improvement', 'MMI',
  'permanent partial disability', 'PPD',
  'permanent total disability', 'PTD',
  'temporary total disability', 'TTD',
  'independent medical examination', 'IME',
  'compulsory medical examination', 'CME',
  'disability rating', 'impairment rating',
  'AMA Guides to the Evaluation of Permanent Impairment',
  // Causation and damages
  'proximate cause', 'but-for causation', 'superseding cause',
  'loss of consortium', 'hedonic damages', 'pain and suffering',
  'future medical expenses', 'life care plan',
  'wrongful death', 'survival action',
  'diminished earning capacity', 'lost wages',
  'pre-existing condition', 'aggravation of pre-existing condition',
  'eggshell plaintiff', 'thin skull rule',
  // Medical procedures and terminology
  'MRI', 'CT scan', 'X-ray', 'EMG', 'nerve conduction study',
  'arthroscopy', 'arthroplasty', 'osteotomy',
  'epidural steroid injection', 'nerve block',
  'physical therapy', 'occupational therapy', 'rehabilitation',
  'orthopedic', 'neurological', 'neurosurgical',
  'prognosis', 'diagnosis', 'differential diagnosis',
  'reasonable degree of medical certainty',
  'reasonable degree of medical probability',
  'standard of care', 'deviation from standard of care',
  'informed consent', 'lack of informed consent',
  // Toxicology and pharmaceutical
  'pharmacokinetics', 'pharmacodynamics', 'half-life',
  'blood alcohol concentration', 'BAC',
  'toxicology report', 'toxicology screen',
  'adverse drug reaction', 'contraindication',
  'black box warning', 'FDA approval',
  // Forensic
  'forensic pathology', 'autopsy', 'post-mortem',
  'cause of death', 'manner of death', 'time of death',
  'forensic toxicology', 'chain of custody',
  'medical examiner', 'coroner',
];
