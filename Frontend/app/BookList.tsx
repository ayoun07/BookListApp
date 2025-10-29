import BookForm from "@/components/BookComponent";
import { useFetchBooks } from "@/hooks/useFetchBooks";
import { FlatList, Text, View } from "react-native";

export default function BookList() {
    const { data: books, isLoading, error } = useFetchBooks();
    if (isLoading) {
        return (
            <View>
                <Text>Chargement des livres...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View>
                <Text>Erreur lors du chargement des livres : {error.message}</Text>
            </View>
        )
    }

    return (
        <View>
            <FlatList
                data={books}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <BookForm {...item} />}
            />
        </View>
    )
}