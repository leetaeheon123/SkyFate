import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MapScreen from './src/screens/map';
import TrackUserLocation from './src/screens/map';

import ManToManBoardWriteScreen from './src/screens/ManToManBoardWrite';
import ValidInvitationCodeScreen from './src/screens/ValidInvitationCode';
import RegisterScreen from './src/screens/Register';
import TossLogin from './src/screens/Login';

import IndicatorScreen from './src/screens/Indicator';

import ManToManBoardScreen from './src/screens/ManToManBorad';
import ManToManBoardViewScreen from './src/screens/ManToManBoradView';
import AnimationTestScreen from './src/screens/AnimationTest';
import AnimationTestScreen2 from './src/screens/AnimationTest2';
import TestScreen from './src/screens/Test';

import TestGifScreen from './TestGif';
import ImageUploadSample from './src/screens/ImageUploadSample';
import PhoneRing from './src/screens/PhoneRing';

import {RootStackParamList} from './src/screens/RootStackParamList';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes = () => {
  // 성별 가져오는 코드 필요합니다 - 2022 10 09 오후1시.
  let a = 2;

  if (a == 1) {
    return (
      <Stack.Navigator initialRouteName="">
        <Stack.Screen
          name="TrackUserLocation"
          component={TrackUserLocation}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  } else if (a == 2) {
    return (
      <Stack.Navigator initialRouteName="IndicatorScreen">
        <Stack.Screen
          name="ImageUploadSample"
          component={ImageUploadSample}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="IndicatorScreen"
          component={IndicatorScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ValidInvitationCodeScreen"
          component={ValidInvitationCodeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginScreen"
          component={TossLogin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ManToManBoardScreen"
          component={ManToManBoardScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ManToManBoardWriteScreen"
          component={ManToManBoardWriteScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ManToManBoardViewScreen"
          component={ManToManBoardViewScreen}
          // options={{title: ''}}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AnimationTestScreen2"
          component={AnimationTestScreen2}
          // options={{title: ''}}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TestScreen"
          component={TestScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PhoneRing"
          component={PhoneRing}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }
};

export default Routes;
