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

const num = 7;
const per = 100 / num;
export const MyProfileChangeStyles = StyleSheet.create({
  Headers: {
    width: '100%',
    height: '44%',
    backgroundColor: 'red',
  },
  Body: {
    width: '100%',
    height: '66%',
    // backgroundColor: 'purple',
  },

  InforView: [
    styles.W90ML5,
    styles.Column_OnlyRowCenter,
    {
      height: '84%',
      backgroundColor: '#37375B',
      borderTopStartRadius: 55,
      borderTopEndRadius: 55,
      marginTop: '6%',
    },
  ],
  SubText: {
    fontSize: 12,
    fontWeight: '300',
    color: '#C3BFBF80',
  },
  InforBox: [
    {
      height: '56%',
      width: '80%',
      marginTop: '2%',
    },
  ],
  InforBoxSection: [
    // styles.Row_OnlyFlex,
    styles.Row_OnlyColumnCenter,

    {
      width: '100%',
      height: `${per * 0.7}%`,
    },
  ],
  InforBoxColumnSection: [
    styles.Column_OnlyFlex,
    {
      width: '100%',
      height: `${per * 1.3}%`,
      marginLeft: 17,
    },
  ],
  InforBoxText: {
    fontWeight: '600',
    fontSize: 14,
    color: 'white',
    // marginLeft: 7,
  },
  TextBox: [],
  TI: {
    width: '100%',
    // height: '90%',
    // height: 46,
    color: 'white',
  },
});
