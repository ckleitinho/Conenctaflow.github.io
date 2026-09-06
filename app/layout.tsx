import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'ConectaFlow - Rede Social & Vídeo Chamadas em Tempo Real',
  description: 'Rede social completa com feed dinâmico, grupos, mensagens privadas e chamadas de vídeo em tempo real.',
  openGraph: {
    title: 'ConectaFlow - Rede Social & Vídeo Chamadas em Tempo Real',
    description: 'Rede social completa com feed dinâmico, grupos, mensagens privadas e chamadas de vídeo em tempo real.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConectaFlow - Rede Social & Vídeo Chamadas em Tempo Real',
    description: 'Rede social completa com feed dinâmico, grupos, mensagens privadas e chamadas de vídeo em tempo real.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var nativeFetch = window.fetch ? window.fetch.bind(window) : undefined;
                  var currentFetch = nativeFetch;
                  var desc = Object.getOwnPropertyDescriptor(window, 'fetch') || (typeof Window !== 'undefined' && Object.getOwnPropertyDescriptor(Window.prototype, 'fetch'));
                  if (!desc || !desc.set) {
                    try {
                      Object.defineProperty(window, 'fetch', {
                        configurable: true,
                        enumerable: true,
                        get: function() {
                          return currentFetch;
                        },
                        set: function(val) {
                          currentFetch = typeof val === 'function' ? val.bind(window) : val;
                        }
                      });
                    } catch(e1) {
                      try {
                        if (typeof Window !== 'undefined') {
                          Object.defineProperty(Window.prototype, 'fetch', {
                            configurable: true,
                            enumerable: true,
                            get: function() {
                              return currentFetch;
                            },
                            set: function(val) {
                              currentFetch = typeof val === 'function' ? val.bind(window) : val;
                            }
                          });
                        }
                      } catch(e2) {}
                    }
                  }
                } catch(err) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#F0F2F5] text-[#050505] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
