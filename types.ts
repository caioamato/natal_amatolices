export enum ScenarioType {
  FUNNY = 'DIVERTIDA',
  SCARY = 'ASSUSTADORA'
}

export interface GenerationResponse {
  image: string; // Base64
  error?: string;
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
}