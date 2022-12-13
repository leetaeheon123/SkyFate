import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './route';
import {QueryClient, QueryClientProvider} from 'react-query';
import {View, Text, SafeAreaView} from 'react-native';

import AppContext from './src/UsefulFunctions/Appcontext';
import { NativeBaseProvider } from 'native-base';

const queryClient = new QueryClient();

const App = () => {

  const [userEmail, setUserEmail] = useState("");
  const [userGender, setUserGender] = useState("");
  const [ProfileImageUrl, setProfileImageUrl] = useState("");

  // const [setting2value, setSetting2value] = useState(false);

  // const toggleSetting2 = () => {
  //   setting3 ? setSetting2(true) : setSetting2value(false);
  // };

  const userSettings = {
    userEmail: userEmail,
    setUserEmail,
    ProfileImageUrl: ProfileImageUrl,
    setProfileImageUrl,
    userGender: userGender,
    setUserGender

    // setting2name: setting2value,
    // setSetting2value
    // toggleSetting2,
  };

  const b = 2
  
  return (
  <AppContext.Provider value={userSettings}>
    <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <NativeBaseProvider>
            <Routes></Routes>
          </NativeBaseProvider>
        </NavigationContainer>
    </QueryClientProvider>
  </AppContext.Provider>

  );
};

export default App;

// background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);