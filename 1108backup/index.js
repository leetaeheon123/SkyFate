/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

function SendPushNotificationInforeground() {
  PushNotificationIOS.addNotificationRequest({
    id: '123',
    title: 'hello',
    body: 'hi',
    subtitle: 'hh',
  });
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background remote message: ', remoteMessage);
  SendPushNotificationInforeground();
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
