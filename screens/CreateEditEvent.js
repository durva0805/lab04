import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { ref, set, update } from 'firebase/database';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function CreateEditEvent({ route, navigation }) {
  const event = route.params?.event;
  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState(event?.date || '');
  const [description, setDescription] = useState(event?.description || '');

  const handleSubmit = () => {
    if (!title || !date || !description) return Alert.alert('Validation', 'All fields are required.');
    
    const id = event?.id || uuidv4();
    const data = {
      title,
      date,
      description,
      createdBy: auth.currentUser.uid,
      isFavourite: event?.isFavourite || false,
    };

    const eventRef = ref(db, `events/${id}`);
    (event ? update(eventRef, data) : set(eventRef, data)).then(() => {
      navigation.goBack();
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event ? "Edit Event" : "Create Event"}</Text>

      <TextInput
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Event Date"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
        numberOfLines={4}
      />
      <Button
        title={event ? "Update Event" : "Create Event"}
        onPress={handleSubmit}
        color="#4a90e2"
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#2980b9',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
  },
});
