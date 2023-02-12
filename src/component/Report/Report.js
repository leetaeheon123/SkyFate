import WhiteReport from 'Assets/Report/WhiteReport.svg';
import LinearReport from 'Assets/Report/LinearReport.svg';
import 취소하기 from 'Assets/Report/취소하기.svg';
import {WithLocalSvg} from 'react-native-svg';

export const WhiteReportSvg = (
  <WithLocalSvg
    asset={WhiteReport}
    style={{
      marginTop: '7%',
    }}></WithLocalSvg>
);

export const LinearReportSvg = (
  <WithLocalSvg asset={LinearReport}></WithLocalSvg>
);

export const 취소하기Svg = <WithLocalSvg asset={취소하기}></WithLocalSvg>;
