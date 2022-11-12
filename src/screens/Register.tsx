import React, {useState} from 'react';
import {View, Button, Platform, Text, SafeAreaView, Alert,TextInput, StyleSheet , Pressable} from 'react-native';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';

import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import {login, getProfile} from '@react-native-seoul/kakao-login';
import { signIn, signUp } from "../UsefulFunctions/FirebaseAuth"

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



async function RegisterIdentityToken(IdentityToken:any, navigation:any) {
  try {
    await AsyncStorage.setItem('IdentityToken', IdentityToken);
    await AsyncStorage.setItem("ProfileImageUrl", "https://firebasestorage.googleapis.com/v0/b/hunt-d7d89.appspot.com/o/ProfileImage%2FGrils%2FBasicSetting%2FBasicSetting.jpeg?alt=media&token=fd69ef3f-cde5-4a36-a657-765f8ba9d42d");
    
    navigation.navigate('MapScreen');
  } catch (error) {
    console.log('IdentityToken 저장 중 오류:', error);
    // Error saving data
  }
}

// function GetIdentityToken(va) {
//   AsyncStorage.getItem('IdentityToken', (err, result) => {
//     // console.log(result);
//     va = result;
//     console.log('va', va);
//   });

//   return va;

//   // return value;
// }

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

const LoginWithEmail = async (navigation:any) => {

  try {
    const result = await signIn({email: "apk8269@gmail.com", password:"123456"})
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

const RegisterInputGenerater = (props:any) => {
  return (
    <View style={styles.InputBox}>
      <Text style={styles.text}>{props.Name}</Text>
      <TextInput
        value={props.value}
        style={styles.input}
        onChangeText={value => {
          props.StateChange(value);
        }}
        // autoCapitalize={props.autoCapitalize}
        // autoCapitalize='none'
        autoCorrect={props.autoCorrect}>
        </TextInput>
      <View style={styles.UnderLine} />
    </View>
  );
};

function RegisterScreen() {

  const KaKaoLoginButton = () => {
    return (
      <Button 
      title="kakao login"
      onPress={async () => {
        signInWithKakao(navigation);
      }}>
      </Button>
    )
   
  }

  const AppleLoginButton =  <AppleButton
  buttonStyle={AppleButton.Style.BLACK}
  buttonType={AppleButton.Type.SIGN_IN}
  style={{
    width: 160, // You must specify a width
    height: 45, // You must specify a height
  }}
  onPress={() => onAppleButtonPress(navigation)}
  />

  
  const navigation = useNavigation();

  const [TextInputEmail , setTextInputEmail] = useState("")
  const [TextInputPassword , setTextInputPassword] = useState("")

  return (
    <>
      {/* <Button
        title="removeItem"
        onPress={() => {
          RemoveIdentity();
        }}></Button> */}
      <SafeAreaView>
        {/* {Platform.OS === 'android' ? (
          KaKaoLoginButton()
        ) : (
          AppleLoginButton
        )} */}

          <RegisterInputGenerater
            Name="Email"
            value={TextInputEmail}
            StateChange={setTextInputEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />

        <Button title="직접로그인" onPress={() => {
          LoginWithEmail(navigation)
        }}></Button>
      </SafeAreaView>
    </>
  );
}

const TossReigsterScreen = () => {
  const [BorderBottomColor, setBorderBottomColor] = useState('lightgray');
  const [BorderBottomColor2, setBorderBottomColor2] = useState('lightgray');

  const [TextInputEmail , setTextInputEmail] = useState("")
  const [TextInputPassword , setTextInputPassword] = useState("")
  const navigation = useNavigation();


  const EmailTextInput = () => (
    <View
      style={{
        width: '100%',
        height: '40%',
        marginTop: '5%',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: 'lightgray',
        }}>
        이메일 입력
      </Text>
      <TextInput
        style={{
          width: '100%',
          height: '50%',
          // backgroundColor: 'white',
          borderBottomColor: BorderBottomColor,
          borderBottomWidth: 1,
          fontSize:18,
          fontWeight: '600',
          color:'black'
        }}
        placeholder="가입하신 이메일을 입력해주세요"
        onFocus={() => {
          setBorderBottomColor('#0064FF');
        }}
        onEndEditing={() => {
          setBorderBottomColor('lightgray');
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
      style={{
        width: '100%',
        height: '40%',
        marginTop: '5%',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: 'lightgray',
        }}>
        초대코드 입력
      </Text>
      <TextInput
        style={{
          width: '100%',
          height: '50%',
          // backgroundColor: 'white',
          borderBottomColor: BorderBottomColor2,
          borderBottomWidth: 1,
          fontSize:18,
          fontWeight: '600',
          color:'black'

        }}
        placeholder="초대코드를 입력해주세요"
        onFocus={() => {
          setBorderBottomColor2('#0064FF');
        }}
        onEndEditing={() => {
          setBorderBottomColor2('lightgray');
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
            초대받은 번호로 등록을 시작해주세요
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
            LoginWithEmail(navigation)
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

export default TossReigsterScreen;

