import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';

import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Chat = ({ db, route, navigation, isConnected }) => {
  const [messages, setMessages] = useState([]);

  // Get the name, background color and user ID from the route
  const { name, backgroundColor, userID } = route.params;

  let unsubscribe;

  useEffect(() => {
    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubscribe) unsubscribe(); 
      unsubscribe = null;
  
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

      // Fetch messages from Firestore
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date(doc.data().createdAt.toMillis()),
            ...firebaseData
          };
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

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => onSend(messages)}
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
  }
});

export default Chat