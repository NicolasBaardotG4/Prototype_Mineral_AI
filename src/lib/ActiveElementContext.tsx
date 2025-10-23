import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ActiveElementContextValue = {
  activeSymbol: string | null;
  pinnedSymbol: string | null;
  setActiveSymbol: (symbol: string | null) => void;
  pinSymbol: (symbol: string | null) => void;
};

const ActiveElementContext = createContext<ActiveElementContextValue | undefined>(
  undefined,
);

export const ActiveElementProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeSymbol, setActiveSymbolState] = useState<string | null>(null);
  const [pinnedSymbol, setPinnedSymbol] = useState<string | null>(null);

  const setActiveSymbol = useCallback(
    (symbol: string | null) => {
      if (symbol === null) {
        setActiveSymbolState(pinnedSymbol);
      } else {
        setActiveSymbolState(symbol);
      }
    },
    [pinnedSymbol],
  );

  const pinSymbol = useCallback((symbol: string | null) => {
    setPinnedSymbol(symbol);
    setActiveSymbolState(symbol);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPinnedSymbol(null);
        setActiveSymbolState(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = useMemo(
    () => ({
      activeSymbol,
      pinnedSymbol,
      setActiveSymbol,
      pinSymbol,
    }),
    [activeSymbol, pinnedSymbol, pinSymbol, setActiveSymbol],
  );

  return (
    <ActiveElementContext.Provider value={value}>
      {children}
    </ActiveElementContext.Provider>
  );
};

export const useActiveElement = () => {
  const context = useContext(ActiveElementContext);
  if (!context) {
    throw new Error('useActiveElement must be used within ActiveElementProvider');
  }
  return context;
};
