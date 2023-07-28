import React, {useEffect, useState} from 'react';
import MapScreen from './src/screens/Map/map';
import FriendMapScreen from './src/screens/Map/FriendMap';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {withAppContext} from './src/contextReducer';

import MeetMapScreen from './src/screens/Map/meetmap';
import ChatListScreen from 'Screens/BottomTab/ChatList';

import MyProfileScreen from 'Screens/MyProfile/MyProfile';
import MyProfileChange from 'Screens/MyProfile/MyProfileChange';

import MyProfileChangeScreen from 'Screens/MyProfile/MyProfileChange';

import {WaitScreen} from 'Screens/Wait';

import {GetEpochTime, MilisToMinutes} from '^/GetTime';
import AutoComScreen from 'Screens/Map/AutoCom';
import FirstEventChatListScreen from 'Screens/Map/FirstEventChatList';
import SearchScrollScreen from 'Screens/BottomTab/SearchScrollScreen';
import {HPer10, HPer5, HPer8} from '~/Per';
import Feather from 'react-native-vector-icons/Feather';
import MeterialIcons from 'react-native-vector-icons/MaterialIcons';
import DetailViewScreen from 'Screens/BottomTab/DetailView';
import NewMyProfileScreen from 'Screens/MyProfile/NewMyProfile';
import Feed_SearchScrollScreen from 'Screens/Feed/Feed_SearchScrollScreen';

const BottomTab = createMaterialBottomTabNavigator();

const BottomTabScreen = (props: any) => {
  const {route, navigation, currentUser} = props;
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

  const getTabBarVisible = (route) => {
    const routeName = route.state
      ? route.state.routes[route.state.index].name // Nesting 된 Navigator의 경우
      : '';

    // 'Hidden' Screen에서는 하단 바텀 탭을 표시하지 않음
    if (routeName === 'MapScreen') {
      return false;
    }

    return true; // 나머지 Screen들은 하단 바텀 탭을 표시
  };

  return (
    <BottomTab.Navigator
      initialRouteName="SearchScrollScreen"
      barStyle={{
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        // Platform.OS === 'ios' ? marginBottom:10 : marginBottom:0,
        // marginBottom: Platform.OS === 'ios' ? 10 : 0,
        height: HPer8,
      }}
      shifting={true}
      // screenOptions={({route}) => ({
      //   tabBarVisible: getTabBarVisible(route), // 특정 Screen에서만 하단 바텀 탭 표시 여부 설정
      // })}
    >
      {/* <BottomTab.Screen name="Rending" component={Rending} /> */}
      <BottomTab.Screen
        name="SearchScrollScreen"
        component={SearchScrollScreen}
        initialParams={{
          UserData: currentUser,
        }}
        options={{
          tabBarIcon: ({color}) => (
            <MeterialIcons name="search" color={color} size={26} />
          ),
          tabBarLabel: '',
        }}
      />
      <BottomTab.Screen
        name="Feed_SearchScrollScreen"
        component={Feed_SearchScrollScreen}
        initialParams={{
          UserData: currentUser,
        }}
        options={{
          tabBarIcon: ({color}) => (
            <MeterialIcons name="note" color={color} size={26} />
          ),
          tabBarLabel: '',
        }}
      />

      {/* <BottomTab.Screen
        name="MapScreen"
        component={MapScreen}
        initialParams={{
          UserData: currentUser,
        }}
        options={{
          tabBarIcon: ({color}) => (
            <MeterialIcons name="note" color={color} size={26} />
          ),
          tabBarLabel: '',
        }}
      /> */}

      {/* <BottomTab.Screen name="MeetMapScreen" component={MeetMapScreen} /> */}
      <BottomTab.Screen
        name="ChatListScreen"
        component={ChatListScreen}
        initialParams={{
          UserData: currentUser,
        }}
        options={{
          tabBarIcon: ({color}) => (
            <MeterialIcons name="message" color={color} size={26} />
          ),
          tabBarLabel: '',
        }}
      />
      {/* <BottomTab.Screen
        name="FirstEventChatListScreen"
        component={FirstEventChatListScreen}
        initialParams={{}}
      /> */}
      <BottomTab.Screen
        name="MyProfileScreen"
        component={MyProfileScreen}
        initialParams={{
          UserData: currentUser,
        }}
        options={{
          tabBarIcon: ({color}) => (
            <MeterialIcons name="person" color={color} size={26} />
          ),
          tabBarLabel: '',
        }}
      />
      {/* <BottomTab.Screen
        name="NewMyProfileScreen"
        component={NewMyProfileScreen}
        initialParams={{
          UserData: currentUser,
        }}
        options={{
          tabBarIcon: ({color}) => (
            <MeterialIcons name="person" color={color} size={26} />
          ),
          tabBarLabel: '',
        }}
      /> */}
      {/* <BottomTab.Screen
        name="MyProfileChangeScreen"
        component={MyProfileChangeScreen}
      /> */}

      {/* <BottomTab.Screen name="AutoComScreen" component={AutoComScreen} /> */}
      {/* <BottomTab.Screen name="WaitScreen" component={WaitScreen} /> */}
    </BottomTab.Navigator>
  );
};

export default withAppContext(BottomTabScreen);
