import {WithLocalSvg} from 'react-native-svg';
import Back from 'Assets/Back.svg';
import Line from 'Assets/Line.svg';
import LongLine from 'Assets/LongLine.svg';
import {Dimensions} from 'react-native';

import Plus from 'Assets/Plus.svg';
import Minus from 'Assets/Minus.svg';

import People from 'Assets/People.svg';
import PeopleAdd from 'Assets/PeopleAdd.svg';
import Complete from 'Assets/Complete.svg';

import ClickedComplete from 'Assets/ClickedComplete.svg';

import VerticalLine from 'Assets/VerticalLine.svg';

import Check from 'Assets/Check.svg';
import ClickedCheck from 'Assets/ClickedCheck.svg';

import Pay from 'Assets/Pay.svg';

import Security from 'Assets/Security.svg';
const Gwidth = Dimensions.get('window').width;
export const BackSvg = (width) => {
  let height = width * 1.8;
  return <WithLocalSvg asset={Back} width={width} height={height} />;
};

export const LineSvg = (width) => {
  return <WithLocalSvg asset={Line} width={width} height={1}></WithLocalSvg>;
};

export const LongLineSvg = (width) => {
  return (
    <WithLocalSvg asset={LongLine} width={width} height={1}></WithLocalSvg>
  );
};

export const LongLineFixSvg = () => {
  let width = Gwidth * 0.9;
  return (
    <WithLocalSvg asset={LongLine} width={width} height={1}></WithLocalSvg>
  );
};
export const PlusSvg = (width) => {
  return (
    <WithLocalSvg asset={Plus} width={width} height={width}></WithLocalSvg>
  );
};
export const MinusSvg = (width) => {
  return (
    <WithLocalSvg asset={Minus} width={width} height={width}></WithLocalSvg>
  );
};

export const CompleteSvg = (width) => {
  return (
    <WithLocalSvg asset={Complete} width={width} height={46}></WithLocalSvg>
  );
};

export const ClickedCompleteSvg = (width) => {
  return (
    <WithLocalSvg
      asset={ClickedComplete}
      width={width}
      height={46}></WithLocalSvg>
  );
};

export const PeopleSvg = (width, styleParam) => {
  return (
    <WithLocalSvg
      asset={People}
      width={width}
      height={width}
      style={styleParam}></WithLocalSvg>
  );
};

export const PeopleAddSvg = (width, styleParam) => {
  return (
    <WithLocalSvg
      asset={PeopleAdd}
      width={width}
      height={width}
      style={styleParam}></WithLocalSvg>
  );
};

export const VerticalLineSvg = (width) => {
  return (
    <WithLocalSvg asset={VerticalLine} height={101} width={1}></WithLocalSvg>
  );
};

export const CheckSvg = (width) => {
  return (
    <WithLocalSvg asset={Check} height={width} width={width}></WithLocalSvg>
  );
};

export const ClickedCheckSvg = (width) => {
  return (
    <WithLocalSvg
      asset={ClickedCheck}
      height={width}
      width={width}></WithLocalSvg>
  );
};

export const PaySvg = (width) => (
  <WithLocalSvg asset={Pay} width={width} height={width}></WithLocalSvg>
);

export const SecuritySvg = (width, height) => (
  <WithLocalSvg asset={Security} width={width} height={height}></WithLocalSvg>
);
