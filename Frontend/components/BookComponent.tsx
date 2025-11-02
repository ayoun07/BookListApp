import { Book } from "@/models/BookModel";
import { View, Text, StyleSheet, Image } from "react-native";

type BookDisplay = Omit<
  Book,
  "id" | "editor" | "year" | "read" | "favorite" | "rating"
>;

export default function BookForm({ name, author, cover, theme }: BookDisplay) {
  return (
    <View style={styles.card}>
      <View style={styles.coverWrap}>
        <Image
          style={styles.cover}
          source={{ uri: cover }}
          alt="Couverture indisponible"
        />
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>

      <Text style={styles.author} numberOfLines={1}>
        Auteur : <Text style={styles.authorStrong}>{author}</Text>
      </Text>

      <View style={styles.themePill}>
        <Text style={styles.themeText} numberOfLines={1}>
          {theme}
        </Text>
      </View>
    </View>
  );
}

const PALETTE = {
  card: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  chipBg: "#F3F4F6",
  chipText: "#374151",
  shadow: "rgba(17, 24, 39, 0.12)",
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: PALETTE.border,
    shadowColor: PALETTE.shadow,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 5,
  },

  // Enveloppe pour forcer un ratio 2:3 et arrondir proprement
  coverWrap: {
    width: "100%",
    aspectRatio: 2 / 3, // ratio “livre”
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F8FAFC", // léger fond pour le fade-in
    marginBottom: 10,
  },
  cover: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: PALETTE.text,
    marginTop: 2,
  },
  author: {
    fontSize: 13,
    color: PALETTE.textMuted,
    marginTop: 6,
  },
  authorStrong: {
    color: PALETTE.text,
    fontWeight: "600",
  },

  themePill: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: PALETTE.chipBg,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  themeText: {
    fontSize: 12,
    color: PALETTE.chipText,
    fontWeight: "600",
  },
});
