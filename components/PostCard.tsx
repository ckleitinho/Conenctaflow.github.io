'use client';

import React, { useState } from 'react';
import { 
  ThumbsUp, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Globe, 
  Users, 
  Lock,
  Send,
  Smile,
  Bookmark,
  Trash2,
  ExternalLink,
  Check,
  ShieldAlert,
  Flag
} from 'lucide-react';
import { Post, ReactionType, User, Comment } from '@/lib/types';
import { AttachmentView } from './AttachmentView';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onReact: (postId: string, reaction: ReactionType | null) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onDeletePost?: (postId: string) => void;
  onSharePost: (postId: string) => void;
  onReportPost?: (post: Post) => void;
  onReportComment?: (postId: string, comment: Comment) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onReact,
  onAddComment,
  onDeletePost,
  onSharePost,
  onReportPost,
  onReportComment,
}) => {
  const [showReactionsFlyout, setShowReactionsFlyout] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Total reactions count
  const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);

  const reactionConfigs: Record<
    ReactionType,
    { label: string; icon: string; color: string; textColor: string }
  > = {
    like: { label: 'Curtir', icon: '👍', color: 'bg-[#1877F2]', textColor: 'text-[#1877F2]' },
    love: { label: 'Amei', icon: '❤️', color: 'bg-[#E41E3F]', textColor: 'text-[#E41E3F]' },
    haha: { label: 'Haha', icon: '😆', color: 'bg-[#F7B125]', textColor: 'text-[#F7B125]' },
    wow: { label: 'Uau', icon: '😮', color: 'bg-[#F7B125]', textColor: 'text-[#F7B125]' },
    sad: { label: 'Triste', icon: '😢', color: 'bg-[#F7B125]', textColor: 'text-[#F7B125]' },
    angry: { label: 'Grr', icon: '😡', color: 'bg-[#E41E3F]', textColor: 'text-[#E41E3F]' },
  };

  const handleToggleDefaultLike = () => {
    if (post.userReaction) {
      onReact(post.id, null);
    } else {
      onReact(post.id, 'like');
    }
  };

  const handleSelectReaction = (reaction: ReactionType) => {
    if (post.userReaction === reaction) {
      onReact(post.id, null);
    } else {
      onReact(post.id, reaction);
    }
    setShowReactionsFlyout(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    setShowOptions(false);
  };

  return (
    <article className="bg-white rounded-xl border border-[#E4E6EB] shadow-2xs mb-4 overflow-hidden">
      {/* Post Header */}
      <div className="p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-10 h-10 rounded-full object-cover border border-[#E4E6EB]"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-sm text-[#050505] hover:underline cursor-pointer">
                {post.authorName}
              </h4>
              {post.groupName && (
                <span className="text-xs text-[#65676B]">
                  no grupo <strong className="text-[#050505] hover:underline cursor-pointer">{post.groupName}</strong>
                </span>
              )}
              {post.feeling && (
                <span className="text-xs text-[#65676B]">
                  está se sentindo <span className="font-semibold text-[#050505]">{post.feeling}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#65676B] mt-0.5">
              <span>{post.timestamp}</span>
              <span>•</span>
              {post.location && (
                <>
                  <span>{post.location}</span>
                  <span>•</span>
                </>
              )}
              {post.privacy === 'public' && (
                <span title="Público">
                  <Globe className="w-3 h-3" />
                </span>
              )}
              {post.privacy === 'friends' && (
                <span title="Amigos">
                  <Users className="w-3 h-3" />
                </span>
              )}
              {post.privacy === 'only_me' && (
                <span title="Somente Eu">
                  <Lock className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Post Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-8 h-8 rounded-full hover:bg-[#F2F2F2] flex items-center justify-center text-[#65676B] transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-[#E4E6EB] py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#050505] hover:bg-[#F2F2F2] text-left"
              >
                {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <ExternalLink className="w-4 h-4 text-[#65676B]" />}
                <span>{copiedLink ? 'Link copiado!' : 'Copiar link da publicação'}</span>
              </button>
              {onDeletePost && post.authorId === currentUser.id && (
                <button
                  onClick={() => {
                    onDeletePost(post.id);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 text-left cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir publicação</span>
                </button>
              )}
              {onReportPost && (
                <button
                  onClick={() => {
                    onReportPost(post);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 text-left cursor-pointer border-t border-[#F0F2F5]"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Denunciar publicação</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Text Content */}
      <div className="px-3 sm:px-4 pb-3">
        <p className="text-sm text-[#050505] whitespace-pre-line leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Attached Media & Documents */}
      {post.attachments && post.attachments.length > 0 ? (
        <AttachmentView attachments={post.attachments} layout="post" />
      ) : post.image ? (
        <div className="relative w-full max-h-[550px] bg-neutral-100 overflow-hidden">
          <img
            src={post.image}
            alt="Imagem da publicação"
            className="w-full h-full object-cover max-h-[550px]"
          />
        </div>
      ) : null}

      {/* Reactions & Stats Bar */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between text-xs text-[#65676B] border-b border-[#E4E6EB]/80">
        <div className="flex items-center gap-1.5">
          {totalReactions > 0 ? (
            <>
              <div className="flex -space-x-1 items-center">
                <span className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[10px] shadow-2xs">
                  👍
                </span>
                {post.reactions.love > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#E41E3F] text-white flex items-center justify-center text-[10px] shadow-2xs">
                    ❤️
                  </span>
                )}
                {post.reactions.haha > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#F7B125] text-white flex items-center justify-center text-[10px] shadow-2xs">
                    😆
                  </span>
                )}
              </div>
              <span className="font-semibold text-[#050505] hover:underline cursor-pointer">
                {totalReactions}
              </span>
            </>
          ) : (
            <span>Seja o primeiro a curtir</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline cursor-pointer"
          >
            {post.comments.length} {post.comments.length === 1 ? 'comentário' : 'comentários'}
          </button>
          <button
            onClick={() => onSharePost(post.id)}
            className="hover:underline cursor-pointer"
          >
            {post.sharesCount} compartilhamentos
          </button>
        </div>
      </div>

      {/* Action Buttons: Curtir, Comentar, Compartilhar */}
      <div className="px-2 py-1 flex items-center justify-between relative border-b border-[#E4E6EB]/50">
        {/* Floating Reactions Bar on hover or touch */}
        {showReactionsFlyout && (
          <div
            onMouseEnter={() => setShowReactionsFlyout(true)}
            onMouseLeave={() => setShowReactionsFlyout(false)}
            className="absolute -top-12 left-2 z-30 bg-white border border-[#E4E6EB] shadow-xl rounded-full px-2 py-1.5 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            {(['like', 'love', 'haha', 'wow', 'sad', 'angry'] as ReactionType[]).map((r) => (
              <button
                key={r}
                onClick={() => handleSelectReaction(r)}
                className="hover:scale-125 transition-transform text-2xl p-1 cursor-pointer"
                title={reactionConfigs[r].label}
              >
                {reactionConfigs[r].icon}
              </button>
            ))}
          </div>
        )}

        {/* Curtir Button */}
        <div
          className="flex-1 relative"
          onMouseEnter={() => setShowReactionsFlyout(true)}
          onMouseLeave={() => setShowReactionsFlyout(false)}
        >
          <button
            onClick={handleToggleDefaultLike}
            className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-[#F2F2F2] text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              post.userReaction
                ? reactionConfigs[post.userReaction].textColor
                : 'text-[#65676B]'
            }`}
          >
            {post.userReaction ? (
              <span className="text-base">{reactionConfigs[post.userReaction].icon}</span>
            ) : (
              <ThumbsUp className="w-4 h-4" />
            )}
            <span>
              {post.userReaction
                ? reactionConfigs[post.userReaction].label
                : 'Curtir'}
            </span>
          </button>
        </div>

        {/* Comentar Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-[#F2F2F2] text-[#65676B] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comentar</span>
        </button>

        {/* Compartilhar Button */}
        <button
          onClick={() => onSharePost(post.id)}
          className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-[#F2F2F2] text-[#65676B] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartilhar</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-3 sm:p-4 bg-[#F9FAFB] space-y-3">
          {/* Write comment input */}
          <form onSubmit={handleCommentSubmit} className="flex items-start gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-[#E4E6EB] shrink-0 mt-0.5"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={`Escreva um comentário como ${currentUser.name.split(' ')[0]}...`}
                className="w-full bg-[#F0F2F5] hover:bg-[#E4E6EB] focus:bg-white text-xs sm:text-sm text-[#050505] placeholder-[#65676B] pl-3.5 pr-10 py-2 rounded-2xl border border-transparent focus:border-[#1877F2] focus:outline-hidden transition-all"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1877F2] disabled:text-[#8C939D] p-1 rounded-full cursor-pointer hover:bg-blue-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          {post.comments.length > 0 && (
            <div className="space-y-2.5 pt-1">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={comment.authorAvatar}
                    alt={comment.authorName}
                    className="w-8 h-8 rounded-full object-cover border border-[#E4E6EB] shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="bg-[#F0F2F5] p-2.5 rounded-2xl inline-block max-w-[90%]">
                      <h5 className="font-bold text-[#050505] leading-tight">
                        {comment.authorName}
                      </h5>
                      <p className="text-[#050505] mt-0.5 whitespace-pre-wrap leading-relaxed">
                        {comment.text}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#65676B] font-semibold mt-0.5 ml-2">
                      <button className="hover:underline cursor-pointer">Curtir</button>
                      <span>•</span>
                      <button className="hover:underline cursor-pointer">Responder</button>
                      <span>•</span>
                      <span className="font-normal">{comment.timestamp}</span>
                      {onReportComment && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => onReportComment(post.id, comment)}
                            className="hover:underline text-neutral-500 hover:text-amber-700 cursor-pointer flex items-center gap-1"
                            title="Denunciar comentário inadequado"
                          >
                            <Flag className="w-3 h-3" />
                            <span>Denunciar</span>
                          </button>
                        </>
                      )}
                      {comment.likes > 0 && (
                        <span className="flex items-center gap-0.5 ml-1 text-[#1877F2]">
                          👍 {comment.likes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
};
