import React, {useState} from 'react';
import {View, Button, Platform, Text, SafeAreaView, Alert,TextInput,
   StyleSheet , Pressable, Dimensions} from 'react-native';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';

import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import {login, getProfile} from '@react-native-seoul/kakao-login';
import { signIn, signUp } from "../UsefulFunctions/FirebaseAuth"
import firestore from '@react-native-firebase/firestore';
import styles from '../../styles/ManToManBoard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStackParamList';
import { TouchableOpacity } from 'react-native-gesture-handler';

export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, "InvitationCode">

const signInWithKakao = async navigation => {
  const token = await login();

  // console.warn(JSON.stringify(token));
  // Alert.alert('Alert Title', `${JSON.stringify(token)}`, [
  //   {
  //     text: 'Cancel',
  //     onPress: () => console.log('Cancel Pressed'),
  //     style: 'cancel',
  //   },
  //   {text: 'OK', onPress: () => console.log('OK Pressed')},
  // ]);
  GetKaKaoProfile(navigation);
};

const GetKaKaoProfile = async navigation => {
  const Profile = await getProfile();

  RegisterIdentityToken(Profile.id);
  navigation.navigate('BottomTab');
};

async function onAppleButtonPress(navigation: any) {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  // const {email, email_verified, is_private_email, sub} = jwt_decode(
  //   appleAuthRequestResponse.identityToken,
  // );
  // console.log(email, email_verified, is_private_email, sub);

  if (!appleAuthRequestResponse.identityToken) {
    throw new Error('Apple Sign-In failed - no identify token returned');
  }
  // firebase apple id 등록과 관련된 코드, 일단 주석처리해놈 - 704
  const {identityToken, nonce} = appleAuthRequestResponse;

  const appleCredential = auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  );

  const credentialState = await appleAuth.getCredentialStateForUser(
    appleAuthRequestResponse.user,
  );

  // const userCredential = await firebase
  //   .auth()
  //   .signInWithCredential(appleCredential);
  // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
  // console.warn(`Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);

  console.log('authorizationCode', appleAuthRequestResponse.authorizationCode);
  console.log('scopes', appleAuthRequestResponse.authorizedScopes);
  console.log('email', appleAuthRequestResponse.email);
  console.log('fullname', appleAuthRequestResponse.fullName);
  console.log('identifyToken', appleAuthRequestResponse.identityToken);
  console.log('nonce', appleAuthRequestResponse.nonce);
  console.log('state', appleAuthRequestResponse.state);
  console.log('user', appleAuthRequestResponse.user);
  console.log('authorized', appleAuth.State.AUTHORIZED);
  console.log('crentialstate', credentialState);
  // console.log('applecredential', appleCredential);

  // use credentialState response to ensure the user is authenticated
  // identityToken을 식별자로 일단 앱을 배포한다.
  if (credentialState === appleAuth.State.AUTHORIZED) {
    (appleAuthRequestResponse.user, navigation);
    auth().signInWithCredential(appleCredential);
    // navigation.navigate('SelectSubJect');
  }
}

const ValidInvitationCodeLength = (InvitationCode:string) => {
  if(InvitationCode.length ==6 ) {
    return true
  }

  return false
}

const ValidateInvitationCode = (InvitationCode:string, navigation:any) => {

  let Valid = ValidInvitationCodeLength(InvitationCode)
  if(Valid == false){
    Alert.alert("초대코드를 다시한번 확인해주세요")
    return
  }

  firestore()
  .collection("InvitationCodeList")
  .where('InvitationCode', '==', InvitationCode)
  .get()
  .then((querySnapshot)=>{
    let Valid = 0
    let length = querySnapshot.size
    let PkNumber
    console.log(length)
    querySnapshot.forEach((doc) => {
      if(length == 1 && doc.data().Used == false) {
        PkNumber = doc.data().Number
        Valid = 1
      } else if (length == 1 && doc.data().Used == true){
        Valid = 2
      }
    });

    let Obj = {
      Valid : Valid,
      PkNumber: PkNumber
    }
    return Obj
  }).then(async (Obj)=>{
    if(Obj.Valid == 1){
      navigation.navigate('CertificationScreen', {
        InvitationCode: InvitationCode,
        PkNumber: Obj.PkNumber
      })
    } else if (Obj.Valid == 0){
      Alert.alert("존재하지 않는 초대코드입니다.")
    } else if (Obj.Valid == 2){
      Alert.alert("이미 사용된 초대코드입니다")
    } 
  })

}

const ValidInvitationCodeScreen = () => {
  const [BorderBottomColor, setBorderBottomColor] = useState('lightgray');

  const [TextInputInvitationCode , setTextInputInvitationCode] = useState("AHfPqW")
  const navigation = useNavigation();
  
  const TextInputStyle = StyleSheet.create({
    TextInput: {
      width: '100%',
      height: '50%',
      borderBottomColor: BorderBottomColor,
      borderBottomWidth: 1,
      fontSize:18,
      fontWeight: '600',
      color:'black',
      // backgroundColor:'skyblue'
    },
    ViewStyle:{
      width: '100%',
      height: '40%',
      marginTop: '5%',
      display: 'flex',
      justifyContent: 'center',
    }
  })

  const InvitationCode = () => (
    <View
      style={TextInputStyle.ViewStyle}>
      <Text
        style={{
          color: 'lightgray',
        }}>
        초대코드 입력
      </Text>
      <TextInput
        style={
          TextInputStyle.TextInput
        }
        placeholder="초대코드를 입력해주세요"
        placeholderTextColor={'lightgray'}
        onFocus={() => {
          setBorderBottomColor('#0064FF');
        }}
        onEndEditing={() => {
          setBorderBottomColor('lightgray');
        }}
        value={TextInputInvitationCode}
        onChangeText={value => {
          setTextInputInvitationCode(value);
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
          marginLeft: '5%',
          // backgroundColor:'red'
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
            초대받은 번호로 등록을 시작해주세요
          </Text>
        </View>
        <View
          style={{
            height: '50%',
            width: '100%',
            // backgroundColor:'gray'
          }}>
          {InvitationCode()}
        </View>

        <Button title="즉시 회원가입으로 이동"
          onPress={()=>{
            navigation.navigate("RegisterScreen", {
              InvitationCode:"AHfPqW",
              Gender:1,
              PkNumber:0,
              imp_uid:""
            })
           
          }}
        />

        <View style={InvitationCodeStyles.CheckBox}>
        <Pressable
          style={InvitationCodeStyles.CheckBt}
          onPress={() => {
            ValidateInvitationCode(TextInputInvitationCode, navigation)
          }}>
          <Text style={InvitationCodeStyles.CheckText}>다음</Text>
        </Pressable>


      </View>

      <View style={[{
        position:'absolute',
        bottom:'3%',
        width:'100%'
      }]}>
       <Pressable
          style={[styles.RowCenter]}
          onPress={() => {
            navigation.navigate('LoginScreen')
          }}>
          <Text>이미 계정이 있습니다 ></Text>

        </Pressable>

      </View>

     

     
     
      </View>
    </SafeAreaView>
  );
};


const InvitationCodeStyles = StyleSheet.create({
  NotMyCellPhoneText: {
    fontSize: 22,
    color: 'gray',
    marginTop: 10,
    // backgroundColor: 'black'
  },
  CheckBox: {
    width:'100%',
    height:'10%',
    position:'absolute',
    bottom:'8%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0064FF',
    borderRadius:25
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

export default ValidInvitationCodeScreen;
