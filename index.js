/**
 * @format
 */

import {AppRegistry, Platform, Vibration} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {LogBox} from 'react-native';

LogBox.ignoreLogs(['Non-serializable']);
LogBox.ignoreLogs(['The native module']);

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
    date: new Date(Date.now()), // in 60 secs
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false

    /* Android Only Properties */
    repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
  });
};

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
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
    // SendPushNotificationInforeground();
    // Vibration.vibrate([400]);
  } else {
    // AndroidInforeground();
  }

  SendBirdNoti(remoteMessage);
});

const SendBirdNoti = async (message) => {
  const isSendbirdNotification = Boolean(message.data.sendbird);
  if (!isSendbirdNotification) return;

  const text = message.data.message;
  const payload = JSON.parse(message.data.sendbird);

  // The following is required for compatibility with Android 8.0 (API level 26) and higher.
  // Link: https://notifee.app/react-native/reference/createchannel
  // Link: https://notifee.app/react-native/reference/androidchannel
  const channelId = await notifee.createChannel({
    id: 'NOTIFICATION_CHANNEL_ID',
    name: 'NOTIFICATION_CHANNEL_NAME',
    importance: AndroidImportance.HIGH,
  });

  // Link: https://notifee.app/react-native/reference/displaynotification
  await notifee.displayNotification({
    id: message.messageId,
    title: 'New message has arrived!',
    subtitle: `Number of unread messages: ${payload.unread_message_count}`,
    body: payload.message,
    data: payload,
    // Link: https://notifee.app/react-native/reference/notificationandroid
    android: {
      channelId,
      smallIcon: NOTIFICATION_ICON_RESOURCE_ID,
      importance: AndroidImportance.HIGH,
    },
    // Link: https://notifee.app/react-native/reference/notificationios
    ios: {
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });
};

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
