import notifee from '@notifee/react-native';

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

export const handleNotificationAction = async (
  navigation,
  sendbird,
  currentUser,
) => {
  // Move to channel from pushed notification

  console.log('handleNotificationAction');
  console.log('currentUser: In handleNotificationAction Function', currentUser);
  const initialNotification = await notifee.getInitialNotification();

  console.log(
    'initialNotification in handleNsotificationAction Function:',
    initialNotification,
  );
  // 이부분은 알람을 통해 앱을 여느 경우를 위한 코드임.
  if (initialNotification && initialNotification.pressAction) {
    const remoteMessage = JSON.parse(
      await AsyncStorage.getItem(initialNotification.pressAction.id),
    );
    if (remoteMessage && remoteMessage.data) {
      const message = JSON.parse(remoteMessage.data.sendbird);
      if (message && message.channel) {
        const channel = await sendbird.GroupChannel.getChannel(
          message.channel.channel_url,
        );
        navigation.dispatch(state => {
          const lobbyIndex = state.routes.findIndex(
            route => route.name === 'IndicatorScreen',
          );
          const newRoute = {name: 'Chat', params: {channel, currentUser}};
          const routes = [...state.routes.slice(0, lobbyIndex + 1), newRoute];
          const action = CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });

          const chatRoute = state.routes.find(route => route.name === 'Chat');
          if (chatRoute && chatRoute.params && chatRoute.params.channel) {
            if (chatRoute.params.channel.url === channel.url) {
              // Navigate from same channel
              return CommonActions.reset(state);
            } else {
              // Navigate from another channel
              return action;
            }
          } else {
            // Navigate from Lobby
            return action;
          }
        });
        await AsyncStorage.removeItem(initialNotification.pressAction.id);
      }
    }
  }
};
