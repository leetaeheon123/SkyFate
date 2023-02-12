import WithdrawalText from 'Assets/Withdrawal/WithdrawalText.svg';
import WithdrawalCat from 'Assets/Withdrawal/WithdrawalCat.svg';

import {WithLocalSvg} from 'react-native-svg';

export const WithdrawalTextSvg = (
  <WithLocalSvg asset={WithdrawalText}></WithLocalSvg>
);

// export const WithdrawalCatSvg = (
//   <WithLocalSvg asset={WithdrawalCat}></WithLocalSvg>
// );
export const WithdrawalCatSvg = (props) => {
  const {style} = props;
  return <WithLocalSvg asset={WithdrawalCat} style={style}></WithLocalSvg>;
};
