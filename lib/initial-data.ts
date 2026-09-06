import { User, Friend, Post, Story, Group, Message, GitHubProject } from './types';

// Default empty structures - all real users come from Firebase Firestore
export const DEFAULT_USER: User = {
  id: '',
  name: 'Visitante',
  username: 'visitante',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest&backgroundColor=1877f2',
  coverImage: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80',
  bio: 'Novo membro no ConectaFlow!',
  location: 'Brasil',
  work: 'Membro da Comunidade',
  friendsCount: 0,
};

export const INITIAL_FRIENDS: Friend[] = [];

export const INITIAL_STORIES: Story[] = [];

export const INITIAL_GITHUB_PROJECTS: GitHubProject[] = [
  {
    id: 'gh-1',
    title: 'Portfólio Dev Interativo 3D',
    url: 'https://bruno-dev.github.io/portfolio-3d',
    repoUrl: 'https://github.com/bruno-dev/portfolio-3d',
    description: 'Meu site de portfólio desenvolvido com React, Three.js e Tailwind CSS. Inclui renderização de modelos 3D interativos e modo escuro.',
    category: 'Portfólio',
    tags: ['React', 'Three.js', 'TailwindCSS', 'WebGL'],
    authorId: 'dev-bruno',
    authorName: 'Bruno Silveira',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bruno&backgroundColor=1877f2',
    starsCount: 42,
    likesCount: 18,
    previewImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 2,
    isFeatured: true,
  },
  {
    id: 'gh-2',
    title: 'Design System & UI Kit Docs',
    url: 'https://conectaflow-ui.github.io/docs',
    repoUrl: 'https://github.com/conectaflow-ui/docs',
    description: 'Documentação completa e biblioteca de componentes reutilizáveis para interfaces web modernas e acessíveis.',
    category: 'Documentação',
    tags: ['TypeScript', 'Next.js', 'TailwindCSS', 'Storybook'],
    authorId: 'dev-camila',
    authorName: 'Camila Torres',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=camila&backgroundColor=1877f2',
    starsCount: 89,
    likesCount: 35,
    previewImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 4,
    isFeatured: true,
  },
  {
    id: 'gh-3',
    title: 'CodeSnippet Pro - Ferramenta Web',
    url: 'https://snippets-app.github.io',
    repoUrl: 'https://github.com/snippets-app/snippets-app.github.io',
    description: 'Editor online para formatar, destacar sintaxe e exportar belos trechos de código em imagem PNG ou SVG para redes sociais.',
    category: 'Ferramentas',
    tags: ['JavaScript', 'Canvas', 'PWA', 'Shiki'],
    authorId: 'dev-lucas',
    authorName: 'Lucas Mendes',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=lucas&backgroundColor=1877f2',
    starsCount: 124,
    likesCount: 51,
    previewImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 7,
    isFeatured: false,
  },
  {
    id: 'gh-4',
    title: 'Space Retro Arcade 2D Game',
    url: 'https://retro-arcade.github.io/space-defender',
    repoUrl: 'https://github.com/retro-arcade/space-defender',
    description: 'Jogo espacial retrô desenvolvido em HTML5 Canvas e Phaser.js com trilha sonora chiptune e ranking de pontuações.',
    category: 'Jogos',
    tags: ['Phaser.js', 'Canvas', 'GameDev', 'Retro'],
    authorId: 'dev-rafael',
    authorName: 'Rafael Costa',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=rafael&backgroundColor=1877f2',
    starsCount: 67,
    likesCount: 29,
    previewImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 10,
    isFeatured: false,
  }
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'group-tecnologia',
    name: 'Tecnologia & Inovação',
    tagline: 'Comunidade para debater código, novas tecnologias e projetos.',
    description: 'Espaço aberto para compartilhar dúvidas, novidades do setor tech e trocar experiências com outros membros.',
    category: 'Tecnologia & Inovação',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=200&auto=format&fit=crop&q=80',
    memberCount: 1,
    privacy: 'Público',
    isMember: true,
    postsCount: 0,
    rules: [
      'Respeito mútuo entre todos os membros',
      'Compartilhe conteúdo construtivo',
      'Participe das salas de vídeo da comunidade',
    ],
  },
  {
    id: 'group-fotografia',
    name: 'Fotografia & Paisagens',
    tagline: 'Compartilhe suas fotos, dicas de edição e enquadramento.',
    description: 'Comunidade dedicada aos amantes da fotografia mobile e profissional.',
    category: 'Artes & Fotografia',
    coverImage: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=1000&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop&q=80',
    memberCount: 1,
    privacy: 'Público',
    isMember: false,
    postsCount: 0,
  },
  {
    id: 'group-viagens',
    name: 'Viagens & Aventuras',
    tagline: 'Roteiros, relatos e destinos imperdíveis.',
    description: 'Encontre outros viajantes e compartilhe as melhores dicas de passeios e viagens.',
    category: 'Viagens & Turismo',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&auto=format&fit=crop&q=80',
    memberCount: 1,
    privacy: 'Público',
    isMember: false,
    postsCount: 0,
  }
];

export const INITIAL_POSTS: Post[] = [];

export const INITIAL_MESSAGES: Record<string, Message[]> = {};
