import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LoginAndReigsterStyles} from '../../styles/LoginAndRegiser';
import {RootStackParamList} from './RootStackParamList';
// import CheckBox from '@react-native-community/checkbox';
import {
  CheckBoxSvg,
  CheckBoxSvg2,
  HRSvg,
  RightArrowSvg,
} from 'component/General/GeneralSvg';
import {
  MainHead_AgreementSvg,
  MainText2_AgreementSvg,
  MainText3_AgreementSvg,
  MainText4_AgreementSvg,
  MainText_AgreementSvg,
} from 'component/SignInUp/SignInUp';
import {Btn_ClickableNext, Btn_NotClickableNext} from 'component/Profile';
import {UpdateFbFirestore} from '^/Firebase';
import {Btn_ClickableBack} from 'component/General';

import styles from '~/ManToManBoard';
export type AgreementScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InvitationCodeSet'
>;
const AGREEMENT_LOCATION_URL =
  'https://zealous-jumpsuit-7f6.notion.site/3b9aafa60fbf469292a34e4f484f012b?pvs=4';
const AGREEMENT_SERVICE_URL =
  'https://zealous-jumpsuit-7f6.notion.site/d80d2747b9d2402d93a6a34998cb29b1?pvs=4';
const AGREEMENT_PRIVACY_URL =
  'https://zealous-jumpsuit-7f6.notion.site/ec3e13f513c34ae0b752ecd3080a65c5?pvs=4';
export const openWebView = (type: string, navigation: any) => {
  let uri = '';
  switch (type) {
    case 'service':
      uri = AGREEMENT_SERVICE_URL;
      break;
    case 'location':
      uri = AGREEMENT_LOCATION_URL;
      break;
    case 'privacy':
      uri = AGREEMENT_PRIVACY_URL;
      break;
  }

  navigation.navigate('WebViewScreen', {
    uri,
  });
};
const AgreementScreen = ({navigation, route}: AgreementScreenProps) => {
  const {UserUid} = route.params;

  const [all, setAll] = useState(false);
  const [service, setService] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [location, setLocation] = useState(false);

  const setAllCheckBox = (value: boolean) => {
    setAll(value);
    setService(value);
    setPrivacy(value);
    setLocation(value);
  };

  const handleBtn = async () => {
    await UpdateFbFirestore(`UserList`, UserUid, 'AgreementTermsofUse', true);
    await UpdateFbFirestore(
      `UserList`,
      UserUid,
      'AgreementGiveLocaitionData',
      true,
    );
    await UpdateFbFirestore(
      `UserList`,
      UserUid,
      'AgreementCollectionofpersonalinformation',
      true,
    );

    navigation.navigate('NickNameSelectScreen', {
      UserUid: UserUid,
      NickName: '',
    });
  };

  const ViewMore = (type: string) => {
    return (
      <Pressable
        style={[
          styles.RowCenter,
          {
            position: 'absolute',
            right: '0%',
            width: 50,
            height: 50,
          },
        ]}
        onPress={() => {
          openWebView(type, navigation);
        }}>
        {RightArrowSvg()}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <View style={LoginAndReigsterStyles.Description}>
          {MainHead_AgreementSvg()}
        </View>
        <View style={{marginTop: 80}}>
          <View style={[AgreementStyles.Line, {marginTop: 10}]} />
          <View style={AgreementStyles.checkboxContainer}>
            <Pressable
              style={{marginLeft: 20, marginRight: 10}}
              onPress={() => {
                setAllCheckBox(!all);
              }}>
              {all ? CheckBoxSvg2(24) : CheckBoxSvg(24)}
            </Pressable>
            {MainText_AgreementSvg()}
          </View>
          <View style={[AgreementStyles.Line, {marginBottom: 20}]} />

          <View style={AgreementStyles.checkboxContainer2}>
            <Pressable
              style={AgreementStyles.checkboxBtn}
              onPress={() => {
                setService(!service);
              }}>
              {service ? CheckBoxSvg2(24) : CheckBoxSvg(24)}
            </Pressable>
            {MainText2_AgreementSvg()}
            {ViewMore('service')}
          </View>
          <View style={AgreementStyles.checkboxContainer2}>
            <Pressable
              style={AgreementStyles.checkboxBtn}
              onPress={() => {
                setPrivacy(!privacy);
              }}>
              {privacy ? CheckBoxSvg2(24) : CheckBoxSvg(24)}
            </Pressable>
            {MainText3_AgreementSvg()}
            {ViewMore('privacy')}
          </View>
          <View style={AgreementStyles.checkboxContainer2}>
            <Pressable
              style={AgreementStyles.checkboxBtn}
              onPress={() => {
                setLocation(!location);
              }}>
              {location ? CheckBoxSvg2(24) : CheckBoxSvg(24)}
            </Pressable>
            {MainText4_AgreementSvg()}
            {ViewMore('location')}
          </View>
        </View>
        <View style={AgreementStyles.nextBtn}>
          {service && privacy && location ? (
            <Btn_ClickableNext
              onPress={() => {
                handleBtn();
              }}
            />
          ) : (
            <Btn_NotClickableNext />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const AgreementStyles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: '#DEDEDE',
  },
  Line: {
    backgroundColor: '#DEDEDE',
    width: '110%',
    right: '5%',
    height: 1,
  },
  checkboxContainer2: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
    marginStart: 20,
  },
  checkboxBtn: {
    marginRight: 10,
    marginVertical: 15,
  },
  nextBtn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '8%',
  },
});

export default AgreementScreen;
