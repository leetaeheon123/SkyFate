import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LoginAndReigsterStyles} from '../../styles/LoginAndRegiser';
import {RootStackParamList} from './RootStackParamList';
import CheckBox from '@react-native-community/checkbox';
import {
  AGREEMENT_LOCATION_URL,
  AGREEMENT_SERVICE_URL,
  AGREEMENT_PRIVACY_URL,
} from '@env';

export type AgreementScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InvitationCodeSet'
>;

const AgreementScreen = ({navigation, route}: AgreementScreenProps) => {
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

  const isAllChecked = (navigation) => {
    if (service && privacy && location) {
      navigation.navigate('RegisterScreen');
    } else {
      Alert.alert(
        '필수 이용약관에 동의하지 않는 경우, 서비스를 이용하실 수 없습니다.',
      );
    }
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
        onPress={() => {
          openWebView(type);
        }}>
        <Text style={{textDecorationLine: 'underline'}}>(더보기)</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={LoginAndReigsterStyles.Body}>
      <View style={LoginAndReigsterStyles.Main}>
        <View style={LoginAndReigsterStyles.Description}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: 'black',
            }}>
            서비스 이용약관에 동의해주세요
          </Text>
        </View>
        <View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={all}
              onValueChange={(value) => {
                setAllCheckBox(value);
              }}
            />
            <Text>아래 항목에 모두 동의합니다.</Text>
          </View>
          <View style={styles.checkboxContainer2}>
            <CheckBox value={service} onValueChange={setService} />
            <Text>(필수) 이용약관에 동의합니다.</Text>
            {ViewMore('service')}
          </View>
          <View style={styles.checkboxContainer2}>
            <CheckBox value={privacy} onValueChange={setPrivacy} />
            <Text>(필수) 개인정보 수집 및 이용에 동의합니다.</Text>
            {ViewMore('privacy')}
          </View>
          <View style={styles.checkboxContainer2}>
            <CheckBox value={location} onValueChange={setLocation} />
            <Text>(필수) 위치기반서비스 이용약관에 동의합니다.</Text>
            {ViewMore('location')}
          </View>
        </View>
        <View style={LoginAndReigsterStyles.CheckBox}>
          <Pressable
            style={LoginAndReigsterStyles.CheckBt}
            onPress={() => {
              isAllChecked(navigation);
            }}>
            <Text style={LoginAndReigsterStyles.CheckText}>다음</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  checkboxContainer2: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
    marginStart: 20,
  },
});

export default AgreementScreen;
