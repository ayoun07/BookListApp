import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useCreateNote } from "@/hooks/Notes/useCreateNote";
import { Note } from "@/models/NoteModel";


export default function NoteCreateComponent({ bookId }: Note) {
  const [content, setContent] = useState("");
  const createNoteMutation = useCreateNote(bookId);

  const handleAddNote = () => {
    if (!content.trim()) return; 

    createNoteMutation.mutate({
      content,
      dateISO: new Date().toISOString(),
    });

    setContent(""); 
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Écris une note..."
        value={content}
        onChangeText={setContent}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleAddNote}>
        <Text style={styles.buttonText}>Ajouter une note</Text>
      </TouchableOpacity>

      {createNoteMutation.isPending && (
        <Text style={styles.status}>Ajout en cours...</Text>
      )}
      {createNoteMutation.isError && (
        <Text style={styles.error}>
          Erreur : {String(createNoteMutation.error)}
        </Text>
      )}
      {createNoteMutation.isSuccess && (
        <Text style={styles.success}>Note ajoutée !</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  status: {
    marginTop: 8,
    color: "#555",
  },
  success: {
    marginTop: 8,
    color: "green",
  },
  error: {
    marginTop: 8,
    color: "red",
  },
});
