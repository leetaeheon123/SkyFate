import React from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {LoginAndReigsterStyles} from '~/LoginAndRegiser';

import {
  Btn_ClickableNextSvg,
  Btn_NotClickableNextSvg,
} from './Profile/ProfileSvg';

const width = Dimensions.get('window').width;

export const Btn_ClickableNext = (props) => {
  const onPress = props.onPress;
  return (
    <TouchableOpacity
      style={LoginAndReigsterStyles.Btn_Clickable}
      onPress={() => {
        onPress();
      }}>
      {Btn_ClickableNextSvg(width * 0.9)}
    </TouchableOpacity>
  );
};

export const Btn_NotClickableNext = () => {
  return (
    <View style={LoginAndReigsterStyles.CheckBox}>
      {Btn_NotClickableNextSvg(width * 0.9)}
    </View>
  );
};

export const ProfileTopLine = () => (
  <View
    style={{
      width: '70%',
      height: 2.5,
      position: 'absolute',
      top: 24,
      left: '15%',
      display: 'flex',
      flexDirection: 'row',
      zIndex: 10,
    }}>
    <View
      style={{
        height: '100%',
        width: '33%',
        backgroundColor: 'white',
        borderRadius: 4,
      }}
    />
    <View
      style={{
        height: '100%',
        width: '33%',
        backgroundColor: 'white',
        borderRadius: 4,
      }}
    />
    <View
      style={{
        height: '100%',
        width: '33%',
        backgroundColor: 'white',
        borderRadius: 4,
      }}
    />
  </View>
);
