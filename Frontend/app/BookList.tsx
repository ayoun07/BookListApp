import BookForm from "@/components/BookComponent";
import { useFetchBooks } from "@/hooks/useFetchBooks";
import { useDeleteBook } from "@/hooks/useDeleteBook";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useUpdateFavorite } from "@/hooks/useUpdateFavorites";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BookList() {
  const { data: books, isLoading, error } = useFetchBooks();
  const deleteMutation = useDeleteBook();
  const { toggleFavorite, isFavorite } = useFavorites();
  const updateFavoriteMutation = useUpdateFavorite();

  const handleToggleFavorite = (bookId: number) => {
    const currentState = isFavorite(bookId);
    const newFavoriteState = !currentState;
    toggleFavorite(bookId);
    updateFavoriteMutation.mutate({ bookId, favorite: newFavoriteState });
  };

  const favoriteBooks = React.useMemo(
    () => (books || []).filter((b) => isFavorite(b.id)),
    [books, isFavorite]
  );
  const otherBooks = React.useMemo(
    () => (books || []).filter((b) => !isFavorite(b.id)),
    [books, isFavorite]
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Chargement des livres...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erreur : {error?.message}</Text>
      </View>
    );
  }

  const ListHeader = () => (
    <View style={styles.headerWrapper}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/BookCreate")}
        activeOpacity={0.9}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.createButtonText}>Créer un nouveau livre</Text>
      </TouchableOpacity>

      {favoriteBooks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Favoris</Text>
          <FlatList
            data={favoriteBooks}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
            ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
            renderItem={({ item }) => {
              const isFav = isFavorite(item.id);
              return (
                <View style={styles.carouselCard}>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => handleToggleFavorite(item.id)}
                  >
                    <Ionicons
                      name={isFav ? "heart" : "heart-outline"}
                      size={22}
                      color={isFav ? "#FF4D4D" : "#888"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({
                        pathname: "/BookListById",
                        params: { id: item.id },
                      })
                    }
                  >
                    <BookForm
                      name={item.name}
                      author={item.author}
                      cover={item.cover}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => deleteMutation.mutate(item.id)}
                    style={styles.deleteFab}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash-outline" size={18} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </>
      )}

      <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
        Tous les livres
      </Text>
    </View>
  );

  return (
    <FlatList
      data={otherBooks}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.gridRow}
      contentContainerStyle={styles.gridContainer}
      ListHeaderComponent={ListHeader}
      renderItem={({ item }) => {
        const isFav = isFavorite(item.id);
        return (
          <View style={styles.gridCard}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleToggleFavorite(item.id)}
            >
              <Ionicons
                name={isFav ? "heart" : "heart-outline"}
                size={20}
                color={isFav ? "#FF4D4D" : "#888"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/BookListById",
                  params: { id: item.id },
                })
              }
            >
              <BookForm
                name={item.name}
                author={item.author}
                cover={item.cover}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteMutation.mutate(item.id)}
              style={styles.deleteFab}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
}

const { width } = Dimensions.get("window");
const GRID_GAP = 14;
const GRID_CARD_WIDTH = Math.floor((width - 24 * 2 - GRID_GAP) / 2); // padding horizontal 24 + gap

const PALETTE = {
  bg: "#F9FAFB",
  card: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
  primary: "#2563EB",
  danger: "#DC2626",
  border: "#E5E7EB",
  shadow: "rgba(17, 24, 39, 0.12)",
};

const ELEVATION = {
  shadowColor: PALETTE.shadow,
  shadowOpacity: 0.8,
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 16,
  elevation: 5,
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PALETTE.bg,
  },
  loadingText: {
    marginTop: 10,
    color: PALETTE.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: {
    color: PALETTE.danger,
    fontWeight: "600",
    fontSize: 16,
  },

  headerWrapper: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: PALETTE.bg,
  },

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PALETTE.primary,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: PALETTE.primary,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 15,
    letterSpacing: 0.3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: PALETTE.text,
    marginBottom: 10,
  },

  carouselContainer: {
    paddingRight: 16,
    paddingBottom: 6,
  },
  carouselCard: {
    width: 180,
    minHeight: 260,
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: PALETTE.border,
    ...ELEVATION,
  },

  gridContainer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    backgroundColor: PALETTE.bg,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: GRID_GAP,
  },
  gridCard: {
    width: GRID_CARD_WIDTH,
    minHeight: 240,
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: PALETTE.border,
    ...ELEVATION,
  },

  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: "#FFFFFFEE",
    padding: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  deleteFab: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#FEE2E2",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
});
