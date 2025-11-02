import BookFormById from "@/components/BookByIdComponent";
import NotesById from "@/components/Notes/NotesByIdComponent";
import NoteCreateComponent from "@/components/Notes/NoteCreateComponent";
import { useFetchBookById } from "@/hooks/useFetchBookById";
import { useFetchNoteById } from "@/hooks/Notes/useFetchNoteById";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useUpdateFavorite } from "@/hooks/useUpdateFavorites";
import { useUpdateRating } from "@/hooks/useUpdaterating";
import { useRatings } from "@/contexts/RatingsContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import RatingStars from "@/components/Stars/RatingStars";

export default function BookFromById() {
  const { id } = useLocalSearchParams();
  const bookId = Number(id);
  const { toggleFavorite, isFavorite } = useFavorites();
  const updateFavoriteMutation = useUpdateFavorite();
  const updateRatingMutation = useUpdateRating();
  const { getRating, setRating: setLocalRating } = useRatings();

  const {
    data: bookById,
    isLoading: isLoadingBook,
    error: errorBook,
  } = useFetchBookById(bookId);

  const {
    data: notes,
    isLoading: isLoadingNotes,
    error: errorNotes,
  } = useFetchNoteById(bookId);

  const localOverride = getRating(bookId);
  const serverRating = bookById?.rating ?? 0;
  const displayRating = localOverride ?? serverRating;

  const [rating, setRating] = React.useState<number>(displayRating);
  React.useEffect(() => {
    setRating(localOverride ?? serverRating);
  }, [localOverride, serverRating]);

  if (isLoadingBook || isLoadingNotes) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (errorBook || errorNotes) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Erreur : {errorBook?.message || errorNotes?.message}
        </Text>
      </View>
    );
  }

  if (!bookById) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Livre introuvable.</Text>
      </View>
    );
  }

  const isFav = isFavorite(bookId);

  const handleToggleFavorite = () => {
    const newFavoriteState = !isFav;
    toggleFavorite(bookId);
    updateFavoriteMutation.mutate({ bookId, favorite: newFavoriteState });
  };

  const handleChangeRating = (next: number) => {
    setRating(next);
    setLocalRating(bookId, next);
    updateRatingMutation.mutate({ bookId, rating: next });
  };

  const NOTE_CARD_GAP = 12;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topButtons}>
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={28}
            color={isFav ? "#FF4D4D" : "#888"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/BookUpdate",
              params: { id: bookById.id.toString() },
            })
          }
          style={styles.editButton}
        >
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Carte des détails du livre */}
      <View style={styles.detailsCard}>
        <BookFormById
          name={bookById.name}
          author={bookById.author}
          editor={bookById.editor}
          year={bookById.year}
          read={bookById.read}
          favorite={isFav}
          rating={rating}
          cover={bookById.cover}
          theme={bookById.theme}
        />
      </View>

      {/* Section Notes + Bloc rating à gauche (à la Fnac) */}
      <Text style={styles.notesTitle}>Notes</Text>

      <View style={styles.notesRow}>
        {/* Colonne gauche : bloc rating */}
        <View style={styles.ratingCard}>
          <View style={styles.ratingHeader}>
            <Text style={styles.ratingTitle}>Votre note</Text>
            <Text style={styles.ratingValue}>{rating}/5</Text>
          </View>

          <RatingStars
            value={rating}
            onChange={handleChangeRating}
            size={28}
            colorActive="#F59E0B"
            colorInactive="#9CA3AF"
            spacing={6}
            allowReset
            readOnly={updateRatingMutation.isPending}
          />

          <Text style={styles.ratingHint}>
            {updateRatingMutation.isPending
              ? "Enregistrement…"
              : "Touchez pour noter • Appui long pour remettre à 0"}
          </Text>
        </View>

        {/* Colonne droite : carrousel des notes */}
        <View style={styles.notesCol}>
          {notes && notes.length > 0 ? (
            <FlatList
              horizontal
              data={notes}
              keyExtractor={(item) => item.dateISO}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
              ItemSeparatorComponent={() => (
                <View style={{ width: NOTE_CARD_GAP }} />
              )}
              renderItem={({ item }) => (
                <View style={styles.noteCard}>
                  <NotesById content={item.content} dateISO={item.dateISO} />
                </View>
              )}
            />
          ) : (
            <Text style={styles.noNotes}>
              Aucune note disponible pour ce livre.
            </Text>
          )}
        </View>
      </View>

      {/* Création de note */}
      <View style={styles.createNoteWrapper}>
        <NoteCreateComponent bookId={bookId} content={""} dateISO={""} />
      </View>
    </ScrollView>
  );
}

const PALETTE = {
  bg: "#F5F7FB",
  card: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
  primary: "#2563EB",
  primarySoft: "#E8F0FE",
  danger: "#EF4444",
  border: "#E5E7EB",
  shadow: "rgba(17, 24, 39, 0.12)",
};

const ELEVATION = {
  shadowColor: PALETTE.shadow,
  shadowOpacity: 0.8,
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 16,
  elevation: 6,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bg },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 28 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: PALETTE.bg,
  },
  loadingText: {
    marginTop: 12,
    color: PALETTE.primary,
    fontWeight: "600",
    letterSpacing: 0.2,
    fontSize: 14,
  },
  errorText: {
    color: PALETTE.danger,
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  topButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    marginBottom: 12,
    paddingRight: 2,
  },
  favoriteButton: {
    backgroundColor: PALETTE.card,
    padding: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PALETTE.border,
    ...ELEVATION,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PALETTE.primarySoft,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8E4FF",
    ...ELEVATION,
  },

  detailsCard: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
    ...ELEVATION,
  },

  /* --- Titre Notes --- */
  notesTitle: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: "700",
    color: PALETTE.text,
    letterSpacing: 0.3,
  },

  /* --- Disposition 2 colonnes : rating à gauche, notes à droite --- */
  notesRow: {
    flexDirection: "row",
    gap: 12,
  },

  ratingCard: {
    width: Math.min(220, Math.round(Dimensions.get("window").width * 0.36)),
    backgroundColor: PALETTE.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
    padding: 12,
    ...ELEVATION,
  },
  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  ratingTitle: { fontSize: 16, fontWeight: "700", color: PALETTE.text },
  ratingValue: { fontSize: 14, fontWeight: "600", color: PALETTE.textMuted },
  ratingHint: { marginTop: 6, fontSize: 12, color: PALETTE.textMuted },

  notesCol: {
    flex: 1,
    minHeight: 140,
    backgroundColor: "transparent",
  },

  /* --- Carrousel de notes (dans la colonne droite) --- */
  carouselContent: { paddingVertical: 4, paddingRight: 4 },
  noteCard: {
    width: Math.round(Dimensions.get("window").width * 0.48), // largeur confortable dans la colonne droite
    backgroundColor: PALETTE.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 12,
    ...ELEVATION,
  },

  noNotes: {
    fontSize: 14,
    color: PALETTE.textMuted,
    textAlign: "left",
    marginTop: 12,
    lineHeight: 20,
    fontStyle: "italic",
  },

  /* --- Création de note --- */
  createNoteWrapper: { marginTop: 16 },
});
