'use client';

import React, { useState } from 'react';
import { X, User, Image, Check } from 'lucide-react';
import { User as UserType } from '@/lib/types';

interface EditProfileModalProps {
  currentUser: UserType & { isAnonymous?: boolean };
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string, newAvatar: string, newBio?: string) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const avatarPresets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setLoading(true);
      await onSave(name.trim(), avatar.trim(), bio.trim());
      onClose();
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E4E6EB] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-[#E4E6EB] flex items-center justify-between">
          <h3 className="font-bold text-base text-[#050505]">Editar Meu Perfil</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB] flex items-center justify-center text-[#65676B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex flex-col items-center gap-2">
            <img
              src={avatar}
              alt="Avatar Preview"
              className="w-20 h-20 rounded-full object-cover border-4 border-[#1877F2] shadow-md"
            />
            <span className="text-xs text-[#65676B]">Pré-visualização do avatar</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#65676B] mb-1">
              Nome de Exibição
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome real ou apelido"
              className="w-full text-xs p-2.5 rounded-lg border border-[#CCD0D5] focus:border-[#1877F2] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#65676B] mb-1">
              URL do Avatar (Foto de Perfil)
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full text-xs p-2.5 rounded-lg border border-[#CCD0D5] focus:border-[#1877F2] focus:outline-hidden"
            />
          </div>

          <div>
            <span className="block text-[11px] text-[#65676B] mb-1.5">
              Ou selecione um avatar rápido:
            </span>
            <div className="grid grid-cols-6 gap-1.5">
              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                    avatar === preset ? 'border-[#1877F2] scale-110 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#65676B] mb-1">
              Bio / Frase de Status (opcional)
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ex: Desenvolvedor, amante de tecnologia e inovação"
              className="w-full text-xs p-2.5 rounded-lg border border-[#CCD0D5] focus:border-[#1877F2] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4E6EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#050505] hover:bg-[#F2F2F2]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#1877F2] hover:bg-[#166FE5] disabled:bg-gray-300 text-white shadow-xs"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
