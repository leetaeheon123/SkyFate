import React, {useEffect, useState, useContext} from 'react';
import {ActivityIndicator, SafeAreaView, Alert} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import BottomTabScreen from '../../bottomstack';
import ValidInvitationCodeScreen from './ValidInvitationCode';

import {AppContext} from '../UsefulFunctions/Appcontext';
import {handleNotificationAction} from '../utils';
import {GetUserData} from '../UsefulFunctions/SaveUserDataInDevice';
// import { SBConnect } from '../UsefulFunctions/SaveUserDataInDevice';

const IndicatorScreen = (props: any) => {
  const [initialized, setInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const savedUserKey = 'UserData';

  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const {navigation} = props;

  const SBConnect = async (
    SendBird: any,
    UserEmail: string,
    NickName: string,
    ProfileImageUrl: string,
  ) => {
    SendBird.connect(UserEmail, (user: any, err: any) => {
      // console.log('In Sendbird.connect CallbackFunction User:', user);
      // 에러가 존재하지 않으면
      if (!err) {
        // 유저가 샌드버드에 등록 안되있으면 등록하는 로직
        if (user.nickname !== NickName) {
          SendBird.updateCurrentUserInfo(
            NickName,
            ProfileImageUrl,
            async (user: any, err: any) => {
              console.log('In sendbird.updateCurrentUserInfo User:', user);
              if (!err) {
                console.log(
                  'Succes connect SendBird In Register SBconnect Function',
                );
              } else {
                Alert.alert(
                  `SbConnect Function In RegisterScreen에서에러가 난 이유 : ${err.message}`,
                );
              }
            },
          );
        }
      } else {
        Alert.alert(`에러가 난 이유 : ${err.message}`);
      }
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('UserEmail')
      .then(async (user) => {
        if (user) {
          const UserEmail = user;
          const UserData = await GetUserData(user);
          const Gender = UserData?.Gender
          // console.log("UserData In Indicator", UserData)

          const ValidNickName = UserData?.hasOwnProperty('NickName');
          if (!ValidNickName) {
            GotoProfileInputScreen('NickNameSelectScreen', UserEmail);
            return;
          }

          const ValidMbti = UserData?.hasOwnProperty('Mbti');
          if (!ValidMbti) {
            GotoProfileInputScreen('MbtiSelectScreen', UserEmail);
            return;
          }

          const ValidGender = UserData?.hasOwnProperty('Gender');
          if (!ValidGender) {
            GotoProfileInputScreen('GenderSelectScreen', UserEmail);
            return;
          }

          const ValidAge = UserData?.hasOwnProperty('Age');
          if (!ValidAge) {
            GotoProfileInputScreen('AgeSelectScreen', UserEmail,Gender);
            return;
          }

          const ValidProfileImageUrl =
            UserData?.hasOwnProperty('ProfileImageUrl');
          if (!ValidProfileImageUrl) {
            GotoProfileInputScreen('ProfileImageSelectScreen', UserEmail,Gender);
            return;
          }

          if (
            ValidNickName &&
            ValidMbti &&
            ValidGender &&
            ValidAge &&
            ValidProfileImageUrl
          ) {
            setCurrentUser(UserData);
            SBConnect(
              SendBird,
              UserEmail,
              UserData?.NickName,
              UserData?.ProfileImageUrl,
            );
          }
        }
        setInitialized(true);

        return handleNotificationAction(navigation, SendBird, currentUser);
      })
      .catch((err) => console.error(err));
  }, []);

  const GotoProfileInputScreen = (
    ScreenName: string,
    UserEmail: string,
    Gender: number = 0,
  ) => {
    navigation.navigate(`${ScreenName}`, {
      UserEmail,
      Gender
    });
  };

  useEffect(() => {
    console.log('params In Indicator Screen: ', props.route.params);
    AsyncStorage.getItem('UserEmail')
      .then(async (user) => {
        const UserData = await GetUserData(user);

        //유저가 있는경우에 CurrentUUser에 savedUserKey 키를 통해 구해온값 저장
        if (user) {
          setCurrentUser(UserData);
        }
        setInitialized(true);

        // return handleNotificationAction(
        //   navigation,
        //   SendBird,
        //   currentUser,
        // );
      })
      .catch((err) => console.error(err));
  }, [props.route.params]);

  return (
    <>
      {initialized ? (
        // Best Partice?
        currentUser ? (
          <BottomTabScreen
            currentUser={currentUser}
            SendBird={SendBird}
            {...props}
          />
        ) : (
          <ValidInvitationCodeScreen />
        )
      ) : (
        <SafeAreaView>
          <ActivityIndicator />
        </SafeAreaView>
      )}
    </>
  );
};

export default IndicatorScreen;
