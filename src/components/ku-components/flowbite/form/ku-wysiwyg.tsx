import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Label, HelperText } from 'flowbite-react';
import { IKuWysiwygProps } from '@/interfaces/ku-components';
import { useEffect } from 'react';

export const KuWysiwyg = (props: IKuWysiwygProps) => {
  const {
    name,
    label,
    value,
    onChange,
    placeholder = '',
    error = '',
    isRequired = false,
    isDisabled = false,
    tooltip = '',
    height = 300,
  } = props;

  const hasError = !!error;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Digite seu conteúdo...',
      }),
    ],
    content: value || '',
    editable: !isDisabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(name, html);
    },
  });

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);


  return (
    <div className="w-full">
      <div className="mb-2 block">
        <Label
          htmlFor={name}
          color={hasError ? 'failure' : 'gray'}
          title={tooltip}
          className="text-gray-900 dark:text-white"
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>

      <div
        className={`rounded-lg border ${
          hasError
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 focus-within:border-cyan-500 focus-within:ring-cyan-500'
        } bg-white dark:bg-gray-700 focus-within:ring-2 ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{ minHeight: `${height}px` }}
      >
        {/* Toolbar */}
        <div className="border-b border-gray-200 dark:border-gray-600 p-2 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={isDisabled || !editor?.can().chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor?.isActive('bold')
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title="Negrito"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={isDisabled || !editor?.can().chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor?.isActive('italic')
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title="Itálico"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            disabled={isDisabled || !editor?.can().chain().focus().toggleStrike().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor?.isActive('strike')
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title="Riscado"
          >
            <s>S</s>
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            disabled={isDisabled || !editor?.can().chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 rounded text-sm ${
              editor?.isActive('heading', { level: 1 })
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title="Título 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={isDisabled || !editor?.can().chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded text-sm ${
              editor?.isActive('heading', { level: 2 })
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title="Título 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={isDisabled || !editor?.can().chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 rounded text-sm ${
              editor?.isActive('heading', { level: 3 })
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title="Título 3"
          >
            H3
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            disabled={isDisabled || !editor?.can().chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor?.isActive('bulletList')
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title="Lista com marcadores"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            disabled={isDisabled || !editor?.can().chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor?.isActive('orderedList')
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title="Lista numerada"
          >
            1.
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            disabled={isDisabled || !editor?.can().chain().focus().toggleBlockquote().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor?.isActive('blockquote')
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title="Citação"
          >
            "
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={isDisabled || !editor?.can().chain().focus().undo().run()}
            className={`px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
            title="Desfazer"
          >
            ↶
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={isDisabled || !editor?.can().chain().focus().redo().run()}
            className={`px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
            title="Refazer"
          >
            ↷
          </button>
        </div>

        {/* Editor Content */}
        <div className="p-4" style={{ minHeight: `${height - 60}px` }}>
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none dark:prose-invert focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror-placeholder]:text-gray-400 [&_.ProseMirror-placeholder]:dark:text-gray-500"
          />
        </div>
      </div>

      {hasError && <HelperText color="failure">{error}</HelperText>}
    </div>
  );
};