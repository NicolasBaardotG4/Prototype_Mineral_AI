import { forwardRef } from 'react';
import { clsx } from 'clsx';
import type { SampleKeyElement } from '../data/sample';

const stateStyles: Record<'low' | 'normal' | 'high', { label: string; className: string }> = {
  low: { label: 'Bas', className: 'bg-text/5 text-subtle' },
  normal: { label: 'Normal', className: 'bg-emerald-100 text-emerald-700' },
  high: { label: 'Haut', className: 'bg-accent/20 text-accent' },
};

const getStateKey = (state: SampleKeyElement['state']): keyof typeof stateStyles => {
  const lower = state.toLowerCase();
  if (lower.includes('high')) {
    return 'high';
  }
  if (lower.includes('low') || lower.includes('bas')) {
    return 'low';
  }
  return 'normal';
};

type ChipProps = {
  element: SampleKeyElement;
  active?: boolean;
  pulse?: boolean;
  onActivate?: (symbol: string) => void;
  onHoverChange?: (symbol: string | null) => void;
};

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ element, active = false, pulse = false, onActivate, onHoverChange }, ref) => {
    const stateKey = getStateKey(element.state);
    const state = stateStyles[stateKey];

    return (
      <button
        ref={ref}
        type="button"
        onMouseEnter={() => onHoverChange?.(element.symbol)}
        onMouseLeave={() => onHoverChange?.(null)}
        onFocus={() => onHoverChange?.(element.symbol)}
        onBlur={() => onHoverChange?.(null)}
        onClick={() => onActivate?.(element.symbol)}
        className={clsx(
          'group flex items-center justify-between gap-3 rounded-full border border-divider/40 bg-white/90 px-4 py-3 text-left shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          active
            ? 'border-accent/80 bg-accent/10 shadow-panel'
            : 'hover:border-accent/60 hover:shadow-panel',
          pulse && 'motion-safe:animate-pulseOutline',
        )}
      >
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-subtle">
            {element.symbol}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-numeric text-lg font-semibold text-text">
              {element.value}
              <span className="ml-1 text-xs font-medium text-subtle">{element.unit}</span>
            </span>
          </div>
          <p className="text-sm font-medium text-text/80">{element.label}</p>
        </div>
        <span
          className={clsx(
            'rounded-pill px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]',
            state.className,
          )}
        >
          {state.label}
        </span>
      </button>
    );
  },
);

Chip.displayName = 'Chip';
