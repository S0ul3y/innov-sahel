import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  Eraser,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Rédigez ici le contenu détaillé de votre publication...',
  minHeight = '320px',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#38B6FF] underline font-semibold hover:text-[#0B3B60]',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'focus:outline-none w-full prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed p-4',
        style: `min-height: ${minHeight};`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Synchronise value changes from outside (e.g. initial load or reset)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Only set if the contents are truly different to avoid cursor jumps
      if (value === '' && editor.getText() === '') return;
      if (editor.getHTML() !== value) {
        editor.commands.setContent(value || '', { emitUpdate: false });
      }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Entrez l\'URL du lien :', previousUrl || 'https://');

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden focus-within:border-[#38B6FF] focus-within:ring-2 focus-within:ring-[#38B6FF]/30 transition-all flex flex-col">
      {/* Toolbar */}
      <div className="bg-slate-50/90 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1 text-slate-700">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[#38B6FF] text-white shadow-xs'
              : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Titre H2 (Section principale)"
        >
          <Heading2 className="w-4 h-4" />
          <span className="text-[11px] hidden sm:inline">Titre</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-[#38B6FF] text-white shadow-xs'
              : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Sous-titre H3"
        >
          <Heading3 className="w-4 h-4" />
          <span className="text-[11px] hidden sm:inline">Sous-titre</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-300 mx-1" />

        {/* Text styling */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('bold')
              ? 'bg-[#08233C] text-[#FADB58] shadow-xs'
              : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Gras (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('italic')
              ? 'bg-[#08233C] text-[#FADB58] shadow-xs'
              : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Italique (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('underline')
              ? 'bg-[#08233C] text-[#FADB58] shadow-xs'
              : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Souligné (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('strike')
              ? 'bg-[#08233C] text-[#FADB58] shadow-xs'
              : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Barré"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('bulletList')
              ? 'bg-[#38B6FF] text-white shadow-xs'
              : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Liste à puces"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('orderedList')
              ? 'bg-[#38B6FF] text-white shadow-xs'
              : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Liste numérotée"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-300 mx-1" />

        {/* Quotes & Separator */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('blockquote')
              ? 'bg-[#38B6FF] text-white shadow-xs'
              : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Citation / Encart"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          title="Ligne séparatrice"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-300 mx-1" />

        {/* Links */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive('link')
              ? 'bg-[#38B6FF] text-white shadow-xs'
              : 'hover:bg-slate-200 text-slate-700'
          }`}
          title="Insérer un lien web"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
            title="Supprimer le lien"
          >
            <Unlink className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer ml-auto"
          title="Effacer le formatage"
        >
          <Eraser className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-300 mx-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Annuler (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Rétablir (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 bg-white cursor-text tiptap-editor-wrapper">
        <EditorContent editor={editor} />
      </div>

      {/* Footer Word/Character Counter */}
      <div className="bg-slate-50/70 border-t border-slate-100 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
        <span>Éditeur Tiptap enrichi</span>
        <span>
          {editor.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0} mots • {editor.getText().length} caractères
        </span>
      </div>
    </div>
  );
};
