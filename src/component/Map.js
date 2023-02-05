import React from 'react';
import {View} from 'react-native';
const Element = (
  <View
    style={{
      height: '100%',
      width: '33%',
      backgroundColor: 'white',
      borderRadius: 6,
    }}
  />
);

export const MapTopLine = () => (
  <View
    style={{
      width: '82%',
      height: 3.7,
      position: 'absolute',
      top: 32,
      left: '9%',
      display: 'flex',
      flexDirection: 'row',
      // backgroundColor: 'red',
    }}>
    {Element}
    {Element}
    {Element}
  </View>
);
