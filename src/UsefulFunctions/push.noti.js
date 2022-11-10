import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';

class LocalNotificationService {
  configure = onOpenNotification => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log(
          '[LocalNotificationService] onRegister : localtoken',
          token,
        );
      },
      onNotification: function (notification) {
        console.log('[LocalNotificationService] onNotification ', notification);
        if (!notification?.data) {
          return;
        }
        notification.userInteraction = true;
        onOpenNotification(
          Platform.OS === 'ios' ? notification.data.item : notification.data,
        );

        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  unRegister = () => {
    PushNotification.unregister();
  };

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      // Android only Properties
      ...this.buildAndroidNotification(id, title, message, data, options),
      // IOS and Android properties
      ...this.buildIOSNotification(id, title, message, data, options),
      // IOS and Android properties
      channelId: 'your-channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
      title: title || '',
      message: message || '',
      userInteraction: false,
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    });

    // PushNotification.localNotification({
    //   /* Android Only Properties */
    //   ticker: "My Notification Ticker", // (optional)
    //   showWhen: true, // (optional) default: true
    //   autoCancel: false, // (optional) default: true
    //   largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
    //   largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
    //   smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
    //   bigText: "My big text that will be shown when notification is expanded. Styling can be done using HTML tags(see android docs for details)", // (optional) default: "message" prop
    //   subText: "This is a subText", // (optional) default: none
    //   bigPictureUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
    //   bigLargeIcon: "ic_launcher", // (optional) default: undefined
    //   bigLargeIconUrl: "https://www.example.tld/bigicon.jpg", // (optional) default: undefined
    //   color: "red", // (optional) default: system default
    //   vibrate: true, // (optional) default: true
    //   vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    //   ongoing: false, // (optional) set whether this is an "ongoing" notification
    //   priority: "high", // (optional) set notification priority, default: high
    //   visibility: "visibility", // (optional) set notification visibility, default: private
    //   ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
    //   shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
    //   onlyAlertOnce: true, // (optional) alert will open only once with sound and notify, default: false

    //   messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.

    //   actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
    //   invokeApp: false, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

    //   /* iOS only properties */
    //   category: "", // (optional) default: empty string
    //   subtitle: "My Notification Subtitle", // (optional) smaller title below notification title

    //   /* iOS and Android properties */
    //   id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
    //   picture: "https://www.example.tld/picture.jpg", // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
    //   userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
    //   playSound: true, // (optional) default: true
    //   soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    //   number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    //   repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.

    //      channelId: 'your-channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    //   title: title || '',
    //   message: message || '',
    //   userInteraction: false,
    // });
  };

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      authCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
    };
  };

  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };

  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeDeliveredNotificationByID = notification => {
    console.log(
      '[LocalNotificationService] removeDeliveredNotificationByID:',
      notification,
    );
    PushNotification.cancelLocalNotifications({id: `${notificationId}`});
  };
}

export const localNotificationService = new LocalNotificationService();
