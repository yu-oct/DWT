import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import CameraScreen from '../Screens/CameraScreen';

export default function TodoList({ item, deleteItem, photoAttach }) {
  const navigation = useNavigation();

  const handleCameraPress = () => {
    navigation.navigate('CameraScreen', { photoAttach, item });
  };

  const handleImagePress = () => {
    navigation.navigate('ImageScreen', { item });
  };
  const handleDetailPress = () => {
    navigation.navigate('DetailScreen', { item });
  };

  return (
    <ComponentContainer>
      <ListContainer>
        <View>
          <TextItem>
            {item.value}
            {item.location ? (
              <Text>
                {'\n'}
                {item.location.coords.latitude.toFixed(3)},&nbsp;
                {item.location.coords.longitude.toFixed(3)}
              </Text>
            ) : (
              <Text>{'\n'}Not located</Text>
            )}
          </TextItem>
          <TextDate> Task</TextDate>
        </View>
        <IconContainer>
          <MaterialIcons
            name="edit"
            size={24}
            color="midnightblue"
            onPress={handleDetailPress}
          />
          <MaterialIcons
            name="photo"
            size={24}
            color="midnightblue"
            onPress={handleImagePress}
          />
          <MaterialIcons
            name="photo-camera"
            size={24}
            color="midnightblue"
            onPress={handleCameraPress}
          />
          <MaterialIcons
            name="delete"
            size={24}
            color="red"
            onPress={() => deleteItem(item.key)}
          />
        </IconContainer>
      </ListContainer>
    </ComponentContainer>
  );
}

const ListContainer = styled.TouchableOpacity`
  background-color: whitesmoke;
  height: 80px;
  width: 370px;
  margin-bottom: 30px;
  border-radius: 10px;
  flex-direction: row;
  justify-content: space-between;
`;

const ComponentContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  height: auto;
  width: auto;
`;

const TextItem = styled.Text`
  color: black;
  width: 300px;
  height: auto;
  font-size: 20px;
  margin-top: 10px;
  margin-right: 20px;
  margin-left:20px;
  font-family: poppins-regular;
`;

const TextDate = styled.Text`
  color: goldenrod;
  font-size: 15px;
  margin-right: 20px;
  font-family: poppins-regular;
  border-radius: 10px;
  width: 40px;
`;

const IconContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  margin-left: -40px;
  margin-top: 15px;
  height: 40px;
  border-radius: 10px;
`;

