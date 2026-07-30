import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

export const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3], // Only H2 and H3 as per requirements
    },
    codeBlock: false, // Disabling unrequested features
    code: false,
    horizontalRule: {
      HTMLAttributes: {
        class: 'my-6 border-t border-gray-200',
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700',
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc pl-6 space-y-1 my-4',
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal pl-6 space-y-1 my-4',
      },
    },
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-600 underline hover:text-blue-800 transition-colors cursor-pointer',
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Image.configure({
    HTMLAttributes: {
      class: 'rounded-sm max-w-full h-auto',
    },
  }),
  Placeholder.configure({
    placeholder: 'Start writing...',
    emptyEditorClass: 'is-editor-empty',
  }),
  CharacterCount.configure({
    // no limits
  }),
];
