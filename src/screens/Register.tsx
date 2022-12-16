import React, {useContext, useState} from 'react';
import {View, Button, Platform, Text, SafeAreaView, Alert,TextInput, StyleSheet , Pressable} from 'react-native';

import { signIn, signUp } from "../UsefulFunctions/FirebaseAuth"
import firestore from '@react-native-firebase/firestore';

import {NativeStackScreenProps} from "@react-navigation/native-stack"
import { RootStackParamList } from './RootStackParamList';

import { RegisterUserData } from "../UsefulFunctions/SaveUserDataInDevice"
import { LoginAndReigsterStyles } from '../../styles/LoginAndRegiser';

import AppContext from "../UsefulFunctions/Appcontext"
import axios from 'axios';
import qs from 'qs'


export type Register2ScreenProps = NativeStackScreenProps<RootStackParamList, "InvitationCodeSet">;
const SBConnect = async (SendBird:any, UserEmail:string, NickName:string) => {
  SendBird.connect(UserEmail, (user:any, err:any) => {
    console.log('In Sendbird.connect CallbackFunction User:', user);
    // 에러가 존재하지 않으면
    if (!err) {
      // 유저 닉네임 중복 방지
      if (user.nickname !== NickName) {
        SendBird.updateCurrentUserInfo(
          NickName,
          'https://blog.kakaocdn.net/dn/tEMUl/btrDc6957nj/NwJoDw0EOapJNDSNRNZK8K/img.jpg',
          (user:any, err:any) => {
            console.log('In sendbird.updateCurrentUserInfo User:', user);
            if (!err) {
            } else {
              Alert.alert(`에러가 난 이유 : ${err.message}`)
            }
          },
        );
      } 
    } else {
      Alert.alert(`에러가 난 이유 : ${err.message}`)
    }
  });
};

const SignUpWithEmail = async (navigation:any, Email:string, Password:string , Gender:number, InvitationCode:string, PkNumber:number
  ,NickName:string, SendBird:any) => {
  let BasicImageUrl = BasicImage(Gender)
  
  try {
    const result = await signUp({email: Email, password:Password})
    Alert.alert("회원가입 완료")
    // await InvitationCodeToFriend를 서버로부터 가져오는 함수 
    let UserEmail:string = result.user.email
    await SignUpFirestore(UserEmail,Gender, BasicImageUrl, InvitationCode,PkNumber,NickName)
    
    await RegisterUserData(UserEmail, navigation)
    await SBConnect(SendBird, UserEmail, NickName)
    UpdateInvitationCodeToFriend(InvitationCode)
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

const SignUpFirestore = async (Email:string,GenderNumber:number, BasicImageUrl:any, InvitationCode:string,
  PkNumber:number,NickName:String) => {


  firestore().collection("UserList").doc(Email).set({
    UserEmail:Email,
    Gender:GenderNumber,
    ProfileImageUrl:BasicImageUrl,
    InvitationCode: InvitationCode,
    PkNumber: PkNumber,
    NickName:NickName
  })
}

const BasicImage = (Gender:number) => {
  if(Gender == 1){
    return "https://firebasestorage.googleapis.com/v0/b/hunt-d7d89.appspot.com/o/ProfileImage%2FMans%2FBasicSetting%2FBasicSettingM.jpeg?alt=media&token=1e7d09a6-81e7-42bf-a01c-ad36fab58069"
  }else if(Gender == 2){
    return "https://firebasestorage.googleapis.com/v0/b/hunt-d7d89.appspot.com/o/ProfileImage%2FGrils%2FBasicSetting%2FBasicSetting.jpeg?alt=media&token=fd69ef3f-cde5-4a36-a657-765f8ba9d42d"
  }
  return ""
}



const UpdateInvitationCodeToFriend = (InvitationCode:string) => {
 
  fetch('http:/13.124.209.97/invitation/InvitationCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: qs.stringify({
      'InvitationCode': `${InvitationCode}`
    })
  
  });

}
 
    


const ReigsterScreen = ({navigation, route}:Register2ScreenProps) => {
  const {InvitationCode} = route.params
  const {Gender} = route.params
  const GenderNumber = Number(Gender)
  const {PkNumber} = route.params
  const {imp_uid} = route.params

  console.log('imp_uid', imp_uid)

  const SendBird = useContext(AppContext)

  console.log(SendBird)



  // console.log(InvitationCode)

  const [BorderBottomColor2, setBorderBottomColor2] = useState('lightgray');
  const [BorderBottomColor3, setBorderBottomColor3] = useState('lightgray');
  const [NickNameBorderBottomColor, setNickNameBorderBottomColor] = useState('lightgray');

  const [TextInputEmail , setTextInputEmail] = useState("8269apk9@naver.com")
  const [TextInputPassword , setTextInputPassword] = useState("123456")
  const [NickName , setNickName] = useState("Taeheon9")

  
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
        height: '25%',
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
        placeholder="가입하실 이메일을 입력해주세요"
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

  const NickNameTextInput = () => (
    <View
      style={TextInputStyle(null).ViewStyle}>
      <Text
        style={{
          color: 'lightgray',
        }}>
        닉네임 입력
      </Text>
      <TextInput
        style={TextInputStyle(NickNameBorderBottomColor).TextInput}
        placeholder="닉네임을 입력해주세요"
        placeholderTextColor={'lightgray'}
        onFocus={() => {
          setNickNameBorderBottomColor('#0064FF');
        }}
        onEndEditing={() => {
          setNickNameBorderBottomColor('lightgray');
        }}
        value={NickName}
        onChangeText={value => {
          setNickName(value);
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
          {NickNameTextInput()}
        </View>
       

        <View style={LoginAndReigsterStyles.CheckBox}>
        <Pressable
          style={LoginAndReigsterStyles.CheckBt}
          onPress={() => {
            if(NickName != "") {
              SignUpWithEmail(navigation, TextInputEmail, TextInputPassword,GenderNumber,InvitationCode, PkNumber, NickName, SendBird)
            } else {
              Alert.alert("닉네임을 입력해주세요")
            }
          }}>
          <Text style={LoginAndReigsterStyles.CheckText}>다음</Text>
        </Pressable>
      </View>
     
      </View>
    </SafeAreaView>
  );
};



export default ReigsterScreen;


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