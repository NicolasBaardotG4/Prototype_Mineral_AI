import { ActiveElementProvider } from './lib/ActiveElementContext';
import { ProductPanel } from './components/ProductPanel';
import { RadarPanel } from './components/RadarPanel';
import { ElementsGrid } from './components/ElementsGrid';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useMemo } from 'react';

const AppShell = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const animationClass = useMemo(
    () => (prefersReducedMotion ? '' : 'motion-safe:animate-fade-up'),
    [prefersReducedMotion],
  );

  return (
    <div className="relative min-h-screen bg-background pb-16 pt-10 md:pb-20 md:pt-14">
      <main className="container mx-auto max-w-[1440px] space-y-8">
        <header className={`space-y-2 text-center lg:text-left ${animationClass}`}>
          <p className="text-sm uppercase tracking-[0.28em] text-subtle">Analyse minérale</p>
          <h1 className="text-3xl font-semibold text-text sm:text-[40px] sm:leading-[1.1]">
            Empreinte minérale
          </h1>
          <p className="max-w-2xl text-base text-subtle text-balance">
            Visualisation de la composition minérale détaillée pour les cuvées haut de gamme.
            Explorez les éléments clés, comparez leurs niveaux et naviguez facilement entre les
            détails.
          </p>
        </header>
        <section
          className={`grid gap-6 lg:grid-cols-[0.3fr_0.3fr_0.4fr] ${animationClass}`}
        >
          <ProductPanel />
          <RadarPanel />
          <ElementsGrid />
        </section>
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
