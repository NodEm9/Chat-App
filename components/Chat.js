import React, { useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native';

const Chat = ({ route, navigation }) => {
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

  return (
    <View style={styles.container}>
      <Text>Hello Chat!</Text>
    </View>
  )
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Chat