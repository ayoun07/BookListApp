import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (bookId: number) => void;
  isFavorite: (bookId: number) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const STORAGE_KEY = "@book_favorites";

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedFavorites !== null) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: number[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des favoris:", error);
    }
  };

  const toggleFavorite = (bookId: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId];

      saveFavorites(newFavorites); 
      return newFavorites;
    });
  };

  const isFavorite = (bookId: number) => favorites.includes(bookId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, isLoading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé dans un FavoritesProvider");
  }
  return context;
};
