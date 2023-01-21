import React from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {BackSvg} from './General/GeneralSvg';

export const Btn_ClickableBack = (props) => {
  const {width, onPress} = props;
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}>
      {BackSvg(width)}
    </TouchableOpacity>
  );
};
