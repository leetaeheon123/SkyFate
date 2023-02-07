import notifee from '@notifee/react-native';
import axios from 'axios';
import {useEffect, useRef} from 'react';

export const onRemoteMessage = async (remoteMessage) => {
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
        navigation.dispatch((state) => {
          const lobbyIndex = state.routes.findIndex(
            (route) => route.name === 'IndicatorScreen',
          );
          const newRoute = {name: 'Chat', params: {channel, currentUser}};
          const routes = [...state.routes.slice(0, lobbyIndex + 1), newRoute];
          const action = CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });

          const chatRoute = state.routes.find((route) => route.name === 'Chat');
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

export const tMapNavigate = async (coordinates) => {
  const url = 'https://apis.openapi.sk.com/tmap/routes/pedestrian';
  const appKey = 'l7xx6d195b0058424a0e96b0a60793bd66d2'; // TODO: remove

  const payload = {
    version: 1,
    format: 'json',
    reqCoordType: 'WGS84GEO',
    resCoordType: 'WGS84GEO',
    startName: 'user1',
    endName: 'user2',
    ...coordinates,
  };

  const header = {
    headers: {
      appKey,
    },
  };

  try {
    const result = await axios.post(url, payload, header);
    console.log('GeoJson:', result.data);
    return result.data;
  } catch (error) {
    console.error(error.response);
    return null;
  }
  // return result.data;
};

export const parseLineString = (features) => {
  let newFeatures = [];
  features.forEach((feature) => {
    if (feature.geometry.type === 'LineString') {
      newFeatures.push(feature);
    }
  });
  return newFeatures;
};

export const useInterval = (callback, delay) => {
  const intervalRef = useRef();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof delay === 'number') {
      intervalRef.current = setInterval(() => callbackRef.current(), delay);
    }
    return () => clearInterval(intervalRef.current);
  }, [delay]);

  return intervalRef;
};
