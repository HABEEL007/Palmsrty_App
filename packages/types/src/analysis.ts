/**
 * @file analysis.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Detailed AI analysis interfaces for palm readings.
 */

export enum HandShape {
  EARTH = 'earth',
  AIR = 'air',
  FIRE = 'fire',
  WATER = 'water',
}

export interface MajorLines {
  lifeLine: string;
  heartLine: string;
  headLine: string;
  fateLine: string | null;
}

export interface Mounts {
  jupiter: string;
  saturn: string;
  apollo: string;
  mercury: string;
  venus: string;
  mars: string;
  luna: string;
}

export interface PersonalityProfile {
  traits: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface CareerProfile {
  suitability: string;
  potentialPaths: string[];
  advice: string;
}

export interface RelationshipProfile {
  compatibility: string;
  approach: string;
  advice: string;
}

export interface HealthProfile {
  vitality: string;
  concerns: string | null;
  advice: string;
}

/**
 * Full palm analysis result.
 */
export interface PalmAnalysisResult {
  handShape: HandShape;
  majorLines: MajorLines;
  mounts: Mounts;
  personality: PersonalityProfile;
  career: CareerProfile;
  relationships: RelationshipProfile;
  health: HealthProfile;
  advice: string;
}
