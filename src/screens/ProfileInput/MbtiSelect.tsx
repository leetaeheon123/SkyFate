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
  TouchableOpacity,
} from 'react-native';

import {LoginAndReigsterStyles} from '~/LoginAndRegiser';
import firestore from '@react-native-firebase/firestore';
import {TextComponent} from 'component/Profile/ProfileSvg';
import {SubTextComponent} from 'component/Profile/ProfileSvg';
import {MbtiBtn} from 'component/Profile/ProfileSvg';
import styles from '~/ManToManBoard';
import {Btn_ClickableNext, Btn_NotClickableNext} from 'component/Profile';
import {MbtiStyles} from '~/ProfileInput';
const MbtiSelectScreen = ({navigation, route}: any) => {
  console.log(route.params.UserEmail);
  const {UserEmail, Gender, NickName} = route.params;

  const [one, setone] = useState('');
  const [two, settwo] = useState('');
  const [three, setthree] = useState('');
  const [four, setfour] = useState('');

  const UpdateMbti = async () => {
    let MbtiStr = one + two + three + four;

    if (one && two && three && four) {
      await firestore().collection(`UserList`).doc(`${UserEmail}`).update({
        Mbti: MbtiStr,
      });
      navigation.navigate('AgeSelectScreen', {
        UserEmail: UserEmail,
        Gender: Gender,
        NickName: NickName,
      });
    } else {
      Alert.alert('다 선택해주세요');
    }
  };

  const MbtiBtnComponent = (
    Name: string,
    setFun: Function,
    setvalue: string,
  ) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setFun(setvalue);
        }}>
        {MbtiBtn(`${Name}`)}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <View style={LoginAndReigsterStyles.Description}>
          {TextComponent('Mbti')}
        </View>
        <View
          style={[
            styles.Column_OnlyRowCenter,
            {
              height: '50%',
              width: '100%',
            },
          ]}>
          {SubTextComponent('Mbti')}

          <View style={[MbtiStyles.MbtiSelectView, {marginTop: '20%'}]}>
            {one == 'E'
              ? MbtiBtnComponent('ClickedE', setone, '')
              : MbtiBtnComponent('E', setone, 'E')}
            {two == 'S'
              ? MbtiBtnComponent('ClickedS', settwo, '')
              : MbtiBtnComponent('S', settwo, 'S')}
            {three == 'T'
              ? MbtiBtnComponent('ClickedT', setthree, '')
              : MbtiBtnComponent('T', setthree, 'T')}
            {four == 'J'
              ? MbtiBtnComponent('ClickedJ', setfour, '')
              : MbtiBtnComponent('J', setfour, 'J')}
          </View>

          <View style={[MbtiStyles.MbtiSelectView, {marginTop: 20}]}>
            {one == 'I'
              ? MbtiBtnComponent('ClickedI', setone, '')
              : MbtiBtnComponent('I', setone, 'I')}
            {two == 'N'
              ? MbtiBtnComponent('ClickedN', settwo, '')
              : MbtiBtnComponent('N', settwo, 'N')}
            {three == 'F'
              ? MbtiBtnComponent('ClickedF', setthree, '')
              : MbtiBtnComponent('F', setthree, 'F')}
            {four == 'P'
              ? MbtiBtnComponent('ClickedP', setfour, '')
              : MbtiBtnComponent('P', setfour, 'P')}
          </View>
        </View>

        {one && two && three && four ? (
          <Btn_ClickableNext
            onPress={() => {
              UpdateMbti();
            }}
          />
        ) : (
          <Btn_NotClickableNext />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MbtiSelectScreen;
