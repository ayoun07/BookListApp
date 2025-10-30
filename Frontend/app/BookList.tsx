import BookForm from "@/components/BookComponent";
import { useFetchBooks } from "@/hooks/useFetchBooks";
import { router } from "expo-router";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function BookList() {
  const { data: books, isLoading, error } = useFetchBooks();

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
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.navigate({
                pathname: "/BookListById",
                params: { id: item.id },
              })
            }
          >
            <BookForm title={item.name} author={item.author} />
          </TouchableOpacity>
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
});
