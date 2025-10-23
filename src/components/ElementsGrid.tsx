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
    <article className="flex h-full flex-col gap-4 rounded-card bg-surface/90 p-6 shadow-panel ring-1 ring-divider/40">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-text">Composition détaillée</h3>
        <p className="text-sm text-subtle">
          Naviguez avec les flèches ou touchez pour sélectionner un élément et synchroniser les vues.
        </p>
      </div>
      <div
        className={clsx(
          'grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7',
          gridAnimationClass,
        )}
      >
        {ELEMENTS.map((element, index) => {
          const isActive = element.symbol === activeSymbol;
          const isPulse = element.symbol === pulseSymbol;
          const backgroundClass =
            element.level >= 8 ? 'bg-accent/15 text-text' : 'bg-background/80';
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
                  'group relative aspect-square rounded-[20px] border border-divider/40 p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  backgroundClass,
                  isActive
                    ? 'border-accent/80 shadow-panel'
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
                <span className="absolute left-3 top-3 rounded-lg bg-white/70 px-2 py-1 text-xs font-semibold text-subtle shadow-sm">
                  {element.level}
                </span>
                <div className="flex h-full flex-col items-center justify-center gap-2">
                  <span className="font-numeric text-3xl font-semibold tracking-[0.12em] text-text">
                    {element.symbol}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.3em] text-subtle">
                    {element.name}
                  </span>
                </div>
              </button>
            </Tooltip>
          );
        })}
      </div>
      <div className="rounded-xl border border-divider/40 bg-background/70 p-4 text-xs text-subtle">
        <p>
          <span className="font-semibold text-text">Niveaux :</span> 1–2 très bas · 3–4 modéré · 5–6 stable · 7–8 haut · 9–10 très élevé.
        </p>
      </div>
    </article>
  );
};
