import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Button,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
//Navigation
import { NativeStackScreenProps } from "@react-navigation/native-stack";
//Storage
import { Alert } from "react-native";
import { loadNotes, saveNotes, Note } from "../storage";

type Props = NativeStackScreenProps<any>;

export default function HomeScreen({ navigation }: Props) {
  // For loading data
  const loadData = async () => {
    const storedNotes = await loadNotes();
    setNotes(storedNotes);
  };

  //When Long press action a menu
  const onLongPress = (note: Note) => {
    Alert.alert(
      note.title || "Note",
      "Choose an action",
      [
        {
          text: "Edit",
          onPress: () => edit_page(note.id),
        },
        {
          text: "Delete",
          onPress: async () => {
            const notes = await loadNotes();
            const updatedNotes = notes.filter((n) => n.id !== note.id);
            await saveNotes(updatedNotes);
            loadData(); // recarga la lista
          },
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const [notes, setNotes] = useState<Note[]>([]);

  // goes to edit page with id or without it
  const edit_page = (id?: string) =>
    navigation.navigate("Edit", id ? { id } : undefined);

  //Loads the notes from AsyncStorage
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadData);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity onPress={() => edit_page(item.id)} onLongPress={() => onLongPress(item)}>
      <View style={styles.box}>
        <Text style={styles.boxText}>{item.title}</Text>
        <Text style={styles.boxDate}>
          {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Grid content */}
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />

      {/* Floating Button */}
      <TouchableOpacity style={styles.fab} onPress={() => edit_page()}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get("window").width;
const boxSpacing = 16; // padding between boxes
const columns = 2;
const totalSpacing = boxSpacing * (columns + 1); // spaces between and at edges
const boxWidth = (screenWidth - totalSpacing) / columns;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#dcdcdc",
    alignItems: "center",
    justifyContent: "center",
  },
  contentText: {
    color: "black",
  },

  grid: {
    padding: boxSpacing / 2,
    paddingBottom: 100, // extra space for floating button
  },
  box: {
    backgroundColor: "#7c7c7c",
    width: boxWidth,
    height: boxWidth, // square box
    margin: boxSpacing / 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    color: "#fff",
    fontWeight: "bold",
  },
  boxDate: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 4,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#76ABAE",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
});
