import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SettingStyles} from '~/SettingStyles';
import {
  Btn_ClickableBack,
  Btn_Complete,
  Btn_ToggleOff,
} from 'component/General';
import {HeaderText_Setting, ToggleOffSvg} from 'component/Setting/SettingSvg';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import {RightArrowWhiteSvg} from 'component/General/GeneralSvg';

function Setting({navigation, route}: any) {
  const [notification, setNotification] = useState(false);

  return (
    <SafeAreaView style={SettingStyles.Body}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
          marginHorizontal: 15,
        }}>
        <View>
          <Btn_ClickableBack width={14} onPress={() => navigation.goBack()} />
        </View>
        <View>{HeaderText_Setting()}</View>
        <View>
          <Btn_Complete
            width={30}
            onPress={() => {
              console.log('Complete');
            }}
          />
        </View>
      </View>
      <View style={{borderBottomWidth: 1, borderColor: '#DFE5F1'}}>
        <Text>푸시 알림</Text>
        <View>
          <Text style={[styles.textWhite]}>전체 알림 끄기</Text>
          <Text>위치, 채팅알림 전체를 끕니다.</Text>
        </View>
        <Btn_ToggleOff
          onPress={() => {
            console.log('toggle');
          }}
        />
      </View>
      <View style={{borderBottomWidth: 1, borderColor: '#DFE5F1'}}>
        <Text>개인정보 처리방침</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.textWhite]}>개인정보 처리방침</Text>
          <TouchableOpacity>{RightArrowWhiteSvg()}</TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.textWhite]}>이용 약관</Text>
          <TouchableOpacity>{RightArrowWhiteSvg()}</TouchableOpacity>
        </View>
      </View>
      <View style={{borderBottomWidth: 1, borderColor: '#DFE5F1'}}>
        <Text>회원 탈퇴</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.textWhite]}>회원 탈퇴</Text>
          <TouchableOpacity>{RightArrowWhiteSvg()}</TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textWhite: {
    color: 'white',
  },
});

export default Setting;
