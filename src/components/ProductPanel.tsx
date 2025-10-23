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
      return 'Sélectionnez un élément pour afficher son interprétation.';
    }
    const hint = stateHint[activeKeyElement.state as keyof typeof stateHint];
    return hint ?? 'Observation détaillée disponible dans le rapport laboratoire.';
  }, [activeSymbol]);

  return (
    <article className="flex h-full flex-col gap-6 rounded-card bg-surface/90 p-6 shadow-panel ring-1 ring-divider/40">
      <div className="flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.32em] text-subtle">Cuvée</p>
        <h2 className="text-2xl font-semibold leading-tight text-text">
          {SAMPLE.productName}
        </h2>
        <p className="text-sm text-subtle/80">Analyse certifiée par laboratoire partenaire.</p>
      </div>
      <div className="relative flex justify-center rounded-[22px] bg-gradient-to-b from-white/60 via-white to-white/60 p-6 shadow-inset">
        <img
          src={bottleSrc}
          alt="Bouteille de Chardonnay"
          className="h-72 w-auto drop-shadow-xl"
          loading="lazy"
        />
      </div>
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-semibold text-text">Éléments clés (mg/L)</h3>
          <span className="text-xs text-subtle">Mise à jour laboratoire — Avril 2024</span>
        </div>
        <div className="grid gap-3">
          {SAMPLE.keyElements.map((element) => (
            <Chip
              key={element.symbol}
              element={element}
              active={activeSymbol === element.symbol}
              pulse={pulseSymbol === element.symbol}
              onActivate={(symbol) =>
                pinSymbol(symbol === activeSymbol ? null : symbol)
              }
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
      </section>
      <footer className="rounded-xl border border-divider/60 bg-background/80 p-4 text-sm text-subtle">
        {description}
      </footer>
    </article>
  );
};
