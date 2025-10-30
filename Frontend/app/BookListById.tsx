import BookFormById from "@/components/BookByIdComponent";
import { useFetchBookById } from "@/hooks/useFetchBookById";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function BookFromById() {
  const { id } = useLocalSearchParams();

  const {
    data: bookById,
    isLoading: isLoadingBook,
    error: errorBook,
  } = useFetchBookById(Number(id));

  if (isLoadingBook) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Chargement du livre...</Text>
      </View>
    );
  }

  if (errorBook) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erreur : {errorBook?.message}</Text>
      </View>
    );
  }

  // ✅ Vérifie si le livre existe avant d’essayer de l’afficher
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
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
});
