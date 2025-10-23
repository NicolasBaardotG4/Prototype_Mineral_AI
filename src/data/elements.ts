export type ElementItem = {
  symbol: string;
  name: string;
  unit: 'mg/L' | 'µg/L';
  level: number;
  value?: number;
  category: 'macro' | 'trace';
};

export const ELEMENTS: ElementItem[] = [
  { symbol: 'B', name: 'Bore', unit: 'µg/L', level: 8, category: 'trace' },
  { symbol: 'Na', name: 'Sodium', unit: 'mg/L', level: 5, value: 38, category: 'macro' },
  { symbol: 'Mg', name: 'Magnésium', unit: 'mg/L', level: 6, value: 65, category: 'macro' },
  { symbol: 'Al', name: 'Aluminium', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Si', name: 'Silicium', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'P', name: 'Phosphore', unit: 'µg/L', level: 8, category: 'trace' },
  { symbol: 'S', name: 'Soufre', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Cl', name: 'Chlore', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'K', name: 'Potassium', unit: 'mg/L', level: 9, value: 826, category: 'macro' },
  { symbol: 'Ca', name: 'Calcium', unit: 'mg/L', level: 5, value: 3, category: 'macro' },
  { symbol: 'Sc', name: 'Scandium', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Ti', name: 'Titane', unit: 'µg/L', level: 5, category: 'trace' },
  { symbol: 'V', name: 'Vanadium', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Cr', name: 'Chrome', unit: 'µg/L', level: 5, category: 'trace' },
  { symbol: 'Mn', name: 'Manganèse', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Fe', name: 'Fer', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Co', name: 'Cobalt', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Ni', name: 'Nickel', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Cu', name: 'Cuivre', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Zn', name: 'Zinc', unit: 'µg/L', level: 5, category: 'trace' },
  { symbol: 'As', name: 'Arsenic', unit: 'µg/L', level: 8, category: 'trace' },
  { symbol: 'Br', name: 'Brome', unit: 'µg/L', level: 5, category: 'trace' },
  { symbol: 'Rb', name: 'Rubidium', unit: 'µg/L', level: 8, category: 'trace' },
  { symbol: 'Sr', name: 'Strontium', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Y', name: 'Yttrium', unit: 'µg/L', level: 5, category: 'trace' },
  { symbol: 'Zr', name: 'Zirconium', unit: 'µg/L', level: 5, category: 'trace' },
  { symbol: 'Nb', name: 'Niobium', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Cd', name: 'Cadmium', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Sn', name: 'Étain', unit: 'µg/L', level: 5, category: 'trace' },
  { symbol: 'I', name: 'Iode', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Cs', name: 'Césium', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Ba', name: 'Baryum', unit: 'µg/L', level: 5, category: 'trace' },
  { symbol: 'La', name: 'Lanthane', unit: 'µg/L', level: 8, category: 'trace' },
  { symbol: 'Ce', name: 'Cérium', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Pr', name: 'Praséodyme', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Nd', name: 'Néodyme', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Sm', name: 'Samarium', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'W', name: 'Tungstène', unit: 'µg/L', level: 5, category: 'trace' },
  { symbol: 'Ti', name: 'Titane', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Pb', name: 'Plomb', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'U', name: 'Uranium', unit: 'µg/L', level: 1, category: 'trace' },
  { symbol: 'Zn', name: 'Zinc', unit: 'µg/L', level: 5, category: 'trace' },
];
