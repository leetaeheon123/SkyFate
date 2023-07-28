import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ManToManBoardWriteScreen from 'Screens/ManBoard/ManToManBoardWrite';
import ValidInvitationCodeScreen from 'Screens/ValidInvitationCode';
import RegisterScreen from 'Screens/SignInUp/Register';
import LoginScreen from 'Screens/SignInUp/Login';
import WithdrawalScreen from 'Screens/SignInUp/Withdrawal';

import IndicatorScreen from 'Screens/Indicator';

import ManToManBoardScreen from 'Screens/ManBoard/ManToManBorad';
import ManToManBoardViewScreen from 'Screens/ManBoard/ManToManBoradView';
import AnimationTestScreen from 'Screens/AnimationTest/AnimationTest';
import AnimationTestScreen2 from 'Screens/AnimationTest/AnimationTest2';

import ImageUploadSample from 'Screens/ImageUploadSample';
import PhoneRing from 'Screens/Ring/PhoneRing';

import CertificationScreen from 'Screens/Certification/Certification';
import CertificationResultScreen from 'Screens/Certification/CertificationResult';

import {RootStackParamList} from 'Screens/RootStackParamList';

import BottomTabScreen from './bottomstack';
import ChatScreen from './src/page/chat';
import CsChatScreen from './src/page/CsChat';
import NoTimeLimitChatScreen from './src/page/NoTimLimitChat';

import MbtiSelectScreen from 'Screens/ProfileInput/MbtiSelect';
import GenderSelectScreen from 'Screens/ProfileInput/GenderSelect';
import AgeSelectScreen from 'Screens/ProfileInput/AgeSelect';
import NickNameSelectScreen from 'Screens/ProfileInput/NickNameSelect';

import ProfileImageSelectScreen from 'Screens/ProfileInput/ProfileImageSelect';
import AgreementScreen from 'Screens/AgreementScreen';
import WebViewScreen from 'Screens/WebViewScreen';

import SettingScreen from 'Screens/Setting/Setting';

import ProfileImageViewScreen from './src/page/ProfileImageView';
import VisualMeasureStart1Screen from 'Screens/ProfileInput/VisualMeasureStart1';
import VisualMeasureStart2Screen from 'Screens/ProfileInput/VisualMeasureStart2';
import VisualMeasureInProgressScreen from 'Screens/ProfileInput/VisualMeasureInProgress';
import VisualMeasureNotCheckSuccessScreen from 'Screens/ProfileInput/VisualMeasureNotCheckSuccess';
import VisualMeasureNotCheckFailedScreen from 'Screens/ProfileInput/VisualMeasureNotCheckFailed';
import AdminDashBoardScreen from 'Screens/Setting/AdminDashBoard';
import {MigrationScreen} from 'Screens/Setting/Migration';
import DetailViewScreen from 'Screens/BottomTab/DetailView';
import UserListWantTalkMeScreen from 'Screens/Chat/UserListWantTalkMeScreen';
import WantIntroScreen from 'Screens/ProfileInput/WantIntro';
import SelfIntroScreen from 'Screens/ProfileInput/SelfIntro';
import MySelfIntroScreen from 'Screens/ProfileInput/SelfIntro';
import MyWantIntroScreen from 'Screens/ProfileInput/WantIntro';
import MyProfileChangeScreen from 'Screens/MyProfile/MyProfileChange';

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
        name="WithdrawalScreen"
        component={WithdrawalScreen}
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
      <Stack.Screen name="CsChatScreen" component={CsChatScreen} />
      <Stack.Screen
        name="NoTimeLimitChatScreen"
        component={NoTimeLimitChatScreen}
      />

      <Stack.Screen
        name="UserListWantTalkMeScreen"
        component={UserListWantTalkMeScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ProfileImageViewScreen"
        component={ProfileImageViewScreen}
        options={{headerShown: false}}
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
        name="AdminDashBoardScreen"
        component={AdminDashBoardScreen}
        // options={{title: ''}}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MigrationScreen"
        component={MigrationScreen}
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
        name="MySelfIntroScreen"
        component={MySelfIntroScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyWantIntroScreen"
        component={MyWantIntroScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VisualMeasureStart1Screen"
        component={VisualMeasureStart1Screen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VisualMeasureStart2Screen"
        component={VisualMeasureStart2Screen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VisualMeasureInProgressScreen"
        component={VisualMeasureInProgressScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VisualMeasureNotCheckSuccessScreen"
        component={VisualMeasureNotCheckSuccessScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VisualMeasureNotCheckFailedScreen"
        component={VisualMeasureNotCheckFailedScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileImageSelectScreen"
        component={ProfileImageSelectScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="MyProfileChangeScreen"
        component={MyProfileChangeScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="DetailViewScreen"
        component={DetailViewScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Routes;
