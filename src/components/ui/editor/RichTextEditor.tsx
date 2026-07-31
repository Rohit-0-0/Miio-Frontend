'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { editorExtensions } from './EditorExtensions';
import { EditorToolbar } from './EditorToolbar';
import { MediaLibraryModal } from '@/components/media/MediaLibraryModal';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const editor = useEditor({
    extensions: editorExtensions,
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full min-h-[250px] p-4 focus:outline-none bg-white rounded-b-sm border border-t-0 border-gray-200',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? '' : editor.getHTML());
    },
  });

  // Re-sync value if it comes from the server (e.g., loaded asynchronously)
  useEffect(() => {
    if (editor && value !== editor.getHTML() && value !== undefined) {
      if (!editor.isFocused) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  // Clean up editor on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const handleImageSelect = ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => {
    if (editor && src) {
      editor
        .chain()
        .focus()
        .setImage({ src, alt, title: caption }) // Tiptap image extension uses 'title' natively
        .run();
    }
    setIsMediaModalOpen(false);
  };

  return (
    <div className="flex flex-col relative w-full">
      <EditorToolbar 
        editor={editor} 
        onOpenMediaLibrary={() => setIsMediaModalOpen(true)} 
      />
      <EditorContent editor={editor} />
      
      {editor && (
        <div className="flex justify-between items-center text-xs text-gray-500 mt-2 px-1">
          <div>
            Words: {editor.storage.characterCount.words()} | Characters: {editor.storage.characterCount.characters()}
          </div>
        </div>
      )}

      <MediaLibraryModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
