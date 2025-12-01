import { GoogleGenAI } from "@google/genai";
import { ModelMetrics, SimulationConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSimulationResults = async (
  config: SimulationConfig,
  standard: ModelMetrics,
  stacking: ModelMetrics
): Promise<string> => {
  const prompt = `
    Act as a senior Data Scientist. Compare the results of two ensemble learning models I just ran a simulation for.
    
    Configuration:
    - Number of Base Estimators: ${config.nEstimators}
    - Noise Level: ${config.noiseLevel} (0-1 scale)
    - Dataset Size: ${config.datasetSize}

    Results:
    1. Standard Ensemble (Voting Classifier):
       - Accuracy: ${(standard.accuracy * 100).toFixed(2)}%
       - F1 Score: ${(standard.f1Score * 100).toFixed(2)}%
       
    2. Stacking Ensemble (Meta-learner):
       - Accuracy: ${(stacking.accuracy * 100).toFixed(2)}%
       - F1 Score: ${(stacking.f1Score * 100).toFixed(2)}%

    Task:
    Explain strictly in 3 short paragraphs:
    1. A brief comparison of the performance metrics.
    2. Why Stacking likely performed better (or worse/similar) in this specific noise/complexity context. Mention how the meta-learner learns to correct the biases of base learners.
    3. A practical recommendation on when to use Stacking over simple Voting/Bagging based on these results.

    Format as Markdown. Keep it professional but accessible.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching Gemini analysis:", error);
    return "Unable to generate AI analysis at this time. Please check your API key.";
  }
};