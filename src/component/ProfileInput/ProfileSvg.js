import {WithLocalSvg} from 'react-native-svg';
import NickNameText from 'Assets/Profile/NickName/NickNameSelectText.svg';
import MbtiText from 'Assets/Profile/Mbti/MbtiSelectText.svg';
import GenderText from 'Assets/Profile/Gender/GenderSelectText.svg';
import InvalidationText from 'Assets/Profile/Invalidation/InvalidationSelectText.svg';
import RegisterText from 'Assets/Profile/Register/RegisterSelectText.svg';
import ProfileImageText from 'Assets/Profile/ProfileImage/ProfileImageText.svg';

import AgeText from 'Assets/Profile/Age/AgeText.svg';

import NickNameInputText from 'Assets/Profile/NickName/NickNameInputText.svg';
import AgeInputText from 'Assets/Profile/Age/AgeInputText.svg';

import React from 'react';
import NickNameLineSvg from 'Assets/Profile/NickName/NickNameLineSvg.svg';
import AgelineSvg from 'Assets/Profile/Age/Ageline.svg';

import GenderBtn_ClickedGirl from 'Assets/Profile/Gender/GenderBtn_ClickedGirl.svg';
import GenderBtn_ClickedMan from 'Assets/Profile/Gender/GenderBtn_ClickedMan.svg';

import GenderBtn_Girl from 'Assets/Profile/Gender/GenderBtn_Girl.svg';
import GenderBtn_Man from 'Assets/Profile/Gender/GenderBtn_Man.svg';

import E from 'Assets/Profile/Mbti/E.svg';
import ClickedE from 'Assets/Profile/Mbti/ClickedE.svg';
import I from 'Assets/Profile/Mbti/I.svg';
import ClickedI from 'Assets/Profile/Mbti/ClickedI.svg';

import S from 'Assets/Profile/Mbti/S.svg';
import ClickedS from 'Assets/Profile/Mbti/ClickedS.svg';
import N from 'Assets/Profile/Mbti/N.svg';
import ClickedN from 'Assets/Profile/Mbti/ClickedN.svg';

import T from 'Assets/Profile/Mbti/T.svg';
import ClickedT from 'Assets/Profile/Mbti/ClickedT.svg';
import F from 'Assets/Profile/Mbti/F.svg';
import ClickedF from 'Assets/Profile/Mbti/ClickedF.svg';

import J from 'Assets/Profile/Mbti/J.svg';
import ClickedJ from 'Assets/Profile/Mbti/ClickedJ.svg';
import P from 'Assets/Profile/Mbti/P.svg';
import ClickedP from 'Assets/Profile/Mbti/ClickedP.svg';

import SubTextMbti from 'Assets/Profile/Mbti/MbtiSubText.svg';
import SubTextProfileImage from 'Assets/Profile/ProfileImage/ProfileImageSubText.svg';
import SubTextGirlProfileImage from 'Assets/Profile/ProfileImage/SubTextGirlProfileImage.svg';

import AccountExistText from 'Assets/SignInUp/AccountExistText.svg';

import ProfileImageUpload from 'Assets/Profile/ProfileImage/ProfileImageUpload.svg';
import ProfileImageUpload87 from 'Assets/Profile/ProfileImage/ProfileImageUpload87.svg';

import Btn_Clickable from 'Assets/Profile/All/Btn_Clickable.svg';
import Btn_NotClickable from 'Assets/Profile/All/Btn_NotClickable.svg';

import MainColorBtn_Clickable from 'Assets/MainColorBtn_Clickable.svg';
import InvitationText_Main from 'Assets/Invitation/Invitation_Main.svg';
import InvitationText_Sub from 'Assets/Invitation/Invitation_Sub.svg';

import ChangeProfile from 'Assets/ChangeProfile.svg';
import {Dimensions, Text} from 'react-native';

const excuteObj = {
  Mbti: MbtiText,
  Age: AgeText,
  Gender: GenderText,
  NickName: NickNameText,
  Invalidation: InvalidationText,
  Register: RegisterText,
  ProfileImage: ProfileImageText,
  MySelfIntro: <Text>MySelfIntro</Text>,
};

const GenderBtnObj = {
  GenderBtn_Man: GenderBtn_Man,
  GenderBtn_Girl: GenderBtn_Girl,
  GenderBtn_ClickedMan: GenderBtn_ClickedMan,
  GenderBtn_ClickedGirl: GenderBtn_ClickedGirl,
};

const SubTextObj = {
  Mbti: SubTextMbti,
  Age: AgeInputText,
  ProfileImage: SubTextProfileImage,
  ProfileImageGirl: SubTextGirlProfileImage,
  AccountExistText: AccountExistText,
};

const MbtiBtnObj = {
  E: E,
  I: I,
  S: S,
  N: N,
  T: T,
  F: F,
  J: J,
  P: P,
  ClickedE: ClickedE,
  ClickedS: ClickedS,
  ClickedT: ClickedT,
  ClickedJ: ClickedJ,
  ClickedI: ClickedI,
  ClickedN: ClickedN,
  ClickedF: ClickedF,
  ClickedP: ClickedP,
};

const {width, height} = Dimensions.get('window');
const W90 = width * 0.9;
const W21 = width * 0.21;
const H6 = height * 0.06;

export const MbtiBtn = (Name) => {
  let asset = MbtiBtnObj[Name];
  return <WithLocalSvg asset={asset} width={W21} />;
};

export const TextComponent = (Name) => {
  let asset = excuteObj[Name];

  return <WithLocalSvg asset={asset} />;
};

export const GenderBtnComponent = (Name) => {
  let asset = GenderBtnObj[Name];
  return <WithLocalSvg asset={asset} width={W90} />;
};

export const NickNameInput = () => {
  return <WithLocalSvg asset={NickNameInputText}></WithLocalSvg>;
};

export const NickNameLine = () => {
  return <WithLocalSvg asset={NickNameLineSvg}></WithLocalSvg>;
};

export const AgeLine = () => {
  return <WithLocalSvg asset={AgelineSvg}></WithLocalSvg>;
};

export const SubTextComponent = (Name, style = {marginTop: H6}) => {
  let asset = SubTextObj[Name];
  return <WithLocalSvg asset={asset} style={style}></WithLocalSvg>;
};

export const ProfileImageUploadComponent = () => {
  return <WithLocalSvg asset={ProfileImageUpload}></WithLocalSvg>;
};

export const ProfileImageUploadComponentReact = (width) => {
  return (
    <WithLocalSvg
      asset={ProfileImageUpload87}
      width={width}
      height={width * 1.24}></WithLocalSvg>
  );
};

export const Btn_ClickableNextSvg = (width) => {
  let height = width * 0.22;

  return (
    <WithLocalSvg
      width={width}
      height={height}
      asset={Btn_Clickable}></WithLocalSvg>
  );
};

export const MainColorBtn_ClickableSvg = (width) => {
  let height = width * 0.22;

  return (
    <WithLocalSvg
      width={width}
      height={height}
      asset={MainColorBtn_Clickable}></WithLocalSvg>
  );
};

export const Btn_NotClickableNextSvg = (width) => {
  let height = width * 0.22;
  return (
    <WithLocalSvg
      width={width}
      height={height}
      // fill="Black"
      asset={Btn_NotClickable}></WithLocalSvg>
  );
};

export const MainText_InvitationSvg = () => {
  return <WithLocalSvg asset={InvitationText_Main}></WithLocalSvg>;
};

export const SubText_InvitationSvg = () => {
  return <WithLocalSvg asset={InvitationText_Sub}></WithLocalSvg>;
};

export const ChangeProfileSvg = (
  <WithLocalSvg asset={ChangeProfile}></WithLocalSvg>
);
