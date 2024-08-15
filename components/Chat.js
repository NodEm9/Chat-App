import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, FlatList, Platform } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";



const Chat = ({ db, route, navigation }) => {
  const [messages, setMessages] = useState([]);

  // Get the name, background color and user ID from the route
  const { name, backgroundColor, userID } = route.params;


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
    // Fetch messages from Firestore
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
      setMessages(messages);
    });

    // Unsubscribe from the snapshot when no longer in use "Clean up"
    return () => {
      if (unsubscribe) unsubscribe();
    }
  }, []);

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

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID,
          name,
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