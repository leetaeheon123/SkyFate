export const fontWeights = {
  Thin: 100,
  UltraLight: 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  Semibold: 600,
  Bold: 700,
  Heavy: 800,
  Black: 900,
};

import {StyleSheet} from 'react-native';

export const FWStyles = StyleSheet.create({
  Thin: {
    fontWeight: '100',
  },
  UltraLight: {
    fontWeight: '200',
  },
  Light: {fontWeight: '300'},
  Regular: {fontWeight: '400'},
  Medium: {fontWeight: '500'},
  Semibold: {fontWeight: '600'},
  Bold: {fontWeight: '700'},
  Heavy: {fontWeight: '800'},
  Black: {fontWeight: '900'},
});

export const FSStyles = (FS) =>
  StyleSheet.create({
    General: {
      fontSize: FS,
    },
  });
