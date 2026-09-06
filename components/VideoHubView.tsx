'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Users, 
  PhoneCall, 
  Sparkles, 
  ShieldCheck, 
  ScreenShare,
  Radio,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Friend, Group, User } from '@/lib/types';

interface VideoHubViewProps {
  currentUser: User;
  friends: Friend[];
  groups: Group[];
  onStartCallWithFriend: (friend: Friend) => void;
  onStartInstantRoom: () => void;
  onStartGroupCall: (group: Group) => void;
}

export const VideoHubView: React.FC<VideoHubViewProps> = ({
  currentUser,
  friends,
  groups,
  onStartCallWithFriend,
  onStartInstantRoom,
  onStartGroupCall,
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);

  // Test camera preview in Hub
  const startPreview = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        previewStreamRef.current = stream;
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setCameraPermissionGranted(true);
      }
    } catch (err) {
      console.warn('Preview error:', err);
      setCameraPermissionGranted(false);
    }
  };

  const stopPreview = () => {
    if (previewStreamRef.current) {
      previewStreamRef.current.getTracks().forEach((t) => t.stop());
      previewStreamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopPreview();
    };
  }, []);

  const onlineFriends = friends.filter((f) => f.isOnline);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1877F2] via-[#1B74E4] to-[#0A52BE] text-white p-6 sm:p-8 shadow-md">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Radio className="w-3.5 h-3.5 text-green-300 animate-pulse" />
            <span>WebRTC em Tempo Real • ConectaFlow</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 leading-tight">
            Chamadas de Vídeo com Amigos em Alta Definição
          </h1>
          <p className="text-white/85 text-xs sm:text-sm mb-6 leading-relaxed">
            Conecte-se instantaneamente com áudio e vídeo de latência ultrabaixa. Faça reuniões com
            grupos, compartilhe sua tela ou converse cara a cara no modo janela flutuante.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onStartInstantRoom}
              className="bg-white hover:bg-blue-50 text-[#1877F2] font-bold text-sm px-6 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>Abrir Minha Sala de Vídeo</span>
            </button>

            <button
              onClick={cameraActive ? stopPreview : startPreview}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold text-sm px-4 py-3 rounded-2xl backdrop-blur-md transition-colors cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{cameraActive ? 'Fechar Teste de Câmera' : 'Testar Minha Câmera'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Camera Self-Test Stage if active */}
      {cameraActive && (
        <div className="bg-white rounded-2xl border border-[#E4E6EB] p-4 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h3 className="font-bold text-sm text-[#050505]">Teste de Câmera e Microfone</h3>
            </div>
            <button
              onClick={stopPreview}
              className="text-xs text-[#65676B] hover:text-[#050505] font-semibold"
            >
              Desativar pré-visualização
            </button>
          </div>

          <div className="relative w-full max-w-lg mx-auto h-64 rounded-xl overflow-hidden bg-neutral-900 shadow-inner">
            <video
              ref={previewVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform -scale-x-100"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-1 rounded-md">
              Sua imagem está nítida e pronta para chamadas
            </div>
          </div>
        </div>
      )}

      {/* Grid: Call Friends Section & Group Hangouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Online Friends Ready to Call */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1877F2]" />
              <h2 className="text-lg font-bold text-[#050505]">
                Amigos Disponíveis para Chamada ({onlineFriends.length})
              </h2>
            </div>
          </div>

          {friends.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E4E6EB] p-8 text-center text-[#65676B] space-y-2">
              <Users className="w-10 h-10 text-[#CCD0D5] mx-auto" />
              <h4 className="font-bold text-sm text-[#050505]">Nenhum outro usuário cadastrado no momento</h4>
              <p className="text-xs leading-relaxed max-w-md mx-auto">
                Abra uma nova aba ou janela anônima para testar a chamada de vídeo em tempo real entre dois usuários reais, ou clique no botão &ldquo;Abrir Minha Sala de Vídeo&rdquo; acima!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white rounded-2xl border border-[#E4E6EB] p-3.5 shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#E4E6EB]"
                      />
                      {friend.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#31A24C] border-2 border-white rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#050505] truncate">{friend.name}</h4>
                      <p className="text-xs text-[#65676B] truncate">
                        {friend.isOnline ? 'Pronto para ligar' : friend.lastSeen || 'Offline'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartCallWithFriend(friend)}
                    className="p-2.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white shadow-xs transition-transform hover:scale-110 cursor-pointer shrink-0"
                    title={`Ligar em vídeo para ${friend.name}`}
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Group Video Rooms & Safety Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E4E6EB] p-4 shadow-2xs">
            <h3 className="font-bold text-sm text-[#050505] mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F7B125]" />
              <span>Salas de Vídeo em Grupos</span>
            </h3>

            <div className="space-y-2.5">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="p-2.5 bg-[#F9FAFB] hover:bg-[#F0F2F5] rounded-xl border border-[#E4E6EB] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#050505] truncate">{group.name}</p>
                      <p className="text-[11px] text-[#65676B]">
                        {group.memberCount.toLocaleString()} membros
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartGroupCall(group)}
                    className="p-1.5 rounded-lg bg-[#1877F2] hover:bg-[#166FE5] text-white transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                    title="Entrar na sala de vídeo do grupo"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Entrar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E4E6EB] p-4 shadow-2xs">
            <div className="flex items-center gap-2 text-green-700 font-bold text-xs mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Conexão Segura e Criptografada</span>
            </div>
            <p className="text-[11px] text-[#65676B] leading-relaxed">
              Todas as transmissões de vídeo e áudio entre você e seus amigos são transmitidas ponto a ponto
              com segurança máxima.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
