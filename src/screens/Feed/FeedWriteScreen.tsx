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
import {
  Btn_ClickableNext,
  Btn_NotClickableNext,
  MainColorBtn_Clickable,
} from 'component/Profile';
import styles from '~/ManToManBoard';
import {PI_C_Desc, PI_C_Title} from 'component/ProfileInput';
import {Gray_94A1AC, MainColor} from '~/Color/OneColor';
import {Create_Feed} from 'Firebase/create';
import {HPer5} from '~/Per';
const FeedWriteScreen = ({navigation, route}: any) => {
  const {UserData} = route.params;

  const [Selected, setSelected] = useState(false);
  const [FeedDesc, setFeedDesc] = useState('');

  const Update_FeedDesc = async () => {
    navigation.goBack();
  };

  const FeedDescTextInput = () => (
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
              Selected == true || FeedDesc.length >= 1
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
        value={FeedDesc}
        onChangeText={(value) => {
          setFeedDesc(value);
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
          {TextComponent('FeedDesc')}
          {/* 700, 24 black => 700 ,22 */}
          <PI_C_Title Title={'이런 거 하고싶어요'} />
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
            {FeedDescTextInput()}
          </Pressable>
        </View>
        {FeedDesc.length >= 20 ? (
          <MainColorBtn_Clickable
            Title="올리기"
            style={{position: 'absolute', bottom: HPer5}}
            onPress={() => {
              Create_Feed(FeedDesc, UserData);
            }}
          />
        ) : (
          <Btn_NotClickableNext />
        )}
      </View>
    </SafeAreaView>
  );
};

export default FeedWriteScreen;
