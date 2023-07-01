import {WithLocalSvg} from 'react-native-svg';
import Message from 'Assets/Chat/Message.svg';
import ExplainLimit_Main from 'Assets/Chat/ExplainLimit_Main.svg';
import ExplainLimit_Sub from 'Assets/Chat/ExplainLimit_Sub.svg';
import ExplainLimit_Bomb from 'Assets/Chat/ExplainLimit_Bomb.svg';

import BombIcon from 'Assets/BombIcon.svg';
import M5Chat from 'Assets/Chat/M5Chat.svg';

import L1Chat from 'Assets/Chat/L1Chat.svg';
import L1Invite from 'Assets/Chat/L1Invite.svg';

import ChatLeave from 'Assets/Chat/ChatLeave.svg';
import ChatReport from 'Assets/Chat/ChatReport.svg';
import ChatReportNotShadow from 'Assets/Chat/ChatReportNotShadow.svg';

import Congratulate from 'Assets/Chat/Congratulate.svg';

export const Text_Message = (width) => {
  //   let height = width * 1.8;
  let height = width / 3;

  return <WithLocalSvg asset={Message} width={width} height={height} />;
};

export const Text_ExplainLimit_Sub = () => {
  // let height = width / 3;

  return <WithLocalSvg asset={ExplainLimit_Sub} />;
};

export const Text_ExplainLimit_Main = () => {
  // let height = width / 3;

  return <WithLocalSvg asset={ExplainLimit_Main} />;
};

export const ExplainLimit_BombSvg = (width) => {
  let height = width;

  return (
    <WithLocalSvg asset={ExplainLimit_Bomb} width={width} height={height} />
  );
};

export const BombIconSvg = <WithLocalSvg asset={BombIcon}></WithLocalSvg>;
export const M5ChatSvg = (width) => (
  <WithLocalSvg asset={M5Chat} width={width} height={width} />
);

export const L1ChatSvg = <WithLocalSvg asset={L1Chat} />;
export const ChatLeaveSvg = (
  <WithLocalSvg asset={ChatLeave} width={45} height={45} />
);
export const ChatReportSvg = (
  <WithLocalSvg asset={ChatReport} width={45} height={45} />
);

export const ChatReportNotShadowSvg = (
  <WithLocalSvg asset={ChatReportNotShadow} width={32} height={32} />
);

export const L1InviteSvg = (width) => (
  <WithLocalSvg
    asset={L1Invite}
    width={width}
    height={width}
    // style={{backgroundColor: 'blue'}}
  />
);

export const CongratulateSvg = (width) => {
  return (
    <WithLocalSvg
      asset={Congratulate}
      width={width}
      // height={width * 0.81}
    />
  );
};

