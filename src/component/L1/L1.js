import L1Bar1 from 'Assets/L1/L1Bar1.svg';
import L1Bar2 from 'Assets/L1/L1Bar2.svg';
import L1Bar3 from 'Assets/L1/L1Bar3.svg';
import L1Bar4 from 'Assets/L1/L1Bar4.svg';
import L1Bar5 from 'Assets/L1/L1Bar5.svg';
import L1Bar6 from 'Assets/L1/L1Bar6.svg';
import L1Bar7 from 'Assets/L1/L1Bar7.svg';
import L1Bar8 from 'Assets/L1/L1Bar8.svg';
import L1Bar9 from 'Assets/L1/L1Bar9.svg';
import L1Bar10 from 'Assets/L1/L1Bar10.svg';
import L1Bar11 from 'Assets/L1/L1Bar11.svg';
import L1Bar12 from 'Assets/L1/L1Bar12.svg';
import L1Bar13 from 'Assets/L1/L1Bar13.svg';
import L1Bar14 from 'Assets/L1/L1Bar14.svg';
import L1Bar15 from 'Assets/L1/L1Bar15.svg';
import {WithLocalSvg} from 'react-native-svg';

export const L1Bar1Svg = <WithLocalSvg asset={L1Bar1}></WithLocalSvg>;
export const L1Bar2Svg = <WithLocalSvg asset={L1Bar2}></WithLocalSvg>;
export const L1Bar3Svg = <WithLocalSvg asset={L1Bar3}></WithLocalSvg>;
export const L1Bar4Svg = <WithLocalSvg asset={L1Bar4}></WithLocalSvg>;
export const L1Bar5Svg = <WithLocalSvg asset={L1Bar5}></WithLocalSvg>;
export const L1Bar6Svg = <WithLocalSvg asset={L1Bar6}></WithLocalSvg>;
export const L1Bar7Svg = <WithLocalSvg asset={L1Bar7}></WithLocalSvg>;
export const L1Bar8Svg = <WithLocalSvg asset={L1Bar8}></WithLocalSvg>;
export const L1Bar9Svg = <WithLocalSvg asset={L1Bar9}></WithLocalSvg>;
export const L1Bar10Svg = <WithLocalSvg asset={L1Bar10}></WithLocalSvg>;
export const L1Bar11Svg = <WithLocalSvg asset={L1Bar11}></WithLocalSvg>;
export const L1Bar12Svg = <WithLocalSvg asset={L1Bar12}></WithLocalSvg>;
export const L1Bar13Svg = <WithLocalSvg asset={L1Bar13}></WithLocalSvg>;
export const L1Bar14Svg = <WithLocalSvg asset={L1Bar14}></WithLocalSvg>;
export const L1Bar15Svg = (
  <WithLocalSvg
    asset={L1Bar15}
    style={{
      borderRadius: 18,
    }}></WithLocalSvg>
);

const Obj = {
  1: L1Bar1Svg,
  2: L1Bar2Svg,
  3: L1Bar3Svg,
  4: L1Bar4Svg,
  5: L1Bar5Svg,
  6: L1Bar6Svg,
  7: L1Bar7Svg,
  8: L1Bar8Svg,
  9: L1Bar9Svg,
  10: L1Bar10Svg,
  11: L1Bar11Svg,
  12: L1Bar12Svg,
  13: L1Bar13Svg,
  14: L1Bar14Svg,
  15: L1Bar15Svg,
};

export const Result = (value) => {
  return Obj[value];
};
