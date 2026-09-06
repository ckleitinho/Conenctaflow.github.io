'use client';

import React from 'react';
import { 
  FileText, 
  FileAudio, 
  FileVideo, 
  File, 
  Download, 
  X, 
  FileSpreadsheet,
  Paperclip,
  Eye
} from 'lucide-react';
import { Attachment } from '@/lib/types';
import { downloadAttachment } from '@/lib/attachment-utils';

interface AttachmentViewProps {
  attachments: Attachment[];
  onRemoveAttachment?: (id: string) => void;
  isEditable?: boolean;
  layout?: 'post' | 'chat' | 'compact';
}

export const AttachmentView: React.FC<AttachmentViewProps> = ({
  attachments,
  onRemoveAttachment,
  isEditable = false,
  layout = 'post',
}) => {
  if (!attachments || attachments.length === 0) return null;

  const getFileIcon = (attachment: Attachment) => {
    const ext = attachment.name.split('.').pop()?.toLowerCase() || '';
    if (attachment.type === 'video') return <FileVideo className="w-6 h-6 text-purple-600 shrink-0" />;
    if (attachment.type === 'audio') return <FileAudio className="w-6 h-6 text-amber-600 shrink-0" />;
    if (['xls', 'xlsx', 'csv'].includes(ext)) return <FileSpreadsheet className="w-6 h-6 text-emerald-600 shrink-0" />;
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext) || attachment.type === 'document') {
      return <FileText className="w-6 h-6 text-blue-600 shrink-0" />;
    }
    return <File className="w-6 h-6 text-slate-600 shrink-0" />;
  };

  // Editable preview mode (used inside create post box or chat input before sending)
  if (isEditable) {
    return (
      <div className="space-y-2 my-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#050505]">
          <Paperclip className="w-3.5 h-3.5 text-[#1877F2]" />
          <span>Anexos adicionados ({attachments.length}):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2.5 p-2 bg-[#F0F2F5] hover:bg-[#E4E6EB] rounded-xl border border-[#CCD0D5] relative group transition-colors"
            >
              {att.type === 'image' ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#CCD0D5] bg-neutral-200">
                  <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border border-[#CCD0D5] shrink-0">
                  {getFileIcon(att)}
                </div>
              )}

              <div className="min-w-0 flex-1 pr-6">
                <p className="text-xs font-semibold text-[#050505] truncate" title={att.name}>
                  {att.name}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[#65676B] mt-0.5">
                  <span className="uppercase font-medium bg-white px-1.5 py-0.2 rounded border border-[#CCD0D5]">
                    {att.type}
                  </span>
                  <span>{att.formattedSize}</span>
                </div>
              </div>

              {onRemoveAttachment && (
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(att.id)}
                  className="absolute right-2 top-2 p-1 rounded-full bg-white/90 hover:bg-red-50 text-[#65676B] hover:text-red-600 transition-colors shadow-2xs"
                  title="Remover anexo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Chat message layout
  if (layout === 'chat') {
    return (
      <div className="space-y-1.5 mt-1.5">
        {attachments.map((att) => {
          if (att.type === 'image') {
            return (
              <div key={att.id} className="rounded-xl overflow-hidden max-w-sm border border-black/10 shadow-2xs">
                <img
                  src={att.url}
                  alt={att.name}
                  className="w-full max-h-60 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => window.open(att.url, '_blank')}
                />
              </div>
            );
          }

          if (att.type === 'video') {
            return (
              <div key={att.id} className="rounded-xl overflow-hidden max-w-sm border border-black/10 shadow-2xs bg-black">
                <video src={att.url} controls className="w-full max-h-60" preload="metadata" />
              </div>
            );
          }

          if (att.type === 'audio') {
            return (
              <div key={att.id} className="bg-white/90 rounded-xl p-2 border border-black/10 shadow-2xs max-w-sm">
                <p className="text-[11px] font-semibold text-[#050505] truncate mb-1">{att.name}</p>
                <audio src={att.url} controls className="w-full h-8" preload="metadata" />
              </div>
            );
          }

          // Document or file card
          return (
            <div
              key={att.id}
              className="flex items-center gap-2.5 p-2 bg-white/95 rounded-xl border border-black/10 shadow-2xs max-w-sm hover:bg-white transition-colors"
            >
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                {getFileIcon(att)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#050505] truncate" title={att.name}>
                  {att.name}
                </p>
                <p className="text-[10px] text-[#65676B]">{att.formattedSize}</p>
              </div>
              <button
                type="button"
                onClick={() => downloadAttachment(att)}
                className="p-1.5 rounded-lg bg-[#E7F3FF] hover:bg-[#1877F2] text-[#1877F2] hover:text-white transition-colors shrink-0"
                title="Baixar arquivo"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  // Post layout
  const images = attachments.filter((a) => a.type === 'image');
  const otherMedia = attachments.filter((a) => a.type !== 'image');

  return (
    <div className="space-y-2 mt-2">
      {/* Images gallery / grid */}
      {images.length > 0 && (
        <div
          className={`grid gap-1.5 overflow-hidden ${
            images.length === 1
              ? 'grid-cols-1 max-h-[550px]'
              : images.length === 2
              ? 'grid-cols-2 max-h-[420px]'
              : 'grid-cols-2 sm:grid-cols-3 max-h-[480px]'
          }`}
        >
          {images.map((img) => (
            <div
              key={img.id}
              className="relative bg-neutral-100 overflow-hidden group cursor-pointer"
              onClick={() => window.open(img.url, '_blank')}
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover max-h-[500px] group-hover:scale-102 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="p-2 rounded-full bg-white/80 text-[#050505] shadow-xs">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Videos, Audios, and Documents */}
      {otherMedia.length > 0 && (
        <div className="px-3 sm:px-4 space-y-2">
          {otherMedia.map((att) => {
            if (att.type === 'video') {
              return (
                <div key={att.id} className="rounded-xl overflow-hidden bg-black border border-[#CCD0D5] shadow-2xs">
                  <video src={att.url} controls className="w-full max-h-[450px]" preload="metadata" />
                </div>
              );
            }

            if (att.type === 'audio') {
              return (
                <div key={att.id} className="bg-[#F0F2F5] p-3 rounded-xl border border-[#CCD0D5] space-y-1">
                  <div className="flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-semibold text-[#050505] truncate">{att.name}</span>
                    <span className="text-[10px] text-[#65676B]">({att.formattedSize})</span>
                  </div>
                  <audio src={att.url} controls className="w-full" preload="metadata" />
                </div>
              );
            }

            // Documents / Files
            return (
              <div
                key={att.id}
                className="flex items-center justify-between p-3 bg-[#F0F2F5] hover:bg-[#E4E6EB] rounded-xl border border-[#CCD0D5] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-[#CCD0D5] shrink-0">
                    {getFileIcon(att)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#050505] truncate" title={att.name}>
                      {att.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#65676B] mt-0.5">
                      <span className="uppercase font-semibold bg-white px-1.5 py-0.2 rounded border border-[#CCD0D5]">
                        {att.name.split('.').pop() || 'Arquivo'}
                      </span>
                      <span>{att.formattedSize}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => downloadAttachment(att)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#1877F2] text-[#1877F2] hover:text-white font-semibold text-xs rounded-lg border border-[#CCD0D5] hover:border-[#1877F2] transition-colors ml-3 cursor-pointer shadow-2xs shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
