import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const GetUserData = async (UserUid: string) => {
  return firestore()
    .collection('UserList')
    .doc(`${UserUid}`)
    .get()
    .then((doc) => {
      console.log('Success GetUserData');
      const Result = doc.data();
      return Result;
    });
};

export const SaveUserUidInDevice = async (UserUid: string) => {
  await AsyncStorage.setItem('UserUid', UserUid);
};

export const RegisterUserUid = async (
  UserUid: string,
  navigation: any,
  SendBird: Object,
) => {
  try {
    await SaveUserUidInDevice(UserUid);
    // await RegisterSendBirdToken(SendBird, UserUid);
    await navigation.navigate('AgreementScreen', {
      UserUid,
    });
  } catch (error) {
    Alert.alert(
      'RegisterUserUid Function In  SaveUserDataInDevice.js의 UsefulFunctions에서 오류 발생:',
      error,
    );
  }
};

export const LoginUserUid = async (UserUid: string, navigation: any) => {
  try {
    await SaveUserUidInDevice(UserUid);
    // await RegisterSendBirdToken(SendBird, UserUid);
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

export const RegisterSendBirdToken = async (SendBird: any, UserUid: string) => {
  try {
    const authorizationStatus = await messaging().requestPermission();
    if (
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      if (Platform.OS === 'ios') {
        const Token = await messaging().getAPNSToken();
        console.log('iostoken', Token);
        SendBird.registerAPNSPushTokenForCurrentUser(Token);

        // UpdateFCMToken(UserUid, Token);
      } else {
        const Token = await messaging().getToken();
        console.log('aostoken', Token);

        SendBird.registerGCMPushTokenForCurrentUser(Token);
        // UpdateFCMToken(UserUid, Token);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const UpdateFCMToken = (UserUid: string, Token: string) => {
  if (Platform.OS === 'ios') {
    firestore()
      .collection('UserList')
      .doc(`${UserUid}`)
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
      .doc(`${UserUid}`)
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
  UserUid: string,
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
