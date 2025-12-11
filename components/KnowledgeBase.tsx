import React, { useState } from 'react';
import { fetchConditionDetails } from '../services/geminiService';
import { ConditionDetails } from '../types';
import { 
  Search, 
  BookOpen, 
  Activity, 
  AlertCircle, 
  Stethoscope, 
  Pill, 
  ShieldCheck, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

const COMMON_CONDITIONS = [
  "Common Cold", "Influenza (Flu)", "Migraine", "Hypertension", 
  "Type 2 Diabetes", "Asthma", "Gastroenteritis", "Anxiety Disorder"
];

const KnowledgeBase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [details, setDetails] = useState<ConditionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setDetails(null);

    try {
      const data = await fetchConditionDetails(term);
      setDetails(data);
    } catch (err: any) {
      setError("Could not retrieve information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  const clearSearch = () => {
    setDetails(null);
    setSearchTerm('');
    setError(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {!details ? (
        <>
          {/* Search Hero */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <BookOpen size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Health Knowledge Base</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Search for any medical condition to get comprehensive, AI-curated information on symptoms, treatments, and prevention.
            </p>
            
            <div className="relative max-w-lg mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search e.g., 'Bronchitis' or 'Sleep Apnea'"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <button 
                onClick={() => handleSearch(searchTerm)}
                disabled={isLoading || !searchTerm.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {/* Common Topics */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 ml-2">Common Topics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {COMMON_CONDITIONS.map((condition) => (
                <button
                  key={condition}
                  onClick={() => {
                    setSearchTerm(condition);
                    handleSearch(condition);
                  }}
                  className="p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-blue-400 hover:shadow-md transition-all group flex items-center justify-between"
                >
                  <span className="font-medium text-slate-700 group-hover:text-blue-700">{condition}</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          </div>
          
          {error && (
             <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
               {error}
             </div>
          )}
        </>
      ) : (
        /* Detailed View */
        <div className="space-y-6">
          <button 
            onClick={clearSearch}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft size={18} /> Back to Search
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-blue-50/50 border-b border-blue-100 p-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{details.name}</h1>
              <p className="text-lg text-slate-700 leading-relaxed">{details.overview}</p>
            </div>

            <div className="p-8 space-y-10">
              
              {/* Symptoms & Causes Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <section>
                  <div className="flex items-center gap-2 mb-4 text-orange-600">
                    <Activity className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Symptoms</h3>
                  </div>
                  <ul className="space-y-3">
                    {details.symptoms.map((symptom, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-4 text-purple-600">
                    <AlertCircle className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Causes & Risk Factors</h3>
                  </div>
                  <ul className="space-y-3">
                    {details.causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <hr className="border-slate-100" />

              {/* Diagnosis */}
              <section>
                 <div className="flex items-center gap-2 mb-4 text-indigo-600">
                    <Stethoscope className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Diagnosis</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                    {details.diagnosis}
                  </p>
              </section>

              {/* Treatment & Prevention Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <section>
                  <div className="flex items-center gap-2 mb-4 text-emerald-600">
                    <Pill className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Treatment</h3>
                  </div>
                  <ul className="space-y-3">
                    {details.treatment.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="font-bold text-emerald-500">{i + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-4 text-blue-600">
                    <ShieldCheck className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Prevention</h3>
                  </div>
                   <ul className="space-y-3">
                    {details.prevention.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <CheckIcon className="w-5 h-5 text-blue-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

            </div>
            
             {/* Footer disclaimer for KB */}
            <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
              <p className="text-xs text-slate-400">
                This information is for educational purposes only and generated by AI. Always consult a healthcare professional for medical advice.
              </p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
         <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-blue-600 font-medium">Researching condition...</p>
         </div>
      )}

    </div>
  );
};

// Simple check icon component for local use
const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default KnowledgeBase;
