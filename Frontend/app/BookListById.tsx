import BookFormById from "@/components/BookByIdComponent";
import NotesById from "@/components/Notes/NotesByIdComponent";
import NoteCreateComponent from "@/components/Notes/NoteCreateComponent"; // ✅ import ajouté
import { useFetchBookById } from "@/hooks/useFetchBookById";
import { useFetchNoteById } from "@/hooks/Notes/useFetchNoteById";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BookFromById() {
  const { id } = useLocalSearchParams();
  const bookId = Number(id);

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

  return (
    <View style={styles.container}>
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
      <BookFormById
        name={bookById.name}
        author={bookById.author}
        editor={bookById.editor}
        year={bookById.year}
        read={bookById.read}
        favorite={bookById.favorite}
        rating={bookById.rating}
        cover={bookById.cover}
        theme={bookById.theme}
      />
      <Text style={styles.notesTitle}>Notes :</Text>
      {notes && notes.length > 0 ? (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.dateISO}
          renderItem={({ item }) => (
            <NotesById content={item.content} dateISO={item.dateISO} />
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      ) : (
        <Text style={styles.noNotes}>
          Aucune note disponible pour ce livre.
        </Text>
      )}
      <NoteCreateComponent bookId={bookId} content={""} dateISO={""} />{" "}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    marginTop: 8,
    color: "#2563EB",
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF4D4D",
    fontWeight: "bold",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#E8F0FE",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    marginRight: 10,
  },
  notesTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  noNotes: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
  },
});
