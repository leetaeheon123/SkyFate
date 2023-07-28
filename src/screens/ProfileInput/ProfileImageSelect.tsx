import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Text,
} from 'react-native';

import {LoginAndReigsterStyles} from '../../../styles/LoginAndRegiser';
import {
  ProfileImageUploadComponent,
  SubTextComponent,
  TextComponent,
} from 'component/ProfileInput/ProfileSvg';

import {ChangeMyProfileImage} from '^/ImageUpload';
import styles from '~/ManToManBoard';
import {Btn_ClickableNextSvg} from 'component/ProfileInput/ProfileSvg';
import {Btn_NotClickableNextSvg} from 'component/ProfileInput/ProfileSvg';

import {AppContext} from '^/Appcontext';
import {ProfileImageStyles} from '~/ProfileInput';
import VisualMeasureInProgressScreen from './VisualMeasureInProgress';

const ProfileImageUploadComponentGen = (
  index: number,
  setState: Function,
  UserUid: string,
  Gender: number,
  navigation: any,
  NickName: string,
) => {
  return (
    <TouchableOpacity
      onPress={() => {
        ChangeMyProfileImage(
          UserUid,
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
  const {UserUid, Gender, NickName} = route.params;

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
    navigation.navigate('IndicatorScreen');
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
    if (checkvalue >= 1) {
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
          {/* {SubTextComponent('ProfileImage', {marginTop: 20})} */}

          <Text style={{marginTop: 20}}>
            이웃팅을 방지하기 위해 얼굴이 드러나지
          </Text>
          <Text>않는 사진(전신사진)을 권장해요.</Text>

          <View style={ProfileImageStyles.ImageSelectView}>
            {Url == '' ? (
              ProfileImageUploadComponentGen(
                1,
                setUrl,

                UserUid,
                Gender,
                navigation,
                NickName,
              )
            ) : (
              <Image
                source={{uri: Url}}
                style={ProfileImageStyles.Image}></Image>
            )}
            {/* {Url2 == '' ? (
              ProfileImageUploadComponentGen(
                2,
                setUrl2,

                UserUid,
                Gender,
                navigation,
                NickName,
              )
            ) : (
              <Image
                source={{uri: Url2}}
                style={ProfileImageStyles.Image}></Image>
            )} */}
          </View>
          {/* <View style={ProfileImageStyles.ImageSelectView}>
            {Url3 == '' ? (
              ProfileImageUploadComponentGen(
                3,
                setUrl3,
                UserUid,
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
                UserUid,
                Gender,
                navigation,
                NickName,
              )
            ) : (
              <Image
                source={{uri: Url4}}
                style={ProfileImageStyles.Image}></Image>
            )}
          </View> */}
        </View>
        {check()}
      </View>
    </SafeAreaView>
  );
};

export default ProfileImageSelectScreen;
