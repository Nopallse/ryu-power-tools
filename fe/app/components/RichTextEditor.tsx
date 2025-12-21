'use client';

import React, { useRef, useMemo, forwardRef, useImperativeHandle, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(
  () => import('react-quill-new').then(mod => mod.default as unknown as React.ComponentType<any>),
  {
    ssr: false,
    loading: () => <div className="min-h-[300px] bg-gray-50 animate-pulse rounded" />,
  }
);

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onImageButtonClick?: () => void;
  onImageUpload?: (file: File) => Promise<string>;
  className?: string;
}

export interface RichTextEditorRef {
  insertImage: (imageUrl: string) => void;
  setContent: (content: string) => void;
  getEditor: () => any;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value, onChange, placeholder = 'Write your content here...', onImageButtonClick, onImageUpload, className = '' }, ref) => {
    const quillRef = useRef<any>(null);

    // Insert image into editor
    const insertImage = useCallback((imageUrl: string) => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        if (editor) {
          const range = editor.getSelection(true) || { index: 0 };
          editor.insertEmbed(range.index, 'image', imageUrl);
          editor.setSelection(range.index + 1, 0);
        }
      }
    }, []);

    // Set content programmatically
    const setContent = useCallback((content: string) => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        if (editor) {
          editor.clipboard.dangerouslyPasteHTML(content);
        }
      }
    }, []);

    // Custom image handler
    const imageHandler = useCallback(() => {
      if (onImageButtonClick) {
        onImageButtonClick();
      } else {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (file && onImageUpload) {
            try {
              const imageUrl = await onImageUpload(file);
              insertImage(imageUrl);
            } catch (error) {
              console.error('Image upload failed:', error);
            }
          }
        };
      }
    }, [onImageButtonClick, onImageUpload, insertImage]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      insertImage,
      setContent,
      getEditor: () => quillRef.current,
    }), [insertImage, setContent]);

    const modules = useMemo(
      () => ({
        toolbar: {
          container: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link', 'image', 'video'],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
          ],
          handlers: {
            image: imageHandler,
          },
        },
        clipboard: {
          matchVisual: false,
        },
      }),
      [imageHandler]
    );

    const formats = [
      'header',
      'font',
      'size',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'indent',
      'link',
      'image',
      'video',
      'color',
      'background',
      'align',
    ];

    return (
      <div className={`rich-text-editor ${className}`}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="bg-white"
        />
        <style jsx global>{`
          .rich-text-editor .quill {
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .rich-text-editor .ql-container {
            min-height: 300px;
            font-size: 16px;
          }
          .rich-text-editor .ql-editor {
            min-height: 300px;
          }
          .rich-text-editor.error .quill {
            border-color: #ef4444;
          }
        `}</style>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
