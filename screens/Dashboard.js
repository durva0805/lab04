import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';
import { ref, onValue, remove, update } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventsRef = ref(db, 'events/');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setEvents(parsed.filter((ev) => ev.createdBy === auth.currentUser.uid));
      } else {
        setEvents([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const confirmDelete = (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete this event?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => remove(ref(db, `events/${id}`)) },
    ]);
  };

  const toggleFavorite = (event) => {
    update(ref(db, `events/${event.id}`), {
      isFavourite: !event.isFavourite,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
      <Text style={styles.eventDesc}>{item.description}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate('CreateEditEvent', { event: item })}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: '#e74c3c' }]}
          onPress={() => confirmDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.smallButton,
            {
              backgroundColor: item.isFavourite ? '#f39c12' : '#95a5a6',
            },
          ]}
          onPress={() => toggleFavorite(item)}>
          <Ionicons
            name={item.isFavourite ? 'heart' : 'heart-outline'}
            size={20}
            color="#fff"
          />
          <Text style={styles.buttonText}>
            {item.isFavourite ? 'Unfavourite' : 'Favourite'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolbarButton} onPress={() => signOut(auth).then(() => navigation.replace('SignIn'))}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.toolbarText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarButton} onPress={() => navigation.navigate('CreateEditEvent')}>
          <Ionicons name="add-circle-outline" size={18} color="#fff" />
          <Text style={styles.toolbarText}>Create Event</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarButton} onPress={() => navigation.navigate('FavouriteEvents')}>
          <Ionicons name="heart-outline" size={18} color="#fff" />
          <Text style={styles.toolbarText}>Favourites</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc', marginTop:50 },

  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  toolbarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
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

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },

  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#4a90e2',
    flexGrow: 1,
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
