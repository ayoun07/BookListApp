import { Book } from "@/models/BookModel";
import { View, Text, StyleSheet, Image } from "react-native";

type BookDisplay = Omit<Book, "id"|"editor"|"year"|"read"|"favorite"|"rating">;

export default function BookForm({ name, author, cover, theme }: BookDisplay) {
  return (
    <View style={styles.card}>
      <Image
        style={styles.cover}
        source={{ uri: cover }}
        alt="textIMAGEMANQUANTE"
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.author}>Auteur : {author}</Text>
      <Text style={styles.author}>Thème : {theme}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  author: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  cover: {
    height: 50,
    width: 50,
  },
});
