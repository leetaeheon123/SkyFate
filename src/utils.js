export const onRemoteMessage = async remoteMessage => {
    // Set the channel for Android
  
    const channelId = await notifee.createChannel({
      id: 'SendbirdNotificationChannel',
      name: 'Sendbird RN Sample',
    });
  
    if (remoteMessage && remoteMessage.data) {
      let pushActionId = 'SendbirdNotification-';
  
      // Set the notification push action id from channel url
      const message = JSON.parse(remoteMessage.data.sendbird);
      let channelUrl = null;
      if (message && message.channel) {
        channelUrl = message.channel.channel_url;
      }
      pushActionId += channelUrl;
  
      await AsyncStorage.setItem(pushActionId, JSON.stringify(remoteMessage));
  
      // Display a notification
      await notifee.displayNotification({
        title: 'Sendbird Sample',
        body: remoteMessage.data.message,
        android: {
          channelId,
          pressAction: {
            id: pushActionId,
            launchActivity: 'default',
          },
        },
      });
    }
  };
  