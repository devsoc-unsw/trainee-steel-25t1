declare module 'react-markdown' {
  import { ReactNode } from 'react';
  
  interface ReactMarkdownProps {
    children: string;
    className?: string;
  }
  
  const ReactMarkdown: React.FC<ReactMarkdownProps>;
  
  export default ReactMarkdown;
} 