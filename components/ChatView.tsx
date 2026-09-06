'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Video, 
  Phone, 
  MoreVertical, 
  Send, 
  Smile, 
  Image as ImageIcon, 
  ThumbsUp, 
  CheckCheck,
  ArrowLeft,
  Circle,
  Paperclip,
  UploadCloud,
  Loader2,
  X
} from 'lucide-react';
import { Friend, Message, User, Attachment } from '@/lib/types';
import { processUploadedFile } from '@/lib/attachment-utils';
import { AttachmentView } from './AttachmentView';

interface ChatViewProps {
  currentUser: User;
  friends: Friend[];
  messages: Record<string, Message[]>;
  activeFriendId: string;
  onSelectFriend: (friendId: string) => void;
  onSendMessage: (friendId: string, text: string, attachments?: Attachment[]) => void;
  onStartVideoCallWithFriend: (friend: Friend) => void;
  onStartAudioCallWithFriend: (friend: Friend) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  friends,
  messages,
  activeFriendId,
  onSelectFriend,
  onSendMessage,
  onStartVideoCallWithFriend,
  onStartAudioCallWithFriend,
}) => {
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const activeFriend = friends.find((f) => f.id === activeFriendId) || friends[0];
  const activeConversation = (activeFriend && messages[activeFriend.id]) || [];

  // Auto scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation, pendingAttachments]);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const fileList = Array.from(files);
      const processed: Attachment[] = [];

      for (const file of fileList) {
        if (file.size > 10 * 1024 * 1024) {
          alert(`O arquivo "${file.name}" ultrapassa o limite de 10MB.`);
          continue;
        }
        const att = await processUploadedFile(file);
        processed.push(att);
      }

      setPendingAttachments((prev) => [...prev, ...processed]);
    } catch (err) {
      console.error('Erro ao processar anexos do chat:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemovePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && pendingAttachments.length === 0) || !activeFriend) return;

    onSendMessage(
      activeFriend.id, 
      inputText.trim(), 
      pendingAttachments.length > 0 ? pendingAttachments : undefined
    );

    setInputText('');
    setPendingAttachments([]);
  };

  const handleQuickThumb = () => {
    if (!activeFriend) return;
    onSendMessage(activeFriend.id, '👍');
  };

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E4E6EB] shadow-xs overflow-hidden h-[calc(100vh-5.5rem)] flex flex-col md:flex-row">
      {/* Hidden File Pickers */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*,video/*"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        multiple
        className="hidden"
      />

      {/* Left Column: Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-[#E4E6EB] flex flex-col shrink-0">
        {/* Header */}
        <div className="p-3.5 border-b border-[#E4E6EB]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-black text-[#050505] tracking-tight">Chats Privados</h2>
            <span className="text-xs bg-[#E7F3FF] text-[#1877F2] font-semibold px-2.5 py-1 rounded-full">
              {friends.filter((f) => f.isOnline).length} amigos online
            </span>
          </div>

          {/* Search Contacts */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#65676B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Pesquisar no Messenger..."
              className="w-full pl-9 pr-4 py-2 bg-[#F0F2F5] hover:bg-[#E4E6EB] focus:bg-white text-xs text-[#050505] rounded-full border border-transparent focus:border-[#1877F2] focus:outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Friends Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F0F2F5]">
          {filteredFriends.length === 0 ? (
            <div className="p-6 text-center text-[#65676B] text-xs space-y-2">
              <p className="font-semibold text-[#050505]">Nenhum outro contato encontrado</p>
              <p className="leading-relaxed">
                Assim que outros usuários entrarem no ConectaFlow (via Google ou Anônimo), eles aparecerão aqui para conversar em tempo real.
              </p>
            </div>
          ) : (
            filteredFriends.map((friend) => {
              const lastMsg = messages[friend.id]?.slice(-1)[0];
              const isCurrent = friend.id === activeFriend?.id;

              return (
                <div
                  key={friend.id}
                  onClick={() => onSelectFriend(friend.id)}
                  className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                    isCurrent ? 'bg-[#E7F3FF]/60' : 'hover:bg-[#F2F2F2]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#E4E6EB]"
                    />
                    {friend.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#31A24C] border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#050505] truncate">{friend.name}</h4>
                      {lastMsg && (
                        <span className="text-[10px] text-[#65676B]">{lastMsg.timestamp}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#65676B] truncate mt-0.5">
                      {lastMsg ? (
                        lastMsg.attachments && lastMsg.attachments.length > 0 ? (
                          <span className="text-[#1877F2] font-semibold">
                            📎 {lastMsg.attachments.length} anexo(s) {lastMsg.text ? `• ${lastMsg.text}` : ''}
                          </span>
                        ) : (
                          lastMsg.text
                        )
                      ) : (
                        friend.statusMessage || 'Iniciar uma nova conversa'
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Active Conversation */}
      {activeFriend ? (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-1 flex flex-col bg-[#F9FAFB] relative transition-all ${
            isDraggingOver ? 'ring-2 ring-[#1877F2] bg-blue-50/20' : ''
          }`}
        >
          {/* Drag Overlay */}
          {isDraggingOver && (
            <div className="absolute inset-0 z-40 bg-blue-50/90 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
              <UploadCloud className="w-12 h-12 text-[#1877F2] animate-bounce mb-2" />
              <h4 className="text-base font-bold text-[#050505]">Solte os arquivos aqui</h4>
              <p className="text-xs text-[#65676B] mt-1">Envie fotos, vídeos ou documentos diretamente nesta conversa</p>
            </div>
          )}

          {/* Conversation Header */}
          <div className="p-3 sm:px-5 bg-white border-b border-[#E4E6EB] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeFriend.avatar}
                  alt={activeFriend.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E4E6EB]"
                />
                {activeFriend.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#31A24C] border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#050505]">{activeFriend.name}</h3>
                <p className="text-xs text-[#65676B]">
                  {activeFriend.isOnline ? 'Online agora' : activeFriend.lastSeen || 'Offline'}
                </p>
              </div>
            </div>

            {/* Action buttons (Call, Video, Settings) */}
            <div className="flex items-center gap-1 sm:gap-2 text-[#1877F2]">
              <button
                onClick={() => onStartAudioCallWithFriend(activeFriend)}
                className="p-2 rounded-full hover:bg-[#F2F2F2] transition-colors"
                title="Chamada de voz"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                onClick={() => onStartVideoCallWithFriend(activeFriend)}
                className="p-2 rounded-full hover:bg-[#F2F2F2] transition-colors"
                title="Chamada de vídeo"
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-[#F2F2F2] text-[#65676B] transition-colors"
                title="Mais opções"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeConversation.map((msg) => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMine && (
                    <img
                      src={activeFriend.avatar}
                      alt={activeFriend.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-[75%] sm:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-2xs ${
                      isMine
                        ? 'bg-[#0084FF] text-white rounded-br-xs'
                        : 'bg-white text-[#050505] border border-[#E4E6EB] rounded-bl-xs'
                    }`}
                  >
                    {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                    
                    {/* Render message attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <AttachmentView attachments={msg.attachments} layout="chat" />
                    )}

                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isMine ? 'text-white/80' : 'text-[#65676B]'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMine && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Pending Attachments Bar (Before Sending) */}
          {pendingAttachments.length > 0 && (
            <div className="px-3 py-2 bg-[#F0F2F5] border-t border-[#E4E6EB]">
              <AttachmentView
                attachments={pendingAttachments}
                onRemoveAttachment={handleRemovePendingAttachment}
                isEditable={true}
              />
            </div>
          )}

          {/* Loading status */}
          {isProcessing && (
            <div className="px-4 py-1.5 bg-blue-50 text-[11px] font-semibold text-[#1877F2] flex items-center gap-2 border-t border-blue-100">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Otimizando e preparando anexos...</span>
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-[#E4E6EB] flex items-center gap-2"
          >
            <div className="flex items-center gap-1 text-[#65676B]">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-[#F0F2F5] transition-colors cursor-pointer"
                title="Enviar Foto / Vídeo"
              >
                <ImageIcon className="w-5 h-5 text-[#45BD62]" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-[#F0F2F5] transition-colors cursor-pointer"
                title="Anexar arquivo / documento / PDF"
              >
                <Paperclip className="w-5 h-5 text-[#1877F2]" />
              </button>
              <button
                type="button"
                onClick={() => setInputText((prev) => prev + ' 😊')}
                className="p-2 rounded-full hover:bg-[#F0F2F5] transition-colors cursor-pointer"
                title="Inserir Emoji"
              >
                <Smile className="w-5 h-5 text-[#F7B125]" />
              </button>
            </div>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite uma mensagem ou anexe arquivos..."
              className="flex-1 bg-[#F0F2F5] hover:bg-[#E4E6EB] focus:bg-white text-sm text-[#050505] placeholder-[#65676B] px-4 py-2.5 rounded-full border border-transparent focus:border-[#1877F2] focus:outline-hidden transition-all"
            />

            {inputText.trim() || pendingAttachments.length > 0 ? (
              <button
                type="submit"
                disabled={isProcessing}
                className="p-2.5 bg-[#0084FF] hover:bg-[#0073E6] disabled:bg-neutral-300 text-white rounded-full transition-colors cursor-pointer shadow-xs"
                title="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleQuickThumb}
                className="p-2.5 text-[#0084FF] hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                title="Curtida rápida"
              >
                <ThumbsUp className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 text-center text-[#65676B]">
          <p>Selecione um amigo para iniciar uma conversa privada.</p>
        </div>
      )}
    </div>
  );
};
