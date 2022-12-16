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



export const SaveUserDataInDevice = async (UserEmail:string) => {
  const UserData:string = await GetUserData(UserEmail)
  await AsyncStorage.setItem('UserData', JSON.stringify(UserData));
}

export const RegisterUserData = async (UserEmail:any, navigation:any) => {
  try {
    await SaveUserDataInDevice(UserEmail)
    await navigation.navigate('IndicatorScreen');
  } catch (error) {
    Alert.alert('UserData를 디바이스에 저장 중 오류 발생:');
  }
}

  