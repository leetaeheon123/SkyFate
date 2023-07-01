import React, {useContext, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {SettingStyles} from '~/SettingStyles';
import {
  Btn_ClickableBack,
  Btn_Complete,
  Btn_ToggleOff,
} from 'component/General';
import {HeaderText_Setting} from 'component/Setting/SettingSvg';
import {RightArrowWhiteSvg} from 'component/General/GeneralSvg';
import styles from '~/ManToManBoard';
import {logout} from 'Screens/Map/map';
import {AppContext} from '^/Appcontext';
import {openWebView} from 'Screens/AgreementScreen';

const Setting = ({navigation, route}: any) => {
  const [notification, setNotification] = useState(false);
  const {UserData} = route.params;
  const Context = useContext(AppContext);
  const SendBird = Context.sendbird;

  const line = (
    <View
      style={{
        backgroundColor: '#DFE5F114',
        height: 1,
        width: '100%',
        marginTop: 15,
      }}></View>
  );

  const HelpOurs = () => {
    // console.log('StartChatingBetweenGirls In TwoMapScreen');
    let params = new SendBird.GroupChannelParams();

    // 추가로 고려할거 : 이미 채팅하기를 눌러 채팅방이 생성된 상태와 처음 채팅하기를 눌러서 채팅방이 생성되는 상황을 분기처리 하기
    let Member = ['8269apk@naver.com', UserData.UserEmail];
    let NickNames = ['상담원', UserData.NickName];

    params.addUserIds(Member);
    params.coverUrl = UserData.ProfileImageUrl;
    params.name = NickNames[0];
    params.operatorUserIds = Member;
    (params.isDistinct = true), (params.isPublic = false);

    SendBird.GroupChannel.createChannel(
      params,
      function (groupChannel: any, error: Error) {
        if (error) {
          // console.log(error.message);
          // Handle error.
        } else if (!error) {
          chat(groupChannel);
        }
      },
    );
  };

  const chat = (channel: any) => {
    navigation.navigate('CsChatScreen', {
      channel,
      UserData,
    });
  };

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
              navigation.goBack();
            }}
          />
        </View>
      </View>

      {/* <View>
        <Text style={SettingStyles.MainText}>푸시 알림</Text>
        <View
          style={[
            {
              // backgroundColor: 'red',
              width: '100%',
              justifyContent: 'space-between',
              marginTop: 18,
              height: 46,
            },
            styles.Row_OnlyColumnCenter,
          ]}>
          <View style={{marginLeft: 23}}>
            <Text style={SettingStyles.H2Text}>전체 알림 끄기</Text>
            <Text style={{marginTop: 2, color: '#B5BAC0'}}>
              위치, 채팅알림 전체를 끕니다.
            </Text>
          </View>
          <Btn_ToggleOff
            style={{marginRight: 17}}
            onPress={() => {
              console.log('toggle');
            }}
          />
        </View>
        {line}
      </View> */}

      <View>
        <Text style={SettingStyles.MainText}>개인정보 처리방침</Text>
        <View
          style={{
            width: '100%',
            // height: 72,
          }}>
          <TouchableOpacity
            onPress={() => openWebView('service', navigation)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              // height: 24,
              marginTop: 24,
              width: '100%',
            }}>
            <Text style={[SettingStyles.H2Text, {marginLeft: 23}]}>
              이용 약관
            </Text>
            {RightArrowWhiteSvg}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openWebView('privacy', navigation)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 24,
              marginTop: 18,
            }}>
            <Text style={[SettingStyles.H2Text, {marginLeft: 23}]}>
              개인정보 처리방침
            </Text>
            {RightArrowWhiteSvg}
          </TouchableOpacity>
        </View>
      </View>
      {line}

      <View>
        <Text style={SettingStyles.MainText}>회원 관리</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WithdrawalScreen', {
              logout: logout,
              UserEmail: UserData.UserEmail,
            });
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 18,
            width: '100%',
          }}>
          <Text style={[SettingStyles.H2Text, {marginLeft: 23}]}>
            회원 탈퇴
          </Text>
          {RightArrowWhiteSvg}
        </TouchableOpacity>
      </View>

      <View>
        <Text style={SettingStyles.MainText}>랑데부 학습시키기</Text>
        <TouchableOpacity
          onPress={() => HelpOurs()}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 18,
            width: '100%',
          }}>
          <Text style={[SettingStyles.H2Text, {marginLeft: 23}]}>
            랑데부를 도와주세요
          </Text>
          {RightArrowWhiteSvg}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          logout(navigation, SendBird);
        }}
        style={[
          styles.W100H100,
          {marginTop: 150, height: 24},
          styles.RowCenter,
        ]}>
        <Text style={SettingStyles.H2Text}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Setting;
