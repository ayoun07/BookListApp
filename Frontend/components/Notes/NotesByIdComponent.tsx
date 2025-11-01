import { Note } from "@/models/NoteModel";
import { Text, View, StyleSheet } from "react-native";

type NoteDisplay = Omit<Note, "bookId">;

export default function NotesById({ content, dateISO }: NoteDisplay) {
  const date = new Date(dateISO).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.card}>
      <Text style={styles.date}>{date}</Text>
          <Text style={styles.content}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
    textAlign: "right",
  },
  content: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
});
