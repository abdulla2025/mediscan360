import React, { useState, useRef, useEffect } from 'react';
import { analyzeHealthData } from './services/geminiService';
import { AnalysisResponse, MediaFile, HistoryItem, UserProfile } from './types';
import AnalysisResult from './components/AnalysisResult';
import VoiceInput from './components/VoiceInput';
import KnowledgeBase from './components/KnowledgeBase';
import History from './components/History';
import { 
  HeartPulse, 
  Upload, 
  Image as ImageIcon, 
  X, 
  Send,
  Loader2,
  FileText,
  Stethoscope,
  BookOpen,
  History as HistoryIcon,
  Glasses,
  Users,
  ChevronDown
} from 'lucide-react';

const DEFAULT_PROFILES: UserProfile[] = [
  { id: 'p1', name: 'Me', role: 'Self', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'p2', name: 'Mom', role: 'Parent', color: 'bg-rose-100 text-rose-800' },
  { id: 'p3', name: 'Dad', role: 'Parent', color: 'bg-blue-100 text-blue-800' },
  { id: 'p4', name: 'Child', role: 'Child', color: 'bg-orange-100 text-orange-800' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'triage' | 'knowledge' | 'history'>('triage');
  const [isElderMode, setIsElderMode] = useState(false);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(DEFAULT_PROFILES[0]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Triage State
  const [inputText, setInputText] = useState('');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [audioData, setAudioData] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    Array.from(fileList).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix
        const base64Data = base64String.split(',')[1];
        
        setFiles(prev => [...prev, {
          mimeType: file.type,
          data: base64Data,
          name: file.name,
          previewUrl: base64String
        }]);
      };
      reader.readAsDataURL(file);
    });
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const saveToHistory = (data: AnalysisResponse) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      profileId: activeProfile.id,
      date: new Date().toISOString(),
      preview: data.summary.substring(0, 60) + "...",
      riskLevel: data.riskLevel,
      data: data
    };
    
    const existing = localStorage.getItem('mediscan_history');
    const history = existing ? JSON.parse(existing) : [];
    history.push(newItem);
    localStorage.setItem('mediscan_history', JSON.stringify(history));
  };

  const handleAnalysis = async () => {
    if (!inputText && files.length === 0 && !audioData) {
      setError("Please provide symptoms, an image, or a voice note.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeHealthData(inputText, files, audioData);
      setResult(data);
      saveToHistory(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpClick = (question: string) => {
    setResult(null);
    setInputText(question);
    // Optional: Auto-submit
    // handleAnalysis(); 
    // Usually better to let user review/add detail before sending.
  };

  const resetAll = () => {
    setResult(null);
    setInputText('');
    setFiles([]);
    setAudioData(undefined);
    setError(null);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setResult(item.data);
    setActiveTab('triage');
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans transition-all ${isElderMode ? 'text-lg' : ''}`}>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('triage'); resetAll(); }}>
              <div className="bg-emerald-600 p-1.5 rounded-lg text-white">
                <HeartPulse size={isElderMode ? 28 : 24} />
              </div>
              <h1 className={`font-bold tracking-tight text-slate-800 hidden sm:block ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                MediScan<span className="text-emerald-600">360</span>
              </h1>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg overflow-x-auto no-scrollbar mx-2">
              <button
                onClick={() => setActiveTab('triage')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${
                  activeTab === 'triage' 
                    ? 'bg-white text-emerald-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                } ${isElderMode ? 'text-base' : 'text-sm'}`}
              >
                <Stethoscope size={16} />
                <span className="hidden sm:inline">Triage</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${
                  activeTab === 'history' 
                    ? 'bg-white text-orange-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                } ${isElderMode ? 'text-base' : 'text-sm'}`}
              >
                <HistoryIcon size={16} />
                <span className="hidden sm:inline">Log</span>
              </button>
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${
                  activeTab === 'knowledge' 
                    ? 'bg-white text-blue-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                } ${isElderMode ? 'text-base' : 'text-sm'}`}
              >
                <BookOpen size={16} />
                <span className="hidden sm:inline">Knowledge</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
               {/* Profile Switcher */}
               <div className="relative">
                 <button 
                   onClick={() => setShowProfileMenu(!showProfileMenu)}
                   className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200 ${activeProfile.color} ${isElderMode ? 'text-base' : 'text-sm'}`}
                 >
                   <Users size={16} />
                   <span className="font-semibold">{activeProfile.name}</span>
                   <ChevronDown size={14} />
                 </button>

                 {showProfileMenu && (
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                     <div className="p-2">
                       <p className="text-xs font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">Select Profile</p>
                       {DEFAULT_PROFILES.map(p => (
                         <button
                           key={p.id}
                           onClick={() => {
                             setActiveProfile(p);
                             setShowProfileMenu(false);
                             // If currently in history, it will re-render due to activeProfile change
                           }}
                           className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                             activeProfile.id === p.id ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                           }`}
                         >
                           {p.name}
                           {activeProfile.id === p.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               {/* Elder Mode Toggle */}
               <button
                 onClick={() => setIsElderMode(!isElderMode)}
                 className={`hidden sm:flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${isElderMode ? 'bg-purple-100 text-purple-700' : 'text-slate-400 hover:bg-slate-100'}`}
                 title="Toggle Elder Mode (Larger Text)"
               >
                 <Glasses size={20} />
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        
        {activeTab === 'knowledge' && <KnowledgeBase />}
        
        {activeTab === 'history' && (
           <History 
             onSelect={loadFromHistory} 
             activeProfileId={activeProfile.id}
           />
        )}

        {activeTab === 'triage' && (
          <>
            {/* Triage Mode */}
            
            {/* Intro / Empty State */}
            {!result && !isLoading && (
              <div className="text-center mb-10 space-y-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-2 ${activeProfile.color}`}>
                  <Users size={14} /> Analyzing for: {activeProfile.name}
                </div>
                <h2 className={`font-extrabold text-slate-800 ${isElderMode ? 'text-4xl' : 'text-3xl md:text-4xl'}`}>
                  Your AI Health Triage Assistant
                </h2>
                <p className={`text-slate-500 max-w-lg mx-auto ${isElderMode ? 'text-xl' : 'text-lg'}`}>
                  Upload prescriptions, lab reports, or describe your symptoms. 
                  Get instant clarity on your health concerns.
                </p>
              </div>
            )}

            {/* Input Section - Only show if no result is displayed */}
            {!result && !isLoading && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all">
                <div className={`space-y-6 ${isElderMode ? 'p-8' : 'p-6'}`}>
                  
                  {/* Text Input */}
                  <div>
                    <label className={`block font-medium text-slate-700 mb-2 ${isElderMode ? 'text-lg' : 'text-sm'}`}>
                      Describe symptoms or ask a question
                    </label>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="e.g., I have a persistent headache and mild fever..."
                      className={`w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all placeholder:text-slate-400 ${isElderMode ? 'h-40 text-lg' : 'h-32'}`}
                    />
                  </div>

                  {/* Media Inputs Bar */}
                  <div className="flex flex-wrap items-center gap-4">
                    
                    {/* File Upload */}
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*,application/pdf"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors font-medium ${isElderMode ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-sm'}`}
                    >
                      <Upload size={isElderMode ? 24 : 18} />
                      Upload Reports/Images
                    </button>

                    {/* Voice Input */}
                    <VoiceInput 
                      onAudioRecorded={setAudioData} 
                      onClear={() => setAudioData(undefined)}
                    />
                  </div>

                  {/* Attachments Preview */}
                  {files.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                      {files.map((file, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-square flex flex-col items-center justify-center">
                          {file.mimeType.startsWith('image') ? (
                            <img src={file.previewUrl} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-slate-400 flex flex-col items-center p-2 text-center">
                              <FileText size={32} />
                              <span className="text-xs mt-2 break-all line-clamp-2">{file.name}</span>
                            </div>
                          )}
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                      <X size={16} /> {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleAnalysis}
                    disabled={(!inputText && files.length === 0 && !audioData)}
                    className={`w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 ${isElderMode ? 'py-6 text-2xl' : 'py-4 text-lg'}`}
                  >
                    Analyze Health Data <Send size={isElderMode ? 28 : 20} />
                  </button>
                </div>
                
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center text-xs text-slate-400">
                  Files are processed securely using Google Gemini. Not stored on any server.
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in fade-in">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <HeartPulse className="text-emerald-600 animate-pulse" size={24} />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className={`font-semibold text-slate-800 ${isElderMode ? 'text-2xl' : 'text-xl'}`}>Analyzing medical data...</h3>
                  <p className={`text-slate-500 ${isElderMode ? 'text-lg' : ''}`}>Processing symptoms, images, and clinical context</p>
                </div>
              </div>
            )}

            {/* Results Section */}
            {result && (
              <div className="space-y-6">
                <button 
                  onClick={resetAll} 
                  className={`text-slate-500 hover:text-emerald-600 flex items-center gap-1 mb-4 ${isElderMode ? 'text-lg' : 'text-sm'}`}
                >
                  ← Start New Analysis
                </button>
                <AnalysisResult 
                  data={result} 
                  isElderMode={isElderMode} 
                  onFollowUpClick={handleFollowUpClick}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        <p>&copy; {new Date().getFullYear()} MediScan360. Powered by Google Gemini 3 Pro.</p>
        <p className="mt-1 text-xs text-slate-300">Not a substitute for professional medical advice.</p>
      </footer>

    </div>
  );
};

export default App;