import React, {useState} from 'react';
import {
  View,
  Button,
  Platform,
  Text,
  SafeAreaView,
  Alert,
  TextInput,
  StyleSheet,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  Image,
} from 'react-native';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';

import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import {login, getProfile} from '@react-native-seoul/kakao-login';
import firestore from '@react-native-firebase/firestore';
import styles from '../../styles/ManToManBoard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from './RootStackParamList';
import {LoginAndReigsterStyles} from '../../styles/LoginAndRegiser';
import {Btn_ClickableNext} from 'component/Profile';

import {
  MainText_InvitationSvg,
  SubTextComponent,
  SubText_InvitationSvg,
} from 'component/ProfileInput/ProfileSvg';
import {LineSvg, LongLineSvg} from 'component/General/GeneralSvg';
import {GetFbFirestore} from '^/Firebase';

import Fire from 'Assets/Gif/Fire.gif';

export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InvitationCode'
>;

const signInWithKakao = async (navigation) => {
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

const GetKaKaoProfile = async (navigation) => {
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
    appleAuthRequestResponse.user, navigation;
    auth().signInWithCredential(appleCredential);
    // navigation.navigate('SelectSubJect');
  }
}

const GetPkNumber = async () => {
  const Result = await firestore().collection('UserList').get();
  const Size = Result.size;
  console.log(Size);
  return Size;
};

const ValidInvitationCodeLength = (InvitationCode: string) => {
  if (InvitationCode.length == 6) {
    return true;
  }

  return false;
};

const ValidateInvitationCode = async (
  InvitationCode: string,
  navigation: any,
) => {
  let Valid = ValidInvitationCodeLength(InvitationCode);
  if (Valid == false) {
    Alert.alert('초대코드를 다시한번 확인해주세요');
    return;
  }

  let SpecialInvitationCode = await GetFbFirestore('InvitationCode', 'Special');
  let SpecialArray: string[] = [];

  for (const property in SpecialInvitationCode) {
    const value = SpecialInvitationCode[property]['InvitationCode'];
    SpecialArray = [...SpecialArray, value];
  }

  const isincludesSpecialArray = SpecialArray.includes(InvitationCode);
  console.log(isincludesSpecialArray);
  if (isincludesSpecialArray == true) {
    SpecialInvitation(InvitationCode, navigation);
  } else {
    GenearlInvitation(InvitationCode, navigation);
  }
};

const Jump = async (InvitationCode: string = '', navigation: any) => {
  const PkNumber = await GetPkNumber();
  let Valid = 1;
  let Obj = {
    Valid: Valid,
    PkNumber: PkNumber,
    CodeType: 'General',
  };

  navigation.navigate('RegisterScreen', {
    InvitationCode: InvitationCode,
    PkNumber: Obj.PkNumber,
    CodeType: Obj.CodeType,
  });
};

const CheckUsed = (querySnapshot: any): number => {
  let length = querySnapshot.size;
  let Valid = 0;

  querySnapshot.forEach((doc: any) => {
    console.log('CheckUsed data:', doc.data().Used);

    if (length == 1 && doc.data().Used == false) {
      Valid = 1;
    } else if (length == 1 && doc.data().Used == true) {
      Valid = 2;
    }
  });

  return Valid;
};

const GenearlInvitation = async (InvitationCode: string, navigation: any) => {
  const PkNumber = await GetPkNumber();
  firestore()
    .collection('InvitationCodeList')
    .where('InvitationCode', '==', InvitationCode)
    .get()
    .then((querySnapshot) => {
      // 사용되었는지 안되었는지 판단하는 로직
      let Valid = CheckUsed(querySnapshot);

      console.log('Valid:', Valid);

      let Obj = {
        Valid: Valid,
        PkNumber: PkNumber,
        CodeType: 'General',
      };
      return Obj;
    })
    .then(async (Obj) => {
      LastPassage(Obj, InvitationCode, navigation);
    });
};

interface ValidObj {
  Valid: number;
  PkNumber: number | undefined;
  CodeType: string;
}

const LastPassage = (
  Obj: ValidObj,
  InvitationCode: string | undefined,
  navigation: any,
) => {
  if (Obj.Valid == 1) {
    navigation.navigate('RegisterScreen', {
      InvitationCode: InvitationCode,
      PkNumber: Obj.PkNumber,
      CodeType: Obj.CodeType,
    });
  } else if (Obj.Valid == 0) {
    Alert.alert('존재하지 않는 초대코드입니다.');
    return;
  } else if (Obj.Valid == 2) {
    Alert.alert('이미 사용된 초대코드입니다');
    return;
  }
};

const SpecialInvitation = async (InvitationCode: string, navigation: any) => {
  const PkNumber = await GetPkNumber();
  let Valid = 1;
  let Obj = {
    Valid: Valid,
    PkNumber: PkNumber,
    CodeType: 'Special',
  };
  LastPassage(Obj, InvitationCode, navigation);
};

const ValidInvitationCodeScreen = () => {
  const [Selected, setSelected] = useState(false);

  const {width} = Dimensions.get('window');
  const [TextInputInvitationCode, setTextInputInvitationCode] = useState('');
  const navigation = useNavigation();

  const TextInputStyle = StyleSheet.create({
    TextInput: {
      width: '100%',
      height: '50%',
      borderBottomColor: Selected == true ? 'white' : 'lightgray',
      borderBottomWidth: 1,
      fontSize: 18,
      fontWeight: '600',
      color: 'black',
      // backgroundColor: 'skyblue',
    },
    ViewStyle: {
      width: '100%',
      height: '40%',
      marginTop: '5%',
      display: 'flex',
      justifyContent: 'center',
    },
  });

  const InvitationCode = () => (
    <View style={TextInputStyle.ViewStyle}>
      {SubText_InvitationSvg()}

      <TextInput
        style={TextInputStyle.TextInput}
        placeholder="초대코드가 있으면 입력해주세요"
        placeholderTextColor={'lightgray'}
        onFocus={() => {
          setSelected(true);
        }}
        onEndEditing={() => {
          setSelected(false);
        }}
        value={TextInputInvitationCode}
        onChangeText={(value) => {
          setTextInputInvitationCode(value);
        }}
      />

      {Selected == true ? LongLineSvg(width * 0.9) : null}
    </View>
  );

  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <View style={LoginAndReigsterStyles.Description}>
          {MainText_InvitationSvg()}
        </View>

        <View
          style={{
            height: '50%',
            width: '100%',
          }}>
          <Pressable
            style={{
              height: '100%',
              width: '100%',
            }}
            onPress={() => {
              Keyboard.dismiss();
            }}>
            {InvitationCode()}
          </Pressable>
          <Button
            title="건너뛰기"
            onPress={() => {
              Jump(undefined, navigation);
            }}></Button>
        </View>
        <Btn_ClickableNext
          onPress={() => {
            ValidateInvitationCode(TextInputInvitationCode, navigation);
          }}
        />

        <View
          style={[
            {
              position: 'absolute',
              bottom: '3%',
              width: '100%',
            },
          ]}>
          <TouchableOpacity
            style={[
              styles.RowCenter,
              {
                height: 30,
              },
            ]}
            onPress={() => {
              navigation.navigate('LoginScreen');
            }}>
            {SubTextComponent('AccountExistText', {})}
          </TouchableOpacity>
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
  CheckText: {
    fontSize: 16,
    color: 'white',
  },
  input: {
    height: 40,
    width: '100%',
    fontsize: 22,
    marginTop: 2,
  },
  text: {
    // backgroundColor: 'blue'
    padding: 1,
    color: 'blue',
  },
});

export default ValidInvitationCodeScreen;
