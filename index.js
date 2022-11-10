/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

function SendPushNotificationInforeground() {
  PushNotificationIOS.addNotificationRequest({
    id: '123',
    title: 'hello',
    body: 'hi',
    subtitle: 'hh',
  });
}

const AndroidInforeground = () => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    message: 'My Notification Message', // (required)
    date: new Date(Date.now() + 60 * 1000), // in 60 secs
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false

    /* Android Only Properties */
    repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
  });
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  //  로 메세지에 접근가능
  console.log('remoteMessage.data:', remoteMessage.data);
  console.log(
    'remoteMessage.from: 토픽 네임 또는 메세지 식별자',
    remoteMessage.from,
  );
  console.log(
    'remoteMessage.messageId(메세지의 교유값):',
    remoteMessage.messageId,
  );
  console.log(
    'remoteMessage.notification 메시지와 함께 보내진 추가 데이터',
    remoteMessage.notification,
  );
  console.log('rremoteMessage.sentTime 보낸시간:', remoteMessage.sentTime);

  if (Platform === 'ios') {
    SendPushNotificationInforeground();
  } else {
    AndroidInforeground();
  }
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
