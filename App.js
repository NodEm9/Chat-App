import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './components/Start';
import Chat from './components/Chat';
import { Alert, LogBox } from 'react-native';

import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { useEffect } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';


// Create the navigator
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);


const App = () => {

  const connectionStatus = useNetInfo();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyALpT8pKtX_a9d_S1LMDeAS2ZLT9BPW_BE",
    authDomain: "chatapp-90274.firebaseapp.com",
    projectId: "chatapp-90274",
    storageBucket: "chatapp-90274.appspot.com",
    messagingSenderId: "466450113891",
    appId: "1:466450113891:web:a96d6a96fe8bd360601f56"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Get the Firestore services
  const db = getFirestore(app);

  // Get the Storage handler service
  const storage = getStorage(app);

  // Handle network connection detection
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('No Internet Connection');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat
            {...props}
            isConnected={connectionStatus.isConnected}
            db={db}
            storage={storage}
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App; 