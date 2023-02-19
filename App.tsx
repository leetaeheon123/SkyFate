import React, {useState, useEffect} from 'react';

import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './route';
import {QueryClient, QueryClientProvider} from 'react-query';
import AsyncStorage from '@react-native-community/async-storage';
import {onRemoteMessage} from './src/utils.js';

import messaging from '@react-native-firebase/messaging';

import {AppContext} from './src/UsefulFunctions/Appcontext';
import {NativeBaseProvider} from 'native-base';
import SendBird from 'sendbird';
import FlipperAsyncStorage from 'rn-flipper-async-storage-advanced';

import * as Sentry from '@sentry/react-native';
import CodePush from 'react-native-code-push';

Sentry.init({
  dsn: 'https://943b85677de143c3accb57fd68f046dc@o4504704527892480.ingest.sentry.io/4504704529924096',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

if (__DEV__) {
  import('react-query-native-devtools').then(({addPlugin}) => {
    addPlugin({queryClient});
  });
}
const queryClient = new QueryClient();

// apk8269@gmail -> rendevous 계정
// const appId = '68EBE580-772D-4BF6-AB5E-0C2AF43EC263';
const appId = 'B0BDC2B5-FF59-4D00-98C2-BADBAA9215E7';

const sendbird = new SendBird({appId});

const initialState = {
  sendbird,
};

const App = () => {
  const savedUserKey = 'UserData';

  useEffect(() => {
    AsyncStorage.getItem(savedUserKey)
      .then(async (user) => {
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
      .catch((err) => console.error(err));

    if (Platform.OS !== 'ios') {
      const unsubscribeHandler = messaging().onMessage(onRemoteMessage);
      return unsubscribeHandler;
    }
  }, []);

  const [currentRouteName, setCurrentRouteName] = useState('initRouteName');

  return (
    <QueryClientProvider client={queryClient}>
      <FlipperAsyncStorage />
      <NavigationContainer
        onStateChange={(state) => {
          console.log('[App.tsx] NavigationContainer onStateChange:', state);
          Sentry.addBreadcrumb({
            category: 'Navigation',
            data: {
              to: `${state?.routes[state.index].name}`,
              from: `${currentRouteName}`,
            },
            level: 'error',
          });
          setCurrentRouteName(state?.routes[state.index].name);
        }}>
        <AppContext.Provider value={initialState}>
          <NativeBaseProvider>
            <Sentry.TouchEventBoundary>
              <Routes></Routes>
            </Sentry.TouchEventBoundary>
          </NativeBaseProvider>
        </AppContext.Provider>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default CodePush(Sentry.wrap(App));

// background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
