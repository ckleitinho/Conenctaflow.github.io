'use client';

import React, { useState } from 'react';
import { 
  Video, 
  MessageSquare, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  UserCheck,
  Globe,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { loginWithGoogle, loginAnonymously } from '@/lib/firebase';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingAnon, setIsLoadingAnon] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoadingGoogle(true);
      setErrorMsg(null);
      await loginWithGoogle();
      onLoginSuccess();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        console.warn('Google sign-in popup was closed or cancelled by user.');
        setErrorMsg(
          'A janela de login do Google foi fechada antes de concluir. Você pode tentar novamente, abrir o app em uma nova aba, ou entrar instantaneamente com o botão de Convidado / Anônimo abaixo!'
        );
      } else if (code === 'auth/popup-blocked') {
        console.warn('Google sign-in popup was blocked by browser.');
        setErrorMsg(
          'O navegador bloqueou a janela de pop-up do Google. Permita pop-ups ou entre no modo Convidado / Anônimo abaixo.'
        );
      } else if (code === 'auth/unauthorized-domain') {
        console.warn('Firebase Auth unauthorized domain:', window.location.hostname);
        setErrorMsg(
          'Este domínio ainda não foi autorizado no console do Firebase. Utilize o modo Convidado / Anônimo abaixo para navegar e testar todas as funcionalidades!'
        );
      } else {
        console.warn('Google sign-in info:', err?.message || err);
        setErrorMsg(
          'Não foi possível autenticar com o Google neste momento. Você pode entrar instantaneamente no modo Convidado / Anônimo abaixo.'
        );
      }
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleAnonymousSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsLoadingAnon(true);
      setErrorMsg(null);
      await loginAnonymously(guestName.trim() || undefined);
      onLoginSuccess();
    } catch (err: any) {
      console.warn('Anonymous sign-in info:', err?.message || err);
      setErrorMsg('Não foi possível entrar no modo anônimo. Verifique sua conexão à internet.');
    } finally {
      setIsLoadingAnon(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Col: Brand Presentation */}
        <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Video className="w-7 h-7" />
            </div>
            <span className="text-3xl sm:text-4xl font-black text-[#1877F2] tracking-tight">
              ConectaFlow
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#050505] tracking-tight leading-tight">
            Conecte-se com pessoas reais, compartilhe momentos e converse em vídeo ao vivo.
          </h1>

          <p className="text-sm sm:text-base text-[#65676B] leading-relaxed max-w-lg">
            Rede social moderna com banco de dados em tempo real. Faça login seguro com sua conta do Google ou entre instantaneamente como anônimo sem precisar de cadastro prévio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-[#050505]">
            <div className="p-3 bg-white rounded-xl border border-[#E4E6EB] flex items-center gap-2.5 shadow-2xs">
              <Video className="w-4 h-4 text-[#1877F2]" />
              <span>Vídeo WebRTC HD</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E4E6EB] flex items-center gap-2.5 shadow-2xs">
              <MessageSquare className="w-4 h-4 text-[#31A24C]" />
              <span>Chat em Tempo Real</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E4E6EB] flex items-center gap-2.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#F7B125]" />
              <span>Login Protegido</span>
            </div>
          </div>
        </div>

        {/* Right Col: Sign-In Box */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#CCD0D5] p-6 sm:p-7 shadow-xl space-y-5 w-full">
          <div>
            <h2 className="text-xl font-bold text-[#050505]">Acesse sua Conta</h2>
            <p className="text-xs text-[#65676B] mt-0.5">
              Escolha uma forma de acesso para continuar:
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Google Sign-In Button */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoadingGoogle || isLoadingAnon}
              className="w-full py-3 px-4 rounded-xl border border-[#CCD0D5] hover:bg-[#F9FAFB] active:bg-[#F0F2F5] transition-all flex items-center justify-center gap-3 font-semibold text-sm text-[#050505] shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isLoadingGoogle ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#1877F2]" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continuar com o Google</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E4E6EB] w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-[#65676B] uppercase absolute">
              ou entre como anônimo
            </span>
          </div>

          {/* 2. Anonymous Sign-In Form */}
          <form onSubmit={handleAnonymousSignIn} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#65676B] mb-1">
                Seu Apelido ou Nome (Opcional)
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ex: Alex Dev, Carol, Convidado..."
                maxLength={30}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#CCD0D5] focus:border-[#1877F2] focus:outline-hidden bg-[#F9FAFB] focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoadingAnon || isLoadingGoogle}
              className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] active:bg-[#1464D2] text-white font-bold text-sm shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingAnon ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
              <span>Entrar como Convidado / Anônimo</span>
            </button>
          </form>

          <div className="pt-2 text-center space-y-2">
            <p className="text-[11px] text-[#65676B] leading-relaxed">
              No modo anônimo, um perfil temporário é gerado e sincronizado no banco de dados Firestore.
            </p>
            <p className="text-[11px] text-[#65676B]">
              Quer testar com o Google sem restrições de pop-up do navegador?{' '}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877F2] font-semibold hover:underline"
              >
                Abrir em nova aba
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
