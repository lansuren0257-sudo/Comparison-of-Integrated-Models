import React from 'react';
import { SimulationConfig } from '../types';
import { Settings, Play, RefreshCw } from 'lucide-react';

interface ControlsProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
  onRun: () => void;
  isSimulating: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ config, setConfig, onRun, isSimulating }) => {
  const handleChange = (key: keyof SimulationConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-card p-6 rounded-xl border border-slate-700 h-full flex flex-col shadow-lg">
      <div className="flex items-center gap-2 mb-6 text-primary">
        <Settings size={24} />
        <h2 className="text-xl font-bold text-white">Model Config</h2>
      </div>

      <div className="space-y-6 flex-grow">
        
        {/* Dataset Size */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Dataset Size: {config.datasetSize} samples
          </label>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={config.datasetSize}
            onChange={(e) => handleChange('datasetSize', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
            disabled={isSimulating}
          />
        </div>

        {/* Number of Estimators */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Base Estimators: {config.nEstimators}
          </label>
          <input
            type="range"
            min="3"
            max="50"
            step="1"
            value={config.nEstimators}
            onChange={(e) => handleChange('nEstimators', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
            disabled={isSimulating}
          />
          <p className="text-xs text-slate-500 mt-1">
            Number of weak learners (e.g., Decision Trees) in the first layer.
          </p>
        </div>

        {/* Noise Level */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Dataset Noise: {config.noiseLevel.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.noiseLevel}
            onChange={(e) => handleChange('noiseLevel', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
            disabled={isSimulating}
          />
          <p className="text-xs text-slate-500 mt-1">
            Higher noise makes the problem harder, often benefitting Stacking's robustness.
          </p>
        </div>

        {/* CV Folds */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Cross-Validation Folds: {config.cvFolds}
          </label>
          <div className="flex gap-2">
            {[3, 5, 10].map(fold => (
              <button
                key={fold}
                onClick={() => handleChange('cvFolds', fold)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  config.cvFolds === fold
                    ? 'bg-primary text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                disabled={isSimulating}
              >
                {fold}-Fold
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onRun}
        disabled={isSimulating}
        className={`mt-8 w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold transition-all shadow-lg ${
          isSimulating
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transform hover:scale-[1.02]'
        }`}
      >
        {isSimulating ? (
          <>
            <RefreshCw className="animate-spin" size={20} />
            Training...
          </>
        ) : (
          <>
            <Play size={20} />
            Run Comparisons
          </>
        )}
      </button>
    </div>
  );
};