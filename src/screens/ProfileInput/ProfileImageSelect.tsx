import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import {
  ProfileImageUploadComponent,
  SubTextComponent,
  TextComponent,
} from 'component/Profile/ProfileSvg';

import {ChangeMyProfileImage} from '^/ImageUpload';
import styles from '~/ManToManBoard';
import {Btn_ClickableNextSvg} from 'component/Profile/ProfileSvg';
import {Btn_NotClickableNextSvg} from 'component/Profile/ProfileSvg';

import {AppContext} from '^/Appcontext';
import {ProfileImageStyles} from '~/ProfileInput';
import VisualMeasureInProgressScreen from './VisualMeasureInProgress';

const ProfileImageUploadComponentGen = (
  index: number,
  setState: Function,
  UserEmail: string,
  Gender: number,
  navigation: any,
  NickName: string,
) => {
  return (
    <TouchableOpacity
      onPress={() => {
        ChangeMyProfileImage(
          UserEmail,
          Gender,
          navigation,
          index,
          setState,
          NickName,
          // SendBird,
        );
      }}>
      {ProfileImageUploadComponent()}
    </TouchableOpacity>
  );
};

const ProfileImageSelectScreen = ({navigation, route}: any) => {
  const {UserEmail, Gender, NickName} = route.params;

  const [Url, setUrl] = useState('');
  const [Url2, setUrl2] = useState('');
  const [Url3, setUrl3] = useState('');
  const [Url4, setUrl4] = useState('');

  const hasAndroidPermission = async () => {
    //외부 스토리지를 읽고 쓰는 권한 가져오기
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const getPhotoWithPermission = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
  };

  useEffect(() => {
    getPhotoWithPermission();
  }, []);

  const {width, height} = Dimensions.get('window');

  const goToNext = () => {
    navigation.navigate('VisualMeasureInProgressScreen');
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
    // console.log(checkvalue);
    if (checkvalue >= 2) {
      return (
        <TouchableOpacity
          style={LoginAndReigsterStyles.Btn_Clickable}
          onPress={() => {
            goToNext();
          }}>
          {Btn_ClickableNextSvg(width * 0.9)}
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={LoginAndReigsterStyles.CheckBox}>
          {Btn_NotClickableNextSvg(width * 0.9)}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <View style={LoginAndReigsterStyles.Description}>
          {TextComponent('ProfileImage')}
        </View>
        <View
          style={[LoginAndReigsterStyles.Center, styles.Column_OnlyRowCenter]}>
          {/* {Gender == 2
            ? SubTextComponent('ProfileImageGirl', {marginTop: 20})
            : SubTextComponent('ProfileImage', {marginTop: 20})} */}
          {SubTextComponent('ProfileImage', {marginTop: 20})}
          <View style={ProfileImageStyles.ImageSelectView}>
            {Url == '' ? (
              ProfileImageUploadComponentGen(
                1,
                setUrl,

                UserEmail,
                Gender,
                navigation,
                NickName,
              )
            ) : (
              <Image
                source={{uri: Url}}
                style={ProfileImageStyles.Image}></Image>
            )}
            {Url2 == '' ? (
              ProfileImageUploadComponentGen(
                2,
                setUrl2,

                UserEmail,
                Gender,
                navigation,
                NickName,
              )
            ) : (
              <Image
                source={{uri: Url2}}
                style={ProfileImageStyles.Image}></Image>
            )}
          </View>
          <View style={ProfileImageStyles.ImageSelectView}>
            {Url3 == '' ? (
              ProfileImageUploadComponentGen(
                3,
                setUrl3,
                UserEmail,
                Gender,
                navigation,
                NickName,
              )
            ) : (
              <Image
                source={{uri: Url3}}
                style={ProfileImageStyles.Image}></Image>
            )}

            {Url4 == '' ? (
              ProfileImageUploadComponentGen(
                4,
                setUrl4,
                UserEmail,
                Gender,
                navigation,
                NickName,
              )
            ) : (
              <Image
                source={{uri: Url4}}
                style={ProfileImageStyles.Image}></Image>
            )}
          </View>
        </View>
        {check()}
      </View>
    </SafeAreaView>
  );
};

export default ProfileImageSelectScreen;
