import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-community/async-storage'
import { Alert } from 'react-native'
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

export const RegisterUserData = async (UserEmail:any, navigation:any, UserDataForSendBird:any) => {
  try {
    await SaveUserDataInDevice(UserEmail,UserDataForSendBird)
    await navigation.navigate('IndicatorScreen', {
      From:"LoginAndRegister"
    });
  } catch (error) {
    Alert.alert('UserData를 디바이스에 저장 중 오류 발생:');
  }
}

  