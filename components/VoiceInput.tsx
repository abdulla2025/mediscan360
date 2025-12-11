import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onAudioRecorded: (base64Audio: string) => void;
  onClear: () => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onAudioRecorded, onClear }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Remove data URL prefix (e.g., "data:audio/wav;base64,")
          const base64Content = base64String.split(',')[1];
          onAudioRecorded(base64Content);
          setHasRecording(true);
        };
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleClear = () => {
    setHasRecording(false);
    onClear();
  };

  return (
    <div className="flex items-center gap-2">
      {!isRecording && !hasRecording && (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors text-sm font-medium"
        >
          <Mic size={18} />
          Record Voice
        </button>
      )}

      {isRecording && (
        <button
          onClick={stopRecording}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors text-sm font-medium animate-pulse"
        >
          <Square size={18} fill="currentColor" />
          Stop Recording
        </button>
      )}

      {hasRecording && (
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
          <span className="text-green-700 text-sm font-medium flex items-center gap-1">
            <Mic size={14} /> Voice Note Added
          </span>
          <button 
            onClick={handleClear}
            className="text-slate-400 hover:text-red-500 ml-1"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
