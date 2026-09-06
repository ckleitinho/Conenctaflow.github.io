'use client';

import React, { useState } from 'react';
import { 
  Github, 
  Globe, 
  ExternalLink, 
  Plus, 
  Search, 
  Star, 
  Heart, 
  Share2, 
  BookOpen, 
  Code, 
  Terminal, 
  Check, 
  Copy, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Sparkles, 
  X, 
  Trash2, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { User, GitHubProject, GitHubCategory } from '@/lib/types';

interface GitHubPagesViewProps {
  currentUser: User;
  projects: GitHubProject[];
  onCreateProject: (project: Omit<GitHubProject, 'id'>, shareToFeed?: boolean) => void;
  onLikeProject: (projectId: string) => void;
  onDeleteProject?: (projectId: string) => void;
  onShareToFeed?: (project: GitHubProject) => void;
}

export const GitHubPagesView: React.FC<GitHubPagesViewProps> = ({
  currentUser,
  projects,
  onCreateProject,
  onLikeProject,
  onDeleteProject,
  onShareToFeed,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'recent' | 'likes' | 'featured'>('recent');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<GitHubProject | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formRepoUrl, setFormRepoUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<GitHubCategory>('Portfólio');
  const [formTags, setFormTags] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formShareToFeed, setFormShareToFeed] = useState(true);

  // Guide Copy State
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'beginner' | 'nextjs' | 'domain'>('nextjs');

  const categories: string[] = ['Todos', 'Portfólio', 'Documentação', 'Ferramentas', 'Jogos', 'Landing Page', 'Outros'];

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'featured') {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
    }
    if (sortBy === 'likes') {
      return (b.likesCount || 0) - (a.likesCount || 0);
    }
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;

    let cleanUrl = formUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    let cleanRepoUrl = formRepoUrl.trim();
    if (cleanRepoUrl && !cleanRepoUrl.startsWith('http://') && !cleanRepoUrl.startsWith('https://')) {
      cleanRepoUrl = `https://${cleanRepoUrl}`;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newProjectPayload: Omit<GitHubProject, 'id'> = {
      title: formTitle.trim(),
      url: cleanUrl,
      repoUrl: cleanRepoUrl || undefined,
      description: formDescription.trim() || 'Projeto hospedado no GitHub Pages.',
      category: formCategory,
      tags: tagsArray.length > 0 ? tagsArray : ['GitHub Pages', 'Web'],
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      starsCount: Math.floor(Math.random() * 20) + 5,
      likesCount: 1,
      likedBy: [currentUser.id],
      previewImage: formImage.trim() || undefined,
      createdAt: Date.now(),
      isFeatured: true,
    };

    onCreateProject(newProjectPayload, formShareToFeed);

    // Reset Form
    setFormTitle('');
    setFormUrl('');
    setFormRepoUrl('');
    setFormDescription('');
    setFormCategory('Portfólio');
    setFormTags('');
    setFormImage('');
    setIsAddModalOpen(false);
  };

  const workflowYaml = `name: Deploy Next.js to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  const copyWorkflow = () => {
    navigator.clipboard.writeText(workflowYaml);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0D1117] via-[#161B22] to-[#21262D] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-[#30363D]">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Github size={280} />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            GitHub Pages Community Hub
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Projetos <span className="text-blue-400 font-mono">github.io</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Mostre seu portfólio, documentação, jogos e aplicações web hospedadas gratuitamente no GitHub Pages. Descubra e teste projetos criados por outros membros da comunidade ConectaFlow!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-[#1877F2] hover:bg-blue-600 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-blue-500/20 active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Publicar Meu GitHub.io
            </button>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-2 bg-[#21262D] hover:bg-[#30363D] text-gray-200 font-medium text-sm px-4 py-2.5 rounded-xl border border-[#30363D] transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              Guia de Deploy Grátis
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Categories */}
      <div className="bg-white rounded-xl p-4 border border-[#E4E6EB] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, autor ou tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0F2F5] text-sm pl-9 pr-4 py-2 rounded-lg border border-transparent focus:border-[#1877F2] focus:bg-white focus:outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-gray-500 font-medium shrink-0">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F0F2F5] text-xs font-medium text-gray-700 px-3 py-2 rounded-lg border border-transparent focus:border-[#1877F2] focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="recent">Mais Recentes</option>
              <option value="likes">Mais Curtidos</option>
              <option value="featured">Destaques da Comunidade</option>
            </select>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1877F2] text-white shadow-xs'
                  : 'bg-[#F0F2F5] text-gray-600 hover:bg-[#E4E6EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {sortedProjects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E4E6EB] space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-[#1877F2] rounded-full flex items-center justify-center mx-auto">
            <Globe className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Nenhum projeto encontrado</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {searchQuery || selectedCategory !== 'Todos'
              ? 'Tente ajustar seus termos de busca ou filtros de categoria.'
              : 'Seja o primeiro desenvolvedor a publicar um projeto hosted no github.io na comunidade!'}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#1877F2] text-white font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Adicionar Primeiro Projeto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedProjects.map((project) => {
            const isLiked = project.likedBy?.includes(currentUser.id);
            const isOwner = project.authorId === currentUser.id;

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-[#E4E6EB] hover:border-blue-300 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Image Banner / Preview Header */}
                <div className="relative h-44 bg-gradient-to-br from-[#0D1117] to-[#161B22] overflow-hidden">
                  {project.previewImage ? (
                    <img
                      src={project.previewImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white space-y-2">
                      <Globe className="w-10 h-10 text-blue-400 opacity-80" />
                      <span className="font-mono text-xs text-blue-300 truncate max-w-full px-2 py-0.5 rounded bg-black/40 border border-white/10">
                        {project.url.replace(/^https?:\/\//, '')}
                      </span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-blue-400" />
                      github.io
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-semibold">
                      {project.category}
                    </span>
                  </div>

                  {project.isFeatured && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black font-bold text-[10px] flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3 fill-black" />
                        Destaque
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {/* Author & Title */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <img
                        src={project.authorAvatar}
                        alt={project.authorName}
                        className="w-5 h-5 rounded-full object-cover border border-gray-200"
                      />
                      <span className="font-medium text-gray-700 truncate">{project.authorName}</span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-[#1877F2] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-[#F0F2F5] text-gray-600 rounded text-[11px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Links */}
                  <div className="pt-3 border-t border-[#E4E6EB] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onLikeProject(project.id)}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                          isLiked
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Curtir Projeto"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                        <span>{project.likesCount || 0}</span>
                      </button>

                      <button
                        onClick={() => setPreviewProject(project)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium bg-blue-50 text-[#1877F2] hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Testar Interativamente"
                      >
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Testar</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Ver Código no GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}

                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-500 hover:text-[#1877F2] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Abrir Site em Nova Aba"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {onShareToFeed && (
                        <button
                          onClick={() => onShareToFeed(project)}
                          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                          title="Compartilhar no Feed do ConectaFlow"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      )}

                      {isOwner && onDeleteProject && (
                        <button
                          onClick={() => onDeleteProject(project.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Meu Projeto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL: ADICIONAR PROJETO ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E4E6EB] bg-[#F0F2F5]/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#0D1117] text-white rounded-lg">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Publicar Projeto GitHub.io</h3>
                  <p className="text-xs text-gray-500">Divulgue seu site hospedado no GitHub Pages</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Título do Projeto <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Meu Portfólio Full-Stack 2026"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4E6EB] focus:border-[#1877F2] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Link do GitHub Pages (.github.io) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="https://seu-usuario.github.io/projeto"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E4E6EB] focus:border-[#1877F2] focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Link do Repositório GitHub (Opcional)
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="https://github.com/seu-usuario/repositorio"
                    value={formRepoUrl}
                    onChange={(e) => setFormRepoUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E4E6EB] focus:border-[#1877F2] focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Categoria</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E4E6EB] focus:border-[#1877F2] focus:outline-none"
                  >
                    {categories.filter((c) => c !== 'Todos').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    placeholder="React, Nextjs, Tailwind"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E4E6EB] focus:border-[#1877F2] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Descrição Curta</label>
                <textarea
                  rows={3}
                  placeholder="Conte um pouco sobre o que o seu site/projeto faz..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4E6EB] focus:border-[#1877F2] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">URL da Imagem de Capa/Preview (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4E6EB] focus:border-[#1877F2] focus:outline-none text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="shareToFeed"
                  checked={formShareToFeed}
                  onChange={(e) => setFormShareToFeed(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1877F2] focus:ring-[#1877F2]"
                />
                <label htmlFor="shareToFeed" className="text-xs text-gray-700 cursor-pointer">
                  Publicar também um anúncio automático no Feed Principal do ConectaFlow
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E6EB]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-medium text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-medium text-xs shadow-xs cursor-pointer"
                >
                  Publicar no Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: TESTE INTERATIVO / SANDBOX ================= */}
      {previewProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-2 sm:p-4">
          {/* Top Control Bar */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-t-xl p-3 flex items-center justify-between text-white gap-3">
            <div className="flex items-center gap-2.5 truncate">
              <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
                <Globe className="w-4 h-4" />
              </span>
              <div className="truncate">
                <h4 className="font-bold text-sm truncate">{previewProject.title}</h4>
                <a
                  href={previewProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-blue-400 font-mono truncate block"
                >
                  {previewProject.url}
                </a>
              </div>
            </div>

            {/* Device Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-[#0D1117] p-1 rounded-lg border border-[#30363D]">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                  previewDevice === 'desktop' ? 'bg-[#1877F2] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                Desktop
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                  previewDevice === 'tablet' ? 'bg-[#1877F2] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                Tablet
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                  previewDevice === 'mobile' ? 'bg-[#1877F2] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile
              </button>
            </div>

            {/* External & Close */}
            <div className="flex items-center gap-2">
              <a
                href={previewProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-200 px-3 py-1.5 rounded-lg border border-[#30363D] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Abrir Guia</span>
              </a>

              <button
                onClick={() => setPreviewProject(null)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Frame Container */}
          <div className="flex-1 bg-[#0D1117] border-x border-b border-[#30363D] rounded-b-xl flex items-center justify-center p-2 sm:p-4 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-300 bg-white rounded-lg shadow-2xl overflow-hidden ${
                previewDevice === 'mobile'
                  ? 'w-[375px]'
                  : previewDevice === 'tablet'
                  ? 'w-[768px]'
                  : 'w-full'
              }`}
            >
              <iframe
                src={previewProject.url}
                title={previewProject.title}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: GUIA DE DEPLOY NO GITHUB PAGES ================= */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between p-5 border-b border-[#E4E6EB] bg-[#0D1117] text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Como Criar e Hospedar no GitHub Pages</h3>
                  <p className="text-xs text-gray-400">Guia passo a passo para hospedar sites gratuitamente</p>
                </div>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Selector */}
            <div className="flex border-b border-[#E4E6EB] bg-[#F0F2F5]/60 p-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveGuideTab('nextjs')}
                className={`flex-1 py-2 px-3 rounded-lg transition-all ${
                  activeGuideTab === 'nextjs'
                    ? 'bg-white text-[#1877F2] shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Next.js / React (CI/CD Auto)
              </button>
              <button
                onClick={() => setActiveGuideTab('beginner')}
                className={`flex-1 py-2 px-3 rounded-lg transition-all ${
                  activeGuideTab === 'beginner'
                    ? 'bg-white text-[#1877F2] shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                HTML / CSS Simples
              </button>
              <button
                onClick={() => setActiveGuideTab('domain')}
                className={`flex-1 py-2 px-3 rounded-lg transition-all ${
                  activeGuideTab === 'domain'
                    ? 'bg-white text-[#1877F2] shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Domínio Próprio (.com)
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
              {activeGuideTab === 'nextjs' && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#1877F2]" />
                      Deploy Automático com GitHub Actions para Next.js / React
                    </p>
                    <p>
                      Crie o arquivo <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">.github/workflows/deploy.yml</code> no seu repositório do GitHub e adicione o script abaixo. Cada vez que você fizer push para a branch <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">main</code>, seu site será atualizado automaticamente no link <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">https://seu-usuario.github.io/repositorio</code>!
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-gray-700">
                      <span>.github/workflows/deploy.yml</span>
                      <button
                        onClick={copyWorkflow}
                        className="flex items-center gap-1 text-[#1877F2] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        {copiedWorkflow ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-600">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar YAML</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="bg-[#0D1117] text-gray-200 p-3.5 rounded-xl text-xs font-mono overflow-x-auto max-h-56 scrollbar-thin border border-[#30363D]">
                      {workflowYaml}
                    </pre>
                  </div>

                  <div className="space-y-2 text-xs text-gray-700">
                    <h4 className="font-bold text-gray-900">Passos Finais no GitHub:</h4>
                    <ol className="list-decimal list-inside space-y-1.5 pl-1">
                      <li>No seu <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">next.config.ts</code>, certifique-se de definir <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">output: &apos;export&apos;</code>.</li>
                      <li>Vá nas <strong>Settings</strong> do seu repositório no GitHub &gt; <strong>Pages</strong>.</li>
                      <li>Em <strong>Source</strong>, selecione <strong>GitHub Actions</strong>.</li>
                      <li>Aguarde o Workflow rodar e seu link <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">*.github.io</code> estará online!</li>
                    </ol>
                  </div>
                </div>
              )}

              {activeGuideTab === 'beginner' && (
                <div className="space-y-4 text-xs text-gray-700">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-900">
                    <h4 className="font-bold text-sm mb-1">Como criar um site estático no GitHub Pages:</h4>
                    <p>O método mais rápido para publicar arquivos index.html, styles.css e scripts JS.</p>
                  </div>

                  <ol className="space-y-3 pl-1">
                    <li className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                      <div>
                        <p className="font-bold text-gray-900">Crie um novo repositório no GitHub</p>
                        <p className="text-gray-500">Nomeie o repositório como <code className="bg-gray-100 px-1 rounded font-mono">seu-usuario.github.io</code> para criar seu site principal ou qualquer outro nome para um subprojeto.</p>
                      </div>
                    </li>

                    <li className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                      <div>
                        <p className="font-bold text-gray-900">Adicione o arquivo index.html</p>
                        <p className="text-gray-500">Suba o arquivo <code className="bg-gray-100 px-1 rounded font-mono">index.html</code> na raiz do projeto e faça o commit.</p>
                      </div>
                    </li>

                    <li className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                      <div>
                        <p className="font-bold text-gray-900">Ative o GitHub Pages</p>
                        <p className="text-gray-500">Acesse <strong>Settings &gt; Pages</strong>, escolha a branch <code className="bg-gray-100 px-1 rounded font-mono">main</code> na pasta <code className="bg-gray-100 px-1 rounded font-mono">/ (root)</code> e clique em <strong>Save</strong>.</p>
                      </div>
                    </li>
                  </ol>
                </div>
              )}

              {activeGuideTab === 'domain' && (
                <div className="space-y-3 text-xs text-gray-700">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900">
                    <h4 className="font-bold text-sm mb-1">Usando um Domínio Próprio (Ex: meudominio.com):</h4>
                    <p>Aprenda a apontar seu domínio personalizado gratuitamente para os servidores do GitHub Pages.</p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-gray-900">1. Registros DNS no seu provedor (Cloudflare, GoDaddy, Namecheap):</p>
                    <div className="bg-[#0D1117] text-gray-200 p-3 rounded-xl font-mono text-xs space-y-1 border border-[#30363D]">
                      <p>Tipo A | Nome: @ | Valor: 185.199.108.153</p>
                      <p>Tipo A | Nome: @ | Valor: 185.199.109.153</p>
                      <p>Tipo CNAME | Nome: www | Valor: seu-usuario.github.io</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">2. Configuração no GitHub:</p>
                    <p className="text-gray-600">Em <strong>Settings &gt; Pages &gt; Custom Domain</strong>, digite seu domínio e marque a opção <strong>Enforce HTTPS</strong> para ter certificado SSL gratuito!</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#F0F2F5] border-t border-[#E4E6EB] flex justify-end">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="px-5 py-2 bg-[#1877F2] text-white font-medium text-xs rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Entendi, fechar guia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
