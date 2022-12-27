import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ManToManBoardWriteScreen from './src/screens/ManToManBoardWrite';
import ValidInvitationCodeScreen from './src/screens/ValidInvitationCode';
import RegisterScreen from './src/screens/Register';
import LoginScreen from './src/screens/Login';

import IndicatorScreen from './src/screens/Indicator';

import ManToManBoardScreen from './src/screens/ManToManBorad';
import ManToManBoardViewScreen from './src/screens/ManToManBoradView';
import AnimationTestScreen from './src/screens/AnimationTest';
import AnimationTestScreen2 from './src/screens/AnimationTest2';
import TestScreen from './src/screens/Test';

import ImageUploadSample from './src/screens/ImageUploadSample';
import PhoneRing from './src/screens/PhoneRing';

import CertificationScreen from './src/screens/Certification';
import CertificationResultScreen from './src/screens/CertificationResult';

import {RootStackParamList} from './src/screens/RootStackParamList';

import BottomTabScreen from './bottomstack'
import ChatScreen from './src/page/chat';
import MbtiSelectScreen from './src/screens/MbtiSelect';
import GenderSelectScreen from './src/screens/GenderSelect';
import AgeSelectScreen from './src/screens/AgeSelect';
import NickNameSelectScreen from './src/screens/NickNameSelect';

import ProfileImageSelectScreen from './src/screens/ProfileImageSelect';
const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes = (props:any) => {


  // 성별 가져오는 코드 필요합니다 - 2022 10 09 오후1시.

    return (

      <Stack.Navigator initialRouteName="IndicatorScreen">
         <Stack.Screen
          name="BottomTabScreen"
          component={BottomTabScreen}
          options={{headerShown: false}}
        />
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
          name="CertificationScreen"
          component={CertificationScreen}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="CertificationResultScreen"
          component={CertificationResultScreen}
          options={{headerShown: false}}
        />
        
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
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
          name="ChatScreen"
          component={ChatScreen}
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
        <Stack.Screen
          name="MbtiSelectScreen"
          component={MbtiSelectScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NickNameSelectScreen"
          component={NickNameSelectScreen}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="GenderSelectScreen"
          component={GenderSelectScreen}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="AgeSelectScreen"
          component={AgeSelectScreen}
          options={{headerShown: false}}
        />
          <Stack.Screen
          name="ProfileImageSelectScreen"
          component={ProfileImageSelectScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>

    );
};

export default Routes;
