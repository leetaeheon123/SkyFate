import React, {useState} from 'react';
import {View, Button, Platform, Text, SafeAreaView, Alert,TextInput, StyleSheet , Pressable} from 'react-native';

import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { signIn, signUp } from "../UsefulFunctions/FirebaseAuth"
import firestore from '@react-native-firebase/firestore';

import {NativeStackScreenProps} from "@react-navigation/native-stack"
import { RootStackParamList } from './RootStackParamList';

export type Register2ScreenProps = NativeStackScreenProps<RootStackParamList, "InvitationCode">;


async function RegisterIdentityToken(IdentityToken:any, navigation:any,BasicImageUrl:any) {

  
  try {
    await AsyncStorage.setItem('IdentityToken', IdentityToken);
    await AsyncStorage.setItem("ProfileImageUrl", BasicImageUrl);
    
    navigation.navigate('MapScreen');
  } catch (error) {
    console.log('IdentityToken 저장 중 오류:', error);
    // Error saving data
  }
}


const LoginWithEmail = async (navigation:any, Email:string, InvitationCode:string) => {

  try {
    const result = await signIn({email: Email, password:InvitationCode})
    // console.log(result)
    let uid = result.user.email
    RegisterIdentityToken(uid, navigation)

  } 
  catch (error) {
    if(error.code === "auth/wrong-password") {
      Alert.alert("이메일은 존재하나 비밀번호가 다릅니다.")
      //  == 추천인 코드가 다른상황 
    }
    if(error.code === "auth/user-not-found") {
      Alert.alert("해당 이메일이 없습니다. 다시한번 이메일을 확인해주세요")
      // 추천인 코드는 있으나, 
    }
    
  }
}

const SignUpWithEmail = async (navigation:any, Email:string, Password:string , Gender:string, InvitationCode:string) => {
  let BasicImageUrl = BasicImage(Gender)
  let GenderNumber = ParseIntGender(Gender)
  
  try {
    const result = await signUp({email: Email, password:Password})
    Alert.alert("회원가입 완료")
    let UserEmail = result.user.email
    RegisterIdentityToken(UserEmail, navigation,BasicImageUrl)
    SignUpFirestore(Email,GenderNumber, BasicImageUrl)
    CheckInvitationCode(InvitationCode)
  } 
  catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert("이메일이 이미 사용되었습니다")
    }

    if (error.code === 'auth/invalid-email') {
      Alert.alert("해당 이메일값이 유효하지 않습니다. 다시한번 이메일을 확인해주세요")
    }

    if (error.code ==='auth/weak-password') {
      Alert.alert('비밀번호가 6자리 이상이여야 합니다.')

    }
    console.log(error.code) 
  }
}

const SignUpFirestore = async (Email:string,GenderNumber:number, BasicImageUrl:any) => {
  firestore().collection("UserList").doc(Email).set({
    Gender:GenderNumber,
    ProfileImageUrl:BasicImageUrl
  })
}

const BasicImage = (Gender:string) => {
  if(Gender =="M"){
    return "https://firebasestorage.googleapis.com/v0/b/hunt-d7d89.appspot.com/o/ProfileImage%2FMans%2FBasicSetting%2FBasicSettingM.jpeg?alt=media&token=1e7d09a6-81e7-42bf-a01c-ad36fab58069"
  }else if(Gender == "G"){
    return "https://firebasestorage.googleapis.com/v0/b/hunt-d7d89.appspot.com/o/ProfileImage%2FGrils%2FBasicSetting%2FBasicSetting.jpeg?alt=media&token=fd69ef3f-cde5-4a36-a657-765f8ba9d42d"
  }
  return ""
}

const ParseIntGender = (Gender:string) => {
  if(Gender == "M") {
    return 1
  } else if( Gender == "G"){
    return 2
  } 
  return 0 
}

const CheckInvitationCode = (InvitationCode:string) => {
  firestore()
  .collection("InvitationCodeList")
  .where('InvitationCode', '==', InvitationCode)
  .get()
  .then((querySnapshot)=>{
    let InvitationCodeNumber
    querySnapshot.forEach((doc) => {
      InvitationCodeNumber = doc.data().Number
      console.log(doc.id, "=>", InvitationCodeNumber);
    });

    return InvitationCodeNumber
  }).then((InvitationCodeNumber)=>{
    firestore()
    .collection("InvitationCodeList")
    .doc(String(InvitationCodeNumber))
    .update({
      Used:true
    })
  })
}

const TossReigsterScreen2 = ({navigation, route}:Register2ScreenProps) => {
  const {InvitationCode} = route.params
  const {Gender} = route.params

  // console.log(InvitationCode)

  const [BorderBottomColor2, setBorderBottomColor2] = useState('lightgray');
  const [BorderBottomColor3, setBorderBottomColor3] = useState('lightgray');

  const [TextInputEmail , setTextInputEmail] = useState("")
  const [TextInputPassword , setTextInputPassword] = useState("")
  
  const TextInputStyle =  (BorderBottomColor:any) =>  StyleSheet.create({
    TextInput: {
      width: '100%',
      height: '50%',
      borderBottomColor: BorderBottomColor,
      borderBottomWidth: 1,
      fontSize:18,
      fontWeight: '600',
      color:'black'
    },
    ViewStyle:{
      width: '100%',
        height: '40%',
        marginTop: '5%',
        display: 'flex',
        justifyContent: 'center',
    }
  })

  const EmailTextInput = () => (
    <View
      style={TextInputStyle(null).ViewStyle}>
      <Text
        style={{
          color: 'lightgray',
        }}>
        이메일 입력
      </Text>
      <TextInput
        style={TextInputStyle(BorderBottomColor2).TextInput}
        placeholder="가입하신 이메일을 입력해주세요"
        placeholderTextColor={'lightgray'}
        onFocus={() => {
          setBorderBottomColor2('#0064FF');
        }}
        onEndEditing={() => {
          setBorderBottomColor2('lightgray');
        }}
        value={TextInputEmail}
        onChangeText={value => {
          setTextInputEmail(value);
        }}
      />
    </View>
  );

  const PasswordTextInput = () => (
    <View
    style={TextInputStyle(null).ViewStyle}>
      <Text
        style={{
          color: 'lightgray',
        }}>
        비밀번호 입력
      </Text>
      <TextInput
        style={TextInputStyle(BorderBottomColor3).TextInput}
        placeholder="비밀번호를 입력해주세요"
        placeholderTextColor={'lightgray'}
        onFocus={() => {
          setBorderBottomColor3('#0064FF');
        }}
        onEndEditing={() => {
          setBorderBottomColor3('lightgray');
        }}
        value={TextInputPassword}
        onChangeText={value => {
          setTextInputPassword(value);
        }}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
      }}>
      <View
        style={{
          width: '90%',
          height: '100%',
          // backgroundColor: 'red',
          marginLeft: '5%',
        }}>
        <View
          style={{
            height: '15%',
            width: '100%',
            // backgroundColor: 'skyblue',
            display: 'flex',
            justifyContent: 'flex-end',
            
          }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color:'black'
            }}>
            회원가입을 시작해주세요
          </Text>
        </View>
        <View
          style={{
            height: '50%',
            width: '100%',
          }}>
          {EmailTextInput()}
          {PasswordTextInput()}
        </View>

        <View style={styles.CheckBox}>
        <Pressable
          style={styles.CheckBt}
          onPress={() => {
            SignUpWithEmail(navigation, TextInputEmail, TextInputPassword,Gender,InvitationCode)
          }}>
          <Text style={styles.CheckText}>다음</Text>
        </Pressable>
      </View>
     
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  NotMyCellPhoneText: {
    fontSize: 22,
    color: 'gray',
    marginTop: 10,
    // backgroundColor: 'black'
  },
  CheckBox: {
    width:'100%',
    height:'10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0064FF'
  },
  CheckText: {
    fontSize: 16,
    color: 'white',
  },
  CheckBt: {
    width: '90%',
    height: 55,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '##0064FF',
  },
  Container: {
    flex: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    // justifyContent: 'center'
  },
  Container_NextBUtton: {
    justifyContent: 'flex-end',
  },
  input: {
    height: 40,
    width: '100%',
    fontsize: 22,
    marginTop: 2,
  },
  UnderLine: {
    height: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  text: {
    // backgroundColor: 'blue'
    padding: 1,
    color: 'blue',
  },
  InputBox: {
    // alignItems: 'flex-start',
    width: '90%',
    marginBottom: 15,
    // backgroundColor: 'gray'
  },
  NotificationTextView: {
    fontSize: 22,
    fontWeight: '600',
    color: 'black',
  },
  
});

export default TossReigsterScreen2;


// function RegisterScreen() {

//   const KaKaoLoginButton = () => {
//     return (
//       <Button 
//       title="kakao login"
//       onPress={async () => {
//         signInWithKakao(navigation);
//       }}>
//       </Button>
//     )
   
//   }

//   const AppleLoginButton =  <AppleButton
//   buttonStyle={AppleButton.Style.BLACK}
//   buttonType={AppleButton.Type.SIGN_IN}
//   style={{
//     width: 160, // You must specify a width
//     height: 45, // You must specify a height
//   }}
//   onPress={() => onAppleButtonPress(navigation)}
//   />

  
//   const navigation = useNavigation();

//   const [TextInputEmail , setTextInputEmail] = useState("")
//   const [TextInputPassword , setTextInputPassword] = useState("")

//   return (
//     <>
//       {/* <Button
//         title="removeItem"
//         onPress={() => {
//           RemoveIdentity();
//         }}></Button> */}
//       <SafeAreaView>
//         {/* {Platform.OS === 'android' ? (
//           KaKaoLoginButton()
//         ) : (
//           AppleLoginButton
//         )} */}

//           <RegisterInputGenerater
//             Name="Email"
//             value={TextInputEmail}
//             StateChange={setTextInputEmail}
//             autoCapitalize="none"
//             autoCorrect={false}
//           />

//         <Button title="직접로그인" onPress={() => {
//           LoginWithEmail(navigation)
//         }}></Button>
//       </SafeAreaView>
//     </>
//   );
// }