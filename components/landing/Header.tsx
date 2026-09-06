'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Github, Menu, X, Sparkles } from 'lucide-react';

export const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs'
          : 'bg-white/70 backdrop-blur-sm border-b border-slate-200/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* ConectaFlow Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1877F2] to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            CF
          </div>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-display">
            Conecta<span className="text-[#1877F2]">Flow</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a
            href="#recursos"
            className="hover:text-[#1877F2] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#1877F2] hover:after:w-full after:transition-all"
          >
            Recursos
          </a>
          <a
            href="#demo"
            className="hover:text-[#1877F2] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#1877F2] hover:after:w-full after:transition-all"
          >
            Demonstração
          </a>
          <a
            href="#beneficios"
            className="hover:text-[#1877F2] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#1877F2] hover:after:w-full after:transition-all"
          >
            Benefícios
          </a>
          <a
            href="#github-io"
            className="hover:text-[#1877F2] transition-colors py-1 flex items-center gap-1.5 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#1877F2] hover:after:w-full after:transition-all"
          >
            <Github className="w-4 h-4 text-slate-800" />
            <span>Hub github.io</span>
          </a>
          <a
            href="#depoimentos"
            className="hover:text-[#1877F2] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#1877F2] hover:after:w-full after:transition-all"
          >
            Depoimentos
          </a>
        </nav>

        {/* Desktop CTA Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/app"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-[#1877F2] hover:bg-slate-100 transition-all"
          >
            Entrar
          </Link>
          <Link
            href="/app"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#1877F2] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center gap-2 group active:scale-98"
          >
            <span>Começar agora</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fade-in">
          <a
            href="#recursos"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Recursos
          </a>
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Demonstração
          </a>
          <a
            href="#beneficios"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Benefícios
          </a>
          <a
            href="#github-io"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Hub github.io
          </a>
          <a
            href="#depoimentos"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Depoimentos
          </a>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/app"
              className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Entrar na Conta
            </Link>
            <Link
              href="/app"
              className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-[#1877F2] text-white shadow-md flex items-center justify-center gap-2"
            >
              <span>Começar Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
