import React, {useEffect, useState} from 'react';
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
  Keyboard,
} from 'react-native';

import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import {LoginAndRegisterTextInputStyle} from '../../../styles/LoginAndRegiser';
import firestore from '@react-native-firebase/firestore';
import {NickNameLine, TextComponent} from 'component/ProfileInput/ProfileSvg';
import {NickNameInput} from 'component/ProfileInput/ProfileSvg';
import {Btn_ClickableNext, Btn_NotClickableNext} from 'component/Profile';
import {LongLineFixSvg} from 'component/General/GeneralSvg';
import styles from '~/ManToManBoard';
import {RemoveIdentityToken} from 'Screens/Map/map';
const NickNameSelectScreen = ({navigation, route}: any) => {
  const {UserUid, NickName} = route.params;

  const [NickNameValue, setNickName] = useState(NickName);
  const [Selected, setSelected] = useState(false);
  const UpdateNickName = async () => {
    await firestore().collection(`UserList`).doc(`${UserUid}`).update({
      NickName: NickNameValue,
    });

    // navigation.navigate('GenderSelectScreen', {
    navigation.navigate('GenderSelectScreen', {
      UserUid: UserUid,
      NickName: NickNameValue,
      Gender: 0,
    });
  };

  const NickNameTextInput = () => (
    <View style={LoginAndRegisterTextInputStyle().ViewStyle}>
      {NickNameInput()}
      <TextInput
        style={[
          LoginAndRegisterTextInputStyle().TextInput,
          {
            borderBottomColor:
              Selected == true || NickNameValue.length >= 1
                ? 'white'
                : 'lightgray',
          },
        ]}
        placeholder="닉네임을 입력해주세요"
        placeholderTextColor={'lightgray'}
        onFocus={() => {
          setSelected(true);
        }}
        onEndEditing={() => {
          setSelected(false);
        }}
        value={NickNameValue}
        onChangeText={(value) => {
          setNickName(value);
        }}
      />
      {Selected == true || NickNameValue.length >= 1 ? LongLineFixSvg() : null}
    </View>
  );

  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <View style={LoginAndReigsterStyles.Description}>
          {TextComponent('NickName')}
        </View>
        <View style={LoginAndReigsterStyles.Center}>
          <Pressable style={styles.W100H100} onPress={() => Keyboard.dismiss()}>
            {NickNameTextInput()}
          </Pressable>
        </View>
        {NickNameValue.length >= 3 ? (
          <Btn_ClickableNext
            onPress={() => {
              UpdateNickName();
            }}
          />
        ) : (
          <Btn_NotClickableNext />
        )}
      </View>
    </SafeAreaView>
  );
};

export default NickNameSelectScreen;
