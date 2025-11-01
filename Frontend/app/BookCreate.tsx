import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import useFetchBookCreate from "@/hooks/useFetchBookCreate";

export default function BookFormCreate() {
  const { mutate: createBook, error, data } = useFetchBookCreate();

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [editor, setEditor] = useState("");
  const [year, setYear] = useState("");
  const [read, setRead] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [rating, setRating] = useState("");
  const [cover, setCover] = useState("");
  const [theme, setTheme] = useState("");

  const handleSubmit = () => {
    if (!name || !author || !editor || !year) {
      alert("Les 4 champs obligatoires (*) doivent être remplis.");
      return;
    }

    createBook({
      name,
      author,
      editor,
      year: Number(year),
      read,
      favorite,
      rating: rating ? Number(rating) : undefined,
      cover: cover || undefined,
      theme: theme || undefined,
    });
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erreur : {error?.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nom du livre *:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Titre"
      />

      <Text style={styles.label}>Auteur *:</Text>
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
        placeholder="Auteur"
      />

      <Text style={styles.label}>Éditeur *:</Text>
      <TextInput
        style={styles.input}
        value={editor}
        onChangeText={setEditor}
        placeholder="Éditeur"
      />

      <Text style={styles.label}>Année *:</Text>
      <TextInput
        style={styles.input}
        value={year}
        onChangeText={setYear}
        placeholder="Année de publication"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Lu :</Text>
      <TextInput
        style={styles.input}
        value={read ? "Oui" : "Non"}
        onChangeText={(v) => setRead(v === "Oui")}
      />

      <Text style={styles.label}>Favori :</Text>
      <TextInput
        style={styles.input}
        value={favorite ? "Oui" : "Non"}
        onChangeText={(v) => setFavorite(v === "Oui")}
      />

      <Text style={styles.label}>Note :</Text>
      <TextInput
        style={styles.input}
        value={rating}
        onChangeText={setRating}
        placeholder="Note sur 5"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Couverture :</Text>
      <TextInput
        style={styles.input}
        value={cover}
        onChangeText={setCover}
        placeholder="URL de la couverture"
      />

      <Text style={styles.label}>Thème :</Text>
      <TextInput
        style={styles.input}
        value={theme}
        onChangeText={setTheme}
        placeholder="Thème"
      />

      <View style={styles.buttonContainer}>
        <Button title="Créer le livre" onPress={handleSubmit} color="#2563EB" />
      </View>

      {data && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            Livre créé avec succès : {data.name}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    marginTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
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
  successContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#d4edda",
    borderRadius: 8,
  },
  successText: {
    color: "#155724",
    fontWeight: "bold",
  },
});
