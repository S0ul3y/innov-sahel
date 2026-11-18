import React from 'react';

interface ArticleContentProps {
  content?: string;
  className?: string;
}

/**
 * Affiche le contenu d'un article, gérant aussi bien le HTML généré par Tiptap
 * que le texte brut classique avec sauts de lignes.
 */
export const ArticleContent: React.FC<ArticleContentProps> = ({ content = '', className = '' }) => {
  if (!content) return null;

  // Détecte si le contenu contient des balises HTML (ex: <p>, <h2>, <ul>, etc.)
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className={`article-rendered-content text-slate-800 text-sm sm:text-base leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Format texte brut : découpage par double saut de ligne
  return (
    <div className={`article-rendered-content text-slate-800 text-sm sm:text-base leading-relaxed space-y-3 ${className}`}>
      {content.split('\n\n').map((paragraph, index) => (
        <p key={index} className="leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
};
