import BookForm from "@/components/BookComponent";
import { useFetchBooks } from "@/hooks/useFetchBooks";
import { useDeleteBook } from "@/hooks/useDeleteBook";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useUpdateFavorite } from "@/hooks/useUpdateFavorites";
import { useRatings } from "@/contexts/RatingsContext";
import { useFetchNoteById } from "@/hooks/Notes/useFetchNoteById";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

function NotesMeta({ bookId }: { bookId: number }) {
  const { data: notes, isLoading, error } = useFetchNoteById(bookId);
  const count = Array.isArray(notes) ? notes.length : 0;
  if (isLoading) return <Text style={styles.notesText}>…</Text>;
  if (error) return <Text style={styles.notesText}>0 note</Text>;
  return (
    <Text style={styles.notesText}>
      {count} {count > 1 ? "notes" : "note"}
    </Text>
  );
}

const normalize = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

type SortKey = "title" | "author" | "theme";

const labelForSort: Record<SortKey, string> = {
  title: "Titre",
  author: "Auteur",
  theme: "Thème",
};

function sortBooks(list: any[], sortKey: SortKey) {
  const copy = list.slice();
  const getField = (b: any) =>
    sortKey === "title" ? b.name : sortKey === "author" ? b.author : b.theme;

  copy.sort((a, b) => {
    const A = normalize(getField(a) || "");
    const B = normalize(getField(b) || "");
    return A.localeCompare(B);
  });
  return copy;
}

type SortMenuProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (k: SortKey) => void;
};
function SortMenu({ visible, onClose, onSelect }: SortMenuProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.menuBackdrop} onPress={onClose} />
      <View style={styles.menuPanel}>
        <Text style={styles.menuTitle}>Trier par</Text>
        <Pressable
          style={styles.menuItem}
          onPress={() => {
            onSelect("title");
            onClose();
          }}
        >
          <Ionicons name="book-outline" size={16} color={PALETTE.text} />
          <Text style={styles.menuItemText}>Titre</Text>
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => {
            onSelect("author");
            onClose();
          }}
        >
          <Ionicons name="person-outline" size={16} color={PALETTE.text} />
          <Text style={styles.menuItemText}>Auteur</Text>
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => {
            onSelect("theme");
            onClose();
          }}
        >
          <Ionicons name="pricetag-outline" size={16} color={PALETTE.text} />
          <Text style={styles.menuItemText}>Thème</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function Check({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.checkPill, checked && styles.checkPillOn]}
      activeOpacity={0.8}
    >
      <Ionicons
        name={checked ? "checkbox-outline" : "square-outline"}
        size={16}
        color={checked ? PALETTE.primary : "#6B7280"}
      />
      <Text style={[styles.checkText, checked && { color: PALETTE.primary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

type HeaderProps = {
  query: string;
  setQuery: (v: string) => void;
  favoriteBooks: any[];
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
  getDisplayRating: (b: any) => number;
  sortKey: SortKey;
  onOpenSort: () => void;
  showRead: boolean;
  showUnread: boolean;
  showFavOnly: boolean;
  toggleRead: () => void;
  toggleUnread: () => void;
  toggleFavOnly: () => void;
};

const Header = React.memo(function Header({
  query,
  setQuery,
  favoriteBooks,
  isFavorite,
  onToggleFavorite,
  onDelete,
  getDisplayRating,
  sortKey,
  onOpenSort,
  showRead,
  showUnread,
  showFavOnly,
  toggleRead,
  toggleUnread,
  toggleFavOnly,
}: HeaderProps) {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.topBar}>
        <View style={[styles.searchBar, { flex: 1 }]}>
          <Ionicons name="search-outline" size={18} color="#6B7280" />
          <TextInput
            placeholder="Rechercher par titre ou auteur"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCorrect={false}
            autoCapitalize="none"
            blurOnSubmit={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              style={styles.clearBtn}
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={onOpenSort}
          hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={PALETTE.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
        <Check label="Lus" checked={showRead} onPress={toggleRead} />
        <Check label="Non lus" checked={showUnread} onPress={toggleUnread} />
        <Check label="Favoris" checked={showFavOnly} onPress={toggleFavOnly} />
      </View>

      <View style={styles.sortChip}>
        <Ionicons name="funnel-outline" size={14} color={PALETTE.textMuted} />
        <Text style={styles.sortChipText}>Tri : {labelForSort[sortKey]}</Text>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/BookCreate")}
        activeOpacity={0.9}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.createButtonText}>Créer un nouveau livre</Text>
      </TouchableOpacity>

      {favoriteBooks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Favoris</Text>
          <FlatList
            data={favoriteBooks}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
            ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const fav = isFavorite(item.id);
              const rating = getDisplayRating(item);
              return (
                <View style={styles.carouselCard}>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => onToggleFavorite(item.id)}
                  >
                    <Ionicons
                      name={fav ? "heart" : "heart-outline"}
                      size={22}
                      color={fav ? "#FF4D4D" : "#888"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({
                        pathname: "/BookListById",
                        params: { id: item.id },
                      })
                    }
                  >
                    <BookForm
                      name={item.name}
                      author={item.author}
                      cover={item.cover}
                      theme={item.theme}
                    />
                  </TouchableOpacity>

                  <View style={styles.metaRow}>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text style={styles.ratingText}>
                        {Number(rating) || 0}
                      </Text>
                    </View>
                    <Text style={styles.dot}>·</Text>
                    <NotesMeta bookId={item.id} />
                  </View>

                  <TouchableOpacity
                    onPress={() => onDelete(item.id)}
                    style={styles.deleteFab}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash-outline" size={18} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </>
      )}

      <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
        Tous les livres
      </Text>
    </View>
  );
});

export default function BookList() {
  const { data: books, isLoading, error } = useFetchBooks();
  const deleteMutation = useDeleteBook();
  const { toggleFavorite, isFavorite } = useFavorites();
  const updateFavoriteMutation = useUpdateFavorite();
  const { getRating } = useRatings?.() ?? { getRating: undefined };

  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("title");
  const [menuOpen, setMenuOpen] = React.useState(false);

  const [showRead, setShowRead] = React.useState(true);
  const [showUnread, setShowUnread] = React.useState(true);
  const [showFavOnly, setShowFavOnly] = React.useState(false);

  const toggleRead = React.useCallback(() => setShowRead((v) => !v), []);
  const toggleUnread = React.useCallback(() => setShowUnread((v) => !v), []);
  const toggleFavOnly = React.useCallback(() => setShowFavOnly((v) => !v), []);

  const handleToggleFavorite = React.useCallback(
    (bookId: number) => {
      const currentState = isFavorite(bookId);
      const newFavoriteState = !currentState;
      toggleFavorite(bookId);
      updateFavoriteMutation.mutate({ bookId, favorite: newFavoriteState });
    },
    [isFavorite, toggleFavorite, updateFavoriteMutation]
  );

  const handleDelete = React.useCallback(
    (id: number) => deleteMutation.mutate(id),
    [deleteMutation]
  );

  const getDisplayRating = React.useCallback(
    (book: any) =>
      (getRating ? getRating(book.id) : undefined) ?? book.rating ?? 0,
    [getRating]
  );

  const filteredByQuery = React.useMemo(() => {
    const q = normalize(query);
    if (!books) return [];
    if (!q) return books;
    return books.filter((b: any) => {
      const name = normalize(b.name);
      const author = normalize(b.author);
      return name.includes(q) || author.includes(q);
    });
  }, [books, query]);

  const filteredByFlags = React.useMemo(() => {
    return filteredByQuery.filter((b: any) => {
      const passesRead =
        (b.read && showRead) ||
        (!b.read && showUnread) ||
        (!showRead && !showUnread);

      const passesFav = showFavOnly ? isFavorite(b.id) : true;

      return passesRead && passesFav;
    });
  }, [filteredByQuery, showRead, showUnread, showFavOnly, isFavorite]);

  const sortedBooks = React.useMemo(
    () => sortBooks(filteredByFlags, sortKey),
    [filteredByFlags, sortKey]
  );

  const favoriteBooks = React.useMemo(
    () => sortedBooks.filter((b) => isFavorite(b.id)),
    [sortedBooks, isFavorite]
  );
  const otherBooks = React.useMemo(
    () => sortedBooks.filter((b) => !isFavorite(b.id)),
    [sortedBooks, isFavorite]
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Chargement des livres...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erreur : {error?.message}</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={otherBooks}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContainer}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <Header
            query={query}
            setQuery={setQuery}
            favoriteBooks={favoriteBooks}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            getDisplayRating={getDisplayRating}
            sortKey={sortKey}
            onOpenSort={() => setMenuOpen(true)}
            showRead={showRead}
            showUnread={showUnread}
            showFavOnly={showFavOnly}
            toggleRead={toggleRead}
            toggleUnread={toggleUnread}
            toggleFavOnly={toggleFavOnly}
          />
        }
        ListEmptyComponent={
          favoriteBooks.length === 0 && otherBooks.length === 0 ? (
            <View style={{ paddingVertical: 32, alignItems: "center" }}>
              <Text style={{ color: PALETTE.textMuted }}>
                Aucun résultat avec ces filtres
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const fav = isFavorite(item.id);
          const rating = getDisplayRating(item);

          return (
            <View style={styles.gridCard}>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => handleToggleFavorite(item.id)}
              >
                <Ionicons
                  name={fav ? "heart" : "heart-outline"}
                  size={20}
                  color={fav ? "#FF4D4D" : "#888"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/BookListById",
                    params: { id: item.id },
                  })
                }
              >
                <BookForm
                  name={item.name}
                  author={item.author}
                  cover={item.cover}
                  theme={item.theme}
                />
              </TouchableOpacity>

              <View style={styles.metaRow}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.ratingText}>{Number(rating) || 0}</Text>
                </View>
                <Text style={styles.dot}>·</Text>
                <NotesMeta bookId={item.id} />
              </View>

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteFab}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={18} color="#DC2626" />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <SortMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={(k) => setSortKey(k)}
      />
    </>
  );
}

const { width } = Dimensions.get("window");
const GRID_GAP = 14;
const GRID_CARD_WIDTH = Math.floor((width - 24 * 2 - GRID_GAP) / 2);

const PALETTE = {
  bg: "#F9FAFB",
  card: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
  primary: "#2563EB",
  danger: "#DC2626",
  border: "#E5E7EB",
  shadow: "rgba(17, 24, 39, 0.12)",
};

const ELEVATION = {
  shadowColor: PALETTE.shadow,
  shadowOpacity: 0.8,
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 16,
  elevation: 5,
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PALETTE.bg,
  },
  loadingText: {
    marginTop: 10,
    color: PALETTE.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: { color: PALETTE.danger, fontWeight: "600", fontSize: 16 },

  headerWrapper: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: PALETTE.bg,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: PALETTE.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    ...ELEVATION,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: PALETTE.text },
  clearBtn: { paddingLeft: 8, paddingVertical: 6 },

  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  checkPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingVertical: Platform.select({ ios: 6, android: 4, default: 6 }),
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  checkPillOn: {
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
  },
  checkText: { fontSize: 12, color: "#6B7280", fontWeight: "600" },

  sortChip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: Platform.select({ ios: 6, android: 4, default: 6 }),
    borderRadius: 999,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sortChipText: { fontSize: 12, color: PALETTE.textMuted, fontWeight: "600" },

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PALETTE.primary,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: PALETTE.primary,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 15,
    letterSpacing: 0.3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: PALETTE.text,
    marginBottom: 10,
  },

  carouselContainer: { paddingRight: 16, paddingBottom: 6 },
  carouselCard: {
    width: 180,
    minHeight: 260,
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: PALETTE.border,
    ...ELEVATION,
  },

  gridContainer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    backgroundColor: PALETTE.bg,
  },
  gridRow: { justifyContent: "space-between", marginBottom: GRID_GAP },
  gridCard: {
    width: GRID_CARD_WIDTH,
    minHeight: 240,
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: PALETTE.border,
    ...ELEVATION,
  },

  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: "#FFFFFFEE",
    padding: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  deleteFab: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#FEE2E2",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: PALETTE.border,
    gap: 6,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  ratingText: { fontSize: 12, fontWeight: "700", color: "#9A3412" },
  dot: { color: "#9CA3AF", marginHorizontal: 2 },
  notesText: { fontSize: 12, color: "#6B7280" },

  menuBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  menuPanel: {
    position: "absolute",
    top: 80,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    width: 200,
    ...ELEVATION,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  menuTitle: {
    fontSize: 12,
    color: PALETTE.textMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuItemText: { fontSize: 14, color: PALETTE.text },
});
