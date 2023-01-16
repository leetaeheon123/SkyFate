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
  Image,
  Dimensions,
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
import {Btn_NotClickableComponent} from 'component/Profile/ProfileSvg';
import {Btn_ClickableComponent} from 'component/Profile/ProfileSvg';
const ProfileImageSelectScreen = ({navigation, route}: any) => {
  console.log(route.params.UserEmail);
  const {UserEmail, Gender} = route.params;

  const [Url, setUrl] = useState('');
  const [Url2, setUrl2] = useState('');
  const [Url3, setUrl3] = useState('');
  const [Url4, setUrl4] = useState('');

  const {width, height} = Dimensions.get('window');

  const goToNext = () => {
    navigation.navigate('IndicatorScreen', {
      From: 'LoginAndRegister',
    });
  };

  const check = () => {
    let checkvalue = 0;
    if (Url != '') {
      checkvalue++;
    }

    if (Url2 != '') {
      checkvalue++;
    }
    if (Url3 != '') {
      checkvalue++;
    }
    if (Url4 != '') {
      checkvalue++;
    }
    console.log(checkvalue);
    if (checkvalue >= 2) {
      return (
        <TouchableOpacity
          style={LoginAndReigsterStyles.Btn_Clickable}
          onPress={() => {
            goToNext();
          }}>
          {Btn_ClickableComponent(width * 0.9)}
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={LoginAndReigsterStyles.CheckBox}>
          {Btn_NotClickableComponent(width * 0.9)}
        </View>
      );
    }
  };

  const ProfileImageUploadComponentGen = (
    index: number,
    setState: Function,
  ) => {
    return (
      <TouchableOpacity
        onPress={() => {
          ChangeMyProfileImage(UserEmail, Gender, navigation, index, setState);
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
            {Url == '' ? (
              ProfileImageUploadComponentGen(1, setUrl)
            ) : (
              <Image
                source={{uri: Url}}
                style={{width: 30, height: 30}}></Image>
            )}
            {Url2 == '' ? (
              ProfileImageUploadComponentGen(2, setUrl2)
            ) : (
              <Image
                source={{uri: Url2}}
                style={{width: 30, height: 30}}></Image>
            )}
          </View>
          <View style={styles.Row_OnlyColumnCenter}>
            {Url3 == '' ? (
              ProfileImageUploadComponentGen(3, setUrl3)
            ) : (
              <Image
                source={{uri: Url3}}
                style={{width: 30, height: 30}}></Image>
            )}

            {Url4 == '' ? (
              ProfileImageUploadComponentGen(4, setUrl4)
            ) : (
              <Image
                source={{uri: Url4}}
                style={{width: 30, height: 30}}></Image>
            )}
          </View>
        </View>
        {check()}
      </View>
    </SafeAreaView>
  );
};

export default ProfileImageSelectScreen;
