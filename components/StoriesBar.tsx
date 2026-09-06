'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Heart, Send } from 'lucide-react';
import { Story, User } from '@/lib/types';

interface StoriesBarProps {
  stories: Story[];
  currentUser: User;
  onAddStory: (mediaUrl: string, caption: string) => void;
  onSendStoryReply: (userId: string, replyText: string) => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onAddStory,
  onSendStoryReply,
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStoryImage, setNewStoryImage] = useState('');
  const [newStoryCaption, setNewStoryCaption] = useState('');
  const [storyProgress, setStoryProgress] = useState(0);
  const [replyText, setReplyText] = useState('');

  // Sample quick presets for new story image
  const storyPresets = [
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
  ];

  // Auto-advance active story
  useEffect(() => {
    if (activeStoryIndex === null) return;

    const duration = 5000; // 5 seconds
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex((curr) => (curr !== null ? curr + 1 : null));
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeStoryIndex, stories.length]);

  const handleNextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setStoryProgress(0);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setStoryProgress(0);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const media = newStoryImage.trim() || storyPresets[0];
    onAddStory(media, newStoryCaption.trim());
    setNewStoryImage('');
    setNewStoryCaption('');
    setShowCreateModal(false);
  };

  const currentActiveStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <>
      {/* Horizontal Story Cards Carousel */}
      <div className="relative mb-4">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none select-none">
          {/* Create Story Card */}
          <div
            onClick={() => setShowCreateModal(true)}
            className="group relative flex flex-col w-28 sm:w-32 h-48 rounded-xl overflow-hidden bg-white border border-[#E4E6EB] shadow-2xs hover:shadow-md cursor-pointer transition-all shrink-0"
          >
            <div className="h-32 w-full overflow-hidden bg-gray-100">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative flex-1 bg-white flex flex-col items-center justify-end pb-2 pt-4 px-1">
              <div className="absolute -top-4 w-8 h-8 rounded-full bg-[#1877F2] border-4 border-white flex items-center justify-center text-white shadow-xs group-hover:bg-[#166FE5] transition-colors">
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold text-[#050505] text-center leading-tight">
                Criar story
              </span>
            </div>
          </div>

          {/* Friends' Stories */}
          {stories.map((story, index) => (
            <div
              key={story.id}
              onClick={() => {
                setActiveStoryIndex(index);
                setStoryProgress(0);
              }}
              className="group relative w-28 sm:w-32 h-48 rounded-xl overflow-hidden shadow-2xs hover:shadow-md cursor-pointer transition-all shrink-0 bg-neutral-900"
            >
              <img
                src={story.mediaUrl}
                alt={story.userName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

              {/* Story Author Avatar with Blue Ring */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <div
                  className={`w-9 h-9 rounded-full p-0.5 ${
                    story.isViewed ? 'bg-gray-400' : 'bg-[#1877F2]'
                  } shadow-xs`}
                >
                  <img
                    src={story.userAvatar}
                    alt={story.userName}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
              </div>

              {/* Story Author Name */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
                <p className="text-white text-xs font-semibold drop-shadow-md truncate">
                  {story.userName}
                </p>
                <p className="text-white/80 text-[10px] truncate">{story.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {currentActiveStory && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          {/* Close button */}
          <button
            onClick={() => setActiveStoryIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Nav buttons */}
          {activeStoryIndex !== null && activeStoryIndex > 0 && (
            <button
              onClick={handlePrevStory}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors z-50 hidden sm:flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {activeStoryIndex !== null && activeStoryIndex < stories.length - 1 && (
            <button
              onClick={handleNextStory}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors z-50 hidden sm:flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Story Container */}
          <div className="relative w-full max-w-sm h-[82vh] max-h-[700px] bg-neutral-900 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            {/* Progress Bars */}
            <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1.5">
              {stories.map((s, i) => (
                <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all ease-linear"
                    style={{
                      width:
                        i === activeStoryIndex
                          ? `${storyProgress}%`
                          : i < (activeStoryIndex ?? 0)
                          ? '100%'
                          : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="absolute top-6 inset-x-4 z-30 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentActiveStory.userAvatar}
                  alt={currentActiveStory.userName}
                  className="w-10 h-10 rounded-full object-cover border border-white"
                />
                <div>
                  <h4 className="text-sm font-bold leading-tight">{currentActiveStory.userName}</h4>
                  <span className="text-[11px] text-white/80">{currentActiveStory.timestamp}</span>
                </div>
              </div>
            </div>

            {/* Story Image */}
            <div className="relative flex-1 w-full bg-black flex items-center justify-center">
              <img
                src={currentActiveStory.mediaUrl}
                alt={currentActiveStory.userName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

              {/* Caption if present */}
              {currentActiveStory.caption && (
                <div className="absolute bottom-16 inset-x-4 z-20">
                  <p className="text-white text-sm font-medium bg-black/50 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 text-center">
                    {currentActiveStory.caption}
                  </p>
                </div>
              )}
            </div>

            {/* Story Footer / Reply */}
            <div className="relative z-30 p-3 bg-black/60 backdrop-blur-md flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && replyText.trim()) {
                    onSendStoryReply(currentActiveStory.userId, replyText.trim());
                    setReplyText('');
                    setActiveStoryIndex(null);
                  }
                }}
                placeholder={`Responder a ${currentActiveStory.userName}...`}
                className="flex-1 bg-white/20 hover:bg-white/25 focus:bg-white/30 text-white placeholder-white/70 text-xs px-3.5 py-2 rounded-full border border-white/20 focus:outline-hidden"
              />
              <button
                onClick={() => {
                  onSendStoryReply(currentActiveStory.userId, '❤️ Amei seu story!');
                  setActiveStoryIndex(null);
                }}
                className="p-2 rounded-full hover:bg-white/20 text-[#E41E3F] transition-colors cursor-pointer"
                title="Curtir Story"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
              <button
                onClick={() => {
                  if (replyText.trim()) {
                    onSendStoryReply(currentActiveStory.userId, replyText.trim());
                    setReplyText('');
                    setActiveStoryIndex(null);
                  }
                }}
                className="p-2 rounded-full bg-[#1877F2] text-white hover:bg-[#166FE5] transition-colors cursor-pointer"
                title="Enviar resposta"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E4E6EB] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#E4E6EB] flex items-center justify-between">
              <h3 className="font-bold text-base text-[#050505]">Criar Story no ConectaFlow</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB] flex items-center justify-center text-[#65676B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#65676B] mb-1">
                  URL da Imagem ou Foto
                </label>
                <input
                  type="url"
                  value={newStoryImage}
                  onChange={(e) => setNewStoryImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CCD0D5] focus:border-[#1877F2] focus:outline-hidden"
                />
              </div>

              {/* Presets suggestions */}
              <div>
                <span className="block text-[11px] text-[#65676B] mb-1.5">
                  Ou escolha uma imagem em destaque:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {storyPresets.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setNewStoryImage(preset)}
                      className={`h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        newStoryImage === preset ? 'border-[#1877F2] scale-95' : 'border-transparent'
                      }`}
                    >
                      <img src={preset} alt="preset" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#65676B] mb-1">
                  Legenda do Story (opcional)
                </label>
                <input
                  type="text"
                  value={newStoryCaption}
                  onChange={(e) => setNewStoryCaption(e.target.value)}
                  placeholder="Compartilhe um pensamento ou momento..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CCD0D5] focus:border-[#1877F2] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4E6EB]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#050505] hover:bg-[#F2F2F2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#1877F2] hover:bg-[#166FE5] text-white shadow-xs"
                >
                  Compartilhar no Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
