import React, {useEffect, useState, useContext} from 'react';
import {ActivityIndicator, SafeAreaView, Alert, Text} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import BottomTabScreen from '../../bottomstack';
import ValidInvitationCodeScreen from './ValidInvitationCode';

import {AppContext} from '../UsefulFunctions/Appcontext';
import {handleNotificationAction} from '../utils';
import {
  GetUserData,
  RegisterSendBirdToken,
} from '../UsefulFunctions/SaveUserDataInDevice';
import {WaitScreen} from './Wait';
import {ft} from '^/Firebase';
import {NotCheckFailed, NotCheckSuccess} from '^/NoMistakeWord';
import {ValidFalsy} from '^/ValidFalsy';

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
        RegisterSendBirdToken(SendBird, user.uid);

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
    UserUid: string,
    NickName: string,
    ProfileImageUrl: string,
  ) => {
    SendBird.connect(UserUid, (user: any, err: any) => {
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

  const CheckHoursofuse = async (UserType: string) => {
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
      {
        UserType == 'Admin' ? setIsUseTime(true) : setIsUseTime(false);
      }
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

  const CheckDaysofuse = async (UserType: string) => {
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
      {
        UserType == 'Admin' ? setIsUseDay(true) : setIsUseDay(false);
      }
    }
  };

  const ValidProfileImageUrlFun = (ProfileImageUr: any) => {
    if (ProfileImageUr == '') {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('UserUid')
      .then(async (user) => {
        if (user) {
          const UserUid = user;
          const UserData = await GetUserData(user);
          const Uid = UserData?.Uid;
          const NickName = UserData?.NickName;
          const Gender = UserData?.Gender;
          const Age = UserData?.Age;
          const MySelfIntro = UserData?.MySelfIntro;
          const MyWantIntro = UserData?.MyWantIntro;

          // console.log("UserData In Indicator", UserData)

          const ValidAgreement = UserData?.hasOwnProperty(
            'AgreementTermsofUse',
          );
          if (!ValidAgreement) {
            GotoProfileInputScreen('AgreementScreen', UserUid);
            return;
          }

          const ValidNickName = UserData?.hasOwnProperty('NickName');
          if (!ValidNickName) {
            GotoProfileInputScreen('NickNameSelectScreen', UserUid);
            return;
          }

          const ValidGender = UserData?.hasOwnProperty('Gender');
          if (!ValidGender) {
            GotoProfileInputScreen('GenderSelectScreen', UserUid, NickName);
            return;
          }

          const ValidMbti = UserData?.hasOwnProperty('Mbti');
          if (!ValidMbti) {
            GotoProfileInputScreen(
              'MbtiSelectScreen',
              UserUid,
              NickName,
              Gender,
            );
            return;
          }

          const ValidAge = UserData?.hasOwnProperty('Age');
          if (!ValidAge) {
            GotoProfileInputScreen(
              'AgeSelectScreen',
              UserUid,
              NickName,
              Gender,
            );
            return;
          }

          const ValidMyWantIntro = UserData?.hasOwnProperty('MyWantIntro');

          if (!ValidMyWantIntro) {
            GotoProfileInputScreen(
              'MyWantIntroScreen',
              UserUid,
              NickName,
              Gender,
              Age,
            );
            return;
          }

          const ValidMySelfIntro = UserData?.hasOwnProperty('MySelfIntro');

          if (!ValidMySelfIntro) {
            GotoProfileInputScreen(
              'MySelfIntroScreen',
              UserUid,
              NickName,
              Gender,
              Age,
              MyWantIntro,
            );
            return;
          }

          let ValidProfileImageUrl = ValidFalsy(UserData?.ProfileImageUrl);

          if (!ValidProfileImageUrl) {
            GotoProfileInputScreen(
              'ProfileImageSelectScreen',
              UserUid,
              NickName,
              Gender,
              Age,
              MyWantIntro,
              MySelfIntro,
            );
            return;
          }

          if (
            ValidAgreement &&
            ValidNickName &&
            ValidMbti &&
            ValidGender &&
            ValidAge &&
            ValidMyWantIntro &&
            ValidMySelfIntro &&
            ValidProfileImageUrl
          ) {
            setCurrentUser(UserData);
            SBConnect(
              SendBird,
              UserUid,
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
    UserUid: string,
    NickName: string = '',
    Gender: number = 0,
    Age: number = 0,
    MyWantIntro: string | null = null,
    MySelfIntro: string | null = null,
  ) => {
    if (NickName == '') {
      navigation.navigate(`${ScreenName}`, {
        UserUid,
        NickName: '',
      });
      return;
    }

    if (Gender == 0) {
      navigation.navigate(`${ScreenName}`, {
        UserUid,
        NickName,
      });

      return;
    }

    if (Age == 0) {
      navigation.navigate(`${ScreenName}`, {
        UserUid,
        NickName,
        Gender,
      });

      return;
    }

    if (MyWantIntro == null) {
      navigation.navigate(`${ScreenName}`, {
        UserUid,
        NickName,
        Gender,
        Age,
      });

      return;
    }

    if (MySelfIntro == null) {
      navigation.navigate(`${ScreenName}`, {
        UserUid,
        NickName,
        Gender,
        Age,
        MyWantIntro,
      });

      return;
    }

    navigation.navigate(`${ScreenName}`, {
      UserUid,
      NickName,
      Gender,
      Age,
      MyWantIntro,
      MySelfIntro,
    });

    return;
  };

  useEffect(() => {
    // setCurrentUser(null);
    console.log('params In Indicator Screen: ', props.route.params);

    if (props.route.params == undefined) {
      return;
    }

    AsyncStorage.getItem('UserUid')
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
            UserData?.UserUid,
            UserData?.NickName,
            UserData?.ProfileImageUrl,
          );
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
