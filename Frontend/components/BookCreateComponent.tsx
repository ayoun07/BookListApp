import { Text, View, StyleSheet } from "react-native";

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

export default function BookCreateComponent({
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
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Auteur : {author}</Text>
      <Text style={styles.text}>Éditeur : {editor}</Text>
      <Text style={styles.text}>Année : {year}</Text>
      <Text style={styles.text}>Lecture : {read ? "✅ Lu" : "❌ Non lu"}</Text>
      <Text style={styles.text}>Favori : {favorite ? "⭐ Oui" : "✖ Non"}</Text>
      <Text style={styles.text}>Note : {rating}/5</Text>
      <Text style={styles.text}>Couverture : {cover}</Text>
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
  title: {
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
