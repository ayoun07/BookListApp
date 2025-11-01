import { Book } from "@/models/BookModel";
import { View, Text, StyleSheet } from "react-native";

export default function BookUpdateComponent({
    name,
    author,
    editor,
    year,
    read,
    favorite,
    rating,
    cover,
    theme,
}: Book) {
    return (
      <View style={styles.card}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtitle}>Auteur : {author}</Text>
        <Text style={styles.text}>Éditeur : {editor}</Text>
        <Text style={styles.text}>Année : {year ?? "Inconnue"}</Text>
        <Text style={styles.text}>
          Lecture : {read ? "Lu" : "Non lu"}
        </Text>
        <Text style={styles.text}>
          Favori : {favorite ? "Oui" : "Non"}
        </Text>
        <Text style={styles.text}>
          Note : {rating ? `${rating}/5` : "Aucune note"}
        </Text>
        <Text style={styles.text}>Thème : {theme}</Text>
      </View>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
});
