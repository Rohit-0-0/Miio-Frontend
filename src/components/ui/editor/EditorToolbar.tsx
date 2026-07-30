'use client';

import React, { useState } from 'react';
import { type Editor } from '@tiptap/react';
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Unlink,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
  onOpenMediaLibrary: () => void;
}

export function EditorToolbar({ editor, onOpenMediaLibrary }: EditorToolbarProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);

  if (!editor) {
    return null;
  }

  const handleLinkClick = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
    } else {
      setLinkUrl('');
      setOpenInNewTab(true);
      setShowLinkDialog(true);
    }
  };

  const saveLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .setLink({ href: linkUrl, target: openInNewTab ? '_blank' : '' })
        .run();
    }
    setShowLinkDialog(false);
  };

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-sm transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
        ${
          isActive
            ? 'bg-gray-200 text-gray-900'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-gray-200 mx-1" />;

  return (
    <>
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 bg-white border-b border-gray-200 shadow-sm rounded-t-sm w-full">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
        >
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo size={18} />
        </ToolbarButton>

        <Divider />

        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${
            editor.isActive('paragraph')
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
          title="Paragraph"
        >
          P
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
          title="Heading 3"
        >
          H3
        </button>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus size={18} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight size={18} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={handleLinkClick}
          isActive={editor.isActive('link')}
          title={editor.isActive('link') ? "Remove Link" : "Add Link"}
        >
          {editor.isActive('link') ? <Unlink size={18} /> : <LinkIcon size={18} />}
        </ToolbarButton>
        
        <ToolbarButton
          onClick={onOpenMediaLibrary}
          title="Insert Image"
        >
          <ImageIcon size={18} />
        </ToolbarButton>
      </div>

      {showLinkDialog && (
        <div className="absolute z-20 mt-2 p-4 bg-white border border-gray-200 rounded-sm shadow-xl w-72 left-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://"
                className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 text-sm"
                autoFocus
              />
            </div>
            <div className="flex items-center">
              <input
                id="link-new-tab"
                type="checkbox"
                checked={openInNewTab}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label htmlFor="link-new-tab" className="ml-2 block text-sm text-gray-900">
                Open in new tab
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkDialog(false)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveLink}
                className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-sm hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
