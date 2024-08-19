import React, { useState } from 'react'
import { TextInput, Text, View, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native'
import { getAuth, signInAnonymously } from "firebase/auth";



const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const auth = getAuth();

  const backgroundColorList = ['#5858', '#555555', '#000000', '#333'];

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("Chat", {userID: result.user.uid, name, backgroundColor});
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      })
  }

  return (
    <ImageBackground
      source={require('../assets/Background Image.png')}
      style={styles.container}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 30, color: 'white', textAlign: 'center', marginTop: 50 }}>Welcome to Chat App</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter text"
          onChangeText={setName}
          value={name}
        />
        <View>
          <Text style={{ color: 'black', fontSize: 20, marginBottom: 20 }}>Choose a Background Color:</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {backgroundColorList.map((color, index) => (
              <TouchableOpacity
                key={index}
                accessible={true}
                accessibilityLabel="Select background color"
                accessibilityHint="Allows you to choose the background color for the chat screen"
                style={{ width: 50, height: 50, backgroundColor: color, borderRadius: 25 }}
                onPress={() => setBackgroundColor(color)}
              />
            ))}

          </View>
        </View>
        <TouchableOpacity
          title="Go to Chat"
          accessible={true}
          accessibilityLabel="Start Chatting"
          accessibilityHint="Allows you to start chatting with other users"
          accessibilityRole='button'
          onPress={signInUser}
          style={styles.enterChatButton}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Start Chating</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexBasis: 275,
    flex: 0,
    margin: 15,
    padding: 10,
    backgroundColor: "#CCC",
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: '88%',
    height: 50,
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 2,
  },
  enterChatButton: {
    width: '88%',
    height: 50,
    marginTop: 20,
    backgroundColor: '#333',
    padding: 10,
    marginBottom: 25,
    borderRadius: 44
  }
})

export default Start