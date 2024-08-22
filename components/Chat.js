import { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';
import { Audio } from "expo-av";



const Chat = ({ db, route, navigation, isConnected, storage }) => {
  const [messages, setMessages] = useState([]);

  // Get the name, background color and user ID from the route
  const { name, backgroundColor, userID } = route.params;

  let unsubscribe;
  let soundObject

  useEffect(() => {
    // Set the title and header style
    navigation.setOptions({
      title: name,
      headerStyle: {
        backgroundColor: backgroundColor
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    });

    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubscribe) unsubscribe();
      unsubscribe = null;

      // Fetch messages from Firestore
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map((docs) => {
          const firebaseData = docs.data();
          const data = {
            _id: docs.id,
            text: "",
            createdAt: new Date(),
            ...firebaseData
          };
          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.name
            };
          }
          return data;
        });
        // Store the messages in AsyncStorage
        storeData(messages);
        setMessages(messages);
      });
    } else loadCachedLists();

    // Unsubscribe from the snapshot when no longer in use "Clean up"
    return () => {
      if (unsubscribe) unsubscribe();
      if (soundObject) soundObject.unloadAsync();
    }
  }, [isConnected]);


  // Store the messages in AsyncStorage
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(value));
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  };

  // Load cached lists
  const loadCachedLists = async () => {
    const cachedLists = await AsyncStorage.getItem("messages_list") || [];
    setLists(JSON.parse(cachedLists));
  }

  // Send a message 
  const onSend = useCallback((messages = []) => {
    addDoc(collection(db, "messages"), messages[0]);
  }, []);

  // Render the chat bubble setting the background color based on the user
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  // Render the input toolbar
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  }

  // Custom actions
  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} storage={storage}  {...props} />;
  };

  // Render the custom view
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  // Render the Audio Bubble
  const renderAudioBubble = (props) => {
    return <View {...props} style={{width: 200}}>
      <TouchableOpacity
        style={{
          backgroundColor: "#FF0", width: 190,  borderRadius: 10, margin: 5
        }}
        onPress={async () => {
          const { sound } = await Audio.Sound.createAsync({
            uri:
              props.currentMessage.audio
          });
          soundObject = sound
          await sound.playAsync();
        }}>
        <Text style={{
          textAlign: "center", color: 'black', padding: 5,
        }}>play</Text>
      </TouchableOpacity>
    </View>
  }


  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={messages => onSend(messages)}
        isTyping={false}
        renderMessageAudio={renderAudioBubble}
        user={{
          _id: userID,
          name,
          backgroundColor,
          isConnected
        }}
      />

      {/*  Keyboard adjustment for Android and iOS*/}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior="padding" /> : null}
    </View>
  )
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 20,
    backgroundColor: '#a9a9a9'
  }
});

export default Chat