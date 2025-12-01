import React, { useState, useEffect } from 'react';
import { SimulationConfig, SimulationResult, ModelMetrics } from './types';
import { Controls } from './components/Controls';
import { PerformanceBarChart, ConvergenceLineChart, MetricRadarChart } from './components/Charts';
import { AnalysisPanel } from './components/AnalysisPanel';
import { analyzeSimulationResults } from './services/geminiService';
import { Layers, Activity, BrainCircuit } from 'lucide-react';

const INITIAL_CONFIG: SimulationConfig = {
  nEstimators: 10,
  noiseLevel: 0.2,
  cvFolds: 5,
  datasetSize: 1000
};

// Heuristic function to simulate results based on config
// In a real app, this would be backend Python code
const simulateMetrics = (config: SimulationConfig): SimulationResult => {
  const baseNoise = config.noiseLevel;
  const complexityBenefit = Math.log(config.nEstimators) * 0.01;
  const dataBenefit = Math.log(config.datasetSize) * 0.02;

  // Standard Ensemble (e.g. Voting) struggles more with noise
  const standardAcc = 0.75 - (baseNoise * 0.3) + complexityBenefit + dataBenefit;
  
  // Stacking (Meta-learner) adapts better to noise, but might overfit if data is low
  // We simulate Stacking usually winning, especially at higher noise or complexity
  const stackingBonus = 0.03 + (baseNoise * 0.15); // Stacking handles noise better
  const stackingAcc = standardAcc + stackingBonus;

  // Clamp values
  const clamp = (num: number) => Math.min(Math.max(num, 0.5), 0.99);
  
  const standard: ModelMetrics = {
    accuracy: clamp(standardAcc),
    precision: clamp(standardAcc - 0.02),
    recall: clamp(standardAcc + 0.01),
    f1Score: clamp(standardAcc - 0.005),
    auc: clamp(standardAcc + 0.03),
  };

  const stacking: ModelMetrics = {
    accuracy: clamp(stackingAcc),
    precision: clamp(stackingAcc - 0.01),
    recall: clamp(stackingAcc + 0.015),
    f1Score: clamp(stackingAcc + 0.002),
    auc: clamp(stackingAcc + 0.04),
  };

  // Generate dummy training history
  const history = Array.from({ length: 20 }, (_, i) => {
    const progress = (i + 1) / 20;
    return {
      epoch: i + 1,
      standardLoss: 0.8 * Math.exp(-2 * progress) + (Math.random() * 0.05),
      stackingLoss: 0.85 * Math.exp(-2.5 * progress) + (Math.random() * 0.03), // Converges faster/lower
    };
  });

  return { standard, stacking, history };
};

const App: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>(INITIAL_CONFIG);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runSimulation = async () => {
    setIsSimulating(true);
    setAnalysis(null);
    
    // Simulate training delay
    setTimeout(async () => {
      const newResults = simulateMetrics(config);
      setResults(newResults);
      setIsSimulating(false);
      
      // Trigger AI Analysis
      setIsAnalyzing(true);
      const aiResponse = await analyzeSimulationResults(config, newResults.standard, newResults.stacking);
      setAnalysis(aiResponse);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark text-slate-200 p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
            <Layers className="text-blue-500" />
            Ensemble Stacking Visualizer
          </h1>
          <p className="text-slate-400 mt-2">
            Compare Standard Ensemble (Voting) vs. Stacking Architectures
          </p>
        </div>
        <div className="hidden md:flex gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-blue-500 rounded-full"></div> Standard
          </div>
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Stacking
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Controls */}
        <div className="lg:col-span-3">
          <Controls 
            config={config} 
            setConfig={setConfig} 
            onRun={runSimulation} 
            isSimulating={isSimulating}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Top Row: Metrics Overview */}
          {results && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded-xl border border-slate-700 shadow-sm">
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Std Accuracy</p>
                <p className="text-2xl font-bold text-blue-400">{(results.standard.accuracy * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-card p-4 rounded-xl border border-slate-700 shadow-sm">
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Stack Accuracy</p>
                <p className="text-2xl font-bold text-emerald-400">{(results.stacking.accuracy * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-card p-4 rounded-xl border border-slate-700 shadow-sm">
                 <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Improvement</p>
                 <p className="text-2xl font-bold text-white">
                   + {((results.stacking.accuracy - results.standard.accuracy) * 100).toFixed(1)}%
                 </p>
              </div>
              <div className="bg-card p-4 rounded-xl border border-slate-700 shadow-sm">
                 <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Samples</p>
                 <p className="text-2xl font-bold text-slate-300">{config.datasetSize}</p>
              </div>
            </div>
          )}

          {/* Middle Row: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card p-5 rounded-xl border border-slate-700 shadow-lg min-h-[350px]">
              <div className="flex items-center gap-2 mb-6">
                <Activity size={20} className="text-slate-400" />
                <h3 className="font-bold text-slate-200">Comparative Performance</h3>
              </div>
              {results ? (
                <PerformanceBarChart results={results} />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-600 border border-dashed border-slate-700 rounded-lg">
                  Waiting for simulation...
                </div>
              )}
            </div>

            <div className="bg-card p-5 rounded-xl border border-slate-700 shadow-lg min-h-[350px]">
               <div className="flex items-center gap-2 mb-6">
                <BrainCircuit size={20} className="text-slate-400" />
                <h3 className="font-bold text-slate-200">Model Convergence (Loss)</h3>
              </div>
              {results ? (
                <ConvergenceLineChart results={results} />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-600 border border-dashed border-slate-700 rounded-lg">
                  Waiting for simulation...
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Radar & Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-card p-5 rounded-xl border border-slate-700 shadow-lg">
               <div className="flex items-center gap-2 mb-6">
                <h3 className="font-bold text-slate-200">Metric Balance (Radar)</h3>
              </div>
              {results ? (
                 <MetricRadarChart results={results} />
              ) : (
                 <div className="h-64 flex items-center justify-center text-slate-600 border border-dashed border-slate-700 rounded-lg">
                  Waiting for simulation...
                </div>
              )}
             </div>

             <div className="h-full">
               <AnalysisPanel analysis={analysis} isLoading={isAnalyzing} />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;