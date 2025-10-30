import { View, Text, StyleSheet } from "react-native";

interface BookProps {
  title: string;
  author: string;
}

export default function BookForm({ title, author }: BookProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>Auteur : {author}</Text>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  author: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});
