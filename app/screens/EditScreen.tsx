import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { loadNotes, saveNotes, Note } from "../storage";
import uuid from "react-native-uuid";

type Props = NativeStackScreenProps<any>;

export default function EditScreen({ route, navigation }: Props) {
  const noteId = route.params?.id;
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [existingNote, setExistingNote] = useState<Note | null>(null);

  useEffect(() => {
    const load = async () => {
      const notes = await loadNotes();
      if (noteId) {
        const found = notes.find((n) => n.id === noteId);
        if (found) {
          setExistingNote(found);
          setTitle(found.title);
          setText(found.text);
        }
      }
    };
    load();
  }, []);

  // Saves the note
  const handleSave = async () => {
    console.log("Saving...");

    try {
      const now = Date.now();

      const newNote: Note = {
        id: existingNote?.id || uuid.v4().toString(),
        title: title || "Untitled",
        text: text || "",
        createdAt: existingNote?.createdAt || now,
        updatedAt: now,
      };

      const notes = await loadNotes();

      const updatedNotes = existingNote
        ? notes.map((n) => (n.id === newNote.id ? newNote : n))
        : [newNote, ...notes];

      await saveNotes(updatedNotes);

      console.log("Saved note:", newNote);
      navigation.goBack();
    } catch (error) {
      console.error("Error in handleSave:", error);
      Alert.alert("Error", "Something went wrong while saving the note.");
    }
  };

  // Deletes the note
  const handleDelete = async () => {
    if (!existingNote) return;

    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const notes = await loadNotes();
          const updatedNotes = notes.filter((n) => n.id !== existingNote.id);
          await saveNotes(updatedNotes);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={styles.textarea}
        value={text}
        onChangeText={setText}
        placeholder="Write your note..."
        multiline
      />

      <Button color={"#76ABAE"} title="Save" onPress={handleSave} />
      {existingNote && (
        <View style={{ marginTop: 20 }}>
          <Button title="Delete" onPress={handleDelete} color="#ab5757" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#dcdcdc",
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  textarea: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    height: 200,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  saveButton: {
    color: "#76ABAE",
  },
});
