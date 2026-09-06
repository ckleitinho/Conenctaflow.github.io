'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Video, 
  Search, 
  ArrowLeft, 
  ShieldCheck, 
  Globe, 
  Lock, 
  UserPlus, 
  Share2, 
  MoreHorizontal,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Group, Post, User, ReactionType, Comment } from '@/lib/types';
import { PostCard } from './PostCard';
import { CreatePostBox } from './CreatePostBox';

interface GroupsViewProps {
  groups: Group[];
  posts: Post[];
  currentUser: User;
  onToggleJoinGroup: (groupId: string) => void;
  onCreateGroup: (newGroup: Omit<Group, 'id' | 'postsCount'>) => void;
  onStartGroupVideoCall: (group: Group) => void;
  onReactPost: (postId: string, reaction: ReactionType | null) => void;
  onAddComment: (postId: string, text: string) => void;
  onPublishGroupPost: (postData: any) => void;
  onSharePost: (postId: string) => void;
  onReportPost?: (post: Post) => void;
  onReportComment?: (postId: string, comment: Comment) => void;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  posts,
  currentUser,
  onToggleJoinGroup,
  onCreateGroup,
  onStartGroupVideoCall,
  onReactPost,
  onAddComment,
  onPublishGroupPost,
  onSharePost,
  onReportPost,
  onReportComment,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'my' | 'discover'>('my');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Form states for creating a group
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupTagline, setNewGroupTagline] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Tecnologia & Inovação');
  const [newGroupPrivacy, setNewGroupPrivacy] = useState<'Público' | 'Privado'>('Público');
  const [newGroupCover, setNewGroupCover] = useState(
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80'
  );

  const myGroups = groups.filter((g) => g.isMember);
  const discoverGroups = groups.filter((g) => !g.isMember);

  const displayedGroups = (activeSubTab === 'my' ? myGroups : discoverGroups).filter(
    (g) =>
      g.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      g.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    onCreateGroup({
      name: newGroupName.trim(),
      tagline: newGroupTagline.trim() || 'Comunidade vibrante no ConectaFlow.',
      description: newGroupDesc.trim() || 'Espaço de conexão e troca de experiências.',
      category: newGroupCategory,
      privacy: newGroupPrivacy,
      isMember: true,
      memberCount: 1,
      coverImage: newGroupCover,
      avatar: newGroupCover,
      rules: [
        'Respeito mútuo entre todos os membros',
        'Conteúdo construtivo e sem ofensas',
        'Participe das vídeo chamadas coletivas',
      ],
    });

    setNewGroupName('');
    setNewGroupTagline('');
    setNewGroupDesc('');
    setShowCreateModal(false);
  };

  // Group Details View
  if (selectedGroup) {
    const groupPosts = posts.filter((p) => p.groupId === selectedGroup.id);

    return (
      <div className="space-y-4 max-w-4xl mx-auto pb-12">
        {/* Back Button Bar */}
        <button
          onClick={() => setSelectedGroup(null)}
          className="flex items-center gap-2 text-sm font-semibold text-[#1877F2] hover:underline cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-[#E4E6EB] w-fit shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para todos os Grupos</span>
        </button>

        {/* Group Banner Header */}
        <div className="bg-white rounded-2xl border border-[#E4E6EB] shadow-xs overflow-hidden">
          <div className="h-48 sm:h-64 w-full relative">
            <img
              src={selectedGroup.coverImage}
              alt={selectedGroup.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E6EB] pb-5">
              <div className="flex items-center gap-4">
                <img
                  src={selectedGroup.avatar}
                  alt={selectedGroup.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white -mt-10 sm:-mt-12 shadow-md shrink-0"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#050505]">
                    {selectedGroup.name}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-[#65676B] mt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-[#1877F2]">
                      <Globe className="w-3.5 h-3.5" /> Grupo {selectedGroup.privacy}
                    </span>
                    <span>•</span>
                    <span>{selectedGroup.memberCount.toLocaleString()} membros</span>
                    <span>•</span>
                    <span>{selectedGroup.category}</span>
                  </div>
                </div>
              </div>

              {/* Group Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* START GROUP VIDEO CALL ACTION */}
                <button
                  onClick={() => onStartGroupVideoCall(selectedGroup)}
                  className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-transform hover:scale-105 cursor-pointer"
                  title="Abrir sala de vídeo do grupo"
                >
                  <Video className="w-4 h-4" />
                  <span>Sala de Vídeo</span>
                </button>

                <button
                  onClick={() => onToggleJoinGroup(selectedGroup.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    selectedGroup.isMember
                      ? 'bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#050505]'
                      : 'bg-[#E7F3FF] hover:bg-[#DBEBFF] text-[#1877F2]'
                  }`}
                >
                  {selectedGroup.isMember ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Membro</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Participar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tagline & Description */}
            <div className="pt-4 text-xs sm:text-sm text-[#050505] leading-relaxed">
              <p className="font-semibold mb-1 text-[#1877F2]">{selectedGroup.tagline}</p>
              <p className="text-[#65676B]">{selectedGroup.description}</p>
            </div>
          </div>
        </div>

        {/* Group Feed & Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Create post in group */}
            {selectedGroup.isMember ? (
              <CreatePostBox
                currentUser={currentUser}
                groups={groups}
                selectedGroupId={selectedGroup.id}
                onPublishPost={onPublishGroupPost}
                onStartInstantCall={() => onStartGroupVideoCall(selectedGroup)}
              />
            ) : (
              <div className="p-4 bg-white rounded-xl border border-[#E4E6EB] text-center shadow-2xs">
                <p className="text-sm font-medium text-[#050505] mb-2">
                  Participe deste grupo para publicar e interagir com os membros!
                </p>
                <button
                  onClick={() => onToggleJoinGroup(selectedGroup.id)}
                  className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Entrar no Grupo
                </button>
              </div>
            )}

            {/* Group Posts List */}
            {groupPosts.length > 0 ? (
              groupPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onReact={onReactPost}
                  onAddComment={onAddComment}
                  onSharePost={onSharePost}
                  onReportPost={onReportPost}
                  onReportComment={onReportComment}
                />
              ))
            ) : (
              <div className="p-8 bg-white rounded-xl border border-[#E4E6EB] text-center text-[#65676B] space-y-2">
                <Users className="w-10 h-10 mx-auto text-[#CCD0D5]" />
                <h4 className="font-bold text-sm text-[#050505]">Nenhuma publicação ainda</h4>
                <p className="text-xs">
                  Seja o primeiro a publicar algo relevante no grupo {selectedGroup.name}!
                </p>
              </div>
            )}
          </div>

          {/* Group Rules & Info Column */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#E4E6EB] p-4 shadow-2xs">
              <h3 className="font-bold text-sm text-[#050505] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1877F2]" />
                <span>Regras da Comunidade</span>
              </h3>
              <ul className="space-y-2 text-xs text-[#65676B]">
                {(selectedGroup.rules || [
                  'Respeito mútuo entre todos os membros',
                  'Sem spam ou autopromoção desmedida',
                  'Compartilhe conteúdo relevante com o tema do grupo',
                ]).map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#E7F3FF] text-[#1877F2] font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Video Hangout Card */}
            <div className="bg-gradient-to-br from-[#1877F2] to-blue-700 text-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-5 h-5 text-white" />
                <h4 className="font-bold text-sm">Hangout em Vídeo</h4>
              </div>
              <p className="text-xs text-white/85 mb-3 leading-relaxed">
                Junte-se à sala de vídeo dos membros para bater papo ao vivo com câmera e áudio real.
              </p>
              <button
                onClick={() => onStartGroupVideoCall(selectedGroup)}
                className="w-full bg-white text-[#1877F2] hover:bg-blue-50 font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Abrir Sala de Vídeo Coletiva
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Groups Directory View
  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12">
      {/* Top Header & Search */}
      <div className="bg-white rounded-2xl border border-[#E4E6EB] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#050505] tracking-tight">Grupos & Comunidades</h2>
          <p className="text-xs text-[#65676B]">
            Participe de comunidades sobre os seus interesses e entre em salas de vídeo ao vivo.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#65676B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar comunidades..."
              className="w-full pl-9 pr-4 py-2 bg-[#F0F2F5] hover:bg-[#E4E6EB] focus:bg-white text-xs text-[#050505] rounded-full border border-transparent focus:border-[#1877F2] focus:outline-hidden transition-all"
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166FE5] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Grupo</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Meus Grupos vs Descobrir */}
      <div className="flex items-center gap-2 border-b border-[#E4E6EB] pb-1">
        <button
          onClick={() => setActiveSubTab('my')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'my'
              ? 'bg-[#1877F2] text-white shadow-xs'
              : 'text-[#65676B] hover:bg-white'
          }`}
        >
          Meus Grupos ({myGroups.length})
        </button>

        <button
          onClick={() => setActiveSubTab('discover')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'discover'
              ? 'bg-[#1877F2] text-white shadow-xs'
              : 'text-[#65676B] hover:bg-white'
          }`}
        >
          Descobrir Novos Grupos ({discoverGroups.length})
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-2xl border border-[#E4E6EB] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
          >
            <div className="h-28 w-full relative overflow-hidden bg-neutral-200">
              <img
                src={group.coverImage}
                alt={group.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                {group.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={group.avatar}
                    alt={group.name}
                    className="w-10 h-10 rounded-xl object-cover border-2 border-white -mt-6 shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3
                      onClick={() => setSelectedGroup(group)}
                      className="font-bold text-sm text-[#050505] truncate hover:text-[#1877F2] cursor-pointer"
                    >
                      {group.name}
                    </h3>
                    <p className="text-[11px] text-[#65676B]">
                      {group.memberCount.toLocaleString()} membros • {group.privacy}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#65676B] line-clamp-2 leading-relaxed mb-3">
                  {group.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#E4E6EB]">
                <button
                  onClick={() => setSelectedGroup(group)}
                  className="flex-1 bg-[#F0F2F5] hover:bg-[#E4E6EB] text-[#050505] text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Ver Comunidade
                </button>

                <button
                  onClick={() => onToggleJoinGroup(group.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    group.isMember
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-[#1877F2] hover:bg-[#166FE5] text-white shadow-2xs'
                  }`}
                >
                  {group.isMember ? 'Participando' : 'Entrar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E4E6EB] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#E4E6EB] flex items-center justify-between">
              <h3 className="font-bold text-base text-[#050505]">Criar Novo Grupo</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-[#F0F2F5] hover:bg-[#E4E6EB] flex items-center justify-center text-[#65676B]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#65676B] mb-1">
                  Nome do Grupo
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ex: Desenvolvedores Full Stack Brasil"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CCD0D5] focus:border-[#1877F2] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#65676B] mb-1">
                  Slogan ou Frase Resumo
                </label>
                <input
                  type="text"
                  value={newGroupTagline}
                  onChange={(e) => setNewGroupTagline(e.target.value)}
                  placeholder="Ex: Comunidade de entusiastas de código e inovação"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CCD0D5] focus:border-[#1877F2] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#65676B] mb-1">
                    Categoria
                  </label>
                  <select
                    value={newGroupCategory}
                    onChange={(e) => setNewGroupCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CCD0D5] focus:border-[#1877F2] focus:outline-hidden bg-white"
                  >
                    <option value="Tecnologia & Inovação">Tecnologia & Inovação</option>
                    <option value="Artes & Fotografia">Artes & Fotografia</option>
                    <option value="Viagens & Turismo">Viagens & Turismo</option>
                    <option value="Entretenimento & Jogos">Entretenimento & Jogos</option>
                    <option value="Educação & Carreiras">Educação & Carreiras</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#65676B] mb-1">
                    Privacidade
                  </label>
                  <select
                    value={newGroupPrivacy}
                    onChange={(e) => setNewGroupPrivacy(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CCD0D5] focus:border-[#1877F2] focus:outline-hidden bg-white"
                  >
                    <option value="Público">Público (Qualquer um pode ver)</option>
                    <option value="Privado">Privado (Apenas membros)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#65676B] mb-1">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Conte sobre os objetivos e regras do grupo..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CCD0D5] focus:border-[#1877F2] focus:outline-hidden resize-none"
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
                  Criar Comunidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
