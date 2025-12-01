import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: string | null;
  isLoading: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isLoading }) => {
  if (!analysis && !isLoading) {
    return (
      <div className="bg-card rounded-xl border border-slate-700 p-8 flex flex-col items-center justify-center text-slate-500 h-full min-h-[300px]">
        <Bot size={48} className="mb-4 opacity-50" />
        <p className="text-center">Run the simulation to generate an AI comparison analysis.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-slate-700 p-6 h-full min-h-[300px] flex flex-col shadow-lg relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-4">
        <Sparkles className="text-purple-400" size={24} />
        <h3 className="text-xl font-bold text-white">Gemini Insight</h3>
      </div>
      
      {isLoading ? (
        <div className="flex-grow flex flex-col items-center justify-center space-y-4 animate-pulse">
           <div className="h-4 bg-slate-700 rounded w-3/4"></div>
           <div className="h-4 bg-slate-700 rounded w-5/6"></div>
           <div className="h-4 bg-slate-700 rounded w-2/3"></div>
           <p className="text-purple-400 text-sm mt-4">Analyzing performance metrics...</p>
        </div>
      ) : (
        <div className="prose prose-invert prose-sm max-w-none overflow-y-auto pr-2 custom-scrollbar">
          {analysis?.split('\n').map((line, i) => {
             if (line.startsWith('###')) return <h3 key={i} className="text-lg font-bold text-purple-300 mt-4 mb-2">{line.replace('###', '')}</h3>;
             if (line.startsWith('**')) return <p key={i} className="font-bold text-slate-200 mb-2">{line.replace(/\*\*/g, '')}</p>;
             if (line.startsWith('-')) return <li key={i} className="ml-4 text-slate-300 mb-1">{line.replace('-', '')}</li>;
             return <p key={i} className="text-slate-300 mb-2 leading-relaxed">{line}</p>;
          })}
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
    </div>
  );
};