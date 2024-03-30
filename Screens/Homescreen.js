import React, { useState, useEffect } from "react";
import { View, StatusBar, FlatList, Alert } from "react-native";
import styled from "styled-components/native";
import AddInput from "../Components/AddInput";
import TodoList from "../Components/TodoList";
import Empty from "../Components/Empty";
import Header from "../Components/Header";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const getFonts = () =>
  Font.loadAsync({
    "poppins-regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "poppins-bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

const HomeScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem('tasks');
        if (value !== null) {
          setData(JSON.parse(value));
        }
      } catch (e) {
        console.log("getData failure");
        console.log(e);
      }
    };

    fetchData();
  }, []);

  const storeData = async (key, value) => {
    if (value.length > 500) console.log("storeData key", key, "value(s)", value.substring(0, 50) + "...");
    else console.log("storeData key", key, "value(s)", value);
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
      // saving error 
      console.log("storeData failure");
      console.log(e);
    }
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      console.log('Permission to access location was granted');
    })();
  }, []);

  useEffect(() => {
    getFonts().then(() => {
      setFontsLoaded(true);
    }).catch(error => console.error(error));
  }, []);

  const locate = async (key, data) => {
    console.log('locate called', key, data);
    let location = await Location.getCurrentPositionAsync({});
    // location object has many properties, remove most but retain 3 or 4 more useful ones?
    console.log(key, location, data);
    const locatedTaskList = data.map(todo => {
      // if this task has the same ID as the added task
      if (key === todo.key) {
        console.log(key, todo.key, "matched");
        console.log({ ...todo, location: location });
        return { ...todo, location: location };
      }
      console.log(key, todo.key, "unmatched");
      return todo;
    });
    console.log(locatedTaskList)
    setData(locatedTaskList);

    // 发送位置数据到后端
    sendLocationData(location.coords.latitude, location.coords.longitude);
  }

  const submitHandler = (value) => {
    const key = Math.random().toString();
    const anotherTodo = (prevTodo, key) => {
      return [
        {
          value: value,
          key: key,
        },
        ...prevTodo,
      ];
    };
    setData(anotherTodo);
    locate(key, anotherTodo(data, key));
  };

  const deleteItem = (key) => {
    const stillTodo = (prevTodo) => {
      return prevTodo.filter((todo) => todo.key != key);
    };
    setData(stillTodo);
  };

  const photoAttach = (key, uri) => {
    console.log('photoAttach called', key, uri);
    const photoedTaskList = data.map(todo => {
      if (key === todo.key) {
        console.log(key, todo.key, "matched");
        console.log({ ...todo, photoUri: "photo-" + key });
        return { ...todo, photoUri: "photo-" + key };
      }
      console.log(key, todo.key, "unmatched");
      return todo;
    });
    console.log(photoedTaskList);
    console.log("storeData called with args ", "photo-" + key, uri);
    storeData("photo-" + key, uri);
    setData(photoedTaskList);
  };

  // 发送位置数据到后端
  const sendLocationData = async (latitude, longitude) => {
    try {
      const response = await fetch('http://10.26.12.64:3000/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: latitude,
          longitude: longitude,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send location data to the server');
      }

      console.log('Location data sent successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send location data to the server');
    }
  };

  return (
    <ComponentContainer>
      <View>
        <StatusBar barStyle="light-content" backgroundColor="midnightblue" />
      </View>
      <View>
        <FlatList
          data={data}
          ListHeaderComponent={() => <Header />}
          ListEmptyComponent={() => <Empty />}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TodoList
              item={item}
              deleteItem={deleteItem}
              photoAttach={(key, uri) => photoAttach(key, uri, storeData)}
            />
          )}
        />
        <View>
          <AddInput submitHandler={submitHandler} />
        </View>
      </View>
    </ComponentContainer>
  );
}

const ComponentContainer = styled.View`
  background-color: midnightblue;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default HomeScreen;