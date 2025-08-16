"use client";

import { useEffect, useState } from 'react';

interface TocItem {
  level: number;
  text: string;
  slug: string;
}

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    const elements = toc.map(item => document.getElementById(item.slug)).filter(Boolean);
    elements.forEach(el => el && observer.observe(el));

    return () => {
      elements.forEach(el => el && observer.unobserve(el));
    };
  }, [toc]);

  const getPaddingClass = (level: number) => {
    const padding = (level - 1) * 4;
    switch (padding) {
      case 0: return 'pl-0';
      case 4: return 'pl-4';
      case 8: return 'pl-8';
      case 12: return 'pl-12';
      case 16: return 'pl-16';
      default: return 'pl-0';
    }
  };

  return (
    <div className="sticky top-24">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Table of Contents</h2>
      <nav>
        <ul className="space-y-1">
          {toc.map((item) => (
            <li key={item.slug} className={getPaddingClass(item.level)}>
              <a
                href={`#${item.slug}`}
                className={`block py-1 text-sm transition-colors hover:text-primary ${
                  activeId === item.slug
                    ? 'font-bold text-primary'
                    : 'text-foreground'
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}