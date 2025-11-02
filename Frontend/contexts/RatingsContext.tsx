// contexts/RatingsContext.tsx
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Ratings = Record<string, number>;

type RatingsContextValue = {
  getRating: (bookId: number) => number | undefined;
  setRating: (bookId: number, rating: number) => void;
  removeRating: (bookId: number) => void;
};

const RatingsContext = React.createContext<RatingsContextValue | undefined>(
  undefined
);
const STORAGE_KEY = "@ratings_v1";

export function RatingsProvider({ children }: { children: React.ReactNode }) {
  const [ratings, setRatings] = React.useState<Ratings>({});

  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setRatings(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ratings)).catch(() => {});
  }, [ratings]);

  const getRating = React.useCallback(
    (bookId: number) => ratings[String(bookId)],
    [ratings]
  );

  const setRating = React.useCallback((bookId: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [String(bookId)]: rating }));
  }, []);

  const removeRating = React.useCallback((bookId: number) => {
    setRatings((prev) => {
      const copy = { ...prev };
      delete copy[String(bookId)];
      return copy;
    });
  }, []);

  const value = React.useMemo(
    () => ({ getRating, setRating, removeRating }),
    [getRating, setRating, removeRating]
  );

  return (
    <RatingsContext.Provider value={value}>{children}</RatingsContext.Provider>
  );
}

export function useRatings() {
  const ctx = React.useContext(RatingsContext);
  if (!ctx) throw new Error("useRatings must be used within RatingsProvider");
  return ctx;
}
