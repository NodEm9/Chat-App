import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const { name, backgroundColor } = route.params;

  // Set the title and background color for the Chat screen
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "You’ve entered the chat.",
        createdAt: new Date(),
        system: true,
      },
      {
        _id: 2,
        text: 'Hello developer!',
        createdAt: new Date(),
        user: {
          _id: 3,
          name: 'React Native',
          avatar: 'https://www.nodemma.com/_next/image?url=%2Fhero-image.png&w=384&q=75'
        }
      },
    ]);
  }, []);

  // Send a message
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
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
          _id: 1
        }}
      />
      {/*  Keyboard adjustment for Android and iOS*/}
       { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
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