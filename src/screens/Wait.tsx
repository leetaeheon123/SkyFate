import {WaitScreenSvg} from 'component/General/GeneralSvg';
import React from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';
import styles from '~/ManToManBoard';
export const WaitScreen = () => {
  return (
    <View style={{width: '100%', height: '100%'}}>
      {WaitScreenSvg}
      {/* <ScrollView style={[styles.W100H100]}>{WaitScreenSvg}</ScrollView> */}
    </View>
  );
};
