import {StyleSheet, Dimensions, Platform} from 'react-native';
import styles from './ManToManBoard';

export const L1styles = StyleSheet.create({
  ChatModal: [
    styles.Column_OnlyFlex,
    {
      // top: '-5%',
      width: '100%',
      height: '100%',
      marginLeft: '0%',
      //   backgroundColor: 'gray',
      marginBottom: Platform.OS === 'android' ? 0 : null,
      //   marginBottom: 0,
      marginTop: 0,
      justifyContent: 'flex-end',
    },
  ],

  Body: {
    width: '100%',
    height: '80%',
  },
  Header: [
    styles.RowCenter,
    {
      width: '100%',
      height: '15%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      //   borderTopEndRadius: 20,
      //   borderTopStartRadius: 20,
    },
  ],
  Main: {
    width: '100%',
    height: '85%',
    backgroundColor: '#37375B',
  },
});
