import {WithLocalSvg} from 'react-native-svg';
import GeneralMatch from 'Assets/Map/GeneralMatch.svg';
import RandomMatch from 'Assets/Map/RandomMatch.svg';
import Enter_Match from 'Assets/Map/Enter_Match.svg';
import Entered_Match from 'Assets/Map/Entered_Match.svg';

export const GeneralMatchSvg = (width) => {
  let height = width;
  return <WithLocalSvg asset={GeneralMatch} width={width} height={height} />;
};

export const RandomMatchSvg = (width) => {
  let height = width;
  return <WithLocalSvg asset={RandomMatch} width={width} height={height} />;
};

export const Enter_MatchSvg = (width) => {
  let height = width;
  return <WithLocalSvg asset={Enter_Match} width={width} height={height} />;
};
export const Entered_MatchSvg = (width) => {
  let height = width;
  return <WithLocalSvg asset={Entered_Match} width={width} height={height} />;
};