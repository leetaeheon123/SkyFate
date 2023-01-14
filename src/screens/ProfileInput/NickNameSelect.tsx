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
} from 'react-native';

import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import {LoginAndRegisterTextInputStyle} from '../../../styles/LoginAndRegiser';
import firestore from '@react-native-firebase/firestore';
import {NickNameLine, TextComponent} from 'component/Profile/ProfileSvg';
import {NickNameInput} from 'component/Profile/ProfileSvg';
const NickNameSelectScreen = ({navigation, route}: any) => {
  console.log(route.params.UserEmail);
  const {UserEmail} = route.params;

  const [NickNameBorderBottomColor, setNickNameBorderBottomColor] =
    useState('lightgray');
  const [NickName, setNickName] = useState('Taeheon9');

  const UpdateNickName = async () => {
    await firestore().collection(`UserList`).doc(`${UserEmail}`).update({
      NickName: NickName,
    });

    navigation.navigate('GenderSelectScreen', {
      UserEmail: UserEmail,
    });
  };

  const NickNameTextInput = () => (
    <View style={LoginAndRegisterTextInputStyle(null).ViewStyle}>
      {NickNameInput()}
      <TextInput
        style={
          LoginAndRegisterTextInputStyle(NickNameBorderBottomColor).TextInput
        }
        placeholder="닉네임을 입력해주세요"
        placeholderTextColor={'lightgray'}
        onFocus={() => {
          setNickNameBorderBottomColor('#0064FF');
        }}
        onEndEditing={() => {
          setNickNameBorderBottomColor('lightgray');
        }}
        value={NickName}
        onChangeText={(value) => {
          setNickName(value);
        }}
      />
      {NickNameLine()}
    </View>
  );

  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <View style={LoginAndReigsterStyles.Description}>
          {TextComponent('NickName')}
        </View>
        <View style={LoginAndReigsterStyles.Center}>{NickNameTextInput()}</View>

        <View style={LoginAndReigsterStyles.CheckBox}>
          <Pressable
            style={LoginAndReigsterStyles.CheckBt}
            onPress={() => {
              if (NickName != '') {
                UpdateNickName();
              } else {
                Alert.alert('닉네임을 입력해주세요');
              }
            }}>
            <Text style={LoginAndReigsterStyles.CheckText}>다음</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NickNameSelectScreen;
