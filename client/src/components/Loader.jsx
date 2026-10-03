import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const Loader = ({ message = 'Loading...', size = 'default' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-10 h-10',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4 text-slate-600">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.default} animate-spin text-blue-600`} />
      {message && <span className="text-sm font-medium animate-pulse">{message}</span>}
    </div>
  );
};

export const AIGenerationSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-500/5 p-6 sm:p-8 animate-pulse">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 animate-spin">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="h-4 w-36 bg-slate-200 rounded-md mb-2"></div>
            <div className="h-3 w-48 bg-slate-100 rounded-md"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-slate-100 rounded-lg"></div>
          <div className="h-8 w-20 bg-slate-100 rounded-lg"></div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Subject line skeleton */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="h-3 w-16 bg-slate-200 rounded mb-2"></div>
          <div className="h-5 w-3/4 bg-blue-100 rounded"></div>
        </div>

        {/* Email body paragraphs skeleton */}
        <div className="p-5 bg-slate-50/60 rounded-xl space-y-3">
          <div className="h-4 w-40 bg-slate-200 rounded"></div>
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
          <div className="h-4 w-4/5 bg-slate-200 rounded"></div>
          <div className="h-4 w-1/2 bg-slate-200 rounded pt-3"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-blue-600 font-medium">
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        <span>Synthesizing tone, context and professional phrasing...</span>
      </div>
    </div>
  );
};

export default Loader;
