import { useMemo } from 'react';
import { ActiveElementProvider } from './lib/ActiveElementContext';
import { ProductPanel } from './components/ProductPanel';
import { RadarPanel } from './components/RadarPanel';
import { ElementsGrid } from './components/ElementsGrid';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

const AppShell = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const animationClass = useMemo(
    () => (prefersReducedMotion ? '' : 'motion-safe:animate-fade-up'),
    [prefersReducedMotion],
  );

  return (
    <div className="relative min-h-screen bg-background pb-16 pt-12">
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 lg:px-10">
        <header
          className={`grid gap-10 text-left lg:grid-cols-[1.1fr_0.9fr_0.8fr] ${animationClass}`}
        >
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.48em] text-muted">
              Empreinte signature
            </span>
            <h1 className="font-display text-[56px] leading-[1.04] text-text">
              Empreinte Minérale
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Édition limitée, millésime 2023. Profil détaillé des éléments minéraux issus des
              parcelles calcaires : moyenne mesurée à <strong>58,8 mg/L</strong>, total
              consolidé à <strong>452,09 mg</strong>.
            </p>
          </div>
          <div className="space-y-4 text-sm text-muted">
            <div className="flex flex-col gap-3 rounded-card border border-divider/40 bg-surface px-6 py-5 shadow-panel">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted">
                <span>Profil</span>
                <span>Échantillon 2205</span>
              </div>
              <div className="flex items-baseline justify-between text-text">
                <span className="font-medium">Moyenne actuelle</span>
                <span className="font-display text-3xl">58,8</span>
              </div>
              <div className="flex items-baseline justify-between text-muted">
                <span>mg/L</span>
                <span>Réf. millésime 03</span>
              </div>
              <div className="h-px bg-divider/40" />
              <div className="flex items-baseline justify-between text-text">
                <span className="font-medium">Total minéral</span>
                <span className="font-display text-3xl">452,09</span>
              </div>
              <div className="flex items-baseline justify-between text-muted">
                <span>mg</span>
                <span>Analyse lot JUST Perfect</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-6 text-sm text-muted lg:items-end lg:text-right">
            <div className="space-y-1">
              <p>Responsable analyse</p>
              <p className="font-medium text-text">Dr. Caroline Giroux</p>
              <p>Laboratoire partenaire — Cévennes, FR</p>
              <a
                href="mailto:contact@pandaeon.me"
                className="text-xs uppercase tracking-[0.3em] text-muted underline-offset-4 hover:text-text hover:underline"
              >
                contact@pandaeon.me
              </a>
            </div>
            <button
              type="button"
              className="rounded-full border border-accent/50 bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white shadow-panel transition-colors hover:bg-accentDark"
            >
              Bouteille authentifiée Maison
            </button>
          </div>
        </header>
        <section
          className={`grid gap-8 lg:grid-cols-[0.32fr_0.3fr_0.38fr] ${animationClass}`}
        >
          <ProductPanel />
          <RadarPanel />
          <ElementsGrid />
        </section>
        <footer className={`grid gap-6 text-xs text-muted lg:grid-cols-4 ${animationClass}`}>
          <div>
            <strong className="text-text">Niveau 1</strong>
            <p className="mt-2 leading-relaxed">
              Traces quasi imperceptibles, issues des sols profonds et filtrées lors de l&rsquo;élevage.
            </p>
          </div>
          <div>
            <strong className="text-text">Niveau 4</strong>
            <p className="mt-2 leading-relaxed">
              Plateau d&rsquo;équilibre observé sur la majorité des cuvées pour conserver la pureté.
            </p>
          </div>
          <div>
            <strong className="text-text">Niveau 7</strong>
            <p className="mt-2 leading-relaxed">
              Intensité affirmée, révélant la signature saline caractéristique du terroir.
            </p>
          </div>
          <div>
            <strong className="text-text">Niveau 10</strong>
            <p className="mt-2 leading-relaxed">
              Saturation exceptionnelle réservée aux millésimes rares et aux cuvées expérimentales.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ActiveElementProvider>
      <AppShell />
    </ActiveElementProvider>
  );
};

export default App;
