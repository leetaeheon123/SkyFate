import {StyleSheet} from 'react-native';
const COLOR = '#6E01EF';
// const COLOR = 'skyblue';

const SIZE = 100;

const MarkerAnimationStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    // height: SIZE,
    // width: SIZE,
    // borderRadius: SIZE / 2,
    height: 80,
    width: 80,
    borderRadius: 40,

    // backgroundColor: COLOR,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  Image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  SecondImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: -15,
  },
});

export default MarkerAnimationStyles;
