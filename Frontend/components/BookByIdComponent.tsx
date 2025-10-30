import { useRouter } from "expo-router";
import { Button, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import des icônes Expo

interface BookProps {
  title: string;
  author: string;
  editor: string;
  year: number;
  read: boolean;
  favorite: boolean;
  rating: number;
  cover: string;
  theme: string;
}

export default function BookFormById({
  title,
  author,
  editor,
  year,
  read,
  favorite,
  rating,
  cover,
  theme,
}: BookProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

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
        <Button title="⬅️ Retour à la liste" onPress={() => router.back()} />
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
  title: {
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
});
