import { useCallback, useMemo } from 'react';
import { generateBrightColor, colorDistance } from '../../shared/lib/colorUtils';

const STORAGE_KEY = 'expenseCategoryColors';
const MIN_COLOR_DISTANCE = 85;
const MAX_GENERATION_TRIES = 100;

const loadColorMap = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveColorMap = (map: Record<string, string>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
};

export const usePersistentColors = () => {
  const colorMap = useMemo(() => loadColorMap(), []);

  const getColorForCategory = useCallback(
    (categoryId: number, usedColors: string[]): string => {
      const key = String(categoryId);
      const existing = colorMap[key];
      
      if (existing) {
        return existing;
      }

      // Generate a new color that's distinct from already used and stored colors
      const alreadyAssigned = Object.values(colorMap);
      let tries = 0;

      while (tries < MAX_GENERATION_TRIES) {
        const candidate = generateBrightColor();
        const isFarFromUsed = usedColors.every((u) => colorDistance(candidate, u) >= MIN_COLOR_DISTANCE);
        const isFarFromAssigned = alreadyAssigned.every((u) => colorDistance(candidate, u) >= MIN_COLOR_DISTANCE);

        if (isFarFromUsed && isFarFromAssigned) {
          colorMap[key] = candidate;
          saveColorMap(colorMap);
          return candidate;
        }
        tries++;
      }

      // Fallback if couldn't find distinct color
      const fallback = generateBrightColor();
      colorMap[key] = fallback;
      saveColorMap(colorMap);
      return fallback;
    },
    [colorMap]
  );

  return { getColorForCategory };
};
