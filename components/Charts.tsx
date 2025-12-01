import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { SimulationResult } from '../types';

interface ChartsProps {
  results: SimulationResult;
}

export const PerformanceBarChart: React.FC<ChartsProps> = ({ results }) => {
  const data = [
    {
      name: 'Accuracy',
      Standard: (results.standard.accuracy * 100).toFixed(1),
      Stacking: (results.stacking.accuracy * 100).toFixed(1),
    },
    {
      name: 'F1 Score',
      Standard: (results.standard.f1Score * 100).toFixed(1),
      Stacking: (results.stacking.f1Score * 100).toFixed(1),
    },
    {
      name: 'Precision',
      Standard: (results.standard.precision * 100).toFixed(1),
      Stacking: (results.stacking.precision * 100).toFixed(1),
    },
    {
      name: 'Recall',
      Standard: (results.standard.recall * 100).toFixed(1),
      Stacking: (results.stacking.recall * 100).toFixed(1),
    },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" domain={[60, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
            cursor={{fill: '#334155', opacity: 0.4}}
          />
          <Legend />
          <Bar dataKey="Standard" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Standard (Voting)" />
          <Bar dataKey="Stacking" fill="#10b981" radius={[4, 4, 0, 0]} name="Stacking (Meta)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ConvergenceLineChart: React.FC<ChartsProps> = ({ results }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={results.history}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="epoch" stroke="#94a3b8" label={{ value: 'Training Epochs', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
          <YAxis stroke="#94a3b8" label={{ value: 'Loss', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
          <Legend verticalAlign="top" height={36}/>
          <Line type="monotone" dataKey="standardLoss" stroke="#3b82f6" strokeWidth={2} name="Standard Loss" dot={false} />
          <Line type="monotone" dataKey="stackingLoss" stroke="#10b981" strokeWidth={2} name="Stacking Loss" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MetricRadarChart: React.FC<ChartsProps> = ({ results }) => {
    const data = [
      { subject: 'Accuracy', A: results.standard.accuracy * 100, B: results.stacking.accuracy * 100, fullMark: 100 },
      { subject: 'Precision', A: results.standard.precision * 100, B: results.stacking.precision * 100, fullMark: 100 },
      { subject: 'Recall', A: results.standard.recall * 100, B: results.stacking.recall * 100, fullMark: 100 },
      { subject: 'F1', A: results.standard.f1Score * 100, B: results.stacking.f1Score * 100, fullMark: 100 },
      { subject: 'AUC', A: results.standard.auc * 100, B: results.stacking.auc * 100, fullMark: 100 },
    ];
  
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
            <Radar
              name="Standard"
              dataKey="A"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="#3b82f6"
              fillOpacity={0.3}
            />
            <Radar
              name="Stacking"
              dataKey="B"
              stroke="#10b981"
              strokeWidth={2}
              fill="#10b981"
              fillOpacity={0.3}
            />
            <Legend />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };