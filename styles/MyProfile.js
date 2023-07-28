import {StyleSheet, Dimensions} from 'react-native';
import styles from './ManToManBoard';
import {
  HPer1,
  HPer10,
  HPer15,
  HPer20,
  HPer3,
  HPer30,
  HPer5,
  HPer50,
  HPer60,
  HPer90,
  WPer100,
  WPer80,
  WPer90,
} from './Per';
import {MainColor} from './Color/OneColor';

const {width, height} = Dimensions.get('window');
const W20 = width * 0.2;
export const MyProfileStyles = StyleSheet.create({
  Body: {
    flex: 1,
    backgroundColor: '#37375B',
  },
  ScrollView: {
    flex: 1,
  },

  ImageView: {
    width: '100%',
    height: HPer60,
  },

  FullImage: {
    width: '100%',
    height: HPer60,
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
      height: HPer90,
      // backgroundColor: '#37375B',
      backgroundColor: '#37375B',
      borderTopEndRadius: 48,
      borderTopStartRadius: 48,
      marginTop: -width * 0.1,
      zIndex: 3,
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
      height: HPer15,
      justifyContent: 'space-evenly',
      // backgroundColor: 'orange',
    },
  ],
  Desc: [
    styles.Column_OnlyRowCenter,
    {
      width: '45%',
      height: HPer20,
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
    // width: 160,
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
  Headers: [
    styles.Column_OnlyFlex,
    {
      width: '100%',
    },
  ],
  HeadersGrid: [
    styles.Row_OnlyColumnCenter,
    styles.DefaultBorder,
    {
      width: '100%',
      // height: height * 0.22,
      height: height * 0.18,
      justifyContent: 'space-evenly',
      // backgroundColor: 'skyblue',
      // borderColor: MainColor,
    },
  ],
  Body: {
    width: '100%',
    // backgroundColor: 'purple',
  },

  ProfileImage: {
    width: W20,
    height: W20 * 1.24,
    borderRadius: 24.6,
  },

  InforView: [
    styles.Column_OnlyRowCenter,
    {
      width: WPer100,
      height: HPer90,
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
      width: WPer80,
      marginTop: '2%',
    },
  ],
  InforBoxSection: [
    styles.Row_OnlyColumnCenter,

    {
      width: '100%',
      height: HPer5,
    },
  ],
  InforBoxColumnSection: [
    styles.Column_OnlyFlex,
    {
      width: '100%',
      height: HPer5,
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
    width: WPer80,
    height: 46,
    color: 'white',
  },
});
