'use client';

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  EyeOff, 
  UserX, 
  Info,
  Loader2,
  FileWarning
} from 'lucide-react';
import { ReportCategory, ReportItem, User } from '@/lib/types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  reportedItem: {
    id: string;
    type: 'post' | 'comment' | 'user' | 'group';
    authorName?: string;
    authorAvatar?: string;
    contentSnippet?: string;
  };
  onSubmitReport: (reportData: {
    reportedItemId: string;
    reportedItemType: 'post' | 'comment' | 'user' | 'group';
    targetAuthorName?: string;
    targetAuthorAvatar?: string;
    itemContentSnippet?: string;
    category: ReportCategory;
    categoryLabel: string;
    details?: string;
    hideFromUser?: boolean;
  }) => Promise<void>;
}

const REPORT_REASONS: {
  category: ReportCategory;
  label: string;
  description: string;
}[] = [
  {
    category: 'spam',
    label: 'Spam ou Fraude',
    description: 'Publicidade indesejada, links fraudulentos ou esquemas financeiros suspeitos.',
  },
  {
    category: 'hate_speech',
    label: 'Discurso de Ódio',
    description: 'Ataques preconceituosos com base em raça, religião, orientação sexual ou identidade.',
  },
  {
    category: 'harassment',
    label: 'Assédio ou Intimidação',
    description: 'Perseguição direcionada, ameaças pessoais, humilhação ou exposição indevida.',
  },
  {
    category: 'violence',
    label: 'Violência ou Conteúdo Explícito',
    description: 'Imagens chocantes, incentivo à violência física, autolesão ou atos perigosos.',
  },
  {
    category: 'fake_news',
    label: 'Desinformação ou Notícia Falsa',
    description: 'Informações comprovadamente falsas sobre saúde, eleições ou temas de interesse público.',
  },
  {
    category: 'copyright',
    label: 'Violação de Direitos Autorais',
    description: 'Uso não autorizado de propriedade intelectual, fotos ou marcas registradas.',
  },
  {
    category: 'other',
    label: 'Outro Motivo',
    description: 'O conteúdo viola as diretrizes da comunidade por outro motivo relevante.',
  },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  reportedItem,
  onSubmitReport,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('spam');
  const [details, setDetails] = useState('');
  const [hideContent, setHideContent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsSuccess(false);
    setDetails('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reasonObj = REPORT_REASONS.find((r) => r.category === selectedCategory);
    if (!reasonObj) return;

    setIsSubmitting(true);
    try {
      await onSubmitReport({
        reportedItemId: reportedItem.id,
        reportedItemType: reportedItem.type,
        targetAuthorName: reportedItem.authorName,
        targetAuthorAvatar: reportedItem.authorAvatar,
        itemContentSnippet: reportedItem.contentSnippet,
        category: selectedCategory,
        categoryLabel: reasonObj.label,
        details: details.trim() || undefined,
        hideFromUser: hideContent,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Falha ao enviar denúncia:', err);
      alert('Não foi possível registrar a denúncia neste momento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const itemTypeName = 
    reportedItem.type === 'post' ? 'publicação' : 
    reportedItem.type === 'comment' ? 'comentário' : 
    reportedItem.type === 'group' ? 'grupo' : 'perfil';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E4E6EB] w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#E4E6EB] flex items-center justify-between relative bg-[#F9FAFB]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#050505]">
                {isSuccess ? 'Denúncia Registrada' : `Denunciar ${itemTypeName}`}
              </h3>
              <p className="text-[11px] text-[#65676B]">
                Central de Segurança e Moderação ConectaFlow
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#E4E6EB] hover:bg-[#D8DADF] flex items-center justify-center text-[#65676B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-6 text-center space-y-4 flex-1 overflow-y-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-[#050505]">
                Obrigado por ajudar a comunidade!
              </h4>
              <p className="text-sm text-[#65676B] max-w-sm mx-auto leading-relaxed">
                Recebemos sua denúncia contra {itemTypeName} de{' '}
                <span className="font-semibold text-[#050505]">
                  {reportedItem.authorName || 'usuário'}
                </span>.
              </p>
            </div>

            <div className="bg-[#F0F2F5] p-3.5 rounded-xl text-xs text-[#050505] text-left space-y-2 border border-[#E4E6EB]">
              <div className="flex items-center gap-2 font-semibold text-[#1877F2]">
                <Info className="w-4 h-4 shrink-0" />
                <span>O que acontece a seguir?</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#65676B] pl-1">
                <li>Nossa equipe de moderação irá avaliar o conteúdo com base nas diretrizes.</li>
                <li>O autor não saberá quem fez a denúncia.</li>
                <li>Você recebeu uma notificação no sistema para acompanhar o registro.</li>
                {hideContent && <li>Este conteúdo foi ocultado do seu Feed local.</li>}
              </ul>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-sm py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
            {/* Target Preview Box */}
            <div className="p-3 bg-[#F0F2F5] rounded-xl border border-[#E4E6EB] flex items-start gap-3">
              {reportedItem.authorAvatar ? (
                <img
                  src={reportedItem.authorAvatar}
                  alt={reportedItem.authorName || 'Autor'}
                  className="w-9 h-9 rounded-full object-cover border border-white shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-neutral-300 flex items-center justify-center shrink-0">
                  <FileWarning className="w-4 h-4 text-neutral-600" />
                </div>
              )}
              <div className="min-w-0 flex-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#050505]">
                  <span>{reportedItem.authorName || 'Autor do conteúdo'}</span>
                  <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.2 rounded-sm font-normal">
                    {reportedItem.type}
                  </span>
                </div>
                {reportedItem.contentSnippet && (
                  <p className="text-[#65676B] line-clamp-2 mt-0.5 italic">
                    &quot;{reportedItem.contentSnippet}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Instruction */}
            <div>
              <label className="block text-xs font-bold text-[#050505] mb-2 uppercase tracking-wide">
                Por que você está denunciando este conteúdo?
              </label>

              {/* Reasons Radio list */}
              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => {
                  const isSelected = selectedCategory === reason.category;
                  return (
                    <div
                      key={reason.category}
                      onClick={() => setSelectedCategory(reason.category)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'border-[#1877F2] bg-blue-50/50 ring-1 ring-[#1877F2]'
                          : 'border-[#E4E6EB] hover:bg-[#F9FAFB]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="report_reason"
                        checked={isSelected}
                        onChange={() => setSelectedCategory(reason.category)}
                        className="mt-1 text-[#1877F2] focus:ring-[#1877F2] cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#050505]">
                          {reason.label}
                        </div>
                        <div className="text-[11px] text-[#65676B] mt-0.5">
                          {reason.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Comments Textarea */}
            <div>
              <label className="block text-xs font-bold text-[#050505] mb-1">
                Detalhes adicionais (opcional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                placeholder="Explique brevemente por que você considera este conteúdo inadequado..."
                className="w-full text-xs p-2.5 bg-[#F0F2F5] hover:bg-[#E4E6EB] focus:bg-white text-[#050505] placeholder-[#65676B] rounded-xl border border-transparent focus:border-[#1877F2] focus:outline-hidden transition-all resize-none"
              />
            </div>

            {/* Hide content toggle */}
            <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E4E6EB] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <EyeOff className="w-4 h-4 text-[#65676B]" />
                <div>
                  <p className="text-xs font-semibold text-[#050505]">
                    Ocultar este conteúdo para mim
                  </p>
                  <p className="text-[10px] text-[#65676B]">
                    A publicação não será mais exibida no seu Feed
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={hideContent}
                onChange={(e) => setHideContent(e.target.checked)}
                className="w-4 h-4 rounded text-[#1877F2] focus:ring-[#1877F2] cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-[#CCD0D5] text-[#050505] text-xs font-bold hover:bg-[#F2F2F2] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>Enviar Denúncia</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
