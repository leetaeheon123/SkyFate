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
import {TextComponent} from 'component/ProfileInput/ProfileSvg';
import {Btn_ClickableNext, Btn_NotClickableNext} from 'component/Profile';
import styles from '~/ManToManBoard';
import {PI_C_Desc, PI_C_Title} from 'component/ProfileInput';
import {Gray_94A1AC, MainColor} from '~/Color/OneColor';
const MyWantIntroScreen = ({navigation, route}: any) => {
  const {UserUid, NickName, Gender, Age} = route.params;

  const [MyWantIntro, setMyWantIntro] = useState('');
  const [Selected, setSelected] = useState(false);
  const Update_MyWantIntro = async () => {
    await firestore().collection(`UserList`).doc(`${UserUid}`).update({
      MyWantIntro: MyWantIntro,
    });

    navigation.navigate('MySelfIntroScreen', {
      UserUid: UserUid,
      Gender: Gender,
      NickName: NickName,
      Age: Age,
      MyWantIntro: MyWantIntro,
    });
  };

  const MyWantIntroTextInput = () => (
    <View style={LoginAndRegisterTextInputStyle().ViewStyle}>
      {/* {NickNameInput()} */}
      <TextInput
        style={[
          LoginAndRegisterTextInputStyle().SelfIntroTextInput,
          {
            borderWidth: 2,
            borderStyle: 'solid',
            borderRadius: 8,
            borderColor:
              Selected == true || MyWantIntro.length >= 1
                ? MainColor
                : 'lightgray',
          },
        ]}
        multiline={true}
        numberOfLines={5}
        placeholder="예) 키는 175 이상, 맞는 것에 거부감이 없는 분이면 좋겠어요"
        placeholderTextColor={Gray_94A1AC}
        onFocus={() => {
          setSelected(true);
        }}
        onEndEditing={() => {
          setSelected(false);
        }}
        value={MyWantIntro}
        onChangeText={(value) => {
          setMyWantIntro(value);
        }}
      />
    </View>
  );

  //
  //

  // 600 18 black

  // 400 16 black

  // 600 16 red

  // 600 18 black
  // 400 16 black

  // 700 16 black

  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <View style={[LoginAndReigsterStyles.Description_OnlyFlex]}>
          {TextComponent('MyWantIntro')}
          {/* 700, 24 black => 700 ,22 */}
          <PI_C_Title Title={'원하는 상대를 적어주세요'} />
          <PI_C_Desc Desc={'언제든지 수정할 수 있어요'} />
        </View>
        <View style={LoginAndReigsterStyles.Center}>
          <Pressable style={styles.W100H100} onPress={() => Keyboard.dismiss()}>
            {MyWantIntroTextInput()}
          </Pressable>
        </View>
        {MyWantIntro.length >= 20 ? (
          <Btn_ClickableNext
            onPress={() => {
              Update_MyWantIntro();
            }}
          />
        ) : (
          <Btn_NotClickableNext />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyWantIntroScreen;
