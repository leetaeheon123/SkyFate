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
  Keyboard,
} from 'react-native';

import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import {LoginAndRegisterTextInputStyle} from '../../../styles/LoginAndRegiser';
import firestore from '@react-native-firebase/firestore';
import {NickNameLine, TextComponent} from 'component/Profile/ProfileSvg';
import {NickNameInput} from 'component/Profile/ProfileSvg';
import {Btn_ClickableNext, Btn_NotClickableNext} from 'component/Profile';
import {LongLineFixSvg} from 'component/General/GeneralSvg';
import styles from '~/ManToManBoard';
import {RemoveIdentityToken} from 'Screens/Map/map';
const NickNameSelectScreen = ({navigation, route}: any) => {
  console.log(route.params.UserEmail);
  const {UserEmail} = route.params;

  const [NickName, setNickName] = useState('Taeheon9');
  const [Selected, setSelected] = useState(false);
  const UpdateNickName = async () => {
    await firestore().collection(`UserList`).doc(`${UserEmail}`).update({
      NickName: NickName,
    });

    navigation.navigate('GenderSelectScreen', {
      UserEmail: UserEmail,
      NickName: NickName,
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
              Selected == true || NickName.length >= 1 ? 'white' : 'lightgray',
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
        value={NickName}
        onChangeText={(value) => {
          setNickName(value);
        }}
      />
      {Selected == true || NickName.length >= 1 ? LongLineFixSvg() : null}
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
        <Button
          title="RemoveToken"
          onPress={() => {
            RemoveIdentityToken();
          }}></Button>
        {NickName.length >= 4 ? (
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
