'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Minus, 
  Video, 
  Send, 
  ThumbsUp, 
  Maximize2,
  Paperclip,
  Loader2
} from 'lucide-react';
import { Friend, Message, User, Attachment } from '@/lib/types';
import { processUploadedFile } from '@/lib/attachment-utils';
import { AttachmentView } from './AttachmentView';

interface FloatingChatWindowProps {
  friend: Friend;
  currentUser: User;
  messages: Message[];
  onSendMessage: (friendId: string, text: string, attachments?: Attachment[]) => void;
  onClose: () => void;
  onStartVideoCall: (friend: Friend) => void;
  onExpandToFullChat: () => void;
}

export const FloatingChatWindow: React.FC<FloatingChatWindowProps> = ({
  friend,
  currentUser,
  messages,
  onSendMessage,
  onClose,
  onStartVideoCall,
  onExpandToFullChat,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [text, setText] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized, pendingAttachments]);

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
      console.error('Erro ao processar anexo:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && pendingAttachments.length === 0) return;

    onSendMessage(
      friend.id, 
      text.trim(), 
      pendingAttachments.length > 0 ? pendingAttachments : undefined
    );
    setText('');
    setPendingAttachments([]);
  };

  return (
    <div className="fixed bottom-0 right-4 sm:right-16 z-40 w-80 sm:w-88 bg-white rounded-t-2xl shadow-2xl border border-[#CCD0D5] overflow-hidden flex flex-col transition-all">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        multiple
        className="hidden"
      />

      {/* Mini Window Header */}
      <div
        onClick={() => setIsMinimized(!isMinimized)}
        className="px-3.5 py-2.5 bg-white border-b border-[#E4E6EB] flex items-center justify-between cursor-pointer hover:bg-[#F9FAFB] select-none"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={friend.avatar}
              alt={friend.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            {friend.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#31A24C] border-2 border-white rounded-full" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[#050505] truncate">{friend.name}</h4>
            <p className="text-[10px] text-[#65676B] truncate">
              {friend.isOnline ? 'Ativo agora' : friend.lastSeen || 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onStartVideoCall(friend)}
            className="p-1.5 rounded-full hover:bg-[#E7F3FF] text-[#1877F2] transition-colors"
            title="Iniciar chamada de vídeo"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={onExpandToFullChat}
            className="p-1.5 rounded-full hover:bg-[#F2F2F2] text-[#65676B] transition-colors"
            title="Abrir no Messenger completo"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-full hover:bg-[#F2F2F2] text-[#65676B] transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2F2F2] text-[#65676B] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mini Window Body (Hidden when minimized) */}
      {!isMinimized && (
        <>
          <div className="h-72 overflow-y-auto p-3 space-y-2 bg-[#F9FAFB] text-xs">
            {messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-1.5 ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMine && (
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-5 h-5 rounded-full object-cover shrink-0 mb-0.5"
                    />
                  )}
                  <div
                    className={`max-w-[85%] px-3 py-1.5 rounded-2xl ${
                      isMine
                        ? 'bg-[#0084FF] text-white rounded-br-xs'
                        : 'bg-white text-[#050505] border border-[#E4E6EB] rounded-bl-xs'
                    }`}
                  >
                    {msg.text && <p className="leading-snug">{msg.text}</p>}

                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <AttachmentView attachments={msg.attachments} layout="chat" />
                    )}

                    <span
                      className={`text-[9px] block text-right mt-0.5 ${
                        isMine ? 'text-white/70' : 'text-[#65676B]'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Pending Attachments */}
          {pendingAttachments.length > 0 && (
            <div className="p-2 bg-[#F0F2F5] border-t border-[#E4E6EB]">
              <AttachmentView
                attachments={pendingAttachments}
                onRemoveAttachment={(id) => setPendingAttachments((p) => p.filter((a) => a.id !== id))}
                isEditable={true}
              />
            </div>
          )}

          {isProcessing && (
            <div className="px-3 py-1 bg-blue-50 text-[10px] text-[#1877F2] flex items-center gap-1.5 border-t border-blue-100">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Otimizando anexo...</span>
            </div>
          )}

          {/* Mini Window Input Form */}
          <form
            onSubmit={handleSend}
            className="p-2 bg-white border-t border-[#E4E6EB] flex items-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-[#65676B] hover:text-[#1877F2] hover:bg-[#F0F2F5] rounded-full transition-colors cursor-pointer"
              title="Anexar arquivo"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Aa..."
              className="flex-1 bg-[#F0F2F5] hover:bg-[#E4E6EB] focus:bg-white text-xs px-3 py-1.5 rounded-full border border-transparent focus:border-[#1877F2] focus:outline-hidden"
              autoFocus
            />

            {text.trim() || pendingAttachments.length > 0 ? (
              <button
                type="submit"
                disabled={isProcessing}
                className="p-1.5 bg-[#0084FF] text-white rounded-full hover:bg-[#0073E6] cursor-pointer disabled:bg-neutral-300"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSendMessage(friend.id, '👍')}
                className="p-1.5 text-[#0084FF] hover:bg-blue-50 rounded-full cursor-pointer"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
};
