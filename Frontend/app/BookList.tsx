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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookRow}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/BookListById",
                  params: { id: item.id },
                })
              }
            >
              <BookForm title={item.name} author={item.author} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteMutation.mutate(item.id)} // ✅ On passe l’id du livre
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={24} color="#FF4D4D" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
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
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  bookRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    padding: 8,
  },
});
