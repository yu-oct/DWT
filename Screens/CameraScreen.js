import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function CameraScreen({ route }) {
  const { photoAttach, item } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photoFileUri, setPhotoFileUri] = useState("");
  const navigation = useNavigation();
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    console.log("photoFileUri:", photoFileUri);
  }, [photoFileUri]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFlip = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        let photo = await cameraRef.current.takePictureAsync();
        console.log("Photo taken:", photo.uri);
        setPhotoFileUri(photo.uri);
        photoAttach(item.key, photo.uri);
      } catch (error) {
        console.log('Error taking picture:', error);
      }
    } else {
      console.log('Camera ref is null.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {!photoFileUri ?
          <Camera style={styles.camera} type={type} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleFlip}>
                <Text style={styles.text}> Flip </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleTakePicture}>
                <Text style={styles.text}>Photo</Text>
              </TouchableOpacity>
            </View>
          </Camera>
          :
          <View style={styles.imageContainer}>
            <Image source={{ uri: photoFileUri }} style={styles.image} />
          </View>
        }
      </View>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 20,
  },
  camera: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  text: {
    fontSize: 12,
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backText: {
    color: '#fff',
  },
});