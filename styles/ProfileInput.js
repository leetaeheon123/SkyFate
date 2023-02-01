import {StyleSheet} from 'react-native';

export const AgeStyles = StyleSheet.create({
  TextInput: {
    // width: 36,
    // height: 36,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'flex-end',
    // backgroundColor: 'red',
  },
});

export const MbtiStyles = StyleSheet.create({
  MbtiSelectView: [
    styles.Row_OnlyColumnCenter,
    {
      width: '100%',
      justifyContent: 'space-between',
    },
  ],
});

export const ProfileImageStyles = StyleSheet.create({
  ImageSelectView: [
    styles.Row_OnlyColumnCenter,
    {
      width: '100%',
      justifyContent: 'space-around',
      marginTop: 20,
    },
  ],
  Image: {width: 106, height: 144, borderRadius: 30},
});
