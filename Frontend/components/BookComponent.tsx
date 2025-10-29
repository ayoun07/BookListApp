import { Book } from "@/models/BookModel";
import { Text, View } from "react-native";

export default function BookForm({name}: Book) {
    return (
        <View>
            <Text>Nom : {name}</Text>
        </View>
    )
}