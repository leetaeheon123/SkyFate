import {Text} from 'react-native';
import {fontWeights} from '~/FontWeights';
import React from 'react';

export const PI_C_Title = ({Title}) => (
  <Text
    style={{
      fontSize: 22,
      fontWeight: '700',
    }}>
    {Title}
  </Text>
);
{
  /*500, 20,  #94A1AC */
}

export const PI_C_Desc = ({Desc}) => (
  <Text
    style={{
      fontSize: 18,
      fontWeight: '700',
      color: '#94A1AC',
      marginTop: 5,
    }}>
    {Desc}
  </Text>
);
