
import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { api } from '../services/api';
import NuancedToggle from '../components/NuancedToggle';
import { useNuancedOptions } from '../hooks/useNuancedOptions';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ConversationRoom.module.css';

const ConversationRoom: React.FC = () => {

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversationId] = useState(() => uuidv4());
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const [nuancedEnabled, setNuancedEnabled] = useState(false);
  const { options: nuancedOptions, loading: nuancedLoading, error: nuancedError, getNuancedOptions } = useNuancedOptions();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Save the entire transcript before asking AI
  const saveFullTranscript = async () => {
    try {
      await api.saveConversation({
        conversationId,
        transcript: transcript.replace(' [listening]', ''),
        aiResponse,
        nuancedOptions: nuancedEnabled && nuancedOptions ? nuancedOptions : [],
      });
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save session');
      throw e;
    }
  };

  const handleMicClick = () => {
    if (!listening) {
      // Start listening
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              setTranscript((prev) => prev + event.results[i][0].transcript + ' ');
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          if (interimTranscript) {
            setTranscript((prev) => prev.split(' [listening]')[0] + ' [listening]' + interimTranscript);
          }
        };
        recognition.onerror = (event: any) => {
          setListening(false);
        };
        recognition.onend = () => {
          setListening(false);
        };
        recognitionRef.current = recognition;
        recognition.start();
        // Do NOT clear transcript here; preserve previous transcript for long conversations
        setListening(true);
      } else {
        // Fallback: Demo transcript and browser warning
        setTranscript((prev) => prev + 'Hello! This is a demo transcript. (Speech recognition not supported in this browser.) ');
        alert('Live transcription does not work in Firefox. Please use Chrome or Edge for full functionality.');
        setListening(true);
      }
    } else {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setListening(false);
      setTranscript((prev) => prev.replace(' [listening]', ''));
    }
  };

  // Fetch nuanced options when toggled on and transcript exists
  React.useEffect(() => {
    if (nuancedEnabled && transcript) {
      getNuancedOptions(transcript.replace(' [listening]', ''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nuancedEnabled, transcript]);


  // Remove browser speechSynthesis. Playback will use Azure-generated audio only.

  const handleAskAi = async () => {
    setAiLoading(true);
    setAiResponse('');
    setSaveError(null);
    try {
      await saveFullTranscript();
      const data = await api.askAi(conversationId);
      console.log('AI Response:', data.aiResponse); // Debug log
      setAiResponse(data.aiResponse || 'AI: No response.');
      setAudioBase64(data.audio || null);
      // Auto-play the Azure-generated voice response
      if (data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.play();
      }
    } catch (e) {
      setSaveError(e.message || 'Failed to save or get AI response');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className={styles.conversationRoomContainer}>
      <div className={styles.header}>Conversation Room</div>
      <div className={styles.transcriptArea}>
        {transcript ? (
          <span>{transcript.replace(' [listening]', '')}</span>
        ) : (
          <div className={styles.placeholder}>
            {listening ? 'Listening... Start speaking.' : 'Click the mic to start live transcription.'}
          </div>
        )}
      </div>
      {/* Save & End Session button removed for user-friendly flow */}
      {saveError && <div style={{ color: '#ef4444', marginTop: 8 }}>{saveError}</div>}
      <div className={styles.controls}>
        <button type="button" onClick={handleMicClick} style={{
          background: listening ? '#3b82f6' : '#fff',
          color: listening ? '#fff' : '#3b82f6',
          border: '2px solid #3b82f6',
          borderRadius: '2rem',
          padding: '0.75rem 2rem',
          fontWeight: 700,
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          {listening ? '🛑 Stop' : '🎤 Mic'}
        </button>
        <button
          type="button"
          onClick={handleAskAi}
          disabled={aiLoading || !transcript}
          style={{
            background: aiLoading ? '#64748b' : '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '2rem',
            padding: '0.75rem 2rem',
            fontWeight: 700,
            fontSize: '1.1rem',
            opacity: aiLoading || !transcript ? 0.7 : 1,
            cursor: aiLoading || !transcript ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {aiLoading ? 'Thinking...' : 'Ask AI'}
        </button>
      </div>
      <div style={{ width: '100%', maxWidth: 700, marginTop: '2rem' }}>
        <div style={{
          background: '#e0e7ff',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1rem',
          color: '#3730a3',
          fontWeight: 600,
          fontSize: '1.1rem',
          textAlign: 'center',
          minHeight: '2.5rem',
        }}>
          {/* AI response area */}
          {aiLoading ? <span>AI is thinking...</span> : aiResponse || <span>AI response will appear here.</span>}
          {audioBase64 && (
            <div style={{ marginTop: 12 }}>
              <audio controls src={`data:audio/mp3;base64,${audioBase64}`} style={{ width: '100%' }} />
              <button
                style={{
                  marginTop: 8,
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '1.5rem',
                  padding: '0.5rem 1.5rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = `data:audio/mp3;base64,${audioBase64}`;
                  link.download = 'ai-voice-note.mp3';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <span role="img" aria-label="download">📥</span> Download Voice Note
              </button>
            </div>
          )}
        </div>
        <div style={{
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          color: '#64748b',
          fontSize: '1rem',
          textAlign: 'center',
          border: '1px dashed #c7d2fe',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <NuancedToggle enabled={nuancedEnabled} onToggle={() => setNuancedEnabled((v) => !v)} />
            <span style={{ fontSize: '0.95rem', marginLeft: 8, color: '#64748b' }}>Nuanced Options</span>
          </div>
          {nuancedEnabled ? (
            nuancedLoading ? (
              <span>Loading nuanced options...</span>
            ) : nuancedError ? (
              <span style={{ color: '#ef4444' }}>{nuancedError}</span>
            ) : nuancedOptions && nuancedOptions.length > 0 ? (
              <ul style={{ textAlign: 'left', margin: '0 auto', maxWidth: 520 }}>
                {nuancedOptions.map((opt, idx) => (
                  <li key={idx} style={{ marginBottom: 12, padding: 8, borderRadius: 8, background: '#f1f5f9', color: '#334155' }}>
                    <strong>{opt.label}</strong>
                    <div style={{ fontSize: '0.97rem', margin: '4px 0 0 0' }}>{opt.description}</div>
                    {opt.facts && opt.facts.length > 0 && (
                      <ul style={{ margin: '6px 0 0 1.2em', fontSize: '0.93rem', color: '#64748b' }}>
                        {opt.facts.map((fact, i) => (
                          <li key={i}>{fact}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <span>No nuanced options available for this context.</span>
            )
          ) : (
            <span>Nuanced options will appear here.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationRoom;
