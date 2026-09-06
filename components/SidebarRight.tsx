'use client';

import React from 'react';
import { Video, MessageCircle, UserPlus, Users, Share2, Sparkles } from 'lucide-react';
import { Friend } from '@/lib/types';

interface SidebarRightProps {
  friends: Friend[];
  onStartVideoCallWithFriend: (friend: Friend) => void;
  onOpenChatWithFriend: (friend: Friend) => void;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({
  friends,
  onStartVideoCallWithFriend,
  onOpenChatWithFriend,
}) => {
  const onlineFriends = friends.filter((f) => f.isOnline);
  const offlineFriends = friends.filter((f) => !f.isOnline);

  return (
    <aside className="hidden xl:flex flex-col w-72 2xl:w-80 p-2 shrink-0 overflow-y-auto max-h-[calc(100vh-3.5rem)] sticky top-14 select-none">
      {/* Real Time Connection Status Box */}
      <div className="mb-3 p-3 bg-white rounded-xl border border-[#E4E6EB] shadow-2xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-[#65676B] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#31A24C] inline-block animate-pulse" />
            Banco Firestore
          </span>
          <span className="text-[11px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full">
            Em Tempo Real
          </span>
        </div>
        <p className="text-xs text-[#65676B] leading-relaxed">
          Todos os contatos aqui são usuários reais autenticados com Google ou Anônimo no ConectaFlow.
        </p>
      </div>

      {/* Online Contacts Header */}
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#65676B] uppercase tracking-wider">
            Usuários Cadastrados
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#65676B]">
          <span className="text-xs font-semibold text-[#31A24C]">
            {onlineFriends.length} ativos
          </span>
        </div>
      </div>

      {/* Friends list or empty state */}
      {friends.length === 0 ? (
        <div className="p-4 bg-white rounded-xl border border-[#E4E6EB] text-center space-y-2">
          <Users className="w-8 h-8 text-[#CCD0D5] mx-auto" />
          <p className="text-xs font-semibold text-[#050505]">Nenhum outro usuário logado ainda</p>
          <p className="text-[11px] text-[#65676B] leading-relaxed">
            Abra o app em uma <strong>nova aba</strong> ou janela anônima para testar chat e chamadas de vídeo ao vivo entre duas pessoas reais!
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {/* Online Friends List */}
          {onlineFriends.map((friend) => (
            <div
              key={friend.id}
              className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#E4E6EB]/60 cursor-pointer transition-colors"
            >
              <div
                onClick={() => onOpenChatWithFriend(friend)}
                className="flex items-center gap-3 min-w-0 flex-1"
              >
                <div className="relative shrink-0">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#E4E6EB]"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#31A24C] border-2 border-white rounded-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#050505] truncate group-hover:text-[#1877F2]">
                    {friend.name}
                  </p>
                  <p className="text-[11px] text-[#65676B] truncate">
                    {friend.statusMessage || 'Online agora'}
                  </p>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartVideoCallWithFriend(friend);
                  }}
                  className="w-7 h-7 rounded-full bg-[#E7F3FF] hover:bg-[#1877F2] text-[#1877F2] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                  title={`Iniciar chamada de vídeo com ${friend.name}`}
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenChatWithFriend(friend);
                  }}
                  className="w-7 h-7 rounded-full bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#050505] flex items-center justify-center transition-colors"
                  title={`Enviar mensagem para ${friend.name}`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Offline Friends Section */}
          {offlineFriends.length > 0 && (
            <div className="mt-3">
              <span className="text-[11px] font-semibold text-[#65676B] uppercase tracking-wider px-2 block mb-1">
                Offline ({offlineFriends.length})
              </span>
              <div className="space-y-0.5 opacity-75 hover:opacity-100 transition-opacity">
                {offlineFriends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => onOpenChatWithFriend(friend)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[#E4E6EB]/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-8 h-8 rounded-full object-cover filter grayscale-30"
                        />
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-gray-400 border border-white rounded-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#050505] truncate">{friend.name}</p>
                        <p className="text-[10px] text-[#65676B]">{friend.lastSeen || 'Offline'}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartVideoCallWithFriend(friend);
                      }}
                      className="w-6 h-6 rounded-full text-[#65676B] hover:text-[#1877F2] hover:bg-white flex items-center justify-center"
                      title="Convidar para vídeo chamada"
                    >
                      <Video className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
