import BookForm from "@/components/BookComponent";
import { useFetchBooks } from "@/hooks/useFetchBooks";
import { useDeleteBook } from "@/hooks/useDeleteBook";
import { router } from "expo-router";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BookList() {
  const { data: books, isLoading, error } = useFetchBooks();
  const deleteMutation = useDeleteBook(); 

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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/BookCreate")}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.createButtonText}>Créer un nouveau livre</Text>
      </TouchableOpacity>

      <FlatList
        data={books}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookCard}>
            <TouchableOpacity
              activeOpacity={0.8}
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
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={22} color="#FF4D4D" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.carouselContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    backgroundColor: "#F9FAFB", // gris très clair pour un fond doux
  },
  carouselContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 10,
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  bookRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginLeft: 8,
    shadowColor: "#FF4D4D",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  bookCard: {
    width: 180,
    height: 260,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    padding: 12,
    justifyContent: "space-between",
  },
});

