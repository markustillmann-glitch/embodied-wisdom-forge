import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff, Loader2, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface RealtimeVoiceChatProps {
  systemPrompt?: string;
  voice?: 'shimmer' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova';
  onTranscript?: (text: string, role: 'user' | 'assistant') => void;
  onConnectionChange?: (connected: boolean) => void;
  className?: string;
  language?: 'de' | 'en';
}

const REALTIME_SESSION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/realtime-session`;

export const RealtimeVoiceChat: React.FC<RealtimeVoiceChatProps> = ({
  systemPrompt,
  voice = 'shimmer',
  onTranscript,
  onConnectionChange,
  className,
  language = 'de'
}) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const labels = {
    de: {
      startCall: 'Gespräch starten',
      connecting: 'Verbinde...',
      endCall: 'Auflegen',
      listening: 'Höre zu...',
      speaking: 'Spricht...',
      connectionError: 'Verbindungsfehler',
      connectionErrorDesc: 'Konnte keine Verbindung herstellen. Bitte versuche es erneut.',
      micError: 'Mikrofon-Fehler',
      micErrorDesc: 'Bitte erlaube den Zugriff auf das Mikrofon.',
    },
    en: {
      startCall: 'Start Call',
      connecting: 'Connecting...',
      endCall: 'Hang Up',
      listening: 'Listening...',
      speaking: 'Speaking...',
      connectionError: 'Connection Error',
      connectionErrorDesc: 'Could not establish connection. Please try again.',
      micError: 'Microphone Error',
      micErrorDesc: 'Please allow microphone access.',
    }
  };

  const t = labels[language];

  const disconnect = useCallback(() => {
    console.log('Disconnecting realtime voice chat');
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
    }
    
    setIsConnected(false);
    setIsSpeaking(false);
    setIsListening(false);
    onConnectionChange?.(false);
  }, [onConnectionChange]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    
    try {
      // Request microphone access first
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      streamRef.current = stream;
      console.log('Microphone access granted');

      // Get ephemeral token from edge function
      console.log('Fetching ephemeral token...');
      const tokenResponse = await fetch(REALTIME_SESSION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          instructions: systemPrompt,
          voice: voice
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get session token');
      }

      const tokenData = await tokenResponse.json();
      console.log('Token received:', tokenData);
      
      if (!tokenData.client_secret?.value) {
        throw new Error('No ephemeral token received');
      }

      const EPHEMERAL_KEY = tokenData.client_secret.value;

      // Create peer connection
      console.log('Creating peer connection...');
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Create audio element for playback
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioElRef.current = audioEl;

      // Set up remote audio
      pc.ontrack = (e) => {
        console.log('Received remote track');
        audioEl.srcObject = e.streams[0];
      };

      // Add local audio track
      const audioTrack = stream.getTracks()[0];
      pc.addTrack(audioTrack, stream);
      console.log('Added local audio track');

      // Set up data channel for events
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.onopen = () => {
        console.log('Data channel opened');
        setIsListening(true);
      };

      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log('Received event:', event.type);

          switch (event.type) {
            case 'response.audio.delta':
              setIsSpeaking(true);
              setIsListening(false);
              break;
            case 'response.audio.done':
              setIsSpeaking(false);
              setIsListening(true);
              break;
            case 'input_audio_buffer.speech_started':
              setIsListening(true);
              break;
            case 'input_audio_buffer.speech_stopped':
              setIsListening(false);
              break;
            case 'conversation.item.input_audio_transcription.completed':
              if (event.transcript && onTranscript) {
                onTranscript(event.transcript, 'user');
              }
              break;
            case 'response.audio_transcript.done':
              if (event.transcript && onTranscript) {
                onTranscript(event.transcript, 'assistant');
              }
              break;
            case 'error':
              console.error('Realtime API error:', event);
              toast({
                variant: 'destructive',
                title: t.connectionError,
                description: event.error?.message || 'Unknown error',
              });
              break;
          }
        } catch (error) {
          console.error('Error parsing event:', error);
        }
      };

      dc.onerror = (error) => {
        console.error('Data channel error:', error);
      };

      // Create and set local description
      console.log('Creating offer...');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Connect to OpenAI's Realtime API
      console.log('Connecting to OpenAI Realtime API...');
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.error('SDP response error:', errorText);
        throw new Error('Failed to connect to OpenAI');
      }

      const answerSdp = await sdpResponse.text();
      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: answerSdp,
      };
      
      await pc.setRemoteDescription(answer);
      console.log('WebRTC connection established');

      setIsConnected(true);
      onConnectionChange?.(true);

    } catch (error) {
      console.error('Connection error:', error);
      
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        toast({
          variant: 'destructive',
          title: t.micError,
          description: t.micErrorDesc,
        });
      } else {
        toast({
          variant: 'destructive',
          title: t.connectionError,
          description: t.connectionErrorDesc,
        });
      }
      
      disconnect();
    } finally {
      setIsConnecting(false);
    }
  }, [systemPrompt, voice, onTranscript, onConnectionChange, disconnect, toast, t]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!isConnected ? (
        <Button
          onClick={connect}
          disabled={isConnecting}
          variant="default"
          size="lg"
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t.connecting}
            </>
          ) : (
            <>
              <Phone className="h-5 w-5" />
              {t.startCall}
            </>
          )}
        </Button>
      ) : (
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted">
            {isSpeaking ? (
              <>
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">{t.speaking}</span>
              </>
            ) : isListening ? (
              <>
                <Mic className="h-4 w-4 text-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">{t.listening}</span>
              </>
            ) : (
              <>
                <MicOff className="h-4 w-4 text-muted-foreground" />
              </>
            )}
          </div>
          
          {/* Hang up button */}
          <Button
            onClick={disconnect}
            variant="destructive"
            size="lg"
            className="gap-2"
          >
            <PhoneOff className="h-5 w-5" />
            {t.endCall}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RealtimeVoiceChat;
