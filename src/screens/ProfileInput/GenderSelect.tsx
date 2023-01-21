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
import {TextComponent} from 'component/Profile/ProfileSvg';
import {GenderBtnComponent} from 'component/Profile/ProfileSvg';
import {Btn_ClickableNext, Btn_NotClickableNext} from 'component/Profile';
const GenderSelectScreen = ({navigation, route}: any) => {
  console.log(route.params.UserEmail);
  const {UserEmail, NickName} = route.params;

  const UpdateGender = async () => {
    await firestore().collection(`UserList`).doc(`${UserEmail}`).update({
      Gender: Gender,
    });

    navigation.navigate('MbtiSelectScreen', {
      UserEmail: UserEmail,
      Gender: Gender,
      NickName: NickName,
    });
  };

  const [Gender, setGender] = useState(0);
  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <View style={LoginAndReigsterStyles.Description}>
          {TextComponent('Gender')}
        </View>
        <View
          style={{
            height: '50%',
            width: '100%',
          }}>
          {Gender == 1 ? (
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

          {Gender == 2 ? (
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

        {Gender == 0 ? (
          <Btn_NotClickableNext />
        ) : (
          <Btn_ClickableNext
            onPress={() => {
              UpdateGender();
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default GenderSelectScreen;
