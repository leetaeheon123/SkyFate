import React, {useState, useContext} from 'react';
import {View, Button, Platform, Text, SafeAreaView, Alert,TextInput, StyleSheet , Pressable} from 'react-native';

import { signIn, signUp } from "../UsefulFunctions/FirebaseAuth"

import {NativeStackScreenProps} from "@react-navigation/native-stack"
import { RootStackParamList } from './RootStackParamList';
import AppContext from '../UsefulFunctions/Appcontext'

import { LoginAndReigsterStyles } from '../../styles/LoginAndRegiser';
import { RegisterUserData } from "../UsefulFunctions/SaveUserDataInDevice"

export type Register2ScreenProps = NativeStackScreenProps<RootStackParamList, "InvitationCode">;

const LoginWithEmail = async (navigation:any, Email:string, InvitationCode:string) => {

  try {
    const result = await signIn({email: Email, password:InvitationCode})
    let UserEmail = result.user.email
    RegisterUserData(UserEmail, navigation)
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

  const [TextInputEmail , setTextInputEmail] = useState("")
  const [TextInputPassword , setTextInputPassword] = useState("")
  
  const GlobalSendbird = useContext(AppContext);
  const sendbird = GlobalSendbird.sendbird

  const navigation = props.navigation

  console.log(sendbird)

  // const navigation = useNavigation()
  
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

  const connect = () => {

        sendbird.connect(TextInputEmail, (user:any, err:any) => {
          console.log('In Sendbird.connect CallbackFunction User:', user);
          // 에러가 존재하지 않으면
          if (!err) {
            // 유저 닉네임 중복 방지
            if (user.nickname !== state.nickname) {
              sendbird.updateCurrentUserInfo(
                state.nickname,
                'https://blog.kakaocdn.net/dn/tEMUl/btrDc6957nj/NwJoDw0EOapJNDSNRNZK8K/img.jpg',
                (user, err) => {
                  console.log('In sendbird.updateCurrentUserInfo User:', user);
                  dispatch({type: 'end-connection'});
                  if (!err) {
                    start(user);
                  } else {
                    showError(err.message);
                  }
                },
              );
            } else {
              dispatch({type: 'end-connection'});

              start(user);
            }
          } else {
            dispatch({type: 'end-connection'});
            showError(err.message);
          }
        });
      
  };

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
            LoginWithEmail(navigation, TextInputEmail, TextInputPassword)
          }}>
          <Text style={LoginAndReigsterStyles.CheckText}>다음</Text>
        </Pressable>
      </View>
     
      </View>
    </SafeAreaView>
  );
};



export default LoginScreen;