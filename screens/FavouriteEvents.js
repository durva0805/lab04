import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { db, auth } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

export default function FavouriteEvents({ navigation }) {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const eventsRef = ref(db, 'events/');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const favs = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .filter((ev) => ev.createdBy === auth.currentUser.uid && ev.isFavourite);
        setFavourites(favs);
      } else {
        setFavourites([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const removeFavourite = (event) => {
    Alert.alert('Remove', 'Remove from favourites?', [
      { text: 'Cancel' },
      {
        text: 'Remove',
        onPress: () =>
          update(ref(db, `events/${event.id}`), { isFavourite: false }),
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
      <Text style={styles.eventDesc}>{item.description}</Text>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFavourite(item)}>
        <Ionicons name="heart-dislike-outline" size={18} color="#fff" />
        <Text style={styles.removeText}>Remove from Favourites</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {favourites.length === 0 ? (
        <Text style={styles.noFavText}>No favourite events found.</Text>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#2c3e50',
  },
  eventDate: {
    color: '#888',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  eventDesc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  removeButton: {
    flexDirection: 'row',
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  removeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  noFavText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
  },
});
