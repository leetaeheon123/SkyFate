import React, {useState, useEffect} from 'react';

import { Platform } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './route';
import {QueryClient, QueryClientProvider} from 'react-query';
import AsyncStorage from '@react-native-community/async-storage';
import {onRemoteMessage} from './src/utils.js';

import messaging from '@react-native-firebase/messaging';

import AppContext from './src/UsefulFunctions/Appcontext';
import { NativeBaseProvider } from 'native-base';
import SendBird from 'sendbird';

const queryClient = new QueryClient();

const appId = '68EBE580-772D-4BF6-AB5E-0C2AF43EC263';

const sendbird = new SendBird({appId});

const initialState = {
  sendbird,
};


const App = () => {

  console.log("SendBird:", initialState)

  const savedUserKey = 'UserData';
  useEffect(() => {
    console.log('UseEffect In App.tsx');
    AsyncStorage.getItem(savedUserKey)
      .then(async user => {
        try {
          if (user) {
            const authorizationStatus = await messaging().requestPermission();
            if (
              authorizationStatus ===
                messaging.AuthorizationStatus.AUTHORIZED ||
              authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
            ) {
              if (Platform.OS === 'ios') {
                const token = await messaging().getAPNSToken();
                console.log('iostoken In App.tsx:', token);
                sendbird.registerAPNSPushTokenForCurrentUser(token);
              } else {
                const token = await messaging().getToken();
                console.log('andtokenIn App.tsx :', token);
                sendbird.registerGCMPushTokenForCurrentUser(token);
              }
            }
          }
        } catch (err) {
          console.error(err);
        }
      })
      .catch(err => console.error(err));

    if (Platform.OS !== 'ios') {
      const unsubscribeHandler = messaging().onMessage(onRemoteMessage);
      return unsubscribeHandler;
    }
  }, []);

  
  return (
    <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <AppContext.Provider value={initialState}>
            <NativeBaseProvider>
              <Routes></Routes>
            </NativeBaseProvider>
          </AppContext.Provider>
        </NavigationContainer>
    </QueryClientProvider>

  );
};

export default App;

// background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);