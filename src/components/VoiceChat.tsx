import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceChatProps {
  onTranscription: (text: string) => void;
  lastAssistantMessage?: string;
  isProcessing?: boolean;
  language?: 'de' | 'en';
  autoPlayResponse?: boolean;
  className?: string;
  compact?: boolean;
}

const VOICE_TO_TEXT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voice-to-text`;
const TEXT_TO_VOICE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-voice`;

export const VoiceChat: React.FC<VoiceChatProps> = ({
  onTranscription,
  lastAssistantMessage,
  isProcessing = false,
  language = 'de',
  autoPlayResponse = true,
  className,
  compact = false,
}) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSpokenMessageRef = useRef<string>('');

  // Auto-play assistant response when it changes
  useEffect(() => {
    if (
      autoPlayResponse &&
      audioEnabled &&
      lastAssistantMessage &&
      lastAssistantMessage !== lastSpokenMessageRef.current &&
      !isProcessing &&
      !isRecording
    ) {
      lastSpokenMessageRef.current = lastAssistantMessage;
      speakText(lastAssistantMessage);
    }
  }, [lastAssistantMessage, isProcessing, autoPlayResponse, audioEnabled, isRecording]);

  const startRecording = useCallback(async () => {
    try {
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setIsSpeaking(false);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        
        if (audioChunksRef.current.length === 0) {
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: 'destructive',
        title: 'Mikrofon-Fehler',
        description: 'Bitte erlaube den Zugriff auf das Mikrofon.',
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data URL prefix
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);

      const base64Audio = await base64Promise;

      const response = await fetch(VOICE_TO_TEXT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ audio: base64Audio, language }),
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      
      if (data.text && data.text.trim()) {
        onTranscription(data.text.trim());
      } else {
        toast({
          title: 'Keine Sprache erkannt',
          description: 'Bitte versuche es erneut.',
        });
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Spracherkennung fehlgeschlagen.',
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const speakText = async (text: string) => {
    if (!audioEnabled || !text) return;

    // Truncate very long messages for TTS
    const maxLength = 4000;
    const truncatedText = text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;

    setIsSpeaking(true);

    try {
      const response = await fetch(TEXT_TO_VOICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          text: truncatedText,
          voice: 'nova', // Warm, friendly voice
        }),
      });

      if (!response.ok) {
        throw new Error('TTS failed');
      }

      const data = await response.json();
      
      if (data.audioContent) {
        // Use data URI for proper base64 decoding
        const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };

        await audio.play();
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  const toggleAudio = () => {
    if (isSpeaking && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
    setAudioEnabled(!audioEnabled);
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const isDisabled = isProcessing || isTranscribing;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Recording Button */}
      <Button
        type="button"
        variant={isRecording ? 'destructive' : 'outline'}
        size={compact ? 'icon' : 'default'}
        onClick={handleMicClick}
        disabled={isDisabled}
        className={cn(
          'transition-all',
          isRecording && 'animate-pulse',
          compact ? 'h-9 w-9' : 'h-10'
        )}
      >
        {isTranscribing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isRecording ? (
          <>
            <MicOff className="h-4 w-4" />
            {!compact && <span className="ml-2">Stopp</span>}
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            {!compact && <span className="ml-2">Sprechen</span>}
          </>
        )}
      </Button>

      {/* Audio Toggle Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleAudio}
        className={cn(
          'h-9 w-9 transition-colors',
          isSpeaking && 'text-accent animate-pulse',
          !audioEnabled && 'text-muted-foreground'
        )}
        title={audioEnabled ? 'Sprachausgabe aktiv' : 'Sprachausgabe aus'}
      >
        {audioEnabled ? (
          <Volume2 className={cn('h-4 w-4', isSpeaking && 'text-accent')} />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default VoiceChat;
