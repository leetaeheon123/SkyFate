import React from 'react';
import {WithLocalSvg} from 'react-native-svg';

import ToggleOn from 'Assets/Setting/ToggleOn.svg';
import ToggleOff from 'Assets/Setting/ToggleOff.svg';
import Complete from 'Assets/Setting/CompleteText.svg';

import SettingText from 'Assets/Setting/SettingText.svg';

export const ToggleOnSvg = () => {
  return <WithLocalSvg width={51} height={35} asset={ToggleOn} />;
};

export const ToggleOffSvg = () => {
  return <WithLocalSvg width={51} height={35} asset={ToggleOff} />;
};

export const HeaderCompleteSvg = (width) => {
  return <WithLocalSvg asset={Complete} width={width} height={width} />;
};

export const HeaderText_Setting = () => {
  return <WithLocalSvg width={35} height={35} asset={SettingText} />;
};
