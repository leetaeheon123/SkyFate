import React, {useEffect, useState} from 'react';
import MapScreen from './src/screens/Map/map';
import FriendMapScreen from './src/screens/Map/FriendMap';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {withAppContext} from './src/contextReducer';

import MeetMapScreen from './src/screens/Map/meetmap';
import ChatListScreen from 'Screens/Map/ChatList';

import MyProfileScreen from 'Screens/MyProfile/MyProfile';
import MyProfileChange from 'Screens/MyProfile/MyProfileChange';

import {Rending} from 'Screens/Rending';
import MyProfileChangeScreen from 'Screens/MyProfile/MyProfileChange';
const BottomTab = createMaterialBottomTabNavigator();

const BottomTabScreen = (props: any) => {
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
      initialRouteName="MapScreen"
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
      {/* <BottomTab.Screen name="Rending" component={Rending} /> */}
      <BottomTab.Screen
        name="MapScreen"
        component={MapScreen}
        initialParams={{
          CurrentUser: currentUser,
        }}
      />
      {props.currentUser.Gender == 2 ? (
        <BottomTab.Screen
          name="FriendMapScreen"
          component={FriendMapScreen}
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
      <BottomTab.Screen
        name="ChatListScreen"
        component={ChatListScreen}
        initialParams={{}}
      />
      <BottomTab.Screen name="MyProfileScreen" component={MyProfileScreen} />
      <BottomTab.Screen
        name="MyProfileChangeScreen"
        component={MyProfileChangeScreen}
      />
    </BottomTab.Navigator>
  );
};

export default withAppContext(BottomTabScreen);
