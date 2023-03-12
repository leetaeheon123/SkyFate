import {Btn_ClickableBack} from 'component/General';
import {WaitScreenSvg} from 'component/General/GeneralSvg';
import React from 'react';
import {View, Image} from 'react-native';
import styles from '~/ManToManBoard';
import {HPer90, WPer90} from '~/Per';

import WaitScreenPng from '../Assets/WaitScreen.png';

export const WaitScreen = ({navigation, rotue}: any) => {
  return (
    <View style={[{width: '100%', height: '100%'}, styles.RowCenter]}>
      <Btn_ClickableBack
        width={12}
        style={{position: 'absolute', top: 50, left: '2.5%', zIndex: 10}}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Image
        style={{width: WPer90, height: HPer90}}
        source={require('../Assets/WaitScreen.png')}></Image>
      {/* {WaitScreenSvg} */}
    </View>
  );
};
