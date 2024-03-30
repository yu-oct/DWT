import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ImageScreen({ route }) {
  const { item } = route.params;
  const [retrievedPhotoUri, setRetrievedPhotoUri] = useState("");

  const getImage = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setRetrievedPhotoUri(JSON.parse(value));
      }
    } catch (error) {
      console.log("Error retrieving image:", error);
    }
  };

  useEffect(() => {
    if (item && item.photoUri) {
      getImage(item.photoUri);
    }
  }, [item]);

  return (
    <View style={styles.container}>
      {retrievedPhotoUri ? (
        <Image source={{ uri: retrievedPhotoUri }} style={styles.image} />
      ) : (
        <Text style={styles.noImageText}>No image</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
  noImageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
  },
});
