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
const MySelfIntroScreen = ({navigation, route}: any) => {
  const {UserUid, NickName, Gender, Age, MyWantIntro} = route.params;

  const [MySelfIntro, setMySelfIntro] = useState('');
  const [Selected, setSelected] = useState(false);
  const Update_MySelfIntro = async () => {
    await firestore().collection(`UserList`).doc(`${UserUid}`).update({
      MySelfIntro: MySelfIntro,
    });

    navigation.navigate('ProfileImageSelectScreen', {
      UserUid: UserUid,
      Gender: Gender,
      NickName: NickName,
      Age: Age,
      MyWantIntro: MyWantIntro,
      MySelfIntro: MySelfIntro,
    });
  };

  const MySelfIntroTextInput = () => (
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
              Selected == true || MySelfIntro.length >= 1
                ? MainColor
                : 'lightgray',
          },
        ]}
        multiline={true}
        numberOfLines={5}
        placeholder="예) 저는 20대 펨돔이에요 에셈에 입문한지는 얼마 안됐어요"
        placeholderTextColor={Gray_94A1AC}
        onFocus={() => {
          setSelected(true);
        }}
        onEndEditing={() => {
          setSelected(false);
        }}
        value={MySelfIntro}
        onChangeText={(value) => {
          setMySelfIntro(value);
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
          {TextComponent('MySelfIntro')}
          {/* 700, 24 black => 700 ,22 */}
          <PI_C_Title Title={'자기소개를 적어주세요'} />
          <PI_C_Desc Desc={'언제든지 수정할 수 있어요'} />
          {/*500, 20,  #94A1AC => 700, 18*/}
          {/* <Text>언제든지 수정할 수 있어요</Text> */}
          {/*500, 20,  #94A1AC */}

          {/* 2, black , clicked- MainColor, BorderRaidus 8  */}
          {/* <Text>예 저는 20대 펨돔이에요. 에셈에 입문한지는 얼마 안됬어요</Text> */}
          {/* 400,14, black*/}
          {/* <Text>너무 짧은 자기소개는 이용 제한이 될 수 있어요</Text> */}
          {/* 700,14, 파랭이 */}
          {/* <Text>자기소개 가이드라인 보기</Text> */}
        </View>
        <View style={LoginAndReigsterStyles.Center}>
          <Pressable style={styles.W100H100} onPress={() => Keyboard.dismiss()}>
            {MySelfIntroTextInput()}
          </Pressable>
        </View>
        {MySelfIntro.length >= 20 ? (
          <Btn_ClickableNext
            onPress={() => {
              Update_MySelfIntro();
            }}
          />
        ) : (
          <Btn_NotClickableNext />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MySelfIntroScreen;
