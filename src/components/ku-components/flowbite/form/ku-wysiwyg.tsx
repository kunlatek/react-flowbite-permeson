import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Label, HelperText } from 'flowbite-react';
import { IKuWysiwygProps } from '@/interfaces/ku-components';
import { useMemo } from 'react';

import '../index.css';

export const KuWysiwyg = (props: IKuWysiwygProps) => {
  const {
    id,
    testId,
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

  const quillModules = useMemo(() => {
    return {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: [1, 2, 3, false] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block', 'link'],
        ['clean'],
      ],
    };
  }, []);

  return (
    <div className="w-full" id={id} data-testid={testId}>
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
        className={`rounded-lg border overflow-hidden ${
          hasError
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 focus-within:border-cyan-500 focus-within:ring-cyan-500'
        } bg-white dark:bg-gray-700 focus-within:ring-2 ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{ minHeight: `${height}px` }}
      >
        <ReactQuill
          id={id ? `${id}__editor` : undefined}
          value={value || ''}
          onChange={(html: string) => onChange(name, html)}
          readOnly={isDisabled}
          placeholder={placeholder || 'Digite seu conteúdo...'}
          modules={quillModules}
          theme="snow"
          className="h-full max-w-full [&_.ql-container]:min-h-[200px] [&_.ql-container]:overflow-hidden [&_.ql-editor]:text-gray-900 dark:[&_.ql-editor]:text-white [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:break-words [&_.ql-editor]:break-all [&_.ql-toolbar]:border-0 [&_.ql-container]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 dark:[&_.ql-toolbar]:border-gray-600 [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:rounded-b-lg"
          style={{ minHeight: `${height}px` }}
        />
      </div>

      {hasError && <HelperText color="failure">{error}</HelperText>}
    </div>
  );
};