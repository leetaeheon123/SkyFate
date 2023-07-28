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

import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import firestore from '@react-native-firebase/firestore';
import {TextComponent} from 'component/ProfileInput/ProfileSvg';
import {GenderBtnComponent} from 'component/ProfileInput/ProfileSvg';
import {Btn_ClickableNext, Btn_NotClickableNext} from 'component/Profile';
import styles from '~/ManToManBoard';
import {Btn_ClickableBack} from 'component/General';
const GenderSelectScreen = ({navigation, route}: any) => {
  const {UserUid, NickName, Gender} = route.params;

  const UpdateGender = async () => {
    await firestore().collection(`UserList`).doc(`${UserUid}`).update({
      Gender: GenderValue,
    });

    navigation.navigate('MbtiSelectScreen', {
      UserUid: UserUid,
      Gender: GenderValue,
      NickName: NickName,
    });
  };

  const [GenderValue, setGender] = useState(Gender);
  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <Btn_ClickableBack
          width={12}
          style={{position: 'absolute', top: 12, left: '-2.5%'}}
          onPress={() => {
            navigation.navigate('NickNameSelectScreen', {
              UserUid: UserUid,
              NickName: NickName,
            });
          }}
        />
        <View style={LoginAndReigsterStyles.Description}>
          {TextComponent('Gender')}
        </View>
        <View
          style={[
            styles.Column_OnlyRowCenter,
            {
              height: '50%',
              width: '100%',
              justifyContent: 'space-evenly',
            },
          ]}>
          {GenderValue == 1 ? (
            <TouchableOpacity
              onPress={() => {
                setGender(0);
              }}>
              {GenderBtnComponent('GenderBtn_ClickedMan')}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setGender(1);
              }}>
              {GenderBtnComponent('GenderBtn_Man')}
            </TouchableOpacity>
          )}

          {GenderValue == 2 ? (
            <TouchableOpacity
              onPress={() => {
                setGender(0);
              }}>
              {GenderBtnComponent('GenderBtn_ClickedGirl')}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setGender(2);
              }}>
              {GenderBtnComponent('GenderBtn_Girl')}
            </TouchableOpacity>
          )}
        </View>

        {GenderValue == 1 || GenderValue == 2 ? (
          <Btn_ClickableNext
            onPress={() => {
              UpdateGender();
            }}
          />
        ) : (
          <Btn_NotClickableNext />
        )}
      </View>
    </SafeAreaView>
  );
};

export default GenderSelectScreen;
