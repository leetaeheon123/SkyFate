import {StyleSheet} from 'react-native';
import {FSStyles, FWStyles} from './FontWeights';

export const SettingStyles = StyleSheet.create({
  Body: {
    width: '100%',
    height: '100%',
    backgroundColor: '#37375B',
  },
  MainText: [
    {color: '#B5BAC0', marginLeft: 21, marginTop: 38},
    FWStyles.Semibold,
    FSStyles(18).General,
  ],
  H2Text: [FWStyles.Regular, FSStyles(17).General, {color: '#F2F3F7'}],
});
