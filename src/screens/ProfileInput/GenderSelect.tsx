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
const GenderSelectScreen = ({navigation, route}: any) => {
  console.log(route.params.UserEmail);
  const {UserEmail} = route.params;

  const UpdateGender = async () => {
    if (Gender == 0) {
      Alert.alert('선택해주세요');
      return;
    }
    await firestore().collection(`UserList`).doc(`${UserEmail}`).update({
      Gender: Gender,
    });

    navigation.navigate('MbtiSelectScreen', {
      UserEmail: UserEmail,
      Gender: Gender,
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

        <View style={LoginAndReigsterStyles.CheckBox}>
          <Pressable
            style={LoginAndReigsterStyles.CheckBt}
            onPress={() => {
              UpdateGender();
            }}>
            <Text style={LoginAndReigsterStyles.CheckText}>다음</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GenderSelectScreen;
