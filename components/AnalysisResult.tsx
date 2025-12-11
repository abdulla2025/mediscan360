import React, { useState } from 'react';
import { AnalysisResponse, RiskLevel } from '../types';
import { RISK_COLORS } from '../constants';
import { 
  AlertTriangle, 
  Activity, 
  Stethoscope, 
  FileText, 
  ClipboardList, 
  Clock,
  Pill,
  Book,
  BarChart2,
  Phone,
  Siren,
  Microscope,
  HelpCircle,
  Download,
  Printer,
  TrendingUp,
  FlaskConical
} from 'lucide-react';

interface AnalysisResultProps {
  data: AnalysisResponse;
  isElderMode?: boolean;
  onFollowUpClick?: (question: string) => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, isElderMode = false, onFollowUpClick }) => {
  const riskColor = RISK_COLORS[data.riskLevel] || 'bg-gray-100 text-gray-800';
  const isCritical = data.riskLevel === RiskLevel.CRITICAL;

  const handleDownloadReport = () => {
    // Create a text version of the report
    const reportContent = `
MEDISCAN360 - AI MEDICAL TRIAGE REPORT
Date: ${new Date().toLocaleString()}
----------------------------------------

RISK LEVEL: ${data.riskLevel}
URGENCY: ${data.urgency}

SUMMARY
${data.summary}

POSSIBLE CONDITIONS
${data.possibleConditions.map(c => `- ${c}`).join('\n')}

RECOMMENDATIONS
${data.recommendations.map(r => `- ${r}`).join('\n')}

${data.labAnalysis ? `LAB REPORT ANALYSIS\n${data.labAnalysis}\n` : ''}

${data.medications?.length > 0 ? `MEDICATIONS\n${data.medications.map(m => `- ${m.name}: ${m.purpose}`).join('\n')}\n` : ''}

----------------------------------------
DOCTOR SUMMARY (SBAR)
${data.doctorSummary}
----------------------------------------

DISCLAIMER
${data.disclaimer}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MediScan360_Report_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'bg-green-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Reusable Card Component
  const Card = ({ title, icon, colorClass, children, className = "" }: any) => (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col ${className}`}>
      <div className={`px-6 py-4 border-b border-slate-100 flex items-center gap-2 ${colorClass}`}>
        {icon}
        <h3 className={`font-bold ${isElderMode ? 'text-xl' : 'text-base'}`}>{title}</h3>
      </div>
      <div className={`p-6 flex-1 ${isElderMode ? 'text-lg' : 'text-sm'}`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* EMERGENCY MODE OVERLAY */}
      {isCritical && (
        <div className="bg-red-50 border-4 border-red-500 rounded-2xl p-6 sm:p-8 animate-pulse shadow-xl mb-8">
          <div className="flex items-center gap-4 text-red-700 mb-6">
            <Siren className="w-12 h-12 animate-bounce" />
            <div>
              <h2 className="text-3xl font-extrabold uppercase tracking-wider">Emergency Alert</h2>
              <p className="text-red-600 font-bold text-lg">Potential Medical Emergency Detected</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border-l-8 border-red-500 mb-6">
            <h3 className="font-bold text-xl mb-4 text-slate-800">Immediate Actions Required:</h3>
            <ul className="space-y-3">
              {data.emergencyInstructions && data.emergencyInstructions.length > 0 ? (
                data.emergencyInstructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xl font-medium text-slate-900">
                     <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold shrink-0">
                       {idx + 1}
                     </span>
                     {instruction}
                  </li>
                ))
              ) : (
                <li className="text-lg">Please seek professional medical help immediately.</li>
              )}
            </ul>
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-2xl py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95">
            <Phone className="w-8 h-8" />
            Call Emergency Services (Simulation)
          </button>
        </div>
      )}

      {/* --- CARDS LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Risk & Urgency (Span Full on Mobile, Col 1 on Desktop) */}
        <div className={`md:col-span-2 lg:col-span-3 rounded-xl border-l-8 shadow-sm flex flex-col sm:flex-row items-center justify-between p-6 ${riskColor}`}>
           <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <AlertTriangle className={`w-8 h-8 ${isElderMode ? 'w-10 h-10' : ''}`} />
              <div>
                <h2 className={`font-extrabold uppercase tracking-wide ${isElderMode ? 'text-2xl' : 'text-xl'}`}>Risk: {data.riskLevel}</h2>
                <p className={`opacity-90 ${isElderMode ? 'text-lg' : 'text-sm'}`}>Triage Assessment</p>
              </div>
           </div>
           <div className="flex items-center gap-3 bg-white/60 px-6 py-3 rounded-xl border border-white/40">
              <Clock className={`w-6 h-6 ${isElderMode ? 'w-8 h-8' : ''}`} />
              <div className="text-right">
                 <p className="text-xs font-bold uppercase opacity-60">Urgency</p>
                 <p className={`font-bold ${isElderMode ? 'text-xl' : 'text-lg'}`}>{data.urgency}</p>
              </div>
           </div>
        </div>

        {/* Card 2: Summary */}
        <Card 
          title="Summary" 
          icon={<Activity />} 
          colorClass="text-emerald-700 bg-emerald-50"
          className="md:col-span-2 lg:col-span-2"
        >
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.summary}</p>
        </Card>

        {/* Card 3: Risk Dashboard (if available) */}
        {data.riskScores && data.riskScores.length > 0 && (
          <Card 
             title="Health Scores" 
             icon={<BarChart2 />} 
             colorClass="text-slate-700 bg-slate-50"
          >
             <div className="space-y-4">
              {data.riskScores.map((risk, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-600">{risk.category}</span>
                    <span className={`font-bold ${risk.score > 70 ? 'text-red-600' : 'text-slate-700'}`}>
                      {risk.status}
                    </span>
                  </div>
                  <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${isElderMode ? 'h-4' : 'h-2'}`}>
                    <div 
                      className={`h-full rounded-full ${getScoreColor(risk.score)}`} 
                      style={{ width: `${risk.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Card 4: Lab Result Interpretation (Conditionally Rendered) */}
        {(data.labAnalysis || (data.labPredictions && data.labPredictions.length > 0)) && (
          <Card 
            title="Lab Interpretation & Trends" 
            icon={<Microscope />} 
            colorClass="text-blue-700 bg-blue-50"
            className="md:col-span-2 lg:col-span-3"
          >
             {data.labAnalysis && (
               <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-slate-800 leading-relaxed mb-4">
                 <h4 className="font-bold text-sm mb-2 text-blue-900">Analysis</h4>
                 {data.labAnalysis}
               </div>
             )}
             
             {/* Lab Predictions Section */}
             {data.labPredictions && data.labPredictions.length > 0 && (
                <div className="mt-4">
                   <h4 className="flex items-center gap-2 font-bold text-sm mb-2 text-purple-900">
                     <TrendingUp size={16} /> Predicted Trends
                   </h4>
                   <ul className="space-y-1 text-slate-700">
                     {data.labPredictions.map((pred, i) => (
                       <li key={i} className="flex items-start gap-2">
                         <span className="text-purple-500">•</span> {pred}
                       </li>
                     ))}
                   </ul>
                </div>
             )}

             {/* Suggested Follow-up Tests */}
             {data.suggestedFollowUpTests && data.suggestedFollowUpTests.length > 0 && (
                <div className="mt-4 pt-4 border-t border-blue-100">
                   <h4 className="flex items-center gap-2 font-bold text-sm mb-2 text-indigo-900">
                     <FlaskConical size={16} /> Recommended Follow-up Tests
                   </h4>
                   <div className="flex flex-wrap gap-2">
                     {data.suggestedFollowUpTests.map((test, i) => (
                       <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                         {test}
                       </span>
                     ))}
                   </div>
                </div>
             )}
          </Card>
        )}

        {/* Card 5: Possible Conditions */}
        <Card 
          title="Possible Conditions" 
          icon={<Stethoscope />} 
          colorClass="text-indigo-700 bg-indigo-50"
        >
           <ul className="space-y-2">
            {data.possibleConditions.map((condition, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 font-medium">
                <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-indigo-400 shrink-0" />
                {condition}
              </li>
            ))}
          </ul>
        </Card>

        {/* Card 6: Medications (if present) */}
        {(data.medications?.length > 0 || data.interactions?.length > 0) && (
          <Card 
            title="Medication Info" 
            icon={<Pill />} 
            colorClass="text-purple-700 bg-purple-50"
            className="lg:col-span-2"
          >
             {data.interactions.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-800 text-sm">
                  <strong className="block mb-1 flex items-center gap-2"><AlertTriangle size={14}/> Interaction Warnings:</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    {data.interactions.map((warn, i) => <li key={i}>{warn}</li>)}
                  </ul>
                </div>
              )}
              <div className="space-y-4">
                {data.medications.map((med, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-purple-50/50 border border-purple-100">
                    <div className="flex justify-between items-start mb-1">
                       <p className="font-bold text-purple-900">{med.name}</p>
                       <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">{med.purpose}</span>
                    </div>
                    {med.rationale && (
                      <p className="text-xs text-slate-600 mt-1">
                        <span className="font-semibold">Why prescribed:</span> {med.rationale}
                      </p>
                    )}
                    {med.alternatives && (
                      <p className="text-xs text-slate-500 mt-1 italic">
                        Alternatives: {med.alternatives}
                      </p>
                    )}
                  </div>
                ))}
              </div>
          </Card>
        )}

        {/* Card 7: Recommendations */}
         <Card 
            title="Next Steps" 
            icon={<ClipboardList />} 
            colorClass="text-emerald-800 bg-emerald-100"
            className="md:col-span-2"
          >
             <ul className="space-y-3">
                {data.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    {rec}
                  </li>
                ))}
              </ul>
          </Card>
        
        {/* Card 8: Follow-up Questions (New) */}
        {data.followUpQuestions && data.followUpQuestions.length > 0 && (
          <Card
            title="Follow-up Questions"
            icon={<HelpCircle />}
            colorClass="text-orange-700 bg-orange-50"
            className="lg:col-span-1"
          >
            <p className="text-xs text-slate-500 mb-3">Tap to ask:</p>
            <div className="flex flex-col gap-2">
              {data.followUpQuestions.map((q, idx) => (
                <button 
                  key={idx}
                  onClick={() => onFollowUpClick && onFollowUpClick(q)}
                  className="text-left text-sm p-3 bg-orange-50 hover:bg-orange-100 text-orange-900 rounded-lg border border-orange-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Card 9: Doctor Summary & PDF Download */}
        <Card 
           title="Doctor Summary" 
           icon={<FileText />} 
           colorClass="text-blue-800 bg-blue-50"
           className="md:col-span-2 lg:col-span-3"
        >
           <div className="flex justify-between items-center mb-4">
             <p className="text-slate-500 text-xs">Technical SBAR format for clinical handover.</p>
             <div className="flex gap-2">
               <button 
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
               >
                 <Printer size={14} /> Print
               </button>
               <button 
                  onClick={handleDownloadReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <Download size={14} /> PDF/Text
                </button>
             </div>
           </div>
           <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg font-mono text-xs md:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
             {data.doctorSummary}
           </div>
        </Card>

      </div>

      {/* Glossary (Full width bottom) */}
      {data.glossary && data.glossary.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mt-6">
           <div className="flex items-center gap-2 mb-4 text-blue-700">
              <Book className="w-5 h-5" />
              <h3 className="font-bold">Medical Terms Translator</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.glossary.map((item, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-bold text-slate-700">{item.term}:</span> <span className="text-slate-600">{item.definition}</span>
                </div>
              ))}
            </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-slate-400 text-center px-4 pt-4">
        <p className="font-semibold mb-1">DISCLAIMER:</p>
        <p>{data.disclaimer}</p>
      </div>
    </div>
  );
};

export default AnalysisResult;