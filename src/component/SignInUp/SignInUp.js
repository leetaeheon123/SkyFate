import {WithLocalSvg} from 'react-native-svg';
import LoginText from 'Assets/SignInUp/Login_Main.svg';
import RegisterText from 'Assets/SignInUp/Register_Main.svg';

import EmailText from 'Assets/SignInUp/Email_Sub.svg';
import PasswordText from 'Assets/SignInUp/Password_Sub.svg';

import AgreementHead from 'Assets/SignInUp/Agreement_Main.svg';
import AgreementText from 'Assets/SignInUp/Agreement_Check.svg';
import AgreementText2 from 'Assets/SignInUp/Agreement_Check2.svg';
import AgreementText3 from 'Assets/SignInUp/Agreement_Check3.svg';
import AgreementText4 from 'Assets/SignInUp/Agreement_Check4.svg';

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

export const MainHead_AgreementSvg = () => {
  return <WithLocalSvg asset={AgreementHead} />;
};

export const MainText_AgreementSvg = () => {
  return <WithLocalSvg asset={AgreementText} />;
};

export const MainText2_AgreementSvg = () => {
  return <WithLocalSvg asset={AgreementText2} />;
};

export const MainText3_AgreementSvg = () => {
  return <WithLocalSvg asset={AgreementText3} />;
};

export const MainText4_AgreementSvg = () => {
  return <WithLocalSvg asset={AgreementText4} />;
};
