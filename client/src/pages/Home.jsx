import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Mail, 
  Send, 
  CheckCircle, 
  FileText, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Copy, 
  FolderArchive,
  Star
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const sampleTypes = [
    { name: 'Leave Request', desc: 'Formal time-off, medical leave, or personal emergencies', tone: 'Formal' },
    { name: 'Job/Internship', desc: 'Application cover letters, inquiry, and recruiter follow-ups', tone: 'Professional' },
    { name: 'Permission Request', desc: 'Seeking approval for seminars, projects, or lab access', tone: 'Polite' },
    { name: 'Complaint', desc: 'Official grievances, service dissatisfaction, or issue escalations', tone: 'Formal' },
    { name: 'Thank You', desc: 'Expressing genuine gratitude to mentors, colleagues, or interviewers', tone: 'Friendly' },
    { name: 'General Request', desc: 'Inquiries, documentation requests, and scheduling questions', tone: 'Professional' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-blue-100/50 via-indigo-50/30 to-transparent pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI-Powered Smart Email Generator for Students & Professionals</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Write Impeccable, Professional Emails{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Eliminate email anxiety and formatting confusion. Describe your purpose in plain words, choose your desired tone and email category, and let Google Gemini AI draft structured, grammatically flawless emails ready to copy, regenerate, or save.
          </p>

          {/* CTA Buttons (SRS 3.1.1) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to={isAuthenticated ? "/generate" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Email</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={isAuthenticated ? "/my-emails" : "/login"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-700 font-semibold text-base border border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all"
            >
              {isAuthenticated ? (
                <>
                  <FolderArchive className="w-5 h-5 text-indigo-600" />
                  <span>View My Saved Emails</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>Get Started Free</span>
                </>
              )}
            </Link>
          </div>

          {/* Trust and Feature Micro-Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 font-medium pt-4 border-t border-slate-200/60 max-w-2xl mx-auto">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Zero-cost Free Tier</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Subject, Greeting & Sign-off</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>100% Private & User Scoped</span>
            </div>
          </div>

        </div>
      </section>

      {/* How The System Works (SRS 3.1.1) */}
      <section className="py-16 bg-white border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              Workflow Overview
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How PathPilot Works in 3 Simple Steps
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              From a rough one-sentence thought to an elegant, ready-to-dispatch email draft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-lg mb-5 shadow-sm">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Enter Email Purpose
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Describe the occasion in plain everyday language. For instance: <em>"Need leave for 2 days due to fever and flu symptoms."</em>
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-lg mb-5 shadow-sm">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Select Type & Tone
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose from 6 email categories (Leave, Job, Permission, etc.) and tune the voice with 4 tones (Formal, Professional, Friendly, Polite).
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-lg mb-5 shadow-sm">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Generate, Copy & Save
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive a complete subject line and email body. Copy to clipboard in one click, regenerate alternative phrasing, or save to your account.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Supported Email Categories (SRS Section 3.2.3) */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              Comprehensive Coverage
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Built for Every Everyday Scenario
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Tailored dynamic prompt engineering for each specific category.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleTypes.map((item, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    {item.tone}
                  </span>
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  {item.name}
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  {item.desc}
                </p>
                <Link
                  to="/generate"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
                >
                  <span>Draft this email</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Viva / Project Reference Footer */}
      <section className="py-12 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-white font-bold text-base mb-1">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>PathPilot - AI-Powered Smart Email Generator</span>
            </div>
            <p className="text-xs text-slate-400">
              Developed as per Software Requirements Specification (SRS) v1.0
            </p>
          </div>

          <div className="text-center sm:text-right text-xs space-y-1">
            <p className="text-slate-300 font-medium">Prepared by: <span className="text-white font-semibold">K. Naga Lakshmi</span></p>
            <p className="text-slate-400">Roll No: <span className="text-white font-mono font-semibold">24B61A0575</span></p>
            <p className="text-slate-500">MERN Stack Architecture • Gemini AI</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
