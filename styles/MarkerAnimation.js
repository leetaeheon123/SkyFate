import {StyleSheet} from 'react-native';
// const COLOR = '#6E01EF';
const COLOR = 'skyblue';

const SIZE = 50;

const MarkerAnimationStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: COLOR,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  Image: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
});

export default MarkerAnimationStyles;
