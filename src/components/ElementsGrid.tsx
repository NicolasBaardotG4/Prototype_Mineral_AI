import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { clsx } from 'clsx';
import { ELEMENTS } from '../data/elements';
import { useActiveElement } from '../lib/ActiveElementContext';
import { Tooltip } from './Tooltip';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const columns = 7;

const getLevelDescriptor = (level: number) => {
  if (level >= 8) return 'Élevé';
  if (level >= 4) return 'Normal';
  return 'Bas';
};

export const ElementsGrid = () => {
  const { activeSymbol, setActiveSymbol, pinSymbol } = useActiveElement();
  const prefersReducedMotion = usePrefersReducedMotion();
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pulseSymbol, setPulseSymbol] = useState<string | null>(null);

  useEffect(() => {
    if (!activeSymbol) {
      return;
    }
    const index = ELEMENTS.findIndex((element) => element.symbol === activeSymbol);
    const node = tileRefs.current[index];
    if (node) {
      node.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
    setPulseSymbol(activeSymbol);
    const timeout = window.setTimeout(() => {
      setPulseSymbol((current) => (current === activeSymbol ? null : current));
    }, 800);
    return () => window.clearTimeout(timeout);
  }, [activeSymbol, prefersReducedMotion]);

  const gridAnimationClass = useMemo(
    () => (prefersReducedMotion ? '' : 'motion-safe:animate-fade-up'),
    [prefersReducedMotion],
  );

  const handleKeyNavigation = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const total = ELEMENTS.length;
      let nextIndex = index;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextIndex = (index + 1) % total;
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        nextIndex = (index - 1 + total) % total;
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        nextIndex = (index + columns) % total;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        nextIndex = (index - columns + total * columns) % total;
      } else if (event.key === 'Home') {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === 'End') {
        event.preventDefault();
        nextIndex = total - 1;
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const element = ELEMENTS[index];
        const nextSymbol = element.symbol === activeSymbol ? null : element.symbol;
        pinSymbol(nextSymbol);
        return;
      } else {
        return;
      }

      const node = tileRefs.current[nextIndex];
      node?.focus();
    },
    [activeSymbol, pinSymbol],
  );

  return (
    <article className="flex h-full flex-col rounded-card border border-divider/40 bg-surface px-7 py-8 shadow-panel">
      <header className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-muted/80">Matrice complète</p>
            <h3 className="font-display text-[28px] leading-[1.15] text-text">Cartographie des éléments</h3>
          </div>
          <span className="text-xs uppercase tracking-[0.28em] text-muted/70">↑ ↓ ← →</span>
        </div>
        <p className="text-sm leading-relaxed text-muted">
          Survolez ou utilisez le clavier pour mettre en exergue un élément et révéler sa position
          sur le radar central.
        </p>
      </header>
      <div
        className={clsx(
          'mt-6 grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7',
          gridAnimationClass,
        )}
      >
        {ELEMENTS.map((element, index) => {
          const isActive = element.symbol === activeSymbol;
          const isPulse = element.symbol === pulseSymbol;
          const highlight = element.level >= 8;
          const backgroundClass = highlight
            ? 'bg-accent/12 text-text'
            : 'bg-surfaceMuted/40 text-text';
          const tooltip = `${element.symbol} — ${element.name} (${element.unit}) — Niveau ${element.level}/10 (${getLevelDescriptor(element.level)})`;

          return (
            <Tooltip key={`${element.symbol}-${index}`} content={tooltip}>
              <button
                ref={(node) => {
                  tileRefs.current[index] = node;
                }}
                type="button"
                onMouseEnter={() => setActiveSymbol(element.symbol)}
                onMouseLeave={() => {
                  if (activeSymbol === element.symbol) {
                    setActiveSymbol(null);
                  }
                }}
                onFocus={() => setActiveSymbol(element.symbol)}
                onBlur={() => {
                  if (activeSymbol === element.symbol) {
                    setActiveSymbol(null);
                  }
                }}
                onClick={() => pinSymbol(isActive ? null : element.symbol)}
                onKeyDown={(event) => handleKeyNavigation(event, index)}
                className={clsx(
                  'group relative aspect-square rounded-[22px] border border-divider/40 p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                  backgroundClass,
                  isActive
                    ? 'border-accent shadow-panel'
                    : 'hover:border-accent/60 hover:shadow-panel',
                  isPulse && 'motion-safe:animate-pulseOutline',
                  prefersReducedMotion ? undefined : 'motion-safe:animate-fade-up',
                )}
                style={
                  prefersReducedMotion
                    ? undefined
                    : ({ animationDelay: `${index * 60}ms` } as CSSProperties)
                }
              >
                <span className="absolute left-3 top-3 rounded-lg bg-white/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted shadow-sm">
                  {element.level}
                </span>
                <div className="flex h-full flex-col items-center justify-center gap-2">
                  <span className="font-display text-3xl leading-none text-text">
                    {element.symbol}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">
                    {element.name}
                  </span>
                </div>
              </button>
            </Tooltip>
          );
        })}
      </div>
      <div className="mt-6 rounded-[18px] border border-divider/30 bg-surfaceMuted/50 px-5 py-4 text-xs leading-relaxed text-muted">
        <p>
          <strong className="text-text">Lecture :</strong> macros en mg/L · traces en µg/L. Les cases dorées signalent les
          éléments au-dessus du seuil optimal et sont synchronisées avec la section de gauche.
        </p>
      </div>
    </article>
  );
};
