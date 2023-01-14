import React, {useEffect, useState} from 'react';
import MapScreen from './src/screens/Map/map';
import TwoMapScreen from './src/screens/Map/twomap';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {withAppContext} from './src/contextReducer';

import MeetMapScreen from './src/screens/Map/meetmap';

const BottomTab = createMaterialBottomTabNavigator();

const BottomTabScreen = (props: any) => {
  const [InvitationCodeToFriend, setInvitationCodeToFriend] =
    useState<Object>(null);
  const {route, currentUser} = props;

  useEffect(() => {
    if (route.params && route.params.action) {
      const {action, data} = route.params;
      switch (action) {
        case 'leave':
          data.channel.leave((_, err) => {
            // if (err) {
            //   dispatch({
            //     type: 'error',
            //     payload: {
            //       error: 'Failed to leave the channel.',
            //     },
            //   });
            // }
          });
          break;
        case 'deleteInClient':
          data.channel.delete((_, err) => {
            // if (err) {
            //   dispatch({
            //     type: 'error',
            //     payload: {
            //       error: 'Failed to leave the channel.',
            //     },
            //   });
            // }
          });
          break;
        case 'deleteInServer':
          console.log('deleteInserver');
          break;
      }
    }
  }, [route.params]);

  return (
    <BottomTab.Navigator
      barStyle={{
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        // Platform.OS === 'ios' ? marginBottom:10 : marginBottom:0,
        // marginBottom: Platform.OS === 'ios' ? 10 : 0,
        height: 0,
      }}
      // screenOptions={() => ({
      //   tabbarVisiable: false,
      // })}
    >
      <BottomTab.Screen
        name="MapScreen"
        component={MapScreen}
        initialParams={{
          CurrentUser: currentUser,
        }}
      />
      {props.currentUser.Gender == 2 ? (
        <BottomTab.Screen
          name="TwoMapScreen"
          component={TwoMapScreen}
          initialParams={{
            CurrentUser: currentUser,
          }}
        />
      ) : null}

      <BottomTab.Screen
        name="MeetMapScreen"
        component={MeetMapScreen}
        initialParams={{
          CurrentUser: props.currentUser,
        }}
      />
    </BottomTab.Navigator>
  );
};

export default withAppContext(BottomTabScreen);
