import React, { useState } from 'react';
import { Play, CheckCircle2, Loader2, Sparkles, X, ShieldAlert, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../services/api';

interface DemoPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PIPELINE_STEPS = [
  'Connecting to national MPLADS MongoDB database...',
  'Ingesting 5,200 verified developmental work records...',
  'Normalizing fiscal year expenditures & district boundaries...',
  'Generating multi-dimensional feature risk vectors...',
  'Running Isolation Forest ensemble outlier detection...',
  'Executing Local Outlier Factor (LOF) peer density model...',
  'Computing TF-IDF cosine similarity matrix for duplicate scopes...',
  'Calculating vendor concentration & district monopoly ratios...',
  'Analyzing geographic GPS proximity cluster anomalies...',
  'Evaluating temporal March fiscal-year-end sanction rushes...',
  'Synthesizing multi-variate risk scores (0-100) & confidence...',
  'Generating explainable audit evidence dossiers...',
  'Populating prioritized investigation case queue...',
  'Finalizing intelligence platform telemetry.',
];

export const DemoPipelineModal: React.FC<DemoPipelineModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const startDemoPipeline = async () => {
    setIsRunning(true);
    setIsCompleted(false);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < PIPELINE_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 400);

    try {
      await api.post('/demo/launch');
      clearInterval(interval);
      setCurrentStep(PIPELINE_STEPS.length - 1);
      setIsCompleted(true);
      setIsRunning(false);

      // Trigger vibrant celebratory confetti
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#9333EA', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'],
      });

      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err) {
      console.error('Demo launch error:', err);
      clearInterval(interval);
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  const progressPercent = Math.round(((currentStep + 1) / PIPELINE_STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#131823] border border-indigo-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-pink-50/50 dark:from-[#1A202A] dark:to-[#151A22] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-glow-purple">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Autonomous AI Pipeline</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">5,200 Projects Ensemble Detection</p>
            </div>
          </div>
          {!isRunning && (
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="bg-indigo-50/70 dark:bg-indigo-950/30 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
            <span className="leading-relaxed font-sans">
              Executes full data ingestion, Isolation Forest, LOF, TF-IDF cosine similarity, contractor network graph, and statutory audit cases generation across 5,200 works in real time.
            </span>
          </div>

          {/* Progress Bar */}
          {isRunning && (
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                <span>Execution Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 shadow-glow-purple"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Steps Timeline */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 font-mono scrollbar-thin">
            {PIPELINE_STEPS.map((step, idx) => {
              const isDone = isCompleted || (isRunning && idx < currentStep);
              const isCurrent = isRunning && idx === currentStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all ${
                    isCurrent
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 font-bold'
                      : isDone
                      ? 'text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-[#151A22]'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                  )}
                  <span className="truncate">{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0D1016]/50 flex items-center justify-end gap-3">
          {!isRunning && !isCompleted && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={startDemoPipeline}
                className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl shadow-glow-purple flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run AI Intelligence Pipeline
              </button>
            </>
          )}
          {isRunning && (
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Executing Autonomous Detection Engine...</span>
            </div>
          )}
          {isCompleted && (
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-glow-emerald transition-all cursor-pointer"
            >
              View Updated Intelligence Briefing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
