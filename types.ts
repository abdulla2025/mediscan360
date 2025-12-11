export enum RiskLevel {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'Self' | 'Parent' | 'Child' | 'Spouse' | 'Other';
  color: string;
}

export interface Medication {
  name: string;
  purpose: string;
  sideEffects: string;
  warnings: string;
  rationale?: string; // Why was this likely prescribed?
  alternatives?: string; // Common alternatives
}

export interface RiskScore {
  category: string; // e.g., "Infection Risk", "Cardiovascular Health", "Kidney Function"
  score: number; // 0-100
  status: 'Normal' | 'Elevated' | 'High' | 'Critical';
}

export interface TermDefinition {
  term: string;
  definition: string;
}

export interface AnalysisResponse {
  riskLevel: RiskLevel;
  urgency: string;
  summary: string;
  possibleConditions: string[];
  recommendations: string[];
  doctorSummary: string;
  disclaimer: string;
  // New Fields for Advanced Features
  medications: Medication[];
  interactions: string[]; // Drug-drug or Drug-condition interactions
  riskScores: RiskScore[];
  glossary: TermDefinition[];
  // Emergency Mode
  emergencyInstructions?: string[];
  // New Cards Layout Fields
  labAnalysis?: string; // Specific interpretation of lab values
  labPredictions?: string[]; // Prediction of trends or future risks
  suggestedFollowUpTests?: string[]; // Specific labs to check next
  followUpQuestions?: string[]; // Suggested follow-up questions
}

export interface MediaFile {
  mimeType: string;
  data: string; // Base64 encoded data
  previewUrl?: string; // For UI display
  name: string;
}

export interface ConditionDetails {
  name: string;
  overview: string;
  symptoms: string[];
  causes: string[];
  diagnosis: string;
  treatment: string[];
  prevention: string[];
}

export interface HistoryItem {
  id: string;
  profileId: string; // Link to family member
  date: string;
  preview: string;
  riskLevel: RiskLevel;
  data: AnalysisResponse;
}