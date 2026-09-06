'use client';

import React from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { ReportItem } from '@/lib/types';

interface ReportsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: ReportItem[];
}

export const ReportsHistoryModal: React.FC<ReportsHistoryModalProps> = ({
  isOpen,
  onClose,
  reports,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E4E6EB] w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#E4E6EB] flex items-center justify-between bg-[#F9FAFB]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#050505]">
                Central de Denúncias & Moderação
              </h3>
              <p className="text-[11px] text-[#65676B]">
                Acompanhe o status e as decisões sobre suas denúncias
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E4E6EB] hover:bg-[#D8DADF] flex items-center justify-center text-[#65676B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-[#F0F2F5]">
          {reports.length === 0 ? (
            <div className="p-8 text-center text-[#65676B] space-y-2">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto" />
              <h4 className="font-bold text-sm text-[#050505]">Nenhuma denúncia registrada</h4>
              <p className="text-xs max-w-xs mx-auto leading-relaxed">
                Você ainda não denunciou nenhuma publicação ou usuário. Caso encontre conteúdo que viole nossas diretrizes, use a opção &quot;Denunciar&quot; no menu do post.
              </p>
            </div>
          ) : (
            reports.map((report) => {
              const dateStr = new Date(report.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={report.id} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-[#050505]">
                          {report.categoryLabel}
                        </span>
                        <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
                          {report.reportedItemType === 'post' ? 'Publicação' : 
                           report.reportedItemType === 'comment' ? 'Comentário' : 
                           report.reportedItemType === 'user' ? 'Usuário' : 'Grupo'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#65676B] mt-0.5">
                        Enviada em {dateStr}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div>
                      {report.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>Sob Análise</span>
                        </span>
                      )}
                      {report.status === 'reviewed' && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Revisada</span>
                        </span>
                      )}
                      {report.status === 'resolved' && (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Resolvida</span>
                        </span>
                      )}
                      {report.status === 'dismissed' && (
                        <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-700 text-[10px] font-bold px-2 py-1 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          <span>Encerrada</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Target details */}
                  <div className="bg-[#F0F2F5] p-2.5 rounded-xl text-xs space-y-1">
                    {report.targetAuthorName && (
                      <p className="text-[#050505] font-semibold">
                        Autor: <span className="font-normal">{report.targetAuthorName}</span>
                      </p>
                    )}
                    {report.itemContentSnippet && (
                      <p className="text-[#65676B] italic line-clamp-2">
                        &quot;{report.itemContentSnippet}&quot;
                      </p>
                    )}
                    {report.details && (
                      <p className="text-[#65676B] text-[11px] pt-1 border-t border-[#E4E6EB]">
                        <strong>Seu comentário:</strong> {report.details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F9FAFB] border-t border-[#E4E6EB] text-center">
          <button
            onClick={onClose}
            className="w-full bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#050505] font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
