import { forwardRef } from 'react';
import { clsx } from 'clsx';
import type { SampleKeyElement } from '../data/sample';

const stateStyles: Record<'low' | 'normal' | 'high', { label: string; className: string }> = {
  low: { label: 'Bas', className: 'bg-[#F2E2D4] text-[#A06A36]' },
  normal: { label: 'Normal', className: 'bg-[#EFE7D6] text-muted' },
  high: { label: 'Haut', className: 'bg-[#E6D4A8] text-accentDark' },
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
          'group flex flex-col rounded-[22px] border border-divider/40 bg-surfaceMuted/40 px-5 py-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          active
            ? 'border-accent bg-accent/10 shadow-panel'
            : 'hover:border-accent/70 hover:shadow-panel',
          pulse && 'motion-safe:animate-pulseOutline',
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.36em] text-muted/80">
            {element.symbol}
          </p>
          <span
            className={clsx(
              'rounded-pill px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.34em]',
              state.className,
            )}
          >
            {state.label}
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-[28px] leading-none text-text">
            {element.value}
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-muted">{element.unit}</span>
        </div>
        <p className="mt-3 text-sm font-medium text-text">{element.label}</p>
      </button>
    );
  },
);

Chip.displayName = 'Chip';
