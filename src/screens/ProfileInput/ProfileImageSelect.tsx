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
import {
  ProfileImageUploadComponent,
  SubTextComponent,
  TextComponent,
} from 'component/Profile/ProfileSvg';

import {ChangeMyProfileImage} from '^/ImageUpload';
import styles from '~/ManToManBoard';

const ProfileImageSelectScreen = ({navigation, route}: any) => {
  console.log(route.params.UserEmail);
  const {UserEmail, Gender} = route.params;

  const goToNext = () => {
    navigation.navigate('IndicatorScreen', {
      From: 'LoginAndRegister',
    });
  };

  const ProfileImageUploadComponentGen = (index: number) => {
    return (
      <TouchableOpacity
        onPress={() => {
          ChangeMyProfileImage(UserEmail, Gender, navigation, index);
        }}>
        {ProfileImageUploadComponent()}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <View style={LoginAndReigsterStyles.Description}>
          {TextComponent('ProfileImage')}
        </View>
        <View style={LoginAndReigsterStyles.Center}>
          {SubTextComponent('ProfileImage')}
          <View style={styles.Row_OnlyColumnCenter}>
            {ProfileImageUploadComponentGen(1)}
            {ProfileImageUploadComponentGen(2)}
          </View>
          <View style={styles.Row_OnlyColumnCenter}>
            {ProfileImageUploadComponentGen(3)}
            {ProfileImageUploadComponentGen(4)}
          </View>
        </View>

        <View style={LoginAndReigsterStyles.CheckBox}>
          <Pressable
            style={LoginAndReigsterStyles.CheckBt}
            onPress={() => {
              UpdateProfileImageUrl();
            }}>
            <Text style={LoginAndReigsterStyles.CheckText}>다음</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileImageSelectScreen;
