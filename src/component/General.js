import React from 'react';
import {Dimensions, TouchableOpacity, View, Image, Text} from 'react-native';
import {BackSvg} from './General/GeneralSvg';
import styles from '~/ManToManBoard';
import LinearGradient from 'react-native-linear-gradient';
import {MyProfileStyles} from '~/MyProfile';
import {BombIconSvg} from './Chat/ChatSvg';
import BombIcon from 'Assets/BombIcon.svg';
import {WithLocalSvg} from 'react-native-svg';

export const Btn_ClickableBack = (props) => {
  const {width, onPress} = props;
  return (
    <TouchableOpacity
      style={[
        styles.RowCenter,
        {
          width: 30,
          height: 30,
          // backgroundColor: 'green'
        },
      ]}
      onPress={() => {
        onPress();
      }}>
      {BackSvg(width)}
    </TouchableOpacity>
  );
};

export const LinearProfileImage = (uri) => (
  <LinearGradient
    start={{x: 0.5, y: 0}}
    end={{x: 0.5, y: 1}}
    colors={['#5B5AF3', '#5B59F3', '#835CF0', '#B567DB']}
    style={[
      styles.RowCenter,
      {
        width: '70%',
        height: '70%',
        borderRadius: 100,
      },
    ]}>
    <Image
      resizeMode="cover"
      style={{
        width: '95%',
        height: '95%',
        borderRadius: 100,
      }}
      source={{uri: uri}}></Image>
  </LinearGradient>
);
export const LinearProfileImagView = (width, height, uri, NickName) => (
  <View
    style={[
      styles.Column_OnlyRowCenter,
      {
        justifyContent: 'space-evenly',
        width: width,
        height: height,
        backgroundColor: 'red',
      },
    ]}>
    {LinearProfileImage(uri)}
    <Text style={MyProfileStyles.NickName}>{NickName}</Text>
  </View>
);

export const BombIconView = (width, num) => (
  <View
    style={{
      width: width,
      height: width,
      // backgroundColor: 'blue',
      position: 'absolute',
      right: 0,
      bottom: 0,
    }}>
    <WithLocalSvg asset={BombIcon} width={width} height={width}></WithLocalSvg>
    <View
      style={[
        styles.RowCenter,
        {
          position: 'absolute',
          right: 0,
          top: 0,
          width: width * 0.3,
          height: width * 0.3,
          borderRadius: (width * 0.3) / 2,
          backgroundColor: 'red',
        },
      ]}>
      <Text
        style={{
          fontWeight: '600',
          fontSize: 16.5,
        }}>
        {10 - num}
      </Text>
    </View>
  </View>
);

export const BombIconViewNotabs = (width, num) => (
  <View
    style={{
      width: width,
      height: width,
    }}>
    <WithLocalSvg asset={BombIcon} width={width} height={width}></WithLocalSvg>
    <View
      style={[
        styles.RowCenter,
        {
          position: 'absolute',
          right: 0,
          top: 0,
          width: width * 0.3,
          height: width * 0.3,
          borderRadius: (width * 0.3) / 2,
          backgroundColor: 'red',
        },
      ]}>
      <Text
        style={{
          fontWeight: '600',
          fontSize: 16.5,
        }}>
        {10 - num}
      </Text>
    </View>
  </View>
);
