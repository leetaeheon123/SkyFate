import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-community/async-storage'
import { Alert,Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging';

export const GetUserData = async (userEmail:string) => {

    return (
      firestore()
      .collection("UserList")
      .doc(`${userEmail}`)
      .get()
      .then((doc)=>{
        console.log("GetUserData",doc.data())
        const Result = doc.data()
        return Result
    })
    )
  }



export const SaveUserDataInDevice = async (UserEmail:string,UserDataForSendBird:any) => {
  const UserData:Object = await GetUserData(UserEmail)
  const DataWithSendBirdData = {...UserData, ...UserDataForSendBird}
  console.log("UserDataForSendBird In SaveUserDataInDevice:", UserDataForSendBird)

  console.log("DataWithSendBirdData In SaveUserDataInDevice:", DataWithSendBirdData)
  await AsyncStorage.setItem('UserData', JSON.stringify(DataWithSendBirdData));
}

export const RegisterUserData = async (UserEmail:any, navigation:any, UserDataForSendBird:any, SendBird:Object) => {
  try {
    await SaveUserDataInDevice(UserEmail,UserDataForSendBird)
    await RegisterSendBirdToken(SendBird,UserEmail)
    await navigation.navigate('IndicatorScreen', {
      From:"LoginAndRegister"
    });
  } catch (error) {
    Alert.alert('RegisterUserData Function In  SaveUserDataInDevice UsefulFunctions에서 오류 발생:',error);
  }
}

const RegisterSendBirdToken = async (SendBird:Object, UserEmail:string) => {
  try {
    const authorizationStatus = await messaging().requestPermission();
    if (
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      if (Platform.OS === 'ios') {
        const Token = await messaging().getAPNSToken();
        console.log('iostoken', Token);
        UpdateFCMToken(UserEmail, Token)
        SendBird.registerAPNSPushTokenForCurrentUser(Token);
      } else {
        const Token = await messaging().getToken();
        UpdateFCMToken(UserEmail, Token)
        console.log('aostoken', Token);
        SendBird.registerGCMPushTokenForCurrentUser(Token);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const UpdateFCMToken = (UserEmail:string, Token:string) => {

  if (Platform.OS === 'ios') {
    firestore()
    .collection("UserList")
    .doc(`${UserEmail}`)
    .update({
      iosFcmToken: Token
    })
    .then(()=>{
      console.log("Sucess Update Fcm Toekn In firestore. Toekn ")
    })
  } else {
    firestore()
    .collection("UserList")
    .doc(`${UserEmail}`)
    .update({
      aosFcmToken: Token
    })
    .then(()=>{
      console.log("Sucess Update Fcm Toekn In firestore. Toekn ")
    })
  }

}