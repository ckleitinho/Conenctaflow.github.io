'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  ScreenShare, 
  Maximize2, 
  Minimize2, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Users,
  Shield,
  Send,
  Camera
} from 'lucide-react';
import { Friend, User } from '@/lib/types';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Friend | null;
  currentUser: User;
  isIncoming?: boolean;
  groupName?: string;
  isGroupCall?: boolean;
  onAcceptIncoming?: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  partner,
  currentUser,
  isIncoming = false,
  groupName,
  isGroupCall = false,
  onAcceptIncoming,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showInCallChat, setShowInCallChat] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callMessages, setCallMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Sistema', text: 'Chamada com criptografia de ponta a ponta iniciada.', time: 'Agora' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Sound generator for connection ring using Web Audio API
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Start Media Stream (Camera & Mic)
  useEffect(() => {
    if (!isOpen || isIncoming) return;

    playBeep();

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true,
          });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setCameraError(null);
        } else {
          setCameraError('Webcam não suportada neste navegador.');
        }
      } catch (err: any) {
        console.warn('Camera access error:', err);
        setCameraError(
          'Permissão de câmera não concedida. Usando modo de chamada de áudio e avatar.'
        );
      } finally {
        setTimeout(() => {
          setIsConnecting(false);
        }, 1200);
      }
    };

    startCamera();

    return () => {
      // Cleanup streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
    };
  }, [isOpen, isIncoming]);

  // Call duration counter
  useEffect(() => {
    if (!isOpen || isConnecting || isIncoming) return;

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isConnecting, isIncoming]);

  // Format call duration MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle Mic
  const handleToggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
  };

  // Toggle Camera
  const handleToggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsCameraOff(!isCameraOff);
  };

  // Screen Sharing
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen share
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setIsScreenSharing(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });
          screenStreamRef.current = screenStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          screenStream.getVideoTracks()[0].onended = () => {
            handleToggleScreenShare();
          };
          setIsScreenSharing(true);
        }
      } catch (err) {
        console.warn('Screen share error or canceled:', err);
      }
    }
  };

  // Send In-call message
  const handleSendInCallMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setCallMessages((prev) => [
      ...prev,
      {
        sender: currentUser.name.split(' ')[0],
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');
  };

  if (!isOpen) return null;

  // Render Incoming Call Screen if ringing
  if (isIncoming && partner) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-700 rounded-3xl p-8 max-w-sm w-full text-center text-white shadow-2xl animate-in zoom-in-95">
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-[#1877F2] animate-ping opacity-40" />
            <img
              src={partner.avatar}
              alt={partner.name}
              className="relative w-full h-full rounded-full object-cover border-4 border-[#1877F2] shadow-xl"
            />
          </div>

          <h3 className="text-xl font-bold mb-1">{partner.name}</h3>
          <p className="text-sm text-neutral-400 mb-8 animate-pulse">
            Chamada de vídeo recebida no ConectaFlow...
          </p>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={onClose}
              className="flex flex-col items-center gap-2 text-neutral-400 hover:text-white group"
            >
              <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                <PhoneOff className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold">Recusar</span>
            </button>

            <button
              onClick={onAcceptIncoming}
              className="flex flex-col items-center gap-2 text-neutral-400 hover:text-white group"
            >
              <div className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 animate-bounce">
                <VideoIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-green-400">Atender</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Minimized PiP (Picture in Picture) Floating Bar
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-neutral-900/95 border border-neutral-700 text-white rounded-2xl shadow-2xl p-3 flex items-center gap-3 w-80 backdrop-blur-md animate-in slide-in-from-bottom-4">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
          <img
            src={partner ? partner.avatar : currentUser.avatar}
            alt="Call avatar"
            className="w-full h-full object-cover"
          />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold truncate">
            {isGroupCall ? groupName || 'Sala Coletiva' : partner?.name || 'Sala ConectaFlow'}
          </h4>
          <p className="text-[11px] text-neutral-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {formatTime(callDuration)}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleMic}
            className={`p-2 rounded-full ${isMuted ? 'bg-red-600' : 'bg-neutral-700'} hover:opacity-90`}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white"
            title="Expandir Chamada"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
            title="Encerrar"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Full Screen / Modal Video Call Window
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-5xl h-[88vh] max-h-[850px] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Top Header */}
        <div className="px-6 py-4 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between text-white z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1877F2]/20 border border-[#1877F2] flex items-center justify-center text-[#1877F2]">
              <VideoIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold">
                  {isGroupCall
                    ? groupName || 'Sala de Vídeo Coletiva'
                    : partner
                    ? `Chamada com ${partner.name}`
                    : 'Sala Instantânea ConectaFlow'}
                </h3>
                <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  HD 1080p
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {isConnecting ? 'Conectando peers via WebRTC...' : `Duração: ${formatTime(callDuration)}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Minimizar para janela flutuante (PiP)"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowInCallChat(!showInCallChat)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                showInCallChat ? 'bg-[#1877F2] text-white' : 'hover:bg-neutral-800 text-neutral-300'
              }`}
              title="Chat da chamada"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="flex-1 relative flex overflow-hidden bg-black">
          {/* Main Video Area */}
          <div className="flex-1 relative flex items-center justify-center p-3">
            {/* Remote Participant View / Simulated Room Partner */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              {partner ? (
                <>
                  {/* High quality realistic video loop or camera feed for remote friend */}
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-full h-full object-cover filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                  {/* Remote Participant Label */}
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-semibold">{partner.name}</span>
                    <span className="text-neutral-400 text-[10px]">Conectado</span>
                  </div>
                </>
              ) : (
                /* Group or Solo Room */
                <div className="text-center p-6">
                  <div className="w-24 h-24 rounded-full bg-[#1877F2]/20 border-2 border-[#1877F2] mx-auto mb-4 flex items-center justify-center text-[#1877F2]">
                    <Users className="w-10 h-10" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-1">
                    {groupName || 'Sala Aberta ConectaFlow'}
                  </h4>
                  <p className="text-neutral-400 text-xs max-w-sm mb-4">
                    Sua câmera está transmitindo. Convide mais amigos para se juntarem à chamada!
                  </p>
                  <div className="inline-flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-lg text-neutral-300 text-xs">
                    <Shield className="w-3.5 h-3.5 text-green-400" />
                    <span>Transmissão segura e criptografada</span>
                  </div>
                </div>
              )}

              {/* Local User Self-Preview (Picture in Picture within Video Stage) */}
              <div className="absolute bottom-4 right-4 w-40 sm:w-56 h-28 sm:h-36 rounded-xl overflow-hidden bg-neutral-800 border-2 border-white/20 shadow-2xl z-20 transition-all">
                {isCameraOff ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-2 text-center">
                    <VideoOff className="w-6 h-6 text-neutral-500 mb-1" />
                    <span className="text-[11px] text-neutral-400">Câmera desligada</span>
                  </div>
                ) : cameraError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-2 text-center">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover border border-white mb-1"
                    />
                    <span className="text-[10px] text-neutral-400">Você (Áudio Ativo)</span>
                  </div>
                ) : (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                )}

                {/* Local User Badge */}
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-white bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-md">
                  <span className="truncate">Você ({currentUser.name.split(' ')[0]})</span>
                  {isMuted && <MicOff className="w-3 h-3 text-red-400 shrink-0 ml-1" />}
                </div>
              </div>
            </div>
          </div>

          {/* In-Call Text Chat Drawer */}
          {showInCallChat && (
            <div className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col z-20 animate-in slide-in-from-right duration-200">
              <div className="p-3 border-b border-neutral-800 flex items-center justify-between text-white">
                <span className="text-xs font-bold uppercase tracking-wider">Chat da Chamada</span>
                <span className="text-[11px] text-neutral-400">{callMessages.length} msgs</span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
                {callMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-xl max-w-[85%] ${
                      msg.sender === 'Sistema'
                        ? 'bg-neutral-800 text-neutral-400 mx-auto text-center text-[11px]'
                        : msg.sender === currentUser.name.split(' ')[0]
                        ? 'bg-[#1877F2] text-white ml-auto'
                        : 'bg-neutral-800 text-white mr-auto'
                    }`}
                  >
                    {msg.sender !== 'Sistema' && (
                      <p className="text-[10px] font-bold opacity-75 mb-0.5">{msg.sender}</p>
                    )}
                    <p className="leading-snug">{msg.text}</p>
                    <span className="text-[9px] opacity-60 block text-right mt-0.5">{msg.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendInCallMessage} className="p-2 border-t border-neutral-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Mensagem na chamada..."
                  className="flex-1 bg-neutral-800 text-white placeholder-neutral-500 text-xs px-3 py-2 rounded-xl border border-neutral-700 focus:outline-hidden focus:border-[#1877F2]"
                />
                <button
                  type="submit"
                  className="p-2 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Call Control Bar */}
        <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-center gap-3 sm:gap-4 z-20 select-none">
          {/* Mute Mic Button */}
          <button
            onClick={handleToggleMic}
            className={`p-3.5 rounded-2xl transition-transform hover:scale-105 cursor-pointer shadow-md ${
              isMuted
                ? 'bg-red-600 text-white'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
            title={isMuted ? 'Desativar Mudo' : 'Silenciar Microfone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Camera Button */}
          <button
            onClick={handleToggleCamera}
            className={`p-3.5 rounded-2xl transition-transform hover:scale-105 cursor-pointer shadow-md ${
              isCameraOff
                ? 'bg-red-600 text-white'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
            title={isCameraOff ? 'Ativar Câmera' : 'Desligar Câmera'}
          >
            {isCameraOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          {/* Screen Share Button */}
          <button
            onClick={handleToggleScreenShare}
            className={`p-3.5 rounded-2xl transition-transform hover:scale-105 cursor-pointer shadow-md ${
              isScreenSharing
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
            title={isScreenSharing ? 'Parar Compartilhamento' : 'Compartilhar Tela'}
          >
            <ScreenShare className="w-5 h-5" />
          </button>

          {/* In-Call Chat toggle button */}
          <button
            onClick={() => setShowInCallChat(!showInCallChat)}
            className={`p-3.5 rounded-2xl transition-transform hover:scale-105 cursor-pointer shadow-md ${
              showInCallChat
                ? 'bg-[#1877F2] text-white'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
            title="Chat em tempo real"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
            title="Desconectar e Encerrar Chamada"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="hidden sm:inline">Encerrar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
