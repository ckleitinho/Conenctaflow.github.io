'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Layout,
  MessageCircle,
  Users
} from 'lucide-react';
import { GitHubProject, GitHubCategory } from '@/lib/types';
import { 
  subscribeGitHubProjects, 
  createGitHubProjectInDb, 
  toggleLikeGitHubProjectInDb
} from '@/lib/firestore-service';
import { LandingHeader } from '@/components/landing/Header';

export default function GitHubIoPage() {
  const [projects, setProjects] = useState<GitHubProject[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Guide Copy State
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'beginner' | 'nextjs' | 'domain'>('nextjs');

  const categories: string[] = ['Todos', 'Portfólio', 'Documentação', 'Ferramentas', 'Jogos', 'Landing Page', 'Outros'];

  // Load Projects from Firestore in real-time
  useEffect(() => {
    const unsubscribe = subscribeGitHubProjects((data) => {
      setProjects(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  const handleAddSubmit = async (e: React.FormEvent) => {
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
      description: formDescription.trim() || 'Projeto web hospedado no GitHub Pages.',
      category: formCategory,
      tags: tagsArray.length > 0 ? tagsArray : ['GitHub Pages', 'Web'],
      authorId: 'visitor',
      authorName: 'Membro ConectaFlow',
      authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=visitor&backgroundColor=1877f2',
      starsCount: 0,
      likesCount: 1,
      likedBy: [],
      createdAt: Date.now(),
      previewImage: formImage.trim() || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    };

    try {
      const docRef = await createGitHubProjectInDb(newProjectPayload);
      const newProject: GitHubProject = { id: docRef.id, ...newProjectPayload };
      setProjects((prev) => [newProject, ...prev]);

      // Reset Form
      setFormTitle('');
      setFormUrl('');
      setFormRepoUrl('');
      setFormDescription('');
      setFormTags('');
      setFormImage('');
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar projeto:', err);
    }
  };

  const handleLikeProject = async (projectId: string) => {
    try {
      await toggleLikeGitHubProjectInDb(projectId, 'visitor');
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === projectId) {
            const hasLiked = (p.likedBy || []).includes('visitor');
            const newLikedBy = hasLiked
              ? (p.likedBy || []).filter((id) => id !== 'visitor')
              : [...(p.likedBy || []), 'visitor'];
            return {
              ...p,
              likedBy: newLikedBy,
              likesCount: hasLiked ? Math.max(0, (p.likesCount || 0) - 1) : (p.likesCount || 0) + 1,
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error('Erro ao dar like:', err);
    }
  };

  const sampleWorkflowYaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install & Build
        run: |
          npm ci
          npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#1877F2] selection:text-white flex flex-col">
      {/* Header */}
      <LandingHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Banner Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D1117] via-[#161B22] to-slate-900 p-6 sm:p-10 text-white shadow-xl border border-slate-800">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Github className="w-3.5 h-3.5" />
              <span>Hub Oficial github.io • ConectaFlow</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Vitrine de Projetos <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">github.io</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Publique seus portfólios, documentações e aplicativos hospedados no <strong>GitHub Pages</strong>. Teste a responsividade em tempo real em múltiplos dispositivos ou compartilhe com a comunidade!
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 active:scale-98 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Meu Projeto github.io</span>
              </button>

              <button
                onClick={() => setIsGuideOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Como publicar no github.io</span>
              </button>

              <Link
                href="/app"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center gap-2 transition-all ml-auto"
              >
                <span>Abrir App Completo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories Horizontal Slider */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1877F2] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Input */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar projeto, autor, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20 focus:border-[#1877F2] transition-all"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="recent">Mais Recentes</option>
              <option value="likes">Mais Curtidos</option>
              <option value="featured">Destaques</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#1877F2] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-500">Carregando projetos do Hub github.io...</p>
          </div>
        ) : sortedProjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Github className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Nenhum projeto encontrado</h3>
              <p className="text-slate-500 text-xs">
                Seja o primeiro a publicar seu projeto do <strong>github.io</strong> e mostre seu trabalho para a comunidade!
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-bold shadow-md inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Projeto Agora</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map((project) => {
              const hasLiked = (project.likedBy || []).includes('visitor');

              return (
                <article
                  key={project.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                >
                  {/* Image Preview Container */}
                  <div className="relative h-44 bg-slate-900 overflow-hidden group-hover:opacity-95 transition-opacity">
                    <img
                      src={project.previewImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badge Category */}
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                      {project.category}
                    </span>

                    {/* Test Responsive Button Overlay */}
                    <button
                      onClick={() => {
                        setPreviewProject(project);
                        setPreviewDevice('desktop');
                      }}
                      className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs"
                    >
                      <Laptop className="w-4 h-4 text-blue-400" />
                      <span>Testar em Tela Interativa</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#1877F2] font-semibold truncate">
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{project.url.replace(/^https?:\/\//, '')}</span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-[#1877F2] transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Author & Actions Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={project.authorAvatar}
                          alt={project.authorName}
                          className="w-6 h-6 rounded-full border border-slate-200"
                        />
                        <span className="text-xs font-bold text-slate-700 truncate">{project.authorName}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Like Button */}
                        <button
                          onClick={() => handleLikeProject(project.id)}
                          className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            hasLiked
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                          <span>{project.likesCount || 0}</span>
                        </button>

                        {/* Open Direct Link */}
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#1877F2] hover:bg-blue-600 text-white transition-all"
                          title="Abrir site original em nova aba"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal: Add New github.io Project */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D1117] text-white flex items-center justify-center font-bold">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Novo Projeto github.io</h3>
                  <p className="text-xs text-slate-500">Cadastre seu link hospedado no GitHub Pages</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Projeto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Meu Portfólio Dev 3D"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20 focus:border-[#1877F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL do GitHub Pages (.github.io) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://seuusuario.github.io/meu-projeto"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20 focus:border-[#1877F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL do Repositório (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://github.com/seuusuario/meu-projeto"
                  value={formRepoUrl}
                  onChange={(e) => setFormRepoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20 focus:border-[#1877F2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                  >
                    <option value="Portfólio">Portfólio</option>
                    <option value="Documentação">Documentação</option>
                    <option value="Ferramentas">Ferramentas</option>
                    <option value="Jogos">Jogos</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    placeholder="React, Tailwind, WebGL"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  placeholder="Descreva o que o seu projeto faz..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL da Capa/Preview (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-bold shadow-md"
                >
                  Publicar no Hub github.io
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Interactive Device Preview Frame */}
      {previewProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col p-2 sm:p-6">
          {/* Top Control Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-t-2xl p-3 flex items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-sm font-display text-white">{previewProject.title}</span>
              <span className="hidden sm:inline bg-blue-500/20 text-blue-300 font-mono text-[11px] px-2 py-0.5 rounded border border-blue-500/30">
                {previewProject.url}
              </span>
            </div>

            {/* Device Toggle Buttons */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  previewDevice === 'desktop' ? 'bg-[#1877F2] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Visualização Desktop"
              >
                <Laptop className="w-4 h-4" />
                <span className="hidden md:inline">Desktop</span>
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  previewDevice === 'tablet' ? 'bg-[#1877F2] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Visualização Tablet"
              >
                <Tablet className="w-4 h-4" />
                <span className="hidden md:inline">Tablet</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  previewDevice === 'mobile' ? 'bg-[#1877F2] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Visualização Mobile"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden md:inline">Mobile</span>
              </button>
            </div>

            <button
              onClick={() => setPreviewProject(null)}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Device Frame Viewport */}
          <div className="flex-1 bg-slate-900 rounded-b-2xl border-x border-b border-slate-800 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
            <div
              className={`transition-all duration-300 h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-700 ${
                previewDevice === 'desktop'
                  ? 'w-full max-w-6xl'
                  : previewDevice === 'tablet'
                  ? 'w-[768px]'
                  : 'w-[375px]'
              }`}
            >
              <iframe
                src={previewProject.url}
                title={previewProject.title}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        </div>
      )}

      {/* Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1877F2] flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Guia Completo github.io</h3>
                  <p className="text-xs text-slate-500">Como publicar seu app no GitHub Pages gratuitamente</p>
                </div>
              </div>

              <button onClick={() => setIsGuideOpen(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Crie um repositório no GitHub com o nome <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#1877F2] font-mono">seuusuario.github.io</code>.
                </li>
                <li>
                  Faça push do seu projeto compilado em HTML estático (como export do Next.js <code className="bg-slate-100 px-1 rounded font-mono">output: 'export'</code> ou Vite).
                </li>
                <li>
                  Em <strong>Settings &gt; Pages</strong>, selecione a branch <code className="bg-slate-100 px-1 rounded font-mono">main</code> como fonte de deploy.
                </li>
                <li>
                  Aguarde alguns instantes e seu site estará ao vivo na URL <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#1877F2] font-mono">https://seuusuario.github.io</code>!
                </li>
              </ol>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] relative space-y-2">
                <p className="text-slate-400">// Exemplo de Workflow GitHub Actions em .github/workflows/deploy.yml</p>
                <pre className="overflow-x-auto max-h-40 scrollbar-thin text-emerald-400">{sampleWorkflowYaml}</pre>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sampleWorkflowYaml);
                    setCopiedWorkflow(true);
                    setTimeout(() => setCopiedWorkflow(false), 2000);
                  }}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-sans text-[10px] font-bold flex items-center gap-1 border border-slate-700"
                >
                  {copiedWorkflow ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedWorkflow ? 'Copiado!' : 'Copiar YAML'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="px-5 py-2.5 bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Entendi, Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
