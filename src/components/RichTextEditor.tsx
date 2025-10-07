import React, { useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Link as LinkIcon, Image,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Code, Quote, Minus, Heading1, Heading2, Heading3
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdating = useRef(false);
  const lastContent = useRef<string>('');

  useEffect(() => {
    if (editorRef.current && !isUpdating.current) {
      const currentHTML = editorRef.current.innerHTML;
      if (currentHTML !== content && lastContent.current !== content) {
        editorRef.current.innerHTML = content;
        lastContent.current = content;
      }
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdating.current = true;
      const newContent = editorRef.current.innerHTML;
      lastContent.current = newContent;
      onChange(newContent);
      setTimeout(() => {
        isUpdating.current = false;
      }, 0);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertHTML = (html: string) => {
    document.execCommand('insertHTML', false, html);
    editorRef.current?.focus();
    handleInput();
  };

  const formatBlock = (tag: string) => {
    document.execCommand('formatBlock', false, tag);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Ingresa la URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      insertHTML(`<img src="${url}" alt="Imagen" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`);
    }
  };

  const toolbarButtons = [
    {
      icon: Heading1,
      label: 'Título 1',
      action: () => formatBlock('h1'),
      group: 'headings'
    },
    {
      icon: Heading2,
      label: 'Título 2',
      action: () => formatBlock('h2'),
      group: 'headings'
    },
    {
      icon: Heading3,
      label: 'Título 3',
      action: () => formatBlock('h3'),
      group: 'headings'
    },
    {
      icon: Bold,
      label: 'Negrita',
      action: () => execCommand('bold'),
      group: 'formatting'
    },
    {
      icon: Italic,
      label: 'Cursiva',
      action: () => execCommand('italic'),
      group: 'formatting'
    },
    {
      icon: Underline,
      label: 'Subrayado',
      action: () => execCommand('underline'),
      group: 'formatting'
    },
    {
      icon: Strikethrough,
      label: 'Tachado',
      action: () => execCommand('strikeThrough'),
      group: 'formatting'
    },
    {
      icon: AlignLeft,
      label: 'Alinear izquierda',
      action: () => execCommand('justifyLeft'),
      group: 'alignment'
    },
    {
      icon: AlignCenter,
      label: 'Alinear centro',
      action: () => execCommand('justifyCenter'),
      group: 'alignment'
    },
    {
      icon: AlignRight,
      label: 'Alinear derecha',
      action: () => execCommand('justifyRight'),
      group: 'alignment'
    },
    {
      icon: List,
      label: 'Lista con viñetas',
      action: () => execCommand('insertUnorderedList'),
      group: 'lists'
    },
    {
      icon: ListOrdered,
      label: 'Lista numerada',
      action: () => execCommand('insertOrderedList'),
      group: 'lists'
    },
    {
      icon: LinkIcon,
      label: 'Insertar enlace',
      action: insertLink,
      group: 'media'
    },
    {
      icon: Image,
      label: 'Insertar imagen',
      action: insertImage,
      group: 'media'
    },
    {
      icon: Quote,
      label: 'Cita',
      action: () => formatBlock('blockquote'),
      group: 'blocks'
    },
    {
      icon: Code,
      label: 'Código',
      action: () => formatBlock('pre'),
      group: 'blocks'
    },
    {
      icon: Minus,
      label: 'Línea horizontal',
      action: () => execCommand('insertHorizontalRule'),
      group: 'blocks'
    }
  ];

  const groupedButtons = toolbarButtons.reduce((acc, button) => {
    if (!acc[button.group]) {
      acc[button.group] = [];
    }
    acc[button.group].push(button);
    return acc;
  }, {} as Record<string, typeof toolbarButtons>);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {Object.entries(groupedButtons).map(([group, buttons]) => (
          <div key={group} className="flex gap-1 pr-2 border-r border-gray-300 last:border-r-0">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  button.action();
                }}
                className="p-2 hover:bg-gray-200 rounded transition-colors duration-150"
                title={button.label}
                type="button"
              >
                <button.icon size={18} className="text-gray-700" />
              </button>
            ))}
          </div>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="p-4 min-h-[500px] focus:outline-none prose prose-lg max-w-none"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default RichTextEditor;
