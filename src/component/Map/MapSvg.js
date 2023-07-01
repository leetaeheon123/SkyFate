import {WithLocalSvg} from 'react-native-svg';
import GeneralMatch from 'Assets/Map/GeneralMatch.svg';
import ClickedGeneralMatch from 'Assets/Map/ClickedGeneralMatch.svg';

import RandomMatch from 'Assets/Map/RandomMatch.svg';
import ClickedRandomMatch from 'Assets/Map/ClickedRandomMatch.svg';

import Enter_Match from 'Assets/Map/Enter_Match.svg';
import ClickedEnter_Match from 'Assets/Map/ClickedEnter_Match.svg';

import Enter_Chat from 'Assets/Enter_Chat.svg';
import EventBtn from 'Assets/FirstEvent/EventBtn.svg';

import Setting from 'Assets/Setting.svg';
import Setting2 from 'Assets/Setting2.svg';
import Setting3 from 'Assets/Setting3.svg';

import Enter_FriendMap from 'Assets/Map/Enter_FriendMap.svg';
import M3TopBackground from 'Assets/Map/M3/M3TopBackground.svg';
import M3Top from 'Assets/Map/M3/M3Top.svg';
import M3Main_TopBar from 'Assets/Map/M3/M3Main_TopBar.svg';

import M3Main_TopBarWhiteHeart from 'Assets/Map/M3/M3Main_TopBarWhiteHeart.svg';

import Pay_Putoff from 'Assets/Map/M3/Pay_Putoff.svg';
import ClickedPay_Half from 'Assets/Map/M3/ClickedPay_Half.svg';

import Pay_Half from 'Assets/Map/M3/Pay_Half.svg';

import On from 'Assets/On.svg';
import Off from 'Assets/Off.svg';
import OnToggle from 'Assets/Map/OnToggle.svg';
import OffToggle from 'Assets/Map/OffToggle.svg';
import {HPer1, HPer2, HPer5} from '~/Per';

export const GeneralMatchSvg = (width) => {
  let height = width;
  return <WithLocalSvg asset={GeneralMatch} width={width} height={height} />;
};

export const ClickedGeneralMatchSvg = (width) => {
  let height = width;
  return (
    <WithLocalSvg asset={ClickedGeneralMatch} width={width} height={height} />
  );
};

export const RandomMatchSvg = (width) => {
  let height = width;
  return <WithLocalSvg asset={RandomMatch} width={width} height={height} />;
};

export const ClickedRandomMatchSvg = (width) => {
  let height = width;
  return (
    <WithLocalSvg asset={ClickedRandomMatch} width={width} height={height} />
  );
};

export const Enter_MatchSvg = (width) => {
  let height = width;
  return <WithLocalSvg asset={Enter_Match} width={width} height={height} />;
};
export const ClickedEnter_MatchSvg = (width) => {
  let height = width * 1.63;
  return (
    <WithLocalSvg asset={ClickedEnter_Match} width={width} height={height} />
  );
};

export const Enter_ChatSvg = (width) => {
  let height = width;
  return <WithLocalSvg asset={Enter_Chat} width={width} height={height} />;
};

export const EventBtnSvg = (width) => {
  let height = width;
  return <WithLocalSvg asset={EventBtn} width={width} height={height} />;
};

export const Enter_SettingSvg = (width) => {
  let height = width;
  return <WithLocalSvg asset={Setting3} width={width} height={height} />;
};

export const Enter_FriendMapSvg = (width) => {
  let height = width;
  return <WithLocalSvg asset={Enter_FriendMap} width={width} height={height} />;
};

export const M3TopBackgroundSvg = (width) => {
  let height = width * 0.59;
  return <WithLocalSvg asset={M3TopBackground} width={width} height={height} />;
};

export const M3TopSvg = (width) => {
  let height = width * 0.59;
  return <WithLocalSvg asset={M3Top} width={width} height={height} />;
};

export const M3Main_TopBarSvg = (width) => {
  return <WithLocalSvg asset={M3Main_TopBar} width={width}></WithLocalSvg>;
};
export const M3Main_TopBarWhiteHeartSvg = (width) => (
  <WithLocalSvg
    asset={M3Main_TopBarWhiteHeart}
    style={{
      position: 'absolute',
      left: '2.2%',
      top: -HPer1,
    }}
    width={width}
    height={width}></WithLocalSvg>
);

export const Pay_PutoffSvg = (width) => {
  return <WithLocalSvg asset={Pay_Putoff} width={width} height={65} />;
};

export const Pay_HalfSvg = (width) => {
  return <WithLocalSvg asset={Pay_Half} width={width} height={65} />;
};

export const ClickedPay_HalfSvg = (width) => {
  return <WithLocalSvg asset={ClickedPay_Half} width={width} height={65} />;
};

export const OnSvg = <WithLocalSvg asset={On} />;
export const OffSvg = <WithLocalSvg asset={Off} />;

export const OnToggleSvg = <WithLocalSvg asset={OnToggle} />;
export const OffToggleSvg = <WithLocalSvg asset={OffToggle} />;
