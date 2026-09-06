import { User, Friend, Post, Story, Group, Message } from './types';

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
