import React, { useState } from 'react';
import api from '../services/api';
import { generateEmailAI } from '../services/aiService';
import { AIGenerationSkeleton } from '../components/Loader';
import Toast from '../components/Toast';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Bookmark, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  FileText, 
  HelpCircle,
  Lightbulb,
  CornerDownRight,
  Layers,
  CheckCircle2
} from 'lucide-react';

const EMAIL_TYPES = [
  'Leave Request',
  'Permission Request',
  'Complaint',
  'Job/Internship',
  'Thank You',
  'General Request',
];

const TONES = ['Formal', 'Professional', 'Friendly', 'Polite'];

const SAMPLE_PROMPTS = [
  {
    label: 'Medical Leave',
    type: 'Leave Request',
    tone: 'Formal',
    text: 'Requesting 3 days of medical leave from upcoming Monday to Wednesday due to viral fever and doctor-advised rest.',
  },
  {
    label: 'Job Follow-up',
    type: 'Job/Internship',
    tone: 'Professional',
    text: 'Follow-up regarding the interview for the Frontend Developer role conducted last Thursday, expressing enthusiasm.',
  },
  {
    label: 'Lab Permission',
    type: 'Permission Request',
    tone: 'Polite',
    text: 'Seeking permission from HOD to access the Advanced AI Computing Lab after college hours for final year capstone project.',
  },
  {
    label: 'Service Complaint',
    type: 'Complaint',
    tone: 'Formal',
    text: 'Defective monitor delivered in order #84920, screen has horizontal glitch lines, requesting replacement.',
  },
];

const EmailGenerator = () => {
  const [purpose, setPurpose] = useState('');
  const [emailType, setEmailType] = useState('Leave Request');
  const [tone, setTone] = useState('Professional');
  
  // Generation & Result State (FR-4 & FR-5)
  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Messages & Toast
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    // Validation as per FR-3.5
    if (!purpose.trim()) {
      setErrorMessage('Please describe the purpose or details of your email.');
      return;
    }

    setGenerating(true);
    setIsSaved(false); // Reset saved status for new generation (FR-5.3)

    try {
      // First attempt backend API request
      const response = await api.post('/email/generate', {
        purpose: purpose.trim(),
        emailType,
        tone,
      });

      if (response.data?.data) {
        setGeneratedResult(response.data.data);
      }
    } catch (err) {
      console.warn('[Generation] Backend API unavailable or failed, utilizing resilient mock engine:', err.message);
      // Fallback to client-side rule-based mock engine (resilience safeguard)
      try {
        const mockResult = await generateEmailAI({
          purpose: purpose.trim(),
          emailType,
          tone,
        });
        setGeneratedResult({
          purpose: purpose.trim(),
          emailType,
          tone,
          subject: mockResult.subject,
          generatedContent: mockResult.generatedContent,
        });
      } catch (fallbackError) {
        setErrorMessage('Unable to generate the email right now. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
    showToast('Regenerating new draft version...', 'info');
  };

  const handleCopy = async () => {
    if (!generatedResult) return;

    const fullEmailText = `Subject: ${generatedResult.subject}\n\n${generatedResult.generatedContent}`;
    try {
      await navigator.clipboard.writeText(fullEmailText);
      setCopied(true);
      showToast('Complete email copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleSave = async () => {
    if (!generatedResult || isSaved) return;

    setSaving(true);
    try {
      const response = await api.post('/emails', {
        purpose: generatedResult.purpose || purpose,
        emailType: generatedResult.emailType || emailType,
        tone: generatedResult.tone || tone,
        subject: generatedResult.subject,
        generatedContent: generatedResult.generatedContent,
      });

      if (response.data?.success) {
        setIsSaved(true);
        showToast('Email saved to your personal history!');
      }
    } catch (err) {
      if (err.message.includes('already saved')) {
        setIsSaved(true);
        showToast('This email is already in your history.', 'info');
      } else {
        showToast(err.message || 'Could not save email.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const loadSample = (sample) => {
    setPurpose(sample.text);
    setEmailType(sample.type);
    setTone(sample.tone);
    setErrorMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Interactive AI Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Smart Email Generator
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Specify your purpose, select the email category and writing tone, and produce a polished draft.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form (FR-3) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
          
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Configure Email Details</span>
            <span className="text-xs font-normal text-slate-400">Step 1 of 2</span>
          </h2>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-5">
            
            {/* Email Type Dropdown (FR-3.2) */}
            <div>
              <label 
                htmlFor="emailTypeSelect" 
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                Email Type / Category
              </label>
              <select
                id="emailTypeSelect"
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {EMAIL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Tone Selector Dropdown (FR-3.3) */}
            <div>
              <label 
                htmlFor="toneSelect" 
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                Writing Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      tone === t
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Purpose Large Text Box (FR-3.1) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label 
                  htmlFor="purposeInput" 
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Email Purpose / Key Points
                </label>
                <span className="text-[11px] text-slate-400">
                  {purpose.length} characters
                </span>
              </div>
              <textarea
                id="purposeInput"
                rows={5}
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="E.g. Requesting permission to organize an intra-college web development hackathon on October 15th with 50 students participating..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all leading-relaxed"
              />
            </div>

            {/* Prompt Helper Chips */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Prompt Presets:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PROMPTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadSample(sample)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200/80 transition-colors"
                  >
                    + {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prominent Generate Button (FR-3.4) */}
            <div className="pt-2">
              <button
                type="submit"
                id="generateEmailBtn"
                disabled={generating}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{generating ? 'Synthesizing with Gemini...' : 'Generate Email'}</span>
              </button>
            </div>

          </form>

        </div>

        {/* Right Column: Generated Email Card & Actions (FR-5) */}
        <div className="lg:col-span-7">
          
          {generating ? (
            <AIGenerationSkeleton />
          ) : generatedResult ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/50 p-6 sm:p-8 transition-all">
              
              {/* Card Header & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      Generated Email Draft
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-blue-600">{generatedResult.emailType}</span>
                      <span>•</span>
                      <span className="text-slate-600 font-medium">{generatedResult.tone} Tone</span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                {isSaved ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saved in History
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                    Unsaved Draft
                  </span>
                )}
              </div>

              {/* Subject Line (FR-4.3, FR-5.1) */}
              <div className="mb-5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Subject Line
                </label>
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100/80 text-blue-950 font-semibold text-sm flex items-center justify-between">
                  <span>{generatedResult.subject}</span>
                </div>
              </div>

              {/* Email Content Body (FR-4.3, FR-5.1) */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Body (Salutation, Details, Closing)
                </label>
                <div className="p-5 bg-slate-50/70 rounded-xl border border-slate-200/70 text-slate-800 text-sm whitespace-pre-line leading-relaxed font-normal min-h-[220px]">
                  {generatedResult.generatedContent}
                </div>
              </div>

              {/* Action Buttons: Copy, Regenerate, Save (FR-5.2, FR-5.3, FR-5.4, FR-5.5) */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                {/* Copy Button (FR-5.2) */}
                <button
                  onClick={handleCopy}
                  id="copyEmailBtn"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                {/* Regenerate Button (FR-5.3) */}
                <button
                  onClick={handleRegenerate}
                  id="regenerateEmailBtn"
                  disabled={generating}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-sm"
                >
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                  <span>Regenerate</span>
                </button>

                {/* Save Button (FR-5.4, FR-5.5) */}
                <button
                  onClick={handleSave}
                  id="saveEmailBtn"
                  disabled={isSaved || saving}
                  className={`flex-1 sm:flex-none sm:ml-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                    isSaved
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{isSaved ? 'Saved to History' : saving ? 'Saving...' : 'Save Email'}</span>
                </button>
              </div>

            </div>
          ) : (
            /* Empty Placeholder / Ready State */
            <div className="h-full min-h-[420px] rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Your AI Draft Will Appear Here
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-6">
                Fill in your email purpose on the left and click <strong>Generate Email</strong>. Gemini AI will compose the subject and body instantly.
              </p>
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>• One-Click Copy</span>
                <span>• Automatic Formatting</span>
                <span>• History Storage</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default EmailGenerator;
