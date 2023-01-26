import {StyleSheet, Dimensions} from 'react-native';
import styles from './ManToManBoard';

const {width} = Dimensions.get('window');
export const MyProfileStyles = StyleSheet.create({
  Body: {
    flex: 1,
  },

  ImageView: {
    width: '100%',
    height: '60%',
  },

  FullImage: {
    width: '100%',
    height: '100%',
  },
  SubImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  Main: [
    styles.Column_OnlyRowCenter,
    {
      width: '100%',
      height: '50%',
      backgroundColor: '#37375B',
      borderTopEndRadius: 48,
      borderTopStartRadius: 48,
      marginTop: -width * 0.1,
    },
  ],
  footer: {
    width: '100%',
    height: '10%',
    backgroundColor: '#37375B',
  },
  Title: [
    styles.Column_OnlyRowCenter,
    {
      height: '35%',
      justifyContent: 'space-evenly',
      // backgroundColor: 'orange',
    },
  ],
  Desc: [
    styles.Column_OnlyRowCenter,
    {
      width: '45%',
      height: '65%',
      // backgroundColor: 'gray',
      justifyContent: 'space-evenly',
    },
  ],

  TextBox: [
    styles.Column_OnlyRowCenter,
    {height: 35, justifyContent: 'space-between'},
  ],

  DescBox: [styles.RowCenter],

  DescCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },

  linearGradient: [
    styles.RowCenter,
    {
      width: 94,
      height: 94,
      borderRadius: 50,
    },
  ],

  NickName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  DescBottomLine: {
    width: 160,
    height: 1,
  },
  Mbti: {
    fontWeight: '500',
    fontSize: 16,
    color: 'white',
  },
});
