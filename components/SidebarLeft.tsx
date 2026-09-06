'use client';

import React from 'react';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Video, 
  Bookmark, 
  Clock, 
  Sparkles, 
  Calendar,
  Compass,
  Tv,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { ActiveTab, User, Group } from '@/lib/types';

interface SidebarLeftProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User;
  groups: Group[];
  onSelectGroup: (group: Group) => void;
  onStartInstantCall: () => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  groups,
  onSelectGroup,
  onStartInstantCall,
}) => {
  const userGroups = groups.filter((g) => g.isMember);

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 p-2 shrink-0 overflow-y-auto max-h-[calc(100vh-3.5rem)] sticky top-14 select-none">
      {/* User profile row */}
      <div
        onClick={() => setActiveTab('feed')}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#E4E6EB]/60 cursor-pointer transition-colors mb-1"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover border border-[#E4E6EB]"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#050505] truncate">{currentUser.name}</p>
          <p className="text-xs text-[#65676B] truncate">
            {currentUser.work || currentUser.bio || (currentUser.isAnonymous ? 'Modo Anônimo' : 'Membro ConectaFlow')}
          </p>
        </div>
      </div>

      {/* Main navigation list */}
      <div className="space-y-0.5 pt-1">
        <button
          onClick={() => setActiveTab('feed')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors ${
            activeTab === 'feed'
              ? 'bg-[#E7F3FF] text-[#1877F2] font-semibold'
              : 'text-[#050505] hover:bg-[#E4E6EB]/60'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'feed' ? 'text-[#1877F2]' : 'text-[#1877F2]'}`} />
          <span className="text-sm">Página Inicial</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors ${
            activeTab === 'videos'
              ? 'bg-[#E7F3FF] text-[#1877F2] font-semibold'
              : 'text-[#050505] hover:bg-[#E4E6EB]/60'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <Video className="w-5 h-5 text-[#2E89FF]" />
            <span className="text-sm">Vídeo Chamadas</span>
          </div>
          <span className="bg-[#10B981] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            Ao Vivo
          </span>
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors ${
            activeTab === 'groups'
              ? 'bg-[#E7F3FF] text-[#1877F2] font-semibold'
              : 'text-[#050505] hover:bg-[#E4E6EB]/60'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <Users className="w-5 h-5 text-[#1877F2]" />
            <span className="text-sm">Grupos & Comunidades</span>
          </div>
          <span className="text-xs bg-[#E4E6EB] text-[#050505] font-semibold px-2 py-0.5 rounded-full">
            {userGroups.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors ${
            activeTab === 'messages'
              ? 'bg-[#E7F3FF] text-[#1877F2] font-semibold'
              : 'text-[#050505] hover:bg-[#E4E6EB]/60'
          }`}
        >
          <MessageCircle className="w-5 h-5 text-[#A033FF]" />
          <span className="text-sm">Chats Privados</span>
        </button>

        {/* Action card for instant video call */}
        <div className="p-3 my-2 bg-gradient-to-br from-[#E7F3FF] to-blue-50 border border-[#1877F2]/20 rounded-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Video className="w-4 h-4 text-[#1877F2]" />
            <span className="text-xs font-bold text-[#1877F2] uppercase tracking-wide">
              Sala Instantânea
            </span>
          </div>
          <p className="text-xs text-[#65676B] mb-2.5 leading-relaxed">
            Reúna amigos em uma chamada de vídeo sem limites com câmera e microfone real.
          </p>
          <button
            onClick={onStartInstantCall}
            className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Criar Sala de Vídeo</span>
          </button>
        </div>
      </div>

      <div className="h-px bg-[#E4E6EB] my-2" />

      {/* Your Groups Shortcuts */}
      <div className="pt-1">
        <div className="flex items-center justify-between px-3 py-1 mb-1">
          <span className="text-xs font-bold text-[#65676B] uppercase tracking-wider">
            Seus Atalhos
          </span>
          <button 
            onClick={() => setActiveTab('groups')}
            className="text-xs text-[#1877F2] hover:underline font-semibold"
          >
            Ver todos
          </button>
        </div>

        <div className="space-y-1">
          {userGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-[#E4E6EB]/60 cursor-pointer transition-colors group"
            >
              <img
                src={group.avatar}
                alt={group.name}
                className="w-7 h-7 rounded-lg object-cover shrink-0 border border-[#E4E6EB]"
              />
              <span className="text-xs font-medium text-[#050505] truncate group-hover:text-[#1877F2]">
                {group.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-6 px-3 text-[11px] text-[#65676B] space-y-1">
        <p className="leading-tight">
          Privacidade • Termos • ConectaFlow Inc. © 2026
        </p>
        <p className="text-[10px] text-[#8C939D]">
          Feito com WebRTC em tempo real e estilo social clássico.
        </p>
      </div>
    </aside>
  );
};
