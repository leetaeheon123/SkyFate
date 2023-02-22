import React, {useEffect, useState, useContext} from 'react';
import {ActivityIndicator, SafeAreaView, Alert, Text} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import BottomTabScreen from '../../bottomstack';
import ValidInvitationCodeScreen from './ValidInvitationCode';

import {AppContext} from '../UsefulFunctions/Appcontext';
import {handleNotificationAction} from '../utils';
import {GetUserData} from '../UsefulFunctions/SaveUserDataInDevice';
import {WaitScreen} from './Wait';
import {ft} from '^/Firebase';
// import { SBConnect } from '../UsefulFunctions/SaveUserDataInDevice';

export const SendBirdUpdateUserInfo = (
  SendBird: any,
  NickName: string,
  ProfileImageUrl: string,
) => {
  SendBird.updateCurrentUserInfo(
    NickName,
    ProfileImageUrl,
    async (user: any, err: any) => {
      console.log('In sendbird.updateCurrentUserInfo User:', user);
      if (!err) {
        console.log(
          'Succes updateCurrentUserInfo SendBird In SBconnect Function In Indicator Screen',
        );
      } else {
        Alert.alert(
          `SbConnect Function In IndicatorScreen에서에러가 난 이유 : ${err.message}`,
        );
      }
    },
  );
};
const IndicatorScreen = (props: any) => {
  const [initialized, setInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
      console.log('In Sendbird.connect CallbackFunction User:', user);
      // 에러가 존재하지 않으면
      if (!err) {
        // 유저가 샌드버드에 등록 안되있으면 등록하는 로직
        if (user.nickname !== NickName) {
          SendBirdUpdateUserInfo(SendBird, NickName, ProfileImageUrl);
        }
      } else {
        Alert.alert(`에러가 난 이유 : ${err.message}`);
      }
    });
  };

  const [IsUseTime, setIsUseTime] = useState(false);
  const [IsUseDay, setIsUseDay] = useState(false);

  const CheckHoursofuse = async () => {
    const OpenHours = await GetOpenHours();
    const date = new Date();
    let day = date.getHours();

    console.log(OpenHours);
    const TodayOpenHours = OpenHours.TodayOpenHours;
    const NextDayCloseHours = OpenHours.NextDayCloseHours;
    // day가 오후 10시 ~ 새벽 7시
    if (
      (day >= TodayOpenHours && day <= 24) ||
      (day >= 1 && day <= NextDayCloseHours)
    ) {
      setIsUseTime(true);
    } else {
      setIsUseTime(false);
    }
  };

  const GetOpenDay = async () => {
    const Result = await ft
      .collection('SettingData')
      .doc('OpenTime')
      .get()
      .then((doc) => doc.data());
    return Result?.Day;
  };

  const GetOpenHours = async () => {
    const Result = await ft
      .collection('SettingData')
      .doc('OpenTime')
      .get()
      .then((doc) => doc.data());
    return Result?.Hours;
  };

  const CheckDaysofuse = async () => {
    const date = new Date();
    let day = date.getDay();
    day = 5;
    // 서버에서 오픈 요일 배열 불러오기
    // ex) [0, 4,5,6]
    // day 값이 그 배열안에 속하는지 체크
    const OpenDay = await GetOpenDay();

    console.log(OpenDay);
    if (day == 0 || day == 5 || day == 6) {
      setIsUseDay(true);
    } else {
      setIsUseDay(false);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('UserEmail')
      .then(async (user) => {
        if (user) {
          const UserEmail = user;
          const UserData = await GetUserData(user);
          const Gender = UserData?.Gender;
          // console.log("UserData In Indicator", UserData)

          const ValidAgreement = UserData?.hasOwnProperty(
            'AgreementTermsofUse',
          );
          if (!ValidAgreement) {
            GotoProfileInputScreen('AgreementScreen', UserEmail);
            return;
          }

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
            GotoProfileInputScreen('AgeSelectScreen', UserEmail, Gender);
            return;
          }

          const ValidProfileImageUrl =
            UserData?.hasOwnProperty('ProfileImageUrl');
          if (!ValidProfileImageUrl) {
            GotoProfileInputScreen(
              'ProfileImageSelectScreen',
              UserEmail,
              Gender,
            );
            return;
          }

          if (
            ValidAgreement &&
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
            CheckDaysofuse();
            CheckHoursofuse();
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
      Gender,
    });
  };

  useEffect(() => {
    // setCurrentUser(null);
    console.log('params In Indicator Screen: ', props.route.params);

    if (props.route.params == undefined) {
      return;
    }

    AsyncStorage.getItem('UserEmail')
      .then(async (user) => {
        const UserData = await GetUserData(user);

        //유저가 있는경우에 CurrentUUser에 savedUserKey 키를 통해 구해온값 저장
        if (user) {
          console.log(
            'setCurrentUser In UseEffect [params] In indicator Screen',
            UserData,
          );
          setCurrentUser(UserData);
          SBConnect(
            SendBird,
            UserData?.UserEmail,
            UserData?.NickName,
            UserData?.ProfileImageUrl,
          );
        }
        CheckDaysofuse();
        CheckHoursofuse();
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
          IsUseDay ? (
            IsUseTime ? (
              <BottomTabScreen
                currentUser={currentUser}
                SendBird={SendBird}
                {...props}
              />
            ) : (
              <WaitScreen />
            )
          ) : (
            <WaitScreen />
          )
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
