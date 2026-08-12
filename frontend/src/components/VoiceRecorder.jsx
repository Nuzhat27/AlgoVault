import { useEffect, useRef, useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function VoiceRecorder({ onSubmit, submitLabel = 'Get evaluation →', initialTranscript = '' }) {
  const toast = useToast();
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('');
  const [transcript, setTranscript] = useState(initialTranscript);
  const [busy, setBusy] = useState(false);

  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const recognitionRef = useRef(null);

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechSupported = !!SpeechRec;

  useEffect(() => {
    return () => stopRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function draw() {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(data);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e3a63e';
    ctx.beginPath();
    const slice = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = data[i] / 128.0;
      const y = (v * canvas.height) / 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      x += slice;
    }
    ctx.stroke();
    rafRef.current = requestAnimationFrame(draw);
  }

  async function startRecording() {
    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      toast('Microphone access denied — you can still type your explanation.');
      return;
    }
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtxRef.current.createMediaStreamSource(mediaStreamRef.current);
    analyserRef.current = audioCtxRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    source.connect(analyserRef.current);
    draw();
    setRecording(true);
    setStatus('Recording — nothing is saved except the transcript.');

    if (speechSupported) {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      let finalTranscript = transcript ? transcript + ' ' : '';
      recognition.onresult = (ev) => {
        let interim = '';
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          if (ev.results[i].isFinal) finalTranscript += ev.results[i][0].transcript + ' ';
          else interim += ev.results[i][0].transcript;
        }
        setTranscript((finalTranscript + interim).trim());
      };
      recognition.onerror = () => {};
      recognition.start();
      recognitionRef.current = recognition;
    }
  }

  function stopRecording() {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    cancelAnimationFrame(rafRef.current);
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setRecording(false);
    setStatus('Stopped. Audio was discarded — only the transcript above is kept.');
  }

  async function handleSubmit() {
    if (!transcript.trim()) {
      toast('Record or type an explanation first.');
      return;
    }
    setBusy(true);
    try {
      await onSubmit(transcript.trim());
    } catch {
      // caller is responsible for surfacing a specific error message
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {!speechSupported && (
        <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 8 }}>
          Live transcription not supported in this browser — type your explanation instead.
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <button type="button" className="btn btn-sm" onClick={recording ? stopRecording : startRecording}>
          {recording ? (<><span className="rec-dot"></span> Stop</>) : '● Record'}
        </button>
        <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{status}</span>
      </div>
      <canvas className="waveform" ref={canvasRef}></canvas>
      <div className="field" style={{ marginTop: 10 }}>
        <label>Transcript <span style={{ textTransform: 'none', color: 'var(--text-faint)' }}>(auto-filled if supported — editable either way)</span></label>
        <textarea
          rows={3}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Explain the problem and your approach out loud, or just type it here…"
        />
      </div>
      <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={busy}>
        {submitLabel}
      </button>
      {busy && <div style={{ color: 'var(--text-faint)', fontSize: 12.5, marginTop: 8 }}>Interviewer is reviewing your answer…</div>}
    </div>
  );
}
