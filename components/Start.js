import React, { useState } from 'react'
import { TextInput, Text, View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');


  const backgroundColorList = [
    '#5858', '#555555','#000000','#333'
  ]


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
                style={{ width: 50, height: 50, backgroundColor: color, borderRadius: 25 }}
                onPress={() => setBackgroundColor(color)}

              />
            ))}

          </View>
        </View>
        <TouchableOpacity
          title="Go to Chat"
          onPress={() => navigation.navigate('Chat', { name, backgroundColor })}
          style={{ width: '88%', height: 50, marginTop: 20, backgroundColor: '#333', padding: 10, borderRadius: 44 }}
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    flex: 1, width: '90%', padding: 10, marginBottom: 40, height: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', shadowColor: '#333',
    shadowOffset: { width: 10, height: 10 }
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15
  }
})

export default Start