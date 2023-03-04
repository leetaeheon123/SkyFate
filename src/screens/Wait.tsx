import {WaitScreenSvg} from 'component/General/GeneralSvg';
import React from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';
export const WaitScreen = () => {
  return <View style={{width: '100%', height: '100%'}}>{WaitScreenSvg}</View>;
};
