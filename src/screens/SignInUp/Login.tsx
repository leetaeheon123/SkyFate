import React, {useState, useContext} from 'react';
import {View, Button, Platform, Text, SafeAreaView, Alert,TextInput, StyleSheet , Pressable} from 'react-native';

import { signIn, signUp } from "../../UsefulFunctions/FirebaseAuth"

import {NativeStackScreenProps} from "@react-navigation/native-stack"
import { RootStackParamList } from '../RootStackParamList';
import {AppContext} from '../../UsefulFunctions/Appcontext'

import { LoginAndReigsterStyles } from '../../../styles/LoginAndRegiser';
import { LoginUserEmail } from "../../UsefulFunctions/SaveUserDataInDevice"

import { LoginAndRegisterTextInputStyle } from '../../../styles/LoginAndRegiser';
export type Register2ScreenProps = NativeStackScreenProps<RootStackParamList, "InvitationCode">;

const LoginWithEmail = async (navigation:any, Email:string, Password:string ,SendBird:Object) => {

  try {
    const result = await signIn({email: Email, password:Password})
    let UserEmail = result.user.email
    LoginUserEmail(UserEmail, navigation, SendBird)
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

const LoginScreen = (props:any) => {
  const [BorderBottomColor2, setBorderBottomColor2] = useState('lightgray');
  const [BorderBottomColor3, setBorderBottomColor3] = useState('lightgray');

  const [TextInputEmail , setTextInputEmail] = useState("8269apk@naver.com")
  const [TextInputPassword , setTextInputPassword] = useState("123456")
  
  const Context = useContext(AppContext);
  const SendBird = Context.sendbird

  const navigation = props.navigation

  // const navigation = useNavigation()
  


  const EmailTextInput = () => (
    <View
      style={LoginAndRegisterTextInputStyle(null).ViewStyle}>
      <Text
        style={{
          color: 'lightgray',
        }}>
        이메일 입력
      </Text>
      <TextInput
        style={LoginAndRegisterTextInputStyle(BorderBottomColor2).TextInput}
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
    style={LoginAndRegisterTextInputStyle(null).ViewStyle}>
      <Text
        style={{
          color: 'lightgray',
        }}>
        비밀번호 입력
      </Text>
      <TextInput
        style={LoginAndRegisterTextInputStyle(BorderBottomColor3).TextInput}
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
      style={LoginAndReigsterStyles.Body}>
      <View
        style={LoginAndReigsterStyles.Main}>
        <View
          style={LoginAndReigsterStyles.Description}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color:'black'
            }}>
            로그인을 시작해주세요
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

        <View style={LoginAndReigsterStyles.CheckBox}>
        <Pressable
          style={LoginAndReigsterStyles.CheckBt}
          onPress={() => {
            LoginWithEmail(navigation, TextInputEmail, TextInputPassword,SendBird)
          }}>
          <Text style={LoginAndReigsterStyles.CheckText}>다음</Text>
        </Pressable>
      </View>
     
      </View>
    </SafeAreaView>
  );
};



export default LoginScreen;