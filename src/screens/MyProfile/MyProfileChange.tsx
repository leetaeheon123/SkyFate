import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {MyProfileChangeStyles, MyProfileStyles} from '~/MyProfile';
import {Type2} from 'component/LinearGradient/LinearType';

import LinearGradient from 'react-native-linear-gradient';
import {Type2ProfileImageCircle} from 'component/LinearGradient/LinearGradientCircle';
import {DescBottomline, DescBottomlineCustom, DescCricle} from './MyProfile';
import {TextInput} from 'react-native-gesture-handler';
import styles from '~/ManToManBoard';

const MyProfileChangeScreen = ({route}: any) => {
  const {width} = Dimensions.get('window');
  const {UserData} = route.params;

  const Per20 = width * 0.2;

  const InforBoxSection = (Desc: string) => {
    return (
      <View style={MyProfileChangeStyles.InforBoxSection}>
        {DescCricle}
        <Text style={MyProfileChangeStyles.InforBoxText}>{Desc}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient
        colors={Type2}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{
          width: '100%',
        }}>
        <View style={MyProfileChangeStyles.Headers}></View>

        <KeyboardAvoidingView style={MyProfileChangeStyles.Body}>
          <View style={MyProfileChangeStyles.InforView}>
            <View
              style={{
                position: 'absolute',
                top: '-13%',
              }}>
              {Type2ProfileImageCircle(
                width * 0.2,
                width * 0.2,
                UserData.ProfileImageUrl,
              )}
            </View>
            <Text style={[MyProfileStyles.NickName, {marginTop: 21}]}>
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
                <Text style={styles.WhiteColor}>기본 정보</Text>
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
                  
                  ></TextInput>
                {DescBottomlineCustom({width: '88%', height: 1})}
              </View>
              {InforBoxSection('한줄소개')}
              <View style={MyProfileChangeStyles.InforBoxColumnSection}>
                <Text
                  style={{fontSize: 10, fontWeight: '500', color: '#C5C5C5'}}>
                  5글자로 나를 표현해보세요
                </Text>
                <TextInput
                  style={MyProfileChangeStyles.TI}
                  maxLength={5}></TextInput>
                {DescBottomlineCustom({width: '88%', height: 1})}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default MyProfileChangeScreen;
