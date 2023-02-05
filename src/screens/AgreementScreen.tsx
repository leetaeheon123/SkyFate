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

export type AgreementScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InvitationCodeSet'
>;

const AgreementScreen = ({navigation, route}: AgreementScreenProps) => {
  const AGREEMENT_LOCATION_URL =
    'https://zealous-jumpsuit-7f6.notion.site/844c74cb6068412a98b5afcc529ec7c2';
  const AGREEMENT_SERVICE_URL =
    'https://zealous-jumpsuit-7f6.notion.site/e746adc75467454f9a5364be8b90c93d';
  const AGREEMENT_PRIVACY_URL =
    'https://zealous-jumpsuit-7f6.notion.site/b0d186174c2f4db7adbc97b3c7f2b0ae';
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

  const handleBtn = () => {
    navigation.navigate('RegisterScreen');
  };

  const openWebView = (type: string) => {
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

  const ViewMore = (type: string) => {
    return (
      <Pressable
        style={{
          position: 'absolute',
          right: '5%',
        }}
        onPress={() => {
          openWebView(type);
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
          <View style={styles.checkboxContainer}>
            <Pressable
              style={{marginLeft: 20, marginRight: 10}}
              onPress={() => {
                setAllCheckBox(!all);
              }}>
              {all ? CheckBoxSvg2(24) : CheckBoxSvg(24)}
            </Pressable>
            {MainText_AgreementSvg()}
          </View>
          <View style={styles.checkboxContainer2}>
            <Pressable
              style={styles.checkboxBtn}
              onPress={() => {
                setService(!service);
              }}>
              {service ? CheckBoxSvg2(24) : CheckBoxSvg(24)}
            </Pressable>
            {MainText2_AgreementSvg()}
            {ViewMore('service')}
          </View>
          <View style={styles.checkboxContainer2}>
            <Pressable
              style={styles.checkboxBtn}
              onPress={() => {
                setPrivacy(!privacy);
              }}>
              {privacy ? CheckBoxSvg2(24) : CheckBoxSvg(24)}
            </Pressable>
            {MainText3_AgreementSvg()}
            {ViewMore('privacy')}
          </View>
          <View style={styles.checkboxContainer2}>
            <Pressable
              style={styles.checkboxBtn}
              onPress={() => {
                setLocation(!location);
              }}>
              {location ? CheckBoxSvg2(24) : CheckBoxSvg(24)}
            </Pressable>
            {MainText4_AgreementSvg()}
            {ViewMore('location')}
          </View>
        </View>
        <View style={styles.nextBtn}>
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

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 18,
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DEDEDE',
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
