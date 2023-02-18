import React, {useState, useContext} from 'react';
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
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
} from 'react-native';

import {signIn, signUp} from '../../UsefulFunctions/FirebaseAuth';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../RootStackParamList';
import {AppContext} from '../../UsefulFunctions/Appcontext';

import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import {LoginUserEmail} from '../../UsefulFunctions/SaveUserDataInDevice';

import {LoginAndRegisterTextInputStyle} from '../../../styles/LoginAndRegiser';
import {Btn_ClickableNext, Btn_NotClickableNext} from 'component/Profile';
import {LongLineFixSvg, LongLineSvg} from 'component/General/GeneralSvg';
import {withDecay} from 'react-native-reanimated';
import {
  MainText_LoginSvg,
  SubText_EmailSvg,
  SubText_PasswordSvg,
} from 'component/SignInUp/SignInUp';
import {HPer15, HPer50} from '~/Per';
import {Btn_ClickableBack} from 'component/General';
export type Register2ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InvitationCode'
>;

const LoginWithEmail = async (
  navigation: any,
  Email: string,
  Password: string,
  SendBird: Object,
) => {
  try {
    const result = await signIn({email: Email, password: Password});
    let UserEmail = result.user.email;
    LoginUserEmail(UserEmail, navigation, SendBird);
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      Alert.alert('이메일은 존재하나 비밀번호가 다릅니다.');
      //  == 추천인 코드가 다른상황
    }
    if (error.code === 'auth/user-not-found') {
      Alert.alert('해당 이메일이 없습니다. 다시한번 이메일을 확인해주세요');
      // 추천인 코드는 있으나,
    }
  }
};

const LoginScreen = (props: any) => {
  const [Selected, setSelected] = useState('');

  const [TextInputEmail, setTextInputEmail] = useState('8269apk@naver.com');
  const [TextInputPassword, setTextInputPassword] = useState('123456');

  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const navigation = props.navigation;

  // const navigation = useNavigation()

  const EmailTextInput = () => (
    <View style={LoginAndRegisterTextInputStyle().ViewStyle}>
      {SubText_EmailSvg()}
      <TextInput
        style={[
          LoginAndRegisterTextInputStyle().TextInput,
          {borderBottomColor: Selected == 'Email' ? 'white' : 'lightgray'},
        ]}
        placeholder="가입하신 이메일을 입력해주세요"
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
          {MainText_LoginSvg()}
        </View>
        <View
          style={{
            height: HPer50,
            // height: '50%',
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

        {TextInputEmail.length >= 6 && TextInputPassword.length >= 6 ? (
          <Btn_ClickableNext
            onPress={() => {
              LoginWithEmail(
                navigation,
                TextInputEmail,
                TextInputPassword,
                SendBird,
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

export default LoginScreen;
