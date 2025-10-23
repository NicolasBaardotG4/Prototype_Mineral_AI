import { useEffect, useMemo, useRef, useState } from 'react';
import { SAMPLE } from '../data/sample';
import { useActiveElement } from '../lib/ActiveElementContext';
import { Chip } from './Chip';

const bottleSrc = '/bottle.svg';

const stateHint = {
  Normal: 'Équilibre optimal sur la moyenne du millésime.',
  High: 'Concentration supérieure à la moyenne observée.',
  'Slightly high': 'Légère augmentation par rapport au profil type.',
};

export const ProductPanel = () => {
  const { activeSymbol, setActiveSymbol, pinSymbol } = useActiveElement();
  const [pulseSymbol, setPulseSymbol] = useState<string | null>(null);
  const timers = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!activeSymbol) {
      return;
    }
    setPulseSymbol(activeSymbol);
    const timeout = window.setTimeout(() => {
      setPulseSymbol((current) => (current === activeSymbol ? null : current));
      timers.current.delete(activeSymbol);
    }, 700);
    const existing = timers.current.get(activeSymbol);
    if (existing) {
      window.clearTimeout(existing);
    }
    timers.current.set(activeSymbol, timeout);
  }, [activeSymbol]);

  useEffect(() => {
    const registry = timers.current;
    return () => {
      registry.forEach((timeout) => window.clearTimeout(timeout));
      registry.clear();
    };
  }, []);

  const description = useMemo(() => {
    const activeKeyElement = SAMPLE.keyElements.find(
      (element) => element.symbol === activeSymbol,
    );
    if (!activeKeyElement) {
      return 'Sélectionnez un élément clé pour synchroniser les panneaux et afficher son interprétation.';
    }
    const hint = stateHint[activeKeyElement.state as keyof typeof stateHint];
    return hint ?? 'Observation détaillée disponible dans le rapport laboratoire.';
  }, [activeSymbol]);

  return (
    <article className="flex h-full flex-col rounded-card border border-divider/40 bg-surface px-7 py-8 shadow-panel">
      <header className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-muted">Éléments clés</p>
            <h2 className="font-display text-3xl text-text">Sélection minérale</h2>
          </div>
          <span className="text-xs uppercase tracking-[0.28em] text-muted/80">Lot 03 · 2023</span>
        </div>
        <p className="text-sm leading-relaxed text-muted">{description}</p>
      </header>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SAMPLE.keyElements.map((element) => (
          <Chip
            key={element.symbol}
            element={element}
            active={activeSymbol === element.symbol}
            pulse={pulseSymbol === element.symbol}
            onActivate={(symbol) => pinSymbol(symbol === activeSymbol ? null : symbol)}
            onHoverChange={(symbol) => {
              if (!symbol) {
                if (activeSymbol === element.symbol) {
                  setActiveSymbol(null);
                }
              } else {
                setActiveSymbol(symbol);
              }
            }}
          />
        ))}
      </div>
      <div className="mt-8 flex flex-1 flex-col items-center justify-end gap-6">
        <div className="relative w-full max-w-[240px] rounded-[32px] border border-divider/30 bg-surfaceMuted/80 px-6 py-8 shadow-inset">
          <img
            src={bottleSrc}
            alt="Bouteille de Chardonnay"
            className="mx-auto h-[320px] w-auto object-contain"
            loading="lazy"
          />
        </div>
        <div className="text-center text-sm text-muted">
          <p className="text-xs uppercase tracking-[0.36em] text-muted/80">JUST Perfect</p>
          <p className="font-display text-xl text-text text-balance">{SAMPLE.productName}</p>
          <p className="text-xs uppercase tracking-[0.28em] text-muted/70">Cuvée signature</p>
        </div>
      </div>
    </article>
  );
};
