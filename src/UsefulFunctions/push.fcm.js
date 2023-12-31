import messaging from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          // message으로부터 권한확인 후 권한이 있으면 onReigster함수를 gettoken함수로 넘김
          this.getToken(onRegister);
        } else {
          this.requestPermission(onRegister);
        }
      })
      .catch(error => {
        console.log('[FCMService] Permission rejected ', error);
      });
  };

  getToken = onRegister => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('[FCMService] User does not have a device token');
        }
      })
      .catch(error => {
        console.log('[FCMService] getToken rejected', error);
      });
  };

  requestPermission = onRegister => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {
        console.log('[FCMService] Request Permission rejected', error);
      });
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch(error => {
        console.log('[FCMService] Delete token error', error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('kkk', remoteMessage);
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        onOpenNotification(notification);
      }

      // Alert.alert(remoteMessage.notification);
      Alert.alert('누군가 위치공유를 시작했습니다.');
    });

    // 앱이 꺼져있을 때 메세징이 올 때 처리방법
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
          Alert.alert('누군가 위치공유를 시작했습니다.');
        }
      })
      .catch(error => {
        console.log('quit state notification error : ', error);
      });

    this.messageListener = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === 'ios') {
          // notification = remoteMessage.data.notification;
          notification = remoteMessage.notification;
        } else {
          notification = remoteMessage.notification;
        }
        onNotification(notification);
      }
    });

    messaging().onTokenRefresh(fcmToken => {
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };
}

export const fcmService = new FCMService();
