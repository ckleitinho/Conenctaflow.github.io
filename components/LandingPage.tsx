'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LandingHeader } from './landing/Header';
import { 
  Globe, 
  Github, 
  Video, 
  Users, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Heart, 
  Share2, 
  Laptop, 
  Smartphone, 
  Star, 
  Lock, 
  Radio, 
  Layout, 
  Terminal, 
  Code2, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Smile,
  ThumbsUp,
  X,
  Image as ImageIcon
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeDemoTab, setActiveDemoTab] = useState<'feed' | 'video' | 'groups' | 'github'>('feed');

  // Interactive mock state for demo tab
  const [demoLiked, setDemoLiked] = useState(false);
  const [demoLikesCount, setDemoLikesCount] = useState(24);

  const toggleDemoLike = () => {
    if (demoLiked) {
      setDemoLiked(false);
      setDemoLikesCount((prev) => prev - 1);
    } else {
      setDemoLiked(true);
      setDemoLikesCount((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#1877F2] selection:text-white">
      {/* ================= 1. HEADER (Application Shell) ================= */}
      <LandingHeader />

      {/* ================= 2. HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC]">
        {/* Background Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/80 text-[#1877F2] text-xs sm:text-sm font-semibold shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#1877F2]" />
            <span>Rede Social Completa & Vídeos em Tempo Real</span>
            <span className="bg-[#1877F2] text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full">
              Novo
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Conecte-se, compartilhe e crie em <span className="bg-gradient-to-r from-[#1877F2] via-blue-600 to-indigo-600 bg-clip-text text-transparent">tempo real</span> sem complicações.
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            O <strong className="text-slate-900 font-semibold">ConectaFlow</strong> une feed interativo, grupos comunitários, chamadas de vídeo HD em grupo, bate-papo privado instantâneo e uma vitrine exclusiva para hospedar e testar seus projetos do <span className="text-[#1877F2] font-mono font-semibold">github.io</span>.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/app"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold bg-[#1877F2] hover:bg-blue-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-3 group active:scale-98 cursor-pointer"
            >
              <span>Começar agora — É Grátis</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#demo"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl text-base font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#1877F2] fill-[#1877F2]" />
              <span>Ver demonstração ao vivo</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sem download necessário</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sincronizado via Cloud Firestore</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Hub github.io Integrado</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. DEMONSTRAÇÃO VISUAL DO APP ================= */}
      <section id="demo" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Title */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1877F2]">
              Demonstração Interativa
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Veja como o ConectaFlow funciona por dentro
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              Navegue pelas abas abaixo para explorar a interface do aplicativo em tempo real antes de criar sua conta.
            </p>
          </div>

          {/* Interactive Demo Container */}
          <div className="bg-[#0F172A] rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl border border-slate-800 space-y-4 max-w-5xl mx-auto">
            {/* Mock Browser Header & Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
              {/* Window Dots & URL Bar */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-md text-xs font-mono text-slate-400 flex items-center gap-2 flex-1 sm:w-64">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span className="truncate">conectaflow.app/app</span>
                </div>
              </div>

              {/* Demo Tabs Switcher */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveDemoTab('feed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeDemoTab === 'feed'
                      ? 'bg-[#1877F2] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Feed Principal
                </button>
                <button
                  onClick={() => setActiveDemoTab('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeDemoTab === 'video'
                      ? 'bg-[#1877F2] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Vídeo Chamadas
                </button>
                <button
                  onClick={() => setActiveDemoTab('groups')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeDemoTab === 'groups'
                      ? 'bg-[#1877F2] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Grupos
                </button>
                <button
                  onClick={() => setActiveDemoTab('github')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeDemoTab === 'github'
                      ? 'bg-[#1877F2] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Hub github.io
                </button>
              </div>
            </div>

            {/* Mock Display Screen */}
            <div className="bg-[#F0F2F5] rounded-xl sm:rounded-2xl p-3 sm:p-6 min-h-[380px] sm:min-h-[460px] text-slate-900 flex flex-col justify-between overflow-hidden relative">
              {/* TAB 1: FEED PREVIEW */}
              {activeDemoTab === 'feed' && (
                <div className="space-y-4 max-w-xl mx-auto w-full animate-fade-in">
                  {/* Mock Story Bar */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                    <div className="w-14 h-20 rounded-xl bg-blue-600 text-white p-1.5 flex flex-col justify-between shrink-0 shadow-xs relative">
                      <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">+</span>
                      <span className="text-[10px] font-bold leading-tight">Seu Story</span>
                    </div>
                    <div className="w-14 h-20 rounded-xl bg-slate-800 text-white p-1.5 flex flex-col justify-between shrink-0 shadow-xs relative overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" alt="Ana" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                      <span className="relative z-10 text-[10px] font-bold text-white shadow-black drop-shadow">Ana C.</span>
                    </div>
                    <div className="w-14 h-20 rounded-xl bg-slate-800 text-white p-1.5 flex flex-col justify-between shrink-0 shadow-xs relative overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" alt="Lucas" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                      <span className="relative z-10 text-[10px] font-bold text-white shadow-black drop-shadow">Lucas M.</span>
                    </div>
                  </div>

                  {/* Mock Post Card */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=bruno&backgroundColor=1877f2"
                        alt="Bruno"
                        className="w-10 h-10 rounded-full border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">Bruno Silveira</h4>
                        <span className="text-xs text-slate-500">Publicado há 5 min • 🌐 Público</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Acabei de publicar meu novo portfólio no Hub <strong>github.io</strong> do ConectaFlow! O que acharam das animações em WebGL? 🚀🔥
                    </p>

                    <div className="rounded-lg overflow-hidden border border-slate-100 max-h-52">
                      <img
                        src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <button
                        onClick={toggleDemoLike}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                          demoLiked ? 'bg-blue-50 text-[#1877F2]' : 'hover:bg-slate-100'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${demoLiked ? 'fill-[#1877F2]' : ''}`} />
                        <span>{demoLikesCount} Curtidas</span>
                      </button>

                      <span className="hover:underline cursor-pointer">12 Comentários</span>
                      <span className="hover:underline cursor-pointer">4 Compartilhamentos</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VIDEO CALL PREVIEW */}
              {activeDemoTab === 'video' && (
                <div className="space-y-4 max-w-2xl mx-auto w-full animate-fade-in">
                  <div className="bg-slate-900 rounded-xl p-4 text-white shadow-md space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-bold text-slate-200">Sala de Reunião: Projeto ConectaFlow</span>
                      </div>
                      <span className="text-slate-400 font-mono">00:14:32</span>
                    </div>

                    {/* Participant Grid */}
                    <div className="grid grid-cols-2 gap-3 h-48">
                      <div className="bg-slate-800 rounded-lg overflow-hidden relative border border-slate-700">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" alt="Ana" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-medium text-white">Ana Costa (Sua Câmera)</span>
                      </div>
                      <div className="bg-slate-800 rounded-lg overflow-hidden relative border border-slate-700">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" alt="Lucas" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-medium text-white">Lucas Mendes</span>
                      </div>
                    </div>

                    {/* Controls Bar */}
                    <div className="flex items-center justify-center gap-3 pt-1">
                      <span className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full cursor-pointer"><Video className="w-4 h-4 text-white" /></span>
                      <span className="p-2 bg-rose-600 hover:bg-rose-700 rounded-full cursor-pointer"><X className="w-4 h-4 text-white" /></span>
                      <span className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full cursor-pointer"><MessageSquare className="w-4 h-4 text-white" /></span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GROUPS PREVIEW */}
              {activeDemoTab === 'groups' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto w-full animate-fade-in">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-100 text-[#1877F2] rounded-xl font-bold text-xs">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Desenvolvedores Full-Stack</h4>
                        <span className="text-xs text-slate-500">1.240 membros</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">Discussões sobre React, Next.js, Node.js e arquiteturas web.</p>
                    <button className="w-full py-1.5 bg-[#1877F2] text-white rounded-lg text-xs font-semibold">Participar do Grupo</button>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl font-bold text-xs">
                        <Github className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Comunidade github.io</h4>
                        <span className="text-xs text-slate-500">890 membros</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">Compartilhe projetos, peça reviews de código e mostre seus deploys.</p>
                    <button className="w-full py-1.5 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold">Ver Tópicos</button>
                  </div>
                </div>
              )}

              {/* TAB 4: GITHUB HUB PREVIEW */}
              {activeDemoTab === 'github' && (
                <div className="space-y-3 max-w-2xl mx-auto w-full animate-fade-in">
                  <div className="bg-[#0D1117] text-white rounded-xl p-4 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        bruno-dev.github.io/portfolio-3d
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>42 Stars</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-base text-white">Portfólio Dev Interativo 3D</h4>
                    <p className="text-xs text-slate-400">Desenvolvido com React, Three.js e Tailwind CSS. Inclui modelo 3D interativo.</p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">#React</span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">#ThreeJS</span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">#WebGL</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom CTA Overlay */}
              <div className="pt-4 text-center border-t border-slate-200">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <span>Experimentar aplicativo completo agora</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. PRINCIPAIS RECURSOS ================= */}
      <section id="recursos" className="py-16 sm:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1877F2]">
              Tudo em um só lugar
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Recursos modernos para uma experiência social completa
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              O ConectaFlow foi projetado do zero com foco em usabilidade, velocidade e interação em tempo real.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1877F2] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Feed & Reações Instantâneas</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Publicações dinâmicas com suporte a imagens, reações emocionais, comentários em tempo real, denúncias e moderação de conteúdo.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Vídeo Chamadas & Rádio HD</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Videoconferências individuais ou em grupo diretamente no seu navegador, com alta qualidade de áudio e sala de transmissão ao vivo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#0D1117] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Github className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Hub Especial github.io</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Publique seus projetos hospedados no GitHub Pages, teste interativamente em múltiplos dispositivos e ganhe estrelas da comunidade.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Grupos & Comunidades</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Crie comunidades temáticas para discutir tecnologia, esportes, jogos e hobbies com canais de conversa exclusivos.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Mensagens Privadas Flutuantes</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bate-papo direto estilo messenger em janelas flutuantes com notificação sonora e presença de amigos online.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">PWA & Nuvem Firestore</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Instalável como aplicativo PWA no celular e desktop, com sincronização em nuvem e persistência ilimitada de dados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. SEÇÃO DE BENEFÍCIOS ================= */}
      <section id="beneficios" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column Text */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1877F2]">
                Por que escolher o ConectaFlow?
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Uma plataforma projetada para integrar pessoas e projetos de forma simples.
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Diferente de redes sociais genéricas, o ConectaFlow é desenhado para quem cria, desenvolve e se comunica ativamente no dia a dia.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm sm:text-base">Sincronização em Nuvem sem Perda de Dados</h5>
                    <p className="text-xs sm:text-sm text-slate-600">Seus posts, chats e preferências ficam salvos com segurança via Firebase Firestore.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-[#1877F2] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm sm:text-base">Vitrine Grátis para seus Projetos Web</h5>
                    <p className="text-xs sm:text-sm text-slate-600">Mostre seus portfólios no <code className="bg-slate-100 px-1 rounded text-[#1877F2] font-mono">github.io</code> e ganhe visibilidade real.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm sm:text-base">Interface Responsiva e Sem Anúncios Poluídos</h5>
                    <p className="text-xs sm:text-sm text-slate-600">Design moderno, limpo e otimizado para celulares, tablets e computadores.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <span>Acessar aplicativo agora</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column Decorative Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden border border-slate-800">
              <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
                <ShieldCheck size={280} />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" />
                Arquitetura de Alta Performance
              </div>

              <h4 className="text-2xl font-bold leading-snug">
                Tecnologia moderna: Next.js 15, Tailwind CSS & Firebase Cloud
              </h4>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Aproveite um aplicativo ultra-rápido, otimizado para carregamento instantâneo e preparado para conexões lentas ou offline com Service Workers PWA.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/80">
                <div>
                  <span className="block text-2xl font-extrabold text-blue-400">100%</span>
                  <span className="text-xs text-slate-400">Gratuito para Usar</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-blue-400">&lt; 100ms</span>
                  <span className="text-xs text-slate-400">Tempo de Sincronização</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. DEPOIMENTOS ================= */}
      <section id="depoimentos" className="py-16 sm:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1877F2]">
              Comunidade Ativa
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              O que dizem os membros do ConectaFlow
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &ldquo;O Hub github.io integrado transformou como mostro meus projetos. Em poucos minutos recebi feedback de outros devs diretamente no feed!&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=camila&backgroundColor=1877f2"
                  alt="Camila"
                  className="w-9 h-9 rounded-full border border-slate-200"
                />
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">Camila Torres</h5>
                  <span className="text-[11px] text-slate-500">Desenvolvedora Front-End</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &ldquo;As chamadas de vídeo HD em grupo funcionam sem precisar instalar nada no computador. Usamos para nossas reuniões diárias da faculdade.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=bruno&backgroundColor=1877f2"
                  alt="Bruno"
                  className="w-9 h-9 rounded-full border border-slate-200"
                />
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">Bruno Silveira</h5>
                  <span className="text-[11px] text-slate-500">Estudante de Ciência da Computação</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &ldquo;Adoro o feed limpo e a possibilidade de interagir em grupos temáticos. A sincronização instantânea do chat flutuante é muito ágil.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=lucas&backgroundColor=1877f2"
                  alt="Lucas"
                  className="w-9 h-9 rounded-full border border-slate-200"
                />
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">Lucas Mendes</h5>
                  <span className="text-[11px] text-slate-500">Criador de Conteúdo Tech</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. CTA BANNER FINAL ================= */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Pronto para se conectar com a comunidade?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Acesse agora mesmo o aplicativo ConectaFlow, publique seus momentos, participe de grupos e compartilhe seus projetos no GitHub.
          </p>
          <div className="pt-2">
            <Link
              href="/app"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold bg-[#1877F2] hover:bg-blue-600 text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-98 cursor-pointer"
            >
              <span>Começar agora gratuitamente</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 8. FOOTER ================= */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1877F2] flex items-center justify-center text-white font-black text-sm">
                  CF
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                  Conecta<span className="text-[#1877F2]">Flow</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Rede social completa com feed dinâmico, grupos, chamadas de vídeo HD em tempo real e hub de projetos no github.io.
              </p>
            </div>

            {/* Col 2: Navegação */}
            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Navegação</h5>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#recursos" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Demonstração</a></li>
                <li><a href="#beneficios" className="hover:text-white transition-colors">Benefícios</a></li>
                <li><a href="#github-io" className="hover:text-white transition-colors">Hub github.io</a></li>
                <li><a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a></li>
              </ul>
            </div>

            {/* Col 3: Aplicativo */}
            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Aplicativo</h5>
              <ul className="space-y-1.5 text-xs">
                <li><Link href="/app" className="hover:text-white transition-colors">Feed Principal</Link></li>
                <li><Link href="/app" className="hover:text-white transition-colors">Grupos & Comunidades</Link></li>
                <li><Link href="/app" className="hover:text-white transition-colors">Vídeo Chamadas HD</Link></li>
                <li><Link href="/app" className="hover:text-white transition-colors">Projetos github.io</Link></li>
              </ul>
            </div>

            {/* Col 4: Tecnologia */}
            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Tecnologia</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Desenvolvido com Next.js 15, React, Tailwind CSS e Firebase Firestore.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-blue-400 font-mono">Next.js 15</span>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-blue-400 font-mono">Firebase</span>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-blue-400 font-mono">Tailwind</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 ConectaFlow. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/app" className="hover:text-slate-300">Acessar App</Link>
              <span>•</span>
              <a href="#recursos" className="hover:text-slate-300">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
