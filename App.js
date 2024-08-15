import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './components/Start';
import Chat from './components/Chat';

// Create the navigator
const Stack = createNativeStackNavigator();

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';



const App = () => {

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
  
  const db = getFirestore(app);

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
          {props => <Chat {...props} db={db} />}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
  );
}


export default App; 