import {WithLocalSvg} from 'react-native-svg';
import Message from 'Assets/Chat/Message.svg';
import ExplainLimit_Main from 'Assets/Chat/ExplainLimit_Main.svg';
import ExplainLimit_Sub from 'Assets/Chat/ExplainLimit_Sub.svg';
import ExplainLimit_Bomb from 'Assets/Chat/ExplainLimit_Bomb.svg';

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
