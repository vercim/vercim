'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { revealDelay } from '@/components/ui/reveal-style';

function readVisualLines(node: Text) {
  const text = node.data;
  const range = document.createRange();
  const lines: string[] = [];
  let lineStart = 0;
  let lineTop: number | undefined;

  for (const match of text.matchAll(/\S+/g)) {
    range.setStart(node, match.index);
    range.setEnd(node, match.index + match[0].length);
    const top = range.getBoundingClientRect().top;

    if (lineTop !== undefined && top !== lineTop) {
      lines.push(text.slice(lineStart, match.index).trim());
      lineStart = match.index;
    }
    lineTop = top;
  }

  lines.push(text.slice(lineStart).trim());
  return lines;
}

interface RevealTextProps {
  as?: 'h2' | 'p';
  id?: string;
  className: string;
  delay?: number;
  children: string;
}

export function RevealText({ as: Tag = 'p', id, className, delay = 0, children }: RevealTextProps) {
  const sourceRef = useRef<HTMLSpanElement>(null);
  const [reveal, setReveal] = useState<string[] | 'finished' | null>(null);
  const finished = reveal === 'finished';
  const lines = Array.isArray(reveal) ? reveal : null;

  useEffect(() => {
    const source = sourceRef.current;
    if (!source || finished || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let active = true;
    const measure = () => {
      const node = source.firstChild;
      if (!active || !(node instanceof Text)) return;
      const measured = readVisualLines(node);
      setReveal((current) => {
        if (current === 'finished') return current;
        return current?.length === measured.length && current.every((line, index) => line === measured[index])
          ? current
          : measured;
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(source);
    void document.fonts.ready.then(measure);

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [children, finished]);

  return (
    <Tag id={id} className={`relative ${className}`} style={revealDelay(delay)}>
      <span className="reveal">
        <span ref={sourceRef} className={lines ? 'block opacity-0' : finished ? 'block' : 'reveal__line'}>
          {children}
        </span>
      </span>
      {lines ? (
        <span className="pointer-events-none absolute inset-x-0 top-0 select-none" aria-hidden="true">
          {lines.map((line, index) => (
            <span key={index} className="reveal">
              <span
                className="reveal__line whitespace-nowrap"
                style={{ '--reveal-line-index': index } as CSSProperties}
                onAnimationEnd={index === lines.length - 1 ? () => setReveal('finished') : undefined}
              >
                {line}
              </span>
            </span>
          ))}
        </span>
      ) : null}
    </Tag>
  );
}
