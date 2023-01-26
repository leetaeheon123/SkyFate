import {WithLocalSvg} from 'react-native-svg';
import LoginText from 'Assets/SignInUp/Login_Main.svg';
import RegisterText from 'Assets/SignInUp/Register_Main.svg';

import EmailText from 'Assets/SignInUp/Email_Sub.svg';
import PasswordText from 'Assets/SignInUp/Password_Sub.svg';

export const MainText_LoginSvg = () => {
  return <WithLocalSvg asset={LoginText}></WithLocalSvg>;
};

export const MainText_RegisterSvg = () => {
  return <WithLocalSvg asset={RegisterText}></WithLocalSvg>;
};

export const SubText_EmailSvg = () => {
  return <WithLocalSvg asset={EmailText}></WithLocalSvg>;
};

export const SubText_PasswordSvg = () => {
  return <WithLocalSvg asset={PasswordText}></WithLocalSvg>;
};
