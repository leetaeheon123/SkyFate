import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const GetUserData = async (userEmail: string) => {
  return firestore()
    .collection('UserList')
    .doc(`${userEmail}`)
    .get()
    .then((doc) => {
      console.log('Success GetUserData');
      const Result = doc.data();
      return Result;
    });
};

export const SaveUserEmailInDevice = async (UserEmail: string) => {
  await AsyncStorage.setItem('UserEmail', UserEmail);
};

export const RegisterUserEmail = async (
  UserEmail: string,
  navigation: any,
  SendBird: Object,
) => {
  try {
    await SaveUserEmailInDevice(UserEmail);
    await RegisterSendBirdToken(SendBird, UserEmail);
    await navigation.navigate('AgreementScreen', {
      UserEmail,
    });
  } catch (error) {
    Alert.alert(
      'RegisterUserEmail Function In  SaveUserDataInDevice.js의 UsefulFunctions에서 오류 발생:',
      error,
    );
  }
};

export const LoginUserEmail = async (
  UserEmail: string,
  navigation: any,
  SendBird: Object,
) => {
  try {
    await SaveUserEmailInDevice(UserEmail);
    await RegisterSendBirdToken(SendBird, UserEmail);
    await navigation.navigate('IndicatorScreen', {
      From: 'LoginAndRegister',
    });
  } catch (error) {
    Alert.alert(
      'RegisterUserData Function In  SaveUserDataInDevice UsefulFunctions에서 오류 발생:',
      error,
    );
  }
};

export const RegisterSendBirdToken = async (
  SendBird: Object,
  UserEmail: string,
) => {
  try {
    const authorizationStatus = await messaging().requestPermission();
    if (
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      if (Platform.OS === 'ios') {
        const Token = await messaging().getAPNSToken();
        console.log('iostoken', Token);
        UpdateFCMToken(UserEmail, Token);
        SendBird.registerAPNSPushTokenForCurrentUser(Token);
      } else {
        const Token = await messaging().getToken();
        UpdateFCMToken(UserEmail, Token);
        console.log('aostoken', Token);
        SendBird.registerGCMPushTokenForCurrentUser(Token);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const UpdateFCMToken = (UserEmail: string, Token: string) => {
  if (Platform.OS === 'ios') {
    firestore()
      .collection('UserList')
      .doc(`${UserEmail}`)
      .update({
        Token: Token,
        OSType: 'ios',
      })
      .then(() => {
        console.log('Sucess Update Fcm Toekn In firestore. Toekn ');
      });
  } else {
    firestore()
      .collection('UserList')
      .doc(`${UserEmail}`)
      .update({
        Token: Token,
        OSType: 'android',
      })
      .then(() => {
        console.log('Sucess Update Fcm Toekn In firestore. Toekn ');
      });
  }
};

export const RegisterSendBirdUser = async (
  SendBird: any,
  UserEmail: string,
  NickName: string,
  ProfileImageUrl: string,
) => {
  SendBird.updateCurrentUserInfo(
    NickName,
    ProfileImageUrl,
    async (user: any, err: any) => {
      console.log('In sendbird.updateCurrentUserInfo User:', user);
      if (!err) {
        console.log('Succes connect SendBird In Register SBconnect Function');
      } else {
        Alert.alert(
          `SbConnect Function In RegisterScreen에서에러가 난 이유 : ${err.message}`,
        );
      }
    },
  );
};
