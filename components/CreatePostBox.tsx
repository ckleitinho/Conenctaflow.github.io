'use client';

import React, { useState, useRef } from 'react';
import { 
  Video, 
  Image as ImageIcon, 
  Smile, 
  X, 
  Globe, 
  Users, 
  Lock, 
  MapPin, 
  Paperclip,
  UploadCloud,
  Loader2,
  FileText
} from 'lucide-react';
import { User, Group, Attachment } from '@/lib/types';
import { processUploadedFile } from '@/lib/attachment-utils';
import { AttachmentView } from './AttachmentView';

interface CreatePostBoxProps {
  currentUser: User;
  groups: Group[];
  selectedGroupId?: string;
  onPublishPost: (postData: {
    content: string;
    image?: string;
    attachments?: Attachment[];
    feeling?: string;
    location?: string;
    privacy: 'public' | 'friends' | 'only_me';
    groupId?: string;
    groupName?: string;
  }) => void;
  onStartInstantCall: () => void;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const CreatePostBox: React.FC<CreatePostBoxProps> = ({
  currentUser,
  groups,
  selectedGroupId,
  onPublishPost,
  onStartInstantCall,
  isOpenModal = false,
  onCloseModal,
}) => {
  const [showLocalModal, setShowLocalModal] = useState(false);
  const showModal = showLocalModal || isOpenModal;
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [feeling, setFeeling] = useState('');
  const [location, setLocation] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'only_me'>('public');
  const [chosenGroupId, setChosenGroupId] = useState<string>(selectedGroupId || '');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showFeelingsList, setShowFeelingsList] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageVideoInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setShowLocalModal(false);
    if (onCloseModal) onCloseModal();
  };

  const feelings = [
    { label: 'feliz 😊', value: 'feliz' },
    { label: 'empolgado 🚀', value: 'empolgado' },
    { label: 'grato 🙏', value: 'grato' },
    { label: 'produtivo 💻', value: 'produtivo' },
    { label: 'relaxando ☕', value: 'relaxando' },
    { label: 'viajando ✈️', value: 'viajando' },
  ];

  const presetImages = [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
  ];

  // Process files (from manual file input or drag-and-drop)
  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const fileList = Array.from(files);
      const processedList: Attachment[] = [];

      for (const file of fileList) {
        // Enforce 10MB per file safety threshold
        if (file.size > 10 * 1024 * 1024) {
          alert(`O arquivo "${file.name}" excede o tamanho máximo de 10MB.`);
          continue;
        }
        const att = await processUploadedFile(file);
        processedList.push(att);
      }

      setAttachments((prev) => [...prev, ...processedList]);
    } catch (error) {
      console.error('Erro ao processar anexos:', error);
      alert('Houve um problema ao carregar os arquivos selecionados.');
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
      if (!showModal) {
        setShowLocalModal(true);
      }
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl.trim() && attachments.length === 0) return;

    let gName: string | undefined;
    if (chosenGroupId) {
      const found = groups.find((g) => g.id === chosenGroupId);
      if (found) gName = found.name;
    }

    const fallbackImage = imageUrl.trim() || attachments.find((a) => a.type === 'image')?.url;

    onPublishPost({
      content: content.trim(),
      image: fallbackImage || undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
      feeling: feeling || undefined,
      location: location.trim() || undefined,
      privacy,
      groupId: chosenGroupId || undefined,
      groupName: gName,
    });

    setContent('');
    setImageUrl('');
    setAttachments([]);
    setFeeling('');
    setLocation('');
    setShowImageInput(false);
    setShowFeelingsList(false);
    handleClose();
  };

  return (
    <>
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={imageVideoInputRef}
        accept="image/*,video/*"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        multiple
        className="hidden"
      />

      {/* Feed Inline Card with Drag & Drop */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-white rounded-xl border transition-all p-3 sm:p-4 mb-4 ${
          isDraggingOver 
            ? 'border-[#1877F2] bg-blue-50/50 ring-2 ring-[#1877F2]/20' 
            : 'border-[#E4E6EB] shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E4E6EB]">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border border-[#E4E6EB] shrink-0"
          />
          <button
            onClick={() => setShowLocalModal(true)}
            className="flex-1 bg-[#F0F2F5] hover:bg-[#E4E6EB] text-[#65676B] text-left text-sm px-4 py-2.5 rounded-full cursor-pointer transition-colors"
          >
            No que você está pensando, {currentUser.name.split(' ')[0]}?
          </button>
        </div>

        {/* Quick action triggers */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onStartInstantCall}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-1 hover:bg-[#F2F2F2] rounded-lg text-[#050505] text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
          >
            <Video className="w-5 h-5 text-[#E41E3F]" />
            <span className="truncate">Vídeo ao Vivo</span>
          </button>

          <button
            onClick={() => {
              setShowLocalModal(true);
              setTimeout(() => imageVideoInputRef.current?.click(), 100);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-1 hover:bg-[#F2F2F2] rounded-lg text-[#050505] text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
          >
            <ImageIcon className="w-5 h-5 text-[#45BD62]" />
            <span className="truncate">Foto / Vídeo</span>
          </button>

          <button
            onClick={() => {
              setShowLocalModal(true);
              setTimeout(() => fileInputRef.current?.click(), 100);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-1 hover:bg-[#F2F2F2] rounded-lg text-[#050505] text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
            title="Anexar arquivos, PDFs e documentos"
          >
            <Paperclip className="w-5 h-5 text-[#1877F2]" />
            <span className="truncate">Anexar</span>
          </button>

          <button
            onClick={() => {
              setShowLocalModal(true);
              setShowFeelingsList(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-1 hover:bg-[#F2F2F2] rounded-lg text-[#050505] text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
          >
            <Smile className="w-5 h-5 text-[#F7B125]" />
            <span className="truncate">Sentimento</span>
          </button>
        </div>
      </div>

      {/* Full Create Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-white rounded-2xl shadow-2xl border w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col relative ${
              isDraggingOver ? 'border-[#1877F2] ring-4 ring-[#1877F2]/20' : 'border-[#E4E6EB]'
            }`}
          >
            {/* Drag Over Overlay */}
            {isDraggingOver && (
              <div className="absolute inset-0 bg-blue-50/90 z-50 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                <UploadCloud className="w-14 h-14 text-[#1877F2] animate-bounce mb-2" />
                <h4 className="text-base font-bold text-[#050505]">Solte seus arquivos aqui</h4>
                <p className="text-xs text-[#65676B] mt-1">Fotos, vídeos, PDFs e documentos serão anexados à publicação</p>
              </div>
            )}

            {/* Header */}
            <div className="p-3.5 border-b border-[#E4E6EB] flex items-center justify-between relative">
              <h3 className="font-bold text-base text-[#050505] mx-auto">Criar publicação</h3>
              <button
                onClick={handleClose}
                className="absolute right-3.5 w-8 h-8 rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB] flex items-center justify-center text-[#65676B] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1 space-y-3">
              {/* User badge & privacy options */}
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E4E6EB]"
                />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-[#050505]">{currentUser.name}</span>
                    {feeling && (
                      <span className="text-xs text-[#65676B]">
                        está se sentindo <strong className="text-[#050505]">{feeling}</strong>
                      </span>
                    )}
                    {location && (
                      <span className="text-xs text-[#65676B]">
                        em <strong className="text-[#050505]">{location}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {/* Privacy Selector */}
                    <div className="flex items-center gap-1 bg-[#F0F2F5] hover:bg-[#E4E6EB] px-2 py-0.5 rounded-md text-[11px] font-semibold text-[#050505] cursor-pointer">
                      {privacy === 'public' && <Globe className="w-3 h-3 text-[#65676B]" />}
                      {privacy === 'friends' && <Users className="w-3 h-3 text-[#65676B]" />}
                      {privacy === 'only_me' && <Lock className="w-3 h-3 text-[#65676B]" />}
                      <select
                        value={privacy}
                        onChange={(e) => setPrivacy(e.target.value as any)}
                        className="bg-transparent border-none focus:outline-hidden cursor-pointer text-[11px]"
                      >
                        <option value="public">Público</option>
                        <option value="friends">Amigos</option>
                        <option value="only_me">Somente eu</option>
                      </select>
                    </div>

                    {/* Group selector */}
                    <select
                      value={chosenGroupId}
                      onChange={(e) => setChosenGroupId(e.target.value)}
                      className="bg-[#F0F2F5] hover:bg-[#E4E6EB] px-2 py-0.5 rounded-md text-[11px] font-semibold text-[#050505] border-none focus:outline-hidden cursor-pointer"
                    >
                      <option value="">No meu Feed</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          No grupo: {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder={`No que você está pensando, ${currentUser.name.split(' ')[0]}?`}
                className="w-full text-sm text-[#050505] placeholder-[#65676B] resize-none border-none focus:outline-hidden focus:ring-0 pt-2"
                autoFocus
              />

              {/* Upload Dropzone / Quick Picker */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 border-2 border-dashed border-[#CCD0D5] hover:border-[#1877F2] bg-[#F9FAFB] hover:bg-[#F0F2F5] rounded-xl flex items-center justify-center gap-2.5 cursor-pointer transition-colors text-center"
              >
                <UploadCloud className="w-5 h-5 text-[#1877F2] shrink-0" />
                <span className="text-xs font-semibold text-[#050505]">
                  Arraste arquivos aqui ou <span className="text-[#1877F2] underline">clique para anexar</span>
                </span>
              </div>

              {/* Processing Spinner */}
              {isProcessing && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center gap-2 text-xs font-semibold text-[#1877F2]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processando e otimizando anexo(s)...</span>
                </div>
              )}

              {/* Attachments Preview List */}
              <AttachmentView
                attachments={attachments}
                onRemoveAttachment={handleRemoveAttachment}
                isEditable={true}
              />

              {/* Optional Web Image URL input */}
              {showImageInput && (
                <div className="p-3 bg-[#F0F2F5] rounded-xl space-y-2 border border-[#E4E6EB]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#050505]">Imagem por Link / Web</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowImageInput(false);
                        setImageUrl('');
                      }}
                      className="text-xs text-[#65676B] hover:text-[#050505]"
                    >
                      Fechar
                    </button>
                  </div>

                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Cole a URL de uma imagem da internet..."
                    className="w-full text-xs p-2 bg-white rounded-lg border border-[#CCD0D5] focus:border-[#1877F2] focus:outline-hidden"
                  />

                  {/* Preset quick selection */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {presetImages.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setImageUrl(img)}
                        className={`h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                          imageUrl === img ? 'border-[#1877F2]' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt="preset" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  {imageUrl && (
                    <div className="relative rounded-lg overflow-hidden max-h-44 mt-2">
                      <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {/* Feelings Selector */}
              {showFeelingsList && (
                <div className="p-3 bg-[#F0F2F5] rounded-xl border border-[#E4E6EB]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#050505]">Como você está se sentindo?</span>
                    {feeling && (
                      <button
                        type="button"
                        onClick={() => setFeeling('')}
                        className="text-xs text-[#1877F2] hover:underline"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {feelings.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => setFeeling(f.value)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          feeling === f.value
                            ? 'bg-[#1877F2] text-white border-[#1877F2]'
                            : 'bg-white text-[#050505] border-[#CCD0D5] hover:bg-[#E4E6EB]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras Bar: Add Photo/Video, Add Document/Attachment, Feeling, Location */}
              <div className="p-2.5 rounded-xl border border-[#E4E6EB] flex items-center justify-between bg-white shadow-2xs">
                <span className="text-xs font-semibold text-[#050505]">
                  Adicionar à sua publicação
                </span>

                <div className="flex items-center gap-1 text-[#65676B]">
                  <button
                    type="button"
                    onClick={() => imageVideoInputRef.current?.click()}
                    className="p-1.5 rounded-full hover:bg-[#F2F2F2] hover:text-[#45BD62] transition-colors cursor-pointer"
                    title="Fotos / Vídeos do dispositivo"
                  >
                    <ImageIcon className="w-5 h-5 text-[#45BD62]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-full hover:bg-[#F2F2F2] hover:text-[#1877F2] transition-colors cursor-pointer"
                    title="Anexar arquivo / PDF / Documento"
                  >
                    <Paperclip className="w-5 h-5 text-[#1877F2]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFeelingsList(!showFeelingsList)}
                    className="p-1.5 rounded-full hover:bg-[#F2F2F2] hover:text-[#F7B125] transition-colors cursor-pointer"
                    title="Sentimento / Atividade"
                  >
                    <Smile className="w-5 h-5 text-[#F7B125]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const loc = prompt('Onde você está? (ex: São Paulo, SP, Brasil)');
                      if (loc !== null) setLocation(loc);
                    }}
                    className="p-1.5 rounded-full hover:bg-[#F2F2F2] hover:text-[#E41E3F] transition-colors cursor-pointer"
                    title="Check-in / Localização"
                  >
                    <MapPin className="w-5 h-5 text-[#E41E3F]" />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || (!content.trim() && !imageUrl.trim() && attachments.length === 0)}
                  className="w-full bg-[#1877F2] hover:bg-[#166FE5] disabled:bg-[#E4E6EB] disabled:text-[#8C939D] text-white font-bold text-sm py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processando arquivos...' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
