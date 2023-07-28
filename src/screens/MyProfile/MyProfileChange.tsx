import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {MyProfileChangeStyles, MyProfileStyles} from '~/MyProfile';
import {Type2} from 'component/LinearGradient/LinearType';

import LinearGradient from 'react-native-linear-gradient';
import {Type2ProfileImageCircle} from 'component/LinearGradient/LinearGradientCircle';
import {DescBottomline, DescBottomlineCustom, DescCricle} from './MyProfile';
import {TextInput} from 'react-native-gesture-handler';
import styles from '~/ManToManBoard';
import {
  ProfileImageUploadComponent,
  ProfileImageUploadComponentReact,
} from 'component/ProfileInput/ProfileSvg';

import {ChangeMyProfileImage} from '^/ImageUpload';
import {완료Svg} from 'component/General/GeneralSvg';
import {UpdateFbFirestore} from '^/Firebase';
import {Btn_ClickableBack} from 'component/General';
import {FSStyles, FWStyles} from '~/FontWeights';
import {ValidFalsy} from '^/ValidFalsy';
import {MainColor} from '~/Color/OneColor';
import {HPer1, WPer10, WPer15, WPer5} from '~/Per';
const ProfileImageUploadComponentGen = (
  index: number,
  setState: Function,
  UserEmail: string,
  Gender: number,
  navigation: any,
  NickName: string,
  width: number,
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
        );
      }}>
      {ProfileImageUploadComponentReact(width)}
    </TouchableOpacity>
  );
};

const MyProfileChangeScreen = ({route, navigation}: any) => {
  const {width} = Dimensions.get('window');
  const {UserData} = route.params;

  const Per20 = width * 0.2;

  const [Url, setUrl] = useState(UserData.ProfileImageUrl);
  const [Url2, setUrl2] = useState(UserData.ProfileImageUrl2);
  const [Url3, setUrl3] = useState(UserData.ProfileImageUrl3);
  const [Url4, setUrl4] = useState(UserData.ProfileImageUrl4);
  const [Url5, setUrl5] = useState(UserData.ProfileImageUrl5);
  const [Url6, setUrl6] = useState(UserData.ProfileImageUrl6);

  const [Age, setAge] = useState(String(UserData.Age));
  const [IntroduceText, setIntroduceText] = useState(UserData.IntroduceText);

  const CheckImageNull = (
    index: number,
    setState: Function,
    ImageUrl: string,
  ) => {
    if (!ValidFalsy(ImageUrl)) {
      return ProfileImageUploadComponentGen(
        index,
        setState,
        UserData.UserEmail,
        UserData.Gender,
        navigation,
        UserData.NickName,
        Per20,
      );
    } else {
      return (
        <TouchableOpacity
          style={{}}
          onPress={() => {
            ChangeMyProfileImage(
              UserData.UserEmail,
              UserData.Gender,
              navigation,
              index,
              setState,
              UserData.NickName,
            );
          }}>
          <Image
            source={{uri: ImageUrl}}
            style={MyProfileChangeStyles.ProfileImage}
          />
        </TouchableOpacity>
      );
    }
  };

  const ChangedUserData = {
    ...UserData,
    ProfileImageUrl: Url,
    ProfileImageUrl2: Url2,
    ProfileImageUrl3: Url3,
    ProfileImageUrl4: Url4,
    ProfileImageUrl5: Url5,
    ProfileImageUrl6: Url6,
  };

  const InforBoxSection = (Desc: string) => {
    return (
      <View style={MyProfileChangeStyles.InforBoxSection}>
        {DescCricle}
        <Text style={MyProfileChangeStyles.InforBoxText}>{Desc}</Text>
      </View>
    );
  };

  const ChangeUserData = () => {
    UpdateFbFirestore(
      'UserList',
      '8269apk@naver.com',
      'IntroduceText',
      IntroduceText,
    );
  };

  const Btn_완료 = (
    <TouchableOpacity
      style={[
        styles.RowCenter,
        {
          width: 50,
          height: 50,
        },
      ]}
      onPress={() => {
        navigation.navigate('SearchScrollScreen', {
          UserData: ChangedUserData,
        });
      }}>
      {완료Svg}
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <ScrollView>
        <View style={MyProfileChangeStyles.Headers}>
          <View
            style={
              (styles.W90ML5,
              {
                height: 50,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              })
            }>
            <Btn_ClickableBack
              width={14}
              onPress={() => navigation.navigate('MyProfileScreen', {UserData})}
            />
            {/* <Text>프로필 변경</Text> */}
            {Btn_완료}
          </View>

          <View style={[MyProfileChangeStyles.HeadersGrid, {marginTop: 10}]}>
            {CheckImageNull(1, setUrl, Url)}
            {CheckImageNull(2, setUrl2, Url2)}
            {CheckImageNull(3, setUrl3, Url3)}
          </View>
          <View style={MyProfileChangeStyles.HeadersGrid}>
            {CheckImageNull(4, setUrl4, Url4)}
            {CheckImageNull(5, setUrl5, Url5)}
            {CheckImageNull(6, setUrl6, Url6)}
          </View>
        </View>

        <KeyboardAvoidingView style={MyProfileChangeStyles.Body}>
          <View style={MyProfileChangeStyles.InforView}>
            <View
              style={{
                position: 'absolute',
                top: -WPer10,
              }}>
              {Type2ProfileImageCircle(Per20, Per20, UserData.ProfileImageUrl)}
            </View>
            <Text
              style={[
                MyProfileStyles.NickName,
                {marginTop: WPer15, marginBottom: 10},
              ]}>
              {UserData.NickName}
            </Text>
            <Text style={MyProfileChangeStyles.SubText}>
              프로필 대표사진 1장을 등록해주세요
            </Text>
            <Text style={MyProfileChangeStyles.SubText}>
              프로필을 누르면 상태를 변경할 수 있습니다{' '}
            </Text>

            <View style={MyProfileChangeStyles.InforBox}>
              <View style={MyProfileChangeStyles.InforBoxSection}>
                <Text
                  style={[
                    styles.WhiteColor,
                    FWStyles.Semibold,
                    FSStyles(14).General,
                  ]}>
                  기본 정보
                </Text>
              </View>
              {InforBoxSection('MBTI')}
              <View style={MyProfileChangeStyles.InforBoxColumnSection}>
                <TextInput
                  value={UserData.Mbti}
                  style={MyProfileChangeStyles.TI}
                  maxLength={4}></TextInput>

                {DescBottomlineCustom({width: '88%', height: 1})}
              </View>
              {InforBoxSection('나이')}
              <View style={MyProfileChangeStyles.InforBoxColumnSection}>
                <TextInput
                  style={MyProfileChangeStyles.TI}
                  maxLength={2}
                  value={Age}
                  onChangeText={(value) => {
                    setAge(value);
                  }}></TextInput>
                {DescBottomlineCustom({width: '88%', height: 1})}
              </View>
              {InforBoxSection('한줄소개')}
              <View style={MyProfileChangeStyles.InforBoxColumnSection}>
                <Text
                  style={{fontSize: 10, fontWeight: '500', color: '#C5C5C5'}}>
                  20글자로 나를 표현해보세요
                </Text>
                <TextInput
                  style={MyProfileChangeStyles.TI}
                  maxLength={5}
                  value={IntroduceText}
                  onChangeText={(value) => {
                    setIntroduceText(value);
                  }}></TextInput>
                {DescBottomlineCustom({width: '88%', height: 1})}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileChangeScreen;
