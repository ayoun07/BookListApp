import BookFormById from "@/components/BookByIdComponent";
import NotesById from "@/components/Notes/NotesByIdComponent";
import NoteCreateComponent from "@/components/Notes/NoteCreateComponent";
import { useFetchBookById } from "@/hooks/useFetchBookById";
import { useFetchNoteById } from "@/hooks/Notes/useFetchNoteById";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useUpdateFavorite } from "@/hooks/useUpdateFavorites";
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

export default function BookFromById() {
  const { id } = useLocalSearchParams();
  const bookId = Number(id);
  const { toggleFavorite, isFavorite } = useFavorites();
  const updateFavoriteMutation = useUpdateFavorite();

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

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const NOTE_CARD_GAP = 12;
  const NOTE_CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.78);

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

      <View style={styles.detailsCard}>
        <BookFormById
          name={bookById.name}
          author={bookById.author}
          editor={bookById.editor}
          year={bookById.year}
          read={bookById.read}
          favorite={isFav}
          rating={bookById.rating}
          cover={bookById.cover}
          theme={bookById.theme}
        />
      </View>

      <Text style={styles.notesTitle}>Notes</Text>

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
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={NOTE_CARD_WIDTH + NOTE_CARD_GAP}
          renderItem={({ item }) => (
            <View style={[styles.noteCard, { width: NOTE_CARD_WIDTH }]}>
              <NotesById content={item.content} dateISO={item.dateISO} />
            </View>
          )}
        />
      ) : (
        <Text style={styles.noNotes}>
          Aucune note disponible pour ce livre.
        </Text>
      )}

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
  container: {
    flex: 1,
    backgroundColor: PALETTE.bg,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },

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

  notesTitle: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: "700",
    color: PALETTE.text,
    letterSpacing: 0.3,
  },

  carouselContent: {
    paddingVertical: 4,
    paddingRight: 4,
  },
  noteCard: {
    backgroundColor: PALETTE.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    ...ELEVATION,
  },

  noNotes: {
    fontSize: 14,
    color: PALETTE.textMuted,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
    fontStyle: "italic",
  },

  createNoteWrapper: {
    marginTop: 16,
  },
});
