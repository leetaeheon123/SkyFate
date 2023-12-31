import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  TextInput,
  Pressable,
  Keyboard,
} from 'react-native';

import {signUp} from '../../UsefulFunctions/FirebaseAuth';
import firestore from '@react-native-firebase/firestore';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '..//RootStackParamList';
import {
  LoginAndRegisterTextInputStyle,
  LoginAndReigsterStyles,
} from '../../../styles/LoginAndRegiser';
import {RegisterUserUid} from '../../UsefulFunctions/SaveUserDataInDevice';
import {AppContext} from '../../UsefulFunctions/Appcontext';
import qs from 'qs';
import {Btn_ClickableNext, Btn_NotClickableNext} from 'component/Profile';
import {
  MainText_RegisterSvg,
  SubText_EmailSvg,
  SubText_PasswordSvg,
} from 'component/SignInUp/SignInUp';
import {LongLineFixSvg} from 'component/General/GeneralSvg';
import {HPer50} from '~/Per';
import {Btn_ClickableBack} from 'component/General';
export type Register2ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InvitationCodeSet'
>;

const SignUpWithEmail = async (
  navigation: any,
  Email: string,
  Password: string,
  InvitationCode: string,
  PkNumber: number,
  SendBird: any,
  CodeType: string,
) => {
  // let BasicImageUrl = BasicImage(Gender)

  try {
    const result = await signUp({email: Email, password: Password});
    // await InvitationCodeToFriend를 서버로부터 가져오는 함수
    let UserEmail: string = result.user.email;
    let UserUid: string = result.user.uid;
    await SignUpFirestore(UserEmail, InvitationCode, PkNumber, UserUid);
    // await UpdateInvitationCodeToFriend(InvitationCode, CodeType, UserUid);
    await RegisterUserUid(UserUid, navigation, SendBird);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('이메일이 이미 사용되었습니다');
    }
    if (error.code === 'auth/invalid-email') {
      Alert.alert(
        '해당 이메일값이 유효하지 않습니다. 다시한번 이메일을 확인해주세요',
      );
    }
    if (error.code === 'auth/weak-password') {
      Alert.alert('비밀번호가 6자리 이상이여야 합니다.');
    }
    console.log('error In SignUp:', error);
  }
};

const SignUpFirestore = async (
  Email: string,
  InvitationCode: string,
  PkNumber: number,
  UserUid: string,
) => {
  firestore().collection('UserList').doc(UserUid).set({
    UserEmail: Email,
    InvitationCode: InvitationCode,
    PkNumber: PkNumber,
    Grade: 0,
    TensionGrade: 0,
    MannerGrade: 0,
    SocialGrade: 0,
    ProfileImageUrl: null,
    ProfileImageUrl2: null,
    ProfileImageUrl3: null,
    ProfileImageUrl4: null,
    ProfileImageUrl5: null,
    ProfileImageUrl6: null,
    Type: 'User',
    Uid: UserUid,

    // DesiredBdsm:null,
    // DesiredGender:null,
    // DetailBdsm:null,

    // Lgbt:null,
    // Likes:null,
    // Location:null,
    // matches:null,
    // metoo:null,

    // IsPossibleMonoGamy:null,
    // // 이동 가능여부
    // MyAvailability: null,
    // IsPossibleMyOnlinePlay: null,
    // MyIntro: null,
    // IsUnder18: null,
    // MyWantIntro: null,
    // MyWantType: null,
  });
};

const UpdateInvitationCodeToFriend = async (
  InvitationCode: string,
  CodeType: string,
  UserUid: string,
) => {
  if (CodeType == 'Special') {
    fetch('http:/13.124.209.97/invitation/SpecialInvitationCode', {
      // fetch('https:/10.0.2.2:3000/invitation/SpecialInvitationCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({
        UserEmail: `${UserUid}`,
      }),
    }).then((Result) => {
      console.log('Result In UpdateInvitationCodeToFriend Function:', Result);
    });
  } else if (CodeType == 'General') {
    // fetch('https:/10.0.2.2:3000/invitation/InvitationCode', {
    fetch('http:/13.124.209.97/invitation/InvitationCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({
        InvitationCode: `${InvitationCode}`,
        UserEmail: `${UserUid}`,
      }),
    }).then((Result) => {
      console.log('Result In UpdateInvitationCodeToFriend Function:', Result);
    });
  }
};

const ReigsterScreen = ({navigation, route}: Register2ScreenProps) => {
  const {InvitationCode, CodeType, PkNumber} = route.params;

  // const {Gender} = route.params
  // const GenderNumber = Number(Gender)
  // const {NickName} = route.params

  // console.log("Gender In RegisterScreen:",Gender)
  console.log('InvitationCode In RegisterScreen:', InvitationCode);
  console.log('PkNumber In RegisterScreen:', PkNumber);
  // console.log('imp_uid In RegisterScreen', imp_uid)

  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const [TextInputEmail, setTextInputEmail] = useState('');
  const [TextInputPassword, setTextInputPassword] = useState('');

  const [Selected, setSelected] = useState('');
  const EmailTextInput = () => (
    <View style={LoginAndRegisterTextInputStyle().ViewStyle}>
      {SubText_EmailSvg()}
      <TextInput
        style={[
          LoginAndRegisterTextInputStyle().TextInput,
          {borderBottomColor: Selected == 'Email' ? 'white' : 'lightgray'},
        ]}
        placeholder="가입하실 이메일을 입력해주세요"
        placeholderTextColor={'lightgray'}
        onFocus={() => {
          setSelected('Email');
        }}
        onEndEditing={() => {
          setSelected('');
        }}
        value={TextInputEmail}
        onChangeText={(value) => {
          setTextInputEmail(value);
        }}
      />

      {Selected == 'Email' ? LongLineFixSvg() : null}
    </View>
  );

  const PasswordTextInput = () => (
    <View style={LoginAndRegisterTextInputStyle().ViewStyle}>
      {SubText_PasswordSvg()}

      <TextInput
        style={[
          LoginAndRegisterTextInputStyle().TextInput,
          {borderBottomColor: Selected == 'Password' ? 'white' : 'lightgray'},
        ]}
        placeholder="비밀번호를 입력해주세요"
        placeholderTextColor={'lightgray'}
        onFocus={() => {
          setSelected('Password');
        }}
        onEndEditing={() => {
          setSelected('');
        }}
        value={TextInputPassword}
        onChangeText={(value) => {
          setTextInputPassword(value);
        }}
      />
      {Selected == 'Password' ? LongLineFixSvg() : null}
    </View>
  );

  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <Btn_ClickableBack
          width={12}
          style={{position: 'absolute', top: 12, left: '-2.5%'}}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={LoginAndReigsterStyles.Description}>
          {MainText_RegisterSvg()}
        </View>
        <View
          style={{
            height: HPer50,
            width: '100%',
          }}>
          <Pressable
            style={{
              width: '100%',
              height: '100%',
            }}
            onPress={() => Keyboard.dismiss()}>
            {EmailTextInput()}
            {PasswordTextInput()}
          </Pressable>
        </View>
        {TextInputPassword.length >= 6 && TextInputEmail.length >= 6 ? (
          <Btn_ClickableNext
            onPress={() => {
              SignUpWithEmail(
                navigation,
                TextInputEmail,
                TextInputPassword,
                InvitationCode,
                PkNumber,
                SendBird,
                CodeType,
              );
            }}
          />
        ) : (
          <Btn_NotClickableNext />
        )}
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
