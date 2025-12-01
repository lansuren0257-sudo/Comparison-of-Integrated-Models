export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
}

export interface SimulationConfig {
  nEstimators: number;
  noiseLevel: number;
  cvFolds: number;
  datasetSize: number;
}

export interface SimulationResult {
  standard: ModelMetrics;
  stacking: ModelMetrics;
  history: {
    epoch: number;
    standardLoss: number;
    stackingLoss: number;
  }[];
}

export enum AlgorithmType {
  STANDARD = 'Standard Ensemble (Voting)',
  STACKING = 'Stacking Ensemble'
}