'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Home, 
  Users, 
  MessageCircle, 
  Video, 
  Bell, 
  Plus, 
  X, 
  LogOut, 
  UserCheck, 
  ShieldCheck, 
  Edit3,
  Check,
  CheckCheck,
  Trash2,
  ThumbsUp,
  Heart,
  MessageSquare,
  ShieldAlert,
  Settings,
  Volume2,
  VolumeX,
  Radio,
  Github,
  Globe
} from 'lucide-react';
import { ActiveTab, User, Friend, AppNotification } from '@/lib/types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User & { isAnonymous?: boolean; email?: string | null };
  unreadMessagesCount: number;
  notifications?: AppNotification[];
  onOpenQuickPost: () => void;
  onStartInstantCall: () => void;
  onSelectFriendChat: (friend: Friend) => void;
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  onDeleteNotification?: (id: string) => void;
  onNotificationClick?: (notif: AppNotification) => void;
  onOpenReportsHistory?: () => void;
  friends: Friend[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onLogout?: () => void;
  onEditProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadMessagesCount,
  notifications = [],
  onOpenQuickPost,
  onStartInstantCall,
  onSelectFriendChat,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onDeleteNotification,
  onNotificationClick,
  onOpenReportsHistory,
  friends,
  searchQuery,
  setSearchQuery,
  onLogout,
  onEditProfile,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickChatMenu, setShowQuickChatMenu] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');
  const [showNotifSettings, setShowNotifSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopNotifsEnabled, setDesktopNotifsEnabled] = useState(false);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === 'unread') return !n.isRead;
    return true;
  });

  const handleRequestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setDesktopNotifsEnabled(true);
        new Notification('ConectaFlow', {
          body: 'Notificações ativadas com sucesso!',
          icon: '/favicon.ico',
        });
      } else {
        alert('Permissão para notificações do navegador não foi concedida.');
      }
    } else {
      alert('Seu navegador não suporta notificações de desktop nativas.');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E4E6EB] shadow-xs px-2 sm:px-4 h-14 flex items-center justify-between select-none">
      {/* Left: Brand Logo & Search */}
      <div className="flex items-center gap-2 md:gap-3 flex-1 max-w-xs md:max-w-sm">
        <button
          id="brand-logo-btn"
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-2 group cursor-pointer text-left focus:outline-hidden"
          title="ConectaFlow Início"
        >
          <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-xs group-hover:bg-[#166FE5] transition-colors">
            <span className="font-black text-xl tracking-tighter">CF</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold tracking-tight text-[#1877F2] group-hover:text-[#166FE5] transition-colors">
              Conecta<span className="text-[#050505]">Flow</span>
            </span>
          </div>
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#65676B]">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="navbar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar no ConectaFlow..."
            className="w-full pl-9 pr-8 py-2 bg-[#F0F2F5] hover:bg-[#E4E6EB] focus:bg-white text-sm text-[#050505] placeholder-[#65676B] rounded-full border border-transparent focus:border-[#1877F2] focus:outline-hidden transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#65676B] hover:text-[#050505]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Center: Main Navigation Tabs */}
      <nav className="flex items-center justify-center gap-1 sm:gap-2 flex-1 max-w-lg h-full">
        {/* Feed Tab */}
        <button
          id="nav-tab-feed"
          onClick={() => setActiveTab('feed')}
          className={`relative h-full flex-1 max-w-28 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'feed'
              ? 'text-[#1877F2] font-semibold'
              : 'text-[#65676B] hover:bg-[#F2F2F2] rounded-lg'
          }`}
          title="Feed Dinâmico"
        >
          <Home className={`w-6 h-6 ${activeTab === 'feed' ? 'stroke-[2.5]' : ''}`} />
          {activeTab === 'feed' && (
            <span className="absolute bottom-0 inset-x-0 h-1 bg-[#1877F2] rounded-t-md" />
          )}
        </button>

        {/* Groups Tab */}
        <button
          id="nav-tab-groups"
          onClick={() => setActiveTab('groups')}
          className={`relative h-full flex-1 max-w-28 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'groups'
              ? 'text-[#1877F2] font-semibold'
              : 'text-[#65676B] hover:bg-[#F2F2F2] rounded-lg'
          }`}
          title="Grupos & Comunidades"
        >
          <Users className={`w-6 h-6 ${activeTab === 'groups' ? 'stroke-[2.5]' : ''}`} />
          {activeTab === 'groups' && (
            <span className="absolute bottom-0 inset-x-0 h-1 bg-[#1877F2] rounded-t-md" />
          )}
        </button>

        {/* Messages Tab */}
        <button
          id="nav-tab-messages"
          onClick={() => setActiveTab('messages')}
          className={`relative h-full flex-1 max-w-28 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'messages'
              ? 'text-[#1877F2] font-semibold'
              : 'text-[#65676B] hover:bg-[#F2F2F2] rounded-lg'
          }`}
          title="Chats Privados"
        >
          <div className="relative">
            <MessageCircle className={`w-6 h-6 ${activeTab === 'messages' ? 'stroke-[2.5]' : ''}`} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#E41E3F] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          {activeTab === 'messages' && (
            <span className="absolute bottom-0 inset-x-0 h-1 bg-[#1877F2] rounded-t-md" />
          )}
        </button>

        {/* Video Calls Tab */}
        <button
          id="nav-tab-videos"
          onClick={() => setActiveTab('videos')}
          className={`relative h-full flex-1 max-w-28 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'text-[#1877F2] font-semibold'
              : 'text-[#65676B] hover:bg-[#F2F2F2] rounded-lg'
          }`}
          title="Chamadas de Vídeo em Tempo Real"
        >
          <div className="relative flex items-center">
            <Video className={`w-6 h-6 ${activeTab === 'videos' ? 'stroke-[2.5]' : ''}`} />
            <span className="absolute -top-1 -right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
            </span>
          </div>
          {activeTab === 'videos' && (
            <span className="absolute bottom-0 inset-x-0 h-1 bg-[#1877F2] rounded-t-md" />
          )}
        </button>

        {/* GitHub.io Tab */}
        <button
          id="nav-tab-github-io"
          onClick={() => setActiveTab('github_io')}
          className={`relative h-full flex-1 max-w-28 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'github_io'
              ? 'text-[#1877F2] font-semibold'
              : 'text-[#65676B] hover:bg-[#F2F2F2] rounded-lg'
          }`}
          title="Hub de Projetos GitHub.io"
        >
          <div className="relative flex items-center">
            <Github className={`w-6 h-6 ${activeTab === 'github_io' ? 'stroke-[2.5] text-[#1877F2]' : 'text-gray-700'}`} />
            <span className="absolute -top-1 -right-2 bg-[#0D1117] text-white text-[9px] font-mono px-1 rounded font-bold">
              .io
            </span>
          </div>
          {activeTab === 'github_io' && (
            <span className="absolute bottom-0 inset-x-0 h-1 bg-[#1877F2] rounded-t-md" />
          )}
        </button>
      </nav>

      {/* Right: Actions & User Menu */}
      <div className="flex items-center gap-1.5 sm:gap-2 justify-end flex-1 max-w-xs">
        {/* Quick Post Button */}
        <button
          id="btn-quick-post"
          onClick={onOpenQuickPost}
          className="hidden lg:flex items-center gap-1.5 bg-[#E7F3FF] hover:bg-[#DBEBFF] text-[#1877F2] px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors"
          title="Criar nova publicação"
        >
          <Plus className="w-4 h-4" />
          <span>Criar</span>
        </button>

        {/* Quick Instant Video Call Button */}
        <button
          id="btn-navbar-instant-call"
          onClick={onStartInstantCall}
          className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166FE5] text-white px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          title="Abrir sala de vídeo imediata"
        >
          <Video className="w-4 h-4" />
          <span className="hidden md:inline">Iniciar Vídeo</span>
        </button>

        {/* Quick Chat Bubble Toggle */}
        <div className="relative">
          <button
            id="btn-navbar-quick-chat"
            onClick={() => {
              setShowQuickChatMenu(!showQuickChatMenu);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="w-9 h-9 rounded-full bg-[#E4E6EB] hover:bg-[#D8DADF] flex items-center justify-center text-[#050505] cursor-pointer transition-colors"
            title="Mensagens Rápidas"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* Quick Chat Dropdown */}
          {showQuickChatMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#E4E6EB] py-2 z-50">
              <div className="px-4 py-2 border-b border-[#E4E6EB] flex items-center justify-between">
                <span className="font-bold text-base text-[#050505]">Conversas Rápidas</span>
                <button 
                  onClick={() => {
                    setActiveTab('messages');
                    setShowQuickChatMenu(false);
                  }}
                  className="text-xs text-[#1877F2] hover:underline font-semibold"
                >
                  Abrir no Messenger
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#F0F2F5]">
                {friends.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#65676B]">
                    Nenhum outro usuário registrado ainda.
                  </div>
                ) : (
                  friends.slice(0, 5).map((friend) => (
                    <div
                      key={friend.id}
                      onClick={() => {
                        onSelectFriendChat(friend);
                        setShowQuickChatMenu(false);
                      }}
                      className="px-3 py-2.5 hover:bg-[#F2F2F2] flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {friend.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#31A24C] border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#050505] truncate">{friend.name}</p>
                        <p className="text-xs text-[#65676B] truncate">
                          {friend.isOnline ? 'Online agora' : friend.lastSeen || 'Offline'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="btn-navbar-notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowQuickChatMenu(false);
              setShowUserMenu(false);
              setShowNotifSettings(false);
            }}
            className="relative w-9 h-9 rounded-full bg-[#E4E6EB] hover:bg-[#D8DADF] flex items-center justify-center text-[#050505] cursor-pointer transition-colors"
            title="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E41E3F] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center ring-2 ring-white">
                {unreadNotifsCount > 99 ? '99+' : unreadNotifsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E4E6EB] py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="px-4 py-2.5 border-b border-[#E4E6EB] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#050505]">Notificações</h3>
                  <p className="text-[11px] text-[#65676B]">
                    {unreadNotifsCount > 0 ? `${unreadNotifsCount} novas não lidas` : 'Tudo lido e atualizado'}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {unreadNotifsCount > 0 && onMarkAllNotificationsAsRead && (
                    <button
                      onClick={() => onMarkAllNotificationsAsRead()}
                      className="p-1.5 text-xs text-[#1877F2] hover:bg-blue-50 rounded-lg font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="Marcar todas como lidas"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Ler todas</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifSettings(!showNotifSettings)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      showNotifSettings 
                        ? 'bg-[#1877F2] text-white' 
                        : 'text-[#65676B] hover:bg-[#F2F2F2]'
                    }`}
                    title="Configurar preferências de notificação"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification Settings Panel */}
              {showNotifSettings ? (
                <div className="p-4 space-y-3 bg-[#F9FAFB] border-b border-[#E4E6EB] text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E4E6EB]">
                    <span className="font-bold text-[#050505]">Configurações de Alerta</span>
                    <button
                      onClick={() => setShowNotifSettings(false)}
                      className="text-xs text-[#1877F2] font-semibold hover:underline"
                    >
                      Voltar
                    </button>
                  </div>

                  {/* Sound toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-[#1877F2]" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-[#65676B]" />
                      )}
                      <div>
                        <p className="font-semibold text-[#050505]">Som de alerta</p>
                        <p className="text-[10px] text-[#65676B]">Tocar som ao receber nova notificação</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        soundEnabled ? 'bg-[#1877F2]' : 'bg-neutral-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          soundEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Browser notification permission */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleRequestBrowserPermission}
                      className="w-full py-2 px-3 bg-white hover:bg-neutral-50 border border-[#CCD0D5] rounded-xl font-semibold text-[#050505] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Radio className="w-3.5 h-3.5 text-[#1877F2]" />
                      <span>Ativar Notificações do Navegador (Push)</span>
                    </button>
                  </div>

                  {/* Security & Reports shortcut */}
                  {onOpenReportsHistory && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNotifications(false);
                          onOpenReportsHistory();
                        }}
                        className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                        <span>Ver Minhas Denúncias & Moderação</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Filter Pill Tabs */
                <div className="px-4 py-2 bg-white flex items-center gap-2 border-b border-[#F0F2F5]">
                  <button
                    onClick={() => setNotifFilter('all')}
                    className={`text-xs px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                      notifFilter === 'all'
                        ? 'bg-[#E7F3FF] text-[#1877F2]'
                        : 'text-[#65676B] hover:bg-[#F2F2F2]'
                    }`}
                  >
                    Todas ({notifications.length})
                  </button>
                  <button
                    onClick={() => setNotifFilter('unread')}
                    className={`text-xs px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                      notifFilter === 'unread'
                        ? 'bg-[#E7F3FF] text-[#1877F2]'
                        : 'text-[#65676B] hover:bg-[#F2F2F2]'
                    }`}
                  >
                    Não lidas ({unreadNotifsCount})
                  </button>
                </div>
              )}

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto divide-y divide-[#F0F2F5]">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#65676B] space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#F0F2F5] flex items-center justify-center mx-auto text-[#65676B]">
                      <Bell className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-sm text-[#050505]">
                      {notifFilter === 'unread' ? 'Nenhuma não lida' : 'Você está em dia!'}
                    </p>
                    <p className="max-w-xs mx-auto text-[#65676B] leading-relaxed">
                      {notifFilter === 'unread'
                        ? 'Todas as suas notificações foram marcadas como lidas.'
                        : 'Interações em suas publicações, mensagens e atualizações de moderação aparecerão aqui em tempo real.'}
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => {
                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (onNotificationClick) {
                            onNotificationClick(notif);
                          }
                          if (!notif.isRead && onMarkNotificationAsRead) {
                            onMarkNotificationAsRead(notif.id);
                          }
                        }}
                        className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors relative group ${
                          notif.isRead ? 'bg-white hover:bg-[#F2F2F2]' : 'bg-[#E7F3FF]/40 hover:bg-[#E7F3FF]/70'
                        }`}
                      >
                        {/* Avatar with type badge */}
                        <div className="relative shrink-0">
                          {notif.senderAvatar ? (
                            <img
                              src={notif.senderAvatar}
                              alt={notif.senderName || 'Remetente'}
                              className="w-11 h-11 rounded-full object-cover border border-[#E4E6EB]"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-sm">
                              CF
                            </div>
                          )}

                          {/* Action badge overlay */}
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white ring-2 ring-white ${
                              notif.type === 'like'
                                ? 'bg-[#1877F2]'
                                : notif.type === 'comment'
                                ? 'bg-[#45BD62]'
                                : notif.type === 'message'
                                ? 'bg-[#0084FF]'
                                : notif.type === 'report_resolved' || notif.type === 'system'
                                ? 'bg-[#E41E3F]'
                                : 'bg-indigo-600'
                            }`}
                          >
                            {notif.type === 'like' && <ThumbsUp className="w-2.5 h-2.5" />}
                            {notif.type === 'comment' && <MessageSquare className="w-2.5 h-2.5" />}
                            {notif.type === 'message' && <MessageCircle className="w-2.5 h-2.5" />}
                            {(notif.type === 'system' || notif.type === 'report_resolved') && (
                              <ShieldAlert className="w-2.5 h-2.5" />
                            )}
                            {notif.type === 'friend_request' && <Users className="w-2.5 h-2.5" />}
                          </div>
                        </div>

                        {/* Content text */}
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-xs text-[#050505] leading-snug">
                            {notif.senderName && (
                              <strong className="font-bold mr-1">{notif.senderName}</strong>
                            )}
                            <span>{notif.content || notif.title}</span>
                          </p>
                          <span
                            className={`text-[11px] mt-1 block ${
                              notif.isRead ? 'text-[#65676B]' : 'text-[#1877F2] font-semibold'
                            }`}
                          >
                            {notif.timestamp}
                          </span>
                        </div>

                        {/* Status dot or Actions */}
                        <div
                          className="shrink-0 flex items-center gap-1 self-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!notif.isRead && (
                            <span className="w-2.5 h-2.5 bg-[#1877F2] rounded-full mr-1" title="Não lida" />
                          )}

                          {/* Quick delete / dismiss */}
                          {onDeleteNotification && (
                            <button
                              onClick={() => onDeleteNotification(notif.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-neutral-200 text-[#65676B] transition-opacity"
                              title="Remover notificação"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-neutral-500 hover:text-red-600" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            id="btn-navbar-profile"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowQuickChatMenu(false);
            }}
            className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-[#1877F2]/50 cursor-pointer transition-all"
            title={`Perfil de ${currentUser.name}`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-[#E4E6EB]"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E4E6EB] p-2 z-50">
              <div className="p-3 bg-[#F0F2F5] rounded-lg flex items-center gap-3 mb-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full object-cover border border-white"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-[#050505] truncate">{currentUser.name}</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentUser.isAnonymous
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {currentUser.isAnonymous ? '👤 Anônimo' : '🌐 Google Auth'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-sm text-[#050505]">
                {onEditProfile && (
                  <button
                    onClick={() => {
                      onEditProfile();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#F2F2F2] rounded-lg text-left cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-[#65676B]" />
                    <span>Editar Meu Perfil</span>
                  </button>
                )}
                <Link
                  href="/"
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#F2F2F2] rounded-lg text-left cursor-pointer text-[#1877F2] font-semibold"
                >
                  <Globe className="w-4 h-4 text-[#1877F2]" />
                  <span>Página Inicial / Landing Page</span>
                </Link>
                <button
                  onClick={() => {
                    setActiveTab('feed');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#F2F2F2] rounded-lg text-left cursor-pointer"
                >
                  <Home className="w-4 h-4 text-[#65676B]" />
                  <span>Meu Feed & Linha do Tempo</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('videos');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#F2F2F2] rounded-lg text-left cursor-pointer text-[#1877F2] font-semibold"
                >
                  <Video className="w-4 h-4" />
                  <span>Central de Vídeo Chamadas</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('groups');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#F2F2F2] rounded-lg text-left cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#65676B]" />
                  <span>Minhas Comunidades & Grupos</span>
                </button>
                <Link
                  href="/github-io"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#F2F2F2] rounded-lg text-left cursor-pointer text-slate-800 font-semibold"
                >
                  <Github className="w-4 h-4 text-[#0D1117]" />
                  <span>Página Dedicada Hub github.io</span>
                </Link>

                {onOpenReportsHistory && (
                  <button
                    onClick={() => {
                      onOpenReportsHistory();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 text-red-700 rounded-lg text-left cursor-pointer font-medium"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Central de Denúncias & Moderação</span>
                  </button>
                )}

                <div className="h-px bg-[#E4E6EB] my-1" />

                {onLogout && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da Conta</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
