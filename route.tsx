import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ManToManBoardWriteScreen from './src/screens/ManBoard/ManToManBoardWrite';
import ValidInvitationCodeScreen from './src/screens/ValidInvitationCode';
import RegisterScreen from './src/screens/SignInUp/Register';
import LoginScreen from './src/screens/SignInUp/Login';

import IndicatorScreen from './src/screens/Indicator';

import ManToManBoardScreen from './src/screens/ManBoard/ManToManBorad';
import ManToManBoardViewScreen from './src/screens/ManBoard/ManToManBoradView';
import AnimationTestScreen from './src/screens/AnimationTest/AnimationTest';
import AnimationTestScreen2 from './src/screens/AnimationTest/AnimationTest2';

import ImageUploadSample from './src/screens/ImageUploadSample';
import PhoneRing from './src/screens/Ring/PhoneRing';

import CertificationScreen from './src/screens/Certification/Certification';
import CertificationResultScreen from './src/screens/Certification/CertificationResult';

import {RootStackParamList} from './src/screens/RootStackParamList';

import BottomTabScreen from './bottomstack';
import ChatScreen from './src/page/chat';
import MbtiSelectScreen from './src/screens/ProfileInput/MbtiSelect';
import GenderSelectScreen from './src/screens/ProfileInput/GenderSelect';
import AgeSelectScreen from './src/screens/ProfileInput/AgeSelect';
import NickNameSelectScreen from './src/screens/ProfileInput/NickNameSelect';

import ProfileImageSelectScreen from './src/screens/ProfileInput/ProfileImageSelect';
import AgreementScreen from './src/screens/AgreementScreen';
import WebViewScreen from './src/screens/WebViewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes = (props: any) => {
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
        name="AgreementScreen"
        component={AgreementScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
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
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
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
