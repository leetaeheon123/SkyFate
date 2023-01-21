import {WithLocalSvg} from 'react-native-svg';
import Back from 'Assets/Back.svg';
export const BackSvg = (width) => {
  let height = width * 1.8;
  return <WithLocalSvg asset={Back} width={width} height={height} />;
};
