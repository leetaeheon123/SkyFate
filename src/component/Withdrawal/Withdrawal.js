import WithdrawalText from 'Assets/Withdrawal/WithdrawalText.svg';
import WithdrawalCat from 'Assets/Withdrawal/WithdrawalCat.svg';
import 탈퇴하기 from 'Assets/Withdrawal/탈퇴하기.svg';
import {WithLocalSvg} from 'react-native-svg';

export const WithdrawalTextSvg = (
  <WithLocalSvg asset={WithdrawalText}></WithLocalSvg>
);

export const 탈퇴하기Svg = <WithLocalSvg asset={탈퇴하기}></WithLocalSvg>;

// export const WithdrawalCatSvg = (
//   <WithLocalSvg asset={WithdrawalCat}></WithLocalSvg>
// );
export const WithdrawalCatSvg = (props) => {
  const {style} = props;
  return <WithLocalSvg asset={WithdrawalCat} style={style}></WithLocalSvg>;
};
