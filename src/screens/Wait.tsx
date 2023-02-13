import {WaitScreenSvg} from 'component/General/GeneralSvg';
import React from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';
import styles from '~/ManToManBoard';
export const WaitScreen = () => {
  return (
    <SafeAreaView style={{width: '100%', height: '100%'}}>
      <ScrollView style={[styles.W100H100, {backgroundColor: 'red'}]}>
        {WaitScreenSvg}
      </ScrollView>
    </SafeAreaView>
  );
};
