import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import useUpdateBook from "@/hooks/useUpdateBook";
import { useFetchBookById } from "@/hooks/useFetchBookById";

export default function BookFormUpdate() {
  const { id } = useLocalSearchParams();
  const { data: book, isLoading, error } = useFetchBookById(Number(id));

  const updateMutation = useUpdateBook();

  const [formData, setFormData] = useState({
    name: "",
    author: "",
    editor: "",
    year: "",
    read: false,
    favorite: false,
    rating: "",
    cover: "",
    theme: "",
  });

  useEffect(() => {
    if (book) {
      setFormData({
        name: book.name,
        author: book.author,
        editor: book.editor,
        year: String(book.year),
        read: book.read,
        favorite: book.favorite,
        rating: String(book.rating),
        cover: book.cover,
        theme: book.theme,
      });
    }
  }, [book]);

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.author) {
      Alert.alert("Erreur", "Le nom et l'auteur sont obligatoires.");
      return;
    }

    updateMutation.mutate(
      {
        id: Number(id),
        newBook: {
          ...formData,
          year: Number(formData.year),
          rating: Number(formData.rating),
        },
      },
      {
        onSuccess: () => {
          Alert.alert("Succès", "Le livre a été mis à jour !");
          router.back();
        },
        onError: () => {
          Alert.alert("Erreur", "Impossible de mettre à jour le livre.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Erreur : {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier le livre</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Auteur"
        value={formData.author}
        onChangeText={(text) => handleChange("author", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Éditeur"
        value={formData.editor}
        onChangeText={(text) => handleChange("editor", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Année"
        keyboardType="numeric"
        value={formData.year}
        onChangeText={(text) => handleChange("year", text)}
      />

      <View style={styles.switchRow}>
        <Text>Lu :</Text>
        <Switch
          value={formData.read}
          onValueChange={(val) => handleChange("read", val)}
        />
      </View>

      <View style={styles.switchRow}>
        <Text>Favori :</Text>
        <Switch
          value={formData.favorite}
          onValueChange={(val) => handleChange("favorite", val)}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Note /5"
        keyboardType="numeric"
        value={formData.rating}
        onChangeText={(text) => handleChange("rating", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Lien de couverture (URL)"
        value={formData.cover}
        onChangeText={(text) => handleChange("cover", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Thème"
        value={formData.theme}
        onChangeText={(text) => handleChange("theme", text)}
      />

      <Button title="💾 Enregistrer" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
