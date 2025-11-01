import { useRouter } from "expo-router";
import { Button, Text, View, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { Book } from "@/models/BookModel";

type BookDisplay = Omit<Book, "id">;

export default function BookFormById({
  name,
  author,
  editor,
  year,
  read,
  favorite,
  rating,
  cover,
  theme,
}: BookDisplay) {
  const router = useRouter();

  return (
    <View style={styles.container}>
            <Image
              style={styles.cover}
              source={{ uri: cover }}
              alt="textIMAGEMANQUANTE"
            />

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.text}>Auteur : {author}</Text>
      <Text style={styles.text}>Éditeur : {editor}</Text>
      <Text style={styles.text}>Année : {year}</Text>

      <View style={styles.iconRow}>
        <Ionicons
          name={read ? "book-outline" : "book"}
          size={20}
          color={read ? "#16a34a" : "#dc2626"}
        />
        <Text style={styles.text}>{read ? "Déjà lu" : "À lire"}</Text>
      </View>

      <View style={styles.iconRow}>
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={20}
          color={favorite ? "#ef4444" : "#9ca3af"}
        />
        <Text style={styles.text}>{favorite ? "Favori" : "Non favori"}</Text>
      </View>

      <View style={styles.iconRow}>
        <Ionicons name="star" size={20} color="#facc15" />
        <Text style={styles.text}>Note : {rating} / 5</Text>
      </View>

      <Text style={styles.text}>Thème : {theme}</Text>
      <Text style={styles.text}>Couverture : {cover}</Text>

      <View style={styles.buttonContainer}>
        <Button title="⬅️ Retour à la liste" onPress={() => router.push("/BookList")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 12,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  buttonContainer: {
    marginTop: 20,
  },
  cover: {
    height: 50,
    width: 50,
  },
});
