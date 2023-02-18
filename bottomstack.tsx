import React, {useEffect, useState} from 'react';
import MapScreen from './src/screens/Map/map';
import FriendMapScreen from './src/screens/Map/FriendMap';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {withAppContext} from './src/contextReducer';

import MeetMapScreen from './src/screens/Map/meetmap';
import ChatListScreen from 'Screens/Map/ChatList';

import MyProfileScreen from 'Screens/MyProfile/MyProfile';
import MyProfileChange from 'Screens/MyProfile/MyProfileChange';

import MyProfileChangeScreen from 'Screens/MyProfile/MyProfileChange';
import {GetEpochTime, MilisToMinutes} from '^/GetTime';
const BottomTab = createMaterialBottomTabNavigator();

const BottomTabScreen = (props: any) => {
  const {route, navigation} = props;
  let {currentUser} = props;
  useEffect(() => {
    if (route.params && route.params.action) {
      const {action, data} = route.params;
      switch (action) {
        case 'leave':
          console.log('data In leave:', data);
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

    if (currentUser == undefined && route.params.currentUser) {
      currentUser = route.params.currentUser;
    }
  }, [route.params]);

  const ValidL1 = () => {
    if (currentUser.L1CreatedAt) {
      console.log('L1CreatedAt:', currentUser.L1CreatedAt);
      let now = GetEpochTime();
      let milis = now - currentUser.L1CreatedAt;
      let Minutes = MilisToMinutes(milis);

      if (Minutes < 15) {
        navigation.navigate('MeetMapScreen', {
          UserData: currentUser,
          otherUserData: currentUser.otherUserData,
          channel: currentUser.channel,
        });
      }
    }
  };

  // useEffect(() => {
  //   ValidL1();
  // }, []);

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
      {/* {props.currentUser.Gender == 2 ? (
        <BottomTab.Screen
          name="FriendMapScreen"
          component={FriendMapScreen}
          initialParams={{
            CurrentUser: currentUser,
          }}
        />
      ) : null} */}

      <BottomTab.Screen name="MeetMapScreen" component={MeetMapScreen} />
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
