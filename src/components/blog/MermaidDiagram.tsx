'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  id?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, id }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to detect dark mode
  const getIsDark = () => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark') || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Function to initialize or update Mermaid theme
  const initializeMermaid = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const isDark = getIsDark();
    
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      },
    });
  }, []);

  useEffect(() => {
    // Initialize Mermaid on mount
    if (!isInitialized && typeof window !== 'undefined') {
      initializeMermaid();
      setIsInitialized(true);
    }
  }, [isInitialized, initializeMermaid]);

  // Re-render diagram when chart or theme changes
  useEffect(() => {
    if (isInitialized && mermaidRef.current && chart) {
      // Re-initialize with current theme before rendering
      initializeMermaid();
      
      const uniqueId = id || `mermaid-${Math.random().toString(36).substring(2, 9)}`;
      
      // Clear previous content and error
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = '';
      }
      setError(null);
      
      // Render the diagram
      mermaid.render(uniqueId, chart).then((result) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = result.svg;
        }
      }).catch((err) => {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Mermaid rendering error:', err);
        setError(errorMessage);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = '';
        }
      });
    }
  }, [chart, id, isInitialized, initializeMermaid]);

  if (error) {
    return (
      <div className="my-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-sm text-destructive font-medium mb-1">Error rendering Mermaid diagram</p>
        <pre className="text-xs text-destructive/80 whitespace-pre-wrap">{error}</pre>
        <details className="mt-2">
          <summary className="text-xs cursor-pointer text-muted-foreground">Show diagram code</summary>
          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">{chart}</pre>
        </details>
      </div>
    );
  }

  return (
    <div 
      ref={mermaidRef} 
      className="mermaid-container my-6 flex justify-center overflow-x-auto [&_svg]:max-w-full"
      style={{ minHeight: '100px' }}
    />
  );
};

export default MermaidDiagram;

